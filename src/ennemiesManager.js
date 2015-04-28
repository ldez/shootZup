(function (window) {
    'use strict';

    function EnnemiesManager(gameState, resources, pathManager, bulletsManager) {
        this.resources = resources;
        this.gameState = gameState;
        this.pathManager = pathManager;
        this.bulletsManager = bulletsManager;
        this.ennemies = {};
    }

    EnnemiesManager.prototype.paint = function (context) {
        for (var id in this.ennemies) {
            if (this.ennemies.hasOwnProperty(id)) {
                this.ennemies[id].paint(context);
            }
        }
    };

    EnnemiesManager.prototype.reset = function () {
        this.bulletsManager.reset();
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
            var path = this.pathManager.buildPath({
                x: ennemy.x,
                y: ennemy.y
            }, {
                x: commands.x,
                y: commands.y
            });
            return ennemy.action(path);
        } else {
            return Promise.resolve();
        }
    };

    EnnemiesManager.prototype.commandShoot = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];
            // Si le vaisseau n'a pas explosé
            if (ennemy) {
                this.bulletsManager.fire(commands, ennemy);
            }
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.commandLeave = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];
            // Si le vaisseau n'a pas explosé
            if (ennemy) {
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

    window.EnnemiesManager = EnnemiesManager;

})(window);
