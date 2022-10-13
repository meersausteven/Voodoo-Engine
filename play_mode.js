
import { Project } from './modules/project.js';

// create file picker
// @todo: clean this up - read project file from directory
let input = document.createElement('input');
input.setAttribute('type', 'file');
input.setAttribute('accept', 'application/json');
input.addEventListener('change', function(e) {
        let file = e.target.files[0];

        if (file.type !== 'application/json') {
                console.log("only .json files are accepted!");
                return false;
        }

        let reader = new FileReader();

        reader.addEventListener('load', function() {
                // instantiate a new project
                var project = new Project();
                
                project.jsonToProject(reader.result);
                project.start();

                delete(this);
        }.bind(this));

        if (file) {
                reader.readAsText(file);
        }
});

document.body.appendChild(input);