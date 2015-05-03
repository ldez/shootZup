(function (window) {
    'use strict';

    function PathManager() {}

    /**
     * Calcul des coordonnées du chemin
     * (Bresenham algo)
     * @param   {Object} from From position
     * @param   {Object} to   To position
     * @returns {Object} Promesse des coordonnées du chemin
     */
    PathManager.prototype.buildPath = function (from, to) {
        return new Promise(function (resolve) {
            var coordinates = [];

            var dx = Math.abs(to.x - from.x),
                sx = from.x < to.x ? 1 : -1;
            var dy = Math.abs(to.y - from.y),
                sy = from.y < to.y ? 1 : -1;
            var err = (dx > dy ? dx : -dy) / 2;

            while (from.x !== to.x || from.y !== to.y) {
                coordinates.push({
                    x: from.x,
                    y: from.y
                });
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
            resolve(coordinates);
        });
    };

    window.PathManager = PathManager;

})(window);
