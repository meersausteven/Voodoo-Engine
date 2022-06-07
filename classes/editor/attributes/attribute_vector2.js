
class AttributeVector2 extends AttributeText {
        validate(newValue) {
                if (!isNaN(newValue.x) &&
                    !isNaN(newValue.y)) {
                        return true;
                }

                return false;
        }

        eventCall(event) {
                let parent = event.target.parentElement;
                let newValue = event.target.value;
                
                if ((event.type == 'change') &&
                    (newValue == '')) {
                        if (parent.classList[0].includes('x')) {
                                newValue = this.startValue.x;
                                event.target.value = newValue;
                        } else if (parent.classList[0].includes('y')) {
                                newValue = this.startValue.y;
                                event.target.value = newValue;
                        }
                }

                if (!isNaN(newValue)) {
                        newValue = Number(newValue);

                        if (parent.classList[0].includes('x')) {
                                // offset x changed
                                this.change(new Vector2(newValue, this.value.y));
                        } else if (parent.classList[0].includes('y')) {
                                // offset y changed
                                this.change(new Vector2(this.value.x, newValue));
                        } else {
                                return false;
                        }
                }
        }

        createWidget() {
                let wrapper = document.createElement('div');
                wrapper.classList.add('attribute', 'vector2');
                
                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = this.name;

                // offset x
                let wrapperX = document.createElement('div');
                wrapperX.classList.add('offset_x');

                let labelX = document.createElement('label');
                labelX.innerHTML = 'X';
                
                let inputX = document.createElement('input');
                inputX.setAttribute("type", "text");
                inputX.value = this.value.x;

                inputX.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));

                inputX.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                wrapperX.appendChild(labelX);
                wrapperX.appendChild(inputX);

                // offset y
                let wrapperY = document.createElement('div');
                wrapperY.classList.add('offset_y');

                let labelY = document.createElement('label');
                labelY.innerHTML = 'Y';

                let inputY = document.createElement('input');
                inputY.setAttribute("type", "text");
                inputY.value = this.value.y;

                inputY.addEventListener('keyup', function(e) {
                        this.eventCall(e);
                }.bind(this));

                inputY.addEventListener('change', function(e) {
                        this.eventCall(e);
                }.bind(this));

                wrapperY.appendChild(labelY);
                wrapperY.appendChild(inputY);

                wrapper.appendChild(title);
                wrapper.appendChild(wrapperX);
                wrapper.appendChild(wrapperY);
                
                return wrapper;
        }
}