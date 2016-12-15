const Window = require("./Window.js");

function PWD() {
    this.container = new DocumentFragment();

    let windows = [];

    let newWindowXPos = 0;

    let newWindowYPos = 0;

    for (let i = 0; i < 10; i++) {
        windows.push(new Window({"id": i, "xPos": getNewWindowXPos(), "yPos": getNewWindowYPos()}));
    }

    for (let i = 0; i < windows.length; i++) {
        this.container.appendChild(windows[i].getContainer());
    }

    addListeners.bind(this)();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            let pwdWindow = getWindow(parseInt(e.target.getAttribute("data-windowid")));

            if (pwdWindow) {
                setActive(pwdWindow);

                let pwdWindowElem = pwdWindow.getContainer();

                window.addEventListener("mousemove", windowMoveEvent);
            }
        });

        window.addEventListener("mouseup", function() {
            window.removeEventListener("mousemove", windowMoveEvent);
            console.log("up");
        });
    }

    function windowMoveEvent(e) {
        let pwdWindow = getActiveWindow();

        if (pwdWindow) {
            //pwdWindowElem = getContainer();

            pwdWindow.updatePos(e.movementX, e.movementY);

            //console.log(e.movementX);
            //pwdWindow.setXPos(pwdWindow.getXPos() + e.movementX);
            //pwdWindow.setYPos(pwdWindow.getYPos() + e.movementY);

            //let pwdWindowElem = pwdWindow.getContainer();

            //console.log(pwdWindowElem.style.left);

            //console.log(e.clientX2 - (e.clientX - pwdWindow.getContainer().offsetLeft));
            //console.log(e.clientX - (e.clientX - pwdWindow.getContainer().offsetLeft));
            //pwdWindow.setXPos( e.clientX - (e.clientX - pwdWindow.getContainer().offsetLeft) );
            //pwdWindow.setYPos( e.clientY - (e.clientY - pwdWindow.getContainer().offsetTop) );
        }
    }

    /**
     * Returns the active window.
     * If no window is active -> return undefined
     */
    function getActiveWindow() {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].isActive()) {
                return windows[i];
            }
        }

        return undefined;
    }

    /**
     * Sets all the windows as inactive
     * Sets the given window as active
     */
    function setActive(pwdWindow) {
        for (let i = 0; i < windows.length; i++) {
            windows[i].setActive(false);
        }

        pwdWindow.setActive(true);
    }

    /**
     * Returns the window object with the given id
     */
    function getWindow(id) {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getId() === id) {
                return windows[i];
            }
        }
    }

    function getNewWindowXPos() {
        newWindowXPos += 20;

        return newWindowXPos;
    }

    function getNewWindowYPos() {
        newWindowYPos += 20;

        return newWindowYPos;
    }
}

PWD.prototype.getContainer = function() {
    return this.container;
}

module.exports = PWD;
