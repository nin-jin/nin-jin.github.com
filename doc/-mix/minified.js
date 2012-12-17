new function( window, document ){
with ( this ){
this.$jam= {}
;
$jam.define=
function( ){
var Ghost= function(){}
var global= this
return function( key, value ){
var keyList= key.split( '.' )
var obj= global
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
}.apply( this )
;
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
;
$jam.define
(   '$jam.Poly'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;
$jam.define
(   '$jam.Hash'
,   $jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
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
;
$jam.define
(    '$jam.Cached'
,    function( func ){
var cache= $jam.Hash()
return function( key ){
if( cache.has( key ) ) return cache.get( key )
var value= func.apply( this, arguments )
cache.put( key, value )
return value 
}
}
)
;
$jam.define
(   '$jam.schedule'
,   function( timeout, proc ){
var timerID= window.setTimeout( proc, timeout )
return function( ){
window.clearTimeout( timerID )
}
}
)
;
$jam.Obj=
$jam.Class( function( klass, proto ){
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
;
$jam.define
(   '$jam.Clock'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.Poly
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
$jam.Poly
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
$jam.Poly
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
$jam.schedule
(   this.latency()
,   $jam.Obj( this )
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
;
$jam.Value= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.Value: ' + String( val )
}
return value
}
;
$jam.define
(   '$jam.domReady.then'
,   function( proc ){
var checker= function( ){
if( $jam.domReady() ) proc()
else $jam.schedule( 5, checker )
}
checker()
}
);
$jam.define
(   '$jam.domReady'
,   function( ){
var state= document.readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;
$jam.define
(   '$jam.select'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;
$jam.define
(   '$jam.support'
,   new function(){
var Support= function( state ){
var sup= $jam.Value( state )
sup.select= function( map ){
return $jam.select( this(), map )
}
return sup
}
var node= document.createElement( 'div' )
this.msie= Support( /*@cc_on!@*/ false )
this.xmlModel= Support( ( window.DOMParser && window.XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;
$jam.define
(   '$jam.Component'
,   function( tagName, factory ){
if(!( this instanceof $jam.Component )) return new $jam.Component( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= document.getElementsByTagName( tagName )
var elements= []
var checkName=
( tagName === '*' )
?   $jam.Value( true )
:   function checkName_right( el ){
return( el.nodeName.toLowerCase() == tagName )
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
window.setInterval( tracking, 50 )
$jam.domReady.then(function whenReady(){
window.clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= document.documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.support.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.support.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
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
;
$jam.define
(   '$jam.Concater'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;
$jam.define
(  '$jam.selection'
,   function( ){
return window.getSelection()
}
)
;
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
;
$jam.define
(   '$jam.htmlDecode'
,   new function(){
var fromCharCode= window.String.fromCharCode
var parseInt= window.parseInt
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
;
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
;
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
;
$jam.define
(   '$jam.classOf'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === window ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;
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
;
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
;
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
;
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
};
$jam.Event=
$jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
(   function( ){
this.$= document.createEvent( 'Event' )
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
;
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
;
$jam.define
(   '$jam.Node'
,   $jam.Class( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( document.createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( document.createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( document.createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( document.createDocumentFragment() )
}
proto.text=
$jam.Poly
(   function( ){
return $jam.html2text( this.$.innerHTML )
}
,   new function(){
return function( val ){
this.$.textContent= String( val )
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
this.$.innerHTML= String( val )
return this
}
)
proto.clear=
function( ){
this.html( '' )
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
return this.$.getAttribute && this.$.getAttribute( name )
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
;
$jam.define
(   '$jam.DomRange'
,   $jam.Class( function( klass, proto ){
proto.constructor=
$jam.Poly
(   function( ){
var sel= $jam.selection()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= document.createRange()
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
;
$jam.define
(   '$jam.Lazy'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.Value( gen )
return lazy
}
)
;
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
;
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
;
$jam.define
(   '$jam.Number'
,   $jam.Class( function( klass, proto ){
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
;
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
;
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
;
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
;
$jam.define
(   '$jam.TaskQueue'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.Clock()
.handler( $jam.Obj( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.Poly
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.Poly
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
;
$jam.define
(   '$jam.TemplateFactory'
,   new function( ){
var factory= function( arg ){
if( !arg ) arg= {}
var open= arg.tokens && arg.tokens[0] || '{'
var close= arg.tokens && arg.tokens[1] || '}'
var openEncoded= $jam.RegExp.escape( open )
var closeEncoded= $jam.RegExp.escape( close )
var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
var parse= $jam.Parser( new function(){
this[ openEncoded + openEncoded ]=
$jam.Value( open )
this[ closeEncoded +closeEncoded ]=
$jam.Value( close )
this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
Selector
})
return $jam.Class( function( klass, proto ){
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
$jam.Poly
(   $jam.Lazy( function( ){
return $jam.Value( factory.Selector( $jam.Pipe() ) )
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
selector.toString= $jam.Value( str )
return selector
}
}
)
return factory
}
)
;
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
;
$jam.define
(   '$jam.Transformer'
,   function( map ){
var Selector= function( str, key ){
var keyList= key.split( ':' )
var fieldName= keyList.shift()
var selector= function( data ){
var value= ( fieldName === '.' ) ? data : data[ fieldName ]
if( value ) return selector
}
selector.toString= $jam.Value( str )
return selector
}
var Template= $jam.TemplateFactory({ Selector: Selector })
for( var key in map ) map[ key ]= Template( map[ key ] )
return 
}
)
;
$jam.define
(   '$jam.Tree'
,   $jam.Class( function( klass, proto ){
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
var lineParser= $jam.RegExp.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$
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
return $jam.Tree( data )
}
return parser
}
})
);
$jam.define
(   '$jam.body'
,   function( ){
return document.body
}
)
;
$jam.currentScript= function( ){
var script= document.currentScript
if( !script ){
var scriptList= document.getElementsByTagName( 'script' )
script= scriptList[ scriptList.length - 1 ]
}
for( var parent; parent= script.parentScript; script= parent );
return script
};
$jam.define
(   '$jam.domx'
,   $jam.Class( function( klass, proto ){
proto.constructor=
function( dom ){
if( dom.toDOMNode ) dom= dom.toDOMNode()
this.$= dom
return this
}
proto.toDOMDocument=
function( ){
return this.$.ownerDocument || this.$
}
proto.toDOMNode=
function( ){
return this.$
}
proto.toString=
$jam.support.xmlModel.select(
{   'w3c': function( ){
var serializer= new XMLSerializer
var text= serializer.serializeToString( this.$ )
return text
}
,   'ms': function( ){
return $jam.String( this.$.xml ).trim().$
}
})
proto.transform=
$jam.support.xmlModel.select(
{   'w3c': function( stylesheet ){
var proc= new XSLTProcessor
proc.importStylesheet( $jam.raw( stylesheet ) )
var doc= proc.transformToDocument( this.$ )
return $jam.domx( doc )
}
,   'ms': function( stylesheet ){
var text= this.$.transformNode( $jam.raw( stylesheet ) )
return $jam.domx.parse( text )
}
})
proto.select=
function( xpath ){
result= this.toDOMDocument().evaluate( xpath, this.toDOMNode(), null, null, null ).iterateNext()
return $jam.domx( result )
}
klass.parse=
$jam.support.xmlModel.select(
{   'w3c': function( str ){
var parser= new DOMParser
var doc= parser.parseFromString( str, 'application/xml' )
return $jam.domx( doc )
}
,   'ms': function( str ){
var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
doc.async= false
doc.loadXML( str )
return $jam.domx( doc )
}
})
})
)
;
this.$jin_makeId= function( prefix ){
prefix= prefix || ''
return prefix + Math.random().toString( 32 ).substring( 2 )
};
this.$jin_thread= function( proc ){
return function( ){
var self= this
var args= arguments
var res
var id= $jin_makeId( '$jin_thread' )
var launcher= function( event ){
res= proc.apply( self, args )
}
window.addEventListener( id, launcher, false )
var event= document.createEvent( 'Event' )
event.initEvent( id, false, false )
window.dispatchEvent( event )
window.removeEventListener( id, launcher, false )
return res
}
}
;
$jam.define
(   '$jam.eval'
,   $jin_thread(function( source ){
return window.eval( source )
})
)
;
$jam.define
(   '$jam.eventClone'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.Event().type( '$jam.eventClone' ).scream( event.target() )
}
$jam.Node( document.documentElement )
.listen( 'keyup', handler )
}
)
;
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
$jam.Node( document.documentElement )
.listen( 'keydown', handler )
this.toString= $jam.Value( '$jam.eventCommit' )
}
)
;
$jam.define
(   '$jam.eventDelete'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !window.confirm( 'Are you sure to delee this?' ) ) return
$jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
}
$jam.Node( document.documentElement )
.listen( 'keyup', handler )
}
)
;
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
var node=
$jam.Node( document.documentElement )
node.listen( 'keyup', function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
} )
var handler= function( event ){
scream( event.target() )
}
node.listen( 'cut', handler )
node.listen( 'paste', handler )
node.listen( 'drop', handler )
}
)
;
$jam.define
(   '$jam.eventScroll'
,   new function(){
var handler=
function( event ){
$jam.Event()
.type( '$jam.eventScroll' )
.wheel( event.wheel() )
.scream( event.target() )
}
var docEl= $jam.Node( document.documentElement )
docEl.listen( 'mousewheel', handler )
docEl.listen( 'DOMMouseScroll', handler )
}
)
;
$jam.define
(   '$jam.eventURIChanged'
,   new function(){
var lastURI= document.location.href
var refresh=
function( ){
var newURI= document.location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.Event().type( '$jam.eventURIChanged' ).scream( document )
}
window.setInterval( refresh, 20)
}
)
;
$jam.http= $jam.Class( function( klass, proto ){
proto.constructor= function( uri ){
this.$= { uri: uri }
return this
}
proto.request= function( method, data ){
var channel= new XMLHttpRequest
channel.open( method, this.$.uri, false )
if( data && !( data instanceof String ) && !( data instanceof FormData ) ){
var chunks= []
for( var key in data ){
if( !data.hasOwnProperty( key ) )
continue
chunks.push( encodeURIComponent( key ) + '=' + encodeURIComponent( data[ key ] ) )
}
data= chunks.join( '&' )
channel.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
channel.setRequestHeader( 'Accept', 'application/xhtml+xml, */*' )
}
channel.send( data )
if( channel.responseXML ) return $jam.domx( channel.responseXML )
return channel.responseText
}
proto.get= function( ){
return this.request( 'get' )
}
proto.post= function( data ){
return this.request( 'post', data )
}
proto.put= function( data ){
return this.request( 'put', data )
}
})
;
$jam.define
(   '$jam.log'
,   new function(){
var console= window.console
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
;
$jam.define
(   '$jam.uriEscape'
,   window.encodeURIComponent
)
;
$jam.Component
(   'wc_aspect'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.Node( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc_aspect_ratio' ) )
nodeRoot.$.style.height= Math.min( nodeRoot.width() * ratio, window.innerHeight * .9 ) + 'px'
}
update()
window.addEventListener( 'resize', update )
this.destroy= function( ){
window.removeEventListener( 'resize', update )
}
}
}
)
;
this.$lang=
function( name ){
return $lang[ name ] || $lang.text
}
$lang.text= function( text ){
return $jam.htmlEscape( text )
}
$lang.text.html2text= $jam.html2text
;
$lang.Wrapper=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;
$lang.Parser=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.text
return $jam.Pipe
(   $jam.Parser( map )
,   $jam.Concater()
)
}
;
$lang.css=
new function(){
var css=
function( str ){
return css.root( css.stylesheet( str ) )
}
css.html2text= $jam.html2text
css.root= $lang.Wrapper( 'lang_css' )
css.remark= $lang.Wrapper( 'lang_css_remark' )
css.string= $lang.Wrapper( 'lang_css_string' )
css.bracket= $lang.Wrapper( 'lang_css_bracket' )
css.selector= $lang.Wrapper( 'lang_css_selector' )
css.tag= $lang.Wrapper( 'lang_css_tag' )
css.id= $lang.Wrapper( 'lang_css_id' )
css.klass= $lang.Wrapper( 'lang_css_class' )
css.pseudo= $lang.Wrapper( 'lang_css_pseudo' )
css.property= $lang.Wrapper( 'lang_css_property' )
css.value= $lang.Wrapper( 'lang_css_value' )
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
;
$lang.pcre=
new function(){
var pcre=
function( str ){
return pcre.root( pcre.content( str ) )
}
pcre.html2text= $jam.html2text
pcre.root= $lang.Wrapper( 'lang_pcre' )
pcre.backslash= $lang.Wrapper( 'lang_pcre_backslash' )
pcre.control= $lang.Wrapper( 'lang_pcre_control' )
pcre.spec= $lang.Wrapper( 'lang_pcre_spec' )
pcre.text= $lang.Wrapper( 'lang_pcre_text' )
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
;
$lang.js=
new function(){
var js=
function( str ){
return js.root( js.content( str ) )
}
js.html2text= $jam.html2text
js.root= $lang.Wrapper( 'lang_js' )
js.remark= $lang.Wrapper( 'lang_js_remark' )
js.string= $lang.Wrapper( 'lang_js_string' )
js.internal= $lang.Wrapper( 'lang_js_internal' )
js.external= $lang.Wrapper( 'lang_js_external' )
js.keyword= $lang.Wrapper( 'lang_js_keyword' )
js.number= $lang.Wrapper( 'lang_js_number' )
js.regexp= $lang.Wrapper( 'lang_js_regexp' )
js.bracket= $lang.Wrapper( 'lang_js_bracket' )
js.operator= $lang.Wrapper( 'lang_js_operator' )
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
;
$lang.sgml=
new function(){
var sgml=
function( str ){
return sgml.root( sgml.content( str ) )
}
sgml.html2text= $jam.html2text
sgml.root= $lang.Wrapper( 'lang_sgml' )
sgml.tag= $lang.Wrapper( 'lang_sgml_tag' )
sgml.tagBracket= $lang.Wrapper( 'lang_sgml_tag-bracket' )
sgml.tagName= $lang.Wrapper( 'lang_sgml_tag-name' )
sgml.attrName= $lang.Wrapper( 'lang_sgml_attr-name' )
sgml.attrValue= $lang.Wrapper( 'lang_sgml_attr-value' )
sgml.comment= $lang.Wrapper( 'lang_sgml_comment' )
sgml.decl= $lang.Wrapper( 'lang_sgml_decl' )
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
name= sgml.attrName( $lang.text( name ) )
value= sgml.attrValue( $lang.text( value ) )
return prefix + name + sep + value
}
})
,   $lang.Wrapper( 'lang_sgml_tag' )
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
;
$jam.Component
(   'wc_demo'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.Node.Element( 'wc_demo_result' )
.parent( nodeRoot )
var nodeSource0=
$jam.Node.Element( 'wc_demo_source' )
.parent( nodeRoot )
var nodeSource=
$jam.Node.parse( '<wc_editor wc_editor_hlight="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jin_thread( function( ){
var source= $jam.String( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.Node( scripts[i] )
$jam.eval( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.eventCommit', exec )
this.destroy=
function( ){
onCommit.sleep()
}
}
}
)
;
$lang.html= $lang.sgml;
$lang.htm= $lang.html;
$lang.jsm= $lang.js;
$lang.php=
new function( ){
var php=
function( str ){
return php.root( php.content( str ) )
}
php.html2text= $jam.html2text
php.root= $lang.Wrapper( 'lang_php' )
php.dollar= $lang.Wrapper( 'lang_php_dollar' )
php.variable= $lang.Wrapper( 'lang_php_variable' )
php.string= $lang.Wrapper( 'lang_php_string' )
php.number= $lang.Wrapper( 'lang_php_number' )
php.func= $lang.Wrapper( 'lang_php_func' )
php.keyword= $lang.Wrapper( 'lang_php_keyword' )
php.content=
$lang.Parser( new function(){
this[ /\b(true|false|null|NULL|__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
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
;
$jam.define
(    '$lang.tags'
,    new function(){
var tags=
function( str ){
return tags.root( tags.content( str ) )
}
tags.html2text= $jam.html2text
tags.root= $lang.Wrapper( 'lang_tags' )
tags.item= $lang.Wrapper( 'lang_tags_item' )
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
;
$lang.xml= $lang.sgml;
$lang.xbl= $lang.xml;
$lang.xsl= $lang.xml;
$lang.xs= $lang.xsl;
$lang.xul= $lang.sgml;
$lang.md=
new function(){
var md=
function( str ){
return md.root( md.content( str ) )
}
md.html2text= function( text ){
return $jam.html2text
(   text
.replace( /<h1[^>]*>/gi, '\n!!! ' )
.replace( /<h2[^>]*>/gi, '\n!!  ' )
.replace( /<h[3-7][^>]*>/gi, '\n!   ' )
.replace( /<\/?code[^>]*>/gi, '' )
.replace( /<pre[^>]*>([\s\S]+?)<\/pre>/gi, function( str, code ){
console.log( code )
return '\n#   text\n    ' + code.replace( /[\r\n]+$/, '' ).replace( /\n/g, '\n    ' )  + '\n'
})
.replace( /<a wc_link="true"[^>]*>/gi, '' )
.replace( /<a[^>]* href="([^">]+)"[^>]*>([\s\S]*?)<\/a>/gi, function( str, link, text ){
if( !text ) return str
if( text === link ) text= ''
return '[' + text + '\\' + link + ']'
})
.replace( /<li[^>]*>/gi, '\n    • ' )
.replace( /<p[^>]*>/gi, '\n    ' )
.replace( /<\/(h[1-6]|p|li)>/gi, '\n' )
)
}
md.root= $lang.Wrapper( 'lang_md' )
md.header1= $lang.Wrapper( 'lang_md_header-1' )
md.header2= $lang.Wrapper( 'lang_md_header-2' )
md.header3= $lang.Wrapper( 'lang_md_header-3' )
md.header4= $lang.Wrapper( 'lang_md_header-4' )
md.header5= $lang.Wrapper( 'lang_md_header-5' )
md.header6= $lang.Wrapper( 'lang_md_header-6' )
md.headerMarker= $lang.Wrapper( 'lang_md_header-marker' )
md.pros= $lang.Wrapper( 'lang_md_pros' )
md.cons= $lang.Wrapper( 'lang_md_cons' )
md.disputes= $lang.Wrapper( 'lang_md_disputes' )
md.marker= $lang.Wrapper( 'lang_md_marker' )
md.quote= $lang.Wrapper( 'lang_md_quote' )
md.quoteMarker= $lang.Wrapper( 'lang_md_quote-marker' )
md.quoteInline= $lang.Wrapper( 'lang_md_quote-inline' )
md.quoteInlineMarker= $lang.Wrapper( 'lang_md_quote-inline-marker' )
md.image= $lang.Wrapper( 'lang_md_image' )
md.imageHref= $lang.Wrapper( 'lang_md_image-href' )
md.embed= $lang.Wrapper( 'lang_md_embed' )
md.embedHref= $lang.Wrapper( 'lang_md_embed-href' )
md.link= $lang.Wrapper( 'lang_md_link' )
md.linkMarker= $lang.Wrapper( 'lang_md_link-marker' )
md.linkTitle= $lang.Wrapper( 'lang_md_link-title' )
md.linkHref= $lang.Wrapper( 'lang_md_link-href' )
md.author= $lang.Wrapper( 'lang_md_author' )
md.indent= $lang.Wrapper( 'lang_md_indent' )
md.escapingMarker= $lang.Wrapper( 'lang_md_escaping-marker' )
md.emphasis= $lang.Wrapper( 'lang_md_emphasis' )
md.emphasisMarker= $lang.Wrapper( 'lang_md_emphasis-marker' )
md.strong= $lang.Wrapper( 'lang_md_strong' )
md.strongMarker= $lang.Wrapper( 'lang_md_strong-marker' )
md.super= $lang.Wrapper( 'lang_md_super' )
md.superMarker= $lang.Wrapper( 'lang_md_super-marker' )
md.sub= $lang.Wrapper( 'lang_md_sub' )
md.subMarker= $lang.Wrapper( 'lang_md_sub-marker' )
md.math= $lang.Wrapper( 'lang_md_math' )
md.remark= $lang.Wrapper( 'lang_md_remark' )
md.table= $lang.Wrapper( 'lang_md_table' )
md.tableRow= $lang.Wrapper( 'lang_md_table-row' )
md.tableCell= $lang.Wrapper( 'lang_md_table-cell' )
md.tableMarker= $lang.Wrapper( 'lang_md_table-marker' )
md.code= $lang.Wrapper( 'lang_md_code' )
md.codeMarker= $lang.Wrapper( 'lang_md_code-marker' )
md.codeLang= $lang.Wrapper( 'lang_md_code-lang' )
md.codePath= $lang.Wrapper( 'lang_md_code-path' )
md.codeMeta= $lang.Wrapper( 'lang_md_code-meta' )
md.codeContent= $lang.Wrapper( 'lang_md_code-content' )
md.html= $lang.Wrapper( 'lang_md_html' )
md.htmlTag= $lang.Wrapper( 'lang_md_html-tag' )
md.htmlContent= $lang.Wrapper( 'lang_md_html-content' )
md.para= $lang.Wrapper( 'lang_md_para' )
md.inline=
$lang.Parser( new function(){
this[ /^(\s+)/.source ]=
md.indent
this[ /([0-9∅‰∞∀∃∫√×±≤+−≥≠<>%])/.source ]=
md.math
this[ /(`)(.+?)(`)/.source ]=
function( open, text, close ){
return md.escapingMarker( open ) + text + md.escapingMarker( close )
}
this[ /(\*\*|\/\/|\^\^|__|\[\[|\]\]|``|\\\\)/.source ]=
function( symbol ){
return md.escapingMarker( symbol[0] ) + symbol[1]
}
this[ /(\[)(.*?)(\\)((?:https?|ftps?|mailto|magnet):[^\0]*?|[^:]*?(?:[\/\?].*?)?)(\])/.source ]=
function( open, title, middle, href, close ){
var uri= href
open= md.linkMarker( open )
middle= md.linkMarker( middle )
close= md.linkMarker( close )
href= title ? md.linkHref( href ) : md.linkTitle( href )
title= md.linkTitle( md.inline( title ) )
return md.link( '<a wc_link="true" href="' + $jam.htmlEscape( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
this[ /([^\s"({[]\/)/.source ]=
$lang.text
this[ /(\/)([^\/\s](?:[\s\S]*?[^\/\s])?)(\/)(?=[\s,.:;!?")}\]]|$)/.source ]=
function( open, content, close ){
open = md.emphasisMarker( open )
close = md.emphasisMarker( close )
content= md.inline( content )
return md.emphasis( open + content + close )
}
this[ /([^\s"({[]\*)/.source ]=
$lang.text            
this[ /(\*)([^\*\s](?:[\s\S]*?[^\*\s])?)(\*)(?=[\s,.:;!?")}\]]|$)/.source ]=
function( open, content, close ){
open = md.strongMarker( open )
close = md.strongMarker( close )
content= md.inline( content )
return md.strong( open + content + close )
}
this[ /(\^)([^\^\s](?:[\s\S]*?[^\^\s])?)(\^)(?=[\s,.:;!?")}\]√_]|$)/.source ]=
function( open, content, close ){
open = md.superMarker( open )
close = md.superMarker( close )
content= md.inline( content )
return md.super( open + content + close )
}
this[ /(_)([^_\s](?:[\s\S]*?[^_\s])?)(_)(?=[\s,.:;!?")}\]\^]|$)/.source ]=
function( open, content, close ){
open = md.subMarker( open )
close = md.subMarker( close )
content= md.inline( content )
return md.sub( open + content + close )
}
this[ /(")([^"\s](?:[\s\S]*?[^"\s])?)(")(?=[\s,.:;!?)}\]]|$)/.source ]=
this[ /(«)([\s\S]*?)(»)/.source ]=
function( open, content, close ){
open = md.quoteInlineMarker( open )
close = md.quoteInlineMarker( close )
content= md.inline( content )
return md.quoteInline( open + content + close )
}
this[ /(\()([\s\S]+?)(\))/.source ]=
function( open, content, close ){
content= md.inline( content )
return md.remark( open + content + close )
}
})
md.content=
$lang.Parser( new function(){
this[ /^(!!! )(.*?)$/.source ]=
function( marker, content ){
return md.header1( md.headerMarker( marker ) + md.inline( content ) )
}
this[ /^(!!  )(.*?)$/.source ]=
function( marker, content ){
return md.header2( md.headerMarker( marker ) + md.inline( content ) )
}
this[ /^(!   )(.*?)$/.source ]=
function( marker, content ){
return md.header3( md.headerMarker( marker ) + md.inline( content ) )
}
this[ /^(\+   )(.*?)$/.source ]=
function( marker, content ){
return md.pros( md.marker( marker ) + md.inline( content ) )
}
this[ /^(−   )(.*?)$/.source ]=
function( marker, content ){
return md.cons( md.marker( marker ) + md.inline( content ) )
}
this[ /^(±   )(.*?)$/.source ]=
function( marker, content ){
return md.disputes( md.marker( marker ) + md.inline( content ) )
}
this[ /^(>   )(.*?)$/.source ]=
function( marker, content ){
marker = md.quoteMarker( marker )
content= md.inline( content )
return md.quote( marker + content )
}
this[ /^(http:\/\/www\.youtube\.com\/watch\?v=)(\w+)(.*$\n?)/.source ]=
this[ /^(http:\/\/youtu.be\/)(\w+)(.*$\n?)/.source ]=
function( prefix, id, close ){
var href= md.embedHref( prefix + id + close )
var uri= 'http://www.youtube.com/embed/' + id
var embed= md.embed( '<wc_aspect wc_aspect_ratio=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc_aspect>' )
return href + embed
}
this[ /^((?:[\?\/\.]|https?:|ftps?:|data:).*?)(?:(\\)((?:[\?\/\.]|https?:|ftps?:|data:).*?))?$(\n?)/.source ]=
function( src, middle, link, close ){
var prolog= md.embedHref( src + ( middle || '' ) + ( link || '' ) + close )
var embed= md.embed( '<a wc_link="true" href="' + $jam.htmlEscape( link || src ) + '"><img src="' + $jam.htmlEscape( src ) + '" /></a>' )
return prolog + embed
}
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
var rowSep= '<lang_md_table-row-sep><wc_lang-md_table-cell colspan="300">\n--</wc_lang-md_table-cell></lang_md_table-row-sep>'
rows[ r ]= rowSep + md.tableRow( row )
}
content= rows.join( '' )
return md.table( content )
}
this[ /^(#   )([^\n\r]*[\. ])?([\w-]+)((?:\n    [^\n]*)*)(?=\n|$)/.source ]=
function( marker, path, lang, content ){
content= content.replace( /\n    /g, '\n' )
content= $lang( lang )( content )
content= content.replace( /\n/g, '\n' + md.indent( '    ' ) )
content= md.codeContent( content )
marker= md.codeMarker( marker )
path= path ? md.codePath( path ) : ''
lang= md.codeLang( lang )
return md.code( marker + md.codeMeta( path + lang ) + content )
}
this[ /^(    .*)$/.source ]=
function( content ){
return md.para( md.inline( content ) )
}
})
return md
} 
;
var DISQUS= DISQUS || new function( ){
this.settings= {}
this.extend= function( target, source ){
for( var key in source ) target[ key ]= source[ key ]
}
}
$jam.Component( 'wc_disqus', function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var script= $jam.Node.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.uriEscape( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.md( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.Node.Element( 'wc_disqus_message' )
$jam.Node.Element( 'wc_disqus_author' ).text( user.display_name ).parent( message )
$jam.Node.Element( 'wc_disqus_content' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} );
$jam.Component
(   'wc_editor'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var source= $jam.htmlEscape( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
var hint= nodeRoot.attr( 'wc_editor_hint' ) || ''
nodeRoot.clear()
var nodeSource= $jam.Node.Element( 'div' ).attr( 'wc_editor_content', hint )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= function( addon, replace ){
addon= addon || ''
var hlighter= $lang ( nodeRoot.attr( 'wc_editor_hlight' ) )
var source= replace || $jam.html2text( nodeSource.html() )
if( !addon && source === sourceLast ) return
sourceLast= source
var nodeRange= $jam.DomRange().aimNodeContent( nodeSource )
var startPoint= $jam.DomRange().collapse2start()
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
}
var offsetCut= offsetEnd || source.length
source= source.substring( 0, offsetCut ) + addon + source.substring( offsetCut )
if( offsetStart >= offsetCut ) offsetStart= offsetStart + addon.length
if( offsetEnd >= offsetCut ) offsetEnd= offsetEnd + addon.length
source=
$jam.String( source )
.process( hlighter )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
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
}
var onEdit=
nodeRoot.listen( '$jam.eventEdit', $jam.Throttler( 100, function(){ update() } ) )
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
this[ 'o' ]= '•' // маркер списка
this[ 's' ]= '§' // параграф
this[ 'v' ]= '✓' // выполнено
this[ 'x' ]= '✗' // провалено
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
})
var onPaste=
nodeSource.listen( 'paste', function( event ){
$jam.schedule( 0, function( ){
var hlighter= $lang ( nodeRoot.attr( 'wc_editor_hlight' ) )
var source= hlighter.html2text( nodeSource.html() )
update( '', source )
})
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.Event( event )
if( event.keyAccel() ) return
if( $jam.Node( event.target() ).ancList( 'a' ).length() ) return
nodeRoot.attr( 'wc_editor_active', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.Event( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc_editor_active', false )
event.defaultBehavior( false )
})
var onDragEnter=
nodeRoot.listen( 'dragenter', function( event ){
event.defaultBehavior( false )
})
var onDragOver=
nodeRoot.listen( 'dragover', function( event ){
event.defaultBehavior( false )
})
var onDragLeave=
nodeRoot.listen( 'dragleave', function( event ){
event.defaultBehavior( false )
})
var onDrop=
nodeRoot.listen( 'drop', function( event ){
event.defaultBehavior( false )
function upload( file ){
var form = new FormData()
form.append( 'file', file )
var resource= '?image=' + Math.random()
var result= $jam.http( resource ).post( form )
var src= $jam.domx.parse( result ).select(' // * [ @so_uri = "' + resource + '" ] / @hyoo_image_maximal ').$.value
var link= $jam.domx.parse( result ).select(' // * [ @so_uri = "' + resource + '" ] / @hyoo_image_original ').$.value
update( '\n./' + src + '\\./' + link + '\n' )
}
var files= event.$.dataTransfer.files
for( var i= 0; i < files.length; ++i ){
upload( files[ i ] )
}
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
update()
nodeRoot.attr( 'wc_editor_inited', true )
if( nodeRoot.attr( 'wc_editor_active' ) == 'true' )
nodeSource.editable( true )
}
}
)
;
$jam.Component
(   'wc_field'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var nodeInput=
$jam.Node.Element( 'input' )
.attr( 'type', 'hidden' )
.attr( 'name', nodeRoot.attr( 'wc_field_name' ) )
.parent( nodeRoot )
nodeRoot.listen
(   '$jam.eventEdit'
,   sync
)
var onEdit=
nodeRoot.listen
(   '$jam.eventEdit'
,   sync
)
function sync( ){
var text= $jam.html2text( nodeRoot.html() ).replace( /[\n\r]+/g, '' )
nodeInput.$.value= text
}
sync()
return new function( ){
this.destroy= function(){
onEdit.sleep()
nodeInput.parent( null )
}
}
}
)
;
$jam.Component
(   'form'
,   new function( ){
var currentScript= $jam.currentScript()
return function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
if( !nodeRoot.attr( 'wc_form' ) ) return null
var nodeResult= nodeRoot.descList( 'wc_form_result' ).head()
var onCommit= nodeRoot.listen
(   $jam.eventCommit
,   send
)
var onSubmit= nodeRoot.listen
(   'submit'
,   send
)
var onClick= nodeRoot.listen
(   'click'
,   function( event ){
if( event.target().type !== 'submit' )
return
send( event )
}
)
function send( event ){
event.defaultBehavior( false )
console.log(event.$)
var method= nodeRoot.attr( 'method' ) || 'get'
if( nodeResult ){
nodeResult.text( '' )
} else if( method == 'get' ){
nodeRoot.$.submit()
return 
}
var nodes= nodeRoot.$.elements
var data= {}
if( event.target().name && event.target().value )
data[ event.target().name ]= event.target().value
for( var i= 0; i < nodes.length; ++i ){
var node= nodes[ i ]
data[ node.name ]= node.value
}
var response= $jam.http( nodeRoot.$.action ).request( method, data )
var location= response.$.evaluate( '//so_relocation', response.$, null, XPathResult.STRING_TYPE, null ).stringValue
if( location ) document.location= location
var templates= $jam.domx.parse( $jam.http( currentScript.src.replace( /[^\/]*$/, 'release.xsl' ) ).get() )
response= response.select(' / * / * ').transform( templates )
if( nodeResult ) nodeResult.html( response )
}
return new function(){
this.destroy= function( ){
onSubmit.sleep()
}
}
}
}
);
$jam.Component
(   'wc_hlight'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var hlight= $lang( nodeRoot.attr( 'wc_hlight_lang' ) )
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;
$jam.Component
(   'wc_js-bench_list'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var nodeHeader=
$jam.Node.parse( '<wc_js-bench_header title="ctrl + enter" />' )
.tail( $jam.Node.parse( '<wc_js-bench_runner>Run ►' ) )
.tail( $jam.Node.parse( '<wc_js-bench_column>inner (µs)' ) )
.tail( $jam.Node.parse( '<wc_js-bench_column>outer (µs)' ) )
nodeRoot.head( nodeHeader )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc_js-bench' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.Event()
.type( '$jam.eventCommit' )
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
$jam.Component
(   'wc_js-bench'
,   new function( ){
var queue=
$jam.TaskQueue()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.Node.parse( '<wc_js-bench_source><wc_editor wc_editor_hlight="js">' + $jam.htmlEscape( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.Node.parse( '<wc_js-bench_result class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.Node.parse( '<wc_js-bench_result class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.Node.Fragment() ) // for chrome 12
var calc= $jin_thread( function( source ){
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
var prefix= matches[1] + ';'
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
$jam.Node.Element( 'wc_js-bench' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.eventCommit', schedule )
var onClone=
nodeRoot.listen( '$jam.eventClone', clone )
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
;
void function( ){
var nodeSummary= $jam.Lazy( function( ){
return $jam.Value( $jam.Node.parse( '<a wc_js-test_summary="true" />' ).parent( $jam.body() ) )
} )
var refreshSummary= $jam.Throttler( 50, function( ){
var nodes= $jam.Node( document ).descList( 'wc_js-test' )
for( var i= 0; i < nodes.length(); ++i ){
var node= nodes.get( i )
switch( node.attr( 'wc_js-test_passed' ) ){
case 'true':
break
case 'false':
nodeSummary().attr( 'wc_js-test_passed', 'false' )
while( node && !node.attr( 'id' ) ) node= node.parent()
if( node ) nodeSummary().attr( 'href', '#' + node.attr( 'id' ) )
case 'wait':
return
}
}
nodeSummary().attr( 'wc_js-test_passed', 'true' )
nodeSummary().attr( 'href', '' )
} )
$jam.Component
(   'wc_js-test'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.Node( nodeRoot )
var exec= $jin_thread( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.String( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.Node.Element( 'wc_js-test_source' ).parent( nodeRoot )
var nodeSource= $jam.Node.parse( '<wc_editor wc_editor_hlight="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.Node.Element( 'wc_hontrol' ).parent( nodeRoot )
var nodeClone= $jam.Node.parse( '<wc_hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.Node.parse( '<wc_hontrol_delete>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
refreshSummary()
if( passed() === 'wait' ) return
passed( false )
throw new Error( 'Test already done' )
}
_test.ok=
$jam.Poly
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
,   function( a, b, c ){
checkDone()
passed(( a === b )&&( a === c ))
printValue( a )
if(( a !== b )||( a !== c )){
printValue( b )
printValue( c )
throw new Error( 'Results is not equal' )
}
}
)
_test.not=
$jam.Poly
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
refreshSummary()
passed( false )
print( 'Timeout!' )
stop= null
throw new Error( 'Timeout!' )
}
_test.deadline=
$jam.Poly
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.schedule( ms, noMoreWait )
}
)
var passed=
$jam.Poly
(   function( ){
return nodeRoot.attr( 'wc_js-test_passed' )
}
,   function( val ){
nodeRoot.attr( 'wc_js-test_passed', val )
}
)
var print=
function( val ){
var node= $jam.Node.Element( 'wc_js-test_result' )
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
print( $jam.classOf( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc_js-test_result' )
for( var i= 0; i < results.length(); ++i ){
results.get(i).parent( null )
}
passed( 'wait' )
stop= null
if( !exec() ) passed( false )
if(( !stop )&&( passed() === 'wait' )) passed( false )
refreshSummary()
}
var clone=
function( ){
run()
var node=
$jam.Node.Element( 'wc_js-test' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.eventCommit', run )
var onClone=
nodeRoot.listen( '$jam.eventClone', clone )
var onClone=
nodeRoot.listen( '$jam.eventDelete', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventClone' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
_test.ok= _test.not= $jam.Value()
refreshSummary()
}
}
}
)
}();
$jam.Component
(   'wc_net-bridge'
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
xhr.open( 'POST' , nodeRoot.attr( 'wc_net-bridge_resource' ) )
xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
xhr.send( nodeRoot.attr( 'wc_net-bridge_field' ) + '=' + encodeURIComponent( text ) )
textLast= text
nodeRoot.state( 'modified', false )
}
return new function( ){
}
}
)
;
$jam.Component
(   'wc_preview'
,   function( nodeRoot ){
nodeRoot=
$jam.Node( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.Node.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.Poly
(   function(){
return nodeRoot.state( 'opened' ) != 'false'
}
,   function( val ){
nodeRoot.state( 'opened', val )
return opened
}
)
nodeLink.listen( 'click', function( event ){
if( event.button() !== 0 ) return
opened( !opened() )
event.defaultBehavior( false )
})
}
)
;
this.$jin_method= function( func ){
if( typeof func !== 'function' )
return func
var method= function( ){
var args= [].slice.call( arguments )
args.unshift( this )
return func.apply( null, args )
}
method.call= func
return method
}
;
this.$jin_class= function( scheme ){
var factory= function( ){
if( this instanceof factory ) return
return factory.make.apply( factory, arguments )
}
var proto= factory.prototype
factory.scheme= scheme
factory.make= function( ){
var obj= new this
obj.init.apply( obj, arguments )
return obj
}
proto.init= function( obj ){ }
proto.destroy= function( obj ){
for( var key in obj ){
if( !obj.hasOwnProperty( key ) )
continue
delete obj[ key ]
}
}
scheme( factory, proto )
for( var key in proto ){
if( !proto.hasOwnProperty( key ) )
continue
proto[ key ]= $jin_method( proto[ key ] )
}
return factory
}
;
this.$jin_test= $jin_class( function( $jin_test, test ){
test.passed= null
test.timeout= null
test.onDone= null
test.timer= null
test.asserts= null
test.results= null
test.errors= null
test.init= function( test, code, onDone ){
test.asserts= []
test.results= []
test.errors= []
test.onDone= onDone || function(){}
var complete= false
test.callback( function( ){
if( typeof code === 'string' )
code= new Function( 'test', code )
if( !code ) return
code( test )
complete= true
} ).call( )
if( !complete ) test.passed= false
if(( test.passed == null )&&( test.timeout != null )){
test.timer= setTimeout( function( ){
test.asserts.push( false )
test.errors.push( new Error( 'timeout(' + test.timeout + ')' ) )
test.done()
}, test.timeout )
} else {
test.done()
}
}
var AND= function( a, b ){ return a && b }
test.done= function( test ){
test.timer= clearTimeout( test.timer )
if( test.passed == null )
test.passed= test.asserts.reduce( AND, true )
test.onDone.call( null, test )
}
var compare= function( a, b ){
return Number.isNaN( a )
? Number.isNaN( b )
: ( a === b )
}
test.ok= function( test, value ){
switch( arguments.length ){
case 1:
var passed= true
break
case 2:
var passed= !!value
break
default:
for( var i= 2; i < arguments.length; ++i ){
var passed= compare( arguments[ i ], arguments[ i - 1 ] )
if( !passed ) break;
}
}
test.asserts.push( passed )
test.results.push( [].slice.call( arguments, 1 ) )
return test
}
test.not= function( test, value ){
switch( arguments.length ){
case 1:
var passed= false
break
case 2:
var passed= !value
break
default:
for( var i= 2; i < arguments.length; ++i ){
var passed= !compare( arguments[ i ], arguments[ i - 1 ] )
if( !passed ) break;
}
}
test.asserts.push( passed )
test.results.push( [].slice.call( arguments, 1 ) )
return test
}
test.callback= function( test, func ){
return $jin_thread( function( ){
try {
return func.apply( this, arguments )
} catch( error ){
test.errors.push( error )
throw error
}
} )
}
var destroy= test.destroy
test.destroy= function( test ){
test.timer= clearTimeout( test.timer )
destroy( test )
}
} );
void function( ){
var nodeSummary= $jam.Lazy( function( ){
return $jam.Value( $jam.Node.parse( '<a wc_test_summary="true" />' ).parent( $jam.body() ) )
} )
var refreshSummary= $jam.Throttler( 50, function( ){
var nodes= $jam.Node( document ).descList( 'script' )
for( var i= 0; i < nodes.length(); ++i ){
var node= nodes.get( i )
switch( node.attr( 'wc_test_passed' ) ){
case 'true':
break
case 'false':
nodeSummary().attr( 'wc_test_passed', 'false' )
while( node && !node.attr( 'id' ) ) node= node.parent()
if( node ) nodeSummary().attr( 'href', node.attr( 'id' ) )
case 'wait':
return
}
}
nodeSummary().attr( 'wc_test_passed', 'true' )
nodeSummary().attr( 'href', '' )
} )
$jam.Component
(   'script'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
if( nodeRoot.attr( 'type' ) !== 'wc_test' ) return null
return new function( ){
var source= $jam.String( nodeRoot.html() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.Node.Element( 'wc_test_source' ).parent( nodeRoot )
var nodeSource= $jam.Node.parse( '<wc_editor wc_editor_hlight="js" />' ).text( source ).parent( nodeSource0 )
var nodeLogs= $jam.Node.Element( 'wc_test_logs' ).parent( nodeRoot )
var nodeControls= $jam.Node.Element( 'wc_hontrol' ).parent( nodeRoot )
var nodeClone= $jam.Node.parse( '<wc_hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.Node.parse( '<wc_hontrol_delete>delete' ).parent( nodeControls )
var checkDone= function( ){
refreshSummary()
if( passed() === 'wait' ) return
passed( false )
throw new Error( 'Test already done' )
}
var stop
var passed=
$jam.Poly
(   function( ){
return nodeRoot.attr( 'wc_test_passed' )
}
,   function( val ){
nodeRoot.attr( 'wc_test_passed', val )
}
)
var printError=
function( val ){
var node= $jam.Node.Element( 'wc_test_error' )
node.text( val )
nodeLogs.tail( node )
}
var dumpValue=
function( val ){
if( typeof val === 'function' ){
if( !val.hasOwnProperty( 'toString' ) ){
return 'Function: [object Function]'
}
}
return $jam.classOf( val ) + ': ' + val
}
var printResults=
function( list ){
var node= $jam.Node.Element( 'wc_test_results' )
for( var j= 0; j < list.length; ++j ){
var val= $jam.Node.Element( 'wc_test_results_value' )
val.text( dumpValue( list[ j ] ) )
node.tail( val )
}
nodeLogs.tail( node )
}
var run=
function( ){
nodeLogs.clear()
passed( 'wait' )
$jin_test( nodeSource.text(), update )
}
var update=
function( test ){
passed( test.passed )
for( var i= 0; i < test.results.length; ++i ){
printResults( test.results[ i ] )
}
for( var i= 0; i < test.errors.length; ++i ){
printError( test.errors[ i ] )
}
refreshSummary()
}
var clone=
function( ){
run()
var node=
$jam.Node.Element( 'script' ).attr( 'type', 'wc_test' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.eventCommit', run )
var onClone=
nodeRoot.listen( '$jam.eventClone', clone )
var onClone=
nodeRoot.listen( '$jam.eventDelete', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventClone' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
refreshSummary()
}
}
}
)
}();
$jam.Component
(   'iframe'
,   function( nodeRoot ){
nodeRoot= $jam.Node( nodeRoot )
if( !nodeRoot.attr( 'wc_yasearchresult' ) )
return null
return new function( ){
var observer=
$jam.Observer()
.node( document )
.eventName( '$jam.eventURIChanged' )
.handler( function(){
if( update() )
window.history.replaceState( null, null, document.location.search )
})
.listen()
function update( ){
var data= document.location.hash.substring(1)
var height= parseInt( data )
if( data != height )
return false
nodeRoot.$.style.height= height + 'px'
return true
}
update()
this.destroy= function(){
observer.sleep()
}
}
}
)
var scripts= document.getElementsByTagName( 'script' )
var currentScript= document.currentScript || scripts[ scripts.length - 1 ]
if( currentScript.src ) eval( currentScript.innerHTML )
}
}( this.window, this.document )