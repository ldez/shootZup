(function (window) {
    'use strict';

    /**
     * Jeux
     *
     * @param {Object} canvas           Canvas du jeux
     * @param {Object} context2d        Context 2D du canvas
     * @param {Object} gameState        Gestionnaire de l'état d'éxécution du jeux
     * @param {Object} explosionManager Gestionnaire des explosions
     * @param {Object} bulletsManager   Gestionnaire des bullets
     * @param {Object} ennemiesManager  Gestionnaire des ennemies
     * @param {Object} lasersManager    Gestionnaire des lasers
     * @param {Object} background       Gestionnaire du fond du jeux
     * @param {Object} playerFactory    Factory de vaisseau
     * @param {Object} physics          Moteur de physique
     * @param {Object} controlsP1       Gestionnaire des touches du clavier du joueur 1
     */
    function Game(canvas, context2d, gameState, explosionManager, bulletsManager, ennemiesManager, lasersManager, background, playerFactory, physics, controlsP1) {
        this.canvas = canvas;
        this.context2d = context2d;
        this.gameState = gameState;
        this.background = background;
        this.explosionManager = explosionManager;
        this.scenario = {};
        this.bulletsManager = bulletsManager;
        this.ennemiesManager = ennemiesManager;

        this.playerFactory = playerFactory;
        this.lasersManager = lasersManager;
        this.player1 = playerFactory.create();
        this.physics = physics;
        this.controlsP1 = controlsP1;

        this.duration = 3000;
    }

    /**
     * Démarage du jeux
     *
     * @param {Object} scenario Scénario à lancer
     */
    Game.prototype.start = function (scenario) {
        this.scenario = scenario;
        this.gameState.play();
        this.player1.startLoop(this.player1.FLY);

        // lance de scenario des ennemies
        this.ennemiesManager.start(scenario).then(function () {
            // définit la durée maximale du jeux.
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
            this.lasersManager.shoot(player);

            // empêche le tire continue
            control.actions.SHOOT = false;
        }

        // déplacement horizontal
        if (control.actions.LEFT) {
            physics.moveLeft(player);
        } else if (control.actions.RIGHT) {
            physics.moveRight(player);
        }

        // déplacement vertical
        if (control.actions.UP) {
            physics.moveUp(player);
        } else if (control.actions.DOWN) {
            physics.moveDown(player);
        }
    };

    /**
     * Gestion du relancement du jeux
     *
     * @param {Object} control Gestionnaire des touches du clavier
     */
    Game.prototype.checkInputMenu = function (control) {
        if (this.gameState.isFinished() && control.actions.START) {
            this.lasersManager.reset();
            this.player1 = this.playerFactory.create();
            this.ennemiesManager.reset();
            this.start(this.scenario);
        }
    };

    /**
     * Affichage des éléments du jeux
     */
    Game.prototype.paint = function () {

        // affichage du fond du jeux
        this.background.paint(this.context2d);

        // Si le jeux est en cours
        if (this.gameState.isPlaying()) {
            // gestion des touches et des actions associées
            this.checkInputInGame(this.controlsP1, this.physics, this.player1);

            // affichage des ennemies
            this.ennemiesManager.paint(this.context2d);

            // affichage des explosions des ennemies
            this.explosionManager.paint(this.context2d);

            // affichage des bullets des ennemies
            this.bulletsManager.paint(this.context2d);

            // affichage du vaisseau du joueur
            this.player1.paint(this.context2d);

            // affichage des lasers des joueurs
            this.lasersManager.paint(this.context2d);

            // affichage du score
            this.paintScores(this.context2d, this.gameState.scores.player1);

            // calcul du nouveau score - detection des collision entre les lasers et les ennemies
            this.gameState.scores.player1 += this.physics.detectCollisionOnEnnemies(this.ennemiesManager.ennemies, this.lasersManager.lasers);

            // detection des collisions avec le vaisseau du joueur
            if (this.physics.detectCollisionsOnPlayer(this.player1, this.bulletsManager.bullets, this.ennemiesManager.ennemies)) {
                this.destroyPlayer(this.player1);
            }

            // déplacement des lasers des joueurs
            this.lasersManager.move();
        }
        // si le joueur est mort
        else if (this.gameState.isGameOver()) {

            // affichage de explosion du vaisseau
            this.explosionManager.paint(this.context2d);
        }
        // si le jeux est fini
        else if (this.gameState.isFinished()) {
            // affichage de l'écran de fin
            this.paintEndScreen(this.context2d, this.gameState.scores.player1);

            // relancement du jeux sur action du joueur
            this.checkInputMenu(this.controlsP1);
        }
        // si jeux est en chargement
        else {
            // Loading
            console.log('Loading...');
        }

        window.requestAnimationFrame(this.paint.bind(this));
    };

    /**
     * Destruction d'un joueur
     *
     * @param {Object} player  Vaisseau du joueur
     */
    Game.prototype.destroyPlayer = function (player) {
        // Change l'état du jeux
        this.gameState.gameOver();

        // Stop l'animation du vaisseau du joueur
        player.clearCurrentAnimation();

        // création de l'explosion du vaisseau du joueur
        this.explosionManager.exploded(player.x, player.y)
            .then(function () {
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
        context.textAlign = 'start';
        context.fillStyle = 'red';
        context.font = 'bold 16px lcd';
        context.fillText('score ' + score, 10, 25);
    };

    /**
     * Affichage de l'écran de fin
     *
     * @param {Object} context Context 2D du canvas
     * @param {Number} score   Score du joueur
     */
    Game.prototype.paintEndScreen = function (context, score) {

        context.fillStyle = 'white';
        context.font = 'bold 40px lcd';

        var playerMessage = '';
        if (this.gameState.isPlayerWin()) {
            playerMessage = 'You WIN !!!';
        } else {
            playerMessage = 'GAME OVER';
        }
        this.fillTextCenter(context, playerMessage, -50);

        context.fillStyle = 'red';
        context.font = 'bold 24px lcd';

        var scoreText = 'score ' + score;
        this.fillTextCenter(context, scoreText, 0);

        var text = 'Press ENTER to restart';
        this.fillTextCenter(context, text, 40);

    };

    /**
     * Affiche un texte au center du canvas
     *
     * @param {String} text               Texte à afficher
     * @param {Number} centerHeigthOffset Hauteur du offset par rapport au centre du canvas
     */
    Game.prototype.fillTextCenter = function (context, text, centerHeigthOffset) {
        context.textAlign = 'center';
        context.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + centerHeigthOffset);
    };

    window.Game = Game;

})(window);
