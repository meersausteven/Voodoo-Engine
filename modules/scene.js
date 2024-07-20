
import { Talisman } from './talismans/talisman.js';

import { Ocular } from './enchantments/ocular.js';

import { AttributeHiddenText } from './editor/attributes/attribute_hidden_text.js';

export class Scene {
        project;
        talismans = {};
        isCurrentScene = false;
        activeOcular = null;

        constructor(project, name = 'New Scene') {
                this.project = project;
                this.name = name;

                // add default main ocular
                const mainOcular = new Talisman();
                mainOcular.set('name', "Main Ocular");
                mainOcular.editorAttributes['name'].startValue = "Main Ocular";
                mainOcular.editorAttributes['name'].value = "Main Ocular";

                // add ocular enchantment to default main ocular
                mainOcular.addEnchantment(
                        new Ocular(this.project.settings['canvasWidth'], this.project.settings['canvasHeight'])
                );

                this.addTalisman(mainOcular);
        }

        start() {
                //start all game objects
                for (const id in this.talismans) {
                        const talisman = this.talismans[id];

                        if (talisman instanceof Talisman) {
                                if (talisman.enabled === true) {
                                        talisman.start();
                                }
                        }
                }

                // get default ocular enchantment
                this.activeOcular = this.getMainOcular();
        }

        processUpdateFrame() {
                // process all enabled talismans
                for (const id in this.talismans) {
                        const talisman = this.talismans[id];

                        if (talisman instanceof Talisman) {
                                if (talisman.enabled === true) {
                                        talisman.update();
                                        talisman.lateUpdate();
                                }
                        }
                }

                // get active ocular view
                this.project.canvasContext.clearRect(0, 0, this.project.canvas.width, this.project.canvas.height);

                this.project.canvasContext.drawImage(this.activeOcular.frameImage, 0, 0);
        }

        processFixedUpdateFrame() {
                // process all enabled talismans
                for (const id in this.talismans) {
                        const talisman = this.talismans[id];

                        if (talisman instanceof Talisman) {
                                if (talisman.enabled === true) {
                                        talisman.fixedUpdate();
                                }
                        }
                }
        }

        addTalisman(talisman) {
                talisman.scene = this;
                this.talismans[talisman.id] = talisman;

                window.dispatchEvent(new Event('game_object_list_changed'));
        }

        removeTalisman(talisman) {
                // first remove all enchantments to trigger their callbacks
                let i = 0;
                const l = talisman.enchantments.length;
                while (i < l) {
                        talisman.removeEnchantment(i);

                        ++i;
                }

                this.talismans[talisman.id] = undefined;

                window.dispatchEvent(new Event('game_object_list_changed'));
        }

        // get main ocular in this scene
        getMainOcular() {
                for (const id in this.talismans) {
                        const talisman = this.talismans[id];

                        if (talisman instanceof Talisman) {
                                const enchantment = talisman.getEnchantment("Ocular");

                                if (enchantment !== false) {
                                        return enchantment;
                                }
                        }
                }

                return null;
        }
}