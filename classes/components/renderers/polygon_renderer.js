
class PolygonRenderer extends Renderer {
        type = "Renderer/Polygon Renderer";
        points = [];
        color;
        borderWidth;
        borderColor;
        
        constructor(points, color, borderWidth, borderColor, offset = new Vector2()) {
                // points: array of points that make up the polygon
                // color: fill color
                // borderWidth: width of border
                // borderColor: color of border
                // offset: offset relative to this gameObject's position
                
                super(offset);

                this.points = points;
                this.color = color;
                this.borderWidth = borderWidth;
                this.borderColor = borderColor;
        }

        update() {
                let context = this.gameObject.scene.project.canvasContext;

                context.save();
                context.translate(this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x, this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y);
                context.rotate(this.gameObject.rotationAngle);
                
                // border
                context.lineWidth = this.borderWidth;
                context.strokeStyle = this.borderColor;
                context.beginPath();
                for (let i = 0; i < this.points.length; i++) {
                        context.lineTo(this.points[i].x, this.points[i].y);
                }
                context.lineTo(this.points[0].x, this.points[0].y);
                context.stroke();
                // fill
                context.fillStyle = this.color;
                context.fill();

                context.restore();
        }
}