
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
        
        createCard() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('component');
                // transform components are open by default
                if (this instanceof Transform) {
                        wrapper.classList.add('open');
                }

                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = this.type;
                
                let collapse = document.createElement('div');
                collapse.classList.add('collapse');
                collapse.innerHTML = "&#10095;";

                collapse.addEventListener('click', function() {
                        this.closest('.component').classList.toggle('open');
                });

                title.appendChild(collapse);
                
                let content = document.createElement('div');
                content.classList.add('content');

                for (let key in this.attributes) {
                        if (this.attributes[key] instanceof AttributeText) {
                                content.appendChild(this.attributes[key].createWidget());
                        }
                }

                wrapper.appendChild(title);
                wrapper.appendChild(content);

                return wrapper;
        }
}