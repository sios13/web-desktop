const Window = require("./Window.js");
const Icon = require("./Icon.js");
const Memory = require("./apps/Memory/MemoryGame.js");

function PWD(settings = {}) {
    let container = document.createElement("main");

    document.querySelector(settings.container).appendChild(container);

    //alert(document.querySelector("html").parentNode.parentNode);

    let windows = [];

    let newWindowXPos = 0;

    let newWindowYPos = 0;

    let icons = [];
/*
    for (let i = 0; i < 10; i++) {
        windows.push(new Window({"id": i, "xPos": getNewWindowXPos(), "yPos": getNewWindowYPos()}));
    }
*/
/*
    for (let i = 0; i < windows.length; i++) {
        this.container.appendChild(windows[i].getContainer());
    }
*/
    icons.push(new Icon({
        "id": 0,
        "applicationName": "Memory",
        //"iconImage": "memory.png",
        "windowSize": "medium"
    }));

    for (let i = 0; i < icons.length; i++) {
        container.appendChild(icons[i].getContainer());
    }

    addListeners.bind(this)();

    function addListeners() {
        window.addEventListener("mousedown", function(e) {
            e.preventDefault();

            setActive();

            for (let i = 0; i < windows.length; i++) {
                let windowElem = windows[i].getContainer();

                /**
                 * if a mousedown has been made inside a window -> make the window active
                 */
                if (windowElem.contains(e.target)) {
                    setActive(windows[i]);

                    /**
                     * if a mousedown has been made inside a top bar -> start dragging
                     */
                    let windowTopBarElem = windowElem.querySelector(".PWD-window_topbar");

                    if (windowTopBarElem.contains(e.target)) {
                        window.addEventListener("mousemove", windowMoveEvent);

                        windows[i].setIsDragging(true);
                    }
                }
            }
        });

        window.addEventListener("mouseup", function() {
            window.removeEventListener("mousemove", windowMoveEvent);

            /**
             * ALl windows stop dragging
             */
            for (let i = 0; i < windows.length; i++) {
                windows[i].setIsDragging(false);
            }

            console.log("up");
        });

        window.addEventListener("dblclick", function(e) {
            for (let i = 0; i < icons.length; i++) {
                /**
                 * if a doubleclick has been made on an icon -> launch the associated application
                 */
                if (icons[i].getContainer().contains(e.target)) {
                    launchApplication(icons[i]);
                }
            }
        });
    }

    /**
     * Launch an application using the meta data in a given icon object
     */
    function launchApplication(iconObj) {
        let pwdWindow = new Window({
            "windowSize": iconObj.getWindowSize(),
            "name": iconObj.getApplicationName()
        });

        windows.push(pwdWindow);

        container.appendChild(pwdWindow.getContainer());

        if (iconObj.getApplicationName() === "Memory") {
            let memory = new Memory({
                "container": "#pwd-window_content-" + pwdWindow.getId()
            });
        }
    }

    /**
     * Returns the icon object with the given id
     */
    /*
    function getIcon(id) {
        for (let i = 0; i < icons.length; i++) {
            if (icons[i].getId() === id) {
                return icons[i];
            }
        }

        return undefined;
    }
    */
    function windowMoveEvent(e) {
        let pwdWindow = getActiveWindow();

        if (pwdWindow) {
            pwdWindow.updatePos(e.movementX, e.movementY);
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
     * If a pwdWindow is given, set it as active
     */
    function setActive(pwdWindow) {
        for (let i = 0; i < windows.length; i++) {
            windows[i].setActive(false);
        }

        if (pwdWindow) {
            pwdWindow.setActive(true);
        }
    }

    /**
     * Returns the window object with the given id
     */
    /*
    function getWindowObj(id) {
        for (let i = 0; i < windows.length; i++) {
            if (windows[i].getId() === id) {
                return windows[i];
            }
        }

        return undefined;
    }
    */
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
