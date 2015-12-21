(function (window) {
    'use strict';

    function Ennemy(command, imageName, frameSize, hitboxSize, fly, resources) {
        this.id = command.id;

        // Energie du vaisseau
        this.life = command.life || this.defaultLife;

        // Vitesse du vaisseau
        this.speed = command.speed || this.defaultSpeed;

        Spaceship.call(this, command.x, command.y, imageName, frameSize, hitboxSize, fly, resources);
    }

    Ennemy.prototype = Object.create(Spaceship.prototype);

    Ennemy.prototype.type = 'ENNEMY';

    Ennemy.prototype.defaultLife = 3;
    Ennemy.prototype.defaultSpeed = 3;

    window.Ennemy = Ennemy;

})(window);
