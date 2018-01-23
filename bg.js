var prefs = {};

chrome.storage.local.get({endpoint: 'http://localhost:8080', username: 'chrome', secret: 'arthas'}, function(o) { prefs = o; });

chrome.storage.onChanged.addListener(function(changes) {
    for (key in changes) {
        prefs[key] = changes[key].newValue;
    }
});

var whitelist = ["http://www.cgs.com", "http://www.cbc.ca", "http://ec2-54-177-217-147.us-west-1.compute.amazonaws.com/organisation/5a472b2104d8cd0e9d45f61f/data/source", "chrome://newtab/", "chrome://extensions/"];

function log(url, title, favicon){
    /*var data = JSON.stringify({
        url: url, time: Date.now(),
        title: title, key: prefs.key,
        favicon: favicon
    });
    var xhr = new XMLHttpRequest();
    xhr.open("POST", prefs.callback);
    xhr.send(data);*/
    console.log(url, title);
    activityInfo = {};
    var checkWhitelist = whitelist.indexOf(url);
    if (checkWhitelist == -1 && url != null) {
        var tincan = new TinCan (
        {
            recordStores: [
                {
                    endpoint: "http://ec2-54-177-217-147.us-west-1.compute.amazonaws.com/data/xAPI",
                    username: "6ee5500aa766a72acf309706ead0c78aca868a72",
                    password: "ce96135d94f9cb18c10344dc3f10fce94d39a03b",
                    allowFail: false
                }
            ]
        });

        tincan.sendStatement(
        {
            actor: {
                mbox: "mailto:your.email.address@example.com",
                name: "User 3"
            },
            verb: {
                display: {
                 "en-GB": "accessed"
                },
                id: "http://adlnet.gov/expapi/verbs/accessed"
            },
            object: {
                id: "http://www.cgs.com",
                definition: {
                    name: {
                        "en-GB": "\""+url+"\""
                    }
                }
           }
        },

        function (err, result) {
            //Handle any errors here. This code just outputs the result to the page. 
            document.write("<pre>");
            document.write(JSON.stringify(err, null, 4));
            document.write("</pre>");
            document.write("<pre>");
            document.write(JSON.stringify(result, null, 4));
            document.write("</pre>");
        }); 
    }                  
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.status === "complete" && tab.active) {
            chrome.windows.get(tab.windowId, {populate: false}, function(window) {
                if (window.focused) {
                    log(tab.url, tab.title, tab.favIconUrl || null);
                }
            });
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.active) {
        chrome.windows.get(tab.windowId, {populate: false}, function(window) {
            if (window.focused) {
                log(tab.url, tab.title, tab.favIconUrl || null);
            }
        });
    }
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
        log(null, null, null);
    } else {
        chrome.windows.get(windowId, {populate: true}, function(window) {
            if (window.focused) {
                chrome.tabs.query({active: true, windowId: windowId}, function (tabs) {
                    if (tabs[0].status === "complete") {
                        log(tabs[0].url, tabs[0].title, tabs[0].favIconUrl || null);
                    }
                });
            }
        });
    }
});
