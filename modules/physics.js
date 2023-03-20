import { Vector2 } from './collection/vector2.js';

import { AttributeBoolean } from './editor/attributes/attribute_boolean.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';

export class Physics {
        attributes = {};

        constructor() {
                this.attributes['gravity'] = new AttributeVector2('Gravity', new Vector2(0, 9.81));
                this.attributes['airResistance'] = new AttributeVector2('Air Resistance', new Vector2(1.02, 1.02));
                this.attributes['massGravity'] = new AttributeBoolean('Mass creates gravity', false);
        }


        // todo: add better general collision calculation -> e.g. separated axis theorem or something
        // todo: add proper collision calculation -> impulse
        // todo: p = m * v
        // todo: impulse/force = mass * velocity

        // check if a circle and a square are overlapping
        // takes in a circles x, y and radius and a box colliders' x, y, width and height
        circleBoxOverlapping(circle, box, checkPos = null, checkingType = null) {
                if (checkPos != null) {
                        let colliderLookup = {
                                "Circle Collider": function() {
                                        circle.worldPos.x = checkPos.x;
                                        circle.worldPos.y = checkPos.y;
                                },
                                "Box Collider": function() {
                                        box.worldPos.x = checkPos.x;
                                        box.worldPos.y = checkPos.y;
                                }
                        };

                        colliderLookup[checkingType];
                }

                // temporary variables to set edges for testing
                let testX = circle.worldPos.x;
                let testY = circle.worldPos.y;

                // which edge is closest?
                if (circle.worldPos.x < box.worldPos.x - (box.width / 2)) {
                        // left edge
                        testX = box.worldPos.x - (box.width / 2);
                } else if (circle.worldPos.x > box.worldPos.x + (box.width / 2)) {
                        // right edge
                        testX = box.worldPos.x + (box.width / 2);
                }

                if (circle.worldPos.y < box.worldPos.y - box.height) {
                        // top edge
                        testY = box.worldPos.y - box.height;
                } else if (circle.worldPos.y > box.worldPos.y) {
                        // bottom edge
                        testY = box.worldPos.y;
                }

                // get distance from closest edges
                let distX = circle.worldPos.x - testX;
                let distY = circle.worldPos.y - testY;
                let dist = Math.sqrt((distX * distX) + (distY * distY));

                if (dist <= circle.radius) {
                        return true;
                }

                return false;
        }

        // check if two squares are overlapping
        // takes in the two squares' x and y from their sides
        boxesOverlapping(box1, box2, checkPos = null) {
                if (checkPos != null) {
                        box1.worldPos.x = checkPos.x;
                        box1.worldPos.y = checkPos.y;
                }

                let b1LeftEdge = box1.worldPos.x - (box1.width / 2);
                let b1RightEdge = box1.worldPos.x + (box1.width / 2);
                let b1BottomEdge = box1.worldPos.y;
                let b1TopEdge = box1.worldPos.y - box1.height;

                let b2LeftEdge = box2.worldPos.x - (box2.width / 2);
                let b2RightEdge = box2.worldPos.x + (box2.width / 2);
                let b2BottomEdge = box2.worldPos.y;
                let b2TopEdge = box2.worldPos.y - box2.height;

                let b1_leftOf_b2 = b1RightEdge < b2LeftEdge;
                let b1_rightOf_b2 = b1LeftEdge > b2RightEdge;
                let b1_above_b2 = b1BottomEdge > b2TopEdge;
                let b1_below_b2 = b1TopEdge < b2BottomEdge;

                if (!b1_leftOf_b2 || !b1_rightOf_b2 || !b1_above_b2 || !b1_below_b2) {
                        return true;
                }

                return false;
        }

        // check if two cirlces are overlapping
        // takes in the two circles' x, y and radius
        circlesOverlapping(circle1, circle2, checkPos = null) {
                if (checkPos != null) {
                        circle1.worldPos.x = checkPos.x;
                        circle1.worldPos.y = checkPos.y;
                }

                let distX = circle1.worldPos.x - circle2.worldPos.x;
                let distY = circle1.worldPos.y - circle2.worldPos.y;
                let dist = Math.sqrt((distX * distX) + (distY * distY));

                if (dist <= circle1.radius + circle2.radius) {
                        return true;
                }

                return false;
        }
}