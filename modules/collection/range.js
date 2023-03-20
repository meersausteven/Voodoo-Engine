
export class Range {
        /*
         * constructor
         * number min: minimum value
         * number max: maximum value
         * number step: step size
         */
        constructor(min = 0, max = Number.MAX_VALUE, step = 1) {
                this.min = min;
                this.max = max;
                this.step = step;
        }
}