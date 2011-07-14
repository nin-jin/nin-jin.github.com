;new function( modules ){
    var packPath= '/lib_wc_lang/-mix/index.js'
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
    "../../jam/htmlEscape/jam+htmlEscape.jam?LO5ZEJ",
    "../../wc/lang_text/wc+lang_text.jam?LO5Z9P",
    "../../jam/Pipe/jam+Pipe.jam?LO2FDW",
    "../../jam/Class/jam+Class.jam?LO4ER1",
    "../../jam/RegExp/jam+RegExp.jam?LO5Z5N",
    "../../jam/Lexer/jam+Lexer.jam?LO3SAI",
    "../../jam/Parser/jam+Parser.jam?LO2FDW",
    "../../jam/Concater/jam+Concater.jam?LNVHVN",
    "../../wc/lang/wc+lang.jam?LO2FE0",
    "../../wc/lang_css/wc+lang_css.jam?LO2FE0",
    "../../wc/lang_pcre/wc+lang_pcre.jam?LO2FE0",
    "../../wc/lang_js/wc+lang_js.jam?LO608A",
    "../../wc/lang_sgml/wc+lang_sgml.jam?LO2FE0",
null ])
