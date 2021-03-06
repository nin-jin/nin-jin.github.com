;// jam/jam/jam.jam.js
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}

;// jam/Value/jam+Value.jam.js
$jam.Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam.Value: ' + String( val )
    }
    return value
}

;// jam/glob/jam+glob.jam.js
$jam.glob= $jam.Value( this )

;// jam/define/jam+define.jam.js
$jam.define=
new function( ){

    var Ghost= function(){}
    
    return function( key, value ){
        var keyList= key.split( '.' )
        
        var obj= $jam.glob()
        while( true ){
            key= keyList.shift()
            if( !keyList.length ) break
            
            var next= obj[ key ]
            if( next ){
                obj= next
            } else {
                obj= obj[ key ]= new Ghost
            }
        }
        
        if( key in obj ){
            var val= obj[ key ]
            if(!( val instanceof Ghost )) throw new Error( 'Redeclaration of [' + key + ']' )
            
            for( i in val ){
                if( !val.hasOwnProperty( i ) ) continue
                if( i in value ) throw new Error( 'Redeclaration of [' + i + ']' )
                value[ i ]= val[ i ]
            }
        }
        
        obj[ key ]= value
        
        return this
    }
    
}

;// jam/doc/jam+doc.jam.js
$jam.define( '$jam.doc', $jam.Value( $jam.glob().document ) )

;// jam/schedule/jam+schedule.jam.js
$jam.define
(   '$jam.schedule'
,   function( timeout, proc ){
        var timerID= $jam.glob().setTimeout( proc, timeout )
        return function( ){
            $jam.glob().clearTimeout( timerID )
        }
    }
)

;// jam/domReady/jam+domReady+then.jam.js
$jam.define
(   '$jam.domReady.then'
,   function( proc ){
        var checker= function( ){
            if( $jam.domReady() ) proc()
            else $jam.schedule( 10, checker )
        }
        checker()
    }
)
;// jam/domReady/jam+domReady.jam.js
$jam.define
(   '$jam.domReady'
,   function( ){
        var state= $jam.doc().readyState
        if( state === 'loaded' ) return true
        if( state === 'complete' ) return true
        return false
    }
)

;// jam/switch/jam+switch.jam.js
$jam.define
(   '$jam.switch'
,   function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
)

;// jam/support/jam+support.jam.js
$jam.define
(   '$jam.support'
,   new function(){
        var Support= function( state ){
            var sup= $jam.Value( state )
            sup.select= function( map ){
                return $jam.switch( this(), map )
            }
            return sup
        }
    
        var node= $jam.doc().createElement( 'html:div' )
        
        this.msie= Support( /*@cc_on!@*/ false )
        this.xmlModel= Support( ( $jam.glob().DOMParser && $jam.glob().XSLTProcessor ) ? 'w3c' : 'ms' )
    }
)

