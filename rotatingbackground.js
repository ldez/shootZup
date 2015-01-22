function Background() {
	
	this.canvasHeight = 640;
	this.backgrounds = [];
	
	this.backgrounds[0] = {	background: resources.images['galaxy'], 
							width: 1600,
							height: 1151,
							y: 0,
							scrollValue: 0,
							angle: 0,
							rotateValue: 0.01};
}

Background.prototype.paint = function(context) {

	for (var i=0; i<this.backgrounds.length; i++) {
		
		if (this.backgrounds[i].rotateValue > 0) {
			context.save();
			
			context.translate(this.backgrounds[i].width * 0.25, this.backgrounds[i].height * 0.25);
			context.rotate(Math.PI / 180 * this.backgrounds[i].angle);
			context.translate(-this.backgrounds[i].width * 0.25, -this.backgrounds[i].height * 0.25);
			
			context.drawImage(this.backgrounds[i].background, -this.backgrounds[i].width/4, -this.backgrounds[i].height/4);
			
			context.restore();
			
			this.backgrounds[i].angle += this.backgrounds[i].rotateValue;
		} else {
			context.drawImage(this.backgrounds[i].background, 0, this.backgrounds[i].y);
		}
		
		
		
		this.backgrounds[i].y += this.backgrounds[i].scrollValue;
	}
};