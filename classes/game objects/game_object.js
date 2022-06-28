
class GameObject {
        type = "Game Object";
        components = [];
        transform;
        attributes = {};

        constructor(x = 0, y = 0, rotation = 0) {
                // every game object is created with a transform component
                let transform = new Transform(new Vector2(x, y), rotation);
                this.addComponent(transform);

                this.transform = this.getTransform();

                this.attributes['name'] = new AttributeHiddenText('Name', "New GameObject");
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
        }

        start() {
                // start all components
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].start();
                        console.log("started " + this.components[i].type);
                        ++i;
                }
        }

        update() {
                // update is called every frame
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].update();
                        }
                        
                        ++i;
                }
        }

        fixedUpdate() {
                // fixed update is called in a certain interval (default: 10ms)
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].fixedUpdate();
                        }
                        
                        ++i;
                }
        }

        lateUpdate() {
                // late update is called after update()
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i].attributes['enabled'].value === true) {
                                this.components[i].lateUpdate();
                        }
                        
                        ++i;
                }
        }
        
        addComponent(component) {
                if (component instanceof Component) {
                        component.gameObject = this;
                        this.components.push(component);

                        return true;
                }

                return false;
        }

        removeComponent(index) {
                if ((typeof index == "number") &&
                    (this.components[index] !== null) &&
                    (typeof this.components[index] != "undefined"))
                {
                        this.components[index] = null;

                        return true;
                }

                return false;
        }
        
        getTransform() {
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        if (this.components[i] instanceof Transform) {
                                return this.components[i];
                        }

                        ++i;
                }

                return null;
        }
}