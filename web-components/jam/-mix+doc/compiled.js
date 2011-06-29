// jam/jam/jam.jam
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
$jam.$jam= $jam

// jam/Class/jam+Class.jam
with( $jam )
$jam.$Class=
function( init ){
    var klass=
    function( ){
        if( this instanceof klass ) return this
        var obj= klass.create.apply( klass, arguments )
        return obj
    }
    
    klass.create=
    function( ){
        return new klass
    }

    init( klass, klass.prototype )
    
    return klass
}

// jam/Obj/jam+Obj.jam
with( $jam )
$jam.$Obj=
$Class( function( klass, proto ){
    
    klass.create=
    function( val ){
        if(( val === void 0 )||( val === null )){
            throw new Error( 'Wrong object: ' + val )
        }
        var obj= new klass
        obj.$= val
        return obj
    }
    
    proto.has=
    function( key ){
        return ( 'hasOwnProperty' in this.$ )
        ?   this.$.hasOwnProperty( key )
        :   ( key in this.$ )
    }
    
    proto.get=
    function( key ){
        return this.$[ key ]
    }
    
    proto.put=
    function( key, value ){
        this.$[ key ]= value
        return this
    }
    
    proto.define=
    function( key, value ){
        if( this.has( key ) && this.get( key ) !== value ){
            throw new Error( 'Redeclaration of [' + key + ']' )
        }
        this.put( key, value )
    }
    
    proto.init=
    function( init ){
        init( this.$ )
        return this
    }
})

// jam/define/jam+define.jam
with( $jam )
$jam.$define=
function( key, value ){
    $Obj( this ).define( key, value )
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

// jam/support/jam+support.jam
with( $jam )
$define
(   '$support'
,   new function(){
        var node= document.createElement( 'html:div' )
        this.htmlModel= $Value( node.namespaceURI !== void 0 ? 'w3c' : 'old-ie' )
        this.eventModel= $Value( 'addEventListener' in node ? 'w3c' : 'old-ie' )
    }
)

// jam/doc/jam+doc.jam
with( $jam )
$define( '$doc', $Value( $glob().document ) )

with( $jam )
$define.call( $doc, 'onLoad', function( handler ){
})

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
        else $schedule( 100, checker )
    }
    checker()
}

// jam/Poly/jam+Poly.js
with( $jam )
$define
(   '$Poly'
,   function(){
        var map= arguments
        return function(){
            return map[ arguments.length ].apply( this, arguments )
        }
    }
)

// jam/classOf/jam+classOf.jam
with( $jam )
$define( '$classOf', function(){
    var toString = {}.toString
    return function( val ){
        if( val === void 0 ) return 'Undefined'
        if( val === null ) return 'Null'
        if( val === $glob() ) return 'Global'
        return toString.call( val ).replace( /^\[object |\]$/g, '' )
    }
}())

// jam/String/jam+String.jam
with( $jam )
$define
(   '$String'
,   $Class( function( klass, proto ){
    
        klass.create=
        $Poly
        (   function( ){
                return klass.create( '' )
            }
        ,   function( data ){
                var obj= new klass
                obj.$= String( data )
                return obj
            }
        )
        
        proto.incIndent=
        $Poly
        (   function( ){
                this.$= this.$.replace( /^/mg, '    ' )
                return this
            }
        )

        proto.decIndent=
        $Poly
        (   function( ){
                this.$= this.$.replace( /^    |^\t/mg, '' )
                return this
            }
        )

        proto.minimizeIndent=
        $Poly
        (   function( ){
                var minIndent= 1/0
                this.$.replace( /^( +)[^ ]/mg, function( str, indent ){
                    if( indent.length < minIndent ) minIndent= indent.length
                })
                if( minIndent === 1/0 ) return this
                this.$= this.$.replace( RegExp( '^[ ]{1,' + minIndent + '}', 'mg' ), '' )
                return this
            }
        )

        proto.tab2space=
        $Poly
        (   function( ){
                this.$= this.$.replace( /\t/g, '    ' )
                return this
            }
        )
        
        proto.trim=
        $Poly
        (   function( ){
                return this.trim( /\s/ )
            }
        ,   function( what ){
                this.$= this.$.replace( RegExp( '^(' + what.source + ')+' ), '' )
                this.$= this.$.replace( RegExp( '(' + what.source + ')+$' ), '' )
                return this
            }
        )
        
        proto.replace=
        $Poly
        (   null
        ,   function( from ){
                return this.replace( from, '' )
            }
        ,   function( from, to ){
                this.$= this.$.replace( from, to )
                return this
            }
        )
        
        proto.length=
        $Poly
        (   function( ){
                return this.$.length
            }
        )
        
        proto.toString=
        $Poly
        (   function( ){
                return this.$
            }
        )

    })
)

