;new function( modules ){
    var packPath= '/jam/-mix/index.js'
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
    "../../jam/jam/jam.jam?LNNGT1",
    "../../jam/define/jam+define.jam?LNNOGU",
    "../../jam/Class/jam+Class.jam?LNNGT0",
    "../../jam/Obj/jam+Obj.jam?LNNGT0",
    "../../jam/Hash/jam+Hash.jam?LNNGT0",
    "../../jam/Cached/jam+Cached.jam?LNNGT0",
    "../../jam/Value/jam+Value.jam?LNNGT1",
    "../../jam/glob/jam+glob.jam?LNNGT1",
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/support/jam+support.jam?LNYC2L",
    "../../jam/schedule/jam+schedule.js?LNNGT1",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
    "../../jam/Component/jam+Component.jam?LNWG7O",
    "../../jam/Concater/jam+Concater.jam?LNVHVN",
    "../../jam/Poly/jam+Poly.js?LNNGT0",
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/selection/jam+selection.jam?LO0EEG",
    "../../jam/String/jam+String.jam?LNULM5",
    "../../jam/classOf/jam+classOf.jam?LNNGT1",
    "../../jam/RegExp/jam+RegExp.jam?LNNGT0",
    "../../jam/Pipe/jam+Pipe.jam?LNNGT0",
    "../../jam/Lexer/jam+Lexer.jam?LNX6MU",
    "../../jam/Parser/jam+Parser.jam?LNX1KB",
    "../../jam/Lazy/jam+Lazy.jam?LNNGT0",
    "../../jam/TemplateFactory/jam+TemplateFactory.jam?LNWI7J",
    "../../jam/html/jam+html.jam?LO24LJ",
    "../../jam/dom/jam+dom.jam?LNNGT1",
    "../../jam/Hiqus/jam+Hiqus.jam?LNNGT0",
    "../../jam/Event/jam+Event.jam?LO0VM8",
    "../../jam/log/jam+log.jam?LNNGT1",
    "../../jam/Node/jam+Node.jam?LO0GQC",
    "../../jam/DomRange/jam+DomRange.jam?LO0HQK",
    "../../jam/Number/jam+Number.jam?LNNGT0",
    "../../jam/Thread/jam+Thread.jam?LNTC9R",
    "../../jam/Throttler/jam+Throttler.js?LNNGT1",
    "../../jam/body/jam+body.jam?LNYOH3",
    "../../jam/createNameSpace/wc+createNameSpace.jam?LNTHDX",
    "../../jam/eval/jam+eval.jam?LNT2K2",
    "../../jam/eventCommit/jam+eventCommit.jam?LO0WXX",
    "../../jam/eventEdit/jam+eventEdit.jam?LO0WYU",
    "../../jam/htmlize/jam+htmlize.jam?LNUM2I",
null ])
