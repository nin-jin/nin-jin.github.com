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

;// jam/Hash/jam+Hash.jam
with( $jam$ )
$define
(   '$Hash'
,   $Class( function( klass, proto ){

        proto.constructor=
        $Poly
        (   function( ){
                this.$= { prefix: ':', obj: {} }
                return this
            }
        ,   function( hash ){
                this.$= {}
                this.$.prefix= hash.prefix || ''
                this.$.obj= hash.obj || {}
                return this
            }
        )

        proto.key2field= function( key ){
            return this.$.prefix + key
        }

        proto.has= function( key ){
            key= this.key2field( key )
            return this.$.obj.hasOwnProperty( key )
        }

        proto.get= function( key ){
            key= this.key2field( key )
            return this.$.obj[ key ]
        }

        proto.put= function( key, value ){
            key= this.key2field( key )
            this.$.obj[ key ]= value
            return this
        }

    })
)

;// jam/Cached/jam+Cached.jam
with( $jam$ )
$define
(    '$Cached'
,    function( func ){
        var cache= $Hash()
        return function( key ){
            if( cache.has( key ) ) return cache.get( key )
            var value= func.apply( this, arguments )
            cache.put( key, value )
            return value 
        }
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

;// jam/DOMX/jam+DOMX.jam
with( $jam$ )
$define
(   '$DOMX'
,   $Class( function( klass, proto ){
    
        proto.constructor=
        function( dom ){
            if( dom.toDOMDocument ) dom= dom.toDOMDocument()
            this.$= dom
            return this
        }
        
        proto.toDOMDocument=
        function( ){
            return this.$
        }
        
        proto.toString=
        $support.xmlModel.select(
        {   'w3c': new function( ){
                var serializer= new XMLSerializer
                return function( ){
                    var text= serializer.serializeToString( this.$ )
                    return text
                }
            }
        ,   'ms': function( ){
                return $String( this.$.xml ).trim().$
            }
        })
        
        proto.transform=
        $support.xmlModel.select(
        {   'w3c': function( stylesheet ){
                var proc= new XSLTProcessor
                proc.importStylesheet( $raw( stylesheet ) )
                var doc= proc.transformToDocument( this.$ )
                return $DOMX( doc )
            }
        ,   'ms': function( stylesheet ){
                var text= this.$.transformNode( $raw( stylesheet ) )
                return $DOMX.parse( text )
            }
        })
        
        klass.parse=
        $support.xmlModel.select(
        {   'w3c': new function( ){
                var parser= new DOMParser
                return function( str ){
                    var doc= parser.parseFromString( str, 'text/xml' )
                    return $DOMX( doc )
                }
            }
        ,   'ms': function( str ){
                var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
                doc.async= false
                doc.loadXML( str )
                return $DOMX( doc )
            }
        })

    })
)

;// jam/selection/jam+selection.jam
with( $jam$ )
$define
(  '$selection'
,   $support.selectionModel.select
    (   {   'w3c': function( ){
                return $glob().getSelection()
            }
        ,   'ms': function( ){
                return $doc().selection
            }
        }
    )
)

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

;// jam/log/jam+log.jam
with( $jam$ )
$define( '$log', new function(){
    var console= $glob().console
    if( !console || !console.log ){
        return function(){
            alert( [].slice.call( arguments ) )
        }
    }
    return function(){
        Function.prototype.apply.call( console.log, console, arguments )
    }
})

;// jam/DomRange/jam+DomRange.jam
with( $jam$ )
$define
(   '$DomRange'
,   $Class( function( klass, proto ){
    
        proto.constructor=
        $Poly
        (   $support.selectionModel.select
            (   {   'w3c': function( ){
                        var sel= $selection()
                        if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
                        else this.$= $doc().createRange()
                        return this
                    }
                ,   'ms': function( ){
                        this.$= $selection().createRange()
                        return this
                    }
                }
            )
        ,   function( range ){
                if( !range ) throw new Error( 'Wrong TextRange object' )
                this.$= klass.raw( range )
                return this
            }
        )
        
        proto.select=
        $support.selectionModel.select
        (   {   'w3c': function( ){
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
        $support.selectionModel.select
        (   {   'w3c': function( ){
                    this.$.deleteContents()
                    return this
                }
            ,   'ms': function( ){
                    this.text( '' )
                }
            }
        )

        proto.text=
        $support.selectionModel.select
        (   {   'w3c': $Poly
                (   function( ){
                        return this.$.toString()
                    }
                ,   function( text ){
                        this.html( $htmlEscape( text ) )
                        return this
                    }
                )
            ,   'ms': $Poly
                (   function( ){
                        return $html2text( this.html() )
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
        $support.selectionModel.select
        (   {   'w3c': $Poly
                (   function( ){
                        return $Node( this.$.cloneContents() ).toString()
                    }
                ,   function( html ){
                        this.dropContents()
                        var node= $Node.parse( html ).$
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
        $support.selectionModel.select
        (   {   'w3c': function( ){
                    return this.$.commonAncestorContainer
                }
            ,   'ms': function( ){
                    return this.$.parentNode
                }
            }
        )
        
        proto.compare=
        $support.selectionModel.select
        (   {   'w3c': function( how, range ){
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
        $support.selectionModel.select
        (   {   'w3c': function( how, range ){
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
        $support.selectionModel.select
        (   {   'w3c': function( offset ){
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
                    while( current ){
                        if( current.name() === '#text' ){
                            var range= $DomRange().aimNode( current )
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
                        current= current.delve()
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
        $support.selectionModel.select
        (   {   'w3c': function( ){
                    return $DomRange( this.$.cloneRange() )
                }
            ,   'ms': function( ){
                    return $DomRange( this.$.duplicate() )
                }
            }
        )
        
        proto.aimNodeContent=
        $support.selectionModel.select
        (   {   'w3c': function( node ){
                    this.$.selectNodeContents( $raw( node ) )
                    return this
                }
            ,   'ms': function( node ){
                    this.$.moveToElementText( $raw( node ) )
                    return this
                }
            }
        )
        
        proto.aimNode=
        $support.selectionModel.select
        (   {   'w3c': function( node ){
                    this.$.selectNode( $raw( node ) )
                    return this
                }
            ,   'ms': function( node ){
                    this.aimNodeContent( $raw( node ) )
                    $log('check this')
                    this.$.expand( 'textedit' )
                    return this
                }
            }
        )
        
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

;// jam/Number/jam+Number.jam
with( $jam$ )
$define
(   '$Number'
,   $Class( function( klass, proto ){
    
        proto.constructor=
        function( numb ){
            this.$= Number( numb )
            return this
        }
        
        proto.valueOf=
        function( ){
            return this.$
        }

    })
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

;// jam/TemplateFactory/jam+TemplateFactory.jam
with( $jam$ )
$define
(   '$TemplateFactory'
,   new function( ){

        var factory= function( arg ){
            if( !arg ) arg= {}
            
            var open= arg.tokens && arg.tokens[0] || '{'
            var close= arg.tokens && arg.tokens[1] || '}'
            
            var openEncoded= $RegExp.escape( open )
            var closeEncoded= $RegExp.escape( close )
            
            var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
    
            var parse= $Parser( new function(){
                this[ $String( openEncoded ).mult( 2 ).$ ]=
                $Value( open )
                
                this[ $String( closeEncoded ).mult( 2 ).$ ]=
                $Value( close )
                
                this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
                Selector
            })
    
            return $Class( function( klass, proto ){
                
                proto.constructor=
                function( str ){
                    this.struct= parse( str )
                    this.fill( {} )
                    return this
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
        
        factory.Selector=
        $Poly
        (   $Lazy( function( ){
                return $Value( factory.Selector( $Pipe() ) )
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
        
        return factory

    }
)

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

;// jam/Throttler/jam+Throttler.js
with( $jam$ )
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

;// jam/Tree/jam+Tree.jam
with( $jam$ )
$define
(   '$Tree'
,   $Class( function( $Tree, proto ){
        
        proto.constructor=
        function( data ){
            this.$= data || []
            return this
        }
        
        $Tree.Parser=
        function( syntax ){
            if( !syntax ) syntax= {}
            var lineSep= syntax.lineSep || ';'
            var valSep= syntax.valSep || '='
            var oneIndent= syntax.oneIndent || '+'
            var keySep= syntax.keySep || '_'
            var lineParser= $RegExp.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$

            var parser=
            function( str ){
                var lineList= str.split( lineSep )
                var data= []
                var stack= [ data ]
                
                for( var i= 0; i < lineList.length; ++i ){
                    var line= lineParser.exec( lineList[ i ] )
                    var indentCount= line[1].length / oneIndent.length
                    stack= stack.slice( stack.length - indentCount - 1 )
                    var path= line[2]
                    var val= line[3]
                    var keyList= path.split( keySep )
                    var keyEnd= keyList.pop()
                    var cur= stack[0]
                    if( keyEnd ){
                        keyList.push( keyEnd )
                    } else {
                        stack.unshift( val= [] )
                    }
                    while( keyList.length ){
                        var key= keyList.pop()
                        val= [{ name: key, content: val }]
                    }
                    cur.push( val[0] )
                }
                
                return $Tree( data )
            }
            
            return parser
        }
        
    })
)
;// jam/body/jam+body.jam
with( $jam$ )
$define
(   '$body'
,   function( ){
        return $doc().body
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

;// jam/eval/jam+eval.jam
with( $jam$ )
$define
(   '$eval'
,   $Thread(function( source ){
        return $glob().eval( source )
    })
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

;// jam/eventEdit/jam+eventEdit.jam
with( $jam$ )
$define
(   '$eventEdit'
,   new function(){
        
        var scream=
        $Throttler
        (   50
        ,   function( target ){
                $Event().type( '$jam$.$eventEdit' ).scream( target )
            }
        )

        var handler=
        function( event ){
            if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
            if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
            scream( event.target() )
        }

        var node=
        $Node( $doc().documentElement )
        
        node.listen( 'keyup', handler )
        node.listen( 'cut', handler )
        node.listen( 'paste', handler )

    }
)

;// jam/eventScroll/jam+eventScroll.jam
with( $jam$ )
$define
(   '$eventScroll'
,   new function(){
        var handler=
        function( event ){
            $Event()
            .type( '$jam.$eventScroll' )
            .wheel( event.wheel() )
            .scream( event.target() )
        }
        
        var docEl= $Node( $doc().documentElement )
        docEl.listen( 'mousewheel', handler )
        docEl.listen( 'DOMMouseScroll', handler )
    }
)

;// jam/eventURIChanged/jam+eventURIChanged.jam
with( $jam$ )
$define
(   '$eventURIChanged'
,   new function(){
        
        var lastURI= $doc().location.href
        
        var refresh=
        function( ){
            var newURI= $doc().location.href
            if( lastURI === newURI ) return
            lastURI= newURI
            $Event().type( '$jam$.$eventURIChanged' ).scream( $doc() )
        }
        
        $glob().setInterval( refresh, 20)
    }
)

;// jam/htmlize/jam+htmlize.jam
with( $jam$ )
$define
(   '$htmlize'
,   function( ns ){
        if( !$doc().getElementsByTagNameNS ) return
        var nodeList= $doc().getElementsByTagNameNS( ns, '*' )
        var docEl= $doc().documentElement
        
        var tracking= function( ){
            sleep()
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
                if( node.parentNode === parent ) parent.removeChild( node )
            }
            rise()
        }
        
        $domReady.then( tracking )
        rise()
        
        function rise( ){
            docEl.addEventListener( 'DOMNodeInserted', tracking, false )
        }
        function sleep( ){
            docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
        }
    }
)

;// jam/uriEscape/jam+uriEscape.jam
with( $jam$ )
$define
(   '$uriEscape'
,   $glob().encodeURIComponent
)

