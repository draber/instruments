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
    a4?: number;
}
export default class Note {
    private _scales;
    private _octaves;
    /**
     * Position of a note in a certain scale
     */
    private _position;
    /**
     * Octave of the note
     */
    private _octave;
    /**
     * Scale, either sharp or flat
     */
    private _scale;
    /**
     * Options, see interface
     */
    private _options;
    /**
     * Note constructor
     *
     * @param {String} note
     */
    constructor(note: string | Note, options?: options);
    /**
     * Attempt to extract note data as plain object
     *
     * @param {String} note
     * @return {Object|null}
     */
    private getNoteData;
    /**
     * Convert various notation formats into Scientific Pitch Notation (SPN).
     * No support for input in Helmholtz Notation as this could lead to ambiguity!

     * @see https://en.wikipedia.org/wiki/Scientific_pitch_notation
     * @see https://en.wikipedia.org/wiki/Helmholtz_pitch_notation
     * @param {String} note
     * @return {String}
     */
    private normalize;
    /**
     * Test if a note is already in the SPN format and return its data if so
     * @param {String} note
     * @return {Object|null}
     */
    private parseSpn;
    /**
     * Build a new note based on an interval
     * @param {Number} interval
     * @return {Note}
     */
    noteAtInterval(interval: number): Note;
    /**
     * Calculate the interval between two notes
     * @param {Note} note
     */
    intervalAtNote(note: Note): number;
    /**
     * Retrieve the full name of the note with octave
     * @return {String}
     */
    readonly canonical: string;
    /**
     * Retrieve the note name
     * @return {String}
     */
    readonly name: string;
    /**
     * Retrieve the octave as a integer value
     * @return {Int}
     */
    readonly octave: number;
    /**
     * Retrieve the position inside a scale array as a integer value
     * @return {Int}
     */
    readonly position: number;
    /**
     * Retrieve the name of the scale, either flat or sharp
     * @return {String}
     */
    readonly scale: string;
    /**
     * Retrieve the frequency as a float value
     * @return {Float}
     */
    readonly frequency: number;
}
export {};
