(function (window) {
    'use strict';

    function ExplosionManager(resources) {
        this.resources = resources;
        this.exploding = [];
    }

    ExplosionManager.prototype.paint = function (context) {
        this.exploding.forEach(function (explosion) {
            explosion.paint(context);
        });
    };

    ExplosionManager.prototype.exploded = function (x, y) {
        return new Promise(function (resolve) {
            var explosion = new Explosion(x, y, this.resources);

            this.exploding.push(explosion);

            explosion.startOnce(explosion.BOOM).then(function (boom) {
                this.exploding.splice(this.exploding.indexOf(explosion), 1);
                resolve(boom);
            }.bind(this));
        }.bind(this));
    };

    window.ExplosionManager = ExplosionManager;

})(window);
