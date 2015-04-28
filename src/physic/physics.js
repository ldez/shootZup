(function (window) {
    'use strict';

    /**
     * Moteur de physique
     *
     * @param {Object} explosionManager Gestionnaire d'explosions
     * @param {Object} bulletsManager   Gestionnaire des bullets
     */
    function Physics(explosionManager, bulletsManager) {

        this.explosionManager = explosionManager;
        this.bulletsManager = bulletsManager;

        this.canvasWidth = 480;
        this.canvasHeight = 640;

        this.moveSize = 10;

        // Positions du vaisseau.
        this.reset();
    }

    Physics.prototype.reset = function () {
        this.x = this.canvasWidth / 2;
        this.y = 600;
    };

    Physics.prototype.canMoveLeft = function (spaceship) {
        return spaceship.x >= 0 + this.moveSize + (spaceship.animationFrameWidth / 2);
    };

    Physics.prototype.canMoveRight = function (spaceship) {
        return spaceship.x <= this.canvasWidth - this.moveSize - (spaceship.animationFrameWidth / 2);
    };

    Physics.prototype.canMoveUp = function (spaceship) {
        return spaceship.y >= 0 + this.moveSize + (spaceship.animationFrameHeight / 2);
    };

    Physics.prototype.canMoveDown = function (spaceship) {
        return spaceship.y <= this.canvasHeight - this.moveSize - (spaceship.animationFrameHeight / 2);
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

                        ennemy.life--;
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

        for (var i = 0; i < ennemiesToDelete.length; i++) {
            var ennemieToDelete = ennemiesToDelete[i];
            delete ennemies[ennemieToDelete.id];
            score += 10;

            this.explosionManager.exploded(ennemieToDelete.x, ennemieToDelete.y);
        }

        return score;
    };

    Physics.prototype.detectCollisionsOnPlayer = function (player) {

        var bulletsToDelete = [];
        var collision = false;

        this.bulletsManager.bullets.forEach(function (bullet) {

            // collisions basées sur boites englobantes
            if (player.hitbox().collision(bullet.hitbox())) {
                collision = true;
                bulletsToDelete.push(bullet);
            }

        });

        for (var i = 0; i < bulletsToDelete.length; i++) {
            delete this.bulletsManager.bullets[bulletsToDelete[i].id];
        }

        return collision;
    };

    window.Physics = Physics;

})(window);
