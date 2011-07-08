// jam/jam/jam.jam
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
$jam.$jam= $jam

// jam/define/jam+define.jam
with( $jam )
$jam.$define=
function( key, value ){
    if( this[ key ] && ( this[ key ] !== value ) ){
        throw new Error( 'Redeclaration of [' + key + ']' )
    }
    this[ key ]= value
    return this
}

// jam/Value/jam+Value.jam
with( $jam )
$jam.$Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam.$Value: ' + String( val )
    }
    return value
}

// jam/glob/jam+glob.jam
with( $jam )
$jam.$glob= $Value( this )

// jam/createNameSpace/wc+createNameSpace.jam
with( $jam )
$define( '$createNameSpace', function( name ){
    var proxy= function(){}
    proxy.prototype= this
    var ns= new proxy
    $define.call( $glob(), name, ns )
    ns.$define( name, ns )
    return ns
})

// wc/wc/wc.jam
$jam.$createNameSpace( '$wc' )

// jam/doc/jam+doc.jam
with( $jam )
$define( '$doc', $Value( $glob().document ) )

// jam/support/jam+support.jam
with( $jam )
$define
(   '$support'
,   new function(){
        var node= $doc().createElement( 'html:div' )
        this.htmlModel= $Value( node.namespaceURI !== void 0 ? 'w3c' : 'ms' )
        this.eventModel= $Value( 'addEventListener' in node ? 'w3c' : 'ms' )
        this.selectionModel= $Value( 'createRange' in $doc() ? 'w3c' : 'ms' )
        this.vml= $Value( /*@cc_on!@*/ false )
    }
)

// jam/schedule/jam+schedule.js
with( $jam )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().top.setTimeout( proc, timeout )
    return function( ){
        $glob().top.clearTimeout( timerID )
    }
})

// jam/domReady/jam+domReady.jam
with( $jam )
$define
(   '$domReady'
,   function( ){
        var state= $doc().readyState
        if( state === 'loaded' ) return true
        if( state === 'complete' ) return true
        return false
    }
)

with( $jam )
$domReady.then=
function( proc ){
    var checker= function( ){
        if( $domReady() ) proc()
        else $schedule( 10, checker )
    }
    checker()
}

// jam/Component/jam+Component.jam
with( $jam )
$define( '$Component', function( tagName, factory ){
	if(!( this instanceof $Component )) return new $Component( tagName, factory )
	var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()

	var isBroken= ( $support.htmlModel() === 'ms' )
	var chunks= /(?:(\w+):)?([-\w]+)/.exec( tagName )
	var scopeName= isBroken && chunks && chunks[1] || ''
	var localName= isBroken && chunks && chunks[2] || tagName
	var nodes= $doc().getElementsByTagName( localName )

	var elements= []

	var checkName=
	( tagName === '*' )
	?	$Value( true )
	:	new function(){
			var nameChecker= RegExp( '^' + localName + '$', 'i' )
			if( isBroken ){
				var scopeChecker= RegExp( '^' + scopeName + '$', 'i' )
				return function( el ){
					return scopeChecker.test( el.scopeName ) && nameChecker.test( el.nodeName )
				}
			}
			return function( el ){
				if( el.namespaceURI && el.namespaceURI !== 'http://www.w3.org/1999/xhtml' ) return false
				return nameChecker.test( el.nodeName )
			}
		}
	
	var isAttached=
	function( el ){
		return typeof el[ fieldName ] === 'object'
	}
	
	var attach=
	function( el ){

		el[ fieldName ]= null
		var widget= factory( el )
		el[ fieldName ]= widget || null
		if( widget ) elements.push( el )
	}
	
	var attachIfLoaded=
	function( el ){
		var cur= el
		do {
			if( !cur.nextSibling ) continue
			attach( el )
			break
		} while( cur= cur.parentNode )
	}
	
	var dropElement=
	function( el ){
		for( var i= 0; i < elements.length; ++i ){
			if( elements[ i ] !== el ) continue
			elements.splice( i, 1 )
			return
		}
	}
	
	var detach=
	function( nodeList ){
		for( var i= 0, len= nodeList.length; i < len; ++i ){
			var node= nodeList[ i ]
			var widget= node[ fieldName ]
			if( widget.destroy ) widget.destroy()
			node[ fieldName ]= void 0
			dropElement( node )
		}
	}
	
	var check4attach=
	function( nodeList ){
		var filtered= []
		filtering:
		for( var i= 0, len= nodeList.length; i < len; ++i ){
			var node= nodeList[ i ]
			if( isAttached( node ) ) continue
			if( !checkName( node ) ) continue
			filtered.push( node )
		}
		for( var i= 0, len= filtered.length; i < len; ++i ){
			attachIfLoaded( filtered[ i ] )
		}
	}

	var check4detach=
	function( nodeList ){
		var filtered= []
		filtering:
		for( var i= 0, len= nodeList.length; i < len; ++i ){
			var node= nodeList[ i ]

			if( !node[ fieldName ] ) continue

			var current= node
			var doc= current.ownerDocument
			while( current= current.parentNode ){
				if( current === doc ) continue filtering
			}

			filtered.push( node )
		}
		detach( filtered )
	}

	var checkLost4detach=
	function( nodeList ){
		var filtered= []
		filtering:
		for( var i= 0, len= nodeList.length; i < len; ++i ){
			var node= nodeList[ i ]

			if( !node[ fieldName ] ) continue

			filtered.push( node )
		}
		
		detach( filtered )
	}

	var tracking=
	function( ){
		check4attach( nodes )
		check4detach( elements )
	}

	var interval=
	$glob().top.setInterval( tracking, 100 )

	$domReady.then(function(){
		if( $support.eventModel() === 'w3c' ){
			$glob().top.clearInterval( interval )
		}
		attachIfLoaded= attach
		tracking()
	})

	if( $support.eventModel() === 'w3c' ){
		var docEl= $doc().documentElement
		docEl.addEventListener( 'DOMNodeInserted', function( ev ){
			var node= ev.target
			$schedule( 0, function( ){
				check4attach([ node ])
				if( node.getElementsByTagName ) check4attach( node.getElementsByTagName( '*' ) )
			})
		}, false )
		docEl.addEventListener( 'DOMNodeRemoved', function( ev ){
			var node= ev.target
			$schedule( 0, function( ){
				checkLost4detach([ node ])
				if( node.getElementsByTagName ) check4detach( node.getElementsByTagName( '*' ) )
			})
		}, false )
	}
	
	this.tagName= $Value( tagName )
	this.factory= $Value( factory )
	this.elements=
	function( ){
		return elements.slice( 0 )
	}
})

