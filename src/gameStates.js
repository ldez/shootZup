(function (window) {
    'use strict';

    function GameState() {
        this.current = this.LOADING;
    }

    GameState.prototype.LOADING = 0;
    GameState.prototype.PLAYING = 1;
    GameState.prototype.GAMEOVER = 2;
    GameState.prototype.FINISHED = 3;

    GameState.prototype.play = function () {
        this.current = this.PLAYING;
    };
    GameState.prototype.isPlaying = function () {
        return this.current === this.PLAYING;
    };

    GameState.prototype.gameOver = function () {
        this.current = this.GAMEOVER;
    };

    GameState.prototype.isGameOver = function () {
        return this.current === this.GAMEOVER;
    };

    GameState.prototype.finished = function () {
        this.current = this.FINISHED;
    };

    GameState.prototype.isFinished = function () {
        return this.current === this.FINISHED;
    };

    window.GameState = GameState;

})(window);
