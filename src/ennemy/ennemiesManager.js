(function (window) {
    'use strict';

    function EnnemiesManager(gameState, resources, pathManager, bulletsManager) {
        this.resources = resources;
        this.gameState = gameState;
        this.pathManager = pathManager;
        this.bulletsManager = bulletsManager;

        // TODO voir comment utiliser un array plutôt qu'un objet sinon map ?
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

        for (var id in this.ennemies) {
            if (this.ennemies.hasOwnProperty(id)) {
                this.ennemies[id].clearCurrentMove();
                this.ennemies[id].clearCurrentAnimation();
            }
        }
        this.ennemies = {};
    };

    EnnemiesManager.prototype.loadScenario = function (file) {
        return new Promise(function (resolve, reject) {

            var request = new XMLHttpRequest();
            request.open("GET", file, true);
            request.responseType = 'json';

            request.onload = function () {
                resolve(request.response);
            };

            request.onerror = function (event) {
                reject("Erreur XMLHttpRequest ", event);
            };

            request.send();
        });
    };

    EnnemiesManager.prototype.start = function (scenario) {

        var groupSequence = Promise.resolve();

        scenario.groups.every(function (group) {

            var playing = this.gameState.isPlaying();
            if (playing) {
                groupSequence = groupSequence.then(function () {
                    return this.startGroup(group);
                }.bind(this));
            }
            // stop when game is not playing
            return playing;

        }.bind(this));

        return groupSequence;
    };

    EnnemiesManager.prototype.startGroup = function (group) {

        var ships = [];

        group.ships.every(function (ship) {

            var playing = this.gameState.isPlaying();
            if (playing) {
                ships.push(this.startShip(ship));
            }
            // stop when game is not playing
            return playing;

        }.bind(this));

        return Promise.all(ships);
    };

    EnnemiesManager.prototype.startShip = function (ship) {
        var sequence = Promise.resolve();

        ship.forEach(function (commands) {

            sequence = sequence.then(function () {
                switch (commands.type) {
                case 'new':
                    return this.commandNew(commands);
                case 'move':
                    return this.commandMove(commands);
                case 'shoot':
                    return this.commandShoot(commands);
                case 'leave':
                    return this.commandLeave(commands);
                default:
                    throw new Error('Invalid Ennemy ship command');
                }
            }.bind(this));

        }.bind(this));

        return sequence;
    };

    EnnemiesManager.prototype.commandNew = function (commands) {
        return new Promise(function (resolve) {
            if (this.gameState.isPlaying()) {
                var ennemy = new Ennemy(commands.id, commands.x, commands.y, this.resources);
                this.ennemies[commands.id] = ennemy;
                ennemy.startLoop(ennemy.FLY);
            }
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.commandMove = function (commands) {
        var ennemy = this.ennemies[commands.id];

        // Si le vaisseau n'a pas explosé
        if (ennemy && this.gameState.isPlaying()) {
            return this.pathManager.buildPath(ennemy, commands).then(function (path) {
                if (this.gameState.isPlaying()) {
                    return ennemy.move(path);
                }
                return Promise.resolve();
            }.bind(this));
        }
        return Promise.resolve();

    };

    EnnemiesManager.prototype.commandShoot = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];
            // Si le vaisseau n'a pas explosé
            if (ennemy && this.gameState.isPlaying()) {
                this.bulletsManager.fire(commands, ennemy);
            }
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.commandLeave = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];
            // Si le vaisseau n'a pas explosé
            if (ennemy && this.gameState.isPlaying()) {
                delete this.ennemies[commands.id];
            }
            resolve();
        }.bind(this));
    };

    window.EnnemiesManager = EnnemiesManager;

})(window);
