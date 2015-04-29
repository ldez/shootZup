(function (window) {
    'use strict';

    /**
     * Fond d'écran simple
     *
     * @param {Object} resources  Gestionnaire d'images
     * @param {Object} canvasSize Taille du canvas
     */
    function Background(resources, canvasSize) {

        this.backgrounds = [];

        this.backgrounds[0] = {
            background: resources.images.sky,
            width: canvasSize.width,
            height: 1280,
            scrollValue: 0.2,
            scrolled: 0
        };

        this.backgrounds[1] = {
            background: resources.images.stars,
            width: canvasSize.width,
            height: 1680,
            scrollValue: 2,
            scrolled: 0
        };
    }

    Background.prototype.paint = function (context) {

        for (var i = 0; i < this.backgrounds.length; i++) {

            this.backgrounds[i].scrolled += this.backgrounds[i].scrollValue;
            context.drawImage(this.backgrounds[i].background, 0, this.backgrounds[i].scrolled);

            if (this.backgrounds[i].scrolled > 0) {
                context.drawImage(this.backgrounds[i].background, 0, -this.backgrounds[i].height + this.backgrounds[i].scrolled);
            }

            if (this.backgrounds[i].scrolled > this.backgrounds[i].height) {
                this.backgrounds[i].scrolled = 0;
            }
        }
    };

    window.Background = Background;

})(window);
