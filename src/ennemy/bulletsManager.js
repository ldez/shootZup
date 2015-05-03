(function (window) {
    'use strict';

    function BulletsManager(resources, botPhysicManager) {

        this.resources = resources;
        this.botPhysicManager = botPhysicManager;
        this.bullets = [];
    }

    BulletsManager.prototype.reset = function () {

        this.bullets.forEach(function (bullet) {
            this.botPhysicManager.clearMove(bullet);
        }.bind(this));

        this.bullets.splice(0, this.bullets.length);
    };

    BulletsManager.prototype.paint = function (context) {
        this.bullets.forEach(function (bullet) {
            bullet.paint(context);
        });
    };

    BulletsManager.prototype.fire = function (ennemy, commands) {

        var bullet = new Bullet(commands.id, ennemy.x, ennemy.y, this.resources);
        this.bullets.push(bullet);

        this.botPhysicManager.moveOnpath(bullet, commands).then(function (bot) {
            this.bullets.splice(this.bullets.indexOf(bot), 1);
        }.bind(this));
    };

    window.BulletsManager = BulletsManager;

})(window);
