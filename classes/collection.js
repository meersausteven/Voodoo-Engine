
// collection of different classes to make things easier

// simple 2d vector with x and y values
class Vector2 {
        x;
        y;
        magnitude;

        constructor(x = 0, y = 0) {
                this.x = x;
                this.y = y;
                this.magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));
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
}

class Debugger {
        console = document.getElementById("console");
        consoleContent = this.console.querySelector('.content');

        log(text) {
                let html = "<div class='console-log'>";
                    html += "Log: " + text;
                    html += "</div>";

                this.#add(html);
        }

        warning(text) {
                let html = "<div class='console-warning'>";
                    html += "Warning: " + text;
                    html += "</div>";

                this.#add(html);
        }

        error(text) {
                let html = "<div class='console-error'>";
                    html += "Error: " + text;
                    html += "</div>";

                this.#add(html);
        }

        #add(html) {
                this.consoleContent.innerHTML += html;
        }
}