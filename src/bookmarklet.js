let sent = [];

function newMessagesFilter(element) {
    return sent.indexOf(element) < 0;
}

function update() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log('done');
        }
    };
    const chatMessages = Array.prototype.slice.call(document.querySelectorAll('.chat-list li')).map(li => li.innerHTML);
    const newMessages = chatMessages.filter(newMessagesFilter);
    sent = sent.concat(chatMessages);
    if (newMessages.length > 0) {
        xhr.send(JSON.stringify({value: newMessages}));
        console.log('sending ', newMessages.length);
    }
}

setInterval(update, 30000);