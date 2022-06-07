
class PolygonCircle extends Polygon {
        radius;
        numOfPoints;
        points;

        constructor(radius, numOfPoints) {
                super();
                
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
