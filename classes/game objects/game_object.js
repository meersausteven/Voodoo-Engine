
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

                this.attributes['name'] = new AttributeText('Name', "New GameObject");
                this.attributes['enabled'] = new AttributeBoolean('Enabled', true);
        }

        start() {
                // start all components
                let i = 0;
                let l = this.components.length;

                while (i < l) {
                        this.components[i].start();
                        
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

        prepareForJsonExport() {
                let dummy = {};

                // game object attributes
                dummy.attributes = {};

                for (let key in this.attributes) {
                        if ((key === 'remove') ||
                                (key === 'clear'))
                        {
                                continue;
                        }

                        dummy.attributes[key] = {};

                        dummy.attributes[key].type = this.attributes[key].type;
                        dummy.attributes[key].name = this.attributes[key].name;
                        dummy.attributes[key].value = this.attributes[key].value;
                }

                // game object components
                dummy.components = [];

                let i = 0;
                let l = this.components.length;
                while (i < l) {
                        dummy.components[i] = this.components[i].prepareForJsonExport();

                        ++i;
                }

                return dummy;
        }

        createCard() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('game_object');
                wrapper.addEventListener('click', function(e) {
                        let thisElement = e.target.closest('.game_object');

                        if (!thisElement.classList.contains('selected')) {
                                let selected = thisElement.parentElement.querySelector('.selected');
                                if ((selected !== null) &&
                                    (selected !== thisElement)) {
                                        selected.classList.remove('selected');
                                        this.clearInfoCard();
                                }

                                this.createInfoCard();
                                thisElement.classList.add('selected');
                        } else {
                                thisElement.classList.remove('selected');
                                this.clearInfoCard();
                        }
                }.bind(this));

                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = this.attributes['name'].value;
                this.nameNode = title;

                wrapper.appendChild(title);

                let listNode = document.querySelector(this.scene.project.settings.gameObjectListWrapper);
                listNode.appendChild(wrapper);
        }

        createInfoCard() {
                let i = 0;
                let l = this.components.length;

                // create info card
                let card = document.createElement('div');
                card.classList.add('card');

                let title = document.createElement('div');
                title.classList.add('card_title');
                title.appendChild(this.createInfoTitle());

                let content = document.createElement('div');
                content.classList.add('card_content');

                // add component cards to card content
                while (i < l) {
                        content.appendChild(this.components[i].createCard());

                        ++i;
                }

                // add new component select to card content
                let select = document.createElement('select');
                select.classList.add('add_component');

                let defaultOption = document.createElement('option');
                defaultOption.innerHTML = "Add new Component";
                defaultOption.value = 0;

                select.appendChild(defaultOption);

                let j = 0;
                let ac = this.scene.project.availableComponents.length;

                while (j < ac) {
                        let option = document.createElement('option');
                        option.innerHTML = this.scene.project.availableComponents[j];
                        option.value = this.scene.project.availableComponents[j];

                        select.appendChild(option);

                        ++j;
                }
                select.addEventListener('change', function(e) {
                        let selectedOption = e.target.children[e.target.selectedIndex].value;
                        if (selectedOption !== 0) {
                                let newComponent = eval(`new ${selectedOption}()`);

                                this.addComponent(newComponent);
                        }
                        
                        this.clearInfoCard();
                        this.createInfoCard();
                }.bind(this));

                content.appendChild(select);

                card.appendChild(title);
                card.appendChild(content);

                let listNode = document.querySelector(this.scene.project.settings.componentListWrapper);
                listNode.appendChild(card);
        }

        clearInfoCard() {
                let listNode = document.querySelector(this.scene.project.settings.componentListWrapper);
                let i = 0;
                let l = listNode.children.length;

                while (i < l) {
                        listNode.lastElementChild.remove();
                        
                        ++i;
                }
        }

        createInfoTitle() {
                let content = document.createElement('div');
                content.classList.add('content');

                for (let key in this.attributes) {
                        if (this.attributes[key] instanceof AttributeText) {
                                let widget = this.attributes[key].createWidget();

                                if (key === 'name') {
                                        widget.querySelector('input').addEventListener('value_changed', function(e) {
                                                this.#updateName();
                                        }.bind(this));                
                                }

                                content.appendChild(widget);
                        }
                }

                return content;
        }

        #updateName() {
                this.nameNode.innerHTML = this.attributes['name'].value;

                return true;
        }
}