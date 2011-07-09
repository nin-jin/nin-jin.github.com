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

// jam/doc/jam+doc.jam
with( $jam )
$define( '$doc', $Value( $glob().document ) )

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

// jam/htmlize/jam+htmlize.jam
with( $jam )
$define
(   '$htmlize'
,   function( ns ){
        if( !$doc().getElementsByTagNameNS ) return
        $domReady.then( function( ){
            var nodeList= $doc().getElementsByTagNameNS( ns, '*' )
            var node
            while( node= nodeList[0] ){
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
            }
        })
    }
)

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

// html/html/html.jam
$jam.$createNameSpace( '$html' )

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
                this.normilizeSpaces()
                var minIndent= 1/0
                this.$.replace( /^( *)[^ \r\n]/mg, function( str, indent ){
                    if( indent.length < minIndent ) minIndent= indent.length
                })
                if( minIndent === 1/0 ) return this
                this.$= this.$.replace( RegExp( '^[ ]{0,' + minIndent + '}', 'mg' ), '' )
                return this
            }
        )

        proto.normilizeSpaces=
        $Poly
        (   function( ){
                this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
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
        
        proto.process=
        $Poly
        (   null
        ,   function( proc ){
                this.$= proc( this.$ )
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
        
        proto.mult=
        $Poly
        (   null
        ,   function( count ){
                this.$= Array( count + 1 ).join( this.$ )
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
            var encodeChar= function( symb ){
                return '\\' + symb
            }
            var specChars = '^({[\\.?+*]})$'
            var specRE= RegExp( '[' + specChars.replace( /./g, encodeChar ) + ']', 'g' )
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

// jam/Parser/jam+Parser.jam
with( $jam )
$define
(	'$Parser'
,	function( syntaxes ){
		var lexems= []
        var handlers= []
		handlers[ '' ]= syntaxes[ '' ] || $Pipe()

		for( var regexp in syntaxes ){
            if( !syntaxes.hasOwnProperty( regexp ) ) continue
			if( !regexp ) continue
			lexems.push( RegExp( regexp ) )
            handlers.push( syntaxes[ regexp ] )
		}
		var lexer= $Lexer( lexems )
		
		return function( str ){
			var res= []
			for( var i= lexer( str ); i.next().found; ){
				var val= handlers[ i.name ].apply( this, i.chunks )
				if( val !== void 0 ) res.push( val )
			}
			return res
		}
	}
)

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

// jam/TemplateFactory/jam+TemplateFactory.jam
with( $jam )
$define
(   '$TemplateFactory'
,   $Class( function( klass, proto ){

        klass.create= function( arg ){
            if( !arg ) arg= {}
            
            var open= arg.tokens && arg.tokens[0] || '{'
            var close= arg.tokens && arg.tokens[1] || '}'
            
            var openEncoded= $RegExp.encode( open )
            var closeEncoded= $RegExp.encode( close )
            
            var Selector= arg.Selector || arg.encoder && klass.Selector( arg.encoder ) || klass.Selector()
    
            var parse= $Parser( new function(){
                this[ $String( openEncoded ).mult( 2 ).$ ]=
                $Value( open )
                
                this[ $String( closeEncoded ).mult( 2 ).$ ]=
                $Value( close )
                
                this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
                Selector
            })
    
            return $Class( function( klass, proto ){
                
                klass.create=
                function( str ){
                    var obj= new klass
                    if( typeof str === 'string' ) obj.struct= parse( str )
                    else obj.struct= str
                    obj.fill( {} )
                    return obj
                }
                
                proto.clone=
                function( ){
                    return klass( this.struct.slice( 0 ) )
                }
                
                proto.fill=
                function( data ){
                    for( var i= 0; i < this.struct.length; ++i ){
                        if( typeof this.struct[ i ] !== 'function' ) continue
                        this.struct[ i ]= this.struct[ i ]( data )
                    }
                    return this
                }
    
                proto.toString=
                function( ){
                    return this.struct.join( '' )
                }
    
            })
        }
        
        klass.Selector=
        $Poly
        (   $Lazy( function( ){
                return $Value( klass.Selector( $Pipe() ) )
            })
        ,   function( proc ){
                return function( str, key ){
                    var selector= function( data ){
                        if( key in data ){
                            return proc( data[ key ] )
                        } else {
                            return selector
                        }
                    }
                    selector.toString= $Value( str )
                    return selector
                }
            }
        )

    })
)

// jam/html/jam+html.jam
with( $jam )
$define
(   '$html'
,   new function(){
    
        this.encode=
        function( str ){
            return $String( str )
            .replace( /&/g, '&amp;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&apos;' )
            .$
        }

        this.decode=
        new function(){
            var fromCharCode= $glob().String.fromCharCode
            var parseInt= $glob().parseInt
            var replacer= function( str, isHex, numb, name ){
                if( name ) return $html.entitiy[ name ] || str
                if( isHex ) numb= parseInt( numb, 16 )
                return fromCharCode( numb )
            }
            return function( str ){
                return $String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer ).$
            }
        }
        
        this.entitiy=
        {	'nbsp': ' '
        ,	'amp':  '&'
        ,	'lt':   '<'
        ,	'gt':   '>'
        ,	'quot': '"'
        ,	'apos': "'"
        }
        
        this.text=
        function( html ){
            return $String( html )
            .replace( /<div><br[^>]*>/gi, '\n' )
            .replace( /<br[^>]*>/gi, '\n' )
            .replace( /<div>/gi, '\n' )
            .replace( /<[^<>]+>/g, '' )
            .process( $html.decode )
            .$
        }
        
        this.Template=
        $TemplateFactory({ encoder: this.encode })
    
    }
)

// jam/switch/jam+switch.jam
with( $jam )
$define
(   '$switch'
,   function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
)

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
        $switch
        (   $support.eventModel()
        ,   {   'w3c': $Poly
                (   function( ){
                        var obj= new klass
                        obj.$= $doc().createEvent( 'Event' )
                        obj.$.initEvent( '', true, true )
                        return obj
                    }
                ,   function( ev ){
                        var obj= new klass
                        obj.$= ev.toEvent ? ev.toEvent() : ev
                        //obj.$.initEvent( ev.type, ev.bubble || true, ev.cancelable || false )
                        return obj
                    }
                )
            ,   'ms': $Poly
                (   function( ){
                        var obj= new klass
                        obj.$= $doc().createEventObject()
                        return obj
                    }
                ,   function( ev ){
                        var obj= new klass.create()
                        obj.$= ev.toEvent ? ev.toEvent() : ev
                        //for( var key in ev ) try {
                        //    obj.$[ key ]= ev[ key ]
                        //} catch( e ){ }
                        if( !obj.$.preventDefault ){
                            obj.$.preventDefault=
                            function( ){
                                this.returnValue= false
                                this.defaultPrevented= true
                            }
                        }
                        return obj
                    }
                )
            }
        )
        
        proto.toEvent=
        $Poly
        (   function(){
                return this.$
            }
        )

        proto.type=
        $Poly
        (   function( ){
                return this.$.type
            }
        ,   $switch
            (   $support.eventModel()
            ,   {   'w3c': function( type ){
                        this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
                        return this
                    }
                ,   'ms': function( type ){
                        this.$.type= type
                        return this
                    }
                }
            )
        )
            
        proto.keyMeta=
        $Poly
        (   function( ){
                return Boolean( this.$.metaKey || this.$.ctrlKey )
            }
        )
        
        proto.keyShift=
        $Poly
        (   function( ){
                return Boolean( this.$.shiftKey )
            }
        )
        
        proto.keyAlt=
        $Poly
        (   function( ){
                return Boolean( this.$.altKey )
            }
        )
        
        proto.keyAccel=
        $Poly
        (   function( ){
                return this.keyMeta() || this.keyShift() || this.keyAlt()
            }
        )
        
        proto.keyCode=
        $Poly
        (   function( ){
                return Number( this.$.keyCode )
            }
        )
        
        proto.target=
        $switch
        (   $support.eventModel()
        ,   {   'w3c': function( ){
                    return this.$.target
                }
            ,   'ms': function( ){
                    return this.$.srcElement
                }
            }
        )
        
        proto.defaultBehavior=
        $Poly
        (   function( ){
                return Boolean( this.$.defaultPrevented )
            }
        ,   $switch
            (   $support.eventModel()
            ,   {   'w3c': function( val ){
                        if( val ) this.$.returnValue= !!val
                        else this.$.preventDefault()
                        return this
                    }
                ,   'ms': function( val ){
                        this.$.returnValue= !!val
                        this.$.defaultPrevented= !val
                        return this
                    }
                }
            )
        )

    })
)

// jam/selection/jam+selection.jam
with( $jam )
$define
(  '$selection'
,   $switch
    (   $support.selectionModel()
    ,   {   'w3c': function( ){
                return $glob().getSelection()
            }
        ,   'ms': function( ){
                return $doc().selection
            }
        }
    )
)

// jam/DomRange/jam+DomRange.jam
with( $jam )
$define
(   '$DomRange'
,   $Class( function( klass, proto ){
    
        klass.create=
        $Poly
        (   $switch
            (   $support.selectionModel()
            ,   {   'w3c': function( ){
                        var sel= $selection()
                        if( sel.rangeCount ) return klass.create( sel.getRangeAt( 0 ).cloneRange() )
                        else return klass.create( $doc().createRange() )
                    }
                ,   'ms': function( ){
                        return klass.create( $selection().createRange() )
                    }
                }
            )
        ,   function( range ){
                if( !range ) throw new Error( 'Wrong TextRange object' )
                if( 'toTextRange' in range ) range= range.toTextRange()
                var obj= new klass
                obj.$= range
                return obj
            }
        )
        
        proto.toTextRange=
        function( ){
            return this.$
        }
        
        proto.select=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( ){
                    var sel= $selection()
                    sel.removeAllRanges()
                    sel.addRange( this.$ )
                    return this
                }
            ,   'ms': function( ){
                    this.$.select()
                    return this
                }
            }
        )
        
            
        proto.collapse2end=
        function( ){
            this.$.collapse( false )
            return this
        }
        
        proto.collapse2start=
        function( ){
            this.$.collapse( true )
            return this
        }
        
        proto.dropContents=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( ){
                    this.$.deleteContents()
                    return this
                }
            ,   'ms': function( ){
                    this.text( '' )
                }
            }
        )

        proto.text=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': $Poly
                (   function( ){
                        return this.$.toString()
                    }
                ,   function( text ){
                        this.html( $html.encode( text ) )
                        return this
                    }
                )
            ,   'ms': $Poly
                (   function( ){
                        return $html.text( this.html() )
                        return this.$.text
                    }
                ,   function( text ){
                        this.$.text= text
                        return this
                    }
                )
            }
        )

        proto.html=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': $Poly
                (   function( ){
                        return $dom.serialize( this.$.cloneContents() )
                    }
                ,   function( html ){
                        this.dropContents()
                        var node= $dom.parse( html )
                        this.$.insertNode( node )
                        this.$.selectNode( node )
                        return this
                    }
                )
            ,   'ms': $Poly
                (   function( ){
                        return this.$.htmlText
                    }
                ,   function( html ){
                        this.$.pasteHTML( html )
                        return this
                    }
                )
            }
        )
    
        proto.ancestorNode=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( ){
                    return this.$.commonAncestorContainer
                }
            ,   'ms': function( ){
                    return this.$.parentNode
                }
            }
        )
        
        proto.compare=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( how, range ){
                    range= $DomRange( range ).$
                    how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
                    return range.compareBoundaryPoints( how, this.$ )
                }
            ,   'ms':  function( how, range ){
                    range= $DomRange( range ).$
                    how= how.replace( /(\w)(\w+)/g, function( str, first, tail ){
                        return first.toUpperCase() + tail
                    }).replace( '2', 'To' )
                    return range.compareEndPoints( how, this.$ )
                }
            }
        )
        
        proto.hasRange=
        function( range ){
            range= $DomRange( range )
            var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
            var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
            return isAfterStart && isBeforeEnd
        }
    
        proto.equalize=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( how, range ){
                    how= how.split( 2 )
                    var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
                    range= $DomRange( range ).$
                    this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
                    return this
                }
            ,   'ms':  function( how, range ){
                    range= $DomRange( range ).$
                    how= how.replace( /(\w)(\w+)/g, function( str, first, tail ){
                        return first.toUpperCase() + tail
                    }).replace( '2', 'To' )
                    this.$.setEndPoint( how, range )
                    return this
                }
            }
        )
        
        proto.move=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( offset ){
                    this.collapse2start()
                    var current= $Node( this.$.startContainer )
                    if( this.$.startOffset ){
                        var temp= current.$.childNodes[ this.$.startOffset - 1 ]
                        if( temp ){
                            current= $Node( temp ).follow()
                        } else {
                            offset+= this.$.startOffset
                        }
                    }
                    while( current.$ ){
                        if( current.name() === '#text' ){
                            var range= current.outerRange()
                            var length= current.$.nodeValue.length
                            
                            if( !offset ){
                                this.equalize( 'start2start', range )
                                return this
                            } else if( offset >= length ){
                                offset-= length
                            } else {
                                this.$.setStart( current.$, offset )
                                return this
                            }
                        }
                        current.delve()
                    }
                    return this
                }
            ,   'ms': function( offset ){
                    this.$.move( 'character', offset )
                    return this
                }
            }
        )

        proto.clone=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( ){
                    return $DomRange( this.$.cloneRange() )
                }
            ,   'ms': function( ){
                    return $DomRange( this.$.duplicate() )
                }
            }
        )
        
    })
)

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
                        case '#document-fragment':
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
        $Poly
        (   function( ){
                return $html.text( this.$.innerHTML )
            }
        ,   new function(){
                var fieldName= $switch( $support.htmlModel(), { w3c: 'textContent', ms: 'innerText' } )
                return function( val ){
                    if( this.text() === val ) return this
                    this.$[ fieldName ]= $String( val ).$
                    return this
                }
            }
        )
        
        proto.html=
        $Poly
        (   function( ){
                var val= this.$.innerHTML.replace( /<\/?[A-Z]+/g, function( str ){
                    return str.toLowerCase()
                })
                return val
            }
        ,   function( val ){
                if( this.html() === val ) return this
                this.$.innerHTML= ''
                this.tail( $dom.parse( val ) )
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
        (   $switch
            (   $support.htmlModel()
            ,   {   'w3c': function( ){
                        return this.$.nodeName.toLowerCase()
                    }
                ,   'ms': function( ){
                        var scope= this.$.scopeName
                        if( scope === 'HTML' ) scope= ''
                        var name= this.$.nodeName.toLowerCase()
                        return scope ? scope + ':' + name : name
                    }
                }
            )
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
                return this
            }
        )
        
        proto.listen=
        $Poly
        (   null
        ,   null
        ,   $switch
            (   $support.eventModel()
            ,   {   'w3c': function( eventName, proc ){
                        this.$.addEventListener( eventName, proc, false )
                        
                        var self= this
                        return function(){
                            self.$.removeEventListener( eventName, proc, false )
                        }
                    }
                ,   'ms': function( eventName, proc ){
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
                            if( !ev.target ) ev.target= ev.srcElement 
                            proc2( ev )
                        }
                        this.$.attachEvent( 'on' + eventName2, proc3, false )
    
                        var self= this
                        return function(){
                            self.$.detachEvent( 'on' + eventName2, proc3, false )
                        }
                    }
                }
            )
        )
        
        proto.scream=
        $Poly
        (   null
        ,   $switch
            (   $support.eventModel()
            ,   {   'w3c': function( ev ){
                        ev= $Event( ev ).$
                        this.$.dispatchEvent( ev )
                    }
                ,   'ms': function( ev ){
                        ev= $Event( ev ).$
                        var eventName= ev.type
                        if( !/^\w+$/.test( eventName ) ){
                            eventName= 'beforeeditfocus'
                        }
                        ev.originalType= ev.type
                        this.$.fireEvent( 'on' + eventName, ev )
                    }
                }
            )
        )
        
        proto.innerRange=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( ){
                    var range= $DomRange()
                    range.$.selectNodeContents( this.$ )
                    return range.$
                }
            ,   'ms': function( node ){
                    var range= $DomRange()
                    range.$.moveToElementText( this.$ )
                    return range.$
                }
            }
        )
        
        proto.outerRange=
        $switch
        (   $support.selectionModel()
        ,   {   'w3c': function( node ){
                    var range= $DomRange()
                    range.$.selectNode( this.$ )
                    return range.$
                }
            ,   'ms': function( node ){
                    var range= this.innerRange()
                    $log('check this')
                    range.$.expand( 'textedit' )
                    return range.$
                }
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
        
        proto.ensureChild=
        function( name ){
            this.$= this.childList( name )[ 0 ] || $Node( name ).parent( this ).$
            return this
        }
        
        proto.descList=
        function( name ){
            var list= this.$.getElementsByTagName( name )
            var filtered= []
            
            for( var i= 0; i < list.length; ++i ){
                filtered.push( list[ i ] )
            }
            
            return filtered
        }

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
                    if( parent === node ) return this
                    node.appendChild( this.$ )
                } else {
                    if( !parent ) return this
                    parent.removeChild( this.$ )
                }
                return this
            }
        )
        
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
        
        proto.delve=
        $Poly
        (   function( ){
                var child= this.$.firstChild
                if( child ) this.$= child
                else this.follow()
                return this
            }
        )

        proto.follow=
        $Poly
        (   function( ){
                var node= this.$
                while( true ){
                    this.$= node.nextSibling
                    if( this.$ ) return this
                    node= node.parentNode
                    if( !node ) return this
                }
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
        
        proto.inDom=
        $Poly
        (   function( ){
                var node= $Node( this.$ )
                var doc= node.$.ownerDocument
                while( node.parent().$ ){
                    if( node.$ === doc ) return true
                }
                return false
            }
        )
        
    })
)

