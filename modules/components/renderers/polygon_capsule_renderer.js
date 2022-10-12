
class PolygonCapsuleRenderer extends PolygonRenderer {
        type = "Polygon Capsule Renderer";
        
        constructor(polygonCapsule = new PolygonCapsule(30, 12, 40), fillColor = '#ff0000', borderWidth = 2, borderColor = '#ffffff', offset = new Vector2()) {
                // PolygonCapsule polygonCapsule: polygon circle
                // color fillColor: fill color
                // int borderWidth: width of border
                // color borderColor: color of border

                super(polygonCapsule.points, fillColor, borderWidth, borderColor, offset);

                this.attributes['polygonCapsule'] = polygonCapsule;
                this.attributes['fillColor'] = new AttributeColor('Fill Color', fillColor);
                this.attributes['borderWidth'] = new AttributeNumber('Border Width', borderWidth);
                this.attributes['borderColor'] = new AttributeColor('Border Color', borderColor);
        }

        render(camera) {
                super.render(camera);
        }
}
