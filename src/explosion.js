(function (window) {
    'use strict';

    function Explosion(x, y, resources) {
        this.resources = resources;

        // Position de l'animation courante parmi les frames
        this.currentAnimationFrame = 0;

        // Positions
        this.x = x;
        this.y = y;

        // Taille en pixels d'une frame d'animation
        this.animationFrameWidth = 44;
        this.animationFrameHeight = 46;

        // Sert à controler la boucle d'animation
        this.animationLoop;

        this.currentState;

        this.animations = {
            'BOOM': {
                nbFrames: 16
            }
        };
    }
    Explosion.prototype = new Sprite();

    Explosion.prototype.BOOM = 'BOOM';

    Explosion.prototype.paint = function (context) {

        context.drawImage(this.resources.images['boom'],
            this.currentAnimationFrame * this.animationFrameWidth,
            0,
            this.animationFrameWidth,
            this.animationFrameHeight,
            this.x - (this.animationFrameWidth / 2), // centrage de l'image par rapport à la position
            this.y - this.animationFrameHeight + (this.animationFrameHeight / 2), // centrage de l'image par rapport à la position
            this.animationFrameWidth,
            this.animationFrameHeight
        );
    };


    Explosion.prototype.startOnce = function (animation, callback) {
        if (this.currentState !== animation) {
            this.clearCurrentAnimation();
            this.currentState = animation;

            this.animationLoop = setTimeout(function () {
                this.animOnce(animation, callback);
            }.bind(this), 50);
        }
    };

    Explosion.prototype.animOnce = function (animation, callback) {
        this.currentAnimationFrame += 1;

        if (this.currentAnimationFrame !== this.animations[animation].nbFrames) {
            this.animationLoop = setTimeout(function () {
                this.animOnce(animation, callback);
            }.bind(this), 50);
        } else {
            callback();
        }
    };

    window.Explosion = Explosion;

})(window);