;// jam/Component/jam+Component.jam.js
$jam.define
(   '$jam.Component'
,   function( tagName, factory ){
        if(!( this instanceof $jam.Component )) return new $jam.Component( tagName, factory )
        var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
    
        var nodes= $jam.doc().getElementsByTagName( tagName )
    
        var elements= []
        var rootNS=$jam.doc().documentElement.namespaceURI
    
        var checkName=
        ( tagName === '*' )
        ?    $jam.Value( true )
        :    new function(){
                var nameChecker= RegExp( '^' + tagName + '$', 'i' )
                return function checkName_right( el ){
                    var ns= el.namespaceURI
                    if( ns && ns !== rootNS ) return false
                    return nameChecker.test( el.nodeName )
                }
            }
        
        function isAttached( el ){
            return typeof el[ fieldName ] === 'object'
        }
        
        function attach( el ){
    
            el[ fieldName ]= null
            var widget= factory( el )
            el[ fieldName ]= widget || null
            if( widget ) elements.push( el )
        }
        
        function attachIfLoaded( el ){
            var cur= el
            do {
                if( !cur.nextSibling ) continue
                attach( el )
                break
            } while( cur= cur.parentNode )
        }
        
        function dropElement( el ){
            for( var i= 0; i < elements.length; ++i ){
                if( elements[ i ] !== el ) continue
                elements.splice( i, 1 )
                return
            }
        }
        
        function detach( nodeList ){
            for( var i= 0, len= nodeList.length; i < len; ++i ){
                var node= nodeList[ i ]
                var widget= node[ fieldName ]
                if( widget.destroy ) widget.destroy()
                node[ fieldName ]= void 0
                dropElement( node )
            }
        }
        
        function check4attach( nodeList ){
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
    
        function check4detach( nodeList ){
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
    
        function tracking( ){
            check4attach( nodes )
            check4detach( elements )
        }
    
        var interval=
        $jam.glob().setInterval( tracking, 200 )
    
        $jam.domReady.then(function whenReady(){
            $jam.glob().clearInterval( interval )
            attachIfLoaded= attach
            tracking()
        })
    
        var docEl= $jam.doc().documentElement
        docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
            var node= ev.target
            //$jam.schedule( 0, function( ){
                check4attach([ node ])
                if( !$jam.support.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
        docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
            var node= ev.target
            //$jam.schedule( 0, function( ){
                check4detach([ node ])
                if( !$jam.support.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
        
        this.tagName= $jam.Value( tagName )
        this.factory= $jam.Value( factory )
        this.elements=
        function elements( ){
            return elements.slice( 0 )
        }
        
        tracking()
    }
)

;// jam/Class/jam+Class.jam.js
$jam.Class=
function( init ){
    var klass=
    function( ){
        if( this instanceof klass ) return this
        return klass.create.apply( klass, arguments )
    }
    
    klass.constructor= $jam.Class
    
    klass.create=
    function( arg ){
        if( arguments.length ){
            if(( arg === void 0 )||( arg === null )) return arg
            if( arg instanceof klass ) return arg
        }
        var obj= new klass
        return constructor.apply( obj, arguments )
    }
    
    klass.raw=
    function( obj ){
        return ( obj )&&( ( obj instanceof klass ) ? obj.$ : obj )
    }
    
    var proto= klass.prototype
    var constructor= proto.constructor= function( arg ){
        this.$= arg
        return this
    }
    
    init( klass, proto )
    
    constructor= klass.prototype.constructor
    klass.prototype.constructor= klass
    
    return klass
}

;// jam/Poly/jam+Poly.jam.js
$jam.define
(   '$jam.Poly'
,   function(){
        var map= arguments
        return function(){
            return map[ arguments.length ].apply( this, arguments )
        }
    }
)

;// jam/htmlEntities/jam+htmlEntities.jam.js
$jam.define
(   '$jam.htmlEntities'
,   {    'nbsp': ' '
    ,    'amp':  '&'
    ,    'lt':   '<'
    ,    'gt':   '>'
    ,    'quot': '"'
    ,    'apos': "'"
    }
)

;// jam/htmlDecode/jam+htmlDecode.jam.js
$jam.define
(   '$jam.htmlDecode'
,   new function(){
        var fromCharCode= $jam.glob().String.fromCharCode
        var parseInt= $jam.glob().parseInt
        var replacer= function( str, isHex, numb, name ){
            if( name ) return $jam.htmlEntities[ name ] || str
            if( isHex ) numb= parseInt( numb, 16 )
            return fromCharCode( numb )
        }
        return function( str ){
            return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
        }
    }
)

;// jam/html2text/jam+html2text.jam.js
$jam.define
(   '$jam.html2text'
,   function( html ){
        return $jam.htmlDecode
        (   String( html )
            .replace( /<div><br[^>]*>/gi, '\n' )
            .replace( /<br[^>]*>/gi, '\n' )
            .replace( /<div>/gi, '\n' )
            .replace( /<[^<>]+>/g, '' )
        )
    }
)

;// jam/classOf/jam+classOf.jam.js
$jam.define
(   '$jam.classOf'
,   new function( ){
        var toString = {}.toString
        return function( val ){
            if( val === void 0 ) return 'Undefined'
            if( val === null ) return 'Null'
            if( val === $jam.glob() ) return 'Global'
            return toString.call( val ).replace( /^\[object |\]$/g, '' )
        }
    }
)

;// jam/Hiqus/jam+Hiqus.jam.js
$jam.define
(   '$jam.Hiqus'
,   $jam.Class( function( klass, proto ){
        
        proto.constructor=
        $jam.Poly
        (   function( ){
                return klass({ })
            }
        ,   function( hiqus ){
                this.$= {}
                this.$.splitterChunks= hiqus.splitterChunks || '&'
                this.$.splitterPair= hiqus.splitterPair || '='
                this.$.splitterKeys= hiqus.splitterKeys || '_'
                this.$.data= hiqus.data || {}
                return this
            }
        )
        
        proto.get=
        $jam.Poly
        (   function( ){
                return this.get( [] )
            }
        ,   function( keyList ){
                if( $jam.classOf( keyList ) === 'String' ){
                    keyList= keyList.split( this.splitterKeys )
                }
                var cur= this.$.data
                for( var i= 0; i < keyList.length; ++i ){
                    var key= keyList[ i ]
                    cur= cur[ key ]
                    if( $jam.classOf( cur ) !== 'Object' ) break
                }
                return cur
            }
        )
        
        proto.put=
        $jam.Poly
        (   null
        ,   function( keyList ){
                return this.put( keyList, true )
            }
        ,   function( keyList, value ){
                if( $jam.classOf( keyList ) === 'String' ){
                    var keyListRaw= keyList.split( this.$.splitterKeys )
                    keyList= []
                    for( var i= 0; i < keyListRaw.length; ++i ){
                        if( !keyListRaw[ i ] ) continue
                        keyList.push( keyListRaw[ i ] )
                    }
                }
                var cur= this.$.data
                for( var i= 0; i < keyList.length - 1; ++i ){
                    var key= keyList[ i ]
                    if( $jam.classOf( cur[ key ] ) === 'Object' ){
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
        function( json ){
            if( $jam.classOf( json ) === 'String' ){
                var chunks= json.split( this.$.splitterChunks )
                for( var i= 0; i < chunks.length; ++i ){
                    var chunk= chunks[i]
                    if( !chunk ) continue
                    var pair= chunk.split( this.$.splitterPair )
                    if( pair.length > 2 ) continue;
                    var key= pair[ 0 ]
                    var val= pair[ pair.length - 1 ]
                    this.put( key, val )
                }
            } else {
                if( json instanceof klass ) json= json.$.data
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
                merge( json, this.$.data )
            }
            return this
        }
        
        proto.toString=
        $jam.Poly
        (   function( ){
                var chunks=
                function( prefix, obj ){
                    var chunkList= []
                    for( var key in obj ){
                        if( !obj.hasOwnProperty( key ) ) continue
                        var val= obj[ key ]
                        if( val === null ) continue
                        if( prefix ) key= prefix + this.$.splitterKeys + key
                        if( typeof val === 'object' ){
                            chunkList= chunkList.concat( chunks.call( this, key, val ) )
                        } else {
                            if( val === key ) chunkList.push( key )
                            else chunkList.push( key + this.$.splitterPair + val )
                        }
                    }
                    return chunkList
                }
                return chunks.call( this, '', this.$.data ).join( this.$.splitterChunks )
            }
        )
            
    })
)

;// jam/NodeList/jam+NodeList.jam.js
$jam.define
(   '$jam.NodeList'
,   $jam.Class( function( klass, proto ){
        
        proto.get=
        function( index ){
            var node= this.$[ index ]
            return $jam.Node( node )
        }
        
        proto.length=
        function( ){
            return Number( this.$.length )
        }
        
        proto.head=
        function( ){
            return this.get( 0 )
        }
        
        proto.tail=
        function( ){
            return this.get( this.length() - 1 )
        }
        
    })
)

;// jam/raw/jam+raw.jam.js
$jam.define
(   '$jam.raw'
,   function( obj ){
        if( !obj ) return obj
        var klass= obj.constructor
        if( !klass ) return obj
        var superClass= klass.constructor
        if( superClass !== $jam.Class ) return obj
        return klass.raw( obj )
    }
)

;// jam/keyCode/jam+keyCode.jam.js
$jam.keyCode=
new function( ){

    var codes= []
    
    var keyCode= function( code ){
        return codes[ code ] || 'unknown'
    }

    keyCode.ctrlPause= 3
    keyCode.backSpace= 8
    keyCode.tab= 9
    keyCode.enter= 13
    keyCode.shift= 16
    keyCode.ctrl= 17
    keyCode.alt= 18
    keyCode.pause= 19
    keyCode.capsLock= 20
    keyCode.escape= 27
    keyCode.space= 32
    keyCode.pageUp= 33
    keyCode.pageDown= 34
    keyCode.end= 35
    keyCode.home= 36
    keyCode.left= 37
    keyCode.up= 38
    keyCode.right= 39
    keyCode.down= 40
    
    keyCode.insert= 45
    keyCode.delete= 46
    
    for( var code= 48; code <= 57; ++code ){
        keyCode[ String.fromCharCode( code ).toLowerCase() ]= code
    }

    for( var code= 65; code <= 90; ++code ){
        keyCode[ String.fromCharCode( code ).toLowerCase() ]= code
    }

    keyCode.win= 91
    keyCode.context= 93

    for( var numb= 1; numb <= 12; ++numb ){
        keyCode[ 'f' + numb ]= 111 + numb
    }
    
    keyCode.numLock= 144
    keyCode.scrollLock= 145
    
    keyCode.semicolon= 186
    keyCode.plus= 187
    keyCode.minus= 189
    keyCode.comma= 188
    keyCode.period= 190
    keyCode.slash= 191
    keyCode.tilde= 192
    
    keyCode.openBracket= 219
    keyCode.backSlash= 220
    keyCode.closeBracket= 221
    keyCode.apostrophe= 222
    keyCode.backSlashLeft= 226
    
    for( var name in keyCode ){
        if( !keyCode.hasOwnProperty( name ) ) continue
        codes[ keyCode[ name ] ]= name
    }
    
    return keyCode
    
}
;// jam/Event/jam+Event.jam.js
$jam.Event=
$jam.Class( function( klass, proto ){

    proto.constructor=
    $jam.Poly
    (   function( ){
            this.$= $jam.doc().createEvent( 'Event' )
            this.$.initEvent( '', true, true )
            return this
        }
    ,   function( event ){
            this.$= event
            return this
        }
    )
    
    proto.type=
    $jam.Poly
    (   function( ){
            return this.$.type
        }
    ,   function( type ){
            this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
            return this
        }
    )
        
    proto.data=
    $jam.Poly
    (   function( ){
            return this.$.extendedData
        }
    ,   function( data ){
            this.$.extendedData= data
            return this
        }
    )
        
    proto.keyMeta=
    $jam.Poly
    (   function( ){
            return Boolean( this.$.metaKey || this.$.ctrlKey )
        }
    )
    
    proto.keyShift=
    $jam.Poly
    (   function( ){
            return Boolean( this.$.shiftKey )
        }
    )
    
    proto.keyAlt=
    $jam.Poly
    (   function( ){
            return Boolean( this.$.altKey )
        }
    )
    
    proto.keyAccel=
    $jam.Poly
    (   function( ){
            return this.keyMeta() || this.keyShift() || this.keyAlt()
        }
    )
    
    proto.keyCode=
    $jam.Poly
    (   function( ){
            var code= this.$.keyCode
            var keyCode= new Number( code )
            keyCode[ $jam.keyCode( code ) ]= code
            return keyCode
        }
    )
    
    proto.button=
    function( ){
        return this.$.button
    }
    
    proto.target=
    function( ){
        return this.$.target
    }
    
    proto.wheel=
    $jam.Poly
    (   function( ){
            if( this.$.wheelDelta ) return - this.$.wheelDelta / 120 
            return this.$.detail / 4
        }
    ,   function( val ){
            this.$.wheelDelta= - val * 120
            return this
        }
    )
    
    proto.defaultBehavior=
    $jam.Poly
    (   function( ){
            return Boolean( this.$.defaultPrevented )
        }
    ,   function( val ){
            if( val ) this.$.returnValue= !!val
            else this.$.preventDefault()
            return this
        }
    )
    
    proto.scream=
    function( node ){
        $jam.raw( node ).dispatchEvent( this.$ )
        return this
    }
    
})

;// jam/Observer/jam+Observer.jam.js
$jam.define
(   '$jam.Observer'
,   $jam.Class( function( klass, proto ){
        
        proto.constructor=
        function( ){
            this.$= {}
            return this
        }
        
        proto.clone=
        function( ){
            return klass()
            .eventName( this.eventName() )
            .node( this.node() )
            .handler( this.handler() )
        }
        
        proto.eventName=
        $jam.Poly
        (   function( ){
                return this.$.eventName
            }
        ,   function( name ){
                this.sleep()
                this.$.eventName= String( name )
                return this
            }
        )
        
        proto.node=
        $jam.Poly
        (   function( ){
                return this.$.node
            }
        ,   function( node ){
                this.sleep()
                this.$.node= $jam.raw( node )
                return this
            }
        )
        
        proto.handler=
        $jam.Poly
        (   function( ){
                return this.$.handler
            }
        ,   function( handler ){
                var self= this
                this.sleep()
                this.$.handler= handler
                this.$.internalHandler=
                function( event ){
                    return handler.call( self.node(), $jam.Event( event ) )
                }
                return this
            }
        )
        
        proto.listen=
        function( ){
            if( this.$.active ) return this
            this.$.node.addEventListener( this.$.eventName, this.$.internalHandler, false )
            this.$.active= true
            return this
        }
        
        proto.sleep=
        function( ){
            if( !this.$.active ) return this
            this.$.node.removeEventListener( this.$.eventName, this.$.internalHandler, false )
            this.$.active= false
            return this
        }
        
        proto.active=
        $jam.Poly
        (   function( ){
                return Boolean( this.$.active )
            }
        ,   function( val ){
                if( val ) this.listen()
                else this.sleep()
                return this
            }
        )
        
    })
)

;// jam/Node/jam+Node.jam.js
$jam.define
(   '$jam.Node'
,   $jam.Class( function( klass, proto ){
        
        klass.Element=
        function( name ){
            return klass.create( $jam.doc().createElement( name ) )
        }
        
        klass.Text=
        function( str ){
            return klass.create( $jam.doc().createTextNode( str ) )
        }
        
        klass.Comment=
        function( str ){
            return klass.create( $jam.doc().createComment( str ) )
        }
        
        klass.Fragment=
        function( ){
            return klass.create( $jam.doc().createDocumentFragment() )
        }
        
        proto.text=
        $jam.Poly
        (   function( ){
                return $jam.html2text( this.$.innerHTML )
            }
        ,   new function(){
                return function( val ){
                    val= String( val )
                    if( this.text() === val ) return this
                    this.$.textContent= val
                    return this
                }
            }
        )
        
        proto.html=
        $jam.Poly
        (   function( ){
                var val= this.$.innerHTML
                .replace
                (   /<\/?[A-Z]+/g
                ,   function( str ){
                        return str.toLowerCase()
                    }
                )
                return val
            }
        ,   function( val ){
                val= String( val )
                if( this.html() === val ) return this
                this.clear()
                this.$.innerHTML= String( val )
                return this
            }
        )
        
        proto.clear=
        function( ){
            while( true ){
                var child= this.$.firstChild
                if( !child ) break
                this.$.removeChild( child )
            }
            return this
        }
        
        proto.name=
        function( ){
            return this.$.nodeName.toLowerCase()
        }
        
        proto.attr=
        $jam.Poly
        (   null
        ,   function( name ){
                return this.$.getAttribute( name )
            }
        ,   function( name, val ){
                this.$.setAttribute( String( name ), String( val ) )
                this.$.className+= ''
                return this
            }    
        )
        
        proto.state=
        $jam.Poly
        (   function( ){
                return this.param( [] )
            }
        ,   function( key ){
                return $jam.Hiqus({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
            }
        ,   function( key, value ){
                this.$.className= $jam.Hiqus({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
                return this
            }
        )
        
        proto.width=
        function( ){
            if( 'offsetWidth' in this.$ ) return this.$.offsetWidth
            if( 'getBoundingClientRect' in this.$ ){
                var rect= this.$.getBoundingClientRect()
                return rect.right - rect.left
            }
            return 0
        }
        
        proto.height=
        function( ){
            if( 'offsetHeight' in this.$ ) return this.$.offsetHeight
            if( 'getBoundingClientRect' in this.$ ){
                var rect= this.$.getBoundingClientRect()
                return rect.bottom - rect.top
            }
            return 0
        }
        
        proto.posLeft=
        function( ){
            if( 'offsetLeft' in this.$ ) return this.$.offsetLeft
            var rect= this.$.getBoundingClientRect()
            return rect.left
        }
        
        proto.posTop=
        function( ){
            if( 'offsetTop' in this.$ ) return this.$.offsetTop
            var rect= this.$.getBoundingClientRect()
            return rect.top
        }
        
        proto.editable=
        $jam.Poly
        (   function( ){
                var editable= this.$.contentEditable
                if( editable == 'inherit' ) return this.parent().editable()
                return editable == 'true'
            }
        ,   function( val ){
                this.$.contentEditable= val
                return this
            }
        )
        
        proto.ancList=
        function( name ){
            var filtered= []
            var node= this
            do {
                if( name && node.name().replace( name, '' ) ) continue
                filtered.push( node )
            } while( node= node.parent() )
            
            return $jam.NodeList( filtered )
        }
        
        proto.childList=
        function( name ){
            var list= this.$.childNodes
            var filtered= []
            
            for( var i= this.head(); i; i= i.next() ){
                if( name && i.name().replace( name, '' ) ) continue
                filtered.push( i )
            }
            
            return $jam.NodeList( filtered )
        }
        
        proto.descList=
        function( name ){
            var list= this.$.getElementsByTagName( name )
            var filtered= []
            
            for( var i= 0; i < list.length; ++i ){
                filtered.push( list[ i ] )
            }
            
            return $jam.NodeList( filtered )
        }

        proto.parent= 
        $jam.Poly
        (   function( ){
                return $jam.Node( this.$.parentNode )
            }
        ,   function( node ){
                node= $jam.raw( node )
                var parent= this.$.parentNode
                if( node ){
                    if( parent === node ) return this
                    node.appendChild( this.$ )
                } else {
                    if( !parent ) return this
                    parent.removeChild( this.$ )
                }
                return this
            }
        )
        
        proto.ancestor=
        function( name ){
            var current= this
            while( true ){
                if( current.name() === name ) return current
                current= current.parent()
                if( !current ) return current
            }
        }
        
        proto.surround=
        function( node ){
            var node= $jam.raw( node )
            var parent= this.$.parentNode
            var next= this.$.nextSibling
            node.appendChild( this.$ )
            parent.insertBefore( node, next )
            return this
        }
        
        proto.dissolve=
        function( ){
            for( var head; head= this.head(); ){
                this.prev( head )
            }
            //if( this.name() === 'br' ) return this;//this.prev( $jam.Node.Text( '\r\n' ) )
            this.parent( null )
            return this
        }
        
        proto.dissolveTree=
        function( ){
            var endNode= this.follow()
            var curr= this
            while( curr ){
                curr= curr.delve()
                if( !curr ) break;
                if( curr.$ === endNode.$ ) break;
                if( curr.name() === '#text' ) continue;
                var next= curr.delve()
                curr.dissolve()
                curr= next
            }
            return this
        }
        
        proto.head=
        $jam.Poly
        (   function(){
                return $jam.Node( this.$.firstChild )
            }
        ,   function( node ){
                this.$.insertBefore( $jam.raw( node ), this.$.firstChild )
                return this
            }
        )
        
        proto.tail=
        $jam.Poly
        (   function(){
                return $jam.Node( this.$.lastChild )
            }
        ,   function( node ){
                this.$.appendChild( $jam.raw( node ) )
                return this
            }
        )
        
        proto.next=
        $jam.Poly
        (   function(){
                return $jam.Node( this.$.nextSibling )
            }
        ,   function( node ){
                var parent= this.$.parentNode
                var next= this.$.nextSibling
                parent.insertBefore( $jam.raw( node ), next ) 
                return this
            }   
        )
        
        proto.delve=
        function( ){
            return this.head() || this.follow()
        }

        proto.follow=
        function( ){
            var node= this
            while( true ){
                var next= node.next()
                if( next ) return next
                node= node.parent()
                if( !node ) return null
            }
        }

        proto.precede=
        function( ){
            var node= this
            while( true ){
                var next= node.prev()
                if( next ) return next
                node= node.parent()
                if( !node ) return null
            }
        }

        proto.prev=
        $jam.Poly
        (   function(){
                return $jam.Node( this.$.previousSibling )
            }
        ,   function( node ){
                node= $jam.raw( node )
                var parent= this.$.parentNode
                parent.insertBefore( node, this.$ ) 
                return this
            }   
        )
        
        proto.inDom=
        $jam.Poly
        (   function( ){
                var doc= node.$.ownerDocument
                var node= this
                while( true ){
                    if( node.$ === doc ) return true
                    node= node.parent()
                    if( !node ) return false
                }
            }
        )
        
        klass.parse=
        new function( ){
            var parent= klass.Element( 'div' )
            return function( html ){
                parent.html( html )
                var child= parent.head()
                if( !child ) return null
                if( !child.next() ) return child
                var fragment= $jam.Node.Fragment()
                while( child= parent.head() ) fragment.tail( child )
                return fragment
            }
        }

        proto.toString=
        new function( ){
            var parent= klass.Element( 'div' )
            return function( ){
                parent.clear().tail( this.cloneTree() )
                return parent.html()
            }
        }
        
        proto.clone=
        function( ){
            return $jam.Node( this.$.cloneNode( false ) )
        }

        proto.cloneTree=
        function( ){
            return $jam.Node( this.$.cloneNode( true ) )
        }
        
        proto.listen=
        function( eventName, handler ){
            return $jam.Observer()
            .eventName( eventName )
            .node( this )
            .handler( handler )
            .listen()
        }

    })
)

;// html/a/html-a.jam.js
$jam.Component
(   'a'
,   function( el ){
        var isTarget= ( el.href == $jam.doc().location.href )
        $jam.Node( el ).state( 'target', isTarget )
    }
)

