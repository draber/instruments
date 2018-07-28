var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("app/ts/models/note/Scales", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var scales = {
        sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
        flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
    };
    exports.default = scales;
});
define("app/ts/models/note/Note", ["require", "exports", "app/ts/models/note/Scales"], function (require, exports, Scales_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Scales_1 = __importDefault(Scales_1);
    var Note = (function () {
        function Note(note) {
            this._frequencies = {
                'C': 16.35,
                'C♯': 17.32,
                'D♭': 17.32,
                'D': 18.35,
                'D♯': 19.45,
                'E♭': 19.45,
                'E': 20.60,
                'F': 21.83,
                'F♯': 23.12,
                'G♭': 23.12,
                'G': 24.50,
                'G♯': 25.96,
                'A♭': 25.96,
                'A': 27.50,
                'A♯': 29.14,
                'B♭': 29.14,
                'B': 30.87
            };
            this._octaves = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
            var data = this.getNoteData(note);
            if (null === data) {
                throw new TypeError(note + ' is in an unknown format');
            }
            this._position = data.position;
            this._octave = data.octave;
            this._scale = data.scale;
        }
        Note.prototype.getNoteData = function (note) {
            if (note instanceof Note) {
                return {
                    position: Note.position,
                    octave: Note.octave,
                    scale: Note.scale
                };
            }
            var data = this.parseSpn(note);
            if (null !== data) {
                return data;
            }
            note = this.normalize(note);
            return this.parseSpn(note);
        };
        Note.prototype.normalize = function (note) {
            var self = this;
            return note.trim()
                .replace(/\s*(sharp|dièse|diesis|sostenido)/i, '♯')
                .replace(/\s*(flat|bémol|bemolle|bemol)/i, '♭')
                .replace(/^la/i, 'A')
                .replace(/^si/i, 'B')
                .replace(/^(ut|do)/i, 'C')
                .replace(/^(ré|re)/i, 'D')
                .replace(/^mi/i, 'E')
                .replace(/^fa/i, 'F')
                .replace(/^sol/i, 'G')
                .replace(/^as/i, 'A♭')
                .replace(/^h/i, 'B')
                .replace(/^es/i, 'E♭')
                .replace(/(^[a-gA-G])\s*(#|is)/i, '$1♯')
                .replace(/(^[a-gA-G])\s*(b|es)/i, '$1♭')
                .replace(/\s+/, '')
                .replace(/((1)|(2)|(3)|(4)|(5)|(6)|(7)|(8)|(9)|(0))/g, function (match, digit) {
                return self._octaves[digit];
            })
                .replace(/[‐‑‒–﹘˗−-]+/g, '₋')
                .toUpperCase();
        };
        Note.prototype.parseSpn = function (note) {
            var _this = this;
            var data = note.match(/^([A-G])(♭|♯)?([₀₁₂₃₄₅₆₇₈₉]+)$/);
            if (null === data) {
                return null;
            }
            note = data[1] + (data[2] || '');
            if (data && data.length) {
                var scale = data[3] === '♭' ? 'flat' : 'sharp';
                var octave_1 = '';
                data[4].split('').forEach(function (sub) {
                    octave_1 += _this._octaves.indexOf(sub).toString();
                });
                return {
                    position: Scales_1.default[scale].indexOf(note),
                    octave: parseInt(octave_1, 10),
                    scale: scale
                };
            }
            return null;
        };
        Note.prototype.noteAtInterval = function (interval) {
            var scale = Scales_1.default[this._scale];
            var position = (this._position + interval) % scale.length;
            var octave = this._octave + Math.floor(this._position + interval / scale.length);
            return new Note(scale[position] + this._octaves[octave]);
        };
        Object.defineProperty(Note.prototype, "canonical", {
            get: function () {
                return Scales_1.default[this._scale][this._position] + this._octaves[this._octave];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "name", {
            get: function () {
                return Scales_1.default[this._scale][this._position];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "octave", {
            get: function () {
                return this._octave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "frequency", {
            get: function () {
                var baseFrequency = this._frequencies[this.name];
                return baseFrequency * Math.pow(2, this.octave);
            },
            enumerable: true,
            configurable: true
        });
        return Note;
    }());
    exports.default = Note;
});
define("app/ts/models/audio/Sound", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sound = (function () {
        function Sound(note) {
            this._audioContext = new AudioContext();
            this._oscillator = this._audioContext.createOscillator();
            this._oscillator.frequency.value = note.frequency;
        }
        Sound.prototype.play = function () {
            this._oscillator.connect(this._audioContext.destination);
            this._oscillator.start();
        };
        Sound.prototype.stop = function () {
            this._oscillator.stop();
        };
        return Sound;
    }());
    exports.default = Sound;
});
define("app/ts/models/frequency/Frequency", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Frequency = (function () {
        function Frequency(a4) {
            this._frequencies = {
                'C': 16.35,
                'C♯': 17.32,
                'D♭': 17.32,
                'D': 18.35,
                'D♯': 19.45,
                'E♭': 19.45,
                'E': 20.60,
                'F': 21.83,
                'F♯': 23.12,
                'G♭': 23.12,
                'G': 24.50,
                'G♯': 25.96,
                'A♭': 25.96,
                'A': 27.50,
                'A♯': 29.14,
                'B♭': 29.14,
                'B': 30.87
            };
            this.a4 = typeof a4 !== 'undefined' ? a4 : 440;
            this._frequencies;
        }
        Object.defineProperty(Frequency.prototype, "frequency", {
            get: function () {
                var baseFrequency = this._frequencies[this.name];
                return baseFrequency * Math.pow(2, this.octave);
            },
            enumerable: true,
            configurable: true
        });
        return Frequency;
    }());
    exports.default = Frequency;
});
define("app/ts/models/note/NoteInterfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("app/ts/models/note/NoteCollection", ["require", "exports", "app/ts/models/note/Note"], function (require, exports, Note_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Note_1 = __importDefault(Note_1);
    var NoteCollection = (function () {
        function NoteCollection(collectionData) {
            var data = collectionData;
            if (!Array.isArray(collectionData) && collectionData.__dataType) {
                if (collectionData.__dataType === 'NoteRange') {
                    data = this.createFromRange(collectionData);
                }
                else if (collectionData.__dataType === 'NoteCount') {
                    data = this.createFromCount(collectionData);
                }
            }
            data.forEach(entry, Note_1.default | string | Note_1.default[] | string[], {
                if: function (, Array, isArray) { }
            }(entry));
            {
            }
            {
            }
        }
        ;
        return NoteCollection;
    }());
    exports.default = NoteCollection;
    createFromRange(noteRange, NoteRange);
    string[];
    {
        var startObj = new Note_1.default(noteRange.startNote);
        var endObj = new Note_1.default(noteRange.endNote);
        var octaves = endObj.octave - startObj.octave + 1;
        return [];
    }
    createFromCount(noteCount, NoteCount);
    string[];
    {
        var startObj = new Note_1.default(noteCount.startNote);
        return this.createFromRange({
            __dataType: 'NoteRange',
            startNote: noteCount.startNote,
            endNote: (startObj.noteAtInterval(noteCount.count)).canonical
        });
    }
});
define("app/ts/models/note/NoteRange", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Note = (function () {
        function Note(note) {
            this._scales = {
                sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
                flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
            };
            this._frequencies = {
                'C': 16.35,
                'C♯': 17.32,
                'D♭': 17.32,
                'D': 18.35,
                'D♯': 19.45,
                'E♭': 19.45,
                'E': 20.60,
                'F': 21.83,
                'F♯': 23.12,
                'G♭': 23.12,
                'G': 24.50,
                'G♯': 25.96,
                'A♭': 25.96,
                'A': 27.50,
                'A♯': 29.14,
                'B♭': 29.14,
                'B': 30.87
            };
            this._octaves = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
            var data = this.getNoteData(note);
            if (null === data) {
                throw new TypeError(note + ' is in an unknown format');
            }
            this._position = data.position;
            this._octave = data.octave;
            this._scale = data.scale;
        }
        Note.prototype.getNoteData = function (note) {
            if (note instanceof Note) {
                return {
                    position: Note.position,
                    octave: Note.octave,
                    scale: Note.scale
                };
            }
            var data = this.parseSpn(note);
            if (null !== data) {
                return data;
            }
            note = this.normalize(note);
            return this.parseSpn(note);
        };
        Note.prototype.normalize = function (note) {
            var self = this;
            return note.trim()
                .replace(/\s*(sharp|dièse|diesis|sostenido)/i, '♯')
                .replace(/\s*(flat|bémol|bemolle|bemol)/i, '♭')
                .replace(/^la/i, 'A')
                .replace(/^si/i, 'B')
                .replace(/^(ut|do)/i, 'C')
                .replace(/^(ré|re)/i, 'D')
                .replace(/^mi/i, 'E')
                .replace(/^fa/i, 'F')
                .replace(/^sol/i, 'G')
                .replace(/^as/i, 'A♭')
                .replace(/^h/i, 'B')
                .replace(/^es/i, 'E♭')
                .replace(/(^[a-gA-G])\s*(#|is)/i, '$1♯')
                .replace(/(^[a-gA-G])\s*(b|es)/i, '$1♭')
                .replace(/\s+/, '')
                .replace(/((1)|(2)|(3)|(4)|(5)|(6)|(7)|(8)|(9)|(0))/g, function (match, digit) {
                return self._octaves[digit];
            })
                .replace(/[‐‑‒–﹘˗−-]+/g, '₋')
                .toUpperCase();
        };
        Note.prototype.parseSpn = function (note) {
            var _this = this;
            var data = note.match(/^([A-G])(♭|♯)?([₀₁₂₃₄₅₆₇₈₉]+)$/);
            if (null === data) {
                return null;
            }
            note = data[1] + (data[2] || '');
            if (data && data.length) {
                var scale = data[3] === '♭' ? 'flat' : 'sharp';
                var octave_2 = '';
                data[4].split('').forEach(function (sub) {
                    octave_2 += _this._octaves.indexOf(sub).toString();
                });
                return {
                    position: this._scales[scale].indexOf(note),
                    octave: parseInt(octave_2, 10),
                    scale: scale
                };
            }
            return null;
        };
        Note.prototype.noteAtInterval = function (interval) {
            var scale = this._scales[this._scale];
            var position = (this._position + interval) % scale.length;
            var octave = this._octave + Math.floor(this._position + interval / scale.length);
            return new Note(scale[position] + this._octaves[octave]);
        };
        Object.defineProperty(Note.prototype, "canonical", {
            get: function () {
                return this._scales[this._scale][this._position] + this._octaves[this._octave];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "name", {
            get: function () {
                return this._scales[this._scale][this._position];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "octave", {
            get: function () {
                return this._octave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "frequency", {
            get: function () {
                var baseFrequency = this._frequencies[this.name];
                return baseFrequency * Math.pow(2, this.octave);
            },
            enumerable: true,
            configurable: true
        });
        return Note;
    }());
    exports.default = Note;
});
//# sourceMappingURL=dist.js.map