(function (window) {
    'use strict';

    function SquareHitBox(center, size) {

        var minX = center.x - size / 2;
        var maxX = center.x + size / 2;
        var minY = center.y - size / 2;
        var maxY = center.y + size / 2;

        HitBox.call(this, minX, maxX, minY, maxY);
    }

    SquareHitBox.prototype = Object.create(HitBox.prototype);

    window.SquareHitBox = SquareHitBox;

})(window);
