
class CapsuleCollider extends Collider {
        type = "Collider/Capsule Collider";
        radius = 0;
        distance = 0;
        direction = null;

        constructor(radius, distance, isTrigger = false, offset = new Vector2(), direction = "horizontal") {
                // gameObject: the gameObject this component belongs to
                // camera active game camera
                // radius: radius of the circles on the ends
                // distance: distance between the circles' centers
                // direction: direction of the capsule ("horizontal" or "vertical")
                // offset: offset starting from bottom center of the gameObject
                super(isTrigger, offset);

                this.radius = radius;
                this.distance = distance;
                this.direction = direction;

                // arrange the colliders making up the capsule depending on the direction it's going
                let boxWidth, boxHeight = 0;
                let boxOff, firstCircleOff, secondCircleOff = new Vector2();
                
                if (this.direction == "horizontal") {
                        boxWidth = this.distance;
                        boxHeight = this.radius * 2;
                        boxOff = new Vector2(
                                this.offset.x,
                                this.offset.y
                        );
                        // left circle
                        firstCircleOff = new Vector2(
                                this.offset.x - (boxWidth / 2),
                                this.offset.y - this.radius
                        );
                        // right circle
                        secondCircleOff = new Vector2(
                                this.offset.x + (boxWidth / 2),
                                this.offset.y - this.radius
                        );
                } else {
                        boxWidth = this.radius * 2;
                        boxHeight = this.distance;
                        boxOff = new Vector2(
                                this.offset.x,
                                this.offset.y
                        );
                        // top circle
                        firstCircleOff = new Vector2(
                                this.offset.x,
                                this.offset.y - boxHeight - this.radius
                        );
                        // bottom circle
                        secondCircleOff = new Vector2(
                                this.offset.x,
                                this.offset.y + this.radius
                        );
                }
                
                // build a capsule using two circle- and one box-collider
                this.gameObject.collider.push(
                        new CircleCollider(this.radius, this.isTrigger, firstCircleOff.x, firstCircleOff.y)
                );
                this.gameObject.collider.push(       
                        new BoxCollider(boxWidth, boxHeight, this.isTrigger, boxOff.x, boxOff.y)
                ); 
                this.gameObject.collider.push(
                        new CircleCollider(this.radius, this.isTrigger, secondCircleOff.x, secondCircleOff.y)
                );
                
                // remove this fake collider from this parents colliders
                this.gameObject.collider = this.gameObject.collider.filter(el => el.type !== this.type);
        }
}