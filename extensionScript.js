var urls = [];

var sessions = {};


var button_classes = ["btn btn-border color-1 material-design", "btn btn-border color-2 material-design", "btn btn-border color-3 material-design",
    "btn btn-border color-4 material-design", "btn btn-border btn-round color-1 material-design", "btn btn-border btn-round color-2 material-design",
    "btn btn-border btn-round color-3 material-design", "btn btn-border btn-round color-4 material-design"];

var button_colors = ["#2f5398", "#004740", "#f34711", "#d2181c", "#426FC5", "#00897b", "#f6774f", "#e94043"];

var session_save = function () {

    // Send a message to the active tab
    chrome.tabs.query({active: false, currentWindow: true}, function (tabs) {

        tabs.forEach(function (tab) {
            urls.push(tab.url);
        });


        var title = document.getElementById('name1').value;


        var session = {};
        session[title] = urls;
        chrome.storage.local.set(session, function () {

            //    alert("stored");

        });

        if (sessions['names'] == "") {
            sessions['names'] = [title];
        }

        else {
            sessions['names'].push(title);
        }
        chrome.storage.local.set(sessions, function () {
            alert('name sets');
        });


    });

};


chrome.storage.local.get("names", function (session) {

    var length = 0, j = 0;

    if (session.names == undefined) {

        sessions['names'] = "";
    }
    else {
        sessions = session;
        length = sessions['names'].length;
    }

    var con = document.getElementById('section1');

    for (var i = 0; i < length; i++) {

        var sessionName = sessions['names'][i];
        var b = document.createElement("BUTTON");
        var text = document.createTextNode(sessionName);
        b.appendChild(text);
        b.className = button_classes[j];
        b.style.color = button_colors[j];

        b.onclick = function () {
            chrome.storage.local.get(sessionName, function (data) {
                var url = data[sessionName];

                var l = url.length;
                for (x = 0; x < l; x++) {
                    chrome.tabs.create({url: url[x]});
                }


            })
        };
        con.appendChild(b);
        if (j++ === 7)
            j = 0;


    }


});


saveButton = document.getElementById('saveSession');

saveButton.onclick = session_save;



