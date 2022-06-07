
class PolygonCapsule extends Polygon {
        radius;
        numOfCirclePoints;
        distance;
        direction;
        points;

        constructor(radius, numOfCirclePoints, distance, direction = "horizontal") {
                super();
                
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
