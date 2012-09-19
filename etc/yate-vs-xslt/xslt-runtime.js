function load( uri, cache ){
    if( !cache ) uri= uri + '?' + Math.random()
    var channel= new XMLHttpRequest();
    channel.open( "GET", uri, false );
    channel.send( null );
    return channel;
}

var template= load( 'template.xsl', Boolean( 'cache' ) ).responseXML;
var proc= new XSLTProcessor
proc.importStylesheet( template )
