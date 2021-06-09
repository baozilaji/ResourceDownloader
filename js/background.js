
console.log("background.js loaded.");

// default congfiguration
var __config__default = {
    function_started: false,
    all_downloaded: {},
    target_websites: {},
    selected_types: {}
}

// define some function called by popup.js
//=======================start=======================
var __ALL_URLS__ = "__all_urls__"
var __ALL_TYPES__ = ['png', 'jpeg', 'jpg', 'gif', 'css', 'js', 'mp3']
var __LINE_TYPES_COUNT__ = 4

function isAllSelected(){
    for(_idx in __ALL_TYPES__){
        if(!__config__default['selected_types'].hasOwnProperty(__ALL_TYPES__[_idx])){
            return false;
        }
    }
    return true;
}

function isChecked(_item){
    return __config__default['selected_types'].hasOwnProperty(_item);
}

function checkAll(){
    for(_idx in __ALL_TYPES__){
        __config__default['selected_types'][__ALL_TYPES__[_idx]] = 1
    }
    updateConfigation('selected_types', __config__default['selected_types']);
}

function uncheckAll(){
    __config__default['selected_types'] = {}
    updateConfigation('selected_types', __config__default['selected_types']);
}

function checkItemType(_type){
    __config__default['selected_types'][_type] = 1
    updateConfigation('selected_types', __config__default['selected_types']);
}

function uncheckItemType(_type){
    delete __config__default['selected_types'][_type];
    updateConfigation('selected_types', __config__default['selected_types']);
}

function getConfiguration(){
    return __config__default
}

function updateConfigation(_key, _value){
    __config__default[_key] = _value
    chrome.storage.local.set({"__config__": __config__default}, function(){
        //console.log("__config__ has been setted to "+JSON.stringify(__config__default));
        console.log(__config__default);
    });
}

function getTargetWebSites(){
    return __config__default['target_websites']
}

function addNewTargetWebSites(_target){
    __config__default['target_websites'][_target] = 1
    updateConfigation('target_websites', __config__default['target_websites']);
}

function deleteTargetWebSites(_target) {
    delete __config__default['target_websites'][_target];
    updateConfigation('target_websites', __config__default['target_websites']);
}
//=======================end=======================

function needsHandle(_curr_host){
    console.log(_curr_host)
    if(__config__default['target_websites'].hasOwnProperty(__ALL_URLS__)) return true;
    for (_key in __config__default['target_websites']) {
        if(_curr_host.indexOf(_key)!=-1){
            return true;
        }
    }
    return false;
}

// get the configuration from chrome.storage.local
chrome.storage.local.get("__config__", function(res){
    //console.log("default configuration:"+JSON.stringify(__config__default));
    //console.log("configuration from storage:" + JSON.stringify(res));
    if("__config__" in res){
        Object.assign(__config__default, res.__config__);
        //console.log("default configuration after combined storage data:" + JSON.stringify(__config__default));
    }

    // the function of resource record is active
    if(__config__default.function_started){
        console.log("resource record function has been opened.");

        // add the webRequest listener to do some when the network occurs.
        chrome.webRequest.onCompleted.addListener(
            function(details) {
                //console.log("before started download:"+JSON.stringify(details));
                if(details.url in __config__default.all_downloaded) {
                    //console.log("You have downloaded this resource ["+details.url+"].");
                }else{
                    if(needsHandle(getHostOrIp(details.url))){
                        console.log(details);
                        let _uri = getUri(details.url);
                        console.log(_uri);
                        if(_uri){
                            for (_key in __config__default['selected_types']) {
                                if(_uri.toLowerCase().endsWith(_key.toLowerCase())){
                                    chrome.downloads.download({
                                        url: details.url,
                                        filename: _uri.substring(_uri.lastIndexOf('/')+1)
                                    })
                                    __config__default.all_downloaded[details.url]=1
                                    updateConfigation("all_downloaded", __config__default.all_downloaded);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            {
                "urls": ["<all_urls>"]
            },
            ["responseHeaders"]
        );
    }
});
