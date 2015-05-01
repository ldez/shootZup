(function (window) {
    'use strict';

    function LasersManager(resources, canvasSize, audioManager) {
        this.resources = resources;
        this.canvasSize = canvasSize;
        this.audioManager = audioManager;
        this.lasers = [];
    }

    LasersManager.prototype.move = function () {
        this.lasers = this.lasers.filter(function (laser) {
            return !laser.move(this.canvasSize.height);
        }.bind(this));
    };

    LasersManager.prototype.shoot = function (player) {
        // création de 2 lasers
        this.lasers.push(new Laser(player.x - 10, player.y - 50, this.resources));
        this.lasers.push(new Laser(player.x + 10, player.y - 50, this.resources));
        this.audioManager.laser();
    };

    LasersManager.prototype.paint = function (context) {
        this.lasers.forEach(function (laser) {
            laser.paint(context);
        });
    };

    LasersManager.prototype.reset = function () {
        this.lasers.splice(0, this.lasers.length);
    };

    window.LasersManager = LasersManager;

})(window);
