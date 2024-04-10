
import { Talisman } from './talismans/talisman.js';

import { Ocular } from './enchantments/ocular.js';

import { AttributeHiddenText } from './editor/attributes/attribute_hidden_text.js';

export class Scene {
        project;
        talismans = [];
        attributes = {};
        isCurrentScene = false;
        activeCamera = null;

        constructor(project, name = 'New Scene') {
                this.project = project;

                this.attributes['name'] = new AttributeHiddenText('Name', name);

                // add default main ocular
                this.addTalisman(new Talisman());
                this.talismans[0].attributes['name'].startValue = "Main Ocular";
                this.talismans[0].attributes['name'].value = "Main Ocular";
                // add ocular enchantment to default main ocular
                this.talismans[0].addEnchantment(
                        new Ocular(this.project.settings['canvasWidth'], this.project.settings['canvasHeight'])
                );
        }

        start() {
                //start all game objects
                let i = 0;
                const l = this.talismans.length;

                while (i < l) {
                        if (this.talismans[i].attributes['enabled'].value === true) {
                                this.talismans[i].start();
                        }

                        ++i;
                }

                // get default ocular enchantment
                this.activeCamera = this.getMainOcular();
        }

        processUpdateFrame() {
                // process all enabled talismans
                let i = 0;
                const l = this.talismans.length;

                while (i < l) {
                        if (this.talismans[i].attributes['enabled'].value === true) {
                                this.talismans[i].update();
                                this.talismans[i].lateUpdate();
                        }

                        ++i;
                }

                // get active ocular view
                this.project.canvasContext.clearRect(0, 0, this.project.canvas.width, this.project.canvas.height);

                this.project.canvasContext.drawImage(this.activeCamera.frameImage, 0, 0);
        }

        processFixedUpdateFrame() {
                // process all enabled talismans
                let i = 0;
                const l = this.talismans.length;

                while (i < l) {
                        if (this.talismans[i].attributes['enabled'].value === true) {
                                this.talismans[i].fixedUpdate();
                        }

                        ++i;
                }
        }

        addTalisman(talisman) {
                talisman.scene = this;
                this.talismans.push(talisman);

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

                const index = this.talismans.indexOf(talisman);
                this.talismans.splice(index, 1);

                window.dispatchEvent(new Event('game_object_list_changed'));
        }

        // get main ocular in this scene
        getMainOcular() {
                let i = 0;
                const l = this.talismans.length;

                while (i < l) {
                        const enchantment = this.talismans[i].getEnchantment("Ocular");

                        if (enchantment !== false) {
                                return enchantment;
                        }

                        ++i;
                }

                return null;
        }
}