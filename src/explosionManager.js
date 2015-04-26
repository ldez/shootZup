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

    ExplosionManager.prototype.plaverExploded = function (physics, callback) {
        var explosion = new Explosion(physics.x, physics.y, this.resources);

        this.exploding.push(explosion);

        explosion.startOnce(explosion.BOOM, function () {
            this.exploding.splice(this.exploding.indexOf(explosion), 1);

            callback();
        }.bind(this));
    };

    window.ExplosionManager = ExplosionManager;

})(window);
