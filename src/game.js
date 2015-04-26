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

    var sprites = [
        {title: 'spaceship-red', url: 'resources/image/spaceship-red.png'},
        {title: 'laser', url: 'resources/image/laser.png'},
        {title: 'spaceship-green', url: 'resources/image/spaceship-green.png'},
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

    var keysP1 = {
        SHOOT : 32,
        LEFT : 37,
        UP : 38,
        RIGHT : 39,
        DOWN : 40,
        START : 13,
    };
    var controlsP1 = new Keyboard(keysP1);
    var player1 = new SpaceshipRed(resources);
    var physicsP1 = new Physics(resources);
    var lasersManager = new LasersManager(audio, resources);

    var explosionManager = new ExplosionManager(resources);

    var ennemiesManager = new EnnemiesManager(gameState, resources);

    var background;

    var canvas = document.getElementById('game');
    var context2d = canvas.getContext('2d');


    audio.load().then(function () {
        return resources.load();
    }).then(function () {
        background = new Background(resources);
        audio.stageBgm();
        return ennemiesManager.loadScenario('resources/stage1.json');
    }).then(function (scenario) {
        controlsP1.startDetection();

        var game = new Game(canvas, context2d, gameState, resources, explosionManager, ennemiesManager, lasersManager, background, player1, physicsP1, controlsP1);

        game.paintGame();
        game.startGame(scenario);
    });

})();
