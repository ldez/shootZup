(function (window) {
    'use strict';

    /**
     * Jeu
     *
     * @param {Object} canvas           Canvas du jeu
     * @param {Object} context2d        Context 2D du canvas
     * @param {Object} gameState        Gestionnaire de l'état d'éxécution du jeu
     * @param {Object} resources        Gestionnaire des images
     * @param {Object} explosionManager Gestionnaire des explosions
     * @param {Object} ennemiesManager  Gestionnaire des ennemies
     * @param {Object} lasersManager    Gestionnaire des lasers
     * @param {Object} background       Gestionnaire du fond du jeu
     * @param {Object} playerFactory    Factory de vaisseau
     * @param {Object} physicsP1        Moteur de physique du joueur 1
     * @param {Object} controlsP1       Gestionnaire des touches du clavier du joueur 1
     */
    function Game(canvas, context2d, gameState, resources, explosionManager, ennemiesManager, lasersManager, background, playerFactory, physicsP1, controlsP1) {
        this.canvas = canvas;
        this.context2d = context2d;
        this.gameState = gameState;
        this.background = background;
        this.resources = resources;
        this.explosionManager = explosionManager;
        this.scenario = {};
        this.ennemiesManager = ennemiesManager;

        this.playerFactory = playerFactory;
        this.lasersManager = lasersManager;
        this.scoresP1 = 0;
        this.player1 = playerFactory.create();
        this.physicsP1 = physicsP1;
        this.controlsP1 = controlsP1;

        this.duration = 3000;
    }

    /**
     * Démarage du jeu
     *
     * @param {Object} scenario Scénario à lancer
     */
    Game.prototype.startGame = function (scenario) {
        this.scenario = scenario;
        this.scoresP1 = 0;
        this.gameState.play();
        this.player1.startLoop(this.player1.FLY);

        // lance de scenario des ennemies
        this.ennemiesManager.start(scenario).then(function (sequence) {
            // définit la durée maximale du jeu.
            if (!this.gameState.isGameOver()) {
                setTimeout(function () {
                    this.gameState.finished();
                }.bind(this), this.duration);
            }
        }.bind(this));
    };

    /**
     * Gestion des actions clavier d'un joueur
     *
     * @param {Object} control Gestionnaire des touches du clavier
     * @param {Object} physics Moteur de physique
     * @param {Object} player  Vaisseau du joueur
     */
    Game.prototype.checkInputInGame = function (control, physics, player) {

        // lance un shoot
        if (control.actions.SHOOT) {
            // création de 2 lasers
            this.lasersManager.shoot(physics);

            // empêche le tire continue
            control.actions.SHOOT = false;
        }

        // déplacement horizontal
        if (control.actions.LEFT && physics.canMoveLeft(player)) {
            physics.x -= 10;
        } else if (control.actions.RIGHT && physics.canMoveRight(player)) {
            physics.x += 10;
        }

        // déplacement vertical
        if (control.actions.UP && physics.canMoveUp(player)) {
            physics.y -= 10;
        } else if (control.actions.DOWN && physics.canMoveDown(player)) {
            physics.y += 10;
        }
    };

    /**
     * Gestion du relancement du jeu
     *
     * @param {Object} control Gestionnaire des touches du clavier
     * @param {Object} physics Moteur de physique
     */
    Game.prototype.checkInputMenu = function (control, physics) {
        if (this.gameState.isFinished() && control.actions.START) {
            physics.reset();
            this.player1 = this.playerFactory.create();
            this.ennemiesManager.reset();
            this.startGame(this.scenario);
        }
    };

    /**
     * Affichage des éléments du jeu
     */
    Game.prototype.paintGame = function () {

        // affichage du fond du jeu
        this.background.paint(this.context2d);

        // Si le jeu est en cours
        if (this.gameState.isPlaying()) {
            // gestion des touches et des actions associées
            this.checkInputInGame(this.controlsP1, this.physicsP1, this.player1);

            // affichage des ennemies
            this.ennemiesManager.paintEnnemies(this.context2d);

            // affichage des explosions des ennemies
            this.explosionManager.paint(this.context2d);

            // affichage des bullets des ennemies
            this.ennemiesManager.paintBullets(this.context2d);

            // affichage du vaisseau du joueur
            this.player1.paint(this.context2d, this.physicsP1.x, this.physicsP1.y);

            // affichage des lasers des joueurs
            this.lasersManager.paint(this.context2d);

            // affichage du score
            this.paintScores(this.context2d, this.scoresP1);

            // calcul du nouveau score - detection des collision entre les lasers et les ennemies
            this.scoresP1 += this.physicsP1.detectCollisionOnEnnemies(this.ennemiesManager.ennemies, this.lasersManager.lasers, this.explosionManager.exploding);

            // detection des collisions avec le vaisseau du joueur
            if (this.physicsP1.detectCollisionsOnPlayer(this.physicsP1.x, this.physicsP1.y, this.player1, this.ennemiesManager.bullets)) {
                this.destroyPlayer(this.physicsP1, this.player1);
            }

            // déplacement des lasers des joueurs
            this.lasersManager.move();

        }
        // si le joueur est mort
        else if (this.gameState.isGameOver()) {

            // affichage de explosion du vaisseau
            this.explosionManager.paint(this.context2d);
        }
        // si le jeu est fini
        else {
            // relancement du jeu sur action du joueur
            this.checkInputMenu(this.controlsP1, this.physicsP1);

            // affichage de l'écran de fin
            this.paintEndScreen(this.context2d, this.scoresP1);
        }

        window.requestAnimationFrame(this.paintGame.bind(this));
    };

    /**
     * Destruction d'un joueur
     *
     * @param {Object} physics Moteur de physique
     */
    Game.prototype.destroyPlayer = function (physics, player) {
        // Change l'état du jeu
        this.gameState.gameOver();
        player.clearCurrentAnimation();

        // création de l'explosion du vaisseau du joueur
        this.explosionManager.plaverExploded(physics, function () {
            setTimeout(function () {
                this.gameState.finished();
            }.bind(this), 1000);
        }.bind(this));
    };

    /**
     * Affichage du score
     *
     * @param {Object} context Context 2D du canvas
     * @param {Number} score   Score du joueur
     */
    Game.prototype.paintScores = function (context, score) {
        context.fillStyle = "red";
        context.font = "bold 16px lcd";
        context.fillText("score " + score, 10, 25);
    };

    /**
     * Affichage de l'écran de fin
     *
     * @param {Object} context Context 2D du canvas
     * @param {Number} score   Score du joueur
     */
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
