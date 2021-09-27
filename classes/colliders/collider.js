
class Collider {
        constructor(parent, camera, isTrigger, offsetX, offsetY) {
                this.parent = parent;
                this.camera = camera;
                this.isTrigger = isTrigger;
                this.insideTrigger = [];
                this.offset = {
                        x: offsetX,
                        y: offsetY
                };

                this.type = "Collider";

                this.worldPos = {
                        x: this.parent.pos.x + this.offset.x - this.camera.pos.x,
                        y: this.parent.pos.y + this.offset.y - this.camera.pos.y
                };
        }

        update() {
                this.worldPos = {
                        x: this.parent.pos.x + this.offset.x - this.camera.pos.x,
                        y: this.parent.pos.y + this.offset.y - this.camera.pos.y
                };
        }
        
}