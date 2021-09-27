
class CapsuleCollider extends Collider {
        constructor(parent, camera, radius, distance, isTrigger = false, offsetX = 0, offsetY = 0, direction = "horizontal") {
                // parent: a GameObject
                // camera active game camera
                // radius: radius of the circles on the ends
                // distance: distance between the circles' centers
                // direction: direction of the capsule ("horizontal" or "vertical")
                // offsetX: offset on the x axis (starting from center of parent)
                // offsetY: offset on the y axis (starting from bottom of parent)
                super(parent, camera, isTrigger, offsetX, offsetY);

                this.type = "Capsule Collider";

                this.radius = radius;
                this.distance = distance;
                this.direction = direction;

                // arrange the colliders making up the capsule depending on the direction it's going
                let boxWidth, boxHeight, boxOffX, boxOffY = 0;
                let firstCircleOffX, firstCircleOffY, secondCircleOffX, secondCircleOffY = 0;
                
                if (this.direction == "horizontal") {
                        boxWidth = this.distance;
                        boxHeight = this.radius * 2;
                        boxOffX = this.offset.x;
                        boxOffY = this.offset.y;
                        // left circle
                        firstCircleOffX = this.offset.x - (boxWidth / 2);
                        firstCircleOffY = this.offset.y - this.radius;
                        // right circle
                        secondCircleOffX = this.offset.x + (boxWidth / 2);
                        secondCircleOffY = this.offset.y - this.radius;
                } else {
                        boxWidth = this.radius * 2;
                        boxHeight = this.distance;
                        boxOffX = this.offset.x;
                        boxOffY = this.offset.y;
                        // top circle
                        firstCircleOffX = this.offset.x;
                        firstCircleOffY = this.offset.y - boxHeight - this.radius;
                        // bottom circle
                        secondCircleOffX = this.offset.x;
                        secondCircleOffY = this.offset.y + this.radius;
                }
                
                // build a capsule using two circle- and one box-collider
                this.parent.collider.push(
                        new CircleCollider(this.parent, this.camera, this.radius, this.isTrigger, firstCircleOffX, firstCircleOffY)
                );
                this.parent.collider.push(       
                        new BoxCollider(this.parent, this.camera, boxWidth, boxHeight, this.isTrigger, boxOffX, boxOffY)
                ); 
                this.parent.collider.push(
                        new CircleCollider(this.parent, this.camera, this.radius, this.isTrigger, secondCircleOffX, secondCircleOffY)
                );
                
                // remove this fake collider from this parents colliders
                this.parent.collider = this.parent.collider.filter(el => el.type !== this.type);
        }
}