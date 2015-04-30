(function (window) {
    'use strict';

    function GameState() {
        this.current = this.LOADING;
        this.playerState = this.LOADING;
        this.scores = {};
        this.highscores = [];
    }

    GameState.prototype.MAX_HIGHSCORE = 5;

    GameState.prototype.LOADING = 0;
    GameState.prototype.PLAYING = 1;
    GameState.prototype.GAMEOVER = 2;
    GameState.prototype.FINISHED = 3;

    GameState.prototype.play = function () {
        this.scores.player1 = 0;
        this.playerState = this.PLAYING;
        this.current = this.PLAYING;
    };

    GameState.prototype.isPlaying = function () {
        return this.current === this.PLAYING;
    };

    GameState.prototype.gameOver = function () {
        this.playerState = this.GAMEOVER;
        this.current = this.GAMEOVER;
    };

    GameState.prototype.isGameOver = function () {
        return this.current === this.GAMEOVER;
    };

    GameState.prototype.finished = function (playerName) {
        this.addHighscore(playerName, this.scores.player1);
        this.current = this.FINISHED;
    };

    GameState.prototype.isFinished = function () {
        return this.current === this.FINISHED;
    };

    GameState.prototype.isPlayerWin = function () {
        return this.playerState === this.PLAYING;
    };

    GameState.prototype.addHighscore = function (name, score) {
        this.highscores.push({
            name: name,
            score: score,
            date: new Date()
        });

        function compareDesc(a, b) {
            if (a < b) {
                return 1;
            }
            if (a > b) {
                return -1;
            }
            return 0;
        }


        this.highscores.sort(
            function compare(a, b) {
                var result = compareDesc(a.score, b.score);

                if (!result) {
                    result = compareDesc(a.date, b.date);
                }
                return result;
            });

        var highscoresLength = this.highscores.length;
        if (highscoresLength > this.MAX_HIGHSCORE) {
            this.highscores.splice(this.MAX_HIGHSCORE, highscoresLength - 2);
        }
    };

    window.GameState = GameState;

})(window);
