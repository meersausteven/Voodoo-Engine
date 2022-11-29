
import { HtmlElement } from './html_element.js';

export const SNACKBAR_NEUTRAL = 'snackbar_neutral';
export const SNACKBAR_INFO = 'snackbar_info';
export const SNACKBAR_WARNING = 'snackbar_warning';
export const SNACKBAR_DANGER = 'snackbar_danger';
export const SNACKBAR_SUCCESS = 'snackbar_success';

export class Snackbar {
        html;
        text;
        type;
        displayTime;

        /*
         * @param string text: text that is displayed inside the snackbar
         * @param int displayTime: time in miliseconds how long the snackbar will be displayed
         */
        constructor(text, type = SNACKBAR_NEUTRAL, displayTime = 5000) {
                this.text = text;
                this.type = type;
                this.displayTime = displayTime;

                this.html = new HtmlElement('div', this.text, {class: 'snackbar ' + this.type, style: `--snackbar-animation-duration: ${this.displayTime}ms`});
                this.html.addEventListener('animationend', function() {
                        this.remove();
                });

                document.body.appendChild(this.html);
        }
}