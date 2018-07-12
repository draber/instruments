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

 import { Scale } from './Scale';

/**
 * Misc. function related to notes
 */
export class Note {

    constructor(options) {
        const self   = this;
    }

        /**
     * Build object from a note
     *
     * @param note
     * @returns {{}}
     */
    static getObject(note) {
        const self   = this;
        const scales = (new Scale()).scales;
        let object   = {
            accidental: 'none'
        };
        let data;
        let position;


        note.split('/').forEach((part) => {
            let sharpPos, flatPos, accidental;
            data = part.match(/([\D]+)([\d]*)/);

            data[1]  = Note.normalize(data[1]);
            sharpPos = scales.sharp.indexOf(data[1]); // -1 if note has ♭
            flatPos  = scales.flat.indexOf(data[1]);  // -1 if note has ♯
            position = sharpPos !== -1 ? sharpPos : flatPos;

            object.sharp = scales.sharp[position];
            object.flat  = scales.flat[position];

            accidental = data[1].slice(-1); 

            if(accidental === '♯') {
                object.accidental = 'sharp';
            }
            else if(accidental === '♭') {
                object.accidental = 'flat';
            }

        });

        object.combined = scales.combined[position];
        object.octave   = parseInt(data[2], 10);

        return object;
    }

    /**
     * Converts various name variations of a note to a standard format
     *
     * @param {String} note
     * @returns {String} normalized note
    */
    static normalize(note){

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
            .replace(/(^[a-gA-G])(#|is$)/i,'$1♯')
            .replace(/(^[a-gA-G])(b|es$)/i,'$1♭')

            // uppercase
            .toUpperCase();
    }

}