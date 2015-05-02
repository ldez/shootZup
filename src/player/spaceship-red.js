(function (window) {
    'use strict';

    function SpaceshipRed(x, y, resources) {

        // Taille en pixels d'une frame d'animation
        var frameSize = {
                width: 70,
                height: 62
            },
            // Taille en pixels de la hitbox
            hitboxSize = {
                width: 45,
                height: 45
            },
            // paramètre de l'animation
            fly = {
                nbFrames: 32,
                animationFrameWidth: frameSize.width,
                animationY: 0,
                speedRate: 15
            };

        Spaceship.call(this, x, y, 'spaceship-red', frameSize, hitboxSize, fly, resources);
    }

    SpaceshipRed.prototype = Object.create(Spaceship.prototype);

    window.SpaceshipRed = SpaceshipRed;

})(window);
