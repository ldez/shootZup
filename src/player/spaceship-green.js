(function (window) {
    'use strict';

    function SpaceshipGreen(x, y, resources) {

        // Taille en pixels d'une frame d'animation
        var frameSize = {
                width: 86,
                height: 37
            },
            // Taille en pixels de la hitbox
            hitboxSize = {
                width: 45,
                height: 45
            },
            // paramètre de l'animation
            fly = {
                nbFrames: 6,
                animationFrameWidth: 86,
                animationY: 0,
                speedRate: 15
            };

        Spaceship.call(this, x, y, 'spaceship-green-large', frameSize, hitboxSize, fly, resources);
    }

    SpaceshipGreen.prototype = Object.create(Spaceship.prototype);

    window.SpaceshipGreen = SpaceshipGreen;

})(window);
