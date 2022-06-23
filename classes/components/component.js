
class Component {
        type = "Component";
        gameObject = null;
        attributes = {};

        constructor() {
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
                
                return;
        }

        start() {
                return;
        }

        update() {
                return;
        }

        fixedUpdate() {
                return;
        }

        lateUpdate() {
                return;
        }

        render() {
                return;
        }

        prepareForJsonExport() {
                let dummy = {};

                dummy.type = this.type;
                dummy.attributes = {};

                // component attributes
                for (let key in this.attributes) {
                        if ((key === 'remove') ||
                            (key === 'clear'))
                        {
                                continue;
                        }

                        if (!(this.attributes[key] instanceof AttributeText)) {
                                dummy.attributes[key] = this.attributes[key];

                                continue;
                        }

                        dummy.attributes[key] = {};

                        dummy.attributes[key].name = this.attributes[key].name;
                        dummy.attributes[key].value = this.attributes[key].value;
                }
                
                return dummy;
        }
}