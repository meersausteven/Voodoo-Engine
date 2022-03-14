
class Collider extends Component {
        type = "Collider";
        isTrigger = false;
        insideTrigger = [];
        offset = new Vector2();
        worldPos = new Vector2();

        constructor(isTrigger, offset) {
                super();
                
                this.isTrigger = isTrigger;
                this.insideTrigger = [];
                this.offset = offset;

                this.worldPos = new Vector2(
                        this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x,
                        this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y
                );
        }

        update() {
                this.worldPos = new Vector2(
                        this.gameObject.pos.x + this.offset.x - this.gameObject.scene.mainCamera.pos.x,
                        this.gameObject.pos.y + this.offset.y - this.gameObject.scene.mainCamera.pos.y
                );
        }
        
}