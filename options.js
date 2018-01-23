function save() {
    var data = {};
    data[this.id] = this.value;
    chrome.storage.local.set(data);
}

function restore_options() {
    chrome.storage.local.get({
        endpoint: 'http://localhost:8080',
        username: 'chrome',
        secret: 'arthas'
    }, function(options) {
        document.getElementById('endpoint').value = options.endpoint;
        document.getElementById('username').value = options.username;
        document.getElementById('secret').value = options.secret;
    });
}

document.getElementById('endpoint').addEventListener('change', save);
document.getElementById('username').addEventListener('change', save);
document.getElementById('secret').addEventListener('change', save);
document.addEventListener('DOMContentLoaded', restore_options);
