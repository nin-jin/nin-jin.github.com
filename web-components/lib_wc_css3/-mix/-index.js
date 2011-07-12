;new function( modules ){
    var packPath= '/lib_wc_css3/-mix/index.js'
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
    "../../jam/switch/jam+switch.jam?LNYDNN",
    "../../jam/doc/jam+doc.jam?LNNHVF",
    "../../jam/support/jam+support.jam?LO3QAQ",
    "../../jam/schedule/jam+schedule.js?LNNGT1",
    "../../jam/domReady/jam+domReady.jam?LNTHXE",
    "../../jam/Component/jam+Component.jam?LO4629",
    "../../jam/Lazy/jam+Lazy.jam?LNNGT0",
    "../../jam/Class/jam+Class.jam?LO4ER1",
    "../../jam/Poly/jam+Poly.js?LO4EWP",
    "../../jam/raw/jam+raw.jam?LO40ZZ",
    "../../jam/String/jam+String.jam?LO4E42",
    "../../jam/RegExp/jam+RegExp.jam?LO4DV4",
    "../../jam/Pipe/jam+Pipe.jam?LO2FDW",
    "../../jam/Lexer/jam+Lexer.jam?LO3SAI",
    "../../jam/Parser/jam+Parser.jam?LO2FDW",
    "../../jam/TemplateFactory/jam+TemplateFactory.jam?LO3TCT",
    "../../jam/html/jam+html.jam?LO4DFT",
    "../../jam/classOf/jam+classOf.jam?LNNGT1",
    "../../jam/Hiqus/jam+Hiqus.jam?LO4GMQ",
    "../../jam/NodeList/jam+NodeList.jam?LO4DM7",
    "../../jam/Node/jam+Node.jam?LO4HSW",
    "../../jam/Throttler/jam+Throttler.js?LO2FDW",
    "../../wc/css3/wc-css3.jam?LO4LA6",
    "../../lib_wc_css3/-mix/compiled.vml.js?LO10XY",
null ])
