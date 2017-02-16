var urls = [];
var sessions = {};
var UL_CLASS = "dropdown-content";
var UL_ID = "dropdown";

//           Functions

var session_save = function () {
    // Send a message to the active tab
    chrome.tabs.getAllInWindow(null
        , function (tabs) {
            tabs.forEach(function (tab) {
                urls.push(tab.url);
            });

            var title = document.getElementById('name1').value;
            var session = {};
            session[title] = urls;
            chrome.storage.local.set(session, function () {
            });

            if (sessions['names'] == "") {
                sessions['names'] = [title];
            } else if (sessions["names"].indexOf(title) > -1 === false) {
                    sessions['names'].push(title);
            }
            chrome.storage.local.set(sessions, function () {
                location.reload();
            });
        });
};

var saveCurrentAndOpen = function (id) {
    var name = prompt("enter name of session");
    if (name == undefined || name == "") {
        return;
    }
    document.getElementById('name1').value = name;
    session_save();
    discardCurrentAndOpen(id)
};

var discardCurrentAndOpen = function (id) {
    chrome.tabs.query({
        active: false,
        currentWindow: true
    }, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.remove(tab.id);
        })
    });
    chrome.storage.local.get(id, function (data) {
        var url = data[id];
        var l = url.length;
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.update(tabs[0].id, {"url": url[0]}, function () {
                if(l > 0) {
                  chrome.windows.create({url: url})
                }
            });
        });
    })
};


var openAll = function (sessionName) {
    chrome.storage.local.get(sessionName, function (data) {
        var url = data[sessionName];
        var l = url.length;
        if( l > 0) {
          chrome.windows.create({url: url})
        }
    })
};

var deleteSession = function (sessionName) {
        console.log(sessionName)
        var index = sessions["names"].indexOf(sessionName);
        sessions["names"].splice(index,1);
        chrome.storage.local.set(sessions, function () {
             location.reload();
        });
};

chrome.storage.local.get("names", function (session) {

    var length = 0;
    if (session.names == undefined) {
        sessions['names'] = "";
    } else {
        sessions = session;
        length = sessions['names'].length;
    }
    for (var i = 0; i < length; i++) {
        var sessionName = sessions['names'][i];
        generateDropdown(sessionName);
    }

 // Injecting script
    var script1 = document.createElement('script');
    script1.setAttribute('src', 'js/materialize.min.js');
    document.body.appendChild(script1);
});


var generateDropdown = function (sessionName) {
    var con = document.getElementById('section1');
    var ul1 = document.createElement('ul');
    ul1.className = UL_CLASS;
    ul1.id = UL_ID + sessionName;

    dropDownNames = ['save current & open', 'discard current & open', 'open', 'delete']
    for(i = 1; i < 5; i++) {
      var a = document.createElement('a');
      a.id = sessionName + i;
      a.appendChild(document.createTextNode(dropDownNames[ i-1 ]));
      var sessionAction;


      a.addEventListener('click', function () {
        var functionInvokeId = this.id[ this.id.length - 1 ]
        switch (parseInt(functionInvokeId)) {
          case 1:
            saveCurrentAndOpen(sessionName);
            break;
          case 2:
            discardCurrentAndOpen(sessionName)
            break;
          case 3:
            openAll(sessionName)
            break;
          case 4:
            console.log("deleting")
            deleteSession(sessionName)
            break;
          default:
            break;
        }
      });
      var list = document.createElement('li');
      list.appendChild(a);
      ul1.appendChild(list);
    }

    var a5 = document.createElement('a');
    a5.className = "btn dropdown-button";
    a5.href = "#!";
    a5.setAttribute('data-activates', ul1.id);

    var i1 = document.createElement('i');
    i1.className = "mdi-navigation-arrow-drop-down right";

    a5.appendChild(document.createTextNode(sessionName));
    a5.appendChild(i1);

    con.appendChild(ul1);
    con.appendChild(a5);

    con.appendChild(document.createElement('br'));
    con.appendChild(document.createElement('br'));
};

saveButton = document.getElementById('saveSession');
saveButton.onclick = session_save;
