;// jam/jam/jam.jam
if( this.$jam$ ) throw new Error( 'Redeclaration of [$jam$]' )
var $jam$= {}
$jam$.$jam$= $jam$

;// jam/define/jam+define.jam
with( $jam$ )
$jam$.$define=
function( key, value ){
    if( this[ key ] && ( this[ key ] !== value ) ){
        throw new Error( 'Redeclaration of [' + key + ']' )
    }
    this[ key ]= value
    return this
}

;// jam/Value/jam+Value.jam
with( $jam$ )
$jam$.$Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam$.$Value: ' + String( val )
    }
    return value
}

;// jam/switch/jam+switch.jam
with( $jam$ )
$define
(   '$switch'
,   function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
)

;// jam/glob/jam+glob.jam
with( $jam$ )
$jam$.$glob= $Value( this )

;// jam/doc/jam+doc.jam
with( $jam$ )
$define( '$doc', $Value( $glob().document ) )

;// jam/support/jam+support.jam
with( $jam$ )
$define
(   '$support'
,   new function(){
        var Support= function( state ){
            var sup= $Value( state )
            sup.select= function( map ){
                return $switch( this(), map )
            }
            return sup
        }
    
        var node= $doc().createElement( 'html:div' )
        
        this.msie= Support( /*@cc_on!@*/ false )
        this.xmlModel= Support( ( $glob().DOMParser && $glob().XSLTProcessor ) ? 'w3c' : 'ms' )
        this.htmlModel= Support( node.namespaceURI !== void 0 ? 'w3c' : 'ms' )
        this.eventModel= Support( 'addEventListener' in node ? 'w3c' : 'ms' )
        this.selectionModel= Support( 'createRange' in $doc() ? 'w3c' : 'ms' )
        this.vml= this.msie
    }
)

;// jam/schedule/jam+schedule.js
with( $jam$ )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().setTimeout( proc, timeout )
    return function( ){
        $glob().clearTimeout( timerID )
    }
})

;// jam/domReady/jam+domReady.jam
with( $jam$ )
$define
(   '$domReady'
,   function( ){
        var state= $doc().readyState
        if( state === 'loaded' ) return true
        if( state === 'complete' ) return true
        return false
    }
)

with( $jam$ )
$domReady.then=
function( proc ){
    var checker= function( ){
        if( $domReady() ) proc()
        else $schedule( 10, checker )
    }
    checker()
}

