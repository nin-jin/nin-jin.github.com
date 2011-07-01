;new function( modules ){
    var packPath= '/wc/-mix+doc/index.js'
    var scripts= document.getElementsByTagName('script')
    for( var i= scripts.length - 1; i >= 0; --i ){
        var script= scripts[ i ]
        var src= script.src
        src= src.replace( /^(?=[^:]+\/)/, document.location.href.replace( /\/[^\/]*$/, '/' ) )
        while( true ) {
            srcNew= src.replace( /\/(?!\.\.)[^\/]+\/\.\.(?=\/)/g, '' )
            if( srcNew === src ) break
            src= srcNew
        }
        if( src.indexOf( packPath ) >= 0 ) break
        if( !i ) throw new Error( 'Can not locate index script path' )
    }
    var dir= src.replace( /[^\/]+$/, '' )
        
    try {
        document.write( '' )
        var canWrite= true
    } catch( e ){}
    
    if( canWrite ){
        var module
        while( module= modules.shift() ){
            document.write( '<script src="' + dir + module + '"><' + '/script>' )
        }
    } else {
        var parent= script.parentNode
        var next= function(){
            var module= modules.shift()
            if( !module ) return
            var loader= document.createElement( 'script' )
            loader.src= dir + module
            loader.onload= next
            parent.insertBefore( loader, script )
        }
        next()
    }
}([
    "../../jam/jam/jam.jam?1309537138",
    "../../jam/define/jam+define.jam?1309537138",
    "../../jam/Value/jam+Value.jam?1309537138",
    "../../jam/glob/jam+glob.jam?1309537138",
    "../../jam/createNameSpace/wc+createNameSpace.jam?1309537138",
    "../../jam/support/jam+support.jam?1309537138",
    "../../jam/doc/jam+doc.jam?1309537138",
    "../../jam/schedule/jam+schedule.js?1309537138",
    "../../jam/domReady/jam+domReady.jam?1309537138",
    "../../jam/Component/jam+Component.jam?1309537137",
    "../../jam/htmlize/jam+htmlize.jam?1309537138",
    "../../html/html/html.jam?1309537137",
    "../../jam/Class/jam+Class.jam?1309537137",
    "../../jam/Poly/jam+Poly.js?1309537137",
    "../../jam/classOf/jam+classOf.jam?1309537138",
    "../../jam/String/jam+String.jam?1309537137",
    "../../jam/RegExp/jam+RegExp.jam?1309537137",
    "../../jam/Lexer/jam+Lexer.jam?1309537137",
    "../../jam/Pipe/jam+Pipe.jam?1309537137",
    "../../jam/Parser/jam+Parser.jam?1309537137",
    "../../jam/Lazy/jam+Lazy.jam?1309537137",
    "../../jam/TemplateFactory/jam+TemplateFactory.jam?1309537137",
    "../../jam/html/jam+html.jam?1309537138",
    "../../jam/Hiqus/jam+Hiqus.jam?1309537137",
    "../../jam/Event/jam+Event.jam?1309537137",
    "../../jam/Node/jam+Node.jam?1309537137",
    "../../html/a/html-a.jam?1309537137",
    "../../wc/wc/wc.jam?1309537139",
    "../../jam/dom/jam+dom.jam?1309537138",
    "../../jam/Throttler/jam+Throttler.js?1309537138",
    "../../wc/css3/wc-css3.jam?1309537138",
    "../../jam/Thread/jam+Thread.jam?1309537137",
    "../../jam/log/jam+log.jam?1309537138",
    "../../jam/commit/jam+commit.jam?1309537138",
    "../../wc/demo/wc-demo.jam?1309537138",
    "../../wc/ns/wc-ns.jam?1309537138",
    "../../wc/test-js/wc-test-js.jam?1309537139",
    "../../doc/doc/doc.jam?1309537137",
null ])
