(function () {
    'use strict';

    window.requestAnimationFrame = (function () {
        // La fonction d'origine que tous les navigateurs finiront par utiliser.
        return window.requestAnimationFrame ||
            // Pour Chrome et Safari.
            window.webkitRequestAnimationFrame ||
            // Pour Firefox.
            window.mozRequestAnimationFrame ||
            // Pour Opera.
            window.ORequestAnimationFrame ||
            // Pour Internet Explorer.
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById('game');
    var context2d = canvas.getContext('2d');

    // TODO Utiliser directement le canvas ???
    var canvasSize = {
        // 640
        height: canvas.height,
        // 480
        width: canvas.width
    };

    var sprites = [
        {title: 'spaceship-red', url: 'resources/image/spaceship-red.png'},
        {title: 'spaceship-blue', url: 'resources/image/spaceship-blue.png'},
        {title: 'spaceship-green-large', url: 'resources/image/spaceship-green-large.png'},
        {title: 'spaceship-green', url: 'resources/image/spaceship-green.png'},
        {title: 'laser', url: 'resources/image/laser.png'},
        {title: 'boom', url: 'resources/image/explosion.png'},
        {title: 'sky', url: 'resources/image/sky.jpg'},
        {title: 'bullet', url: 'resources/image/bullet.png'},
        {title: 'galaxy', url: 'resources/image/galaxy3.jpg'},
        {title: 'stars', url: 'resources/image/stars2.png'}
    ];
    var resources = new Resources(sprites);

    var sounds = [
        {title: 'stage', url: 'resources/audio/loop.mp3'},
        {title: 'laser', url: 'resources/audio/science_fiction_laser_005.mp3'}
    ];
    var audio = new Audio(sounds);

    var gameState = new GameState();

    var controlsP1 = new Keyboard();

    var pathManager = new PathManager();
    var explosionManager = new ExplosionManager(resources);

    var bulletsManager = new BulletsManager(resources, pathManager);
    var ennemiesManager = new EnnemiesManager(gameState, resources, pathManager, bulletsManager);

    var physics = new Physics(explosionManager, canvasSize);
    var lasersManager = new LasersManager(audio, resources, canvasSize);
    var playerFactory = new PlayerFactory(resources, canvasSize);

    var background;

    var preLoadActions = [
        // préchargement des sons
        audio.load(),

        // préchargement des images
        resources.load(),

    ];

    Promise.all(preLoadActions)
        .then(function () {

            // contruction du fond
            background = new Background(resources, canvasSize);

            // démarrage de la musique de fond
            return audio.stageBgm();
        })
        .then(function () {

            // contruction du scénario des ennemies
            return ennemiesManager.loadScenario('resources/stage1.json');
        }).then(function (scenario) {

            // démarrage de gestion des controles utilisateurs
            controlsP1.startDetection();

            // Création du jeux
            var game = new Game(canvas, context2d, gameState, explosionManager, bulletsManager, ennemiesManager, lasersManager, background, playerFactory, physics, controlsP1);

            // affichage du jeux
            game.paint();

            // démarrage du jeux
            game.start(scenario);
        });

})();
