(function (window) {
    'use strict';

    function PathManager() {}

    /**
     * Calcul des coordonnées du chemin
     * (Bresenham algo)
     *
     * @param {Object} from From position
     * @param {Object} to   To position
     */
    PathManager.prototype.buildPath = function (from, to) {
        var coordinates = [];

        var dx = Math.abs(to.x - from.x),
            sx = from.x < to.x ? 1 : -1;
        var dy = Math.abs(to.y - from.y),
            sy = from.y < to.y ? 1 : -1;
        var err = (dx > dy ? dx : -dy) / 2;

        // TODO revoir cette condition avec le if
        while (true) {
            coordinates.push({
                x: from.x,
                y: from.y
            });
            if (from.x === to.x && from.y === to.y) {
                break;
            }
            var e2 = err;
            if (e2 > -dx) {
                err -= dy;
                from.x += sx;
            }
            if (e2 < dy) {
                err += dx;
                from.y += sy;
            }
        }

        return coordinates;
    };

    window.PathManager = PathManager;

})(window);
