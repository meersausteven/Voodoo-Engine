
class Transform extends Component {
        type = "Transform";
        
        constructor(position = new Vector2(), rotation = 0) {
                super();

                // transform components may not be disabled
                this.attributes['enabled'] = true;
                this.attributes['position'] = new AttributeVector2('Position', position);
                this.attributes['rotation'] = new AttributeNumber('Rotation', rotation);
        }
        
/*
        @todo: implement gizmos to move in scene during edit mode when gameobject is focused
        showGizmo() {
                let context = this.gameObject.scene.project.canvasContext;

                context.save();
                // position
                context.translate(this.components[0].attributes.position.value.x - this.scene.mainCamera.components[0].attributes.position.value.x, this.components[0].attributes.position.value.y - this.scene.mainCamera.components[0].attributes.position.value.y);
                context.rotate(this.components[0]);
                // @todo: add gizmo for positioning and rotating in edit mode
                // up arrow
                context.lineWidth = 2;
                context.strokeStyle = "#00ff00";
                context.beginPath();
                
                context.moveTo(0, 0);
                context.lineTo(0, -50);
                context.moveTo(0, -52);
                context.lineTo(-6, -40);
                context.moveTo(0, -52);
                context.lineTo(6, -40);

                context.stroke();
                // right arrow
                context.strokeStyle = "#0000ff";
                context.beginPath();
                
                context.moveTo(0, 0);
                context.lineTo(50, 0);
                context.moveTo(52, 0);
                context.lineTo(40, 6);
                context.moveTo(52, 0);
                context.lineTo(40, -6);

                context.stroke();

                context.restore();
        }
        */
}