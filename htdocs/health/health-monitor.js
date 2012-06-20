(function(){
    var img = new Image();
    function updateStatus(){
        img.src = 'http://forumspb.dataflo.ws:50090/entity/health/update.json?url=' + document.URL + '&_=' + Date.now();
    }
    updateStatus();
    setInterval(
        updateStatus
        ,30000
    );
}())