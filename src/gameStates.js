(function (window) {
    'use strict';

    function GameState() {
        this.current = this.LOADING;
    }

    GameState.prototype.LOADING = 0;
    GameState.prototype.PLAYING = 1;
    GameState.prototype.DEATH = 2;
    GameState.prototype.FINISHED = 3;

    GameState.prototype.play = function () {
        this.current = this.PLAYING;
    };
    GameState.prototype.isPlaying = function () {
        return this.current === this.PLAYING;
    };

    GameState.prototype.death = function () {
        this.current = this.DEATH;
    };

    GameState.prototype.isDead = function () {
        return this.current === this.DEATH;
    };

    GameState.prototype.finished = function () {
        this.current = this.FINISHED;
    };

    GameState.prototype.isFinished = function () {
        return this.current === this.FINISHED;
    };

    window.GameState = GameState;

})(window);