// html/a/html-a.jam
with( $html )
$Component
(   'a'
,   function( el ){
        var isTarget= ( el.href == $doc().location.href )
        $Node( el ).state( 'target', isTarget )
    }
)

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

// jam/Concater/jam+Concater.jam
with( $jam )
$define
(   '$Concater'
,   function( delim ){
        delim= delim || ''
        return function( list ){
            return list.join( delim )
        }
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

// jam/Thread/jam+Thread.jam
with( $jam )
$define( '$Thread', $Lazy( function(){

    var poolNode= $Lazy( function(){
        var body= $doc().getElementsByTagName( 'body' )[ 0 ]
        var pool= $doc().createElement( 'wc:Thread:pool' )
        pool.style.display= 'none'
        body.insertBefore( pool, body.firstChild )
        return $Value( pool )
    })
        
    var free= []

    return function( proc ){
        return function( ){
            var res
            var self= this
            var args= arguments

            var starter= free.pop()
            if( !starter ){
                var starter= $doc().createElement( 'button' )
                poolNode().appendChild( starter )
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

// jam/body/jam+body.jam
with( $jam )
$define
(   '$body'
,   function( ){
        return $doc().body
    }
)

// jam/eval/jam+eval.jam
with( $jam )
$define
(   '$eval'
,   $Thread(function( source ){
        return $glob().eval( source )
    })
)

// jam/eventCommit/jam+eventCommit.jam
with( $jam )
$define
(   '$eventCommit'
,   new function(){
        $Node( $doc().documentElement )
        .listen( 'keyup', function( event ){
            event= $Event( event )
            if( !event.keyMeta() ) return
            if( event.keyShift() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 13 ) return
            $Node( event.target() ).scream( $Event().type( '$jam.$eventCommit' ) )
        })
    }
)

// jam/eventEdit/jam+eventEdit.jam
with( $jam )
$define
(   '$eventEdit'
,   new function(){
        
        var handler= $Throttler
        (   50
        ,   function( event ){
                event= $Event( event )
                $Node( event.target() ).scream( $Event().type( '$jam.$eventEdit' ) )
            }
        )
        
        var root= $Node( $doc().documentElement )
        
        root.listen( 'keyup', handler )
        root.listen( 'cut', handler )
        root.listen( 'paste', handler )

    }
)

// wc/wc/wc.jam
$jam.$createNameSpace( '$wc' )

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

// wc/demo/wc-demo.jam
with( $wc )
$Component
(   'wc:demo'
,   function( nodeRoot ){
        return new function( ){
            nodeRoot= $Node( nodeRoot )
            
            var nodeResult= $Node( nodeRoot.$ ).ensureChild( 'wc:demo-result' )

            var nodeSource0= $Node( nodeRoot.$ ).ensureChild( 'wc:demo-source' )
            //var nodeSource= $Node( nodeSource0.$ ).ensureChild( 'div' ).editable( true )
            var nodeSource=
            $Node( nodeSource0.$ )
            .ensureChild( 'wc:hlight' )
            .state( 'editable', 'true' )
            .state( 'lang', 'sgml' )
            
            var childList= nodeRoot.childList()
            for( var i= 0; i < childList.length; ++i ){
                var nodeChild= $Node( childList[ i ] )
                if( /^wc:demo-/.test( nodeChild.name() ) ) continue
                nodeSource.tail( nodeChild )
            }
            
            nodeSource.text( $String( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ ) )
            
            var exec= $Thread( function( ){
                var source= $String( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
                //nodeSource.text( source )
                nodeResult.html( source )
                var scripts= nodeResult.descList( 'script' )
                for( var i= 0; i < scripts.length; ++i ){
                    var script= scripts[i]
                    $eval( $Node( script ).text() )
                }
                return true
            })
            
            exec()
        
            var forgetCommits=
            nodeSource.listen
            (   '$jam.$eventCommit'
            ,   function( ev ){
                    exec()
                }
            )
            
            this.destroy=
            function( ){
                forgetCommits()
            }
        }
    }
)

// wc/lang_text/wc+lang_text.jam
with( $wc )
$define
(   '$lang_text'
,   $html.encode
)

// wc/lang/wc+lang.jam
with( $wc )
$define
(   '$lang'
,   new function( ){
        var lang=
        function( name ){
            return this[ '$lang' + '_' + name ] || $lang_text
        }
        
        lang.Wrapper=
        function( name ){
            var prefix= '<' + name + '>'
            var postfix= '</' + name + '>'
            return function( content ){
            	return prefix + content + postfix
            }
        }
        
        lang.Parser=
        function( map ){
            if( !map[ '' ] ) map[ '' ]= $lang_text
            return $Pipe
            (   $Parser( map )
            ,   $Concater()
            )
        }
        
        return lang
    }
)

// wc/hlight/wc-hlight.jam
with( $wc )
$Component
(   'wc:hlight'
,   function( nodeRoot ){
        return new function( ){
            nodeRoot= $Node( nodeRoot )
            var nodeSource= $Node( nodeRoot.$ ).ensureChild( 'div' )
            nodeSource.state( 'wc_hlight_source', 'wc_hlight_source' )
    
            var childList= nodeRoot.childList()
            for( var i= 0; i < childList.length; ++i ){
                var nodeChild= $Node( childList[ i ] )
                if( nodeChild.$ === nodeSource.$ ) continue
                nodeSource.tail( nodeChild )
            }
    
            var hlight= $lang( nodeRoot.state( 'lang' ) )
            var editable= nodeRoot.state( 'editable' )
            
            nodeSource.editable( editable === 'true' )
    
            var update= function( ){
                var source=
                $String( nodeSource.text() )
                .minimizeIndent()
                //.trim( /[\r\n]/ )
                .process( hlight )
                .replace( /  /g, '\u00A0 ' )
                .replace( /  /g, ' \u00A0' )
                .$
                
                var nodeRange= $DomRange( nodeSource.innerRange() )
                var startPoint= $DomRange().collapse2start()
                var endPoint= $DomRange().collapse2end()
                var hasStart= nodeRange.hasRange( startPoint )
                var hasEnd= nodeRange.hasRange( endPoint )
                if( hasStart ){
                    var metRange= $DomRange()
                    .equalize( 'end2start', startPoint )
                    .equalize( 'start2start', nodeRange )
                    var offsetStart= metRange.text().replace( /\r/g, '' ).length
                }
                if( hasEnd ){
                    var metRange= $DomRange()
                    .equalize( 'end2start', endPoint )
                    .equalize( 'start2start', nodeRange )
                    var offsetEnd= metRange.text().replace( /\r/g, '' ).length
                }
                nodeSource.html( source )
                var selRange= $DomRange()
                if( hasStart ){
                    selRange.equalize( 'start2start', nodeRange.clone().move( offsetStart ) )
                }
                if( hasEnd ){
                    selRange.equalize( 'end2start', nodeRange.clone().move( offsetEnd ) )
                }
                selRange.select()
            }
            
            var forgetEdit= nodeRoot.listen
            (   '$jam.$eventEdit'
            ,   update
            )
            
            var forgetEnterKey= nodeRoot.listen
            (   'keypress'
            ,   function( event ){
                    event= $Event( event )
                    if( event.keyCode() != 13 ) return
                    if( event.keyAccel() ) return
                    event.defaultBehavior( false )
                    var range= $DomRange().text( '\n' )
                    range.collapse2end().select()
                }
            )
            
            var forgetTabKey= nodeRoot.listen
            (   'keydown'
            ,   function( event ){
                    event= $Event( event )
                    if( event.keyCode() != 9 ) return
                    if( event.keyAccel() ) return
                    event.defaultBehavior( false )
                    $DomRange().text( '    ' ).collapse2end().select()
                }
            )
            
            this.destroy= function( ){
                forgetEdit()
                forgetEnterKey()
                forgetTabKey()
            }

            update()
            
        }
    }
)

// wc/lang_pcre/wc+lang_pcre.jam
with( $wc )
$define
(	'$lang_pcre'
,	new function(){
    
        var pcre=
        function( str ){
            return pcre.root( pcre.content( str ) )
        }

        pcre.root= $lang.Wrapper( 'wc:lang_pcre' )
        pcre.backslash= $lang.Wrapper( 'wc:lang_pcre-backslash' )
        pcre.control= $lang.Wrapper( 'wc:lang_pcre-control' )
        pcre.spec= $lang.Wrapper( 'wc:lang_pcre-spec' )
        pcre.text= $lang.Wrapper( 'wc:lang_pcre-text' )
        
        pcre.content=
        $lang.Parser( new function(){
        
            this[ /\\([\s\S])/.source ]=
            new function( ){
                var backslash= pcre.backslash( '\\' )
                return function( symbol ){
                    return backslash + pcre.spec( $lang_text( symbol ) )
                }
            }
    
            this[ /([(){}\[\]$^])/.source ]=
            $Pipe( $lang_text, pcre.control )
            
        })
        
        return pcre
    }
) 

// wc/lang_js/wc+lang_js.jam
with( $wc )
$define
(	'$lang_js'
,	new function(){
    
        var js=
        function( str ){
            return js.root( js.content( str ) )
        }

        js.root= $lang.Wrapper( 'wc:lang_js' )
        js.remark= $lang.Wrapper( 'wc:lang_js-remark' )
        js.string= $lang.Wrapper( 'wc:lang_js-string' )
        js.internal= $lang.Wrapper( 'wc:lang_js-internal' )
        js.external= $lang.Wrapper( 'wc:lang_js-external' )
        js.keyword= $lang.Wrapper( 'wc:lang_js-keyword' )
        js.number= $lang.Wrapper( 'wc:lang_js-number' )
        js.regexp= $lang.Wrapper( 'wc:lang_js-regexp' )
        js.bracket= $lang.Wrapper( 'wc:lang_js-bracket' )
        js.operator= $lang.Wrapper( 'wc:lang_js-operator' )
             
        js.content=
        $lang.Parser( new function(){
        
            this[ /(\/\*[\s\S]*?\*\/)/.source ]=
            $Pipe( $lang_text, js.remark )
            this[ /(\/\/[^\n]*)/.source ]=
            $Pipe( $lang_text, js.remark )
            
            this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
            $Pipe( $lang_text, js.string )
            this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
            $Pipe( $lang_text, js.string )
            
            this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/)/.source ]=
            $Pipe( $lang_pcre, js.regexp )
            
            this[ /\b(_[\w$]*)\b/.source ]=
            $Pipe( $lang_text, js.internal )
            
            this[ /(\$[\w$]*)(?![\w$])/.source ]=
            $Pipe( $lang_text, js.external )

            this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document)\b/.source ]=
            $Pipe( $lang_text, js.keyword )
            
            this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
            $Pipe( $lang_text, js.number )
            
            this[ /([(){}\[\]])/.source ]=
            $Pipe( $lang_text, js.bracket )
            
            this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
            $Pipe( $lang_text, js.operator )
            
        })
        
        return js
    }
) 

// wc/js-test/wc_js-test.jam
with( $wc )
$Component
(   'wc:js-test'
,   function( nodeRoot ){
        return new function( ){
            nodeRoot= $Node( nodeRoot )
            
            var exec= $Thread( function( ){
                var source= nodeSource.text()
                var proc= new Function( '_test', source )
                proc( _test )
                return true
            })
        
            var nodeSource0= $Node( nodeRoot.$ ).ensureChild( 'wc:js-test_source' )
            var nodeSource=
            $Node( nodeSource0.$ )
            .ensureChild( 'wc:hlight' )
            .state( 'editable', 'true' )
            .state( 'lang', 'js' )
            
            var childList= nodeRoot.childList()
            for( var i= 0; i < childList.length; ++i ){
                var nodeChild= $Node( childList[ i ] )
                if( /^wc:js-test_/.test( nodeChild.name() ) ) continue
                nodeSource.tail( nodeChild )
            }
            
            nodeSource.text( $String( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ ).$ )

            var _test= {}
            
            _test.ok=
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

            _test.not=
            $Poly
            (   function( ){
                    if( passed() === 'wait' ) passed( false )
                }
            ,   function( val ){
                    if( passed() === 'wait' ) passed( !Boolean( val ) )
                    printValue( val )
                }
            ,   function( a, b ){
                    if( passed() === 'wait' ) passed( a !== b )
                    printValue( a )
                    printValue( b )
                }
            )
            
            var stop
            
            var noMoreWait= function( ){
                if( passed() !== 'wait' ) return
                passed( false )
                print( 'Timeout!' )
                stop= null
            }
            
            _test.deadline=
            $Poly
            (   null
            ,   function( ms ){
                    if( stop ) throw new Error( 'Deadline redeclaration' )
                    stop= $schedule( ms, noMoreWait )
                }
            )
        
            var passed=
            $Poly
            (   function( ){
                    return nodeRoot.state( 'passed' )
                }
            ,   function( val ){
                    nodeRoot.state( 'passed', val )
                }
            )
            
            var print=
            function( val ){
                var node= $Node( 'wc:js-test_result' )
                node.text( val )
                nodeRoot.tail( node )
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
            
            var run=
            function( ){
                var results= nodeRoot.childList( 'wc:js-test_result' )
                for( var i= 0; i < results.length; ++i ){
                    $Node( results[i] ).parent( null )
                }
                passed( 'wait' )
                stop= null
                if( !exec() ) passed( false )
                if(( !stop )&&( passed() === 'wait' )) passed( false )
            }
            
            run()

            var forgetCommit=
            nodeRoot.listen
            (   '$jam.$eventCommit'
            ,   function( ev ){
                    run()
                }
            )
            
            this.destroy=
            function( ){
                forgetCommit()
                if( stop ) stop()
                passed= printValue= $Value()
            }
            
        }
    }
)

// wc/lang_css/wc+lang_css.jam
with( $wc )
$define
(	'$lang_css'
,	new function(){
    
        var css=
        function( str ){
            return css.root( css.stylesheet( str ) )
        }

        css.root= $lang.Wrapper( 'wc:lang_css' )
        css.remark= $lang.Wrapper( 'wc:lang_css-remark' )
        css.string= $lang.Wrapper( 'wc:lang_css-string' )
        css.bracket= $lang.Wrapper( 'wc:lang_css-bracket' )
        css.selector= $lang.Wrapper( 'wc:lang_css-selector' )
        css.tag= $lang.Wrapper( 'wc:lang_css-tag' )
        css.id= $lang.Wrapper( 'wc:lang_css-id' )
        css.klass= $lang.Wrapper( 'wc:lang_css-class' )
        css.pseudo= $lang.Wrapper( 'wc:lang_css-pseudo' )
        css.property= $lang.Wrapper( 'wc:lang_css-property' )
        css.value= $lang.Wrapper( 'wc:lang_css-value' )
             
        css.stylesheet=
        $lang.Parser( new function( ){
        
			this[ /(\/\*[\s\S]*?\*\/)/.source ]=
			$Pipe( $lang_text, css.remark )

			this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
			$Pipe( $lang_text, css.tag )

			this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.id )

			this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.klass )

			this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
            $Pipe( $lang_text, css.pseudo )

			this[ /\{([\s\S]+?)\}/.source ]=
            new function( ){
				var openBracket= css.bracket( '{' )
				var closeBracket= css.bracket( '}' )
				return function( style ){
					style= css.style( style )
					return openBracket + style + closeBracket
				}
			}             
        })
        
        css.style=
        $lang.Parser( new function( ){
                
			this[ /(\/\*[\s\S]*?\*\/)/.source ]=
			$Pipe( $lang_text, css.remark )

			this[ /([\w-]+\s*:)/.source  ]=
			$Pipe( $lang_text, css.property )

			this[ /([^:]+?(?:;|$))/.source ]=
            $Pipe( $lang_text, css.value )
            
        })
        
        return css
    }
) 

// wc/lang_sgml/wc+lang_sgml.jam
with( $wc )
$define
(    '$lang_sgml'
,    new function(){
    
        var sgml=
        function( str ){
            return sgml.root( sgml.content( str ) )
        }

        sgml.root= $lang.Wrapper( 'wc:lang_sgml' )
        sgml.tag= $lang.Wrapper( 'wc:lang_sgml-tag' )
        sgml.tagBracket= $lang.Wrapper( 'wc:lang_sgml-tag-bracket' )
        sgml.tagName= $lang.Wrapper( 'wc:lang_sgml-tag-name' )
        sgml.attrName= $lang.Wrapper( 'wc:lang_sgml-attr-name' )
        sgml.attrValue= $lang.Wrapper( 'wc:lang_sgml-attr-value' )
        sgml.comment= $lang.Wrapper( 'wc:lang_sgml-comment' )
        sgml.decl= $lang.Wrapper( 'wc:lang_sgml-decl' )
        
        sgml.tag=
        $Pipe
        (   $lang.Parser( new function(){
            
                this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
                function( bracket, tagName ){
                    return sgml.tagBracket( $lang_text( bracket ) ) + sgml.tagName( tagName )
                } 
                
                this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
                this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
                function( prefix, name, sep, open, value, close ){
                    name= sgml.attrName( name )
                    value= sgml.attrValue( open + $lang_css.style( value ) + close )
                    return prefix + name + sep + value
                }
    
                this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
                this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
                function( prefix, name, sep, open, value, close ){
                    name= sgml.attrName( name )
                    value= sgml.attrValue( open + $lang_js( value ) + close )
                    return prefix + name + sep + value
                }
    
                this[ /(\s)([a-zA-Z][\w:-]+)(\s*=\s*)("[\s\S]*?")/.source ]=
                this[ /(\s)([a-zA-Z][\w:-]+)(\s*=\s*)('[\s\S]*?')/.source ]=
                function( prefix, name, sep, value ){
                    name= sgml.attrName( name )
                    value= sgml.attrValue( value )
                    return prefix + name + sep + value
                }
            
            })
        ,   $lang.Wrapper( 'wc:lang_sgml-tag' )
        )

        sgml.content=
        $lang.Parser( new function(){
        
            this[ /(<!--[\s\S]*?-->)/.source ]=
            $Pipe( $lang_text, sgml.comment )
            
            this[ /(<![\s\S]*?>)/.source ]=
            $Pipe( $lang_text, sgml.decl )
            
            this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
            function( prefix, content, postfix ){
                prefix= $lang_sgml.tag( prefix )
                postfix= $lang_sgml.tag( postfix )
                content= $lang_css( content )
                return prefix + content + postfix
            }
            
            this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
            function( prefix, content, postfix ){
                prefix= $lang_sgml.tag( prefix )
                postfix= $lang_sgml.tag( postfix )
                content= $lang_js( content )
                return prefix + content + postfix
            }
            
            this[ /(<[^>]+>)/.source ]=
            sgml.tag
		    
        })
        
        return sgml
    }
) 

// wc/ns/wc-ns.jam
$jam.$htmlize( 'https://github.com/nin-jin/wc' )

// doc/doc/doc.jam
$jam.$htmlize( 'https://github.com/nin-jin/doc' )

// doc/-mix/compiled.vml.js
/* include( '../../wc/css3/wc-css3.vml' ); */
try{ document.write("\
<?import namespace=\"vml\" implementation=\"#default#VML\" ?>\
<vml:shapetype\
    xmlns:vml='urn:schemas-microsoft-com:vml'\
    adj='0,0,0,0'\
	id='wc-css3_roundrect'\
	coordorigin='0 0'\
	coordsize='1000000 1000000'\
	stroked='false'\
	filled='false'\
	>\
\
    <vml:formulas>\
        <vml:f eqn='val width'></vml:f> <!-- @0: width -->\
        <vml:f eqn='val height'></vml:f> <!-- @1: height -->\
\
        <vml:f eqn='prod #0 width pixelwidth'></vml:f> <!-- @2: adj0 * width / pixelwidth -->\
        <vml:f eqn='prod #1 width pixelwidth'></vml:f> <!-- @3: adj1 * width / pixelwidth -->\
        <vml:f eqn='prod #2 width pixelwidth'></vml:f> <!-- @4: adj2 * width / pixelwidth -->\
        <vml:f eqn='prod #3 width pixelwidth'></vml:f> <!-- @5: adj3 * width / pixelwidth -->\
\
        <vml:f eqn='prod #0 height pixelheight'></vml:f> <!-- @6: adj0 * height / pixelheight -->\
        <vml:f eqn='prod #1 height pixelheight'></vml:f> <!-- @7: adj1 * height / pixelheight -->\
        <vml:f eqn='prod #2 height pixelheight'></vml:f> <!-- @8: adj2 * height / pixelheight -->\
        <vml:f eqn='prod #3 height pixelheight'></vml:f> <!-- @9: adj3 * height / pixelheight -->\
\
        <vml:f eqn='sum width 0 @3'></vml:f> <!-- @10: width - @3 -->\
        <vml:f eqn='sum width 0 @4'></vml:f> <!-- @11: width - @4 -->\
\
        <vml:f eqn='sum height 0 @8'></vml:f> <!-- @12: height - @8 -->\
        <vml:f eqn='sum height 0 @9'></vml:f> <!-- @13: height - @9 -->\
    </vml:formulas>\
\
	<vml:path v='m @2,0 l @10,0 qx @0,@7 l @0,@12 qy @11,@1 l @5,@1 qx 0,@13 l 0,@6 qy @2,0 xe'></vml:path>\
\
</vml:shapetype>\
") } catch( e ){ }

