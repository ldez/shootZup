(function (window) {
    'use strict';

    function Game(canvas, context2d, gameState, resources, explosionManager, ennemiesManager, lasersManager, background, player1, physicsP1, controlsP1) {
        this.canvas = canvas;
        this.context2d = context2d;
        this.gameState = gameState;
        this.background = background;
        this.resources = resources;
        this.explosionManager = explosionManager;
        this.scenario = {};
        this.ennemiesManager = ennemiesManager;

        this.exploding = [];

        this.lasersManager = lasersManager;
        this.scoresP1 = 0;
        this.player1 = player1;
        this.physicsP1 = physicsP1;
        this.controlsP1 = controlsP1;
    }

    Game.prototype.startGame = function (scenario) {
        this.scenario = scenario;
        this.scoresP1 = 0;
        this.gameState.play();
        this.player1.startLoop(this.player1.FLY);

        this.ennemiesManager.start(scenario).then(function (sequence) {
            setTimeout(function () {
                this.gameState.finished();
            }.bind(this), 3000);
        }.bind(this));
    };

    Game.prototype.checkInputInGame = function (control, physics, player) {
        if (control.actions.SHOOT) {
            // création de 2 lasers
            this.lasersManager.shoot(physics);

            control.actions.SHOOT = false;
        }

        if (control.actions.LEFT && physics.canMoveLeft(player)) {
            physics.x -= 10;
        } else if (control.actions.RIGHT && physics.canMoveRight(player)) {
            physics.x += 10;
        }

        if (control.actions.UP && physics.canMoveUp(player)) {
            physics.y -= 10;
        } else if (control.actions.DOWN && physics.canMoveDown(player)) {
            physics.y += 10;
        }
    };

    Game.prototype.checkInputMenu = function (control, physics) {
        if (this.gameState.isFinished() && control.actions.START) {
            physics.reset();
            this.ennemiesManager.reset();
            this.startGame(this.scenario);
        }
    };

    Game.prototype.paintGame = function () {

        this.background.paint(this.context2d);

        if (this.gameState.isPlaying()) {
            this.checkInputInGame(this.controlsP1, this.physicsP1, this.player1);

            this.ennemiesManager.paintEnnemies(this.context2d);

            this.explosionManager.paint(this.context2d);

            this.ennemiesManager.paintBullets(this.context2d);

            this.player1.paint(this.context2d, this.physicsP1.x, this.physicsP1.y);

            this.lasersManager.paint(this.context2d);

            this.paintScores(this.context2d, this.scoresP1);
            this.scoresP1 += this.physicsP1.detectCollisionOnEnnemies(this.ennemiesManager.ennemies, this.lasersManager.lasers, this.exploding);

            if (this.physicsP1.detectCollisionsOnPlayer(this.physicsP1.x, this.physicsP1.y, this.player1, this.ennemiesManager.bullets)) {
                this.destroyPlayer(this.physicsP1);
            }

            this.lasersManager.move();

        } else if (this.gameState.isDead()) {
            this.explosionManager.paint(this.context2d);
        } else {
            this.checkInputMenu(this.controlsP1, this.physicsP1);
            this.paintEndScreen(this.context2d, this.scoresP1);
        }

        window.requestAnimationFrame(this.paintGame.bind(this));
    };


    Game.prototype.destroyPlayer = function (physics) {
        this.gameState.death();
        this.player1.clearCurrentAnimation();

        this.explosionManager.plaverExploded(physics, function () {
            setTimeout(function () {
                this.gameState.finished();
            }.bind(this), 3000);
        }.bind(this));
    };

    Game.prototype.paintScores = function (context, score) {
        context.fillStyle = "red";
        context.font = "bold 16px lcd";
        context.fillText("score " + score, 10, 25);
    };

    Game.prototype.paintEndScreen = function (context, score) {
        context.fillStyle = "red";
        context.font = "bold 24px lcd";
        var text = "score " + score;
        var width = context.measureText(text).width;
        context.fillText(text, (this.canvas.width / 2) - (width / 2), this.canvas.height / 2);

        var text2 = "Press ENTER to restart";
        var width2 = context.measureText(text2).width;
        context.fillText(text2, (this.canvas.width / 2) - (width2 / 2), this.canvas.height / 2 + 30);
    };

    window.Game = Game;

})(window);
