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


interface options {
    a4?: number
}

export default class Note {

    private _scales : { [key: string]: string[] } = {
        sharp:    ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],
        flat:     ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B']
    };

    private _octaves: string[] = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

    /**
     * Position of a note in a certain scale
     */
    private _position: number;

    /**
     * Octave of the note
     */
    private _octave: number;

    /**
     * Scale, either sharp or flat
     */
    private _scale: string;

    /**
     * Options, see interface
     */
    private _options: options;    

    /**
     * Note constructor
     * 
     * @param {String} note 
     */
    constructor(note: string | Note,  options?: options) {
        const data = this.getNoteData(note);
        if (null === data) {
            throw new TypeError(note + ' is in an unknown format');
        }
        this._position = data.position;
        this._octave = data.octave;
        this._scale = data.scale;

        const defaultOptions:options = {}
        this._options = {...defaultOptions, ...options};
    }

    /**
     * Attempt to extract note data as plain object
     * 
     * @param {String} note 
     * @return {Object|null}
     */
    private getNoteData(note: string | Note): { position: number, octave: number, scale: string } | null {

        if (note instanceof Note) {
            return {
                position: note.position,
                octave: note.octave,
                scale: note.scale
            }
        }

        let data = this.parseSpn(note);
        if (null !== data) {
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
            .replace(/(^[a-gA-G])\s*(#|is)/i, '$1♯')
            .replace(/(^[a-gA-G])\s*(b|es)/i, '$1♭')

            // whitespace
            .replace(/\s+/, '')

            // octaves
            .replace(/((1)|(2)|(3)|(4)|(5)|(6)|(7)|(8)|(9)|(0))/g, function (match, digit) {
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
    private parseSpn(note: string): { position: number, octave: number, scale: string } | null {

        // expected ['A♯₆','A♯','A','♯','₆']
        // @todo support negative octaves
        const data: string[] | null = note.match(/^([A-G])(♭|♯)?([₀₁₂₃₄₅₆₇₈₉]+)$/);

        if (null === data) {
            return null;
        }

        note = data[1] + (data[2] || '');

        // note already in SPN
        if (data && data.length) {
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
     * @param {Number} interval 
     * @return {Note}
     */
    public noteAtInterval(interval: number): Note {
        const scale: string[] = this._scales[this._scale];
        const octave: number = this._octave + Math.floor((this._position + interval) / scale.length);
        let position: number = (this._position + interval) % scale.length;
        if(position < 0) {
            position += scale.length;
        }

        return new Note(scale[position] + this._octaves[octave]);
    }

    /**
     * Calculate the interval between two notes
     * @param {Note} note 
     */
    public intervalAtNote(note: Note): number {
        const scaleLength: number = this._scales[this._scale].length;
        return ((note.octave * scaleLength) + note.position) - ((this._octave * scaleLength) + this._position);
    }


    /**
     * Retrieve the full name of the note with octave
     * @return {String}
     */
    public get canonical(): string {
        return this._scales[this._scale][this._position] + this._octaves[this._octave];
    }


    /**
     * Retrieve the note name
     * @return {String}
     */
    public get name(): string {
        return this._scales[this._scale][this._position];
    }

    /**
     * Retrieve the octave as a integer value
     * @return {Int}
     */
    public get octave(): number {
        return this._octave;
    }

    /**
     * Retrieve the position inside a scale array as a integer value
     * @return {Int}
     */
    public get position(): number {
        return this._position;
    }

    /**
     * Retrieve the name of the scale, either flat or sharp
     * @return {String}
     */
    public get scale(): string {
        return this._scale;
    }

    /**
     * Retrieve the frequency as a float value
     * @return {Float}
     */
    public get frequency(): number {
        const scaleLength: number = this._scales[this._scale].length;

        // base tone is A in the 4th octave
        // A is the 9th tone of the scale 
        const aPosition: number = 9;
        const aOctave: number   = 4;       
        const distance: number  = ((this._octave * scaleLength) + this._position) - ((aOctave * scaleLength) + aPosition);
        
        return this._options.a4 || 440 *  Math.pow(2, distance/12); 
    }
}
