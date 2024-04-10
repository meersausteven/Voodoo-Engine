
import { Project } from './modules/project.js';

function inIframe() {
        try {
                return window.self !== window.top;
        } catch (e) {
                return true;
        }
}

if (inIframe()) {
        document.body.classList.add('embedded');
}

var project = new Project();

if (localStorage['project'] !== null) {
        // try opening a project from the localStorage
        project = project.convertToProject(localStorage['project']);
        project.start();
} else if (loadFile()) {
        // if no file was found in localStorage try loading from the server
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", '/project_file/project.json', false);
        xmlhttp.send();

        if (xmlhttp.status == 200) {
                project = project.convertToProject(xmlhttp.responseText);
                project.start();
        }
} else {
        console.warn('ERROR: No project file was found in localStorage nor on the server');
}
