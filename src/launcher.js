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
        {title: 'spaceship-green', url: 'resources/image/spaceship-green-large.png'},
        {title: 'ennemy-green', url: 'resources/image/ennemy-green.png'},
        {title: 'ennemy-red', url: 'resources/image/ennemy-red.png'},
        {title: 'ennemy-blue', url: 'resources/image/ennemy-blue.png'},
        {title: 'laser', url: 'resources/image/laser.png'},
        {title: 'boom', url: 'resources/image/explosion.png'},
        {title: 'bigboom', url: 'resources/image/bigboom.png'},
        {title: 'sky', url: 'resources/image/sky.jpg'},
        {title: 'bullet', url: 'resources/image/bullet.png'},
        {title: 'galaxy', url: 'resources/image/galaxy3.jpg'},
        {title: 'stars', url: 'resources/image/stars2.png'}
    ];
    var resources = new Resources(sprites);

    var mute = window.localStorage.getItem('mute') === 'true';

    // Button on/off pour le son
    var btnMute = document.getElementById('mute');
    btnMute.onclick = function () {
        this.classList.toggle('btn-mute-on');
        this.classList.toggle('btn-mute-off');
        window.localStorage.setItem('mute', audioManager.toogleMute());
    };
    if (mute) {
        btnMute.classList.toggle('btn-mute-on');
        btnMute.classList.toggle('btn-mute-off');
    }

    var sounds = [
        {title: 'stage', url: 'resources/audio/loop.mp3', initialGain: -0.7},
        {title: 'laser', url: 'resources/audio/science_fiction_laser_005.mp3', initialGain: -0.8},
        {title: 'boom', url: 'resources/audio/DeathFlash.ogg', initialGain: 1},
        {title: 'foom', url: 'resources/audio/foom_0.ogg', initialGain: 1}
    ];
    var audioManager = new AudioManager(sounds, mute);

    var gameState = new GameState();

    var controlsP1 = new Keyboard();

    var pathManager = new PathManager();
    var botPhysicManager = new BotPhysicManager(pathManager, gameState);

    var explosionManager = new ExplosionManager(resources, audioManager);

    var physics = new Physics(canvasSize, explosionManager);

    var bulletsManager = new BulletsManager(resources, botPhysicManager);
    var ennemiesManager = new EnnemiesManager(gameState, resources, botPhysicManager, bulletsManager);

    var lasersManager = new LasersManager(resources, canvasSize, audioManager);
    var playerFactory = new PlayerFactory(resources, canvasSize);

    var background;

    var preLoadActions = [
        // préchargement des sons
        audioManager.load(),

        // préchargement des images
        resources.load()
    ];

    Promise.all(preLoadActions)
        .then(function () {

            // contruction du fond
            background = new Background(resources, canvasSize);

            // démarrage de la musique de fond
            return audioManager.stageBgm();
        })
        .then(function () {

            // construction du scénario des ennemies
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
