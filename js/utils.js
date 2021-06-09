function isItemValueInObject(_item, _arr) {
    if(typeof(_arr)==='object'){
        for (i in _arr) {
            if (_arr[i] === _item) return true;
        }
    }
    return false;
}

function isHostOrIp(_input) {
    let _reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/i
    return _reg.test(_input);
}

function getHostOrIp(_input){
    _input = _input.match(/^https?:\/\/([^/]+)\//i);
    if(_input && _input[1]) {
        return _input[1];
    }
    return '';
}

function getUri(_url){
    _url = _url.substring(_url.indexOf("//")+2)
    _url = _url.substring(_url.indexOf("/"));
    if(_url.indexOf('?')!==-1){
        _url = _url.substring(0, _url.indexOf('?'));
    }
    return _url;
}

function downloadUrl(_url){
    var _ele = document.createElement("a");
    _ele.href = _url
    _ele.download = _url.substring(_url.lastIndexOf("/")+1);
    document.body.appendChild(_ele)
    _ele.click();
}

function showMessage(_content){
    let _boxW = 300, _boxH = 40, _wW = window.innerWidth, _wH = window.innerHeight;
    let _container = $("<div id='rr_message_box'>");
    _container.css({
        'width': '100%',
        'height': '100%',
        'position': 'absolute',
        'left': 0,
        'top': 0,
        'z-index': 99999
    });
    let _messageBox = $("<div>");
    _messageBox.text(_content);
    _messageBox.css({
        'position': 'absolute',
        'opacity': '100%',
        'width': _boxW+'px',
        'height': _boxH+'px',
        'line-height': _boxH+'px',
        'text-align': 'center',
        'background': '#333333',
        'color': 'white',
        'left': (_wW - _boxW) / 2,
        'top': (_wH - _boxH) / 2,
    });
    let _close = $("<div>X</div>");
    _close.css({
        'position': 'absolute',
        'right': '0px',
        'top': '0px',
        'width': '15px',
        'height': '15px',
        'line-height': '15px',
        'cursor': 'pointer'
    });
    _close.click(function(){
        $("#rr_message_box").remove();
    });
    _messageBox.append(_close);
    _container.append(_messageBox);
    $("body").append(_container);
}