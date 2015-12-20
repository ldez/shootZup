(function (window, navigator) {
    'use strict';

    /**
     * GamePad
     *
     * https://w3c.github.io/gamepad/gamepad.html#dictionary-gamepadeventinit-members
     *
     * @param {Object} mapping Mapping des buttons et controles
     */
    function Gamepad(mapping) {

        this.mapping = mapping || this.defaultMapping;
        this.requestAnimationFrameId = null;
        this.gamepads = [];
        this.ticking = false;

        // Etat de chaques actions du gamepad
        this.actions = {};

        this.lastActions = {
            direction: {
                horizontal: null,
                vertical: null
            },
            button: {}
        };

        this.dirtyChrome = this.isFuckingChrome();

        this.currentGamepadConnectedListener = null;
        this.currentGamepadDisconnectedListener = null;
    }

    /**
     * Mapping par défault du Gamepad [Standard Gamepad]
     */
    Gamepad.prototype.defaultMapping = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        LEFT_TOP_SHOULDER: 4,
        LEFT_BOOTOM_SHOULDER: 6,
        RIGHT_TOP_SHOULDER: 5,
        RIGHT_BOOTOM_SHOULDER: 7,
        SELECT: 8,
        START: 9,
        LEFT_STICK_BTN: 10,
        RIGHT_STICK_BTN: 11,
        UP: 12,
        DOWN: 13,
        LEFT: 14,
        RIGHT: 15,
        EXTRA: 16
    };

    /**
     * Detection du support du gamepad par le browser
     *
     * @returns {Boolean} Retourne 'true' si le browser supporte le gamepad
     */
    Gamepad.prototype.supportAvailable = function () {
        return !!navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
    };

    /**
     * Démarrage de la détection du Gamepad et de ces commandes
     */
    Gamepad.prototype.startDetection = function () {
        if (!this.supportAvailable()) {
            console.error('Aucun support de la manette');
        } else {
            // Démarre la detection du gamepad
            this.detection(true);

            // Lance la detection des buttons et controles
            if (!this.ticking) {
                this.ticking = true;
                this.tick();
            }
        }
    };

    /**
     * Ajoute les listeners de detection de l'ajout/retrait de gamepad
     */
    Gamepad.prototype.detection = function (start) {

        // remove currents listeners
        window.removeEventListener('gamepadconnected', this.currentGamepadConnectedListener);
        window.removeEventListener('gamepaddisconnected', this.currentGamepadDisconnectedListener);
        this.currentGamepadConnectedListener = null;
        this.currentGamepadDisconnectedListener = null;

        if (start) {
            // build currents listeners
            this.currentGamepadConnectedListener = this.gamepadConnectedListener.bind(this);
            this.currentGamepadDisconnectedListener = this.gamepadDisconnectedListener.bind(this);

            // add listeners
            window.addEventListener('gamepadconnected', this.currentGamepadConnectedListener);
            window.addEventListener('gamepaddisconnected', this.currentGamepadDisconnectedListener);
        }
    };

    /**
     * Listeners de detection de l'ajout de gamepad
     */
    Gamepad.prototype.gamepadConnectedListener = function (e) {
        console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
            e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

        this.gamepads.push(e.gamepad);
    };

    /**
     * Listeners de detection du retrait de gamepad
     */
    Gamepad.prototype.gamepadDisconnectedListener = function disconnectedListener(e) {
        console.log('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id);

        this.gamepads = this.gamepads.filter(function (gamepad) {
            return e.gamepad.id !== gamepad.id;
        });
    };

    /**
     * Arrêt de la détection du Gamepad
     */
    Gamepad.prototype.stopDetection = function () {

        // supprime les listeners
        this.detection();

        // arret du tracking des controles du gamepadd
        if (this.requestAnimationFrameId) {
            window.cancelAnimationFrame(this.requestAnimationFrameId);
        }
    };

    /**
     * Boucle de détection
     */
    Gamepad.prototype.tick = function () {
        this.pollStatus();
        this.requestAnimationFrameId = window.requestAnimationFrame(this.tick.bind(this));
    };

    /**
     * Donne l'ensemble des gamepads disponibles
     *
     * @returns {Array} Retourne un tableau des gamepads disponibles
     */
    Gamepad.prototype.getGamepads = function () {
        return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    };

    /**
     * Dectection des buttons et controles
     */
    Gamepad.prototype.pollStatus = function () {

        // Uniquement pour Chrome forcage de la détection des gamepads
        if (this.dirtyChrome) {
            this.webkitGamepadDetection();
        }

        this.gamepads.forEach(function (gamepad) {

            var btnSTART = gamepad.buttons[this.mapping.START];
            if (btnSTART.pressed && btnSTART.value > 0.5) {
                this.actions.START = true;
            } else {
                this.actions.START = false;
            }

            var btnA = gamepad.buttons[this.mapping.A];
            if (btnA.pressed && btnA.value > 0.5) {
                this.actions.A = true;
            } else {
                this.actions.A = false;
            }
            this.actions.SHOOT = this.actions.A;

            var btnB = gamepad.buttons[this.mapping.B];
            if (btnB.pressed && btnB.value > 0.5) {
                this.actions.B = true;
            } else {
                this.actions.B = false;
            }

            // Chrome de merde ne respecte pas la norme
            if (this.dirtyChrome) {
                this.webkitDPad(gamepad);
            } else {
                var btnLEFT = gamepad.buttons[this.mapping.LEFT];
                if (btnLEFT.pressed && btnLEFT.value > 0.5) {
                    this.actions.LEFT = true;
                } else {
                    this.actions.LEFT = false;
                }

                var btnRIGHT = gamepad.buttons[this.mapping.RIGHT];
                if (btnRIGHT.pressed && btnRIGHT.value > 0.5) {
                    this.actions.RIGHT = true;
                } else {
                    this.actions.RIGHT = false;
                }

                var btnDOWN = gamepad.buttons[this.mapping.DOWN];
                if (btnDOWN.pressed && btnDOWN.value > 0.5) {
                    this.actions.DOWN = true;
                } else {
                    this.actions.DOWN = false;
                }

                var btnUP = gamepad.buttons[this.mapping.UP];
                if (btnUP.pressed && btnUP.value > 0.5) {
                    this.actions.UP = true;
                } else {
                    this.actions.UP = false;
                }
            }

        }.bind(this));
    };

    /**
     * Detection de Chrome de merde
     * Chrome de merde ne respecte pas la norme GamePad API
     *
     * @returns {Boolean} Retourne vrai si c'est un navigateur de merde
     */
    Gamepad.prototype.isFuckingChrome = function () {
        return navigator.userAgent.search(/.*Chrome.*/gi) === 0;
    };

    /**
     * Remappage du D-Pad car Chrome ne prends pas en charge de D-Pad
     *
     * @param {Object} gamepad GamePad object
     */
    Gamepad.prototype.webkitDPad = function (gamepad) {

        var axeX = gamepad.axes[0];
        var axeY = gamepad.axes[1];

        if (axeX < -0.5) {
            this.actions.LEFT = true;
        } else {
            this.actions.LEFT = false;
        }

        if (axeX > 0.5) {
            this.actions.RIGHT = true;
        } else {
            this.actions.RIGHT = false;
        }

        if (axeY > 0.5) {
            this.actions.DOWN = true;
        } else {
            this.actions.DOWN = false;
        }

        if (axeY < -0.5) {
            this.actions.UP = true;
        } else {
            this.actions.UP = false;
        }
    };

    /**
     * Detection forcée des GamePads uniquement pour Chrome de merde
     */
    Gamepad.prototype.webkitGamepadDetection = function () {
        if (this.gamepads) {
            var browserGamepad = this.getGamepads();
            this.gamepads = [];
            for (var index in browserGamepad) {
                if (browserGamepad.hasOwnProperty(index) && browserGamepad[index] && typeof browserGamepad[index] === 'object') {
                    this.gamepads.push(browserGamepad[index]);
                }
            }
        }
    };

    window.Gamepad = Gamepad;

})(window, navigator);
