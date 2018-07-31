/**
 * Copyright (c) 2018 Dieter Raber
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Note = /** @class */ (function () {
        /**
         * Note constructor
         *
         * @param {String} note
         */
        function Note(note, options) {
            this._scales = {
                sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
                flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
            };
            this._octaves = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
            var data = this.getNoteData(note);
            if (null === data) {
                throw new TypeError(note + ' is in an unknown format');
            }
            this._position = data.position;
            this._octave = data.octave;
            this._scale = data.scale;
            var defaultOptions = {};
            this._options = __assign({}, defaultOptions, options);
        }
        /**
         * Attempt to extract note data as plain object
         *
         * @param {String} note
         * @return {Object|null}
         */
        Note.prototype.getNoteData = function (note) {
            if (note instanceof Note) {
                return {
                    position: note.position,
                    octave: note.octave,
                    scale: note.scale
                };
            }
            var data = this.parseSpn(note);
            if (null !== data) {
                return data;
            }
            // try to convert to SPN
            note = this.normalize(note);
            return this.parseSpn(note);
        };
        /**
         * Convert various notation formats into Scientific Pitch Notation (SPN).
         * No support for input in Helmholtz Notation as this could lead to ambiguity!
    
         * @see https://en.wikipedia.org/wiki/Scientific_pitch_notation
         * @see https://en.wikipedia.org/wiki/Helmholtz_pitch_notation
         * @param {String} note
         * @return {String}
         */
        Note.prototype.normalize = function (note) {
            var self = this;
            // convert to SPN, first attempt
            return note.trim()
                // Romantic languages
                .replace(/\s*(sharp|dièse|diesis|sostenido)/i, '♯')
                .replace(/\s*(flat|bémol|bemolle|bemol)/i, '♭')
                .replace(/^la/i, 'A')
                .replace(/^si/i, 'B')
                .replace(/^(ut|do)/i, 'C')
                .replace(/^(ré|re)/i, 'D')
                .replace(/^mi/i, 'E')
                .replace(/^fa/i, 'F')
                .replace(/^sol/i, 'G')
                // German
                .replace(/^as/i, 'A♭')
                .replace(/^h/i, 'B')
                .replace(/^es/i, 'E♭')
                // accidentals
                .replace(/(^[a-gA-G])\s*(#|is)/i, '$1♯')
                .replace(/(^[a-gA-G])\s*(b|es)/i, '$1♭')
                // whitespace
                .replace(/\s+/, '')
                // octaves
                .replace(/((1)|(2)|(3)|(4)|(5)|(6)|(7)|(8)|(9)|(0))/g, function (match, digit) {
                return self._octaves[digit];
            })
                // hyphen that could be in front of the octaves
                .replace(/[‐‑‒–﹘˗−-]+/g, '₋')
                .toUpperCase();
        };
        /**
         * Test if a note is already in the SPN format and return its data if so
         * @param {String} note
         * @return {Object|null}
         */
        Note.prototype.parseSpn = function (note) {
            var _this = this;
            // expected ['A♯₆','A♯','A','♯','₆']
            // @todo support negative octaves
            var data = note.match(/^([A-G])(♭|♯)?([₀₁₂₃₄₅₆₇₈₉]+)$/);
            if (null === data) {
                return null;
            }
            note = data[1] + (data[2] || '');
            // note already in SPN
            if (data && data.length) {
                var scale = data[3] === '♭' ? 'flat' : 'sharp';
                var octave_1 = '';
                data[4].split('').forEach(function (sub) {
                    octave_1 += _this._octaves.indexOf(sub).toString();
                });
                return {
                    position: this._scales[scale].indexOf(note),
                    octave: parseInt(octave_1, 10),
                    scale: scale
                };
            }
            return null;
        };
        /**
         * Build a new note based on an interval
         * @param {Number} interval
         * @return {Note}
         */
        Note.prototype.noteAtInterval = function (interval) {
            var scale = this._scales[this._scale];
            var octave = this._octave + Math.floor((this._position + interval) / scale.length);
            var position = (this._position + interval) % scale.length;
            if (position < 0) {
                position += scale.length;
            }
            return new Note(scale[position] + this._octaves[octave]);
        };
        /**
         * Calculate the interval between two notes
         * @param {Note} note
         */
        Note.prototype.intervalAtNote = function (note) {
            var scaleLength = this._scales[this._scale].length;
            return ((note.octave * scaleLength) + note.position) - ((this._octave * scaleLength) + this._position);
        };
        Object.defineProperty(Note.prototype, "canonical", {
            /**
             * Retrieve the full name of the note with octave
             * @return {String}
             */
            get: function () {
                return this._scales[this._scale][this._position] + this._octaves[this._octave];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "name", {
            /**
             * Retrieve the note name
             * @return {String}
             */
            get: function () {
                return this._scales[this._scale][this._position];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "octave", {
            /**
             * Retrieve the octave as a integer value
             * @return {Int}
             */
            get: function () {
                return this._octave;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "position", {
            /**
             * Retrieve the position inside a scale array as a integer value
             * @return {Int}
             */
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "scale", {
            /**
             * Retrieve the name of the scale, either flat or sharp
             * @return {String}
             */
            get: function () {
                return this._scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Note.prototype, "frequency", {
            /**
             * Retrieve the frequency as a float value
             * @return {Float}
             */
            get: function () {
                var scaleLength = this._scales[this._scale].length;
                // base tone is A in the 4th octave
                // A is the 9th tone of the scale 
                var aPosition = 9;
                var aOctave = 4;
                var distance = ((this._octave * scaleLength) + this._position) - ((aOctave * scaleLength) + aPosition);
                return (this._options.a4 || 440) * Math.pow(2, distance / 12);
            },
            enumerable: true,
            configurable: true
        });
        return Note;
    }());
    exports.default = Note;
});
//# sourceMappingURL=Note.js.map