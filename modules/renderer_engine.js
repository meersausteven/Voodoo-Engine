
import { Vector2 } from './collection/vector2.js';
import { AttributeArrayText } from './editor/attributes/attribute_array_text.js';
import { AttributeVector2 } from './editor/attributes/attribute_vector2.js';

export class RendererEngine {
        renderers = [];
        settings = {
                renderAxis: new AttributeVector2("Render Axis", Vector2.zero),
                renderLayers: new AttributeArrayText("Render Layers", [
                        "Background 1",
                        "Background 2",
                        "Background 3",
                        "Center",
                        "Foreground 1",
                        "Foreground 2",
                        "Foreground 3",
                ]),
                
        };

        /*
         * adds a Renderer to the renderer stack
         * @param Renderer renderer: the renderer that is to be added
         */
        addComponentRenderer(renderer) {
                // don't add if already in the array
                let i = 0;
                const l = this.renderers.length;

                while (i < l) {
                        if (this.renderers[i] === renderer) {
                                return;
                        }

                        ++i;
                }

                this.renderers.push(renderer);
        }

        /*
         * removes a Renderer from the renderer stack
         * @param int index: array index of the Renderer that is to be removed
         */
        removeComponentRenderer(renderer) {
                let i = 0;
                const l = this.renderers.length;

                while (i < l) {
                        if (this.renderers[i] === renderer) {
                                this.renderers[i] = null;
                                return;
                        }

                        ++i;
                }
        }

        /*
         * renders all renderer enchantments in the renderer stack to a passed ocular enchantment
         * @param Ocular ocular: the ocular enchantment to which it should render
         */
        renderToCameraView(ocular) {
                let i = 0;
                const l = this.renderers.length;

                while (i < l) {
                        if (this.renderers[i].talisman === null) {
                                ++i;

                                continue;
                        }

                        if ((this.renderers[i].talisman.attributes['enabled'].value === true) && 
                            (this.renderers[i].attributes['enabled'].value === true)
                        ) {
                                ocular.canvasContext.save();
                                ocular.canvasContext.translate(ocular.talisman.scene.project.settings['canvasWidth'] / 2, ocular.talisman.scene.project.settings['canvasHeight'] / 2)

                                this.renderers[i].render(ocular);

                                ocular.canvasContext.restore();
                        }

                        ++i;
                }
        }
}