
export class HtmlElement {
        /*
         * constructor
         * @param string tag: html tag that is to be created
         * @param string content: innerHTML for this tag
         * @param string attributes: html attributes for this element - multiple classes are separated by spaces
         */
        constructor(tag, content = null, attributes = {}) {
                const html = document.createElement(tag);

                if (content !== null) {
                        html.innerHTML = content;
                }

                // add attributes
                for (const [key, value] of Object.entries(attributes)) {
                        if ((value !== null) && (typeof value !== 'undefined')) {
                                html.setAttribute(key, value);
                        }
                }

                return html;
        }
}