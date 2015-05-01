(function (window) {
    'use strict';

    function AudioManager(soundDescriptors) {
        this.soundDescriptors = soundDescriptors || {};
        this.soundBuffers = {};
        this.bufferSources = {};
        this.loadCount = 0;
        this.playingSound = false;

        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new window.AudioContext();
        } catch (e) {
            window.alert('API Audio non supportée.');
        }
    }

    AudioManager.prototype.loadSounds = function (soundDescriptors) {

        var promises = soundDescriptors.map(function (soundDescriptor) {
            return this.loadSound(soundDescriptor);
        }.bind(this));

        return Promise.all(promises);
    };

    AudioManager.prototype.loadSound = function (soundDescriptor) {

        return new Promise(function (resolve, reject) {

            if (this.soundBuffers[soundDescriptor.title]) {
                resolve(soundDescriptor);
            } else {
                var request = new XMLHttpRequest();
                request.open('GET', soundDescriptor.url, true);
                request.responseType = 'arraybuffer';

                request.onload = function () {
                    this.audioContext.decodeAudioData(
                        request.response,
                        function (buffer) {
                            this.soundBuffers[soundDescriptor.title] = buffer;
                            resolve(soundDescriptor);
                        }.bind(this),
                        function (error) {
                            console.error('Fail to decodeAudioData [%s]', soundDescriptor.url, error);
                            reject(soundDescriptor);
                        }
                    );
                }.bind(this);

                request.onerror = function (event) {
                    reject("Erreur XMLHttpRequest ", event);
                };

                request.send();
            }

        }.bind(this));
    };

    AudioManager.prototype.load = function () {
        return this.loadSounds(this.soundDescriptors);
    };

    AudioManager.prototype.stageBgm = function () {
        return this.play(this.soundBuffers.stage, true, 0, 0);
    };

    AudioManager.prototype.laser = function () {
        return this.play(this.soundBuffers.laser, false);
    };

    AudioManager.prototype.mute = function () {
        this.source.stop(0);
    };

    AudioManager.prototype.play = function (sound, loop, loopStart, loopEnd) {
        return new Promise(function (resolve) {

            var source = this.audioContext.createBufferSource();
            source.buffer = sound;
            source.loop = loop;

            if (loop) {
                source.loopStart = loopStart;
                source.loopEnd = loopEnd;

                resolve(source);
            }

            source.onended = function () {
                if (!loop) {
                    resolve(source);
                }
            };

            source.connect(this.audioContext.destination);
            source.start(0);
        }.bind(this));
    };

    window.AudioManager = AudioManager;

})(window);
