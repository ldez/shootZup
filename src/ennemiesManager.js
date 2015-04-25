function EnnemiesManager() {
};

EnnemiesManager.prototype.loadScenario = function(file) {
	var p = new Promise(function(resolve, reject) {

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", file, true);
		
		xmlhttp.onload = function(e) {
			resolve(JSON.parse(xmlhttp.responseText));
		};
		
		xmlhttp.send();
	});
	
	return p;
};

EnnemiesManager.prototype.start = function(ennemies, scenario) {
	
	var groupSequence = Promise.resolve();
	
	scenario.groups.forEach(function(group) {
		groupSequence = groupSequence.then(function() {
			return this.startGroup(group, ennemies);
		}.bind(this));
	}.bind(this));
	
	return groupSequence;
};


EnnemiesManager.prototype.startGroup = function(group, ennemies) {
	
	var ships = [];
	
	group.ships.forEach(function(ship) {
		if (gameState == GameState.PLAYING) {
			ships.push(this.startShip(ship, ennemies));
		}		
	}.bind(this));
	
	return Promise.all(ships);
};


EnnemiesManager.prototype.startShip = function(ship, ennemies) {
	var sequence = Promise.resolve();
	
	ship.forEach(function(commands) {
		if (commands.type === 'new') {
			sequence = sequence.then(function() {
				return new Promise(function(resolve, reject) {
					var ennemy = new Ennemy(commands.id, commands.x, commands.y);
					ennemies[commands.id] = ennemy;
					ennemy.startLoop(ennemy.FLY);
					resolve();
				});
			});
		} else if (commands.type === 'move') {
			sequence = sequence.then(function() {
				var ennemy = ennemies[commands.id];
				if (ennemy) { // Si le vaisseau n'a pas explosé
					var path = this.getPath({x: ennemy.x, y: ennemy.y}, {x: commands.x, y: commands.y});
					return ennemy.action(path);
				} else {
					return new Promise(function(resolve, reject) {
						resolve();
					});
				}
			}.bind(this));
			
		} else if (commands.type === 'shoot') {
			sequence = sequence.then(function() {
				return new Promise(function(resolve, reject) {
					var ennemy = ennemies[commands.id];
					if (ennemy) { // Si le vaisseau n'a pas explosé
						var bullet = new Bullet(commands.id, ennemy.x, ennemy.y);
						var path = this.getPath({x: bullet.x, y: bullet.y}, {x: commands.x, y: commands.y});
						
						bullets.push(bullet);
						bullet.action(path).then(function(value) {
							bullets.splice(bullets.indexOf(value), 1);
						}.bind(this));
					}
					resolve();
				}.bind(this));
			}.bind(this));
			
		} else if (commands.type === 'leave') {
			sequence = sequence.then(function() {
				return new Promise(function(resolve, reject) {
					if (ennemies[commands.id]) { // Si le vaisseau n'a pas explosé
						delete ennemies[commands.id];
					}
					resolve();
				});
			});
		}
	}.bind(this));
	
	return sequence;
};


EnnemiesManager.prototype.getPath = function(from, to) { // Bresenham algo
	var coordinates = [];
	
	var dx = Math.abs(to.x - from.x), sx = from.x < to.x ? 1 : -1;
	var dy = Math.abs(to.y - from.y), sy = from.y < to.y ? 1 : -1; 
	var err = (dx>dy ? dx : -dy)/2;

	while (true) {
		coordinates.push({x: from.x, y: from.y});
		if (from.x === to.x && from.y === to.y) break;
		var e2 = err;
		if (e2 > -dx) { err -= dy; from.x += sx; }
		if (e2 < dy) { err += dx; from.y += sy; }
	}
	
	return coordinates;
}
