(function () {
    'use strict';

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
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

    var player1 = new SpaceshipRed(resources);
    var physicsP1 = new Physics(resources);
    var controlsP1 = new Keyboard();
    var lasersManager = new LasersManager(audio, resources);

    var ennemiesManager = new EnnemiesManager(gameState, resources);

    var exploding = [];
    var background;
    var scoresP1;
    var scenario;

    var canvas = document.getElementById('game');
    var context2d = canvas.getContext('2d');


    audio.load().then(function () {
        return resources.load();
    }).then(function () {
        background = new Background(resources);
    }).then(function () {
        audio.stageBgm();
        return ennemiesManager.loadScenario('resources/stage1.json');
    }).then(function (value) {
        scenario = value;
        controlsP1.startDetection();

        paintGame();
        startGame();
    });

    function startGame() {
        scoresP1 = 0;
        gameState.play();
        player1.startLoop(player1.FLY);

        ennemiesManager.start(scenario).then(function (sequence) {
            setTimeout(function () {
                gameState.finished();
            }, 3000);
        });
    }


    function checkInputInGame(control, physics) {
        if (control.controls[control.SHOOT]) {
            // création de 2 lasers
            lasersManager.shoot(physicsP1);

            control.controls[control.SHOOT] = false;
        }

        if (control.controls[control.LEFT] && physicsP1.canMoveLeft(player1)) {
            physics.x -= 10;
        } else if (control.controls[control.RIGHT] && physicsP1.canMoveRight(player1)) {
            physics.x += 10;
        }

        if (control.controls[control.UP] && physicsP1.canMoveUp(player1)) {
            physics.y -= 10;
        } else if (control.controls[control.DOWN] && physicsP1.canMoveDown(player1)) {
            physics.y += 10;
        }
    }


    function checkInputMenu(control) {
        if (gameState.isFinished() && control.controls[control.START]) {
            startGame();
        }
    }

    function paintGame() {

        background.paint(context2d);

        if (gameState.isPlaying()) {
            checkInputInGame(controlsP1, physicsP1);

            ennemiesManager.paintEnnemies(context2d);

            exploding.forEach(function(explosion){
                 explosion.paint(context2d);
            });

            ennemiesManager.paintBullets(context2d);

            player1.paint(context2d, physicsP1.x, physicsP1.y);

            lasersManager.paint(context2d);

            paintScores(context2d, scoresP1);
            scoresP1 += physicsP1.detectCollisionOnEnnemies(ennemiesManager.ennemies, lasersManager.lasers, exploding);

            if (physicsP1.detectCollisionsOnPlayer(physicsP1.x, physicsP1.y, player1, ennemiesManager.bullets)) {
                destroyPlayer(physicsP1);
            }

            lasersManager.move();

        } else if (gameState.isDead()) {

            exploding.forEach(function(explosion){
                 explosion.paint(context2d);
            });

        } else {
            checkInputMenu(controlsP1);
            paintEndScreen(context2d, scoresP1);
        }

        window.requestAnimationFrame(paintGame);
    }

    function destroyPlayer(physics) {
        gameState.death();
        player1.clearCurrentAnimation();

        var explosion = new Explosion(physics.x, physics.y, resources);
        exploding.push(explosion);
        explosion.startOnce(explosion.BOOM, function () {
            exploding.splice(exploding.indexOf(explosion), 1);

            setTimeout(function () {
                gameState.finished();
            }, 3000);
        });
    }

    function paintScores(context, score) {
        context.fillStyle = "red";
        context.font = "bold 16px lcd";
        context.fillText("score " + score, 10, 25);
    }

    function paintEndScreen(context, score) {
        context.fillStyle = "red";
        context.font = "bold 24px lcd";
        var text = "score " + score;
        var width = context.measureText(text).width;
        context.fillText(text, (canvas.width / 2) - (width / 2), canvas.height / 2);

        var text2 = "Press ENTER to restart";
        var width2 = context.measureText(text2).width;
        context.fillText(text2, (canvas.width / 2) - (width2 / 2), canvas.height / 2 + 30);
    }

})();
