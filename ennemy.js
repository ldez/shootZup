function Ennemy(id, x, y) {
     
	this.id = id;
	 
    // Position de l'animation courante parmi les frames
    this.currentAnimationFrame = 0;
	
	// Positions
	this.x = x;
	this.y = y;
	
	// Energie du vaisseau
	this.life = 3;
     
    // Taille en pixels d'une frame d'animation
    this.animationFrameWidth = 35;
    this.animationFrameHeight = 37;
     
    // Sert à controler la boucle d'animation
    this.animationLoop;
     
    this.currentState;
     
    this.animations = { 
		'FLY' : {nbFrames : 6, animationFrameWidth: 35, speedRate: 15}
    }
}

Ennemy.prototype.action = function(path) {
	
	var sequence = Promise.resolve();
	
	path.forEach(function(coords) {
		sequence = sequence.then(function() {
			return new Promise(function(resolve, reject) {
				setTimeout(function() {
					this.x = coords.x;
					this.y = coords.y;
					resolve();
				}.bind(this), 3);
			}.bind(this));
		}.bind(this));
	}.bind(this));
	
	return sequence;
};

Ennemy.prototype.FLY = 'FLY';

Ennemy.prototype.paint = function(context) {

    context.drawImage(  resources.images['spaceship-green'], 
                        this.currentAnimationFrame*this.animationFrameWidth, 
                        0, 
                        this.animationFrameWidth, 
                        this.animationFrameHeight, 
                        this.x - (this.animationFrameWidth/2), // centrage de l'image par rapport à la position
                        this.y - this.animationFrameHeight + (this.animationFrameHeight/2), // centrage de l'image par rapport à la position
                        this.animationFrameWidth, 
                        this.animationFrameHeight
                    );
};

Ennemy.prototype.clearCurrentAnimation = function() {
    this.currentAnimationFrame = 0;
    clearTimeout(this.animationLoop);
};

Ennemy.prototype.startLoop = function(animation) {
    if(this.currentState != animation) {
        this.clearCurrentAnimation();
        this.animationY = this.animations[animation].animationY;
        this.animationFrameWidth = this.animations[animation].animationFrameWidth;
         
        this.currentState = animation;
         
        this.animationLoop = setTimeout(function() {
            this.animLoop(animation);
        }.bind(this), this.animations[animation].speedRate);
    }
};

Ennemy.prototype.animLoop = function(animation) {
    this.currentAnimationFrame += 1;
    if (this.currentAnimationFrame == this.animations[animation].nbFrames) {
        this.currentAnimationFrame = 0;
    }
     
    this.animationLoop = setTimeout(function() {
        this.animLoop(animation);
    }.bind(this), this.animations[animation].speedRate);
};