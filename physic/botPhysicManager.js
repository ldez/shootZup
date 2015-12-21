(function (window) {
    'use strict';

    function BotPhysicManager(pathManager, gameState) {

        this.pathManager = pathManager;
        this.gameState = gameState;
        this.moveLoop = {};
    }

    BotPhysicManager.prototype.clearAllMoves = function () {

        for (var botId in this.moveLoop) {
            if (this.moveLoop.hasOwnProperty(botId)) {
                clearTimeout(this.moveLoop[botId]);
            }
        }
        this.moveLoop = {};
    };

    BotPhysicManager.prototype.clearMove = function (bot) {
        clearTimeout(this.moveLoop[bot.type + bot.id]);
        delete this.moveLoop[bot.type + bot.id];
    };

    BotPhysicManager.prototype.moveOnpath = function (bot, command) {

        return this.pathManager.buildPath(bot, command)
            .then(function (path) {

                if (this.gameState.isPlaying()) {
                    return this.buildMove(bot, path);
                }
                return Promise.resolve(bot);

            }.bind(this));
    };

    BotPhysicManager.prototype.buildMove = function (bot, path) {

        var sequence = Promise.resolve();

        path.forEach(function (coords) {
            sequence = sequence.then(function () {

                return new Promise(function (resolve) {

                    if (this.gameState.isPlaying()) {
                        this.moveLoop[bot.type + bot.id] = setTimeout(function () {
                            bot.x = coords.x;
                            bot.y = coords.y;
                            resolve(bot);
                        }, bot.speed);
                    } else {
                        resolve(bot);
                    }

                }.bind(this));

            }.bind(this));
        }.bind(this));

        return sequence;
    };
    BotPhysicManager.prototype.buildMoveTemp = function (bot, path) {

        var sequence = Promise.resolve();

        path.forEach(function (coords) {
            sequence = sequence.then(function () {

                return this.buildOneStep(bot, coords);

            }.bind(this));
        }.bind(this));

        return sequence;
    };

    BotPhysicManager.prototype.buildOneStep = function (bot, coords) {

        return new Promise(function (resolve) {

            if (this.gameState.isPlaying()) {
                this.moveLoop[bot.type + bot.id] = setTimeout(function () {
                    bot.x = coords.x;
                    bot.y = coords.y;
                    resolve(bot);
                }, bot.speed);
            } else {
                resolve(bot);
            }

        }.bind(this));
    };

    window.BotPhysicManager = BotPhysicManager;

})(window);
