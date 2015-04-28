(function (window) {
    'use strict';

    function Ennemy(id, x, y, resources) {
        this.resources = resources;

        this.id = id;

        // Energie du vaisseau
        this.life = 3;

        // Taille en pixels d'une frame d'animation
        var frameSize = {
                width: 35,
                height: 37
            },
            // Taille en pixels de la hitbox
            hitboxSize = {
                width: frameSize.width,
                height: frameSize.height
            },
            // paramètre de l'animation
            fly = {
                nbFrames: 6,
                animationFrameWidth: 35,
                animationY: 0,
                speedRate: 15
            };

        Spaceship.call(this, x, y, 'spaceship-green', frameSize, hitboxSize, fly, resources);
    }

    Ennemy.prototype = Object.create(Spaceship.prototype);

    Ennemy.prototype.action = function (path) {

        var sequence = Promise.resolve();

        path.forEach(function (coords) {
            sequence = sequence.then(function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        this.x = coords.x;
                        this.y = coords.y;
                        resolve();
                    }.bind(this), 3);
                }.bind(this));
            }.bind(this));
        }.bind(this));

        return sequence;
    };

    window.Ennemy = Ennemy;

})(window);
