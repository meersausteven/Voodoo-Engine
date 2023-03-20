
export class Time {
        constructor() {
                this.start = null;
                this.lastFrame = null;
                this.total = null;
                this.delta = null;
                this.scale = 1;
                this.frameCount = 0;
        }

        /*
         * updates the time object
         * @param number timestamp: timestamp when this function is called
         */
        update(timestamp) {
                // define start value if not set
                if (this.start === null) {
                        this.start = timestamp / 1000;
                }

                // time the last frame was drawn
                if (this.lastFrame === null) {
                        this.lastFrame = timestamp / 1000;
                }

                // other variables
                this.total = (timestamp / 1000) - this.start;
                this.delta = (timestamp / 1000) - this.lastFrame;
                this.lastFrame = timestamp / 1000;

                // updates per second
                this.framesPerSecond = 1 / this.delta;

                // recalculate the delta value according to the time scale
                this.delta *= this.scale;

                // number of frames that were drawn since start
                this.frameCount++;
        }
}
