;new function( modules ){
    var packPath= '/widget_wc_js-test/-mix/index.js'
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
    "../../jam/Value/jam+Value.jam?LNNGT1",
    "../../jam/glob/jam+glob.jam?LNNGT1",
    "../../jam/createNameSpace/wc+createNameSpace.jam?LNTHDX",
    "../../wc/wc/wc.jam?LNNJ6F",
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/support/jam+support.jam?LNYC2L",
    "../../jam/schedule/jam+schedule.js?LNNGT1",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
    "../../jam/Component/jam+Component.jam?LNWG7O",
    "../../jam/Class/jam+Class.jam?LNNGT0",
    "../../jam/Poly/jam+Poly.js?LNNGT0",
    "../../jam/classOf/jam+classOf.jam?LNNGT1",
    "../../jam/String/jam+String.jam?LNULM5",
    "../../jam/RegExp/jam+RegExp.jam?LNNGT0",
    "../../jam/Pipe/jam+Pipe.jam?LNNGT0",
    "../../jam/Lexer/jam+Lexer.jam?LNX6MU",
    "../../jam/Parser/jam+Parser.jam?LNX1KB",
    "../../jam/Lazy/jam+Lazy.jam?LNNGT0",
    "../../jam/TemplateFactory/jam+TemplateFactory.jam?LNWI7J",
    "../../jam/html/jam+html.jam?LO24LJ",
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/dom/jam+dom.jam?LNNGT1",
    "../../jam/Hiqus/jam+Hiqus.jam?LNNGT0",
    "../../jam/Event/jam+Event.jam?LO0VM8",
    "../../jam/selection/jam+selection.jam?LO0EEG",
    "../../jam/DomRange/jam+DomRange.jam?LO0HQK",
    "../../jam/log/jam+log.jam?LNNGT1",
    "../../jam/Node/jam+Node.jam?LO0GQC",
    "../../jam/Thread/jam+Thread.jam?LNTC9R",
    "../../jam/eventCommit/jam+eventCommit.jam?LO0WXX",
    "../../wc/lang_text/wc+lang_text.jam?LNWGM6",
    "../../jam/Concater/jam+Concater.jam?LNVHVN",
    "../../wc/lang/wc+lang.jam?LNX3R7",
    "../../wc/lang_pcre/wc+lang_pcre.jam?LNX2I7",
    "../../wc/lang_js/wc+lang_js.jam?LO0SIM",
    "../../wc/js-test/wc_js-test.jam?LO24QX",
null ])
