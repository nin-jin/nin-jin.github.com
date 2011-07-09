;new function( modules ){
    var packPath= '/so/-mix+doc/index.js'
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
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/schedule/jam+schedule.js?LNNGT1",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
    "../../jam/htmlize/jam+htmlize.jam?LNUM2I",
    "../../jam/createNameSpace/wc+createNameSpace.jam?LNTHDX",
    "../../html/html/html.jam?LNNGR7",
    "../../jam/support/jam+support.jam?LNYC2L",
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
    "../../jam/html/jam+html.jam?LNNGT1",
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/dom/jam+dom.jam?LNNGT1",
    "../../jam/Hiqus/jam+Hiqus.jam?LNNGT0",
    "../../jam/Event/jam+Event.jam?LO0VM8",
    "../../jam/selection/jam+selection.jam?LO0EEG",
    "../../jam/DomRange/jam+DomRange.jam?LO0HQK",
    "../../jam/log/jam+log.jam?LNNGT1",
    "../../jam/Node/jam+Node.jam?LO0GQC",
    "../../html/a/html-a.jam?LNUPDF",
    "../../jam/Obj/jam+Obj.jam?LNNGT0",
    "../../jam/Hash/jam+Hash.jam?LNNGT0",
    "../../jam/Cached/jam+Cached.jam?LNNGT0",
    "../../jam/Concater/jam+Concater.jam?LNVHVN",
    "../../jam/Number/jam+Number.jam?LNNGT0",
    "../../jam/Thread/jam+Thread.jam?LNTC9R",
    "../../jam/Throttler/jam+Throttler.js?LNNGT1",
    "../../jam/body/jam+body.jam?LNYOH3",
    "../../jam/eval/jam+eval.jam?LNT2K2",
    "../../jam/eventCommit/jam+eventCommit.jam?LO0WXX",
    "../../jam/eventEdit/jam+eventEdit.jam?LO0WYU",
    "../../wc/wc/wc.jam?LNNJ6F",
    "../../wc/css3/wc-css3.jam?LNSTTU",
    "../../wc/demo/wc-demo.jam?LNWIJ4",
    "../../wc/lang_text/wc+lang_text.jam?LNWGM6",
    "../../wc/lang/wc+lang.jam?LNX3R7",
    "../../wc/hlight/wc-hlight.jam?LO0RFT",
    "../../wc/lang_pcre/wc+lang_pcre.jam?LNX2I7",
    "../../wc/lang_js/wc+lang_js.jam?LO0SIM",
    "../../wc/js-test/wc_js-test.jam?LO1ZGR",
    "../../wc/lang_css/wc+lang_css.jam?LNX8IQ",
    "../../wc/lang_sgml/wc+lang_sgml.jam?LNY9TN",
    "../../wc/ns/wc-ns.jam?LNNJ7F",
    "../../doc/doc/doc.jam?LNT3H8",
    "../../so/-mix+doc/compiled.vml.js?LO10XY",
null ])
