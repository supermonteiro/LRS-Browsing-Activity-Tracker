function save() {
    var data = {};  
    data[this.id] = this.value;
    chrome.storage.local.set(data);
}

function restore_options() {
    chrome.storage.local.get({
        endpoint: 'http://localhost:8080',
        username: 'your-username',
        secret: 'your-secret'
    }, function(options) {
        document.getElementById('endpoint').value = options.endpoint;
        document.getElementById('username').value = options.username;
        document.getElementById('secret').value = options.secret;
    });
}

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      console.log("The file API isn't supported on this browser yet.");
      return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
      console.log("Couldn't find the fileinput element.");
    }
    else if (!input.files) {
      console.log("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      console.log("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = function(e) { 
            console.log(e);
            var result = JSON.parse(e.target.result);
            chrome.storage.local.set({'newArr': result});            
        }

      fr.readAsText(file);            
    } 
    
    function receivedText(e) {
      var lines = e.target.result;
      var newArr = JSON.parse(lines);      
      chrome.storage.local.set({'newArr': newArr});
    }
  }



document.getElementById('endpoint').addEventListener('change', save);
document.getElementById('username').addEventListener('change', save);
document.getElementById('secret').addEventListener('change', save);
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save);
document.getElementById('btnLoad').addEventListener('click',
    loadFile);
