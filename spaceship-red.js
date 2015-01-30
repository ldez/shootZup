function SpaceshipRed() {
    
    // Position de l'animation courante parmi les frames
    this.currentAnimationFrame = 0;
     
    // Taille en pixels d'une frame d'animation
    this.animationFrameWidth = 70;
    this.animationFrameHeight = 62;
	
	this.hitboxWidth = 45;
    this.hitboxHeight = 45;
     
    // Position y de l'animation courante dans le sprite général.
    this.animationY = 0;
    
    this.animations = { 
		'FLY' : {nbFrames : 32, animationFrameWidth: 70, animationY: 0, speedRate: 15}
    }
}
SpaceshipRed.prototype = new Sprite();

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