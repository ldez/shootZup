(function () {
    'use strict';

    function Spaceship(x, y, imageName, frameSize, hitboxSize, fly, resources) {
        this.resources = resources;
        this.imageName = imageName;

        // Taille en pixels de la hitbox
        this.hitboxSize = hitboxSize;

        var animations = {
            'FLY': fly
        };

        Sprite.call(this, x, y, frameSize, animations);
    }

    Spaceship.prototype = Object.create(Sprite.prototype);

    Spaceship.prototype.FLY = 'FLY';

    Spaceship.prototype.paint = function (context) {

        if (this.currentState === this.FLY) {
            context.drawImage(this.resources.images[this.imageName],
                this.currentAnimationFrame * this.frameSize.width, this.animationY,
                this.frameSize.width, this.frameSize.height,
                // centrage de l'image par rapport à la position
                this.x - (this.frameSize.width / 2), this.y - this.frameSize.height + (this.frameSize.height / 2),
                this.frameSize.width, this.frameSize.height
            );
        }
    };

    Spaceship.prototype.hitbox = function () {
        return new RectangleHitBox(this, this.hitboxSize.width / 2, this.hitboxSize.height / 2);
    };

    window.Spaceship = Spaceship;

})();
