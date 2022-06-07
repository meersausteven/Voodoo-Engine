
class Vector2 {
        x;
        y;
        magnitude;

        constructor(x = 0, y = 0) {
                this.x = x;
                this.y = y;
                this.magnitude = this.calculateMagnitude();
        }

        // add a value or vector to this vector
        add(value) {
                if (value instanceof Vector2) {
                        // value is a vector
                        this.x += value.x;
                        this.y += value.y;
                } else if (typeof value == "number") {
                        // value is a number
                        this.x += value;
                        this.y += value;
                } else {
                        // value is neither vector nor number, abort
                        return false;
                }

                this.calculateMagnitude();
                
                return true;
        }

        // subtract a value or vector from this vector
        subtract(value) {
                if (value instanceof Vector2) {
                        // value is a vector
                        this.x -= value.x;
                        this.y -= value.y;
                } else if (typeof value == "number") {
                        // value is a number
                        this.x -= value;
                        this.y -= value;
                } else {
                        // value is neither vector nor number, abort
                        return false;
                }

                this.calculateMagnitude();
                
                return true;
        }

        // multiply this vector by a value or vector
        multiply(value) {
                if (value instanceof Vector2) {
                        // value is a vector
                        this.x *= value.x;
                        this.y *= value.y;
                } else if (typeof value == "number") {
                        // value is a number
                        this.x *= value;
                        this.y *= value;
                } else {
                        // value is neither vector nor number, abort
                        return false;
                }

                this.calculateMagnitude();
                
                return true;
        }

        // divide this vector by a value or vector
        divide(value) {
                if (value instanceof Vector2) {
                        // value is a vector
                        this.x /= value.x;
                        this.y /= value.y;
                } else if (typeof value == "number") {
                        // value is a number
                        this.x /= value;
                        this.y /= value;
                } else {
                        // value is neither vector nor number, abort
                        return false;
                }

                this.calculateMagnitude();

                return true;
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

        // get direction of this vector in radians
        getDirectionAsRadians() {
                return Math.atan2(this.y - 0, this.x - 0);
        }

        // get direction of this vector as an angle
        getDirectionAsAngle() {
                return this.getDirectionAsRadians() * (180 / Math.PI);
        }

        rotate(degrees) {
                let radians = -degrees * (Math.PI/180);
                let rotated = new Vector2();

                rotated.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
                rotated.y = this.x * Math.sin(radians) + this.y * Math.cos(radians);

                this.x = rotated.x;
                this.y = rotated.y;

                this.calculateMagnitude();

                return this;
        }
}
