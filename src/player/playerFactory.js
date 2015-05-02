(function (window) {
    'use strict';

    function PlayerFactory(resources, canvasSize) {
        this.resources = resources;
        this.canvasSize = canvasSize;
    }

    PlayerFactory.prototype.create = function () {

        var spaceship;
        var number = this.getRandomInt(1, 3);

        switch (number) {
        case 1:
            spaceship = new SpaceshipRed(this.canvasSize.width / 2, this.canvasSize.height - 60, this.resources);
            break;
        case 2:
            spaceship = new SpaceshipGreen(this.canvasSize.width / 2, this.canvasSize.height - 60, this.resources);
            break;
        case 3:
            spaceship = new SpaceshipBlue(this.canvasSize.width / 2, this.canvasSize.height - 60, this.resources);
            break;
        default:
            throw new Error('Invalid Spaceship choose');
        }

        return spaceship;
    };

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    PlayerFactory.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    window.PlayerFactory = PlayerFactory;

})(window);
