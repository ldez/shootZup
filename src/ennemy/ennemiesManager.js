(function (window) {
    'use strict';

    function EnnemiesManager(gameState, resources, botPhysicManager, bulletsManager) {
        this.resources = resources;
        this.gameState = gameState;
        this.bulletsManager = bulletsManager;
        this.botPhysicManager = botPhysicManager;

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
                var ennemy = this.ennemies[id];
                // Arrêt de l'annimation
                ennemy.clearCurrentAnimation();
            }
        }

        // suppression de tout les mouvements : ennemies et bullets
        this.botPhysicManager.clearAllMoves();

        // Suppression de tous les ennemies
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
                ships.push(this.commandShip(ship));
            }
            // stop when game is not playing
            return playing;

        }.bind(this));

        return Promise.all(ships);
    };

    EnnemiesManager.prototype.commandShip = function (commands) {
        var sequence = Promise.resolve();

        commands.forEach(function (command) {
            sequence = sequence.then(function () {

                switch (command.action) {
                case 'new':
                    return this.commandNew(command);
                case 'move':
                    return this.commandMove(command);
                case 'shoot':
                    return this.commandShoot(command);
                    //                    return Promise.resolve();
                case 'leave':
                    return this.commandLeave(command);
                default:
                    throw new Error('Invalid Ennemy ship command');
                }
            }.bind(this));

        }.bind(this));

        return sequence;
    };

    EnnemiesManager.prototype.commandNew = function (commands) {
        var promise = Promise.resolve();
        if (this.gameState.isPlaying()) {
            var ennemy;

            switch (commands.type) {
            case 'red':
                ennemy = new EnnemyRed(commands, this.resources);
                break;
            case 'green':
                ennemy = new EnnemyGreen(commands, this.resources);
                break;
            case 'blue':
                ennemy = new EnnemyBlue(commands, this.resources);
                break;
            default:
                throw new Error('Invalid Ennemy ship type');
            }

            this.ennemies[commands.id] = ennemy;
            promise = ennemy.startLoop(ennemy.FLY);
        }
        return promise;
    };

    EnnemiesManager.prototype.commandMove = function (commands) {
        var promise = Promise.resolve();
        var ennemy = this.ennemies[commands.id];

        // Si le vaisseau n'a pas explosé
        if (ennemy && this.gameState.isPlaying()) {
            promise = this.botPhysicManager.moveOnpath(ennemy, commands);
        }
        return promise;
    };

    EnnemiesManager.prototype.commandShoot = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];

            // Si le vaisseau n'a pas explosé
            if (ennemy && this.gameState.isPlaying()) {
                this.bulletsManager.fire(ennemy, commands);
            }
            resolve();
        }.bind(this));
    };

    EnnemiesManager.prototype.commandLeave = function (commands) {
        return new Promise(function (resolve) {
            var ennemy = this.ennemies[commands.id];

            // Si le vaisseau n'a pas explosé
            if (ennemy) {
                // Arrêt de l'annimation
                ennemy.clearCurrentAnimation();
                // Arrêt du déplacement
                this.botPhysicManager.clearMove(ennemy);
                // Suppression de la liste des ennemies
                delete this.ennemies[commands.id];
            }

            resolve();
        }.bind(this));
    };

    window.EnnemiesManager = EnnemiesManager;

})(window);
