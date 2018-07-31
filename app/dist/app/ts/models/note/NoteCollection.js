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
define(["require", "exports", "./Note", "./NoteRange"], function (require, exports, Note_1, NoteRange_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Note_1 = __importDefault(Note_1);
    NoteRange_1 = __importDefault(NoteRange_1);
    var NoteCollection = /** @class */ (function () {
        /**
         * NoteCollection constructor
         * `NoteCollection` in this context could be a scale, a tuning or a chord for instance
         *
         * @param {String} note
         */
        function NoteCollection(inputData) {
            var collection = [];
            if (Array.isArray(inputData)) {
                var collection_1 = this._convertToNotes(inputData);
            }
            // NoteRange
            else if (inputData instanceof NoteRange_1.default) {
                var collection_2 = inputData.range;
            }
            // NoteAsRange|NoteAsCount
            else if ((inputData.startNote || inputData.startNote)
                && (inputData.endNote || inputData.count)) {
                var collection_3 = (new NoteRange_1.default(inputData)).range;
            }
        }
        /**
         *
         * @param rawCollection
         *
         * @todo type checking
         */
        NoteCollection.prototype._convertToNotes = function (rawCollection) {
            var collection = [], iR = 0, lR = rawCollection.length;
            for (iR = 0; iR < lR; iR++) {
                if (Array.isArray(rawCollection[iR])) {
                    var _data = [], iD = 0, lD = rawCollection[iR].length;
                    for (iD = 0; iD < lD; iD++) {
                        _data.push(new Note_1.default(rawCollection[iR][iD]));
                    }
                    collection.push(_data);
                }
                else {
                    collection.push(new Note_1.default(rawCollection[iR]));
                }
            }
            return collection;
        };
        return NoteCollection;
    }());
    exports.default = NoteCollection;
});
//# sourceMappingURL=NoteCollection.js.map