(function (window) {
    'use strict';

    function GamepadChecker() {
        this.requestAnimationFrameId = null;
        this.gamepads = [];

        if (!this.supportAvailable()) {
            console.error('API GamePad not supportted by this brower.');
        }
    }

    /**
     * Donne l'ensemble des gamepads disponibles
     *
     * @returns {Array} Retourne un tableau des gamepads disponibles
     */
    GamepadChecker.prototype.getGamepads = function () {
        return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    };


    /**
     * Detection du support du gamepad par le browser
     *
     * @returns {Boolean} Retourne 'true' si le browser supporte le gamepad
     */
    GamepadChecker.prototype.supportAvailable = function () {
        return !!navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
    };

    /**
     * Ajoute les listeners de detection de l'ajout/retrait de gamepad et démarre la detection des controles touchés
     */
    GamepadChecker.prototype.detection = function () {

        window.addEventListener("gamepadconnected", function connectedListener(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

            this.gamepads.push(e.gamepad);
        }.bind(this));

        window.addEventListener("gamepaddisconnected", function disconnectedListener(e) {
            console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);

            this.gamepads = this.gamepads.filter(function (gamepad) {
                return e.gamepad.id !== gamepad.id;
            });
        }.bind(this));

        this.findGamepadsControls();
    };

    /**
     * Boucle de detection des controles touchés
     */
    GamepadChecker.prototype.findGamepadsControls = function () {

        this.gamepads.forEach(function (gamepad) {
            this.findGamepadControls(gamepad);
        }.bind(this));

        this.requestAnimationFrameId = window.requestAnimationFrame(this.forcedDetection.bind(this));
    };

    /**
     * Trouve les controles touchés
     *
     * @param {Object} gamepad Gamepad
     */
    GamepadChecker.prototype.findGamepadControls = function (gamepad) {

        gamepad.buttons.forEach(function (button, index) {
            if (button.pressed || Math.abs(button.value) > 0.1) {
                console.log('Button n°%s', index, button);
            }
        });
        gamepad.axes.forEach(function (axe, index) {
            if (Math.abs(axe) > 0.1) {
                console.log('Axe n°%s', index, axe);
            }
        });
    };

    /**
     * Boucle de détection forcée
     */
    GamepadChecker.prototype.forcedDetection = function () {

        if (typeof this.gamepads === 'object') {
            var browserGamepad = this.getGamepads();
            this.gamepads = [];
            for (var index in browserGamepad) {
                if (browserGamepad.hasOwnProperty(index) && browserGamepad[index] && typeof browserGamepad[index] === 'object') {
                    console.log('browserGamepad[index]', browserGamepad[index]);
                    this.gamepads.push(browserGamepad[index]);
                }
            }
        }

        this.gamepads.forEach(function (gamepad) {
            this.findGamepadControls(gamepad);
        }.bind(this));

        // utilisation de 'setTimeOut' au lieu de 'window.requestAnimationFrame' pour ralentir la log et faciler le debug
        this.requestAnimationFrameId = setTimeout(function () {
            this.forcedDetection();
        }.bind(this), 3000);
    };

    /**
     * Stop la boucle de détection forcée
     */
    GamepadChecker.prototype.cancelForcedDetection = function () {
        if (this.requestAnimationFrameId) {
            clearTimeout(this.requestAnimationFrameId);
        }
    };

    window.GamepadChecker = GamepadChecker;

})(window);
