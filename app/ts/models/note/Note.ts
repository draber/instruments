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

export default class Note {

    private _scales : { [key: string]: string[] } = {
        sharp:    ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],
        flat:     ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B']
    };

    private _frequencies: { [key: string]: number } = {
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

    private _octaves: string[] = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];

    private _position: number;

    private _octave: number;

    private _scale: string;
   

    /**
     * Note constructor
     * 
     * @param {String} note 
     */
    constructor(note: string){

        const data = this.getNoteData(note);
        if(null === data){
            throw new TypeError (note + ' is in an unknown format');
        }
        this._position = data.position;
        this._octave   = data.octave;
        this._scale    = data.scale;
    }

    /**
     * Attempt to extract note data as plain object
     * 
     * @param {String} note 
     * @return {Object|null}
     */
    private getNoteData(note: string): { position: number, octave: number, scale: string }|null {

        let data = this.parseSpn(note);
        if(null !== data) {
            return data;
        }

        // try to convert to SPN
        note = this.normalize(note);
        return this.parseSpn(note);
    }

    /**
     * Convert various notation formats into Scientific Pitch Notation (SPN). 
     * No support for input in Helmholtz Notation as this could lead to ambiguity!

     * @see https://en.wikipedia.org/wiki/Scientific_pitch_notation
     * @see https://en.wikipedia.org/wiki/Helmholtz_pitch_notation 
     * @param {String} note 
     * @return {String}
     */
    private normalize(note: string): string { 
        
        const self: Note = this;

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
            .replace(/(^[a-gA-G])\s*(#|is)/i,'$1♯')
            .replace(/(^[a-gA-G])\s*(b|es)/i,'$1♭')

            // whitespace
            .replace(/\s+/,'')

            // octaves
            .replace(/((1)|(2)|(3)|(4)|(5)|(6)|(7)|(8)|(9)|(0))/g, function(match, digit) {
                return self._octaves[digit]
            })

            // hyphen that could be in front of the octaves
            .replace(/[‐‑‒–﹘˗−-]+/g, '₋')

            .toUpperCase();
    }

    /**
     * Test if a note is already in the SPN format and return its data if so
     * @param {String} note 
     * @return {Object|null}
     */
    private parseSpn(note: string): { position: number, octave: number, scale: string }|null {        

        // expected ['A♯₆','A♯','A','♯','₆']
        // @todo support neagtive octaves
        const data: string[]|null = note.match(/^([A-G])(♭|♯)?([₀₁₂₃₄₅₆₇₈₉]+)$/);

        if(null === data){
            return null;
        }
        
        note = data[1] + (data[2] || '');

        // note already in SPN
        if(data && data.length){
            const scale: string = data[3] === '♭' ? 'flat' : 'sharp';
            let octave: string = '';
            data[4].split('').forEach(sub => {
                octave += this._octaves.indexOf(sub).toString();
            })
            return {
                position: this._scales[scale].indexOf(note),
                octave: parseInt(octave, 10),
                scale: scale
            }
        }
        return null;
    }


    /**
     * Build a new note based on an interval
     * @todo test maths
     * @param {Number} interval 
     * @return {Note}
     */
    public noteAtInterval (interval: number): Note {
        const scale:    string[] = this._scales[this._scale];
        const position: number   = (this._position + interval) % scale.length;
        const octave:   number   = this._octave + Math.floor(this._position + interval / scale.length);
        
        return new Note(scale[position] + this._octaves[octave]);
    }
    

    /**
     * Retrieve the full name of the note with octave
     * @return {String}
     */
    public get canonical (): string {
        return this._scales[this._scale][this._position] + this._octaves[this._octave];
    }
    

    /**
     * Retrieve the note name
     * @return {String}
     */
    public get name (): string {
        return this._scales[this._scale][this._position];
    }

    /**
     * Retrieve the octave as a integer value
     * @return {Int}
     */
    public get octave (): number {
        return this._octave;
    }

    /**
     * Retrieve the frequency as a float value
     * @return {Float}
     */
    public get frequency (): number {
        const baseFrequency: number = this._frequencies[this.name];
        return baseFrequency * Math.pow(2, this.octave);
    }
}
