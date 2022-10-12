
class Debugger {
        console = document.getElementById("console");
        consoleContent = this.console.querySelector('.content');

        log(text) {
                let html = "<div class='console-log'>";
                    html += "Log: " + text;
                    html += "</div>";

                this.#add(html);
        }

        warning(text) {
                let html = "<div class='console-warning'>";
                    html += "Warning: " + text;
                    html += "</div>";

                this.#add(html);
        }

        error(text) {
                let html = "<div class='console-error'>";
                    html += "Error: " + text;
                    html += "</div>";

                this.#add(html);
        }

        #add(html) {
                this.consoleContent.innerHTML += html;
        }
}
