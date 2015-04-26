(function (window) {
    'use strict';

    function Physics(resources) {

        this.resources = resources;

        this.canvasWidth = 480;
        this.canvasHeight = 640;

        this.moveSize = 10;

        // Positions du vaisseau.
        this.x = 200;
        this.y = 600;
    }

    Physics.prototype.canMoveLeft = function (spaceship) {
        return this.x >= 0 + this.moveSize + (spaceship.animationFrameWidth / 2);
    };

    Physics.prototype.canMoveRight = function (spaceship) {
        return this.x <= this.canvasWidth - this.moveSize - (spaceship.animationFrameWidth / 2);
    };

    Physics.prototype.canMoveUp = function (spaceship) {
        return this.y >= 0 + this.moveSize + (spaceship.animationFrameHeight / 2);
    };

    Physics.prototype.canMoveDown = function (spaceship) {
        return this.y <= this.canvasHeight - this.moveSize - (spaceship.animationFrameHeight / 2);
    };

    Physics.prototype.detectCollisionOnEnnemies = function (ennemies, playersLasers, exploding) {

        var ennemiesToDelete = [];
        var lasersToDelete = [];
        var score = 0;

        for (var id in ennemies) {
            if (ennemies.hasOwnProperty(id)) {
                var ennemy = ennemies[id];
                var minX = ennemy.x - ennemy.animationFrameWidth / 2;
                var maxX = ennemy.x + ennemy.animationFrameWidth / 2;
                var minY = ennemy.y - ennemy.animationFrameHeight / 2;
                var maxY = ennemy.y + ennemy.animationFrameHeight / 2;

                for (var j = 0; j < playersLasers.length; j++) {
                    var laser = playersLasers[j];
                    var laserMinX = laser.x;
                    var laserMaxX = laser.x + laser.frameWidth;
                    var laserMinY = laser.y - laser.frameHeight;
                    var laserMaxY = laser.y;

                    // collisions basées sur boites englobantes
                    if (minX < laserMaxX &&
                        maxX > laserMinX &&
                        minY < laserMaxY &&
                        maxY > laserMinY) {

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
            delete ennemies[ennemiesToDelete[i].id];
            score += 10;

            var explosion = new Explosion(ennemiesToDelete[i].x, ennemiesToDelete[i].y, this.resources);
            exploding.push(explosion);
            explosion.startOnce(explosion.BOOM, function () {
                exploding.splice(exploding.indexOf(explosion), 1);
            });
        }

        return score;
    };

    Physics.prototype.detectCollisionsOnPlayer = function (playerX, playerY, playerSprite, bullets) {
        var minX = playerX - playerSprite.hitboxWidth / 2;
        var maxX = playerX + playerSprite.hitboxWidth / 2;
        var minY = playerY - playerSprite.hitboxHeight / 2;
        var maxY = playerY + playerSprite.hitboxHeight / 2;

        var bulletsToDelete = [];

        bullets.forEach(function (bullet) {
            var bulletMinX = bullet.x;
            var bulletMaxX = bullet.x + bullet.animationFrameWidth;
            var bulletMinY = bullet.y - bullet.animationFrameHeight;
            var bulletMaxY = bullet.y;

            // collisions basées sur boites englobantes
            if (minX < bulletMaxX &&
                maxX > bulletMinX &&
                minY < bulletMaxY &&
                maxY > bulletMinY) {

                bulletsToDelete.push(bullet);
            }
        });

        if (bulletsToDelete.length > 0) {
            for (var i = 0; i < bulletsToDelete.length; i++) {
                delete bullets[bulletsToDelete[i].id];
            }
            return true;
        }
    };

    window.Physics = Physics;

})(window);
