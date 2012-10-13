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
    '../../jq/jq/jquery-1.8.2.js?MBA7IA', 
    '../../jq/jq/jquery_ns.jam.js?MBA7KM', 
    '../init/demo_init.jam.js?MBULSE', 
    null 
])
