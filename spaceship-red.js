function SpaceshipRed() {
     
    // Position de l'animation courante parmi les frames
    this.currentAnimationFrame = 0;
     
    // Taille en pixels d'une frame d'animation
    this.animationFrameWidth = 70;
    this.animationFrameHeight = 62;
     
    // Position y de l'animation courante dans le sprite général.
    this.animationY = 0;
     
    // Sert à controler la boucle d'animation
    this.animationLoop;
     
    this.currentState;
     
    this.animations = { 'FLY' : {nbFrames : 32, animationFrameWidth: 70, animationY: 0, speedRate: 15}
                        }
}
 
SpaceshipRed.prototype.FLY = 'FLY';

SpaceshipRed.prototype.paint = function(context, x, y) {

    if (this.currentState == this.FLY) {
		context.drawImage(  resources.images['spaceship-red'], 
					this.currentAnimationFrame*this.animationFrameWidth, 
					this.animationY, 
					this.animationFrameWidth, 
					this.animationFrameHeight, 
					x - (this.animationFrameWidth/2), // centrage de l'image par rapport à la position
					y - this.animationFrameHeight + (this.animationFrameHeight/2), // centrage de l'image par rapport à la position
					this.animationFrameWidth, 
					this.animationFrameHeight
				);
	}
};

SpaceshipRed.prototype.clearCurrentAnimation = function() {
    this.currentAnimationFrame = 0;
	this.currentState = null;
    clearTimeout(this.animationLoop);
};

SpaceshipRed.prototype.startLoop = function(animation) {
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
 
SpaceshipRed.prototype.animLoop = function(animation) {
    this.currentAnimationFrame += 1;
    if (this.currentAnimationFrame == this.animations[animation].nbFrames) {
        this.currentAnimationFrame = 0;
    }
     
    this.animationLoop = setTimeout(function() {
        this.animLoop(animation);
    }.bind(this), this.animations[animation].speedRate);
};