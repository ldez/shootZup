(function (window) {
    'use strict';

    function PlayerFactory(resources, physics) {
        this.resources = resources;
        this.physics = physics;
    }

    PlayerFactory.prototype.create = function () {
        return new SpaceshipRed(this.physics.canvasWidth / 2, 600, this.resources);
    };

    window.PlayerFactory = PlayerFactory;

})(window);
