$(document).ready(function(){
    let _bg = chrome.extension.getBackgroundPage();

    // does the function active flag is checked ?
    $("#rr_func_start").prop("checked", _bg.getConfiguration()['function_started']);

    function refresh_target_list(){
        let _all_urls = _bg.getTargetWebSites();
        let _list_container = $("#rr_target_list");
        _list_container.empty();
        for(_key in _all_urls){
            if(_key!==_bg.__ALL_URLS__){
                let _list_item = $("<li>");
                _list_item.append($("<span>"+_key+"</span>"))
                _list_item.append($("<button class='delete_list_item'>delete</button>"))
                _list_container.append(_list_item);
            }
        }
        $(".delete_list_item").click(function(){
            _bg.deleteTargetWebSites($(this).parent().children("span").text());
            refresh_target_list()
        });
    }

    function _show_target_div(){
        if($("#rr_all_target_flag").is(":checked")){
            $("#rr_targets_content").hide();
        }else{
            $("#rr_targets_content").show();
            refresh_target_list();
        }
    }
    // add new target button clicked.
    $("#rr_btn_target_add").click(function(){
        let _val = $("#txt_new_url").val();
        if(!_val){
            showMessage("Please input a new target.")
            return;
        }
        if(!isHostOrIp(_val)){
            showMessage("Please input host or ip")
            return;
        }

        if(_bg.getTargetWebSites().hasOwnProperty(_val)){
            showMessage("dumplicate host or ip.")
            return;
        }

        _bg.addNewTargetWebSites(_val);
        refresh_target_list();
    });
    
    function _show_target_content(){
        // does the all-selected flag is checked ?
        $("#rr_all_target_flag").prop("checked", _bg.getTargetWebSites().hasOwnProperty(_bg.__ALL_URLS__));
        _show_target_div()
    }
    // all-selected flag checkbox changed
    $("#rr_all_target_flag").change(function(){
        if($(this).is(":checked")) {
            _bg.addNewTargetWebSites(_bg.__ALL_URLS__);
        }else{
            _bg.deleteTargetWebSites(_bg.__ALL_URLS__);
        }
        _show_target_div();
    });

    function _show_types_div(){
        let _types_container = $("#rr_types_content");
        _types_container.empty();
        for (var _idx=0; _idx< _bg.__ALL_TYPES__.length; _idx++){
            let _span = $("<span>");
            let _checkbox = $("<input class='select_types_item' type='checkbox'/>");
            if(_bg.isChecked(_bg.__ALL_TYPES__[_idx])){
                _checkbox.prop("checked", true);
            }
            _span.append(_checkbox);
            _span.append($("<span>"+_bg.__ALL_TYPES__[_idx]+"</span>"))
            _types_container.append(_span)
        }

        if(_bg.isAllSelected()){
            $(".select_types_item").prop("checked", true);
        }

        $(".select_types_item").change(function(){
            if($(this).is(":checked")){
                _bg.checkItemType($(this).parent().children('span').text());
                $("#rr_type_select_all").prop("checked", _bg.isAllSelected());
            }else{
                _bg.uncheckItemType($(this).parent().children('span').text());
                $("#rr_type_select_all").prop("checked", false);
            }
        });
    }

    function _show_types_content(){
        $("#rr_type_select_all").prop("checked", _bg.isAllSelected());
        _show_types_div();
    }

    $("#rr_type_select_all").change(function(){
        if($(this).is(":checked")){
            $(".select_types_item").prop("checked", true);
            _bg.checkAll()
        }else{
            $(".select_types_item").prop("checked", false);
            _bg.uncheckAll()
        }
    });

    function _show_content(){
        // if the function active flag is true, show the div.
        if($("#rr_func_start").is(":checked")){
            $("#rr_content").show();

            // show the target url content
            _show_target_content()
            _show_types_content();
        }else{
            $("#rr_content").hide();
        }
    }
    // show the view
    _show_content();

    // function active checkbox changed
    $("#rr_func_start").change(function(){
        // save the flag to storage.
        _bg.updateConfigation('function_started', $(this).is(":checked"));
        // update the configuration view
        _show_content();
    });


    $("#rr_clear_cache").click(function(){
        _bg.updateConfigation("all_downloaded", {})
        showMessage("clear cache success.")
    })
});