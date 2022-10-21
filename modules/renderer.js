
import { ComponentRenderer } from './components/renderers/component_renderer.js';

export class Renderer {
        settings = {

        };
        componentRenderer = [];

        addComponentRenderer(renderer) {
                if (renderer instanceof ComponentRenderer) {
                        let i = 0;
                        let l = this.componentRenderer.length;

                        while (i < l) {
                                if (this.componentRenderer[i] === renderer) {
                                        return;
                                }

                                ++i;
                        }

                        this.componentRenderer.push(renderer);

                        return true;
                }
        }

        removeComponentRenderer(index) {
                if ((typeof index == "number") &&
                    ((this.componentRenderer[index] !== null) &&
                    (typeof this.componentRenderer[index] != "undefined"))
                ) {
                        this.componentRenderer[index] = null;

                        dispatchEvent(new Event('component_renderer_list_changed'));

                        return true;
                }
        }

        renderToCameraView(camera) {
                let i = 0;
                let l = this.componentRenderer.length;
                while (i < l) {
                        if ((this.componentRenderer[i].attributes['enabled'].value === true) &&
                            (this.componentRenderer[i].gameObject.attributes['enabled'].value === true))
                        {
                                this.componentRenderer[i].render(camera);
                        }

                        ++i;
                }
        }
}