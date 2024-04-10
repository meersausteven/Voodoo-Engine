
export class Vector2 {
        type = "Vector2";
        x;
        y;
        magnitude;

        static zero = new Vector2();
        static one = new Vector2(1, 1);
        static up = new Vector2(0, -1);
        static right = new Vector2(1, 0);
        static bottom = new Vector2(0, 1);
        static left = new Vector2(-1, 0);

        constructor(x = 0, y = 0) {
                this.x = x;
                this.y = y;
                this.magnitude = this.calculateMagnitude();
        }

        // calculate and set this vector's magnitude
        calculateMagnitude() {
                this.magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));

                return this.magnitude;
        }

        // return this vector with a length of 1
        normalized() {
                return new Vector2(
                        this.x / this.magnitude,
                        this.y / this.magnitude
                );
        }

        // return this vector with a given length
        setLength(length) {
                return new Vector2(
                        this.x * length / this.magnitude,
                        this.y * length / this.magnitude
                );
        }

        // get direction of this vector in radians
        getDirectionAsRadians() {
                return Math.atan2(this.y - 0, this.x - 0);
        }

        // get direction of this vector as an angle
        getDirectionAsDegrees() {
                return this.getDirectionAsRadians() * (180 / Math.PI);
        }

        /*
         * add a vector or a number to this vector
         * @param Vector2|Number value: value or vector that is to be added to this vector
         * @return Vector2: new resulting vector
         */
        add(value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(this.x + value.x, this.y + value.y);
        }

        /*
         * subtract a vector or a number from this vector
         * @param Vector2|Number value: value or vector that is to be subtracted from thhis vector
         * @return Vector2: new resulting vector
         */
        subtract(value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(this.x - value.x, this.y - value.y);
        }

        /*
         * multiply this vector by a number or another vector
         * @param Vector2|Number value: value or vector that the vector v is to be multiplied with
         * @return Vector2: new resulting vector
         */
        multiply(value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(this.x * value.x, this.y * value.y);
        }

        /*
         * divide this vector by a number or another vector
         * @param Vector2|Number value: value or vector that this vector is to be divided by
         * @return Vector2: new resulting vector
         */
        divide(value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(this.x / value.x, this.y / value.y);
        }

        /*
         * rotate this vector by a given amount of degrees
         * @param Number degrees: amount of degrees this vector is to be rotated by
         * @return Vector2: new resulting vector
         */
        rotate(degrees) {
                const radians = -degrees * (Math.PI / 180);

                return new Vector2(
                        this.x * Math.cos(radians) - this.y * Math.sin(radians),
                        this.x * Math.sin(radians) + this.y * Math.cos(radians)
                );
        }

        // static functions

        /*
         * add a vector or a number to a vector
         * @param Vector2 v: the vector
         * @param Vector2|Number value: value or vector that is to be added to the vector v
         * @return Vector2: new vector with the added values
         */
        static add(v, value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(v.x + value.x, v.y + value.y);
        }

        /*
         * subtract a vector or a number from a vector
         * @param Vector2 v: the vector
         * @param Vector2|Number value: value or vector that is to be subtracted from the vector v
         */
        static subtract(v, value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(v.x - value.x, v.y - value.y);
        }

        /*
         * multiplier a vector by a number or another vector
         * @param Vector2 v: the vector
         * @param Vector2|Number value: value or vector that the vector v is to be multiplied with
         */
        static multiply(v, value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(v.x * value.x, v.y * value.y);
        }

        /*
         * divide a vector by a number or another vector
         * @param Vector2 v: the vector
         * @param Vector2|Number value: value or vector that the vector v is to be divided by
         */
        static divide(v, value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                return new Vector2(v.x / value.x, v.y / value.y);
        }

        /*
         * rotate a vector by a given amount of degrees
         * @param Vector2 v: the vector
         * @param Number degrees: amount of degrees the vector v is to be rotated by
         */
        static rotate(v, degrees) {
                const radians = -degrees * (Math.PI / 180);

                return new Vector2(
                        v.x * Math.cos(radians) - v.y * Math.sin(radians),
                        v.x * Math.sin(radians) + v.y * Math.cos(radians)
                );
        }

        /*
         * calculate the perpendicular dot product between two vectors
         * will return 0 for parallel/anti-parallel vectors; a signed value otherwise
         * @param Vector2 v1: first vector
         * @param Vector2 v2: second vector
         */
        static perpdot(v1, v2) {
                const perpdot = (v1.x * v2.y) - (v1.y * v2.x);

                return perpdot;
        }

        /*
         * calculate the dot product between two vectors
         * @param Vector2 v1: first vector
         * @param Vector2 v2: second vector
         */
        static dot(v1, v2) {
                const dot = (v1.x * v2.x + v1.y * v2.y) / (v1.x * v1.x + v1.y * v1.y);

                return dot;
        }
}