// jam/Lazy/jam+Lazy.jam
with( $jam )
$define( '$Lazy', function( gen ){
    var proc= function(){
        proc= gen.call( this )
        return proc.apply( this, arguments )
    }
    var lazy= function(){
        return proc.apply( this, arguments )
    }
    lazy.gen= $Value( gen )
    return lazy
})

// jam/dom/jam+dom.jam
with( $jam )
$define
(   '$dom'
,   new function(){

        this.parse= $Lazy( function(){
            var parent= $doc().createElement( 'div' )
            return function( html ){
                parent.innerHTML= html
                var childs= parent.childNodes
                if( childs.length === 1 ) return childs[0]
                var fragment= $doc().createDocumentFragment()
                while( childs[0] ) fragment.appendChild( childs[0] )
                return fragment
            }
        })

        this.serialize= $Lazy( function(){
            var parent= $doc().createElement( 'div' )
            return function( node ){
                parent.innerHTML= ''
                parent.appendChild( node.cloneNode( true ) )
                return parent.innerHTML
            }
        })

    }
)

// jam/Throttler/jam+Throttler.js
with( $jam )
$define
(	'$Throttler'
,	function( latency, func ){
		var self
		var arg
		var stop
		return function(){
			self= this
			arg= arguments
			if( stop ) return
			stop= $schedule( latency, function(){
				stop= null
				func.apply( self, arg )
			})
		}
	}
)