;// jam/Component/jam+Component.jam
with( $jam$ )
$define( '$Component', function( tagName, factory ){
    if(!( this instanceof $Component )) return new $Component( tagName, factory )
    var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()

    var isBroken= ( $support.htmlModel() === 'ms' )
    var chunks= /(?:(\w+):)?([-\w]+)/.exec( tagName )
    var scopeName= isBroken && chunks && chunks[1] || ''
    var localName= isBroken && chunks && chunks[2] || tagName
    var nodes= $doc().getElementsByTagName( localName )

    var elements= []
    var rootNS=$doc().documentElement.namespaceURI

    var checkName=
    ( tagName === '*' )
    ?    $Value( true )
    :    new function(){
            var nameChecker= RegExp( '^' + localName + '$', 'i' )
            if( isBroken ){
                var scopeChecker= RegExp( '^' + scopeName + '$', 'i' )
                return function checkName_broken( el ){
                    return scopeChecker.test( el.scopeName ) && nameChecker.test( el.nodeName )
                }
            }
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
    $glob().setInterval( tracking, 200 )

    $domReady.then(function whenReady(){
        if( $support.eventModel() === 'w3c' ){
            $glob().clearInterval( interval )
        }
        attachIfLoaded= attach
        tracking()
    })

    if( $support.eventModel() === 'w3c' ){
        var docEl= $doc().documentElement
        docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
            var node= ev.target
            //$schedule( 0, function( ){
                check4attach([ node ])
                if( !$support.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
        docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
            var node= ev.target
            //$schedule( 0, function( ){
                check4detach([ node ])
                if( !$support.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
    }
    
    this.tagName= $Value( tagName )
    this.factory= $Value( factory )
    this.elements=
    function elements( ){
        return elements.slice( 0 )
    }
})

;// jam/Class/jam+Class.jam
with( $jam$ )
$jam$.$Class=
function( init ){
    var klass=
    function( ){
        if( this instanceof klass ) return this
        return klass.create.apply( klass, arguments )
    }
    
    klass.constructor= $Class
    
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

;// jam/Poly/jam+Poly.js
with( $jam$ )
$define
(   '$Poly'
,   function(){
        var map= arguments
        return function(){
            return map[ arguments.length ].apply( this, arguments )
        }
    }
)

;// jam/htmlEntities/jam+htmlEntities.jam
with( $jam$ )
$define
(   '$htmlEntities'
,   {    'nbsp': ' '
    ,    'amp':  '&'
    ,    'lt':   '<'
    ,    'gt':   '>'
    ,    'quot': '"'
    ,    'apos': "'"
    }
)

;// jam/htmlDecode/jam+htmlDecode.jam
with( $jam$ )
$define
(   '$htmlDecode'
,   new function(){
        var fromCharCode= $glob().String.fromCharCode
        var parseInt= $glob().parseInt
        var replacer= function( str, isHex, numb, name ){
            if( name ) return $htmlEntities[ name ] || str
            if( isHex ) numb= parseInt( numb, 16 )
            return fromCharCode( numb )
        }
        return function( str ){
            return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
        }
    }
)

;// jam/html2text/jam+html2text.jam
with( $jam$ )
$define
(   '$html2text'
,   function( html ){
        return $htmlDecode
        (   String( html )
            .replace( /<div><br[^>]*>/gi, '\n' )
            .replace( /<br[^>]*>/gi, '\n' )
            .replace( /<div>/gi, '\n' )
            .replace( /<[^<>]+>/g, '' )
        )
    }
)

;// jam/classOf/jam+classOf.jam
with( $jam$ )
$define( '$classOf', function(){
    var toString = {}.toString
    return function( val ){
        if( val === void 0 ) return 'Undefined'
        if( val === null ) return 'Null'
        if( val === $glob() ) return 'Global'
        return toString.call( val ).replace( /^\[object |\]$/g, '' )
    }
}())

;// jam/Hiqus/jam+Hiqus.jam
with( $jam$ )
$define
(   '$Hiqus'
,   $Class( function( klass, proto ){
        
        proto.constructor=
        $Poly
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
        $Poly
        (   function( ){
                return this.get( [] )
            }
        ,   function( keyList ){
                if( $classOf( keyList ) === 'String' ){
                    keyList= keyList.split( this.splitterKeys )
                }
                var cur= this.$.data
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
        function( json ){
            if( $classOf( json ) === 'String' ){
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
        $Poly
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

;// jam/NodeList/jam+NodeList.jam
with( $jam$ )
$define
(   '$NodeList'
,   $Class( function( klass, proto ){
        
        proto.get=
        function( index ){
            var node= this.$[ index ]
            return $Node( node )
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

;// jam/raw/jam+raw.jam
with( $jam$ )
$define
(   '$raw'
,   function( obj ){
        if( !obj ) return obj
        var klass= obj.constructor
        if( !klass ) return obj
        var superClass= klass.constructor
        if( superClass !== $Class ) return obj
        return klass.raw( obj )
    }
)

;// jam/Event/jam+Event.jam
with( $jam$ )
$define
(   '$Event'
,   $Class( function( klass, proto ){
    
        proto.constructor=
        $Poly
        (   $support.eventModel.select
            (   {   'w3c': function( ){
                        this.$= $doc().createEvent( 'Event' )
                        this.$.initEvent( '', true, true )
                        return this
                    }
                ,   'ms': function( ){
                        this.$= $doc().createEventObject()
                        return this
                    }
                }
            )
        ,   function( event ){
                this.$= event
                return this
            }
        )
        
        proto.type=
        $Poly
        (   function( ){
                return this.$.type
            }
        ,   $support.eventModel.select
            (   {   'w3c': function( type ){
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
            
        proto.data=
        $Poly
        (   function( ){
                return this.$.extendedData
            }
        ,   $support.eventModel.select
            (   {   'w3c': function( data ){
                        this.$.extendedData= data
                        return this
                    }
                ,   'ms': function( data ){
                        this.$.extendedData= data
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
        
        proto.button=
        $support.eventModel.select
        (   {   'w3c': function( ){
                    return this.$.button
                }
            ,   'ms': function( ){
                    return [ 0, 0, 2, 2, 1 ][ this.$.button ]
                }
            }
        )
        
        proto.target=
        $support.eventModel.select
        (   {   'w3c': function( ){
                    return this.$.target
                }
            ,   'ms': function( ){
                    return this.$.srcElement || this.$.target
                }
            }
        )
        
        proto.wheel=
        $Poly
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
        $Poly
        (   function( ){
                return Boolean( this.$.defaultPrevented )
            }
        ,   $support.eventModel.select
            (   {   'w3c': function( val ){
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

        proto.scream=
        $support.eventModel.select
        (   {   'w3c': function( node ){
                    $raw( node ).dispatchEvent( this.$ )
                    return this
                }
            ,   'ms': function( node ){
                    var event= this
                    if( !/^\w+$/.test( event.type() ) ){
                        event= $Event().type( 'beforeeditfocus' )
                        event.$.originalEvent= this.$
                    }
                    $raw( node ).fireEvent( 'on' + event.type(), event.$ )
                }
            }
        )
        
    })
)

;// jam/Observer/jam+Observer.jam
with( $jam$ )
$define
(   '$Observer'
,   $Class( function( klass, proto ){
        
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
        $Poly
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
        $Poly
        (   function( ){
                return this.$.node
            }
        ,   function( node ){
                this.sleep()
                this.$.node= $raw( node )
                return this
            }
        )
        
        proto.handler=
        $Poly
        (   function( ){
                return this.$.handler
            }
        ,   function( handler ){
                var self= this
                this.sleep()
                this.$.handler= handler
                this.$.internalHandler=
                $support.eventModel.select
                (   {   'w3c': function( event ){
                            return handler.call( self.node(), $Event( event ) )
                        }
                    ,   'ms': function( ){
                            var event= $glob().event
                            var orig= event.originalEvent
                            if( orig ){
                                if( !orig.target ) orig.target= event.srcElement
                                event= orig
                            }
                            if( event.type !== self.eventName() ) return
                            return handler.call( self.node(), $Event( event ) )
                        }
                    }
                )
                return this
            }
        )

        proto.listen=
        $support.eventModel.select
        (   {   'w3c': function( ){
                    if( this.$.active ) return this
                    this.$.node.addEventListener( this.$.eventName, this.$.internalHandler, false )
                    this.$.active= true
                    return this
                }
            ,   'ms': function( ){
                    if( this.$.active ) return this
                    var type= this.eventName()
                    if( !/^\w+$/.test( type ) ) type= 'beforeeditfocus'
                    this.$.node.attachEvent( 'on' + type, this.$.internalHandler )
                    this.$.active= true
                    return this
                }
            }
        )
        
        proto.sleep=
        $support.eventModel.select
        (   {   'w3c': function( ){
                    if( !this.$.active ) return this
                    this.$.node.removeEventListener( this.$.eventName, this.$.internalHandler, false )
                    this.$.active= false
                    return this
                }
            ,   'ms': function( ){
                    if( !this.$.active ) return this
                    this.$.node.detachEvent( 'on' + this.$.eventName, this.$.internalHandler )
                    this.$.active= false
                    return this
                }
            }
        )
        
        proto.active=
        $Poly
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

;// jam/Node/jam+Node.jam
with( $jam$ )
$define
(   '$Node'
,   $Class( function( klass, proto ){
        
        klass.Element=
        function( name ){
            return klass.create( $doc().createElement( name ) )
        }
        
        klass.Text=
        function( str ){
            return klass.create( $doc().createTextNode( str ) )
        }
        
        klass.Comment=
        function( str ){
            return klass.create( $doc().createComment( str ) )
        }
        
        klass.Fragment=
        function( ){
            return klass.create( $doc().createDocumentFragment() )
        }
        
        proto.text=
        $Poly
        (   function( ){
                return $html2text( this.$.innerHTML )
            }
        ,   new function(){
                var fieldName= $support.htmlModel.select({ w3c: 'textContent', ms: 'innerText' })
                return function( val ){
                    val= String( val )
                    if( this.text() === val ) return this
                    this.$[ fieldName ]= val
                    return this
                }
            }
        )
        
        proto.html=
        $Poly
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
        $support.htmlModel.select
        (   {   'w3c': function( ){
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
        
        proto.attr=
        $Poly
        (   null
        ,   function( name ){
                return this.$.getAttribute( name )
            }
        ,   function( name, val ){
                this.$.setAttribute( String( name ), String( val ) )
                return this
            }    
        )
        
        proto.state=
        $Poly
        (   function( ){
                return this.param( [] )
            }
        ,   function( key ){
                return $Hiqus({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
            }
        ,   function( key, value ){
                this.$.className= $Hiqus({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
        $Poly
        (   function( ){
                return this.$.contentEditable
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
            
            return $NodeList( filtered )
        }
        
        proto.childList=
        function( name ){
            var list= this.$.childNodes
            var filtered= []
            
            for( var i= this.head(); i; i= i.next() ){
                if( name && i.name().replace( name, '' ) ) continue
                filtered.push( i )
            }
            
            return $NodeList( filtered )
        }
        
        proto.descList=
        $support.htmlModel.select(
        {   'w3c': function( name ){
                var list= this.$.getElementsByTagName( name )
                var filtered= []
                
                for( var i= 0; i < list.length; ++i ){
                    filtered.push( list[ i ] )
                }
                
                return $NodeList( filtered )
            }
        ,   'ms': function( name ){
                var chunks= /(?:(\w+):)?([-\w]+)/.exec( name )
                var scopeName= chunks && chunks[1] || ''
                var localName= chunks && chunks[2] || name
                var list= this.$.getElementsByTagName( localName )

                var filtered= []
                for( var i= 0; i < list.length; ++i ){
                    var node= list[ i ]
                    if( scopeName && ( scopeName !== node.scopeName.toLowerCase() ) ) continue
                    filtered.push( node )
                }
                
                return $NodeList( filtered )
            }
        } )

        proto.parent= 
        $Poly
        (   function( ){
                return $Node( this.$.parentNode )
            }
        ,   function( node ){
                node= $raw( node )
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
            var node= $raw( node )
            var parent= this.$.parentNode
            var next= this.$.nextSibling
            node.appendChild( this.$ )
            parent.insertBefore( node, next )
            return this
        }
        
        proto.head=
        $Poly
        (   function(){
                return $Node( this.$.firstChild )
            }
        ,   function( node ){
                this.$.insertBefore( $raw( node ), this.$.firstChild )
                return this
            }
        )
        
        proto.tail=
        $Poly
        (   function(){
                return $Node( this.$.lastChild )
            }
        ,   function( node ){
                this.$.appendChild( $raw( node ) )
                return this
            }
        )
        
        proto.next=
        $Poly
        (   function(){
                return $Node( this.$.nextSibling )
            }
        ,   function( node ){
                var parent= this.$.parentNode
                var next= this.$.nextSibling
                parent.insertBefore( $raw( node ), next ) 
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
        $Poly
        (   function(){
                return $Node( this.$.previousSibling )
            }
        ,   function( node ){
                node= $raw( node )
                var parent= this.$.parentNode
                parent.insertBefore( node, this.$ ) 
                return this
            }   
        )
        
        proto.inDom=
        $Poly
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
                var fragment= $Node.Fragment()
                while( child= parent.head() ) fragment.tail( child )
                return fragment
            }
        }

        proto.toString=
        new function( ){
            var parent= klass.Element( 'div' )
            return function( ){
                parent.clear().tail( this.clone() )
                return parent.html()
            }
        }
        
        proto.clone=
        function( ){
            return $Node( this.$.cloneNode( false ) )
        }

        proto.cloneTree=
        function( ){
            return $Node( this.$.cloneNode( true ) )
        }
        
        proto.listen=
        function( eventName, handler ){
            return $Observer()
            .eventName( eventName )
            .node( this )
            .handler( handler )
            .listen()
        }

    })
)

;// jam/Lazy/jam+Lazy.jam
with( $jam$ )
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

;// jam/Thread/jam+Thread.jam
with( $jam$ )
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

;// jam/String/jam+String.jam
with( $jam$ )
$define
(   '$String'
,   $Class( function( klass, proto ){
    
        proto.constructor=
        function( data ){
            this.$= String( $raw( data ) || '' )
            return this
        }
        
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

;// jam/eventCommit/jam+eventCommit.jam
with( $jam$ )
$define
(   '$eventCommit'
,   new function(){
        var handler=
        function( event ){
            if( !event.keyMeta() ) return
            if( event.keyShift() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 13 ) return
            $Event().type( '$jam$.$eventCommit' ).scream( event.target() )
        }
        
        $Node( $doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// jam/eventClone/jam+eventClone.jam
with( $jam$ )
$define
(   '$eventClone'
,   new function(){
        var handler=
        function( event ){
            if( !event.keyMeta() ) return
            if( !event.keyShift() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 13 ) return
            $Event().type( '$jam$.$eventClone' ).scream( event.target() )
        }
        
        $Node( $doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// jam/eventDelete/jam+eventDelete.jam
with( $jam$ )
$define
(   '$eventDelete'
,   new function( ){
        var handler=
        function( event ){
            if( !event.keyShift() ) return
            if( event.keyMeta() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 46 ) return
            if( !$glob().confirm( 'Are you sure to delee this?' ) ) return
            $Event().type( '$jam$.$eventDelete' ).scream( event.target() )
        }
        
        $Node( $doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// jam/createNameSpace/jam+createNameSpace.jam
with( $jam$ )
$define( '$createNameSpace', function( name ){
    var ns= {}
    $define.call( $glob(), name, ns )
    $define.call( ns, name, ns )
    return ns
})

;// wc/wc/wc.jam
$jam$.$createNameSpace( '$wc$' )

;// wc/define/wc_define.jam
with( $jam$ )
$wc$.$define= $define

;// jam/htmlEscape/jam+htmlEscape.jam
with( $jam$ )
$define
(   '$htmlEscape'
,   function( str ){
        return String( str )
        .replace( /&/g, '&amp;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )
        .replace( /"/g, '&quot;' )
        .replace( /'/g, '&apos;' )
    }
)

;// wc/lang_text/wc+lang_text.jam
with( $jam$ )
with( $wc$ )
$define
(   '$lang_text'
,   $htmlEscape
)

;// jam/Pipe/jam+Pipe.jam
with( $jam$ )
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

;// jam/RegExp/jam+RegExp.jam
with( $jam$ )
$define
(   '$RegExp'
,   $Class( function( klass, proto ){
    
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
                if( i % 2 ) chunk= $RegExp.escape( chunk )
                str+= chunk
            }
            return $RegExp( str )
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

;// jam/Lexer/jam+Lexer.jam
with( $jam$ )
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
        
        var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($[\r\n]{0,2}))', 'gm' )
        var count= $RegExp(regexp).count()
        
        return $Class( function( klass, proto ){
            
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
                    this.position+= found[count].length
                    this.name= ''
                    this.found= found[count]
                    this.chunks= [ found[count] ]
                    return this
                }
            }
            
        })
    }
)

;// jam/Parser/jam+Parser.jam
with( $jam$ )
$define
(    '$Parser'
,    function( syntaxes ){
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

;// jam/Concater/jam+Concater.jam
with( $jam$ )
$define
(   '$Concater'
,   function( delim ){
        delim= delim || ''
        return function( list ){
            return list.join( delim )
        }
    }
)

;// wc/lang/wc+lang.jam
with( $jam$ )
with( $wc$ )
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

;// wc/lang_pcre/wc+lang_pcre.jam
with( $jam$ )
with( $wc$ )
$define
(    '$lang_pcre'
,    new function(){
    
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
    
            this[ /([(){}\[\]$*+?^])/.source ]=
            $Pipe( $lang_text, pcre.control )
            
        })
        
        return pcre
    }
) 

;// wc/lang_js/wc+lang_js.jam
with( $jam$ )
with( $wc$ )
$define
(    '$lang_js'
,    new function(){
    
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
            
            this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
            $Pipe( $lang_pcre, js.regexp )
            
            this[ /\b(_[\w$]*)\b/.source ]=
            $Pipe( $lang_text, js.internal )
            
            this[ /(\$[\w$]*)(?![\w$])/.source ]=
            $Pipe( $lang_text, js.external )

            this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
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

;// wc/js-test/wc_js-test.jam
with( $jam$ )
with( $wc$ )
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
            
            var source= $String( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
        
            nodeRoot.clear()
            var nodeSource0= $Node.Element( 'wc:js-test_source' ).parent( nodeRoot )
            var nodeSource= $Node.parse( '<wc:editor class=" hlight=js " />' ).text( source ).parent( nodeSource0 )
            var nodeControls= $Node.Element( 'wc:hontrol' ).parent( nodeRoot )
            var nodeClone= $Node.parse( '<wc:hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
            var nodeDelete= $Node.parse( '<wc:hontrol_delete>delete' ).parent( nodeControls )

            var _test= {}
            
            var checkDone= function( ){
                if( passed() !== 'wait' ) throw new Error( 'Test already done' )
            }
            
            _test.ok=
            $Poly
            (   function( ){
                    checkDone()
                    if( passed() === 'wait' ) passed( true )
                }
            ,   function( val ){
                    checkDone()
                    passed( Boolean( val ) )
                    printValue( val )
                    if( !val ) throw new Error( 'Result is empty' )
                }
            ,   function( a, b ){
                    checkDone()
                    passed( a === b )
                    printValue( a )
                    if( a !== b ){
                        printValue( b )
                        throw new Error( 'Results is not equal' )
                    }
                }
            )

            _test.not=
            $Poly
            (   function( ){
                    checkDone()
                    passed( false )
                    throw new Error( 'Test fails' )
                }
            ,   function( val ){
                    checkDone()
                    printValue( val )
                    passed( !val )
                    if( val ) throw new Error( 'Result is not empty' )
                }
            ,   function( a, b ){
                    checkDone()
                    printValue( a )
                    printValue( b )
                    passed( a !== b )
                    if( a == b ) throw new Error( 'Results is equal' )
                }
            )
            
            var stop
            
            var noMoreWait= function( ){
                if( passed() !== 'wait' ) return
                passed( false )
                print( 'Timeout!' )
                stop= null
                throw new Error( 'Timeout!' )
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
                var node= $Node.Element( 'wc:js-test_result' )
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
                for( var i= 0; i < results.length(); ++i ){
                    results.get(i).parent( null )
                }
                passed( 'wait' )
                stop= null
                if( !exec() ) passed( false )
                if(( !stop )&&( passed() === 'wait' )) passed( false )
            }
            
            var clone=
            function( ){
                run()
                var node=
                $Node.Element( 'wc:js-test' )
                .text( nodeSource.text() )
                nodeRoot.prev( node )
            }
            
            var del=
            function( ){
                nodeRoot.parent( null )
            }
            
            run()

            var onCommit=
            nodeRoot.listen( '$jam$.$eventCommit', run )
            
            var onClone=
            nodeRoot.listen( '$jam$.$eventClone', clone )
            
            var onClone=
            nodeRoot.listen( '$jam$.$eventDelete', del )
            
            var onCloneClick=
            nodeClone.listen( 'click', function( event ){
                $Event().type( '$jam$.$eventClone' ).scream( event.target() )
            })
            
            var onDeleteClick=
            nodeDelete.listen( 'click', function( event ){
                $Event().type( '$jam$.$eventDelete' ).scream( event.target() )
            })
            
            this.destroy=
            function( ){
                onCommit.sleep()
                onClone.sleep()
                onCloneClick.sleep()
                onDeleteClick.sleep()
                if( stop ) stop()
                _test.ok= _test.not= $Value()
            }
            
        }
    }
)

;// jam/Obj/jam+Obj.jam
with( $jam$ )
$jam$.$Obj=
$Class( function( klass, proto ){
    
    proto.has=
    function( key ){
        return ( key in this.$ )
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
        if( this.has( key ) ){
            throw new Error( 'Redeclaration of [' + key + ']' )
        }
        this.put( key, value )
        return this
    }
    
    proto.method=
    function( name ){
        var obj= this.$
        return function( ){
            return obj[ name ].apply( obj, arguments )
        }
    }

    proto.init=
    function( init ){
        init( this.$ )
        return this
    }

})

;// jam/Clock/jam+Clock.jam
with( $jam$ )
$define
(   '$Clock'
,   $Class( function( klass, proto ){
        
        proto.constructor=
        function( ){
            this.$= { latency: 0, stopper: null, active: false }
            return this
        }
        
        proto.latency=
        $Poly
        (   function( ){
                return this.$.latency
            }
        ,   function( val ){
                this.stop()
                this.$.latency= Number( val )
                return this
            }
        )
        
        proto.active=
        $Poly
        (   function( ){
                return this.$.active
            }
        ,   function( val ){
                if( val ) this.start()
                else this.stop()
                return this
            }
        )
        
        proto.handler=
        $Poly
        (   function( ){
                return this.$.handler
            }
        ,   function( proc ){
                this.stop()
                this.$.handler= proc
                return this
            }
        )
        
        proto.start=
        function( ){
            if( this.active() ) return this
            this.$.stoper=
            $schedule
            (   this.latency()
            ,   $Obj( this )
                .method( 'tick' )
            )
            this.$.active= true
            return this
        }
        
        proto.stop=
        function( ){
            if( !this.active() ) return this
            this.$.stoper()
            this.$.active= false
            return this
        }
        
        proto.tick=
        function( ){
            var proc= this.$.handler
            proc()
            if( !this.active() ) return
            this.$.active= false
            this.start()
            return this
        }
        
    })
)

;// jam/TaskQueue/jam+TaskQueue.jam
with( $jam$ )
$define
(   '$TaskQueue'
,   $Class( function( klass, proto ){
        
        proto.constructor=
        function( ){
            this.$= {}
            this.$.queue= []
            this.$.clock=
            $Clock()
            .handler( $Obj( this ).method( 'run' ) )
            return this
        }
        
        proto.latency=
        $Poly
        (   function( ){
                return this.$.clock.latency()
            }
        ,   function( val ){
                this.$.clock.latency( val )
                return this
            }
        )
        
        proto.active=
        $Poly
        (   function( ){
                return this.$.clock.active()
            }
        ,   function( val ){
                this.$.clock.active( val )
                return this
            }
        )
        
        proto.run=
        function( ){
            var proc= this.$.queue.shift()
            proc()
            if( !this.$.queue.length ) this.active( false )
            return this
        }
        
        proto.add=
        function( task ){
            this.$.queue.push( task )
            this.active( true )
            return this
        }
        
    })
)

;// wc/js-bench/wc_js-bench.jam
with( $jam$ )
with( $wc$ )
$Component
(   'wc:js-bench_list'
,   new function( ){
        return function( nodeRoot ){
            nodeRoot= $Node( nodeRoot )
            
            var nodeHeader=
            $Node.parse( '<wc:js-bench_header title="ctrl + enter" />' )
            .tail( $Node.parse( '<wc:js-bench_runner>Run ►' ) )
            .tail( $Node.parse( '<wc:js-bench_column>inner (µs)' ) )
            .tail( $Node.parse( '<wc:js-bench_column>outer (µs)' ) )
            
            nodeRoot.head( nodeHeader )

            //var nodeControls= $Node.Element( 'wc:hontrol' ).parent( nodeRoot )
            //var nodeClone= $Node.parse( '<wc:hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
            //var nodeDelete= $Node.parse( '<wc:hontrol_delete>delete' ).parent( nodeControls )

            var refresh=
            function( ){
                var benchList= nodeRoot.childList( 'wc:js-bench' )
                for( var i= 0; i < benchList.length(); ++i ){
                    $Event()
                    .type( '$jam$.$eventCommit' )
                    .scream( benchList.get( i ) )
                }
            }

            var onClick=
            nodeHeader.listen( 'click', refresh )
            
            return new function( ){
                this.destroy=
                function( ){
                    onClick.sleep()
                }
            }

        }
    }
)

with( $jam$ )
with( $wc$ )
$Component
(   'wc:js-bench'
,   new function( ){
    
        var queue=
        $TaskQueue()
        .latency( 100 )
    
        var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
    
        return function( nodeRoot ){

            nodeRoot= $Node( nodeRoot )
            var source= $String( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$

            nodeRoot
            .clear()
            
            var nodeSource=
            $Node.parse( '<wc:js-bench_source><wc:editor class=" hlight=js ">' + $htmlEscape( source ) )
            .parent( nodeRoot )
            
            var nodeInner=
            $Node.parse( '<wc:js-bench_result class=" source=inner " />' )
            .parent( nodeRoot )

            var nodeOuter=
            $Node.parse( '<wc:js-bench_result class=" source=outer " />' )
            .parent( nodeRoot )
            
            nodeRoot.surround( $Node.Fragment() ) // for chrome 12
            
            var calc= $Thread( function( source ){
                var startCompile= new Date
                    var proc= new Function( '', source )
                var endCompile= new Date
                var startExec= new Date
                    proc()
                var endExec= new Date
                return new function( ){
                    this.compile= endCompile.getTime() - startCompile.getTime()
                    this.exec= endExec.getTime() - startExec.getTime()
                }
            })

            var format= function( time ){
                return time.toFixed( 3 )
            }

            var run=
            function( ){
                var source= nodeSource.text()
                var matches= parser.exec( source )
                if( matches ){
                    var prefix= matches[1]
                    var sourceInner= matches[2] + ';'
                    var postfix= matches[3] + ';'
                } else {
                    var prefix= ''
                    var sourceInner= source + ';'
                    var postfix= ''
                }

                var count= 1
                var sourceOuter= prefix + postfix
                if( sourceOuter ){
                    do {
                        sourceOuter+= sourceOuter

                        var time= calc( sourceOuter )
                        if( !time ) break
                        var timeOuter= time
                        count*= 2

                        if( timeOuter.compile > 256 ) break
                        if( timeOuter.exec > 256 ) break
                    } while( true )

                    if( !timeOuter ) timeOuter= {}
                    timeOuter.compile= timeOuter.compile * 1000 / count
                    timeOuter.exec= timeOuter.exec * 1000 / count
                } else {
                    timeOuter= { compile: 0, exec: 0 }
                }
                
                nodeOuter
                .text( format( timeOuter.exec ) )
                .attr( 'title', 'compile: ' + format( timeOuter.compile ) )

                var count= 1
                do {
                    sourceInner+= sourceInner

                    var time= calc( prefix + sourceInner + postfix )
                    if( !time ) break
                    var timeInner= time
                    count*= 2

                    if( timeInner.compile > 256 ) break
                    if( timeInner.exec > 256 ) break
                } while( true )
                
                if( !timeInner ) timeInner= {}
                timeInner.compile= ( timeInner.compile * 1000 - timeOuter.compile ) / count
                timeInner.exec= ( timeInner.exec * 1000 - timeOuter.exec ) / count
                
                nodeInner
                .text( format( timeInner.exec ) )
                .attr( 'title', 'compile: ' + format( timeInner.compile ) )

                nodeRoot.state( 'wait', 'false' )
            }
            
            var schedule=
            function( ){
                if( nodeRoot.state( 'wait' ) === 'true' ) return 
                queue.add( run )
                nodeRoot.state( 'wait', 'true' )
            }
            
            var clone=
            function( ){
                var node=
                $Node.Element( 'wc:js-bench' )
                .text( nodeSource.text() )
                nodeRoot.prev( node )
            }
            
            var onCommit=
            nodeRoot.listen( '$jam$.$eventCommit', schedule )
            
            var onClone=
            nodeRoot.listen( '$jam$.$eventClone', clone )
            
            return new function( ){
                this.destroy=
                function( ){
                    onCommit.sleep()
                    onClone.sleep()
                }
            }

        }
    }
)

