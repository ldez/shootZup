(function (window) {
    'use strict';

    function Sprite() {
        // Position de l'animation courante parmi les frames
        this.currentAnimationFrame = 0;

        // Sert à controler la boucle d'animation
        this.animationLoop;

        this.animations = {};

        this.currentState;
    }

    Sprite.prototype.clearCurrentAnimation = function () {
        this.currentAnimationFrame = 0;
        clearTimeout(this.animationLoop);
    };

    Sprite.prototype.startLoop = function (animation) {
        if (this.currentState !== animation) {
            this.clearCurrentAnimation();
            this.animationY = this.animations[animation].animationY;
            this.animationFrameWidth = this.animations[animation].animationFrameWidth;

            this.currentState = animation;

            this.animationLoop = setTimeout(function () {
                this.animLoop(animation);
            }.bind(this), this.animations[animation].speedRate);
        }
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
