(function (window) {
    'use strict';

    function Laser(x, y, resources) {
        this.resources = resources;

        // Taille en pixels d'une frame d'animation
        this.x = x;
        this.y = y;

        this.frameSize = {
            width: 3,
            height: 32
        };

        this.canvasHeight = 640;
    }

    Laser.prototype.paint = function (context) {
        context.drawImage(this.resources.images.laser, this.x, this.y - this.frameSize.height);
    };

    Laser.prototype.move = function () {
        this.y -= this.frameSize.height + 10;
    };

    Laser.prototype.isOutOfBounds = function () {
        return this.y > this.canvasHeight;
    };

    Laser.prototype.hitbox = function () {
        return new RectangleRightHitBox(this, this.frameSize.width, this.frameSize.height);
    };

    window.Laser = Laser;

})(window);
