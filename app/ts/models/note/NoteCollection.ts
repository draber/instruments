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

interface NoteArray {
    collection: string[]
}

interface NoteNestedArray {
    collection: string[][]
}

interface NoteRange {
    startNote: string,
    endNote: string
}

interface NoteCount {
    startNote: string,
    count: number
}

export default class NoteCollection {
    
    /**
     * NoteCollection constructor
     * `NoteCollection` in this context could be a scale, a tuning or a chord for instance
     * 
     * @param {String} note 
     */
    constructor(collectionData: NoteArray|NoteNestedArray|NoteRange|NoteCount){
        if(collectionData instanceof NoteArray) {
            
        }
    }

    /**
     * Create an array of notes from a range whaich can be used in the NoteCollection constructor
     * 
     * @param {String} note 
     */
    public static createFromRange(startNote: string, endNote: string): string[] {
        const startObj: Note  = new Note(startNote);
        const endObj: Note    = new Note(endNote);
        const octaves: number = endObj.octave - startObj.octave + 1;

        // var sharp = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
        // var scale = [];
        //new NodeCollection(NodeCollection.createFromRange('e4', 'c0'))
    
    
        // while(octaves--) {
        //     scale = scale.concat(sharp);
        // }
        // console.log(scale, octaves, startObj,endObj);

        return []
    }


    /**
     * Create an array of a base note and a note in a certain distance from `startNote`
     * 
     * @param {String} note 
     * @return {Array}
     */
    public static createFromCounter(startNote: string, count: number): string[] {
        // get the note with the distance of `number`
        // const endNote: string    = ...
        return NoteCollection.createFromRange(startNote, endNote);
    }
}
