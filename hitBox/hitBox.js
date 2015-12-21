(function (window) {
    'use strict';

    /**
     * HitBox
     *
     *       maxY
     *        |
     * minX---|---maxX
     *        |
     *       minY
     *
     * @param {Number} minX Position X minimum
     * @param {Number} maxX Position X maximum
     * @param {Number} minY Position Y minimum
     * @param {Number} maxY Position Y maximum
     */
    function HitBox(minX, maxX, minY, maxY) {
        this.minX = minX || 0;
        this.maxX = maxX || 0;
        this.minY = minY || 0;
        this.maxY = maxY || 0;
    }

    /**
     * Evaluation d'une collision avec une autre HitBox
     * @param   {Object}  hitbox HitBox à tester
     * @returns {Boolean} true si la HitBox est en collision avec la HitBox à tester
     */
    HitBox.prototype.collision = function (hitbox) {
        return this.minX < hitbox.maxX &&
            this.maxX > hitbox.minX &&
            this.minY < hitbox.maxY &&
            this.maxY > hitbox.minY;
    };

    window.HitBox = HitBox;

})(window);
