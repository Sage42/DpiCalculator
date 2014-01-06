$( function() {
    function applyToInputSet( id ) {
        var dpis = [ 640, 480, 320, 240, 160, 120, 212.8 ];
        var labels = [ 'xxxhdpi', 'xxhdpi', 'xhdpi', 'hdpi', 'mdpi', 'ldpi', 'tvdpi' ];
        var inputs = $(id+' input');
        inputs.each( function(i) {
            if( this.value == '' ) {
                this.value = '';
            }
            set(this, this.value, dpis[i]);
        });
        
        function convert( source_value, source_dpi, target_dpi ) {
            // console.log( source_value, source_dpi, target_dpi );
            if( isNaN(source_value) )
                return '';
            
            return source_value * ( target_dpi / source_dpi ); 
        }
        
        function check( value, dpi ) {
            if (dpi == 212.8) {
                // console.log(Math.round(value / 1.33), convert(value, 212.8, 160));
                return Math.round(value / 1.33) == convert(value, 212.8, 160);
            }
            var l = dpi/40;
            if( (value % l) != 0 ) {
                // console.log(value, "not valid for", dpi, value / 1.33);
                return false;
            }
            return true;
        }
        
        function closest( value, dpi ) {
            var l = dpi/40;
            
            return Math.round(value / l) * l;
        }
        
        function set( input, value, dpi ) {
            input.value = value;
            $(input).data('last_value', value);
            // Find source input's label
            var source_hint = $(input).parent().find('.hint')[0];
            var source_hint_text = closest( value, dpi );
            if( source_hint_text != value && !isNaN(source_hint_text) ) {
                source_hint.innerHTML = source_hint_text;
            } else {
                source_hint.innerHTML = '';
            }
        }
        
        function onUpdate( dpi_index ) {
            
            var source_dpi = dpis[dpi_index];
            var source_input = inputs[dpi_index];
            
            if( $(source_input).data('last_value') == source_input.value ) {
                return;
            }
            set(source_input, source_input.value, source_dpi);
            
            var source_value = parseFloat(source_input.value);
            
            var source_hint_text = '';
            inputs.removeClass('error');
            if( source_input.value != '' && check( source_value, source_dpi ) === false ) {
                $(inputs[dpi_index]).addClass('error');
            }
             
            
            var results = [ 0, 0, 0, 0, 0 ];
            inputs.each( function(i) {
                if( i != dpi_index ) {
                    set(inputs[i], convert( source_value, source_dpi, dpis[i] ), dpis[i]);
                }
            });
        }
        
        inputs.each( function(i) {
            $(document.body).bind('keydown', function(e) {
                // console.log( e );
            });
            $(this).bind('keyup', function() { onUpdate(i); });
            $(this).bind('change', function() { onUpdate(i); });
        });
    }
    
    applyToInputSet( '#cal1' );
    applyToInputSet( '#cal2' );
    applyToInputSet( '#cal3' );
});
