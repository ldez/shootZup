(function (window) {
    'use strict';

    function AudioManager(soundDescriptors, mute) {
        this.sounds = {};
        this.soundDescriptors = soundDescriptors || [];
        this.mute = !!mute;

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
                    url: soundDescriptor.url,
                    initialGain: soundDescriptor.initialGain || 1
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


    AudioManager.prototype.play = function (sound, loop, loopStart, loopEnd) {
        return new Promise(function (resolve) {
            var source = this.audioContext.createBufferSource();
            sound.source = source;

            source.buffer = sound.buffer;

            // Controle du volume
            var gainNode = this.audioContext.createGain ? this.audioContext.createGain() : this.audioContext.createGainNode();
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            sound.gainNode = gainNode;
            gainNode.gain.value = this.mute ? -1 : sound.initialGain;

            // Gestion des boucles sonores
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

    AudioManager.prototype.muteSound = function (sound) {
        if (sound.source) {
            sound.gainNode.gain.value = -1;
        }
    };
    AudioManager.prototype.resumeSound = function (sound) {
        if (sound.source) {
            sound.gainNode.gain.value = sound.initialGain;
        }
    };

    AudioManager.prototype.stopSound = function (sound) {
        if (sound.source) {
            sound.source.stop(0);
        }
    };

    /*
     * Méthodes de lecture spécifique des sons
     */

    AudioManager.prototype.stageBgm = function () {
        return this.play(this.sounds.stage, true, 0, 0);
    };

    AudioManager.prototype.laser = function () {
        return this.play(this.sounds.laser);
    };

    AudioManager.prototype.boom = function () {
        return this.play(this.sounds.boom);
    };

    AudioManager.prototype.foom = function () {
        return this.play(this.sounds.foom);
    };

    AudioManager.prototype.toogleMute = function () {
        this.mute = !this.mute;
        if (this.mute) {
            this.muteSound(this.sounds.stage);
        } else {
            this.resumeSound(this.sounds.stage);
        }
        return this.mute;
    };

    window.AudioManager = AudioManager;

})(window);
