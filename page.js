
// dropdown
document.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown_button')) {
                closeAllDropdowns();

                e.target.parentElement.classList.add('open');
        } else {
                if (!e.target.closest('.dropdown')) {
                        closeAllDropdowns();
                }
        }
});

function closeAllDropdowns() {
        let dropdowns = document.querySelectorAll('.dropdown');

        for (let i = 0; i < dropdowns.length; i++) {
                dropdowns[i].classList.remove('open');
        }
}

// tabbar
function tabClick(element) {
        let target = element.dataset.target;
        let wasOpen = !!element.classList.contains('active');

        // remove classes from all tabs
        let tabs = element.parentElement.querySelectorAll('.tab');
        for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
        }
        
        let tabContents = document.querySelectorAll('#menuBar .tab-content');
        for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove('open');
        }

        // toggle class for own tab
        if (!wasOpen) {
                element.classList.toggle('active');
                document.querySelector(target).classList.add('open');
        }
}

// edit mode
var cursor = {
        pos: new Vector2()
};

var gameArea = document.getElementById('gameArea');

gameArea.addEventListener('mousedown', function(e) {
        cursor.pos = new Vector2(e.clientX, e.clientY);
});

gameArea.addEventListener('mousemove', function(e) {
        if (e.buttons == 1) {
                let mouseMovement = new Vector2(e.movementX, e.movementY);
                editor.project.activeScene.activeCamera.gameObject.transform.attributes['position'].value.subtract(mouseMovement);
        }
});
