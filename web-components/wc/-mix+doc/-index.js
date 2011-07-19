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
    "../../jam/jam/jam.jam?LNNGT1",
    "../../jam/define/jam+define.jam?LNNOGU",
    "../../jam/Value/jam+Value.jam?LNNGT1",
    "../../jam/glob/jam+glob.jam?LNNGT1",
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/schedule/jam+schedule.js?LO4Q6K",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
    "../../jam/htmlize/jam+htmlize.jam?LNUM2I",
    "../../jam/createNameSpace/wc+createNameSpace.jam?LNTHDX",
    "../../html/html/html.jam?LNNGR7",
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/support/jam+support.jam?LO3QAQ",
    "../../jam/Component/jam+Component.jam?LO67DS",
    "../../jam/Class/jam+Class.jam?LO4ER1",
    "../../jam/Poly/jam+Poly.js?LO4EWP",
    "../../jam/htmlEntities/jam+htmlEntities.jam?LO60B2",
    "../../jam/htmlDecode/jam+htmlDecode.jam?LO60A6",
    "../../jam/html2text/jam+html2text.jam?LO5ZK9",
    "../../jam/classOf/jam+classOf.jam?LNNGT1",
    "../../jam/Hiqus/jam+Hiqus.jam?LO4GMQ",
    "../../jam/NodeList/jam+NodeList.jam?LO4DM7",
    "../../jam/raw/jam+raw.jam?LO40ZZ",
    "../../jam/Event/jam+Event.jam?LO4HAA",
    "../../jam/Observer/jam+Observer.jam?LO4K55",
    "../../jam/Node/jam+Node.jam?LOB131",
    "../../html/a/html-a.jam?LNUPDF",
    "../../jam/Hash/jam+Hash.jam?LO4I4T",
    "../../jam/Cached/jam+Cached.jam?LO2FDW",
    "../../jam/Obj/jam+Obj.jam?LO68LT",
    "../../jam/Clock/jam+Clock.jam?LO6BBE",
    "../../jam/Concater/jam+Concater.jam?LNVHVN",
    "../../jam/selection/jam+selection.jam?LO4E2R",
    "../../jam/htmlEscape/jam+htmlEscape.jam?LO5ZEJ",
    "../../jam/log/jam+log.jam?LNNGT1",
    "../../jam/DomRange/jam+DomRange.jam?LO5ZB9",
    "../../jam/Lazy/jam+Lazy.jam?LNNGT0",
    "../../jam/RegExp/jam+RegExp.jam?LO5Z5N",
    "../../jam/Lexer/jam+Lexer.jam?LO3SAI",
    "../../jam/Number/jam+Number.jam?LO4DNY",
    "../../jam/Pipe/jam+Pipe.jam?LO2FDW",
    "../../jam/Parser/jam+Parser.jam?LO2FDW",
    "../../jam/String/jam+String.jam?LO4E42",
    "../../jam/TaskQueue/jam+TaskQueue.jam?LO6IOW",
    "../../jam/TemplateFactory/jam+TemplateFactory.jam?LO3TCT",
    "../../jam/Thread/jam+Thread.jam?LNTC9R",
    "../../jam/Throttler/jam+Throttler.js?LO2FDW",
    "../../jam/body/jam+body.jam?LNYOH3",
    "../../jam/eval/jam+eval.jam?LNT2K2",
    "../../jam/eventClone/jam+eventClone.jam?LOB1AG",
    "../../jam/eventCommit/jam+eventCommit.jam?LOB1BQ",
    "../../jam/eventDelete/jam+eventDelete.jam?LOB7XM",
    "../../jam/eventEdit/jam+eventEdit.jam?LOB1G8",
    "../../jam/eventURIChanged/jam+eventURIChanged.jam?LOA8JL",
    "../../wc/wc/wc.jam?LNNJ6F",
    "../../wc/css3/wc-css3.jam?LO4LA6",
    "../../wc/demo/wc-demo.jam?LOB1HT",
    "../../wc/lang_text/wc+lang_text.jam?LO5Z9P",
    "../../wc/lang/wc+lang.jam?LO2FE0",
    "../../wc/hlight/wc-hlight.jam?LOB6VA",
    "../../wc/js-bench/wc_js-bench.jam?LOJSRD",
    "../../wc/lang_pcre/wc+lang_pcre.jam?LO2FE0",
    "../../wc/lang_js/wc+lang_js.jam?LO608A",
    "../../wc/js-test/wc_js-test.jam?LOD0PQ",
    "../../wc/lang_css/wc+lang_css.jam?LO2FE0",
    "../../wc/lang_sgml/wc+lang_sgml.jam?LO2FE0",
    "../../wc/ns/wc-ns.jam?LNNJ7F",
    "../../doc/doc/doc.jam?LNT3H8",
    "../../wc/-mix+doc/compiled.vml.js?LO10XZ",
null ])
