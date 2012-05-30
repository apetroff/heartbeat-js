function updateStatus()
{
    console.log(new Date().getTime());
    jQuery('<img>').attr('id','statusImg').attr('src','http://health.local:50088/entity/health/update.json?url='+window.location.href+'&'+new Date().getTime()).remove();
}
function init()
{
    setInterval(updateStatus, 5000);
}
jQuery(document).ready(function(){
    init();
});
