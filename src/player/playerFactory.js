(function (window) {
    'use strict';

    function PlayerFactory(resources) {
        this.resources = resources;
    }

    PlayerFactory.prototype.create = function () {
        return new SpaceshipRed(this.resources);
    };

    window.PlayerFactory = PlayerFactory;

})(window);
