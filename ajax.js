function sendAjax(url,method,data,callback){
    const urlBase = 'http://localhost:3000/';
    const request = {
        url : urlBase + url,
        method : method
    }
    if(method == "post"){
        request['data'] = JSON.stringify(data);
        request['contentType'] = "application/json";
    }
    $.ajax(request).done(function(data){
        callback(data);
    }).fail(function(){
        callback({response : false})
    })
}