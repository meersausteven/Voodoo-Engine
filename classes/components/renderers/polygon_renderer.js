
class PolygonRenderer extends Renderer {
        type = "Polygon Renderer";
        
        constructor(points, fillColor, borderWidth, borderColor, offset = new Vector2()) {
                // array points: array of points that make up the polygon
                // color fillColor: fill color
                // int borderWidth: width of border
                // color borderColor: color of border
                // Vector2 offset: offset relative to this gameObject's position
                
                super(offset);

                this.attributes['points'] = points;
                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth);
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
        }

        render(camera) {
                if ((camera === null) ||
                    (typeof camera === 'undefined') ||
                    !(camera instanceof Camera)) {
                        return false;
                }
                
                camera.canvasContext.save();
                camera.canvasContext.translate(this.gameObject.transform.attributes['position'].value.x + this.attributes['offset'].value.x - camera.gameObject.transform.attributes['position'].value.x, this.gameObject.transform.attributes['position'].value.y + this.attributes['offset'].value.y - camera.gameObject.transform.attributes['position'].value.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.gameObject.transform.attributes['rotation'].value + camera.gameObject.transform.attributes['rotation'].value));
                
                // border
                camera.canvasContext.lineWidth = this.attributes['borderWidth'].value;
                camera.canvasContext.strokeStyle = this.attributes['borderColor'].value;
                camera.canvasContext.beginPath();
                for (let i = 0; i < this.attributes['points'].length; i++) {
                        camera.canvasContext.lineTo(this.attributes['points'][i].x, this.attributes['points'][i].y);
                }
                camera.canvasContext.lineTo(this.attributes['points'][0].x, this.attributes['points'][0].y);
                camera.canvasContext.stroke();
                // fill
                camera.canvasContext.fillStyle = this.attributes['fillColor'].value;
                camera.canvasContext.fill();

                camera.canvasContext.restore();
        }
}