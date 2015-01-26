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
var ennemiesManager;

var canvas = document.getElementById('game'); 
var context2d = canvas.getContext('2d');


resources.loadSprites(
		[	{title: 'spaceship-red', url: 'resources/spaceship-red.png'},
			{title: 'laser', url: 'resources/laser.png'},
			{title: 'spaceship-green', url: 'resources/spaceship-green.png'},
			{title: 'boom', url: 'resources/explosion.png'},
			{title: 'sky', url: 'resources/sky.jpg'},
			{title: 'stars', url: 'resources/stars.png'}
		]
	)
	.then(function(value) {
		startGame();
	});
	

function startGame() {
	background = new Background();
    paintGame();
	player1.startLoop(player1.FLY);
	controlsP1.startDetection();


	ennemiesManager	= new EnnemiesManager();
	ennemiesManager.start(ennemies);
}

function checkInput(control, physics) {
	if (control.controls[control.SHOOT]) {
		// création de 2 lasers
		lasers.push(new Laser(physicsP1.x - 10, physicsP1.y - 50));
		lasers.push(new Laser(physicsP1.x + 10, physicsP1.y - 50));
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
    
	canvas.width = canvas.width;
	
	background.paint(context2d);
	
	checkInput(controlsP1, physicsP1);
	
	for (var i in ennemies) {
		ennemies[i].paint(context2d);
	}
	
	player1.paint(context2d, physicsP1.x, physicsP1.y);
	
	for (var i=0; i<lasers.length; i++) {
		lasers[i].draw(context2d);
	}
	
	moveLasers();
	
    window.requestAnimationFrame(paintGame); 
}