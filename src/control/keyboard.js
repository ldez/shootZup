(function (window, document) {
    'use strict';

    function Keyboard(mapping) {
        this.keys = mapping || this.defaultMapping;

        this.actions = {};

        this.currentOnKeyDownListener = null;
        this.currentOnKeyUpListener = null;
    }

    Keyboard.prototype.defaultMapping = {
        // Space
        SHOOT: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        // Enter
        START: 13,
    };

    Keyboard.prototype.startDetection = function () {
        this.detection(this.onKeyDownListenerGame.bind(this), this.onKeyUpListenerGame.bind(this));
    };

    Keyboard.prototype.stopDetection = function () {
        this.detection();
    };


    Keyboard.prototype.detection = function (onKeyDownListener, onKeyUpListener) {

        document.removeEventListener('keydown', this.currentOnKeyDownListener);
        this.currentOnKeyDownListener = null;
        if (onKeyDownListener) {
            this.currentOnKeyDownListener = onKeyDownListener;
            document.addEventListener('keydown', this.currentOnKeyDownListener);
        }

        document.removeEventListener('keyup', this.currentOnKeyUpListener);
        this.currentOnKeyUpListener = null;
        if (onKeyUpListener) {
            this.currentOnKeyUpListener = onKeyUpListener;
            document.addEventListener('keyup', this.currentOnKeyUpListener);
        }
    };


    Keyboard.prototype.onKeyDownListenerGame = function (event) {
        this.keyControl(event, true);
    };

    Keyboard.prototype.onKeyUpListenerGame = function (event) {
        this.keyControl(event, false);
    };

    Keyboard.prototype.keyControl = function (event, state) {

        if (event.keyCode === this.keys.LEFT) {
            this.actions.LEFT = state;
        } else if (event.keyCode === this.keys.RIGHT) {
            this.actions.RIGHT = state;
        }

        if (event.keyCode === this.keys.UP) {
            this.actions.UP = state;
        } else if (event.keyCode === this.keys.DOWN) {
            this.actions.DOWN = state;
        }

        if (event.keyCode === this.keys.SHOOT) {
            this.actions.SHOOT = state;
        }

        if (event.keyCode === this.keys.START) {
            this.actions.START = state;
        }
    };

    window.Keyboard = Keyboard;

})(window, document);
