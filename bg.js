var prefs = {};
var whitelist_data = [];
var userName, userID="";

chrome.storage.local.get({endpoint: 'http://localhost:8080', username: 'your-username', secret: 'your-secret'}, function(o) { prefs = o; });

chrome.storage.onChanged.addListener(function(changes) {
    for (key in changes) {
        prefs[key] = changes[key].newValue;
    }
});

var whitelist = [];

chrome.storage.local.get('newArr', function (result) {
    whitelist = result.newArr;        
    for (i = 0; i < whitelist.list.length; i++){
        whitelist_data.push(whitelist.list[i]);
    }
});

chrome.identity.getProfileUserInfo(function(userInfo){userName= userInfo.email});
chrome.identity.getProfileUserInfo(function(userInfo){userID= userInfo.id});


function log(url, title, favicon){
    if (url != null) {
        activityInfo = {};
        if (typeof whitelist != 'undefined') {
            //whitelist.toString();
            var checkWhitelist = whitelist_data.indexOf(url);            
            if (checkWhitelist == -1) {
                var tincan = new TinCan (
            /*  {
                    recordStores: [
                        {
                            endpoint: "http://ec2-54-177-217-147.us-west-1.compute.amazonaws.com/data/xAPI",
                            username: "6ee5500aa766a72acf309706ead0c78aca868a72",
                            password: "ce96135d94f9cb18c10344dc3f10fce94d39a03b",
                            allowFail: false
                        }
                    ]
                }); */
                    
                {
                    recordStores: [
                        {
                            endpoint: prefs.endpoint,
                            username: prefs.username,
                            password: prefs.secret,
                            allowFail: false
                        }
                    ]
                });    
                
                tincan.sendStatement(
                {
                    actor: {
                        mbox: "mailto:"+userName,
                        name: userName
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
