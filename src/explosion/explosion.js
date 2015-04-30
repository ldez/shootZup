(function (window) {
    'use strict';

    function Explosion(x, y, resources) {
        this.resources = resources;

        var frameSize = {
                width: 44,
                height: 46
            },
            animations = {
                'BOOM': {
                    nbFrames: 16,
                    speedRate: 50
                }
            };

        Sprite.call(this, x, y, frameSize, animations);
    }

    Explosion.prototype = Object.create(Sprite.prototype);

    Explosion.prototype.BOOM = 'BOOM';

    Explosion.prototype.paint = function (context) {
        context.drawImage(this.resources.images.boom,
            this.currentAnimationFrame * this.frameSize.width, 0,
            this.frameSize.width, this.frameSize.height,
            // centrage de l'image par rapport à la position
            this.x - (this.frameSize.width / 2), this.y - this.frameSize.height + (this.frameSize.height / 2),
            this.frameSize.width, this.frameSize.height
        );
    };

    window.Explosion = Explosion;

})(window);
