function Laser(x, y) {
	
	// Taille en pixels d'une frame d'animation
	this.x = x;
	this.y = y;
	
	this.frameWidth = 3;
	this.frameHeight = 32;
	
	this.canvasHeight = 640;

}


Laser.prototype.draw = function(context) {
	context.drawImage(resources.images['laser'], this.x, this.y - this.frameHeight);
};

Laser.prototype.move = function() {
	this.y -= this.frameHeight + 10;
};

Laser.prototype.isOutOfBounds = function() {
	return this.y > this.canvasHeight;
};