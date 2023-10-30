
export class Vector2 {
        type = "Vector2";
        x;
        y;
        magnitude;

        static up = new Vector2(0, 1);
        static right = new Vector2(1, 0);

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
        lengthen(length) {
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
        getDirectionAsAngle() {
                return this.getDirectionAsRadians() * (180 / Math.PI);
        }

        /*
         * calculate the cross product between two vectors
         * @param Vector2 v1: first point
         * @param Vector2 v2: second point
         */
        static cross(v1, v2) {
                if ((!v1 instanceof Vector2) || (!v2 instanceof Vector2)) {
                        return new TypeError('Either parameters need to be instances of the Vector2 class');
                }

                let cross;

                cross = (v1.x * v2.y) - (v1.y * v2.x);

                return cross;
        }

        /*
         * add a vector or a number to a vector
         * @param Vector2 v: the vector
         * @param Vector2|Number value: value or vector that is to be added to the vector v
         */
        static add(v, value) {
                if (typeof value === 'number') {
                        value = new Vector2(value, value);
                }

                if (!value instanceof Vector2) {
                        return new TypeError('The value needs to be either a number or a Vector2');
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

                if (!value instanceof Vector2) {
                        return new TypeError('The value needs to be either a number or a Vector2');
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

                if (!value instanceof Vector2) {
                        return new TypeError('The value needs to be either a number or a Vector2');
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

                if (!value instanceof Vector2) {
                        return new TypeError('The value needs to be either a number or a Vector2');
                }

                return new Vector2(v.x / value.x, v.y / value.y);
        }

        /*
         * rotate a vector by a given amount of degrees
         * @param Vector2 v: the vector
         * @param Number degrees: amount of degrees the vector v is to be rotated by
         */
        static rotate(v, degrees) {
                if (typeof degrees !== 'number') {
                        return new TypeError('The degrees need to be a number');
                }

                let radians = -degrees * (Math.PI / 180);

                return new Vector2(
                        v.x * Math.cos(radians) - v.y * Math.sin(radians),
                        v.x * Math.sin(radians) + v.y * Math.cos(radians)
                );
        }
}
