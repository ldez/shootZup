function Keyboard() {
	this.startDetection();
	this.controls = [];
	
	this.SHOOT = '32';
	this.LEFT = '37';
	this.UP = '38';
	this.RIGHT = '39';
	this.DOWN = '40';
}

Keyboard.prototype.startDetection = function() {
	
	document.onkeydown = function(event) {
		if (event.keyCode == this.LEFT) {
			this.controls[this.LEFT] = true;
		} else if (event.keyCode == this.RIGHT) {
			this.controls[this.RIGHT] = true;
		}
		
		if (event.keyCode == this.UP) {
			this.controls[this.UP] = true;
		} else if (event.keyCode == this.DOWN) {
			this.controls[this.DOWN] = true;
		}
		
		if (event.keyCode == this.SHOOT) {
			this.controls[this.SHOOT] = true;
		}
	}.bind(this);
	
	
	document.onkeyup = function(event) {
		if (event.keyCode == this.LEFT) {
			this.controls[this.LEFT] = false;
		} else if (event.keyCode == this.RIGHT) {
			this.controls[this.RIGHT] = false;
		}
		
		if (event.keyCode == this.UP) {
			this.controls[this.UP] = false;
		} else if (event.keyCode == this.DOWN) {
			this.controls[this.DOWN] = false;
		}
		
		if (event.keyCode == this.SHOOT) {
			this.controls[this.SHOOT] = false;
		}
	}.bind(this);
	
};