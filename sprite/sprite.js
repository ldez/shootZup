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
        this.animationLoopTimeoutId = null;
        this.animationLoopIntervalId = null;

        this.currentState = '';
    }

    Sprite.prototype.clearCurrentAnimation = function () {

        this.currentAnimationFrame = 0;

        if (this.animationLoopIntervalId) {
            clearInterval(this.animationLoopIntervalId);
        }
        if (this.animationLoopTimeoutId) {
            clearTimeout(this.animationLoopTimeoutId);
        }
    };

    Sprite.prototype.startLoop = function (animationName) {
        return new Promise(function (resolve) {

            if (this.currentState !== animationName) {
                this.clearCurrentAnimation();

                var animation = this.animations[animationName];
                this.animationY = animation.animationY;
                // FIXME utile ?
                this.frameSize.width = animation.animationFrameWidth;

                this.currentState = animationName;

                this.animationLoopIntervalId = setInterval(function () {
                    this.animLoop(animationName);
                }.bind(this), animation.speedRate);
                resolve();
            }

        }.bind(this));
    };

    Sprite.prototype.animLoop = function (animationName) {
        this.currentAnimationFrame += 1;
        if (this.currentAnimationFrame === this.animations[animationName].nbFrames) {
            this.currentAnimationFrame = 0;
        }
    };


    Sprite.prototype.startOnce = function (animationName) {
        return new Promise(function (resolve) {

            if (this.currentState !== animationName) {
                this.clearCurrentAnimation();
                this.currentState = animationName;

                this.animationLoopTimeoutId = setTimeout(function () {
                    this.animOnce(animationName).then(function () {
                        resolve();
                    });
                }.bind(this), this.animations[animationName].speedRate);
            }

        }.bind(this));
    };

    Sprite.prototype.animOnce = function (animationName) {
        return new Promise(function (resolve) {

            this.currentAnimationFrame += 1;
            if (this.currentAnimationFrame !== this.animations[animationName].nbFrames) {
                this.animationLoopTimeoutId = setTimeout(function () {
                    this.animOnce(animationName).then(function () {
                        resolve();
                    });
                }.bind(this), this.animations[animationName].speedRate);
            } else {
                resolve();
            }
        }.bind(this));
    };


    window.Sprite = Sprite;

})(window);
