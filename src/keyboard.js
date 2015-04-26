(function (window, document) {
    'use strict';

    function Keyboard(mapping) {
        this.startDetection();
        this.keys = mapping || this.defaultMapping;
        this.actions = {};
    }

    Keyboard.prototype.defaultMapping = {
        // Space
        SHOOT : 32,
        LEFT : 37,
        UP : 38,
        RIGHT : 39,
        DOWN : 40,
        // Enter
        START : 13,
    };

    Keyboard.prototype.startDetection = function () {

        document.onkeydown = function (event) {
            this.keyControl(event, true);
        }.bind(this);

        document.onkeyup = function (event) {
            this.keyControl(event, false);
        }.bind(this);

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
