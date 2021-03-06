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

;// jam/htmlEscape/jam+htmlEscape.jam.js
$jam.define
(   '$jam.htmlEscape'
,   function( str ){
        return String( str )
        .replace( /&/g, '&amp;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )
        .replace( /"/g, '&quot;' )
        .replace( /'/g, '&apos;' )
    }
)

;// lang/lang/lang.jam.js
this.$lang=
function( name ){
    return $lang[ name ] || $lang.text
}

$lang.text= $jam.htmlEscape
;// lang/Wrapper/lang_Wrapper.jam.js
$lang.Wrapper=
function( name ){
    var prefix= '<' + name + '>'
    var postfix= '</' + name + '>'
    return function( content ){
        return prefix + content + postfix
    }
}

;// jam/Pipe/jam+Pipe.jam.js
$jam.define
(   '$jam.Pipe'
,   new function(){
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
    }
)

;// jam/RegExp/jam+RegExp.jam.js
$jam.define
(   '$jam.RegExp'
,   $jam.Class( function( klass, proto ){
    
        proto.constructor=
        function( regexp ){
            this.$= new RegExp( regexp )
            return this
        }
        
        klass.escape=
        new function( ){
            var encodeChar= function( symb ){
                return '\\' + symb
            }
            var specChars = '^({[\\.?+*]})$'
            var specRE= RegExp( '[' + specChars.replace( /./g, encodeChar ) + ']', 'g' )
            return function( str ){
                return String( str ).replace( specRE, encodeChar )
            }
        }
        
        klass.build=
        function( ){
            var str= ''
            for( var i= 0; i < arguments.length; ++i ){
                var chunk= arguments[ i ]
                if( i % 2 ) chunk= $jam.RegExp.escape( chunk )
                str+= chunk
            }
            return $jam.RegExp( str )
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

;// jam/Lexer/jam+Lexer.jam.js
$jam.define
(   '$jam.Lexer'
,   function( lexems ){
        if( !lexems ) throw new Error( 'lexems is required' )
    
        var nameList= []
        var regexpList= []
        var sizeList= []
    
        for( var name in lexems ){
            var regexp= $jam.RegExp( lexems[ name ] )
            nameList.push( name )
            regexpList.push( regexp.source() )
            sizeList.push( regexp.count() )
        }
        
        var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
        var count= $jam.RegExp(regexp).count()
        
        return $jam.Class( function( klass, proto ){
            
            proto.constructor=
            function( str ){
                this.string= String( str )
                this.position= 0
                return this
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
                } else if( regexp.lastIndex >= this.string.length ){
                    delete this.name
                    delete this.found
                    delete this.chunks
                    return this
                } else {
                //console.log(found,regexp,this.string,count)
                    this.position+= found[count] ? found[count].length : 0
                    this.name= ''
                    this.found= found[count]
                    this.chunks= [ found[count] ]
                    return this
                }
            }
            
        })
    }
)

;// jam/Parser/jam+Parser.jam.js
$jam.define
(    '$jam.Parser'
,    function( syntaxes ){
        var lexems= []
        var handlers= []
        handlers[ '' ]= syntaxes[ '' ] || $jam.Pipe()

        for( var regexp in syntaxes ){
            if( !syntaxes.hasOwnProperty( regexp ) ) continue
            if( !regexp ) continue
            lexems.push( RegExp( regexp ) )
            handlers.push( syntaxes[ regexp ] )
        }
        var lexer= $jam.Lexer( lexems )
        
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

;// jam/Concater/jam+Concater.jam.js
$jam.define
(   '$jam.Concater'
,   function( delim ){
        delim= delim || ''
        return function( list ){
            return list.join( delim )
        }
    }
)

;// lang/Parser/lang_Parser.jam.js
$lang.Parser=
function( map ){
    if( !map[ '' ] ) map[ '' ]= $lang.text
    return $jam.Pipe
    (   $jam.Parser( map )
    ,   $jam.Concater()
    )
}

;// lang/css/lang_css.jam.js
$lang.css=
new function(){
    
    var css=
    function( str ){
        return css.root( css.stylesheet( str ) )
    }
    
    css.root= $lang.Wrapper( 'lang:css' )
    css.remark= $lang.Wrapper( 'lang:css_remark' )
    css.string= $lang.Wrapper( 'lang:css_string' )
    css.bracket= $lang.Wrapper( 'lang:css_bracket' )
    css.selector= $lang.Wrapper( 'lang:css_selector' )
    css.tag= $lang.Wrapper( 'lang:css_tag' )
    css.id= $lang.Wrapper( 'lang:css_id' )
    css.klass= $lang.Wrapper( 'lang:css_class' )
    css.pseudo= $lang.Wrapper( 'lang:css_pseudo' )
    css.property= $lang.Wrapper( 'lang:css_property' )
    css.value= $lang.Wrapper( 'lang:css_value' )
    
    css.stylesheet=
    $lang.Parser( new function( ){
        
        this[ /(\/\*[\s\S]*?\*\/)/.source ]=
        $jam.Pipe( $lang.text, css.remark )
        
        this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
        $jam.Pipe( $lang.text, css.tag )
        
        this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
        $jam.Pipe( $lang.text, css.id )
        
        this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
        $jam.Pipe( $lang.text, css.klass )
        
        this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
        $jam.Pipe( $lang.text, css.pseudo )
        
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
        $jam.Pipe( $lang.text, css.remark )
        
        this[ /([\w-]+\s*:)/.source  ]=
        $jam.Pipe( $lang.text, css.property )
        
        this[ /([^:]+?(?:;|$))/.source ]=
        $jam.Pipe( $lang.text, css.value )
        
    })
    
    return css
}

;// lang/pcre/lang_pcre.jam.js
$lang.pcre=
new function(){

    var pcre=
    function( str ){
        return pcre.root( pcre.content( str ) )
    }

    pcre.root= $lang.Wrapper( 'lang:pcre' )
    pcre.backslash= $lang.Wrapper( 'lang:pcre_backslash' )
    pcre.control= $lang.Wrapper( 'lang:pcre_control' )
    pcre.spec= $lang.Wrapper( 'lang:pcre_spec' )
    pcre.text= $lang.Wrapper( 'lang:pcre_text' )
    
    pcre.content=
    $lang.Parser( new function(){
    
        this[ /\\([\s\S])/.source ]=
        new function( ){
            var backslash= pcre.backslash( '\\' )
            return function( symbol ){
                return backslash + pcre.spec( $lang.text( symbol ) )
            }
        }

        this[ /([(){}\[\]$*+?^])/.source ]=
        $jam.Pipe( $lang.text, pcre.control )
        
    })
    
    return pcre
}

;// lang/js/lang_js.jam.js
$lang.js=
new function(){

    var js=
    function( str ){
        return js.root( js.content( str ) )
    }

    js.root= $lang.Wrapper( 'lang:js' )
    js.remark= $lang.Wrapper( 'lang:js_remark' )
    js.string= $lang.Wrapper( 'lang:js_string' )
    js.internal= $lang.Wrapper( 'lang:js_internal' )
    js.external= $lang.Wrapper( 'lang:js_external' )
    js.keyword= $lang.Wrapper( 'lang:js_keyword' )
    js.number= $lang.Wrapper( 'lang:js_number' )
    js.regexp= $lang.Wrapper( 'lang:js_regexp' )
    js.bracket= $lang.Wrapper( 'lang:js_bracket' )
    js.operator= $lang.Wrapper( 'lang:js_operator' )
         
    js.content=
    $lang.Parser( new function(){
    
        this[ /(\/\*[\s\S]*?\*\/)/.source ]=
        $jam.Pipe( $lang.text, js.remark )
        this[ /(\/\/[^\n]*)/.source ]=
        $jam.Pipe( $lang.text, js.remark )
        
        this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
        $jam.Pipe( $lang.text, js.string )
        this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
        $jam.Pipe( $lang.text, js.string )
        
        this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
        $jam.Pipe( $lang.pcre, js.regexp )
        
        this[ /\b(_[\w$]*)\b/.source ]=
        $jam.Pipe( $lang.text, js.internal )
        
        this[ /(\$[\w$]*)(?![\w$])/.source ]=
        $jam.Pipe( $lang.text, js.external )

        this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
        $jam.Pipe( $lang.text, js.keyword )
        
        this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
        $jam.Pipe( $lang.text, js.number )
        
        this[ /([(){}\[\]])/.source ]=
        $jam.Pipe( $lang.text, js.bracket )
        
        this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
        $jam.Pipe( $lang.text, js.operator )
        
    })
    
    return js
}

;// lang/php/lang_php.jam.js
$lang.php=
new function( ){

    var php=
    function( str ){
        return php.root( php.content( str ) )
    }

    php.root= $lang.Wrapper( 'lang:php' )
    php.dollar= $lang.Wrapper( 'lang:php_dollar' )
    php.variable= $lang.Wrapper( 'lang:php_variable' )
    php.string= $lang.Wrapper( 'lang:php_string' )
    php.number= $lang.Wrapper( 'lang:php_number' )
    php.func= $lang.Wrapper( 'lang:php_func' )
    php.keyword= $lang.Wrapper( 'lang:php_keyword' )
    
    php.content=
    $lang.Parser( new function(){
        
        this[ /\b(__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
        $jam.Pipe( $lang.text, php.keyword )
        
        this[ /(\$)(\w+)\b/.source ]=
        function( dollar, variable ){
            dollar= $lang.php.dollar( dollar )
            variable= $lang.php.variable( variable )
            return dollar + variable
        }
        
        this[ /(\w+)(?=\s*\()/.source ]=
        php.func
        
        this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
        this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
        $jam.Pipe( $lang.text, php.string )
        
        this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
        $jam.Pipe( $lang.text, php.number )
        
    })
    
    return php
}

;// lang/sgml/lang_sgml.jam.js
$lang.sgml=
new function(){

    var sgml=
    function( str ){
        return sgml.root( sgml.content( str ) )
    }

    sgml.root= $lang.Wrapper( 'lang:sgml' )
    sgml.tag= $lang.Wrapper( 'lang:sgml_tag' )
    sgml.tagBracket= $lang.Wrapper( 'lang:sgml_tag-bracket' )
    sgml.tagName= $lang.Wrapper( 'lang:sgml_tag-name' )
    sgml.attrName= $lang.Wrapper( 'lang:sgml_attr-name' )
    sgml.attrValue= $lang.Wrapper( 'lang:sgml_attr-value' )
    sgml.comment= $lang.Wrapper( 'lang:sgml_comment' )
    sgml.decl= $lang.Wrapper( 'lang:sgml_decl' )
    
    sgml.tag=
    $jam.Pipe
    (   $lang.Parser( new function(){
        
            this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
            function( bracket, tagName ){
                return sgml.tagBracket( $lang.text( bracket ) ) + sgml.tagName( tagName )
            } 
            
            this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
            this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
            function( prefix, name, sep, open, value, close ){
                name= sgml.attrName( name )
                value= sgml.attrValue( open + $lang.css.style( value ) + close )
                return prefix + name + sep + value
            }

            this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
            this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
            function( prefix, name, sep, open, value, close ){
                name= sgml.attrName( name )
                value= sgml.attrValue( open + $lang.js( value ) + close )
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
    ,   $lang.Wrapper( 'lang:sgml_tag' )
    )

    sgml.content=
    $lang.Parser( new function(){
    
        this[ /(<!--[\s\S]*?-->)/.source ]=
        $jam.Pipe( $lang.text, sgml.comment )
        
        this[ /(<![\s\S]*?>)/.source ]=
        $jam.Pipe( $lang.text, sgml.decl )
        
        this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
        function( prefix, content, postfix ){
            prefix= $lang.sgml.tag( prefix )
            postfix= $lang.sgml.tag( postfix )
            content= $lang.css( content )
            return prefix + content + postfix
        }
        
        this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
        function( prefix, content, postfix ){
            prefix= $lang.sgml.tag( prefix )
            postfix= $lang.sgml.tag( postfix )
            content= $lang.js( content )
            return prefix + content + postfix
        }
        
        this[ /(<[^>]+>)/.source ]=
        sgml.tag
        
    })
    
    return sgml
}

;// lang/tags/lang_tags.jam.js
$jam.define
(    '$lang.tags'
,    new function(){
        
        var tags=
        function( str ){
            return tags.root( tags.content( str ) )
        }
        
        tags.root= $lang.Wrapper( 'lang:tags' )
        tags.item= $lang.Wrapper( 'lang:tags_item' )
        
        tags.content=
        $lang.Parser( new function(){
        
            this[ /^(\s*?)([^\n\r]+)(\s*?)$/.source ]=
            function( open, text, close ){
                return open + '<a href="?gist/list/' + $jam.htmlEscape( text ) + '">' + tags.item( text ) + '</a>' + close
            }
            
        })
        
        return tags
    }
) 

;// lang/md/lang_md.jam.js
$lang.md=
new function(){

    var md=
    function( str ){
        return md.root( md.content( str ) )
    }

    md.root= $lang.Wrapper( 'lang:md' )

    md.header1= $lang.Wrapper( 'lang:md_header-1' )
    md.header2= $lang.Wrapper( 'lang:md_header-2' )
    md.header3= $lang.Wrapper( 'lang:md_header-3' )
    md.header4= $lang.Wrapper( 'lang:md_header-4' )
    md.header5= $lang.Wrapper( 'lang:md_header-5' )
    md.header6= $lang.Wrapper( 'lang:md_header-6' )
    md.headerMarker= $lang.Wrapper( 'lang:md_header-marker' )

    md.quote= $lang.Wrapper( 'lang:md_quote' )
    md.quoteMarker= $lang.Wrapper( 'lang:md_quote-marker' )

    md.quoteInline= $lang.Wrapper( 'lang:md_quote-inline' )
    md.quoteInlineMarker= $lang.Wrapper( 'lang:md_quote-inline-marker' )

    md.image= $lang.Wrapper( 'lang:md_image' )
    md.imageHref= $lang.Wrapper( 'lang:md_image-href' )

    md.embed= $lang.Wrapper( 'lang:md_embed' )
    md.embedHref= $lang.Wrapper( 'lang:md_embed-href' )

    md.link= $lang.Wrapper( 'lang:md_link' )
    md.linkMarker= $lang.Wrapper( 'lang:md_link-marker' )
    md.linkTitle= $lang.Wrapper( 'lang:md_link-title' )
    md.linkHref= $lang.Wrapper( 'lang:md_link-href' )

    md.author= $lang.Wrapper( 'lang:md_author' )
    md.indent= $lang.Wrapper( 'lang:md_indent' )

    md.escapingMarker= $lang.Wrapper( 'lang:md_escaping-marker' )

    md.emphasis= $lang.Wrapper( 'lang:md_emphasis' )
    md.emphasisMarker= $lang.Wrapper( 'lang:md_emphasis-marker' )

    md.strong= $lang.Wrapper( 'lang:md_strong' )
    md.strongMarker= $lang.Wrapper( 'lang:md_strong-marker' )

    md.super= $lang.Wrapper( 'lang:md_super' )
    md.superMarker= $lang.Wrapper( 'lang:md_super-marker' )

    md.sub= $lang.Wrapper( 'lang:md_sub' )
    md.subMarker= $lang.Wrapper( 'lang:md_sub-marker' )

    md.math= $lang.Wrapper( 'lang:md_math' )
    md.remark= $lang.Wrapper( 'lang:md_remark' )

    md.table= $lang.Wrapper( 'lang:md_table' )
    md.tableRow= $lang.Wrapper( 'lang:md_table-row' )
    md.tableCell= $lang.Wrapper( 'lang:md_table-cell' )
    md.tableMarker= $lang.Wrapper( 'lang:md_table-marker' )

    md.code= $lang.Wrapper( 'lang:md_code' )
    md.codeMarker= $lang.Wrapper( 'lang:md_code-marker' )
    md.codeLang= $lang.Wrapper( 'lang:md_code-lang' )
    md.codeContent= $lang.Wrapper( 'lang:md_code-content' )

    md.html= $lang.Wrapper( 'lang:md_html' )
    md.htmlTag= $lang.Wrapper( 'lang:md_html-tag' )
    md.htmlContent= $lang.Wrapper( 'lang:md_html-content' )

    md.para= $lang.Wrapper( 'lang:md_para' )

    md.inline=
    $lang.Parser( new function(){

        // indentation
        // ^\s+
        this[ /^(\s+)/.source ]=
        md.indent
        
        // math
        //  123 
        this[ /([0-9∅‰∞∀∃∫√×±≤+−≥≠<>%])/.source ]=
        md.math
        
        // escaping
        // ** // ^^ __ [[ ]]
        this[ /(\*\*|\/\/|\^\^|__|\[\[|\]\]|\\\\)/.source ]=
        function( symbol ){
            return md.escapingMarker( symbol[0] ) + symbol[1]
        }
    
        // hyper link
        // \\title\http://example.org/\
        this[ /(\\)(.*?)(\\)((?:(?:https?|ftps?|mailto|magnet):[^\0]*?|[^:]*?(?:[\/\?].*?)?))(\\)/.source ]=
        function( open, title, middle, href, close ){
            var uri= href
            open= md.linkMarker( open )
            middle= md.linkMarker( middle )
            close= md.linkMarker( close )
            href= title ? md.linkHref( href ) : md.linkTitle( href )
            title= md.linkTitle( md.inline( title ) )
            return md.link( '<a href="' + $jam.htmlEscape( uri ) + '">' + open + title + middle + href + close + '</a>' )
        }
        
        // image
        // [url]
        this[ /(\[)([^\[\]]+)(\])/.source ]=
        function( open, href, close ){
            return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.htmlEscape( href ) + '"><object data="' + $jam.htmlEscape( href ) + '"></object></a>' )
        }
    
        // emphasis
        // /some text/
        this[ /([^\s"({[]\/)/.source ]=
        $lang.text
        this[ /(\/)([^\/\s](?:[\s\S]*?[^\/\s])?)(\/)(?=[\s,.:;!?")}\]]|$)/.source ]=
        function( open, content, close ){
            open = md.emphasisMarker( open )
            close = md.emphasisMarker( close )
            content= md.inline( content )
            return md.emphasis( open + content + close )
        }
    
        // strong
        // *some text*
        this[ /([^\s"({[]\*)/.source ]=
        $lang.text            
        this[ /(\*)([^\*\s](?:[\s\S]*?[^\*\s])?)(\*)(?=[\s,.:;!?")}\]]|$)/.source ]=
        function( open, content, close ){
            open = md.strongMarker( open )
            close = md.strongMarker( close )
            content= md.inline( content )
            return md.strong( open + content + close )
        }
    
        // ^super text^
        this[ /(\^)([^\^\s](?:[\s\S]*?[^\^\s])?)(\^)(?=[\s,.:;!?")}\]√_]|$)/.source ]=
        function( open, content, close ){
            open = md.superMarker( open )
            close = md.superMarker( close )
            content= md.inline( content )
            return md.super( open + content + close )
        }
    
        // _sub text_
        this[ /(_)([^_\s](?:[\s\S]*?[^_\s])?)(_)(?=[\s,.:;!?")}\]\^]|$)/.source ]=
        function( open, content, close ){
            open = md.subMarker( open )
            close = md.subMarker( close )
            content= md.inline( content )
            return md.sub( open + content + close )
        }
    
        // "inline quote"
        // «inline quote»
        this[ /(")([^"\s](?:[\s\S]*?[^"\s])?)(")(?=[\s,.:;!?)}\]]|$)/.source ]=
        this[ /(«)([\s\S]*?)(»)/.source ]=
        function( open, content, close ){
            open = md.quoteInlineMarker( open )
            close = md.quoteInlineMarker( close )
            content= md.inline( content )
            return md.quoteInline( open + content + close )
        }
    
        // remark
        // (some text)
        this[ /(\()([\s\S]+?)(\))/.source ]=
        function( open, content, close ){
            content= md.inline( content )
            return md.remark( open + content + close )
        }

    })

    md.content=
    $lang.Parser( new function(){

        // header
        // !!! Title
        this[ /^(!!! )(.*?)$/.source ]=
        function( marker, content ){
            return md.header1( md.headerMarker( marker ) + md.inline( content ) )
        }
        // !!  Title
        this[ /^(!!  )(.*?)$/.source ]=
        function( marker, content ){
            return md.header2( md.headerMarker( marker ) + md.inline( content ) )
        }
        // !   Title
        this[ /^(!   )(.*?)$/.source ]=
        function( marker, content ){
            return md.header3( md.headerMarker( marker ) + md.inline( content ) )
        }

        // block quote
        // >   content
        this[ /^(>   )(.*?)$/.source ]=
        function( marker, content ){
            marker = md.quoteMarker( marker )
            content= md.inline( content )
            return md.quote( marker + content )
        }
        
        // video
        // http://www.youtube.com/watch?v=IGfTPIVb0jQ
        // http://youtu.be/IGfTPIVb0jQ
        this[ /^(http:\/\/www\.youtube\.com\/watch\?v=)(\w+)(.*$\n?)/.source ]=
        this[ /^(http:\/\/youtu.be\/)(\w+)(.*$\n?)/.source ]=
        function( prefix, id, close ){
            var href= md.embedHref( prefix + id + close )
            var uri= 'http://www.youtube.com/embed/' + id
            var embed= md.embed( '<wc:aspect wc:aspect_ratio=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:aspect>' )
            return href + embed
        }
        
        // image
        // http://gif1.ru/gifs/267.gif
        this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
        function( url, close ){
            var href= md.embedHref( url + close )
            url= url.replace( /\xAD/g, '' )
            var embed= md.embed( '<a href="' + $jam.htmlEscape( url ) + '"><image src="' + $jam.htmlEscape( url ) + '" /></a>' )
            return href + embed
        }
    
        // table
        // --
        // | cell 11 | cell 12
        // --
        // | cell 21 | cell 22
        this[ /((?:\n--(?:\n[| ] [^\n]*)*)+)/.source ]=
        function( content ){
            var rows= content.split( /\n--/g )
            rows.shift()
            for( var r= 0; r < rows.length; ++r ){
                var row= rows[ r ]
                var cells= row.split( /\n\| /g )
                cells.shift()
                for( var c= 0; c < cells.length; ++c ){
                    var cell= cells[ c ]
                    cell= cell.replace( /\n  /g, '\n' )
                    cell= md.inline( cell )
                    cell= cell.replace( /\n/g, '\n' + md.tableMarker( '  ' ) )
                    cell= md.tableMarker( '\n| ' ) + cell 
                    cells[ c ]= md.tableCell( cell )
                }
                row= cells.join( '' )
                var rowSep= '<lang:md_table-row-sep><wc:lang-md_table-cell colspan="300">\n--</wc:lang-md_table-cell></lang:md_table-row-sep>'
                rows[ r ]= rowSep + md.tableRow( row )
            }
            content= rows.join( '' )

            return md.table( content )
        }
        
        // source code
        // #lang
        //     some code
        this[ /^(\$)([\w-]+)((?:\n    [^\n]*)*)(?=\n|$)/.source ]=
        function( marker, lang, content ){
            content= content.replace( /\n    /g, '\n' )
            content= $lang( lang )( content )
            content= content.replace( /\n/g, '\n' + md.indent( '    ' ) )
            content= md.codeContent( content )
            marker= md.codeMarker( marker )
            lang= md.codeLang( lang )
            return md.code( marker + lang + content )
        }
        
        // simple paragraph
        this[ /^(    .*)$/.source ]=
        function( content ){
            return md.para( md.inline( content ) )
        }
        
    })
    
    return md
} 

;// jam/Throttler/jam+Throttler.jam.js
$jam.define
(    '$jam.Throttler'
,    function( latency, func ){
        var self
        var arg
        var stop
        return function(){
            self= this
            arg= arguments
            if( stop ) return
            stop= $jam.schedule( latency, function(){
                stop= null
                func.apply( self, arg )
            })
        }
    }
)

;// jam/eventEdit/jam+eventEdit.jam.js
$jam.define
(   '$jam.eventEdit'
,   new function(){
        
        var scream=
        $jam.Throttler
        (   50
        ,   function( target ){
                $jam.Event().type( '$jam.eventEdit' ).scream( target )
            }
        )

        var handler=
        function( event ){
            if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
            if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
            scream( event.target() )
        }

        var node=
        $jam.Node( $jam.doc().documentElement )
        
        node.listen( 'keyup', handler )
        node.listen( 'cut', handler )
        node.listen( 'paste', handler )

    }
)

;// jam/eventCommit/jam+eventCommit.jam.js
$jam.define
(   '$jam.eventCommit'
,   new function(){
        var handler=
        function( event ){
            if( !event.keyMeta() ) return
            if( event.keyShift() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
            event.defaultBehavior( false )
            $jam.Event().type( '$jam.eventCommit' ).scream( event.target() )
        }
        
        $jam.Node( $jam.doc().documentElement )
        .listen( 'keydown', handler )
    }
)

;// wc/net-bridge/wc_net-bridge.jam.js
$jam.Component
(   'wc:net-bridge'
,   function( nodeRoot ){
        nodeRoot= $jam.Node( nodeRoot )
        nodeRoot.listen
        (   '$jam.eventEdit'
        ,   function( ){
                var text= $jam.html2text( nodeRoot.html() )
                nodeRoot.state( 'modified', text !== textLast )
            }
        )
        
        nodeRoot.listen
        (   '$jam.eventEdit'
        ,   $jam.Throttler
            (   5000
            ,   save
            )
        )
        
        nodeRoot.listen
        (   '$jam.eventCommit'
        ,   save
        )
        
        var textLast= $jam.html2text( nodeRoot.html() )
        function save( ){
            var text= $jam.html2text( nodeRoot.html() )
            if( text === textLast ) return
            
            var xhr= new XMLHttpRequest
            xhr.open( text ? 'PUT' : 'DELETE', nodeRoot.attr( 'wc:net-bridge_resource' ) )
            xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
            xhr.send( nodeRoot.attr( 'wc:net-bridge_field' ) + '=' + encodeURIComponent( text ) )
            textLast= text
            nodeRoot.state( 'modified', false )
        }
        
        return new function( ){
        }
    }
)

;// jam/String/jam+String.jam.js
$jam.define
(   '$jam.String'
,   $jam.Class( function( klass, proto ){
    
        proto.constructor=
        function( data ){
            this.$= String( $jam.raw( data ) || '' )
            return this
        }
        
        proto.incIndent=
        $jam.Poly
        (   function( ){
                this.$= this.$.replace( /^/mg, '    ' )
                return this
            }
        )

        proto.decIndent=
        $jam.Poly
        (   function( ){
                this.$= this.$.replace( /^    |^\t/mg, '' )
                return this
            }
        )

        proto.minimizeIndent=
        $jam.Poly
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
        $jam.Poly
        (   function( ){
                this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
                return this
            }
        )
        
        proto.trim=
        $jam.Poly
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
        $jam.Poly
        (   null
        ,   function( proc ){
                this.$= proc( this.$ )
                return this
            }
        )
        
        proto.replace=
        $jam.Poly
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
        $jam.Poly
        (   null
        ,   function( count ){
                this.$= Array( count + 1 ).join( this.$ )
                return this
            }
        )
        
        proto.length=
        $jam.Poly
        (   function( ){
                return this.$.length
            }
        )
        
        proto.toString=
        $jam.Poly
        (   function( ){
                return this.$
            }
        )

    })
)

;// jam/selection/jam+selection.jam.js
$jam.define
(  '$jam.selection'
,   function( ){
        return $jam.glob().getSelection()
    }
)

;// jam/DomRange/jam+DomRange.jam.js
$jam.define
(   '$jam.DomRange'
,   $jam.Class( function( klass, proto ){
    
        proto.constructor=
        $jam.Poly
        (   function( ){
                var sel= $jam.selection()
                if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
                else this.$= $jam.doc().createRange()
                return this
            }
        ,   function( range ){
                if( !range ) throw new Error( 'Wrong TextRange object' )
                this.$= klass.raw( range )
                return this
            }
        )
        
        proto.select=
        function( ){
            var sel= $jam.selection()
            sel.removeAllRanges()
            sel.addRange( this.$ )
            return this
        }
        
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
        function( ){
            this.$.deleteContents()
            return this
        }
        
        proto.text=
        $jam.Poly
        (   function( ){
                return $jam.html2text( this.html() )
            }
        ,   function( text ){
                this.html( $jam.htmlEscape( text ) )
                return this
            }
        )
        
        proto.html=
        $jam.Poly
        (   function( ){
                return $jam.Node( this.$.cloneContents() ).toString()
            }
        ,   function( html ){
                var node= html ? $jam.Node.parse( html ).$ : $jam.Node.Text( '' ).$
                this.replace( node )
                return this
            }
        )
        
        proto.replace=
        function( node ){
            node= $jam.raw( node )
            this.dropContents()
            this.$.insertNode( node )
            this.$.selectNode( node )
            return this
        }
        
        proto.ancestorNode=
        function( ){
            return this.$.commonAncestorContainer
        }
        
        proto.compare=
        function( how, range ){
            range= $jam.DomRange( range ).$
            how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
            return range.compareBoundaryPoints( how, this.$ )
        }
        
        proto.hasRange=
        function( range ){
            range= $jam.DomRange( range )
            var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
            var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
            return isAfterStart && isBeforeEnd
        }
        
        proto.equalize=
        function( how, range ){
            how= how.split( 2 )
            var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
            range= $jam.DomRange( range ).$
            this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
            return this
        }
        
        proto.move=
        function( offset ){
            this.collapse2start()
            if( offset === 0 ) return this
            var current= $jam.Node( this.$.startContainer )
            if( this.$.startOffset ){
                var temp= current.$.childNodes[ this.$.startOffset - 1 ]
                if( temp ){
                    current= $jam.Node( temp ).follow()
                } else {
                    offset+= this.$.startOffset
                }
            }
            while( current ){
                if( current.name() === '#text' ){
                    var range= $jam.DomRange().aimNode( current )
                    var length= current.$.nodeValue.length
                    
                    if( !offset ){
                        this.equalize( 'start2start', range )
                        return this
                    } else if( offset > length ){
                        offset-= length
                    } else {
                        this.$.setStart( current.$, offset )
                        return this
                    }
                }
                if( current.name() === 'br' ){
                    if( offset > 1 ){
                        offset-= 1
                    } else {
                        var range= $jam.DomRange().aimNode( current )
                        this.equalize( 'start2end', range )
                        return this
                    }
                }
                current= current.delve()
            }
            return this
        }
        
        proto.clone=
        function( ){
            return $jam.DomRange( this.$.cloneRange() )
        }
        
        proto.aimNodeContent=
        function( node ){
            this.$.selectNodeContents( $jam.raw( node ) )
            return this
        }
        
        proto.aimNode=
        function( node ){
            this.$.selectNode( $jam.raw( node ) )
            return this
        }
        
    })
)

;// wc/editor/wc-editor.jam.js
$jam.Component
(   'wc:editor'
,   function( nodeRoot ){
        return new function( ){
            nodeRoot= $jam.Node( nodeRoot )

            var source= $jam.htmlEscape( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )

            nodeRoot.clear()
            var nodeSource= $jam.Node.parse( '<div class=" wc_editor_content " />' )
            .html( source )
            .parent( nodeRoot )
            
            var sourceLast= ''
            var update= $jam.Throttler( 50, function( ){
                //var source= $jam.String( nodeSource.text() ).replace( /\n?\r?$/, '\n' ).$
                var source= nodeSource.text()
                if( source === sourceLast ) return
                sourceLast= source
                
                source=
                $jam.String( source )
                .process( $lang( nodeRoot.attr( 'wc:editor_hlight' ) ) )
                .replace( /  /g, '\u00A0 ' )
                .replace( /  /g, ' \u00A0' )
                //.replace( /[^\n<>](?:<[^<>]+>)*$/, '$&\n' )
                .replace( /$/, '\n' )
                .replace( /\n/g, '<br/>' )
                .$
                
                var nodeRange= $jam.DomRange().aimNodeContent( nodeSource )
                var startPoint= $jam.DomRange().collapse2start()
                //console.log(nodeRange.html())
                var endPoint= $jam.DomRange().collapse2end()
                var hasStart= nodeRange.hasRange( startPoint )
                var hasEnd= nodeRange.hasRange( endPoint )
                if( hasStart ){
                    var metRange= $jam.DomRange()
                    .equalize( 'end2start', startPoint )
                    .equalize( 'start2start', nodeRange )
                    var offsetStart= metRange.text().length
                }
                if( hasEnd ){
                    var metRange= $jam.DomRange()
                    .equalize( 'end2start', endPoint )
                    .equalize( 'start2start', nodeRange )
                    var offsetEnd= metRange.text().length
                    //console.log(metRange.html(),metRange.text(), offsetEnd)
                }
                //console.log(offsetStart,offsetEnd)
                nodeSource.html( source )
                var selRange= $jam.DomRange()
                if( hasStart ){
                    var startRange= nodeRange.clone().move( offsetStart )
                    selRange.equalize( 'start2start', startRange )
                }
                if( hasEnd ){
                    selRange.equalize( 'end2start', nodeRange.clone().move( offsetEnd ) )
                }
                if( hasEnd || hasEnd ){
                    selRange.select()
                }
                
                //nodeSource.dissolveTree()
                //console.log(source.charCodeAt( source.length -1 ))
                //if( source.charAt( source.length -1 ) !== '\n' ) nodeSource.tail( $jam.Node.Text( '\n' ) )
                //if( !source ) $jam.DomRange().aimNode( nodeSource.head() ).collapse2end().select()
                //if( nodeSource.tail() && nodeSource.tail().name() !== 'br' ) nodeSource.tail( $jam.Node.Element( 'br' ) )
            } )
            
            var onEdit=
            nodeRoot.listen( '$jam.eventEdit', update )
            
            var onEnter=
            nodeRoot.listen( 'keypress', function( event ){
                event= $jam.Event( event )
                if( !event.keyCode().enter ) return
                if( event.keyAccel() ) return
                event.defaultBehavior( false )
                $jam.DomRange().html( '<br/>' ).collapse2end().select()
            })
            
            var onAltSymbol=
            nodeRoot.listen( 'keydown', function( event ){
                event= $jam.Event( event )
                //console.log( event.keyCode() )
                if( !event.keyAlt() ) return
                
                if( event.keyShift() ){
                    var symbolSet= new function( ){
                        this[ '0' ]= '∅' // пустое множество
                        this[ '5' ]= '‰' // промилле
                        this[ '8' ]= '∞' // бесконечность
                        this[ 'a' ]= '∀' // всеобщность
                        this[ 'e' ]= '∃' // существование
                        this[ 's' ]= '∫' // интегралл
                        this[ 'v' ]= '√' // корень
                        this[ 'x' ]= '×' // умножение
                        this[ 'plus' ]= '±' // плюс-минус
                        this[ 'comma' ]= '≤' // не больше
                        this[ 'minus' ]= '−' // минус
                        this[ 'period' ]= '≥' // не меньше
                        this[ 'openBracket' ]= '{'
                        this[ 'closeBracket' ]= '}'
                    }
                } else {
                    var symbolSet= new function( ){
                        this[ '0' ]= '°' // градус
                        this[ '3' ]= '#'
                        this[ '4' ]= '$'
                        this[ 'c' ]= '©' // копирайт
                        this[ 's' ]= '§' // параграф
                        this[ 'plus' ]= '≠' // не равно
                        this[ 'comma' ]= '«' // открывающая кавычка
                        this[ 'minus' ]= '–' // среднее тире
                        this[ 'period' ]= '»' // закрывающая кавычка
                        this[ 'tilde' ]= '\u0301' // ударение
                        this[ 'openBracket' ]= '['
                        this[ 'backSlash' ]= '|'
                        this[ 'closeBracket' ]= ']'
                    }
                }
                
                var symbol= symbolSet[ $jam.keyCode( event.keyCode() ) ]
                if( !symbol ) return
                
                event.defaultBehavior( false )
                $jam.DomRange().text( symbol ).collapse2end().select()
            })
            
            //var onBackspace=
            //nodeRoot.listen( 'keydown', function( event ){
            //    event= $jam.Event( event )
            //    if( event.keyCode() != 8 ) return
            //    if( event.keyAccel() ) return
            //    event.defaultBehavior( false )
            //    var fullRange= $jam.DomRange().aimNodeContent( nodeSource )
            //    var newOffset= fullRange.clone().equalize( 'end2start', $jam.DomRange() ).text().length - 1
            //    if( newOffset < 0 ) newOffset= 0
            //    var range= fullRange.clone().move( newOffset ).equalize( 'end2end', $jam.DomRange() )
            //    range.dropContents()
            //})
            
            var onTab=
            nodeRoot.listen( 'keydown', function( event ){
                event= $jam.Event( event )
                if( !event.keyCode().tab ) return
                if( event.keyAccel() ) return
                event.defaultBehavior( false )
                $jam.DomRange().text( '    ' ).collapse2end().select()
            })
            
            var onLeave=
            nodeSource.listen( 'blur', function( event ){
                $jam.Event().type( '$jam.eventCommit' ).scream( nodeRoot )
            })
            
            var onActivate=
            nodeRoot.listen( 'mousedown', function( event ){
                event= $jam.Event( event )
                if( !event.keyMeta() ) return
                nodeRoot.attr( 'wc:editor_active', true )
                nodeSource.editable( true )
            })
            
            var onDeactivate=
            nodeRoot.listen( 'keydown', function( event ){
                event= $jam.Event( event )
                if( !event.keyCode().escape ) return
                nodeSource.editable( false )
                nodeRoot.attr( 'wc:editor_active', false )
                event.defaultBehavior( false )
            })
            
            this.destroy= function( ){
                onEdit.sleep()
                onLeave.sleep()
            }
            
            $jam.schedule( 0, update )
            nodeRoot.attr( 'wc:editor_inited', true )
        }
    }
)

