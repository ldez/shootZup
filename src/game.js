(function (window, document) {
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
    function Game(canvas, context2d, gameState, explosionManager, bulletsManager, ennemiesManager, lasersManager, background, playerFactory, physics, controlsP1, bgCanvas, gameCanvas, uiCanvas) {
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

        this.uiDirty = true;
        this.gameDirty = true;

        this.bgCanvas = bgCanvas;
        this.gameCanvas = gameCanvas;
        this.uiCanvas = uiCanvas;

        this.gameBuffer = this.createPreRenderBuffer(this.gameCanvas.canvas);
        this.uiBuffer = this.createPreRenderBuffer(this.uiCanvas.canvas);

        this.duration = 3000;
    }

    /**
     * Démarage du jeux
     *
     * @param {Object} scenario Scénario à lancer
     */
    Game.prototype.start = function (scenario) {

        this.uiDirty = true;
        this.gameDirty = true;

        this.scenario = scenario;
        this.gameState.play();
        this.player1.startLoop(this.player1.FLY);

        // lance de scenario des ennemies
        this.ennemiesManager.start(scenario)
            .then(function () {

                // définit la durée maximale du jeux.
                if (this.gameState.isPlaying()) {
                    setTimeout(function () {
                        this.reset();
                        this.gameState.finished(this.player1.imageName);
                    }.bind(this), this.duration);
                }

            }.bind(this));
    };

    Game.prototype.reset = function () {

        // Stop l'animation du vaisseau du joueur
        this.player1.clearCurrentAnimation();
        this.lasersManager.reset();

        this.ennemiesManager.reset();
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
            this.player1 = this.playerFactory.create();
            this.start(this.scenario);
        }
    };

    Game.prototype.clearCanvas = function (descriptor) {
        descriptor.context2d.clearRect(0, 0, descriptor.canvas.width, descriptor.canvas.height);
    };

    Game.prototype.createPreRenderBuffer = function (canvas) {
        var bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = canvas.width;
        bufferCanvas.height = canvas.height;

        var bufferContext = bufferCanvas.getContext('2d');

        return {
            canvas: bufferCanvas,
            context2d: bufferContext
        };
    };

    /**
     * Affichage des éléments du jeux
     */
    Game.prototype.render = function () {

        if (this.uiDirty || this.gameDirty && this.gameState.isFinished()) {
            this.clearCanvas(this.uiBuffer);
            this.clearCanvas(this.uiCanvas);
        }
        if (this.gameDirty) {
            this.clearCanvas(this.gameBuffer);
            this.clearCanvas(this.gameCanvas);
        }

        // affichage du fond du jeux
        this.background.paint(this.bgCanvas.context2d);

        // Si le jeux est en cours
        if (this.gameState.isPlaying()) {
            // gestion des touches et des actions associées
            this.checkInputInGame(this.controlsP1, this.physics, this.player1);

            // affichage des ennemies
            this.ennemiesManager.paint(this.gameBuffer.context2d);

            // affichage des explosions des ennemies
            this.explosionManager.paint(this.gameBuffer.context2d);

            // affichage des bullets des ennemies
            this.bulletsManager.paint(this.gameBuffer.context2d);

            // affichage du vaisseau du joueur
            this.player1.paint(this.gameBuffer.context2d);

            // affichage des lasers des joueurs
            this.lasersManager.paint(this.gameBuffer.context2d);

            // affichage du score
            this.paintScores(this.uiBuffer.context2d, this.gameState.scores.player1);

            var oldScore = this.gameState.scores.player1;

            // calcul du nouveau score - detection des collision entre les lasers et les ennemies
            this.gameState.scores.player1 += this.physics.detectCollisionOnEnnemies(this.ennemiesManager.ennemies, this.lasersManager.lasers);

            this.uiDirty = oldScore !== this.gameState.scores.player1;

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
            this.explosionManager.paint(this.gameBuffer.context2d);
        }
        // si le jeux est fini
        else if (this.gameState.isFinished()) {

            // affichage de l'écran de fin
            this.paintEndScreen(this.uiBuffer.context2d, this.gameState.scores.player1);
            this.gameDirty = false;

            // relancement du jeux sur action du joueur
            this.checkInputMenu(this.controlsP1);
        }
        // si le jeux est en chargement
        else {
            // Loading
            console.log('Loading...', this.gameState.current);
        }

        this.gameCanvas.context2d.drawImage(this.gameBuffer.canvas, 0, 0);
        this.uiCanvas.context2d.drawImage(this.uiBuffer.canvas, 0, 0);

        window.requestAnimationFrame(this.render.bind(this));
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
        this.explosionManager.playerExploded(player.x, player.y)
            .then(function () {
                setTimeout(function () {
                    this.reset();
                    this.gameState.finished(player.imageName);
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
        if (this.uiDirty) {
            context.textAlign = 'start';
            context.fillStyle = 'red';
            context.font = 'bold 16px lcd';
            context.fillText('score ' + score, 10, 25);
        }
    };

    /**
     * Affichage de l'écran de fin
     *
     * @param {Object} context Context 2D du canvas
     * @param {Number} score   Score du joueur
     */
    Game.prototype.paintEndScreen = function (context, score) {

        if (this.uiDirty || this.gameDirty) {

            // Message Game State
            context.fillStyle = 'white';
            context.font = 'bold 40px lcd';

            var playerMessage = '';
            if (this.gameState.isPlayerWin()) {
                playerMessage = 'You WIN !!!';
            } else {
                playerMessage = 'GAME OVER';
            }
            this.fillTextCenter(context, playerMessage, -100);

            // Score et restart message
            context.fillStyle = 'red';
            context.font = 'bold 24px lcd';

            var scoreText = 'score ' + score;
            this.fillTextCenter(context, scoreText, 0);

            var text = 'Press ENTER to restart';
            this.fillTextCenter(context, text, 40);

            // Highscores
            context.fillStyle = 'yellow';

            this.gameState.highscores.forEach(function (player, index) {
                context.font = 'bold ' + (18 - index * 3) + 'px lcd';
                var highscoreLine = '[ ' + player.score + ' - ' + player.name + ' ]';
                this.fillTextCenter(context, highscoreLine, 100 + 30 * index);
            }.bind(this));

            this.uiDirty = false;
            this.gameDirty = false;
        }

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

})(window, document);
