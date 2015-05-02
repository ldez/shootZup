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

        this.strength = 1;
        this.moveSize = 10;
    }

    Laser.prototype.paint = function (context) {
        context.drawImage(this.resources.images.laser, this.x, this.y - this.frameSize.height);
    };

    Laser.prototype.move = function (canvasHeight) {
        this.y -= this.frameSize.height + this.moveSize;

        return this.isOutOfBounds(canvasHeight);
    };

    Laser.prototype.isOutOfBounds = function (canvasHeight) {
        return this.y > canvasHeight || this.y < 0;
    };

    Laser.prototype.hitbox = function () {
        return new RectangleRightHitBox(this, this.frameSize.width, this.frameSize.height);
    };

    window.Laser = Laser;

})(window);
