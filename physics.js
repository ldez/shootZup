function Physics() {
	
	this.canvasWidth = 480;
	this.canvasHeight = 640;
	
	this.moveSize = 10;
	
	// Positions du vaisseau.
	this.x = 200;
	this.y = 600;
}

Physics.prototype.canMoveLeft = function(spaceship) {
	return this.x >= 0 + this.moveSize + (spaceship.animationFrameWidth/2);
}

Physics.prototype.canMoveRight = function(spaceship) {
	return this.x <= this.canvasWidth - this.moveSize - (spaceship.animationFrameWidth/2);
}

Physics.prototype.canMoveUp = function(spaceship) {
	return this.y >= 0 + this.moveSize + (spaceship.animationFrameHeight/2);
}

Physics.prototype.canMoveDown = function(spaceship) {
	return this.y <= this.canvasHeight - this.moveSize - (spaceship.animationFrameHeight/2);
}