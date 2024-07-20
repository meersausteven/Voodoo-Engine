
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

                this.points = points;
                if (this.points === null) {
                        this.points = this.defaultPoints;
                }

                this.width = width;
                this.color = color;
                this.loop = loop;
                this.smoothing = false;
                this.dash = [1, 0];
                this.cap = 'butt';
                this.join = 'miter';

                this.createAttributes();
        }

        createAttributes() {
                this.editorAttributes['points'] = new AttributeArrayVector2('Points', this.points);
                this.editorAttributes['width'] = new AttributeNumber('Width', this.width, null, new Range());
                this.editorAttributes['color'] = new AttributeColor('Color', this.color, this.set.bind(this, 'color'));
                this.editorAttributes['loop'] = new AttributeBoolean('Loop', this.loop, this.set.bind(this, 'loop'));
                this.editorAttributes['smoothing'] = new AttributeBoolean('Smoothing', this.smoothing, this.set.bind(this, 'smoothing'));
                this.editorAttributes['dash'] = new AttributeArrayNumber('Dash', this.dash, null, new Range());
                this.editorAttributes['cap'] = new AttributeSelect('Cap', this.cap, ['butt', 'round', 'square'], this.set.bind(this, 'cap'));
                this.editorAttributes['join'] = new AttributeSelect('Join', this.join, ['round', 'bevel', 'miter'], this.set.bind(this, 'join'));
        }

        /*
         * renders a line with multiple points to a ocular enchantment
         * @param Ocular ocular
         */
        render(ocular) {
                if (this.points.length > 0) {
                        this.renderDefault(ocular);

                        // set line settings
                        ocular.canvasContext.lineWidth = this.width;
                        ocular.canvasContext.strokeStyle = this.color;
                        ocular.canvasContext.lineCap = this.cap;
                        ocular.canvasContext.lineJoin = this.join;
                        ocular.canvasContext.setLineDash(this.dash);

                        ocular.canvasContext.beginPath();

                        // draw line
                        ocular.canvasContext.moveTo(this.points[0].x, this.points[0].y);

                        let i = 1;
                        const l = this.points.length;
                        while (i < l) {
                                if (this.smoothing === true) {
                                        const currPoint = this.points[i];
                                        const nextPoint = this.points[i + 1];
                                        if (typeof nextPoint !== "undefined") {
                                                ocular.canvasContext.arcTo(currPoint.x, currPoint.y, nextPoint.x, nextPoint.y, 10);
                                        } else {
                                                ocular.canvasContext.lineTo(currPoint.x, currPoint.y);
                                        }
                                } else {
                                        ocular.canvasContext.lineTo(this.points[i].x, this.points[i].y);
                                }

                                ++i;
                        }

                        // draw a line from the last point back to the first point
                        if (this.loop === true) {
                                ocular.canvasContext.lineTo(this.points[0].x, this.points[0].y);
                        }

                        ocular.canvasContext.stroke();

                        ocular.canvasContext.restore();
                }
        }
}