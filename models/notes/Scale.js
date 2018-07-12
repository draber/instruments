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

import { Note } from './Note';

/**
 * Functionality related to scales
 */
export class Scale {

    constructor(){        
        this._scales = this._buildScales();
        this._sortOrder = this._buildSortOrder();

        this.modes = {            
            ionian:     [0,2,4,5,7,9,11],
            dorian:     [0,2,3,5,7,9,10],
            phrygian:   [0,1,3,5,7,8,10],
            lydian:     [0,2,4,6,7,9,11],
            mixolydian: [0,2,4,5,7,9,10],
            aeolian:    [0,2,3,5,7,8,10],
            locrian:    [0,1,3,5,6,8,10],
            
            chromatic:  [0,1,2,3,4,5,6,7,8,9,10,11],            
            gypsy:      [0,2,3,6,7,8,11],
            romanian:   [0,2,3,6,7,9,10],
            indian:     [0,1,5,7,8],
            persian:    [0,1,4,5,6,8,11],
            byzantine:  [0,1,4,5,7,8,11],
            oriental:   [0,1,4,5,6,9,10],
            jewish:     [0,1,4,5,7,8,10],
            japanese:   [0,2,5,7,8]
        };
    }

    /**
     * Build scales
     * @returns {{sharp: [string,...], flat: [string,...], combined: [string,...]}}
     * @private
     */
    _buildScales() {
        let scales = {
            sharp:    ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],
            flat:     ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'],
            combined: []
        };

        scales.sharp.forEach((sharp, idx) => {
            scales.combined.push(
                sharp !== scales.flat[idx]
                    ? sharp + '/' + scales.flat[idx]
                    : sharp
            );
        });

        return scales;
    }

    _buildSortOrder() {
        let sortOrder = {};
        let value = 0;
        this.scales.sharp.forEach((sharp, idx) => {
            const flat = this.scales.flat[idx];
            sortOrder[sharp] = value;
            if(flat !== sharp) {
                value++;
                sortOrder[flat] = value;
            }
            value++;
        });
        return sortOrder;
    }

    sortByPitch(scale){
        return Array.from(scale).sort((a, b) => {
            const aObj = Note.getObject(a);
            const bObj = Note.getObject(b);
            a = this._sortOrder[aObj.sharp];
            b = this._sortOrder[bObj.sharp];
            if(!a || !b) {
                throw new RangeError('Invalid notes in Scale.sortByPitch()')
            }
            if(aObj.octave < bObj.octave) {
                return -1;
            }
            if(aObj.octave > bObj.octave) {
                return 1;
            }
            // octaves are identical            
            if(a < b) {
                return -1;
            }
            if(a > b) {
                return 1;
            }
            return 0;
        });
    }


    /**
     * Public access to scales
     *
     * @returns {*}
     */
    get scales() {
        return this._scales;
    }



    getScale(tonic, mode) {
        let _scale   = [];
        let pool     = this._scales.sharp;
        let position;

        tonic    = Note.normalize(tonic);
        position = pool.indexOf(tonic);

        if(position === -1) {
            pool     = this._scales.flat;
            position = pool.indexOf(tonic);
        }

        if(position === -1) {
            throw new RangeError('Unknown tonic ' + tonic);
        }
        
        if(!Array.isArray(mode)) {            
            if(this.modes[mode]) {
                mode = this.modes[mode];
            }
            else {
                throw new RangeError('Unknown mode ' + mode);
            }
        }
        pool = pool.concat(pool).slice(position, position + 12);
        mode.forEach(index => {
            _scale.push(pool[index]);
        });
        return _scale;
    }

}