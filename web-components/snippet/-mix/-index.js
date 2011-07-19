;new function( modules ){
    var packPath= '/snippet/-mix/index.js'
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
    "../../snippet/googl/googl.js?LOAAWR",
    "../../snippet/jsonlib/jsonlib.js?LOAALS",
    "../../jam/jam/jam.jam?LNNGT1",
    "../../jam/define/jam+define.jam?LNNOGU",
    "../../jam/Value/jam+Value.jam?LNNGT1",
    "../../jam/glob/jam+glob.jam?LNNGT1",
    "../../jam/createNameSpace/wc+createNameSpace.jam?LNTHDX",
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/support/jam+support.jam?LO3QAQ",
    "../../jam/schedule/jam+schedule.js?LO4Q6K",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
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
    "../../jam/Throttler/jam+Throttler.js?LO2FDW",
    "../../jam/String/jam+String.jam?LO4E42",
    "../../jam/eventURIChanged/jam+eventURIChanged.jam?LOA8JL",
    "../../jam/eventCommit/jam+eventCommit.jam?LOB1BQ",
    "../../jam/eventDelete/jam+eventDelete.jam?LOB7XM",
    "../../jam/eventEdit/jam+eventEdit.jam?LOB1G8",
    "../../html/html/html.jam?LNNGR7",
    "../../html/a/html-a.jam?LNUPDF",
    "../../wc/wc/wc.jam?LNNJ6F",
    "../../jam/Obj/jam+Obj.jam?LO68LT",
    "../../jam/Clock/jam+Clock.jam?LO6BBE",
    "../../jam/TaskQueue/jam+TaskQueue.jam?LO6IOW",
    "../../jam/htmlEscape/jam+htmlEscape.jam?LO5ZEJ",
    "../../jam/Lazy/jam+Lazy.jam?LNNGT0",
    "../../jam/Thread/jam+Thread.jam?LNTC9R",
    "../../jam/eventClone/jam+eventClone.jam?LOB1AG",
    "../../wc/js-bench/wc_js-bench.jam?LOJSRD",
    "../../snippet/snippet/snippet.jam?LOBB6Q",
null ])
