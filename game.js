window.requestAnimationFrame = (function(){ 
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          function( callback ){ 
            window.setTimeout(callback, 1000 / 60); 
          };
})();

var resources = new Resources();
var player1 = new SpaceshipRed();
var physicsP1 = new Physics();
var controlsP1 = new Keyboard();
var background;
var lasers = [];
var ennemies = {};
var bullets = [];
var exploding = [];
var ennemiesManager;
var scoresP1 = 0;
var audio = new Audio();
var gameState;


var canvas = document.getElementById('game'); 
var context2d = canvas.getContext('2d');


audio.loadSounds([  {title: 'stage', url: 'resources/loop.mp3'},
					{title: 'laser', url: 'resources/science_fiction_laser_005.mp3'}
]).then(function(value) {
	return resources.loadSprites(
		[	{title: 'spaceship-red', url: 'resources/spaceship-red.png'},
			{title: 'laser', url: 'resources/laser.png'},
			{title: 'spaceship-green', url: 'resources/spaceship-green.png'},
			{title: 'boom', url: 'resources/explosion.png'},
			{title: 'sky', url: 'resources/sky.jpg'},
			{title: 'bullet', url: 'resources/bullet.png'},
			{title: 'galaxy', url: 'resources/galaxy3.jpg'},
			{title: 'stars', url: 'resources/stars2.png'}
		]
	)
}).then(function(value) {
	startGame();
});
	

function startGame() {
	background = new Background();
	audio.stageBgm();
	gameState = GameState.PLAYING;
    paintGame();
	player1.startLoop(player1.FLY);
	controlsP1.startDetection();

	ennemiesManager	= new EnnemiesManager();
	ennemiesManager.loadScenario('resources/stage1.json').then(function(scenario) {
		return ennemiesManager.start(ennemies, scenario);
	}).then(function() {
		setTimeout(function() {
			gameState = GameState.FINISHED;
		}, 3000);
	});
}


function checkInput(control, physics) {
	if (control.controls[control.SHOOT]) {
		// création de 2 lasers
		lasers.push(new Laser(physicsP1.x - 10, physicsP1.y - 50));
		lasers.push(new Laser(physicsP1.x + 10, physicsP1.y - 50));
		audio.laser();
		
		control.controls[control.SHOOT] = false;
	}
	
	if (control.controls[control.LEFT] && physicsP1.canMoveLeft(player1)) {
		physics.x -=10;
	} else if (control.controls[control.RIGHT] && physicsP1.canMoveRight(player1)) {
		physics.x +=10;
	}
	
	if (control.controls[control.UP] && physicsP1.canMoveUp(player1)) {
		physics.y -=10;
	} else if (control.controls[control.DOWN] && physicsP1.canMoveDown(player1)) {
		physics.y +=10;
	}
}

function moveLasers() {
	
	var newArray = [];
	
	for(var i=0; i<lasers.length; i++) {
		lasers[i].move();
		
		if (!lasers[i].isOutOfBounds()) {
			newArray.push(lasers[i]);
		}
	}
	
	lasers = newArray;	
}


function paintGame() {
    
	//canvas.width = canvas.width;
	background.paint(context2d);
	
	if (gameState == GameState.PLAYING) {
		checkInput(controlsP1, physicsP1);
		
		for (var i in ennemies) {
			ennemies[i].paint(context2d);
		}
		for (var i=0; i<exploding.length; i++) {
			exploding[i].paint(context2d);
		}
		for (var i=0; i<bullets.length; i++) {
			bullets[i].paint(context2d);
		}
		
		player1.paint(context2d, physicsP1.x, physicsP1.y);
		
		for (var i=0; i<lasers.length; i++) {
			lasers[i].paint(context2d);
		}
		
		paintScores(context2d, scoresP1);
		scoresP1 += physicsP1.detectCollisionOnEnnemies(ennemies, lasers, exploding);
		
		if (physicsP1.detectCollisionsOnPlayer(physicsP1.x, physicsP1.y, player1, bullets)) {
			gameState = GameState.DEATH;
			player1.clearCurrentAnimation();
			
			var explosion = new Explosion(physicsP1.x, physicsP1.y);
			exploding.push(explosion);
			explosion.startOnce(explosion.BOOM, function() {
				exploding.splice(exploding.indexOf(explosion), 1);
				
				setTimeout(function() {
					gameState = GameState.FINISHED;
				}, 3000);
			});
		}
		
		moveLasers();
	
	} else if (gameState == GameState.DEATH) {
		for (var i=0; i<exploding.length; i++) {
			exploding[i].paint(context2d);
		}
	} else {
		paintEndScreen(context2d, scoresP1);
	}
	
    window.requestAnimationFrame(paintGame);
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
	var width = context.measureText(text).width
	context.fillText(text, (canvas.width/2) - (width / 2), canvas.height/2);
}