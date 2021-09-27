
class DoorPreset extends InteractableObject {
        constructor(game, x, y, width = 74, height = 106, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Door";
                this.renderer = new ImageRenderer(this, "objects/interactables/door.png");

                this.state = "closed";
                this.interactable = true;
                this.items = [];

                this.openStateColliders = [
                        new BoxCollider(this, this.game.activeCamera, this.width / 4.5, this.height / 3, false, -this.width / 2.5),
                        new BoxCollider(this, this.game.activeCamera, this.width / 4.5, this.height / 3, false, this.width / 2.5),
                        // trigger
                        new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2 + 15, true, 0, 15)
                ];
                this.openStateRenderer = new ImageRenderer(this, "objects/interactables/door_open.png");

                this.closedStateColliders = [
                        new BoxCollider(this, this.game.activeCamera, this.width, this.height / 3),
                        // trigger
                        new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2 + 15, true, 0, 15)
                ];
                this.closedStateRenderer = new ImageRenderer(this, "objects/interactables/door.png");

                this.collider = this.closedStateColliders;
        }

        onAction(actor = null, actionType = null) {
                super.onAction(actor, actionType);

                if (actionType == "triggerEnter") {
                        if (this.state == "closed") {
                                this.collider = this.openStateColliders;
                                this.renderer = this.openStateRenderer;
                                this.state = "open";
                        }
                } else if (actionType == "triggerLeave") {
                        if (this.state == "open") {
                                this.collider = this.closedStateColliders;
                                this.renderer = this.closedStateRenderer;
                                this.state = "closed";
                        }
                }
        }
        
}