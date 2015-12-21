(function (window) {
    'use strict';

    function Resources(sprites) {
        this.sprites = sprites;
        this.images = {};
    }

    Resources.prototype.loadSprites = function (spriteList) {

        var promises = spriteList.map(function (element) {
            return this.loadSprite(element);
        }.bind(this));

        return Promise.all(promises);
    };

    Resources.prototype.loadSprite = function (sprite) {

        return new Promise(function (resolve, reject) {
            var image = this.images[sprite.title];

            // if image already load use cache
            if (image) {
                resolve(sprite);
            } else {
                image = new Image();

                image.src = sprite.url;

                this.sprites.push(sprite);
                this.images[sprite.title] = image;
                image.onload = function () {
                    resolve(image);
                }.bind(this);

                image.onerror = function () {
                    this.images[sprite.title] = undefined;
                    reject(sprite);
                };
            }
        }.bind(this));

    };

    Resources.prototype.load = function () {
        return this.loadSprites(this.sprites);
    };

    window.Resources = Resources;

})(window);
