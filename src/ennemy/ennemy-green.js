(function (window) {
    'use strict';

    function EnnemyGreen(command, resources) {

        // Taille en pixels d'une frame d'animation
        var frameSize = {
                width: 35,
                height: 37
            },
            // Taille en pixels de la hitbox
            hitboxSize = {
                width: frameSize.width,
                height: frameSize.height
            },
            // paramètre de l'animation
            fly = {
                nbFrames: 6,
                animationFrameWidth: frameSize.width,
                animationY: 0,
                speedRate: 50
            };

        Ennemy.call(this, command, 'ennemy-green', frameSize, hitboxSize, fly, resources);
    }

    EnnemyGreen.prototype = Object.create(Ennemy.prototype);

    window.EnnemyGreen = EnnemyGreen;

})(window);
