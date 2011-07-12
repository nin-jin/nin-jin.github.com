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
    "../../jam/Class/jam+Class.jam?LO4ER1",
    "../../jam/Poly/jam+Poly.js?LO4EWP",
    "../../jam/Hash/jam+Hash.jam?LO4I4T",
    "../../jam/Cached/jam+Cached.jam?LO2FDW",
    "../../jam/schedule/jam+schedule.js?LO4Q6K",
    "../../jam/Obj/jam+Obj.jam?LO68LT",
    "../../jam/Clock/jam+Clock.jam?LO6BBE",
    "../../jam/Value/jam+Value.jam?LNNGT1",
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/glob/jam+glob.jam?LNNGT1",
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/support/jam+support.jam?LO3QAQ",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
    "../../jam/Component/jam+Component.jam?LO67DS",
    "../../jam/Concater/jam+Concater.jam?LNVHVN",
    "../../jam/selection/jam+selection.jam?LO4E2R",
    "../../jam/htmlEscape/jam+htmlEscape.jam?LO5ZEJ",
    "../../jam/htmlEntities/jam+htmlEntities.jam?LO60B2",
    "../../jam/htmlDecode/jam+htmlDecode.jam?LO60A6",
    "../../jam/html2text/jam+html2text.jam?LO5ZK9",
    "../../jam/classOf/jam+classOf.jam?LNNGT1",
    "../../jam/Hiqus/jam+Hiqus.jam?LO4GMQ",
    "../../jam/NodeList/jam+NodeList.jam?LO4DM7",
    "../../jam/raw/jam+raw.jam?LO40ZZ",
    "../../jam/Node/jam+Node.jam?LO652X",
    "../../jam/log/jam+log.jam?LNNGT1",
    "../../jam/DomRange/jam+DomRange.jam?LO5ZB9",
    "../../jam/Event/jam+Event.jam?LO4HAA",
    "../../jam/Lazy/jam+Lazy.jam?LNNGT0",
    "../../jam/RegExp/jam+RegExp.jam?LO5Z5N",
    "../../jam/Lexer/jam+Lexer.jam?LO3SAI",
    "../../jam/Number/jam+Number.jam?LO4DNY",
    "../../jam/Observer/jam+Observer.jam?LO4K55",
    "../../jam/Pipe/jam+Pipe.jam?LO2FDW",
    "../../jam/Parser/jam+Parser.jam?LO2FDW",
    "../../jam/String/jam+String.jam?LO4E42",
    "../../jam/TaskQueue/jam+TaskQueue.jam?LO6IOW",
    "../../jam/TemplateFactory/jam+TemplateFactory.jam?LO3TCT",
    "../../jam/Thread/jam+Thread.jam?LNTC9R",
    "../../jam/Throttler/jam+Throttler.js?LO2FDW",
    "../../jam/body/jam+body.jam?LNYOH3",
    "../../jam/createNameSpace/wc+createNameSpace.jam?LNTHDX",
    "../../jam/eval/jam+eval.jam?LNT2K2",
    "../../jam/eventCommit/jam+eventCommit.jam?LO43JM",
    "../../jam/eventEdit/jam+eventEdit.jam?LO4HDS",
    "../../jam/htmlize/jam+htmlize.jam?LNUM2I",
null ])
