(function (window) {
    'use strict';

    function Bullet(id, x, y, resources) {

        this.resources = resources;
        this.id = id;

        // Positions
        this.x = x;
        this.y = y;

        // Taille en pixels d'une frame d'animation
        this.animationFrameWidth = 6;
        this.animationFrameHeight = 6;
    }

    Bullet.prototype.action = function (path) {

        var sequence = Promise.resolve();

        path.forEach(function (coords) {
            sequence = sequence.then(function () {
                return new Promise(function (resolve, reject) {
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

        context.drawImage(this.resources.images['bullet'],
            0,
            0,
            this.animationFrameWidth,
            this.animationFrameHeight,
            this.x - (this.animationFrameWidth / 2), // centrage de l'image par rapport à la position
            this.y - this.animationFrameHeight + (this.animationFrameHeight / 2), // centrage de l'image par rapport à la position
            this.animationFrameWidth,
            this.animationFrameHeight
        );
    };

    window.Bullet = Bullet;

})(window);
