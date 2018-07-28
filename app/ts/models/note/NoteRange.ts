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

interface NoteAsRange {
    startNote: string|Note,
    endNote: string
}

interface NoteAsCount {
    startNote: string|Note,
    count: number
}

export default class NoteRange {

    private _startNote: Note;

    private _count: number;

    /**
     * NoteRange constructor
     * 
     * @param {String} note 
     */
    constructor(values: NoteAsRange|NoteAsCount){
        this._startNote = new Note(values.startNote);
        if((<NoteAsCount>values).count) {
            this._count = (<NoteAsCount>values).count;
        }
        else if((<NoteAsRange>values).endNote) {
            const endNote = new Note((<NoteAsRange>values).endNote);
            this._count = this._startNote.intervalAtNote(endNote);
        }
        else {
            this._count = 0;
        }
    }

    get range (): Note[] {
        let _range = [this._startNote];
        let i = this._startNote.position;
        for(; i < this._count; i++){
            _range.push(this._startNote.noteAtInterval(i));
        }
        return _range; 
    }
}