// wc/css3/wc-css3.jam
with( $wc )
if( $support.vml() )
$Component( '*', new function(){

	var refreshers= []
	var callRefreshers=
	function( ){
		for( var i= 0; i < refreshers.length; ++i ){
			refreshers[ i ]()
		}
	}
	var timer= setInterval( callRefreshers, 250 )
	
	return function( nodeRoot ){
		if( nodeRoot.nodeType !== 1 ) return null
		if( nodeRoot.scopeName === 'vml' ) return null

		return new function(){
	
			var shaped= false
	
			var nodeShape= $Lazy( function( ){
				var node= $dom.parse( '<vml:shape style=" position: absolute; display: block; " />' )
				var type= nodeRoot.currentStyle[ '-wc-css3_shapetype' ] || 'wc-css3_roundrect'
				node.setAttribute( 'type', node.type= ( '#' + type ) )
				shaped= true
				return $Value( node )
			})
			
			var nodeStroke= $Lazy( function( ){
				var node= $dom.parse( "<vml:stroke />" )
				nodeShape().appendChild( node )
				return $Value( node )
			})
	
			var nodeFill= $Lazy( function( ){
				var node= $dom.parse( "<vml:fill />" )
				nodeShape().appendChild( node )
				return $Value( node )
			})
	
			var nodeShadow= $Lazy( function( ){
				var node= $dom.parse( "<vml:shadow />" )
				nodeShape().appendChild( node )
				return $Value( node )
			})
	
			var Prop= function( setter ){
				var value
				return function( val ){
					if( !arguments.length ) return value
					if( value === val ) return value
					value= val
					return setter( val )
				}
			}
			
			var parent=
			Prop( function( val ){
				if( val ) val.insertBefore( nodeShape(), nodeRoot )
				else if( shaped ){
					var shape= nodeShape()
					if( shape.parentNode ){
						var frag= document.createDocumentFragment()
						frag.appendChild( shape )
						//shape.parentNode.removeChild( shape )
					}
				}
				return val
			})
	
			var borderRadius= Prop( function( val ){
				var data= String( val || '' ).replace( /[^\s\d]/g, '' ).split(' ')
				while( data.length < 4 ) data= data.concat( data )
				var node= nodeShape()
				if( node.adj ) node.adj.value= data
				else node.setAttribute( 'adj', data )
				return val
			})
			
			var parseHiqus=
			function( str ){
				var res= {}
				str= String( str || '' ).replace( /["']/g, '' )
				var chunks= str.split( ' ' )
				for( var i= 0; i < chunks.length; ++i ){
					var pair= chunks[ i ].split( '=' )
					if( pair.length !== 2 ) continue
					res[ pair[0] ]= pair[1].replace( /\+/g, '' )
				}
				return res
			}
	
			var PropEl=
			function( getNode, back ){
				return Prop( function( val ){
					var data= val
					if( data ){
						data= parseHiqus( 'on=false ' + data )
						data.on= 'true'
					} else {
						data= { on: 'false' }
					}
					var node= getNode()
					for( var key in data ){
						if( typeof node[ key ] === 'object' ){
							node[ key ].value= data[ key ]
						} else {
							node.setAttribute( key, node[ key ]= data[ key ] )
						}
					}
					back( !val )
					return val
				})
			}
			
			var stroke=
			PropEl
			(	nodeStroke
			,	function( back ){ 
					nodeRoot.style.borderColor= back ? '' : 'transparent'
				}
			)
	
			var fill=
			PropEl
			(	nodeFill
			,	function( back ){ 
					nodeRoot.style.background= back ? '' : 'none'
				}
			)
			
			var shadow=
			PropEl
			(	nodeShadow
			,	function( back ){ 
					nodeRoot.style.boxShadow= back ? '' : 'none'
				}
			)
			
			var left= Prop( function( val ){
				nodeShape().style.left = val + 'px'
			})
	
			var top= Prop( function( val ){
				nodeShape().style.top = val + 'px'
			})
	
			var width= Prop( function( val ){
				nodeShape().style.width = val + 'px'
			})
	
			var height= Prop( function( val ){
				nodeShape().style.height= val + 'px'
			})
	
			var refreshPosition=
			function( ){
				parent( nodeRoot.parentNode )
				left( nodeRoot.offsetLeft )
				top( nodeRoot.offsetTop )
				width( nodeRoot.offsetWidth )
				height( nodeRoot.offsetHeight )
				//nodeShape().coordsize= [ width, height ]
			}
	
			var refresh=
			function( ){
				var style= nodeRoot.currentStyle
				if( !style ) return
				if( style.visibility === 'hidden' ){
					parent( null )
					return
				}
				
				if
				(   borderRadius( style[ '-wc-css3_border-radius' ] )
				+	stroke( style[ '-wc-css3_border' ] )
				+	fill( style[ '-wc-css3_background' ] )
				+	shadow( style[ '-wc-css3_box-shadow' ] )
				) refreshPosition()
			}
			
			var lazyRefresh= $Throttler( 10, function( ){
				refresh()
			})
			
			refreshers.push( refresh )
	
			nodeRoot.attachEvent( 'onresize', lazyRefresh )
			nodeRoot.attachEvent( 'onmove', lazyRefresh )
			nodeRoot.attachEvent( 'onmouseenter', lazyRefresh )
			nodeRoot.attachEvent( 'onmousedown', lazyRefresh )
			nodeRoot.attachEvent( 'onmouseleave', lazyRefresh )
			nodeRoot.attachEvent( 'onpropertychange', lazyRefresh )
			
			this.destroy=
			function(){
				nodeRoot.detachEvent( 'onresize', lazyRefresh )
				nodeRoot.detachEvent( 'onmove', lazyRefresh )
				nodeRoot.detachEvent( 'onmouseenter', lazyRefresh )
				nodeRoot.detachEvent( 'onmousedown', lazyRefresh )
				nodeRoot.detachEvent( 'onmouseleave', lazyRefresh )
				nodeRoot.detachEvent( 'onpropertychange', lazyRefresh )
				xxx= shaped && nodeShape()
				parent( null )
				for( var i= 0; i < refreshers.length; ++i ){
					if( refreshers[ i ] !== refresh ) continue
					refreshers.splice( i--, 1 )
				}
			}
	
			refresh()
		}
	}
	
})

