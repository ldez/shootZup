(function (window) {
    'use strict';

    function SpaceshipBlue(x, y, resources) {

        // Taille en pixels d'une frame d'animation
        var frameSize = {
                width: 55,
                height: 60
            },
            // Taille en pixels de la hitbox
            hitboxSize = {
                width: 40,
                height: 45
            },
            // paramètre de l'animation
            fly = {
                nbFrames: 12,
                animationFrameWidth: 55,
                animationY: 0,
                speedRate: 15
            };

        Spaceship.call(this, x, y, 'spaceship-blue', frameSize, hitboxSize, fly, resources);
    }

    SpaceshipBlue.prototype = Object.create(Spaceship.prototype);

    window.SpaceshipBlue = SpaceshipBlue;

})(window);
