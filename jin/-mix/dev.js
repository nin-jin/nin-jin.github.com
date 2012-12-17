;(function( modules ){
    var scripts= document.getElementsByTagName( 'script' )
    var script= document.currentScript || scripts[ scripts.length - 1 ]
    var dir= script.src.replace( /[^\/]+$/, '' )
        
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
}).call( this, [
    '../method/jin_method.jam.js?MEYP16', 
    '../class/jin_class.jam.js?MEM2FY', 
    '../mixin/jin_mixin.jam.js?MEM2FY', 
    '../wrapper/jin_wrapper.jam.js?MEM2FY', 
    '../nodeListener/jin_nodeListener.jam.js?MET4JO', 
    '../unwrap/jin_unwrap.jam.js?MET4JO', 
    '../event/jin_event.jam.js?MEZ4PD', 
    '../eventProof/jin_eventProof.jam.js?MEZ4S1', 
    '../makeId/jin_makeId.jam.js?MEM2FY', 
    '../onChange/jin_onChange.jam.js?MF0F6D', 
    '../onClick/jin_onClick.jam.js?MET4JO', 
    '../onElemAdd/jin_onElemAdd.jam.js?MF5YJ2', 
    '../onElemDrop/jin_onElemDrop.jam.js?MF5YJ2', 
    '../onError/jin_onError.jam.js?MEZ0Y3', 
    '../onInput/jin_onInput.jam.js?MF0FEP', 
    '../onPress/jin_onPress.jam.js?MET4JO', 
    '../registry/jin_registry.jam.js?MEM2FY', 
    '../thread/jin_thread.jam.js?MEZ3N1', 
    '../test/jin_test.jam.js?MF5Z75', 
    null 
])
