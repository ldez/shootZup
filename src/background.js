(function (window) {
    'use strict';

    function Background(resources) {

        this.canvasHeight = 640;
        this.backgrounds = [];

        this.backgrounds[0] = {
            background: resources.images['sky'],
            width: 480,
            height: 1280,
            scrollValue: 0.2,
            scrolled: 0
        };

        this.backgrounds[1] = {
            background: resources.images['stars'],
            width: 480,
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