// jam/Hiqus/jam+Hiqus.jam
with( $jam )
$define
(   '$Hiqus'
,   $Class( function( klass, proto ){
        
        klass.create=
        $Poly
        (   function(){
                return klass.create({ })
            }
        ,   function( arg ){
                var obj= new klass
                obj.splitterChunks= arg.splitterChunks || '&'
                obj.splitterPair= arg.splitterPair || '='
                obj.splitterKeys= arg.splitterKeys || '_'
                obj.data= {}
                return obj
            }
        )
        
        proto.toJSON=
        $Poly
        (   function( ){
                return this.$
            }
        )
        
        proto.get=
        $Poly
        (   function( ){
                return this.get( [] )
            }
        ,   function( keyList ){
                if( $classOf( keyList ) === 'String' ){
                    keyList= keyList.split( this.splitterKeys )
                }
                var cur= this.data
                for( var i= 0; i < keyList.length; ++i ){
                    var key= keyList[ i ]
                    cur= cur[ key ]
                    if( $classOf( cur ) !== 'Object' ) break
                }
                return cur
            }
        )
        
        proto.put=
        $Poly
        (   null
        ,   function( keyList ){
                return this.put( keyList, true )
            }
        ,   function( keyList, value ){
                if( $classOf( keyList ) === 'String' ){
                    var keyListRaw= keyList.split( this.splitterKeys )
                    keyList= []
                    for( var i= 0; i < keyListRaw.length; ++i ){
                        if( !keyListRaw[ i ] ) continue
                        keyList.push( keyListRaw[ i ] )
                    }
                }
                var cur= this.data
                for( var i= 0; i < keyList.length - 1; ++i ){
                    var key= keyList[ i ]
                    if( $classOf( cur[ key ] ) === 'Object' ){
                        cur= cur[ key ]
                    } else {
                        cur= cur[ key ]= {}
                    }
                }
                if( value === null ) delete cur[ keyList[ i ] ]
                else cur[ keyList[ i ] ]= value
                return this
            }
        )
        
        proto.merge=
        $Poly
        (   null
        ,   function( json ){
                if( $classOf( json ) === 'String' ){
                    var chunks= json.split( this.splitterChunks )
                    for( var i= 0; i < chunks.length; ++i ){
                        var chunk= chunks[i]
                        if( !chunk ) continue
                        var pair= chunk.split( this.splitterPair )
                        if( pair.length > 2 ) continue;
                        var key= pair[ 0 ]
                        var val= pair[ pair.length - 1 ]
                        this.put( key, val )
                    }
                } else {
                    if( json.toJSON ) json= json.toJSON()
                    var merge=
                    function( from, to ){
                        for( var key in from ){
                            if( !from.hasOwnProperty( key ) ) continue
                            if( from[ key ] === null ){
                                delete to[ key ]
                            } else if( typeof from[ key ] === 'object' ){
                                if( typeof to[ key ] !== 'object' ){
                                    to[ key ]= {}
                                }
                                merge( from[ key ], to[ key ] )
                            } else {
                                to[ key ]= String( from[ key ] )
                            }
                        }
                    }
                    merge( json, this.data )
                }
                return this
            }
        )
        
        proto.toString=
        $Poly
        (   function( ){
                var chunks=
                function( prefix, obj ){
                    var chunkList= []
                    for( var key in obj ){
                        if( !obj.hasOwnProperty( key ) ) continue
                        var val= obj[ key ]
                        if( val === null ) continue
                        if( prefix ) key= prefix + this.splitterKeys + key
                        if( typeof val === 'object' ){
                            chunkList= chunkList.concat( chunks.call( this, key, val ) )
                        } else {
                            if( val === key ) chunkList.push( key )
                            else chunkList.push( key + this.splitterPair + val )
                        }
                    }
                    return chunkList
                }
                return chunks.call( this, '', this.data ).join( this.splitterChunks )
            }
        )
            
    })
)

