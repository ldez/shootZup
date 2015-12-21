(function (window) {
    'use strict';

    function RectangleHitBox(center, width, height) {

        var minX = center.x - width;
        var maxX = center.x + width;
        var minY = center.y - height;
        var maxY = center.y + height;

        HitBox.call(this, minX, maxX, minY, maxY);
    }

    RectangleHitBox.prototype = Object.create(HitBox.prototype);

    window.RectangleHitBox = RectangleHitBox;

})(window);
