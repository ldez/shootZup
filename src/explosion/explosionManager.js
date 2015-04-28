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

    ExplosionManager.prototype.exploded = function (x, y, beforeExploded) {
        var explosion = new Explosion(x, y, this.resources);

        this.exploding.push(explosion);

        explosion.startOnce(explosion.BOOM, function () {
            this.exploding.splice(this.exploding.indexOf(explosion), 1);
            if (beforeExploded && typeof (beforeExploded) === 'function') {
                beforeExploded();
            }
        }.bind(this));
    };

    window.ExplosionManager = ExplosionManager;

})(window);
