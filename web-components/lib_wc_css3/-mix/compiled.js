;// jam/jam/jam.jam
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
$jam.$jam= $jam

;// jam/define/jam+define.jam
with( $jam )
$jam.$define=
function( key, value ){
    if( this[ key ] && ( this[ key ] !== value ) ){
        throw new Error( 'Redeclaration of [' + key + ']' )
    }
    this[ key ]= value
    return this
}

;// jam/Value/jam+Value.jam
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

;// jam/glob/jam+glob.jam
with( $jam )
$jam.$glob= $Value( this )

;// jam/createNameSpace/wc+createNameSpace.jam
with( $jam )
$define( '$createNameSpace', function( name ){
    var proxy= function(){}
    proxy.prototype= this
    var ns= new proxy
    $define.call( $glob(), name, ns )
    ns.$define( name, ns )
    return ns
})

;// wc/wc/wc.jam
$jam.$createNameSpace( '$wc' )

;// jam/switch/jam+switch.jam
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

;// jam/doc/jam+doc.jam
with( $jam )
$define( '$doc', $Value( $glob().document ) )

;// jam/support/jam+support.jam
with( $jam )
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
        
        this.htmlModel= Support( node.namespaceURI !== void 0 ? 'w3c' : 'ms' )
        this.eventModel= Support( 'addEventListener' in node ? 'w3c' : 'ms' )
        this.selectionModel= Support( 'createRange' in $doc() ? 'w3c' : 'ms' )
        this.vml= Support( /*@cc_on!@*/ false )
    }
)

;// jam/schedule/jam+schedule.js
with( $jam )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().setTimeout( proc, timeout )
    return function( ){
        $glob().clearTimeout( timerID )
    }
})

;// jam/domReady/jam+domReady.jam
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

;// jam/Component/jam+Component.jam
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
    ?    $Value( true )
    :    new function(){
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

    var tracking=
    function( ){
        check4attach( nodes )
        check4detach( elements )
    }

    var interval=
    $glob().setInterval( tracking, 200 )

    $domReady.then(function(){
        if( $support.eventModel() === 'w3c' ){
            $glob().clearInterval( interval )
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
                check4detach([ node ])
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

;// jam/Lazy/jam+Lazy.jam
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

;// jam/Class/jam+Class.jam
with( $jam )
$jam.$Class=
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

;// jam/htmlEntities/jam+htmlEntities.jam
with( $jam )
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
with( $jam )
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
with( $jam )
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

;// jam/Hiqus/jam+Hiqus.jam
with( $jam )
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
with( $jam )
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
with( $jam )
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
with( $jam )
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
        $support.eventModel.select
        (   {   'w3c': function( ){
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
with( $jam )
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
                            var event= event.originalEvent || event
                            if( event.type !== self.type() ) return 
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
                    this.$.node.attachEvent( 'on' + this.$.eventName, this.$.internalHandler )
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
with( $jam )
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
        
        proto.childList=
        function( name ){
            var list= this.$.childNodes
            var filtered= []
            
            for( var i= this.head(); i; i= i.next() ){
                if( name && ( i.name() !== name ) ) continue
                filtered.push( i )
            }
            
            return $NodeList( filtered )
        }
        
        proto.descList=
        function( name ){
            var list= this.$.getElementsByTagName( name )
            var filtered= []
            
            for( var i= 0; i < list.length; ++i ){
                filtered.push( list[ i ] )
            }
            
            return $NodeList( filtered )
        }

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

;// jam/Throttler/jam+Throttler.js
with( $jam )
$define
(    '$Throttler'
,    function( latency, func ){
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

;// wc/css3/wc-css3.jam
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
                var node= $Node.parse( '<vml:shape style=" position: absolute; display: block; " />' ).$
                var type= nodeRoot.currentStyle[ '-wc-css3_shapetype' ] || 'wc-css3_roundrect'
                node.setAttribute( 'type', node.type= ( '#' + type ) )
                shaped= true
                return $Value( node )
            })
            
            var nodeStroke= $Lazy( function( ){
                var node= $Node.parse( "<vml:stroke />" ).$
                nodeShape().appendChild( node )
                return $Value( node )
            })
    
            var nodeFill= $Lazy( function( ){
                var node= $Node.parse( "<vml:fill />" ).$
                nodeShape().appendChild( node )
                return $Value( node )
            })
    
            var nodeShadow= $Lazy( function( ){
                var node= $Node.parse( "<vml:shadow />" ).$
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
            (    nodeStroke
            ,    function( back ){ 
                    nodeRoot.style.borderColor= back ? '' : 'transparent'
                }
            )
    
            var fill=
            PropEl
            (    nodeFill
            ,    function( back ){ 
                    nodeRoot.style.background= back ? '' : 'none'
                }
            )
            
            var shadow=
            PropEl
            (    nodeShadow
            ,    function( back ){ 
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
                +    stroke( style[ '-wc-css3_border' ] )
                +    fill( style[ '-wc-css3_background' ] )
                +    shadow( style[ '-wc-css3_box-shadow' ] )
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

;// lib_wc_css3/-mix/compiled.vml.js
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