// jam/Event/jam+Event.jam
with( $jam )
$define
(   '$Event'
,   $Class( function( klass, proto ){
    
        klass.create=
        {   'w3c': $Poly
            (   function( ){
                    var obj= new klass
                    obj.$= $doc().createEvent( 'Event' )
                    return obj
                }
            ,   function( ev ){
                    if( $classOf( ev ) === 'Object' ){
                        if( ev.toEvent ){
                            var obj= new klass
                            obj.$= ev.toEvent()
                        } else {
                            var obj= klass.create()
                            obj.$.initEvent( ev.type, ev.bubble || true, ev.cancelable || false )
                        }
                    } else {
                        var obj= new klass
                        obj.$= ev
                    }
                    return obj
                }
            )
        ,   'old-ie': $Poly
            (   function( ){
                    var obj= new klass
                    obj.$= $doc().createEventObject()
                    return obj
                }
            ,   function( ev ){
                    if( ev.toEvent ) ev= ev.toEvent()
                    var obj= klass.create()
                    for( var key in ev ) try {
                        obj.$[ key ]= ev[ key ]
                    } catch( e ){ }
                    return obj
                }
            )
        }[ $support.eventModel() ]
        
        proto.toEvent=
        $Poly
        (   function(){
                return this.$
            }
        )

    })
)

