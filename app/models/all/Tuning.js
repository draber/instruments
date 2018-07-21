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
import { Scale } from './Scale';

export class Tuning {

    constructor(options) {
        const scales = (new Scale()).scales.sharp;
        const self      = this;
        this.tuning     = options.tuning;
        this.normalized = self.normalize(this.tuning);
        this.simplified = self.simplify(this.normalized);
        this.ordered    = self.order(this.simplified);
    }

    normalize(tuning) {
        let normalized = [];
        tuning.forEach((course) => {
            if(!Array.isArray(course)) {
                course = [course];
            }
            course = course.map(function(note){
                const noteObj = Note.getObject(note);
                return noteObj.sharp + note.octave.toString();
            });
            normalized.push(course);
        });
        return normalized;
    }

    simplify(normalized) {
        let simplified = [];
        normalized.forEach((course) => {
            simplified.push(course.shift());
        });
        return simplified;
    }

    order(notes) {
        return notes.sort(this.compare);
    }

    compare(a, b){
        const regEx = /^([a-g])([\D])?([\d])$/;
        const 
        a = a.match(regEx);
        b = b.match(regEx);       
        // compare octaves
        if(a[3] > b[3]) {
            return 1;
        }
        else if(a[3] < b[3]) {
            return -1;
        }
        else { 
            // compare position in scale 

            // @todo change re to match acccidentals 
            if(scales[a[1]] > scales[b[1]]) {
                return 1;
            }
            else if(scales[a[1]] < scale[b[1]]) {
                return -1;
            }
            else {   
                // compare presence of accidentals         
                if(!a[2] && b[2]) {
                    return 1;
                }
                else if(a[2] && !b[2]) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        }
    }
}
