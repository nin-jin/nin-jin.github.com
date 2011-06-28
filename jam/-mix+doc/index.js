;new function( modules ){
    var packPath= '/jam/-mix+doc/index.js'
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
    "../../jam/jam/jam.jam?1305067177",
    "../../jam/Class/jam+Class.jam?1309231687",
    "../../jam/Obj/jam+Obj.jam?1309182591",
    "../../jam/define/jam+define.jam?1308927760",
    "../../jam/Value/jam+Value.jam?1309103756",
    "../../jam/glob/jam+glob.jam?1305067177",
    "../../jam/createNameSpace/wc+createNameSpace.jam?1308209032",
    "../../jam/support/jam+support.jam?1309276093",
    "../../jam/doc/jam+doc.jam?1305067177",
    "../../jam/log/jam+log.jam?1305067177",
    "../../jam/schedule/jam+schedule.js?1308910976",
    "../../jam/domReady/jam+domReady.jam?1309006120",
    "../../jam/Component/jam+Component.jam?1309156337",
    "../../jam/htmlize/jam+htmlize.jam?1309183280",
    "../../html/html/html.jam?1308040898",
    "../../jam/Poly/jam+Poly.js?1309012542",
    "../../jam/classOf/jam+classOf.jam?1305067176",
    "../../jam/String/jam+String.jam?1309231590",
    "../../jam/Hiqus/jam+Hiqus.jam?1309249411",
    "../../jam/Event/jam+Event.jam?1309279397",
    "../../jam/Node/jam+Node.jam?1309282250",
    "../../html/a/html-a.jam?1309253258",
    "../../wc/wc/wc.jam?1309286298",
    "../../wc/demo/wc-demo.jam?1309232025",
    "../../jam/Lazy/jam+Lazy.jam?1305067177",
    "../../jam/Thread/jam+Thread.jam?1305067177",
    "../../wc/test-js/wc-test-js.jam?1309272322",
    "../../doc/doc/doc.jam?1309286331",
    "../../jam/Hash/jam+Hash.jam?1309107977",
    "../../jam/Cached/jam+Cached.jam?1308928451",
    "../../jam/RegExp/jam+RegExp.jam?1309232120",
    "../../jam/Lexer/jam+Lexer.jam?1309239047",
    "../../jam/Number/jam+Number.jam?1309232059",
    "../../jam/Pipe/jam+Pipe.jam?1305067177",
    "../../jam/Throttler/jam+Throttler.js?1309184477",
null ])
