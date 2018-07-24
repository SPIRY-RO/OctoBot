function get_active_tab_config(){
    return $(document).find("." + config_root_class + ".active > ." + config_container_class);
}

function handle_reset_buttons(){
    $("#reset-config").click(function() {
        reset_configuration_element($(this));
    })
}

function handle_save_buttons(){
    $("#save-config").click(function() {
        var full_config = get_active_tab_config();
        var updated_config = {};
        var update_url = full_config.attr(update_url_attr);

        full_config.find("."+config_element_class).each(function(){
            var new_value = "";
            var config_type = $(this).attr(config_type_attr);

            if(!(config_type in updated_config)){
                updated_config[config_type] = {};
            }

            if($(this)[0].hasAttribute(current_value_attr)){
                new_value = $(this).attr(current_value_attr);
            }else{
                new_value = replace_spaces(replace_break_line($(this).text()));
            }

            if(new_value.toLowerCase() != $(this).attr(config_value_attr).toLowerCase() ){
                updated_config[config_type][$(this).attr(config_key_attr)] = new_value;
            }
        })

        // send update
        send_and_interpret_bot_update(updated_config, update_url, full_config, handle_save_buttons_success_callback);

        add_or_remove_confirm_before_exit_page(false);
    })
}

function handle_save_buttons_success_callback(updated_data, update_url, dom_root_element, msg, status){
    update_dom(dom_root_element, msg);
    refresh_buttons_lock(get_active_tab_config(), $('#save-config'), $('#reset-config'))
    create_alert("success", "Configuration successfully updated.", "");
}

function handle_evaluator_configuration_editor(){
    $(".config-element").click(function(){
        var element = $(this);
        if (element.hasClass(config_element_class)){
            var full_config = get_active_tab_config();
            if (full_config[0].hasAttribute(update_url_attr)){

                // build data update
                var updated_config = {};
                new_value = "true";
                var current_value = element.attr(current_value_attr).toLowerCase();
                if (current_value == "true"){
                    new_value = "false";
                }

                // update current value
                element.attr(current_value_attr, new_value);

                //update dom
                update_element_temporary_look(element);

                //add or remove exit confirm if necessary
                add_or_remove_exit_confirm_if_necessary(full_config, 'Are you sure you want to exit configuration without saving ?');
            }
        }
    });
}

function handle_global_configuration_editor(){
}

function reset_configuration_element(element){
    var full_config = get_active_tab_config();
    full_config.find("."+ config_element_class).each(function(){
        if($(this).attr(current_value_attr).toLowerCase() != $(this).attr(config_value_attr).toLowerCase() ){
            // update current value
            $(this).attr(current_value_attr, $(this).attr(config_value_attr));
            //update dom
            update_element_temporary_look($(this));
        }
    });
    refresh_buttons_lock(get_active_tab_config(), $('#save-config'), $('#reset-config'))

    //add or remove exit confirm if necessary
    add_or_remove_exit_confirm_if_necessary(full_config, 'Are you sure you want to exit configuration without saving ?');
}

function refresh_buttons_lock(root_element, button1, button2){
    var should_unlock = !at_least_one_temporary_element(root_element);
    button1.prop('disabled', should_unlock);
    button2.prop('disabled', should_unlock);
}