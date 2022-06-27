
class BoxRenderer extends ComponentRenderer {
        type = "Box Renderer";
        
        constructor(width = 50, height = 50, fillColor = '#ffffff', borderWidth = 0, borderColor = '#000000', offset = new Vector2()) {
                // int width: width of the box
                // int height: height of the box
                // color fillColor: fill color
                // int borderWidth: width of border
                // color borderColor: color of border
                // Vector2 offset: offset relative to this gameObject's position
                
                super(offset);

                this.attributes['width'] = new AttributeNumber('Width', width);
                this.attributes['height'] = new AttributeNumber('Height', height);
                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth);
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
        }

        render(camera) {
                camera.canvasContext.save();
                camera.canvasContext.translate(this.gameObject.transform.attributes['position'].value.x + this.attributes['offset'].value.x - camera.worldPos.x, this.gameObject.transform.attributes['position'].value.y + this.attributes['offset'].value.y - camera.worldPos.y);
                camera.canvasContext.rotate(Math.degreesToRadians(this.gameObject.transform.attributes['rotation'].value));
                // border
                if (this.attributes['borderWidth'].value > 0) {
                        camera.canvasContext.lineWidth = this.attributes['borderWidth'].value;
                        camera.canvasContext.strokeStyle = this.attributes['borderColor'].value;
                        camera.canvasContext.strokeRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);
                }
                // fill
                camera.canvasContext.fillStyle = this.attributes['fillColor'].value;
                camera.canvasContext.fillRect(-this.attributes['width'].value / 2, -this.attributes['height'].value / 2, this.attributes['width'].value, this.attributes['height'].value);

                camera.canvasContext.restore();

                return true;
        }
}