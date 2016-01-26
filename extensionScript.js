var urls = [];

var sessions = {};


//var button_colors = ["#2f5398", "#004740", "#f34711", "#d2181c", "#426FC5", "#00897b", "#f6774f", "#e94043"];

var UL_CLASS = "dropdown-content";
var UL_ID = "dropdown2";


//********************** Functions

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

            } else {
                if (sessions["names"].indexOf(title) > -1 === false) {

                    sessions['names'].push(title);

                }

            }
            chrome.storage.local.set(sessions, function () {
                location.reload();
            });



        });

};


var saveCurrentAndOpen = function (id) {

    var name = prompt("enter name of session");
    if (name == undefined || name == "")
        return;

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

                for (var x = 1; x < l; x++) {
                    chrome.tabs.create({url: url[x]});
                }
            });


        });


    })

};


var openAll = function (sessionName) {


    chrome.storage.local.get(sessionName, function (data) {
        var url = data[sessionName];

        var l = url.length;
        for (x = 0; x < l; x++) {
            chrome.tabs.create({url: url[x]});
        }

    })
};

var deleteSession = function (sessionName) {

    chrome.storage.local.remove(sessionName, function () {

        var index = sessions["names"].indexOf(sessionName);

        sessions["names"].splice(index, 1);
        chrome.storage.local.set(sessions, function () {
            location.reload();
        });

    });

};


chrome.windows.onCreated.addListener(function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {

        chrome.tabs.update(tabs[0].id, {"url": "index.html"}, function () {})})
});
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
        generateEventListeners(sessionName);

        //*************** event listeners for dropdown list items




    }

    //**************** Injecting script

    var script1 = document.createElement('script');
    script1.setAttribute('src', 'js/materialize.min.js');
    document.body.appendChild(script1);


});


var generateDropdown = function (sessionName) {

    var con = document.getElementById('section1');
    /*

     <ul id="dropdown2" class=>
     <li><a href="#!">one<span class="badge">1</span></a></li>
     <li><a href="#!">two<span class="new badge">1</span></a></li>
     <li><a href="#!">three</a></li>
     </ul>
     <a class="btn dropdown-button" href="#!" data-activates="dropdown2">Dropdown<i class="mdi-navigation-arrow-drop-down right"></i></a>
     */


    var ul1 = document.createElement('ul');
    ul1.className = UL_CLASS;
    ul1.id = UL_ID;


    var a1 = document.createElement('a');
    a1.id = sessionName + 1;
    a1.appendChild(document.createTextNode('save current & open'));

    var a2 = document.createElement('a');
    a2.id = sessionName + 2;
    a2.appendChild(document.createTextNode('discard current & open'));

    var a3 = document.createElement('a');
    a3.id = sessionName + 3;
    a3.appendChild(document.createTextNode('open'));

    var a4 = document.createElement('a');
    a4.id = sessionName + 4;
    a4.appendChild(document.createTextNode('delete'));

    var li1 = document.createElement('li');
    li1.appendChild(a1);

    var li2 = document.createElement('li');
    li2.appendChild(a2);

    var li3 = document.createElement('li');
    li3.appendChild(a3);

    var li4 = document.createElement('li');
    li4.appendChild(a4);

    ul1.appendChild(li1);
    ul1.appendChild(li2);
    ul1.appendChild(li3);
    ul1.appendChild(li4);


    var a5 = document.createElement('a');
    a5.className = "btn dropdown-button";
    a5.href = "#!";
    a5.setAttribute('data-activates', UL_ID);

    var i1 = document.createElement('i');
    i1.className = "mdi-navigation-arrow-drop-down right";

    a5.appendChild(document.createTextNode(sessionName));
    a5.appendChild(i1);


    con.appendChild(ul1);
    con.appendChild(a5);


    con.appendChild(document.createElement('br'));
    con.appendChild(document.createElement('br'));


};

var generateEventListeners = function (sessionName) {

    document.getElementById(sessionName + 1).addEventListener('click', function () {
        saveCurrentAndOpen(sessionName);
    });

    document.getElementById(sessionName + 2).addEventListener('click', function () {
        discardCurrentAndOpen(sessionName);
    });


    document.getElementById(sessionName + 3).addEventListener('click', function () {
        openAll(sessionName);
    });

    document.getElementById(sessionName + 4).addEventListener('click', function () {
        deleteSession(sessionName);
    });
};

saveButton = document.getElementById('saveSession');
saveButton.onclick = session_save;

