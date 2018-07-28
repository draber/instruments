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

export default class Frequency {

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

    private a4: number;
   

    /**
     * Note constructor
     * 
     * @param {Float} a4 
     */
    constructor(a4?: number){
        this.a4 = typeof a4 !== 'undefined' ? a4 : 440;
        //this._frequencies ....
    }


    /**
     * Retrieve the frequency as a float value
     * @return {Float}
     */
    public get frequency (): number {
        const baseFrequency: number = this._frequencies[this.name];
        return 42;
        //return baseFrequency * Math.pow(2, this.octave);
    }
}
