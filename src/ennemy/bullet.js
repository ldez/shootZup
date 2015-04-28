(function (window) {
    'use strict';

    function Bullet(id, x, y, resources) {

        this.resources = resources;

        this.id = id;

        // Positions
        this.x = x;
        this.y = y;

        // Taille en pixels d'une frame d'animation
        this.frameSize = {
            width: 6,
            height: 6
        };
    }

    Bullet.prototype.action = function (path) {

        var sequence = Promise.resolve();

        path.forEach(function (coords) {
            sequence = sequence.then(function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        this.x = coords.x;
                        this.y = coords.y;
                        resolve(this);
                    }.bind(this), 5);
                }.bind(this));
            }.bind(this));
        }.bind(this));

        return sequence;
    };

    Bullet.prototype.paint = function (context) {

        context.drawImage(this.resources.images.bullet,
            0, 0,
            this.frameSize.width, this.frameSize.height,
            // centrage de l'image par rapport à la position
            this.x - (this.frameSize.width / 2), this.y - this.frameSize.height + (this.frameSize.height / 2),
            this.frameSize.width, this.frameSize.height
        );
    };

    Bullet.prototype.hitbox = function () {
        return new RectangleRightHitBox(this, this.frameSize.width, this.frameSize.height);
    };

    window.Bullet = Bullet;

})(window);
