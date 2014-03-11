void function( modules ){                                                   
    var scripts= document.getElementsByTagName( 'script' )                  
    var script= document.currentScript || scripts[ scripts.length - 1 ]     
    var dir= script.src.replace( /[^/]+$/, '' )                             
    try {                                                                   
        document.write( '' )                                                
        var writable = true                                                 
    } catch( error ){                                                       
        var writable = false                                                
    }                                                                       
	if( writable ){                                                         
		var buffer = []                                                     
		var module; while( module = modules.shift() ){                      
			buffer.push( '<script src="'+dir+module+'"></script>' )       
		}                                                                   
		document.write( buffer.join( '' ) )                                 
	} else {                                                                
		var next= function( ){                                              
			var module= modules.shift()                                     
			if( !module ) return                                            
			var loader= document.createElement( 'script' )                  
			loader.parentScript= script                                     
			loader.src= dir + module                                        
			loader.onload= next                                             
			script.parentNode.insertBefore( loader, script )                
		}                                                                   
	    next()                                                              
	}                                                                       
}.call( this, [                                                             
    
"../../jin.jam.js",
"../../value/jin-value.jam.js",
"../../root/jin_root.jam.js",
"../../trait/jin_trait.jam.js",
"../../glob/jin_glob.jam.js",
"../../definer/jin-definer.jam.js",
"../../func/jin_func.jam.js",
"../../method/jin_method.jam.js",
"../../mixin/jin_mixin.jam.js",
"../../property/jin_property.jam.js",
"../../klass/jin_klass.jam.js",
"../../pool/jin-pool.jam.js",
"../../registry/jin_registry.jam.js",
"../../wrapper/jin_wrapper.jam.js",
"../../error/jin-error.jam.js",
"../../schedule/jin_schedule.jam.js",
"../../identical/jin_identical.jam.js",
"../../makeId/jin_makeId.jam.js",
"../../support/jin_support.env=web.jam.js",
"../../log/jin-log.env=web.jam.js",
"../../thread/jin_thread.env=web.jam.js",
"../../mock/jin_mock.jam.js",
"../../test/jin_test.jam.js",
"../../defer/jin_defer.env=web.jam.js",
"../../defer/jin_defer_test.stage=dev.jam.js",
"../../atom/jin-atom.jam.js",
"../../atom/jin-atom-test.stage=dev.jam.js",
"../../atom/prop/jin-atom-prop.jam.js",
"../../state/jin_state.jam.js",
"../../state/jin_state_tests.stage=dev.jam.js",
"../../env/jin_env.jam.js",
"../../alias/jin_alias.jam.js",
"../../listener/jin_listener.jam.js",
"../../event/jin_event.jam.js",
"../../vector/jin_vector.jam.js",
"../../dom/event/jin_dom_event.env=web.jam.js",
"../../dom/event/jin_dom_event_onBlur.env=web.jam.js",
"../../dom/event/jin_dom_event_onClick.env=web.jam.js",
"../../dom/event/jin_dom_event_onInput.env=web.jam.js",
"../../dom/event/jin_dom_event_onPress.env=web.jam.js",
"../../dom/event/jin_dom_event_onWheel.env=web.jam.js",
"../../dom/event/jin_dom_event_onChange.env=web.jam.js",
"../../dom/event/jin_dom_event_onResize.env=web.jam.js",
"../../dom/event/jin_dom_event_onScroll.env=web.jam.js",
"../../dom/event/jin_dom_event_onDoubleClick.env=web.jam.js",
"../../dom/selection/jin-dom-selection.jam.js",
"../../doc/jin_doc.jam.js",
"../../dom/range/jin-dom-range.env=web.jam.js",
"../../dom/jin_dom.jam.js",
"../../dom/jin_dom.env=web.jam.js",
"../../state/local/jin_state_local.env=web.jam.js",
"../../sample/jin_sample.jam.js",
"../../sample/jin-sample-proto.jam.js",
"../../view/jin_view.env=web.jam.js",
"../../plotter/jin-plotter.jam.js",
"../jin-trade.jam.js",
"../jin-trade-legend-item.jam.js",
 null ])