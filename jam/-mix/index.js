;if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
;$jam.B= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.B: ' + String( val )
}
return value
}
;$jam.C= $jam.B( this )
;$jam.D=
new function( ){
var Ghost= function(){}
return function( key, value ){
var keyList= key.split( '.' )
var obj= $jam.C()
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
;$jam.E=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.E
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
;$jam.D
(   '$jam.F'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.D
(   '$jam.G'
,   $jam.E( function( klass, proto ){
proto.constructor=
$jam.F
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
;$jam.D
(    '$jam.H'
,    function( func ){
var cache= $jam.G()
return function( key ){
if( cache.has( key ) ) return cache.get( key )
var value= func.apply( this, arguments )
cache.put( key, value )
return value 
}
}
)
;$jam.D
(   '$jam.I'
,   function( timeout, proc ){
var timerID= $jam.C().setTimeout( proc, timeout )
return function( ){
$jam.C().clearTimeout( timerID )
}
}
)
;$jam.J=
$jam.E( function( klass, proto ){
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
;$jam.D
(   '$jam.K'
,   $jam.E( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.F
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
$jam.F
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
$jam.F
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
$jam.I
(   this.latency()
,   $jam.J( this )
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
if( !this.active() ) return this
this.$.active= false
this.start()
return this
}
})
)
;$jam.D( '$jam.L', $jam.B( $jam.C().document ) )
;$jam.D
(   '$jam.M.then'
,   function( proc ){
var checker= function( ){
if( $jam.M() ) proc()
else $jam.I( 10, checker )
}
checker()
}
)
;$jam.D
(   '$jam.M'
,   function( ){
var state= $jam.L().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.D
(   '$jam.N'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.D
(   '$jam.O'
,   new function(){
var Support= function( state ){
var sup= $jam.B( state )
sup.select= function( map ){
return $jam.N( this(), map )
}
return sup
}
var node= $jam.L().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.C().DOMParser && $jam.C().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.D
(   '$jam.P'
,   function( tagName, factory ){
if(!( this instanceof $jam.P )) return new $jam.P( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.L().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.L().documentElement.namespaceURI
var checkName=
( tagName === '*' )
?    $jam.B( true )
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
$jam.C().setInterval( tracking, 200 )
$jam.M.then(function whenReady(){
$jam.C().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.L().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.O.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.O.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
}, false )
this.tagName= $jam.B( tagName )
this.factory= $jam.B( factory )
this.elements=
function elements( ){
return elements.slice( 0 )
}
tracking()
}
)
;$jam.D
(   '$jam.Q'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$jam.D
(   '$jam.R'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.E ) return obj
return klass.raw( obj )
}
)
;$jam.D
(   '$jam.S'
,   $jam.E( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.R( data ) || '' )
return this
}
proto.incIndent=
$jam.F
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.F
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.F
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
$jam.F
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.F
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
$jam.F
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.F
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
$jam.F
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.F
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.F
(   function( ){
return this.$
}
)
})
)
;$jam.D
(   '$jam.T'
,   $jam.E( function( klass, proto ){
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
$jam.O.xmlModel.select(
{   'w3c': function( ){
var serializer= new XMLSerializer
var text= serializer.serializeToString( this.$ )
return text
}
,   'ms': function( ){
return $jam.S( this.$.xml ).trim().$
}
})
proto.transform=
$jam.O.xmlModel.select(
{   'w3c': function( stylesheet ){
var proc= new XSLTProcessor
proc.importStylesheet( $jam.R( stylesheet ) )
var doc= proc.transformToDocument( this.$ )
return $jam.T( doc )
}
,   'ms': function( stylesheet ){
var text= this.$.transformNode( $jam.R( stylesheet ) )
return $jam.T.parse( text )
}
})
klass.parse=
$jam.O.xmlModel.select(
{   'w3c': function( str ){
var parser= new DOMParser
var doc= parser.parseFromString( str, 'text/xml' )
return $jam.T( doc )
}
,   'ms': function( str ){
var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
doc.async= false
doc.loadXML( str )
return $jam.T( doc )
}
})
})
)
;$jam.D
(  '$jam.U'
,   function( ){
return $jam.C().getSelection()
}
)
;$jam.D
(   '$jam.V'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.D
(   '$jam.W'
,   new function(){
var fromCharCode= $jam.C().String.fromCharCode
var parseInt= $jam.C().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.V[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.D
(   '$jam.X'
,   function( html ){
return $jam.W
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.D
(   '$jam.Y'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;$jam.D
(   '$jam.Z'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === $jam.C() ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;$jam.D
(   '$jam.AA'
,   $jam.E( function( klass, proto ){
proto.constructor=
$jam.F
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
$jam.F
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.Z( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.Z( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.F
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.Z( keyList ) === 'String' ){
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
if( $jam.Z( cur[ key ] ) === 'Object' ){
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
if( $jam.Z( json ) === 'String' ){
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
$jam.F
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
;$jam.D
(   '$jam.AB'
,   $jam.E( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.AC( node )
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
;$jam.AD=
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
;$jam.AE=
$jam.E( function( klass, proto ){
proto.constructor=
$jam.F
(   function( ){
this.$= $jam.L().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.F
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.F
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.F
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.F
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.F
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.F
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.F
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.AD( code ) ]= code
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
$jam.F
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
$jam.F
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
$jam.R( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.D
(   '$jam.AF'
,   $jam.E( function( klass, proto ){
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
$jam.F
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
$jam.F
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.R( node )
return this
}
)
proto.handler=
$jam.F
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.AE( event ) )
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
$jam.F
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
;$jam.D
(   '$jam.AC'
,   $jam.E( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.L().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.L().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.L().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.L().createDocumentFragment() )
}
proto.text=
$jam.F
(   function( ){
return $jam.X( this.$.innerHTML )
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
$jam.F
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
$jam.F
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
$jam.F
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.AA({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.AA({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.F
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
return $jam.AB( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.AB( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.AB( filtered )
}
proto.parent= 
$jam.F
(   function( ){
return $jam.AC( this.$.parentNode )
}
,   function( node ){
node= $jam.R( node )
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
var node= $jam.R( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.AC.Text( '\r\n' ) )
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
$jam.F
(   function(){
return $jam.AC( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.R( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.F
(   function(){
return $jam.AC( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.R( node ) )
return this
}
)
proto.next=
$jam.F
(   function(){
return $jam.AC( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.R( node ), next ) 
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
$jam.F
(   function(){
return $jam.AC( this.$.previousSibling )
}
,   function( node ){
node= $jam.R( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.F
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
var fragment= $jam.AC.Fragment()
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
return $jam.AC( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.AC( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.AF()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.D
(   '$jam.AG'
,   $jam.E( function( klass, proto ){
proto.constructor=
$jam.F
(   function( ){
var sel= $jam.U()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= $jam.L().createRange()
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
var sel= $jam.U()
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
$jam.F
(   function( ){
return $jam.X( this.html() )
}
,   function( text ){
this.html( $jam.Y( text ) )
return this
}
)
proto.html=
$jam.F
(   function( ){
return $jam.AC( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.AC.parse( html ).$ : $jam.AC.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.R( node )
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
range= $jam.AG( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.AG( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.AG( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.AC( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.AC( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.AG().aimNode( current )
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
var range= $jam.AG().aimNode( current )
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
return $jam.AG( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.R( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.R( node ) )
return this
}
})
)
;$jam.D
(   '$jam.AH'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.B( gen )
return lazy
}
)
;$jam.D
(   '$jam.AI'
,   $jam.E( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.AI.escape( chunk )
str+= chunk
}
return $jam.AI( str )
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
;$jam.D
(   '$jam.AJ'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.AI( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.AI(regexp).count()
return $jam.E( function( klass, proto ){
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
;$jam.D
(   '$jam.AK'
,   $jam.E( function( klass, proto ){
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
;$jam.D
(   '$jam.AL'
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
;$jam.D
(    '$jam.AM'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.AL()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.AJ( lexems )
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
;$jam.D
(   '$jam.AN'
,   $jam.E( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.K()
.handler( $jam.J( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.F
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.F
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
;$jam.D
(   '$jam.AO'
,   new function( ){
var factory= function( arg ){
if( !arg ) arg= {}
var open= arg.tokens && arg.tokens[0] || '{'
var close= arg.tokens && arg.tokens[1] || '}'
var openEncoded= $jam.AI.escape( open )
var closeEncoded= $jam.AI.escape( close )
var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
var parse= $jam.AM( new function(){
this[ openEncoded + openEncoded ]=
$jam.B( open )
this[ closeEncoded +closeEncoded ]=
$jam.B( close )
this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
Selector
})
return $jam.E( function( klass, proto ){
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
$jam.F
(   $jam.AH( function( ){
return $jam.B( factory.Selector( $jam.AL() ) )
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
selector.toString= $jam.B( str )
return selector
}
}
)
return factory
}
)
;$jam.D
(   '$jam.AP'
,   $jam.AH( function(){
var poolNode= $jam.AH( function(){
var body= $jam.L().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.L().createElement( 'wc:A:pool' )
pool.style.display= 'none'
body.insertBefore( pool, body.firstChild )
return $jam.B( pool )
})
var free= []
return function( proc ){
return function( ){
var res
var self= this
var args= arguments
var starter= free.pop()
if( !starter ){
var starter= $jam.L().createElement( 'button' )
poolNode().appendChild( starter )
}
starter.onclick= function( ev ){
( ev || $jam.C().event ).cancelBubble= true
res= proc.apply( self, args )
}
starter.click()
free.push( starter )
return res
}
}
})
)
;$jam.D
(    '$jam.AQ'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.I( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.D
(   '$jam.AR'
,   function( map ){
var Selector= function( str, key ){
var keyList= key.split( ':' )
var fieldName= keyList.shift()
var selector= function( data ){
var value= ( fieldName === '.' ) ? data : data[ fieldName ]
if( value ) return selector
}
selector.toString= $jam.B( str )
return selector
}
var Template= $jam.AO({ Selector: Selector })
for( var key in map ) map[ key ]= Template( map[ key ] )
return 
}
)
;$jam.D
(   '$jam.AS'
,   $jam.E( function( klass, proto ){
proto.constructor=
function( data ){
this.$= data || []
return this
}
klass.Parser=
function( syntax ){
if( !syntax ) syntax= {}
var lineSep= syntax.lineSep || ';'
var valSep= syntax.valSep || '='
var oneIndent= syntax.oneIndent || '+'
var keySep= syntax.keySep || '_'
var lineParser= $jam.AI.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$
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
return $jam.AS( data )
}
return parser
}
})
)
;$jam.D
(   '$jam.AT'
,   function( ){
return $jam.L().body
}
)
;$jam.D
(   '$jam.AU'
,   $jam.AP(function( source ){
return $jam.C().eval( source )
})
)
;$jam.D
(   '$jam.AV'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.AE().type( '$jam.AV' ).scream( event.target() )
}
$jam.AC( $jam.L().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.D
(   '$jam.AW'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.AE().type( '$jam.AW' ).scream( event.target() )
}
$jam.AC( $jam.L().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.D
(   '$jam.AX'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.C().confirm( 'Are you sure to delee this?' ) ) return
$jam.AE().type( '$jam.AX' ).scream( event.target() )
}
$jam.AC( $jam.L().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.D
(   '$jam.AY'
,   new function(){
var scream=
$jam.AQ
(   50
,   function( target ){
$jam.AE().type( '$jam.AY' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.AC( $jam.L().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.D
(   '$jam.AZ'
,   new function(){
var handler=
function( event ){
$jam.AE()
.type( '$jam.$eventScroll' )
.wheel( event.wheel() )
.scream( event.target() )
}
var docEl= $jam.AC( $jam.L().documentElement )
docEl.listen( 'mousewheel', handler )
docEl.listen( 'DOMMouseScroll', handler )
}
)
;$jam.D
(   '$jam.BA'
,   new function(){
var lastURI= $jam.L().location.href
var refresh=
function( ){
var newURI= $jam.L().location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.AE().type( '$jam.BA' ).scream( $jam.L() )
}
$jam.C().setInterval( refresh, 20)
}
)
;$jam.BB=
function( ns ){
if( !$jam.L().getElementsByTagNameNS ) return
var nodeList= $jam.L().getElementsByTagNameNS( ns, '*' )
var docEl= $jam.L().documentElement
var tracking= function( ){
sleep()
var node
while( node= nodeList[0] ){
var parent= node.parentNode
var newNode= $jam.L().createElement( node.nodeName )
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
$jam.M.then( tracking )
tracking()
function rise( ){
docEl.addEventListener( 'DOMNodeInserted', tracking, false )
}
function sleep( ){
docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
}
}
;$jam.D
(   '$jam.BC'
,   new function(){
var console= $jam.C().console
if( !console || !console.log ){
return function(){
alert( [].slice.call( arguments ) )
}
}
return function(){
Function.prototype.apply.call( console.log, console, arguments )
}
}
)
;$jam.D
(   '$jam.BD'
,   $jam.C().encodeURIComponent
)
