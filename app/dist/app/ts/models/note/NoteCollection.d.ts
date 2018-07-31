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
import Note from './Note';
import NoteRange from './NoteRange';
import { NoteAsCount } from './NoteRange';
import { NoteAsRange } from './NoteRange';
export default class NoteCollection {
    /**
     * NoteCollection constructor
     * `NoteCollection` in this context could be a scale, a tuning or a chord for instance
     *
     * @param {String} note
     */
    constructor(inputData: string[] | string[][] | Note[] | Note[][] | NoteAsRange | NoteAsCount | NoteRange);
    /**
     *
     * @param rawCollection
     *
     * @todo type checking
     */
    private _convertToNotes;
}
