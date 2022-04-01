
// collection of different classes to make things easier

// simple 2d vector with x and y values
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

// Polygon Construction Classes

// Circle
class PolygonCircle {
        radius;
        numOfPoints;
        points;

        constructor(radius, numOfPoints) {
                this.radius = radius;
                this.numOfPoints = numOfPoints;

                this.points = this.calculatePoints();
        }

        calculatePoints() {
                let points = [];

                for (let i = 0; i < this.numOfPoints; i++) {
                        let point = new Vector2(0, this.radius);

                        point.rotate(i * (360 / this.numOfPoints));

                        points.push(point);
                }

                return points;
        }
}

// Capsule
class PolygonCapsule {
        radius;
        numOfCirclePoints;
        distance;
        direction;
        points;

        constructor(radius, numOfCirclePoints, distance, direction = "horizontal") {
                this.radius = radius;
                this.numOfCirclePoints = numOfCirclePoints;
                this.distance = distance;
                this.direction = direction;

                this.points = this.calculatePoints();
        }

        calculatePoints() {
                let points = [];

                let circleOneStartAngle = 0;
                let circleOneOffset = new Vector2();
                let circleTwoStartAngle = 0;
                let circleTwoOffset = new Vector2();

                if (this.direction == "horizontal") {
                        // circleOne = left circle
                        // circleTwo = right circle
                        circleOneStartAngle = 180;
                        circleOneOffset = new Vector2(
                                this.distance / -2,
                                0
                        );
                        circleTwoStartAngle = 0;
                        circleTwoOffset = new Vector2(
                                this.distance / 2,
                                0
                        );
                } else if (this.direction == "vertical") {
                        // circleOne = top circle
                        // circleTwo = bottom circle
                        circleOneStartAngle = 90;
                        circleOneOffset = new Vector2(
                                0,
                                this.distance / -2
                        );
                        circleTwoStartAngle = 270;
                        circleTwoOffset = new Vector2(
                                0,
                                this.distance / 2
                        );
                }
                
                // first half of circle
                for (let i = 0; i <= this.numOfCirclePoints / 2; i++) {
                        let point = new Vector2(0, this.radius);

                        point.rotate(circleOneStartAngle + (i * (360 / this.numOfCirclePoints)));

                        point.add(circleOneOffset);
                        points.push(point);
                }

                // second half of circle
                for (let i = 0; i <= this.numOfCirclePoints / 2; i++) {
                        let point = new Vector2(0, this.radius);

                        point.rotate(circleTwoStartAngle + (i * (360 / this.numOfCirclePoints)));

                        point.add(circleTwoOffset);
                        points.push(point);
                }

                return points;
        }
}