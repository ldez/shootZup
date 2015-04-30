(function (window) {
    'use strict';

    function Sprite(x, y, frameSize, animations) {

        // Position de l'animation courante parmi les frames
        this.currentAnimationFrame = 0;

        // Taille en pixels d'une frame d'animation
        this.frameSize = frameSize;

        // Positions
        this.x = x;
        this.y = y;

        // Description de l'animation
        this.animations = animations;

        // Position y de l'animation courante dans le sprite général.
        this.animationY = 0;

        // Sert à controler la boucle d'animation
        this.animationLoop = null;

        this.currentState = '';
    }

    Sprite.prototype.clearCurrentAnimation = function () {
        this.currentAnimationFrame = 0;
        if (this.animationLoop) {
            clearTimeout(this.animationLoop);
        }
    };

    Sprite.prototype.startLoop = function (animation) {
        return new Promise(function (resolve) {
            if (this.currentState !== animation) {
                this.clearCurrentAnimation();
                this.animationY = this.animations[animation].animationY;
                this.frameSize.width = this.animations[animation].animationFrameWidth;

                this.currentState = animation;

                this.animationLoop = setTimeout(function () {
                    this.animLoop(animation);
                    resolve();
                }.bind(this), this.animations[animation].speedRate);
            }
        }.bind(this));
    };

    Sprite.prototype.animLoop = function (animation) {
        this.currentAnimationFrame += 1;
        if (this.currentAnimationFrame === this.animations[animation].nbFrames) {
            this.currentAnimationFrame = 0;
        }

        this.animationLoop = setTimeout(function () {
            this.animLoop(animation);
        }.bind(this), this.animations[animation].speedRate);
    };

    window.Sprite = Sprite;

})(window);
