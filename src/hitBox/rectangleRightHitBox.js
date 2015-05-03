(function (window) {
    'use strict';

    function RectangleRightHitBox(center, width, height) {

        var minX = center.x;
        var maxX = center.x + width;
        var minY = center.y - height;
        var maxY = center.y;

        HitBox.call(this, minX, maxX, minY, maxY);
    }

    RectangleRightHitBox.prototype = Object.create(HitBox.prototype);

    window.RectangleRightHitBox = RectangleRightHitBox;

})(window);
