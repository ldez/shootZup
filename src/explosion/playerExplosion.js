(function (window) {
    'use strict';

    function PlayerExplosion(x, y, resources) {
        this.resources = resources;

        var frameSize = {
                width: 120,
                height: 220
            },
            animations = {
                'BOOM': {
                    nbFrames: 21,
                    speedRate: 50
                }
            };

        Sprite.call(this, x, y, frameSize, animations);
    }

    PlayerExplosion.prototype = Object.create(Sprite.prototype);

    PlayerExplosion.prototype.BOOM = 'BOOM';

    PlayerExplosion.prototype.paint = function (context) {
        context.drawImage(this.resources.images.bigboom,
            this.currentAnimationFrame * this.frameSize.width, 0,
            this.frameSize.width, this.frameSize.height,
            // centrage de l'image par rapport à la position
            this.x - (this.frameSize.width / 2), this.y - this.frameSize.height + (this.frameSize.height / 4),
            this.frameSize.width, this.frameSize.height
        );
    };

    window.PlayerExplosion = PlayerExplosion;

})(window);
