
import { AttributeBoolean } from './../editor/attributes/attribute_boolean.js';
import { AttributeNumber } from './../editor/attributes/attribute_number.js';
import { AttributeText } from './../editor/attributes/attribute_text.js';

import { Component } from './component.js';

export class Animation extends Component {
        type = "Animation";
        
        constructor(imageRenderer, animationName, numberOfFrames = 1, timePerFrame = 100, looping = true) {
                // imageRenderer: an image renderer as GameObject.renderer
                // string animationName: directory named after the animation /images (contains all frames named after position in animation starting with 0)
                // int numberOfFrames: number of images/frames in the animation directory
                // int timePerFrame: time each frame in the animation will be shown in ms
                // bool looping: should the animation repeat after finishing
                
                this.attributes['imageRenderer'] = imageRenderer;
                this.attributes['animationName'] = new AttributeText('Animation Name', animationName);
                this.attributes['numberOfFrames'] = new AttributeNumber('Number of Frames', numberOfFrames);
                this.attributes['timePerFrame'] = new AttributeNumber('Time per Frame', timePerFrame / 1000);
                this.attributes['looping'] = new AttributeBoolean('Looping', looping);

                this.attributes['currentFrame'] = 0;
                this.attributes['currentFrameTime'] = 0;
                this.attributes['animationSources'] = [];

                for (let i = 0; i < this.numberOfFrames; i++) {
                        this.attributes['animationSources'].push("animations/" + this.attributes['animationName'].value + "/" + i + ".png");
                }

                this.attributes['imagePath'].value = this.attributes['animationSources'][this.attributes['currentFrame']];
                
                this.attributes['imageRenderer'].imagePath = this.attributes['imagePath'].value;
                this.attributes['imageRenderer'].updateSource();
        }
        
        update() {
                if (this.attributes['numberOfFrames'].value > 1) {
                        if (this.attributes['currentFrameTime'] >= this.attributes['timePerFrame'].value) {
                                this.attributes['currentFrame']++;
                                this.attributes['currentFrameTime'] = 0;

                                if ( (this.attributes['looping'].value == true) && (this.attributes['currentFrame'] >= this.attributes['animationSources'].length) ) {
                                        this.attributes['currentFrame'] = 0;
                                }
                        } else {
                                this.attributes['currentFrameTime'] += time.deltaTime;
                        }

                        this.attributes['imagePath'].value = this.attributes['animationSources'][this.attributes['currentFrame']];
                        
                        this.attributes['imageRenderer'].imagePath = this.attributes['imagePath'].value;
                        this.attributes['imageRenderer'].updateSource();
                }
        }
}