// jam/Node/jam+Node.jam
with( $jam )
$define
(   '$Node'
,   $Class( function( klass, proto ){
        
        klass.create=
        $Poly
        (   null
        ,   function( val ){
                var obj= new klass
                if( $classOf( val ) === 'String' ){
                    switch( val ){
                        case '#text':
                            val= $doc().createTextNode( '' )
                            break
                        case '#comment':
                            val= $doc().createComment( '' )
                            break
                        case '#fragment':
                            val= $doc().createDocumentFragment()
                            break
                        default:
                            val= $doc().createElement( val )
                            break
                    }
                    if( val.parentNode ) val.parentNode.removeChild( val )
                }
                if( typeof val !== 'object' ){
                    throw new Error( 'Wrong node: ' + val )
                }
                if( val.toNode ) val= val.toNode()
                obj.$= val
                return obj
            }
        )
        
        proto.toNode=
        $Poly
        (   function( ){
                return this.$
            }
        )
        
        proto.text=
        {   'w3c': $Poly
            (   function( ){
                    return this.$.textContent
                }
            ,   function( val ){
                    this.$.textContent= $String( val ).$
                    return this
                }
            )
        ,   'old-ie': $Poly
            (   function( ){
                    return this.$.innerText
                }
            ,   function( val ){
                    this.$.innerText= $String( val ).$
                    return this
                }
            )
        }[ $support.htmlModel() ]
        
        proto.html=
        $Poly
        (   function( ){
                var val= this.$.innerHTML.replace( /<\/?[A-Z]+/g, function( str ){
                    return str.toLowerCase()
                })
                return val
            }
        ,   function( val ){
                this.$.innerHTML= $String( val ).$
                return this
            }
        )
        
        proto.clear=
        $Poly
        (   function( ){
                this.html( '' )
                return this
            }
        )
        
        proto.name=
        $Poly
        (   function( ){
                return this.$.nodeName.toLowerCase()
            }
        )
        
        proto.attr=
        $Poly
        (   null
        ,   function( name ){
                return this.$.getAttribute( name )
            }
        ,   function( name, val ){
                this.$.setAttribute( $String( name ).$, $String( val ).$ )
                return this
            }    
        )
        
        proto.state=
        $Poly
        (   function( ){
                return this.param( [] )
            }
        ,   function( key ){
                return $Hiqus({ splitterChunks: ' ' }).merge( this.$.className ).get( key )
            }
        ,   function( key, value ){
                this.$.className= $Hiqus({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
                return this
            }
        )
        
        proto.editable=
        $Poly
        (   function( ){
                return this.$.contentEditable
            }
        ,   function( val ){
                this.$.contentEditable= val
            }
        )
        
        proto.listen=
        $Poly
        (   null
        ,   null
        ,   {   'w3c': function( eventName, proc ){
                    this.$.addEventListener( eventName, proc, false )
                    
                    var self= this
                    return function(){
                        self.$.removeEventListener( eventName, proc, false )
                    }
                }
            ,   'old-ie': function( eventName, proc ){
                    var proc2= proc
                    var eventName2= eventName
                    if( !/^\w+$/.test( eventName ) ){
                        eventName2= 'beforeeditfocus'
                        proc2= function( ev ){
                            if( ev.originalType !== eventName ) return
                            ev.type= ev.originalType
                            proc( ev )
                        }
                    }
                    var proc3= function(){
                        var ev= $glob().event
                        //ev= $doc().createEventObject( ev )
                        proc2( ev )
                    }
                    this.$.attachEvent( 'on' + eventName2, proc3, false )

                    var self= this
                    return function(){
                        self.$.detachEvent( 'on' + eventName2, proc3, false )
                    }
                }
            }[ $support.eventModel() ]
        )
        
        proto.scream=
        $Poly
        (   null
        ,   {   'w3c': function( ev ){
                    ev= $Event( ev ).$
                    this.$.dispatchEvent( ev )
                }
            ,   'old-ie': function( ev ){
                    ev= $Event( ev ).$
                    var eventName= ev.type
                    if( !/^\w+$/.test( eventName ) ){
                        eventName= 'beforeeditfocus'
                    }
                    ev.originalType= ev.type
                    this.$.fireEvent( 'on' + eventName, ev )
                }
            }[ $support.eventModel() ]
        )
        
        proto.parent= 
        $Poly
        (   function( ){
                this.$= this.$.parentNode
                return this
            }
        ,   function( node ){
                var parent= this.$.parentNode
                if( node ){
                    node= $Node( node ).$
                    if( parent ) parent.insertBefore( node, this.$ )
                    node.appendChild( this.$ )
                } else {
                    if( !parent ) return this
                    parent.removeChild( this.$ )
                }
                return this
            }
        )
        
        proto.childList=
        function( name ){
            var list= this.$.childNodes
            var filtered= []
            
            for( var i= $Node( this ).head(); i.$; i.next() ){
                if( name && ( i.name() !== name ) ) continue
                filtered.push( i.$ )
            }
            
            return filtered
        }
        
        proto.head=
        $Poly
        (   function(){
                this.$= this.$.firstChild
                return this
            }
        ,   function( node ){
                node= $Node( node ).$
                this.$.insertBefore( node, this.$.firstChild )
                return this
            }
        )
        
        proto.tail=
        $Poly
        (   function(){
                this.$= this.$.lastChild
                return this
            }
        ,   function( node ){
                node= $Node( node ).$
                this.$.appendChild( node )
                return this
            }
        )
        
        proto.next=
        $Poly
        (   function(){
                this.$= this.$.nextSibling
                return this
            }
        ,   function( node ){
                node= $Node( node ).$
                var parent= this.$.parentNode
                var next= this.$.nextSibling
                parent.insertBefore( node, next ) 
                return this
            }   
        )

        proto.prev=
        $Poly
        (   function(){
                this.$= this.$.previousSibling
                return this
            }
        ,   function( node ){
                node= $Node( node ).$
                var parent= this.$.parentNode
                parent.insertBefore( node, this.$ ) 
                return this
            }   
        )
            
    })
)

// jam/Component/jam+Component.jam
with( $jam )
$define( '$Component', function( tagName, factory ){
	if(!( this instanceof $Component )) return new $Component( tagName, factory )
	var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()

	var isBroken= ( $support.htmlModel() === 'old-ie' )
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
	
	var isAttached= function( el ){
		return typeof el[ fieldName ] === 'object'
	}
	
	var attach= function( el ){
		el[ fieldName ]= null
		var widget= new factory( el )
		el[ fieldName ]= widget
		elements.push( el )
	}
	
	var attachIfLoaded= function( el ){
		var cur= el
		do {
			if( !cur.nextSibling ) continue
			attach( el )
			break
		} while( cur= cur.parentNode )
	}
	
	var check4attach= function( nodes ){
		filtered= []
		filter: for( var i= 0, len= nodes.length; i < len; ++i ){
			var el= nodes[ i ]
			if( isAttached( el ) ) continue
			if( !checkName( el ) ) continue
			filtered.push( el )
		}
		attach: for( var i= 0; i < filtered.length; ++i ){
			attachIfLoaded( filtered[ i ] )
		}
	}

	var tracking= function(){
		check4attach( nodes )
	}

	var detach= function( el ){
		var widget= el[ fieldName ]
		if( widget && widget.onDetach ) widget.onDetach()
		el[ fieldName ]= void 0
	}
	
	var check4detach= function( nodes ){
		filtered= []
		filter: for( var i= 0, len= nodes.length; i < len; ++i ){
			var el= nodes[ i ]
			if( !isAttached( el ) ) continue
			filtered.push( el )
		}
		attach: for( var i= 0, len= filtered.length; i < len; ++i ){
			detach( filtered[ i ] )
		}
	}
	
	var interval= $glob().top.setInterval( tracking, 50 )

	$domReady.then(function(){
		if( $support.eventModel() === 'w3c' ){
			$glob().top.clearInterval( interval )
		}
		attachIfLoaded= attach
		tracking()
	})

	if( $support.eventModel() === 'w3c' ){
		var docEl= $Node( $doc().documentElement )
		docEl.listen( 'DOMNodeInserted', function( ev ){
			check4attach([ ev.target ])
		})
		docEl.listen( 'DOMNodeRemoved', function( ev ){
			check4detach([ ev.target ])
		})
	}
	
	this.tagName= $Value( tagName )
	this.factory= $Value( factory )
	this.elements= function( ){
		return elements.slice( 0 )
	}
})

// jam/htmlize/jam+htmlize.jam
with( $jam )
$define
(   '$htmlize'
,   function( ns ){
        if( !/firefox/i.test( navigator.userAgent ) ) return
        $Component( '*', function( node ){
            if( node.namespaceURI !== ns ) return
            var parent= node.parentNode
            var newNode= $doc().createElement( node.nodeName )
            var attrList= node.attributes
            for( var i= 0; i < attrList.length; ++i ){
                var attr= attrList[ i ]
                newNode.setAttribute( attr.nodeName, attr.nodeValue ) 
            }
            var child; while( child= node.firstChild ) newNode.appendChild( child )
            parent.insertBefore( newNode, node )
            parent.removeChild( node )
        })
    }
)

// html/html/html.jam
$jam.$createNameSpace( '$html' )

// html/a/html-a.jam
with( $html )
$Component
(   'a'
,   function( el ){
        var isTarget= ( el.href == $doc().location.href )
        $Node( el ).state( 'target', isTarget )
    }
)

// wc/wc/wc.jam
$jam.$createNameSpace( '$wc' )
with( $wc ) $htmlize( 'https://github.com/nin-jin/wc' )

// jam/log/jam+log.jam
with( $jam )
$define( '$log', new function(){
    var console= $glob().console
    if( !console || !console.log ){
        return function(){
            alert( [].slice.call( arguments ) )
        }
    }
    if( !console.log.apply ){
        return function(){
            console.log( [].slice.call( arguments ) )
        }
    }
    return function(){
        console.log.apply( console, arguments )
    }
})

// wc/demo/wc-demo.jam
with( $wc )
$define( 'demo', $Component( 'wc:demo', function( el ){
    var source= $String( $Node( el ).html() ).tab2space().minimizeIndent().trim( /[\n\r]/ ).$
    $log( 'wc:demo', source )
    
    var elSource= $doc().createElement( 'wc:demo-source' )
    if( 'textContent' in el ) elSource.textContent= source
    else elSource.innerText= source
    
    var elResult= $doc().createElement( 'wc:demo-result' )
    elResult.innerHTML= source
    
    el.innerHTML= ''
    el.appendChild( elResult )
    el.appendChild( elSource )
}))

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

// jam/Thread/jam+Thread.jam
with( $jam )
$define( '$Thread', $Lazy( function(){

    var body= $doc().getElementsByTagName( 'body' )[ 0 ]
    var poolNode= $doc().createElement( 'wc:Thread:pool' )
    poolNode.style.display= 'none'
    body.insertBefore( poolNode, body.firstChild )
        
    var free= []

    return function( proc ){
        return function( ){
            var res
            var self= this
            var args= arguments

            var starter= free.pop()
            if( !starter ){
                var starter= $doc().createElement( 'button' )
                poolNode.appendChild( starter )
            }
            
            starter.onclick= function( ev ){
                ( ev || $glob().event ).cancelBubble= true
                res= proc.apply( self, args )
            }
            starter.click()

            free.push( starter )
            return res
        }
    }

}))

// wc/test-js/wc-test-js.jam
with( $wc )
$Component( 'wc:test-js', function( root ){
    root= $Node( root )
    
    var exec= $Thread( function( source ){
        passed( 'wait' )
        var proc= new Function( '_done', $String( source ).$ )
        proc( _done )
        return true
    })

    var source= $String( root.text() )
    source.tab2space().minimizeIndent().trim( /[\n\r]/ )
    
    var nodeSource= $Node( 'wc:test-js_source' )
    nodeSource.text( source )
    root.clear().tail( nodeSource )
    
    nodeSource
    .editable( true )
    
    var _done=
    $Poly
    (   function( ){
            if( passed() === 'wait' ) passed( true )
        }
    ,   function( val ){
            if( passed() === 'wait' ) passed( Boolean( val ) )
            printValue( val )
        }
    ,   function( a, b ){
            if( passed() === 'wait' ) passed( a === b )
            printValue( a )
            if( a !== b ) printValue( b )
        }
    )

    var passed=
    $Poly
    (   function( ){
            return root.state( 'passed' )
        }
    ,   function( val ){
            root.state( 'passed', val )
        }
    )
    
    var timeout=
    function( ){
        return Number( root.state( 'timeout' ) )
    }

    var print=
    function( val ){
        var node= $Node( 'wc:test-js_result' )
        node.text( val )
        root.tail( node )
    }
    
    var printValue=
    function( val ){
        if( typeof val === 'function' ){
            if( !val.hasOwnProperty( 'toString' ) ){
                print( 'Function: [object Function]' )
                return
            }
        }
        print( $classOf( val ) + ': ' + val )
    }
    
    if( !exec( source ) ) passed( false )
    if( timeout() ){
        $schedule( timeout(), function( ){
            if( passed() !== 'wait' ) return
            passed( false )
            print( 'Timeout! (' + timeout() + ')' )
        })
    } else {
        if( passed() === 'wait' ) passed( false )
    }
    
})

// doc/doc/doc.jam
$jam.$createNameSpace( '$doc' )
with( $doc ) $htmlize( 'https://github.com/nin-jin/doc' )

// jam/Hash/jam+Hash.jam
with( $jam )
$define
(   '$Hash'
,   $Class( function( klass ){
        klass.create= function( arg ){
            var obj= new klass
            if( arg && ( 'prefix' in arg ) ) obj.prefix= arg.prefix
            else obj.prefix= ( arg && arg.ns || '' ) + ':'
            obj.data= $Obj( arg && arg.data || {} )
            return obj
        }
        !function( proto ){
            proto.key2field= function( key ){
                return this.prefix + key
            }
            proto.has= function( key ){
                key= this.key2field( key )
                return this.data.has( key )
            }
            proto.get= function( key ){
                key= this.key2field( key )
                return this.data.get( key )
            }
            proto.put= function( key, value ){
                key= this.key2field( key )
                return this.data.put( key, value )
            }
        }( klass.prototype )
    })
)

// jam/Cached/jam+Cached.jam
with( $jam )
$define
(	'$Cached'
,	function( func ){
		var cache= $Hash()
		return function( key ){
			if( cache.has( key ) ) return cache.get( key )
			var value= func.apply( this, arguments )
			cache.put( key, value )
			return value 
		}
	}
)

// jam/RegExp/jam+RegExp.jam
with( $jam )
$define
(   '$RegExp'
,   $Class( function( klass, proto ){
    
        klass.create=
        function( regexp ){
            if( $classOf( regexp ) === 'Object' ){
                regexp= RegExp( regexp.source, regexp.mods )
            }
            var obj= new klass
            obj.$= new RegExp( regexp )
            return obj
        }
        
        klass.encode=
        new function( ){
            var specChars = '^({[\\.?+*]})$'
            var specRE= RegExp( specChars.replace(/./g, '\\$' + '1'), 'g' )
            var encodeChar= function( symb ){
                return '\\' + symb
            }
            return function( str ){
                return $String( str ).replace( specRE, encodeChar ).$
            }
        }

        proto.source=
        function(){
            return this.$.source
        }

        proto.count=
        new function( ){
            var offset= /^$/.exec( '' ).length
            return function( ){
                return RegExp( '^$|' + this.$.source ).exec( '' ).length - offset
            }
        }

    })
)

// jam/Lexer/jam+Lexer.jam
with( $jam )
$define
(   '$Lexer'
,   function( lexems ){
        if( !lexems ) throw new Error( 'lexems is required' )
    
        var nameList= []
        var regexpList= []
        var sizeList= []
    
        for( var name in lexems ){
            var regexp= $RegExp( lexems[ name ] )
            nameList.push( name )
            regexpList.push( regexp.source() )
            sizeList.push( regexp.count() )
        }
        
        var regexp= RegExp( '([\\s\\S]*?)((' + regexpList.join( ')|(' ) + ')|$)', 'g' )
    
        return $Class( function( klass, proto ){
            
            klass.create= function( str ){
                var obj= new klass
                obj.string= String( str )
                obj.position= 0
                return obj
            }
            
            proto.next=
            function(){
                regexp.lastIndex= this.position
                var found= regexp.exec( this.string )
                var prefix= found[1]
                if( prefix ){
                    this.position+= prefix.length
                    this.name= ''
                    this.found= prefix
                    this.chunks= [ prefix ]
                    return this
                } else if( found[ 2 ] ){
                    this.position+= found[ 2 ].length
                    var offset= 4
                    for( var i= 0; i < sizeList.length; ++i ){
                        var size= sizeList[ i ]
                        if( found[ offset - 1 ] ){
                            this.name= nameList[ i ]
                            this.found= found[2]
                            this.chunks= found.slice( offset, offset + size )
                            return this
                        }
                        offset+= size + 1
                    }
                    throw new Error( 'something wrong' )
                } else {
                    delete this.name
                    delete this.found
                    delete this.chunks
                    return this
                }
            }
            
        })
    }
)

// jam/Number/jam+Number.jam
with( $jam )
$define
(   '$Number'
,   $Class( function( klass, proto ){
    
        klass.create=
        function( data ){
            var obj= new klass
            obj.$= Number( data )
            return obj
        }
        
        proto.valueOf=
        function( ){
            return this.$
        }

    })
)

// jam/Pipe/jam+Pipe.jam
with( $jam )
$define( '$Pipe', new function(){
	var simple= function( data ){
		return data
	}
	return function( ){
		var list= arguments
		var len= list.length
		if( len === 1 ) return list[0]
		if( len === 0 ) return simple
		return function(){
			if( !arguments.length ) arguments.length= 1
			for( var i= 0; i < len; ++i ) arguments[0]= list[ i ].apply( this, arguments )
			return arguments[0]
		}
	}
})

// jam/Throttler/jam+Throttler.js
with( $jam )
$define
(	'$Throttler'
,	function( latency, func ){
		var stop
		return function(){
			if( stop ) stop= stop()
			stop= $schedule( latency, func )
		}
	}
)

