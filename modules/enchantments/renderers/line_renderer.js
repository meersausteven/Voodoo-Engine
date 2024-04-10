
import { AttributeNumber } from './../../editor/attributes/attribute_number.js';
import { AttributeColor } from './../../editor/attributes/attribute_color.js';
import { AttributeBoolean } from './../../editor/attributes/attribute_boolean.js';
import { AttributeSelect } from './../../editor/attributes/attribute_select.js';
import { AttributeArrayNumber } from '../../editor/attributes/attribute_array_number.js';
import { AttributeArrayVector2 } from '../../editor/attributes/attribute_array_vector2.js';

import { Vector2 } from './../../collection/vector2.js';
import { Range } from './../../collection/range.js';

import { Renderer } from './renderer.js';

export class LineRenderer extends Renderer {
        type = "Line Renderer";
        icon = "fa-wave-square";
        defaultPoints = [
                new Vector2(-75, 0),
                new Vector2(75, 0),
        ];

        /*
         * constructor
         * @param Vector2[] points: line points
         * @param number width: line width
         * @param string color: line color
         * @param Vector2 offset: offset relative to this talisman's position
         */
        constructor(points = null, width = 5, color = '#ffffff', loop = false, offset = new Vector2()) {
                super(offset);

                if (points === null) {
                        this.points = this.defaultPoints;
                }

                this.attributes['points'] = new AttributeArrayVector2('Points', this.points);
                this.attributes['width'] = new AttributeNumber('Width', width, null, new Range());
                this.attributes['color'] = new AttributeColor('Color', color);
                this.attributes['loop'] = new AttributeBoolean('Loop', loop);
                this.attributes['smoothing'] = new AttributeBoolean('Smoothing', false);
                this.attributes['dash'] = new AttributeArrayNumber('Dash', [1, 0], null, new Range());
                this.attributes['cap'] = new AttributeSelect('Cap', 'butt', ['butt', 'round', 'square']);
                this.attributes['join'] = new AttributeSelect('Join', 'miter', ['round', 'bevel', 'miter']);
        }

        /*
         * renders a line with multiple points to a ocular enchantment
         * @param Ocular ocular
         */
        render(ocular) {
                if (this.attributes['points'].value.length > 0) {
                        this.renderDefault(ocular);

                        // set line settings
                        ocular.canvasContext.lineWidth = this.attributes['width'].value;
                        ocular.canvasContext.strokeStyle = this.attributes['color'].value;
                        ocular.canvasContext.lineCap = this.attributes['cap'].value;
                        ocular.canvasContext.lineJoin = this.attributes['join'].value;
                        ocular.canvasContext.setLineDash(this.attributes['dash'].value);

                        ocular.canvasContext.beginPath();

                        // draw line
                        ocular.canvasContext.moveTo(this.attributes['points'].value[0].x, this.attributes['points'].value[0].y);

                        let i = 1;
                        const l = this.attributes['points'].value.length;
                        while (i < l) {
                                if (this.attributes['smoothing'].value === true) {
                                        const currPoint = this.attributes['points'].value[i];
                                        const nextPoint = this.attributes['points'].value[i + 1];
                                        if (typeof nextPoint !== "undefined") {
                                                ocular.canvasContext.arcTo(currPoint.x, currPoint.y, nextPoint.x, nextPoint.y, 10);
                                        } else {
                                                ocular.canvasContext.lineTo(currPoint.x, currPoint.y);
                                        }
                                } else {
                                        ocular.canvasContext.lineTo(this.attributes['points'].value[i].x, this.attributes['points'].value[i].y);
                                }

                                ++i;
                        }

                        // draw a line from the last point back to the first point
                        if (this.attributes['loop'].value === true) {
                                ocular.canvasContext.lineTo(this.attributes['points'].value[0].x, this.attributes['points'].value[0].y);
                        }

                        ocular.canvasContext.stroke();

                        ocular.canvasContext.restore();
                }
        }
}