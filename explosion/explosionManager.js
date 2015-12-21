(function (window) {
    'use strict';

    function ExplosionManager(resources, audioManager) {
        this.resources = resources;
        this.audioManager = audioManager;
        this.exploding = [];
    }

    ExplosionManager.prototype.paint = function (context) {
        this.exploding.forEach(function (explosion) {
            explosion.paint(context);
        });
    };

    ExplosionManager.prototype.ennemyExploded = function (x, y) {
        return new Promise(function (resolve) {

            var explosion = new Explosion(x, y, this.resources);

            this.exploding.push(explosion);

            this.audioManager.foom()

            explosion.startOnce(explosion.BOOM).then(function (boom) {
                this.exploding.splice(this.exploding.indexOf(explosion), 1);
                resolve(boom);
            }.bind(this));
        }.bind(this));
    };

    ExplosionManager.prototype.playerExploded = function (x, y) {
        return new Promise(function (resolve) {
            var explosion = new PlayerExplosion(x, y, this.resources);

            this.exploding.push(explosion);

            this.audioManager.boom();

            explosion.startOnce(explosion.BOOM)
                .then(function (boom) {
                    this.exploding.splice(this.exploding.indexOf(explosion), 1);
                    resolve(boom);
                }.bind(this));
        }.bind(this));
    };

    window.ExplosionManager = ExplosionManager;

})(window);
