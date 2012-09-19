function load( uri ){
    var channel= new XMLHttpRequest();
    channel.open( "GET", uri + '?' + Math.random(), false );
    channel.send( null );
    return channel;
}

var template= load( 'template.xsl').responseXML;
var proc= new XSLTProcessor
proc.importStylesheet( template )
