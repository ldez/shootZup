(function (window) {
    'use strict';

    function EnnemiesManager(gameState, resources) {
        this.resources = resources;
        this.gameState = gameState;
        this.bullets = [];
        this.ennemies = {};
    }

    EnnemiesManager.prototype.paintEnnemies = function (context) {
        for (var id in this.ennemies) {
            if (this.ennemies.hasOwnProperty(id)) {
                this.ennemies[id].paint(context);
            }
        }
    };

    EnnemiesManager.prototype.paintBullets = function (context) {
        this.bullets.forEach(function (bullet) {
            bullet.paint(context);
        });
    };

    EnnemiesManager.prototype.reset = function () {
        this.bullets.splice(0, this.bullets.length);
        this.ennemies = {};
    };

    EnnemiesManager.prototype.loadScenario = function (file) {
        return new Promise(function (resolve) {

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", file, true);

            xmlhttp.onload = function () {
                resolve(JSON.parse(xmlhttp.responseText));
            };

            xmlhttp.send();
        });
    };

    EnnemiesManager.prototype.start = function (scenario) {

        var groupSequence = Promise.resolve();

        scenario.groups.forEach(function (group) {
            if (this.gameState.isGameOver()) {
                // arrete de gérer les groupes d'ennemies si le joueur est mort
                groupSequence = Promise.resolve();
            } else {
                groupSequence = groupSequence.then(function () {
                    return this.startGroup(group);
                }.bind(this));
            }
        }.bind(this));

        return groupSequence;
    };

    EnnemiesManager.prototype.startGroup = function (group) {

        var ships = [];

        group.ships.forEach(function (ship) {
            if (this.gameState.isPlaying()) {
                ships.push(this.startShip(ship));
            }
        }.bind(this));

        return Promise.all(ships);
    };

    EnnemiesManager.prototype.commandNew = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = new Ennemy(commands.id, commands.x, commands.y, this.resources);
            this.ennemies[commands.id] = ennemy;
            ennemy.startLoop(ennemy.FLY);
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.commandMove = function (commands) {
        var ennemy = this.ennemies[commands.id];
        // Si le vaisseau n'a pas explosé
        if (ennemy) {
            var path = this.getPath({
                x: ennemy.x,
                y: ennemy.y
            }, {
                x: commands.x,
                y: commands.y
            });
            return ennemy.action(path);
        } else {
            return new Promise(function (resolve) {
                resolve();
            });
        }
    };

    EnnemiesManager.prototype.commandShoot = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];
            // Si le vaisseau n'a pas explosé
            if (ennemy) {
                var bullet = new Bullet(commands.id, ennemy.x, ennemy.y, this.resources);
                var path = this.getPath({
                    x: bullet.x,
                    y: bullet.y
                }, {
                    x: commands.x,
                    y: commands.y
                });

                this.bullets.push(bullet);
                bullet.action(path).then(function (value) {
                    this.bullets.splice(this.bullets.indexOf(value), 1);
                }.bind(this));
            }
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.commandLeave = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];
            if (ennemy) { // Si le vaisseau n'a pas explosé
                delete this.ennemies[commands.id];
            }
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.startShip = function (ship) {
        var sequence = Promise.resolve();

        ship.forEach(function (commands) {
            if (commands.type === 'new') {
                sequence = sequence.then(function () {
                    return this.commandNew(commands);
                }.bind(this));
            } else if (commands.type === 'move') {
                sequence = sequence.then(function () {
                    return this.commandMove(commands);
                }.bind(this));
            } else if (commands.type === 'shoot') {
                sequence = sequence.then(function () {
                    return this.commandShoot(commands);
                }.bind(this));

            } else if (commands.type === 'leave') {
                sequence = sequence.then(function () {
                    return this.commandLeave(commands);
                }.bind(this));
            }
        }.bind(this));

        return sequence;
    };

    EnnemiesManager.prototype.getPath = function (from, to) { // Bresenham algo
        var coordinates = [];

        var dx = Math.abs(to.x - from.x),
            sx = from.x < to.x ? 1 : -1;
        var dy = Math.abs(to.y - from.y),
            sy = from.y < to.y ? 1 : -1;
        var err = (dx > dy ? dx : -dy) / 2;

        // TODO revoir cette condition avec le if
        while (true) {
            coordinates.push({
                x: from.x,
                y: from.y
            });
            if (from.x === to.x && from.y === to.y) {
                break;
            }
            var e2 = err;
            if (e2 > -dx) {
                err -= dy;
                from.x += sx;
            }
            if (e2 < dy) {
                err += dx;
                from.y += sy;
            }
        }

        return coordinates;
    };

    window.EnnemiesManager = EnnemiesManager;

})(window);
