function getVKstatus(userID, callback) {
    if(!userID) throw new Error('Missing vk user id');
    $.ajax({
        url: 'https://api.vk.com/method/getProfiles?uids=' +
        userID + '&fields=online,photo_100',
        type : 'GET', dataType: 'jsonp', crossDomain: true,
        success: function(data){
            if (callback) return callback.call(null, data);
        }
    });
};

function onlineStatus() {
    $("#status")[0].innerHTML = "Online";
}

function getTime() {
    now = new Date(Date.now());
    return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
}

function notify(text, icon) {
    var title = "Поздравляю!",
        options = {
            icon: icon,
            body: text,
    };

    if (Notification.permission === "granted") {
        var notification = new Notification(title, options);
        notification.onclick = function () {
            this.close();
            window.open("https://vk.com");
        };
        setTimeout(function () {
            notification.close();
        }, 5000);
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification(title, options);
                notification.onclick = function () {
                    this.close();
                    window.open("https://vk.com");
                };
                setTimeout(function () {
                    notification.close();
                }, 5000);
            }
        });
    }
}

$(document).ready(function() {
    var Status = 0;

    setInterval(getVKstatus.bind(null, 10287005, function(data) {
        var tm = getTime();
        if (Status != data.response[0].online && data.response[0].online == 1)
            notify(data.response[0].first_name + " " +
                data.response[0].last_name + " появилась online",
                data.response[0].photo_100);
        Status = data.response[0].online;
        if (data.response[0].online == 1) {
            console.log("Online, " + tm);
            onlineStatus();
        }
        else {
            console.log("Not online, " + tm);
            $("#status")[0].innerHTML = "Not online";
        }
    }), 5000);
});