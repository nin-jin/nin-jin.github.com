document.addEventListener( 'click' , function( event ) {
	if( event.buttons || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey ) return
	
	var href = event.target.href
	if( !href ) return
	
	var id = href.replace( /\.xml$/ , '' ).replace( /^.*\// , '' )
	if( !document.getElementById( id ) ) {
		
		var frame = document.createElementNS( 'http://www.w3.org/1999/xhtml' , 'iframe' )
		frame.src = href
		frame.id = id
		frame.width = 64
		frame.height = 64
		frame.onload = function( ) {
			var fragment = document.createDocumentFragment()
			
			for( var node; node = frame.contentDocument.getElementsByTagName('body')[0].firstChild; ) { 
				fragment.appendChild( node )
			}
			
			document.getElementsByTagName('body')[0].replaceChild( fragment , frame )
			
			document.location = '#' + id
		}
		
		document.getElementsByTagName('body')[0].appendChild( frame )
	}
	
	document.location = '#' + id
	
	event.preventDefault()
} )