(function (window) {
    'use strict';

    function BulletsManager(resources, pathManager) {
        this.resources = resources;
        this.pathManager = pathManager;
        this.bullets = [];
    }

    BulletsManager.prototype.reset = function () {
        this.bullets.splice(0, this.bullets.length);
    };

    BulletsManager.prototype.paint = function (context) {
        this.bullets.forEach(function (bullet) {
            bullet.paint(context);
        });
    };

    BulletsManager.prototype.fire = function (commands, ennemy) {
        var bullet = new Bullet(commands.id, ennemy.x, ennemy.y, this.resources);
        this.bullets.push(bullet);

        var path = this.pathManager.buildPath({
            x: bullet.x,
            y: bullet.y
        }, {
            x: commands.x,
            y: commands.y
        });

        bullet.action(path).then(function (value) {
            this.bullets.splice(this.bullets.indexOf(value), 1);
        }.bind(this));
    };

    window.BulletsManager = BulletsManager;

})(window);
