(function (window) {
    'use strict';

    function Ennemy(command, imageName, frameSize, hitboxSize, fly, resources) {
        this.id = command.id;

        // Energie du vaisseau
        this.life = command.life || this.defaultLife;

        // Vitesse du vaisseau
        this.speed = command.speed || this.defaultSpeed;

        this.moveLoop = null;

        Spaceship.call(this, command.x, command.y, imageName, frameSize, hitboxSize, fly, resources);
    }

    Ennemy.prototype = Object.create(Spaceship.prototype);

    Ennemy.prototype.clearCurrentMove = function () {
        if (this.moveLoop) {
            clearTimeout(this.moveLoop);
        }
    };

    Ennemy.prototype.move = function (path) {

        var sequence = Promise.resolve();

        path.forEach(function (coords) {
            sequence = sequence.then(function () {
                return new Promise(function (resolve) {
                    this.moveLoop = setTimeout(function () {
                        this.x = coords.x;
                        this.y = coords.y;
                        resolve();
                    }.bind(this), this.speed);
                }.bind(this));
            }.bind(this));
        }.bind(this));

        return sequence;
    };

    Ennemy.prototype.defaultLife = 3;
    Ennemy.prototype.defaultSpeed = 3;

    window.Ennemy = Ennemy;

})(window);
