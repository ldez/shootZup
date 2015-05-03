(function (window) {
    'use strict';

    function EnnemyBlue(command, resources) {

        // Taille en pixels d'une frame d'animation
        var frameSize = {
                width: 32,
                height: 32
            },
            // Taille en pixels de la hitbox
            hitboxSize = {
                width: frameSize.width,
                height: frameSize.height
            },
            // paramètre de l'animation
            fly = {
                nbFrames: 3,
                animationFrameWidth: frameSize.width,
                animationY: 0,
                speedRate: 100
            };

        Ennemy.call(this, command, 'ennemy-blue', frameSize, hitboxSize, fly, resources);
    }

    EnnemyBlue.prototype = Object.create(Ennemy.prototype);

    window.EnnemyBlue = EnnemyBlue;

})(window);
