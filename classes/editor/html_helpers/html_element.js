
class HtmlElement {
        constructor(tag, content = null, attributes = {}) {
                // string tag: html tag that is to be created
                // string/htmlnode content: innerHTML for this tag
                // string attributes: html attributes for this element - multiple classes are separated by spaces

                let html = document.createElement(tag);
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