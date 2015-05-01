(function (window) {
    'use strict';

    function AudioManager(soundDescriptors) {
        this.sounds = {};
        this.soundDescriptors = soundDescriptors || {};
        this.mute = false;

        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new window.AudioContext();
        } catch (e) {
            window.alert('API Audio non supportée.');
        }
    }

    AudioManager.prototype.loadSounds = function (soundDescriptors) {

        var promises = soundDescriptors.map(function (soundDescriptor) {
            var sound = this.sounds[soundDescriptor.title];

            if (!sound) {
                this.sounds[soundDescriptor.title] = {
                    title: soundDescriptor.title,
                    url: soundDescriptor.url
                };
                return this.loadSound(this.sounds[soundDescriptor.title]);
            }
            return sound;
        }.bind(this));

        return Promise.all(promises);
    };

    AudioManager.prototype.loadSound = function (sound) {

        return new Promise(function (resolve, reject) {

            if (sound.buffer) {
                resolve(sound);
            } else {
                var request = new XMLHttpRequest();
                request.open('GET', sound.url, true);
                request.responseType = 'arraybuffer';

                request.onload = function () {
                    this.audioContext.decodeAudioData(
                        request.response,
                        function (buffer) {
                            sound.buffer = buffer;
                            resolve(sound);
                        }.bind(this),
                        function (error) {
                            console.error('Fail to decodeAudioData [%s]', sound.url, error);
                            reject(sound);
                        }
                    );
                }.bind(this);

                request.onerror = function (event) {
                    reject(new Error("Erreur XMLHttpRequest", event));
                };

                request.send();
            }

        }.bind(this));
    };

    AudioManager.prototype.load = function () {
        return this.loadSounds(this.soundDescriptors);
    };

    AudioManager.prototype.stageBgm = function () {
        return this.play(this.sounds.stage, true, 0, 0);
    };

    AudioManager.prototype.laser = function () {
        return this.play(this.sounds.laser, false);
    };

    AudioManager.prototype.toogleMute = function () {
        this.mute = !this.mute;
        if (this.mute) {
            this.sounds.stage.source.stop(0);
        } else {
            this.stageBgm();
        }
        return this.mute;
    };

    AudioManager.prototype.play = function (sound, loop, loopStart, loopEnd) {
        return new Promise(function (resolve) {
            if (!this.mute) {
                var source = this.audioContext.createBufferSource();
                sound.source = null;
                sound.source = source;

                source.buffer = sound.buffer;
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
            }
        }.bind(this));
    };

    window.AudioManager = AudioManager;

})(window);
