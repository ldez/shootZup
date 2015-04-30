(function (window) {
    'use strict';

    /**
     * Moteur de physique
     *
     * @param {Object} explosionManager Gestionnaire d'explosions
     * @param {Object} canvasSize       Taille du canvas
     */
    function Physics(explosionManager, canvasSize) {
        this.explosionManager = explosionManager;
        this.canvasSize = canvasSize;
        this.moveSize = 10;
    }

    Physics.prototype.canMoveLeft = function (spaceship) {
        return spaceship.x >= 0 + this.moveSize + (spaceship.frameSize.width / 2);
    };

    Physics.prototype.moveLeft = function (spaceship) {
        if (this.canMoveLeft(spaceship)) {
            spaceship.x -= this.moveSize;
        }
    };

    Physics.prototype.canMoveRight = function (spaceship) {
        return spaceship.x <= this.canvasSize.width - this.moveSize - (spaceship.frameSize.width / 2);
    };

    Physics.prototype.moveRight = function (spaceship) {
        if (this.canMoveRight(spaceship)) {
            spaceship.x += this.moveSize;
        }
    };

    Physics.prototype.canMoveUp = function (spaceship) {
        return spaceship.y >= 0 + this.moveSize + (spaceship.frameSize.height / 2);
    };

    Physics.prototype.moveUp = function (spaceship) {
        if (this.canMoveUp(spaceship)) {
            spaceship.y -= this.moveSize;
        }
    };

    Physics.prototype.canMoveDown = function (spaceship) {
        return spaceship.y <= this.canvasSize.height - this.moveSize - (spaceship.frameSize.height / 2);
    };

    Physics.prototype.moveDown = function (spaceship) {
        if (this.canMoveDown(spaceship)) {
            spaceship.y += this.moveSize;
        }
    };

    Physics.prototype.detectCollisionOnEnnemies = function (ennemies, playersLasers) {

        var ennemiesToDelete = [];
        var lasersToDelete = [];
        var score = 0;

        for (var id in ennemies) {
            if (ennemies.hasOwnProperty(id)) {
                var ennemy = ennemies[id];

                for (var j = 0; j < playersLasers.length; j++) {
                    var laser = playersLasers[j];

                    // collisions basées sur boites englobantes
                    if (ennemy.hitbox().collision(laser.hitbox())) {

                        // Calcul du dommage
                        ennemy.life -= laser.strength;

                        // Ennemy mort
                        if (ennemy.life <= 0 && ennemiesToDelete.indexOf(ennemy) === -1) {
                            // Pour éviter de supprimer 2 fois le même (2 lasers peuvent être en même temps en collision sur un vaisseau)
                            ennemiesToDelete.push(ennemy);
                        }

                        lasersToDelete.push(laser);
                    }
                }

                for (var i = 0; i < lasersToDelete.length; i++) {
                    var laserIndex = playersLasers.indexOf(lasersToDelete[i]);
                    playersLasers.splice(laserIndex, 1);
                }
            }

        }

        this.ennemyDeath(ennemies, ennemiesToDelete);

        return score + 10 * ennemiesToDelete.length;
    };

    Physics.prototype.detectCollisionsOnPlayer = function (player, bullets, ennemies) {

        var collision = false;

        // collision avec les bullets
        var bulletsToDelete = [];
        bullets.forEach(function (bullet) {

            // collisions basées sur boites englobantes
            if (player.hitbox().collision(bullet.hitbox())) {
                collision = true;
                bulletsToDelete.push(bullet);
            }

        });

        for (var i = 0; i < bulletsToDelete.length; i++) {
            delete bullets[bulletsToDelete[i].id];
        }

        // collision avec les ennemies
        if (!collision) {

            var ennemiesToDelete = [];
            for (var id in ennemies) {
                if (ennemies.hasOwnProperty(id)) {
                    var ennemy = ennemies[id];
                    if (player.hitbox().collision(ennemy.hitbox())) {
                        collision = true;
                        ennemiesToDelete.push(ennemy);
                    }
                }
            }

            this.ennemyDeath(ennemies, ennemiesToDelete);
        }

        return collision;
    };

    Physics.prototype.ennemyDeath = function (ennemies, ennemiesToDelete) {
        for (var i = 0; i < ennemiesToDelete.length; i++) {
            var ennemieToDelete = ennemiesToDelete[i];
            delete ennemies[ennemieToDelete.id];
            this.explosionManager.exploded(ennemieToDelete.x, ennemieToDelete.y);
        }
    };

    window.Physics = Physics;

})(window);
