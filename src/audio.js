(function (window) {
    'use strict';

    function Audio(sounds) {
        this.sounds = sounds || {};
        this.soundBuffers = {};
        this.loadCount = 0;
        this.playingSound = false;

        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new window.AudioContext();
        } catch (e) {
            window.alert('API Audio non supportée.');
        }
    }

    Audio.prototype.loadSounds = function (soundList) {

        var promises = [];
        soundList.forEach(function (element) {
            promises.push(this.loadSound(element));
        }.bind(this));
        return Promise.all(promises);
    };

    Audio.prototype.loadSound = function (sound) {

        var p = new Promise(function (resolve, reject) {

            if (this.soundBuffers[sound.title]) {
                resolve(sound);
            } else {
                var request = new XMLHttpRequest();
                request.open('GET', sound.url, true);
                request.responseType = 'arraybuffer';

                request.onload = function () {
                    this.audioContext.decodeAudioData(
                        request.response,
                        function (buffer) {
                            this.soundBuffers[sound.title] = buffer;
                            resolve(sound);
                        }.bind(this),
                        function (error) {
                            console.error('Fail to decodeAudioData [%s]', sound.url, error);
                            reject(sound);
                        }
                    );
                }.bind(this);

                request.send();
            }

        }.bind(this));

        return p;
    };

    Audio.prototype.load = function () {
        return this.loadSounds(this.sounds);
    };

    Audio.prototype.stageBgm = function () {
        this.play(this.soundBuffers.stage, true, 0, 0);
    };

    Audio.prototype.laser = function () {
        this.play(this.soundBuffers.laser, false);
    };

    Audio.prototype.play = function (sound, loop, loopStart, loopEnd, callback) {
        var source = this.audioContext.createBufferSource();
        source.buffer = sound;
        source.loop = loop;
        if (loop) {
            source.loopStart = loopStart;
            source.loopEnd = loopEnd;
        }

        if (typeof callback === 'function') {
            source.onended = callback;
        }

        source.connect(this.audioContext.destination);
        source.start(0);
    };

    window.Audio = Audio;

})(window);
