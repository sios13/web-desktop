function Chat(settings) {
    /**
     * Properties
     */
    let container = settings.container ? settings.container : "no container";

    this.username = settings.username ? settings.username : "simon";

    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    this.socket.addEventListener("open", socketOpenEvent);
    this.socket.addEventListener("message", socketMessageEvent);

    /**
     * Elements
     */
    // Name change div
    let nameChangeDiv = document.createElement("div");
    nameChangeDiv.classList.add("chatNameChange");

    let nameChangeSpan = document.createElement("span");
    nameChangeSpan.textContent = "Username: " + this.username;

    let nameChangeButton = document.createElement("button");
    nameChangeButton.addEventListener("click", nameChangeEvent.bind(this));
    nameChangeButton.textContent = "Change name";

    nameChangeDiv.appendChild(nameChangeSpan);
    nameChangeDiv.appendChild(nameChangeButton);

    let nameChangeInput = document.createElement("input");

    // Messages div
    let messagesDiv = document.createElement("div");
    messagesDiv.classList.add("chatMessages");

    // Input form
    let inputDiv = document.createElement("from");
    inputDiv.classList.add("chatInput");

    // Textarea in the input div
    let inputDiv_textarea = document.createElement("textarea");
    inputDiv_textarea.classList.add("chatInput_textarea");
    inputDiv_textarea.disabled = true;
    inputDiv_textarea.setAttribute("placeholder", "Waiting for connection...");
    inputDiv_textarea.addEventListener("keyup", textareaEvent.bind(this));
    inputDiv.appendChild(inputDiv_textarea);

    // Button in the input div
    let inputDiv_button = document.createElement("button");
    inputDiv_button.addEventListener("click", buttonEvent.bind(this));
    inputDiv_button.classList.add("chatInput_button");
    inputDiv_button.setAttribute("type", "button");
    inputDiv_button.disabled = true;
    inputDiv_button.textContent = "Send";
    inputDiv.appendChild(inputDiv_button);

    // Chat wrapper
    let chatWrapperDiv = document.createElement("div");
    chatWrapperDiv.classList.add("chatWrapper");

    chatWrapperDiv.appendChild(nameChangeDiv);
    chatWrapperDiv.appendChild(messagesDiv);
    chatWrapperDiv.appendChild(inputDiv);

    // Container div
    let containerDiv = document.querySelector(container);
    containerDiv.appendChild(chatWrapperDiv);

    /**
     * Functions
     */
    function socketOpenEvent(e) {
        inputDiv_textarea.disabled = false;

        inputDiv_textarea.setAttribute("placeholder", "Enter message");

        inputDiv_button.disabled = false;
    }

    function socketMessageEvent(e) {
        let response = JSON.parse(e.data);
        console.log(response);

        if (response.type === "heartbeat") {
            return;
        }

        let chatMessageSpan = document.createElement("span");
        chatMessageSpan.classList.add("chatMessage");

        if (response.type === "notification") {
            chatMessageSpan.textContent += "[" + response.type + "] ";
        } else {
            let date = new Date();

            let currentTime = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());

            chatMessageSpan.textContent += "[" + currentTime + "] ";
        }
        chatMessageSpan.textContent += response.username + ": ";
        chatMessageSpan.textContent += response.data;

        messagesDiv.appendChild(chatMessageSpan);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function nameChangeEvent(e) {
        nameChangeDiv.textContent = "";

        if (nameChangeInput.value === "") {
            nameChangeDiv.appendChild(nameChangeInput);

            nameChangeDiv.appendChild(nameChangeButton);

            nameChangeInput.value = this.username;
        } else {
            this.username = nameChangeInput.value;

            localStorage.setItem("chatUsername", this.username);

            nameChangeInput.value = "";

            nameChangeSpan.textContent = "Username: " + this.username;
            nameChangeDiv.appendChild(nameChangeSpan);

            nameChangeDiv.appendChild(nameChangeButton);
        }
    }

    function buttonEvent(e) {
        let value = inputDiv_textarea.value;

        if (value === "" || value === "\n") {
            console.log("Must enter a message!");

            return;
        }

        inputDiv_textarea.value = "";

        let data = {
            "type": "message",
            "data" : value,
            "username": this.username,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }
        this.socket.send(JSON.stringify(data));
    }

    function textareaEvent(e) {
        /**
         * If pressing enter and shift is not pressed -> click button
         */
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();

            inputDiv_button.click();
        }
    }
}

Chat.prototype.close = function() {
    this.socket.close();
}

module.exports = Chat;
