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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./Note"], function (require, exports, Note_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Note_1 = __importDefault(Note_1);
    var NoteRange = /** @class */ (function () {
        /**
         * NoteRange constructor
         *
         * @param {String} note
         */
        function NoteRange(values) {
            this._startNote = new Note_1.default(values.startNote);
            if (values.count) {
                this._count = values.count;
            }
            else if (values.endNote) {
                var endNote = new Note_1.default(values.endNote);
                this._count = this._startNote.intervalAtNote(endNote);
            }
            else {
                this._count = 0;
            }
        }
        Object.defineProperty(NoteRange.prototype, "range", {
            get: function () {
                var _range = [this._startNote];
                var i = this._startNote.position;
                for (; i < this._count; i++) {
                    _range.push(this._startNote.noteAtInterval(i));
                }
                return _range;
            },
            enumerable: true,
            configurable: true
        });
        return NoteRange;
    }());
    exports.default = NoteRange;
});
//# sourceMappingURL=NoteRange.js.map