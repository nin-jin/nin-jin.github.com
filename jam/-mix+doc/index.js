;if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
;$jam.EU= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.EU: ' + String( val )
}
return value
}
;$jam.EV= $jam.EU( this )
;$jam.EW=
new function( ){
var Ghost= function(){}
return function( key, value ){
var keyList= key.split( '.' )
var obj= $jam.EV()
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
;$jam.EW( '$jam.FE', $jam.EU( $jam.EV().document ) )
;$jam.EW
(   '$jam.FB'
,   function( timeout, proc ){
var timerID= $jam.EV().setTimeout( proc, timeout )
return function( ){
$jam.EV().clearTimeout( timerID )
}
}
)
;$jam.EW
(   '$jam.FF.then'
,   function( proc ){
var checker= function( ){
if( $jam.FF() ) proc()
else $jam.FB( 10, checker )
}
checker()
}
)
;$jam.EW
(   '$jam.FF'
,   function( ){
var state= $jam.FE().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.GU=
function( ns ){
if( !$jam.FE().getElementsByTagNameNS ) return
var nodeList= $jam.FE().getElementsByTagNameNS( ns, '*' )
var docEl= $jam.FE().documentElement
var tracking= function( ){
sleep()
var node
while( node= nodeList[0] ){
var parent= node.parentNode
var newNode= $jam.FE().createElement( node.nodeName )
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
$jam.FF.then( tracking )
tracking()
function rise( ){
docEl.addEventListener( 'DOMNodeInserted', tracking, false )
}
function sleep( ){
docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
}
}
;$jam.EW
(   '$jam.FG'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.EW
(   '$jam.FH'
,   new function(){
var Support= function( state ){
var sup= $jam.EU( state )
sup.select= function( map ){
return $jam.FG( this(), map )
}
return sup
}
var node= $jam.FE().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.EV().DOMParser && $jam.EV().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.EW
(   '$jam.FI'
,   function( tagName, factory ){
if(!( this instanceof $jam.FI )) return new $jam.FI( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.FE().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.FE().documentElement.namespaceURI
var checkName=
( tagName === '*' )
?    $jam.EU( true )
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
$jam.EV().setInterval( tracking, 200 )
$jam.FF.then(function whenReady(){
$jam.EV().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.FE().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.FH.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.FH.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
}, false )
this.tagName= $jam.EU( tagName )
this.factory= $jam.EU( factory )
this.elements=
function elements( ){
return elements.slice( 0 )
}
tracking()
}
)
;$jam.EX=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.EX
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
;$jam.EW
(   '$jam.EY'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.EW
(   '$jam.FO'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.EW
(   '$jam.FP'
,   new function(){
var fromCharCode= $jam.EV().String.fromCharCode
var parseInt= $jam.EV().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.FO[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.EW
(   '$jam.FQ'
,   function( html ){
return $jam.FP
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.EW
(   '$jam.FS'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === $jam.EV() ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;$jam.EW
(   '$jam.FT'
,   $jam.EX( function( klass, proto ){
proto.constructor=
$jam.EY
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
$jam.EY
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.FS( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.FS( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.EY
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.FS( keyList ) === 'String' ){
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
if( $jam.FS( cur[ key ] ) === 'Object' ){
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
if( $jam.FS( json ) === 'String' ){
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
$jam.EY
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
;$jam.EW
(   '$jam.FU'
,   $jam.EX( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.FV( node )
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
;$jam.EW
(   '$jam.FK'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.EX ) return obj
return klass.raw( obj )
}
)
;$jam.FW=
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
;$jam.FX=
$jam.EX( function( klass, proto ){
proto.constructor=
$jam.EY
(   function( ){
this.$= $jam.FE().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.EY
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.EY
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.EY
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.EY
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.EY
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.EY
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.EY
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.FW( code ) ]= code
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
$jam.EY
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
$jam.EY
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
$jam.FK( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.EW
(   '$jam.FY'
,   $jam.EX( function( klass, proto ){
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
$jam.EY
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
$jam.EY
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.FK( node )
return this
}
)
proto.handler=
$jam.EY
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.FX( event ) )
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
$jam.EY
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
;$jam.EW
(   '$jam.FV'
,   $jam.EX( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.FE().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.FE().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.FE().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.FE().createDocumentFragment() )
}
proto.text=
$jam.EY
(   function( ){
return $jam.FQ( this.$.innerHTML )
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
$jam.EY
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
$jam.EY
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
$jam.EY
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.FT({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.FT({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.EY
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
return $jam.FU( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.FU( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.FU( filtered )
}
proto.parent= 
$jam.EY
(   function( ){
return $jam.FV( this.$.parentNode )
}
,   function( node ){
node= $jam.FK( node )
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
var node= $jam.FK( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.FV.Text( '\r\n' ) )
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
$jam.EY
(   function(){
return $jam.FV( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.FK( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.EY
(   function(){
return $jam.FV( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.FK( node ) )
return this
}
)
proto.next=
$jam.EY
(   function(){
return $jam.FV( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.FK( node ), next ) 
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
$jam.EY
(   function(){
return $jam.FV( this.$.previousSibling )
}
,   function( node ){
node= $jam.FK( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.EY
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
var fragment= $jam.FV.Fragment()
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
return $jam.FV( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.FV( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.FY()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.FI
(   'a'
,   function( el ){
var isTarget= ( el.href == $jam.FE().location.href )
$jam.FV( el ).state( 'target', isTarget )
}
)
;$jam.EW
(   '$jam.EZ'
,   $jam.EX( function( klass, proto ){
proto.constructor=
$jam.EY
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
;$jam.EW
(    '$jam.FA'
,    function( func ){
var cache= $jam.EZ()
return function( key ){
if( cache.has( key ) ) return cache.get( key )
var value= func.apply( this, arguments )
cache.put( key, value )
return value 
}
}
)
;$jam.FC=
$jam.EX( function( klass, proto ){
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
;$jam.EW
(   '$jam.FD'
,   $jam.EX( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.EY
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
$jam.EY
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
$jam.EY
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
$jam.FB
(   this.latency()
,   $jam.FC( this )
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
;$jam.EW
(   '$jam.FJ'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$jam.EW
(   '$jam.FL'
,   $jam.EX( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.FK( data ) || '' )
return this
}
proto.incIndent=
$jam.EY
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.EY
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.EY
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
$jam.EY
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.EY
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
$jam.EY
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.EY
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
$jam.EY
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.EY
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.EY
(   function( ){
return this.$
}
)
})
)
;$jam.EW
(   '$jam.FM'
,   $jam.EX( function( klass, proto ){
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
$jam.FH.xmlModel.select(
{   'w3c': function( ){
var serializer= new XMLSerializer
var text= serializer.serializeToString( this.$ )
return text
}
,   'ms': function( ){
return $jam.FL( this.$.xml ).trim().$
}
})
proto.transform=
$jam.FH.xmlModel.select(
{   'w3c': function( stylesheet ){
var proc= new XSLTProcessor
proc.importStylesheet( $jam.FK( stylesheet ) )
var doc= proc.transformToDocument( this.$ )
return $jam.FM( doc )
}
,   'ms': function( stylesheet ){
var text= this.$.transformNode( $jam.FK( stylesheet ) )
return $jam.FM.parse( text )
}
})
klass.parse=
$jam.FH.xmlModel.select(
{   'w3c': function( str ){
var parser= new DOMParser
var doc= parser.parseFromString( str, 'text/xml' )
return $jam.FM( doc )
}
,   'ms': function( str ){
var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
doc.async= false
doc.loadXML( str )
return $jam.FM( doc )
}
})
})
)
;$jam.EW
(  '$jam.FN'
,   function( ){
return $jam.EV().getSelection()
}
)
;$jam.EW
(   '$jam.FR'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;$jam.EW
(   '$jam.FZ'
,   $jam.EX( function( klass, proto ){
proto.constructor=
$jam.EY
(   function( ){
var sel= $jam.FN()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= $jam.FE().createRange()
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
var sel= $jam.FN()
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
$jam.EY
(   function( ){
return $jam.FQ( this.html() )
}
,   function( text ){
this.html( $jam.FR( text ) )
return this
}
)
proto.html=
$jam.EY
(   function( ){
return $jam.FV( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.FV.parse( html ).$ : $jam.FV.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.FK( node )
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
range= $jam.FZ( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.FZ( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.FZ( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.FV( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.FV( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.FZ().aimNode( current )
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
var range= $jam.FZ().aimNode( current )
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
return $jam.FZ( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.FK( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.FK( node ) )
return this
}
})
)
;$jam.EW
(   '$jam.GA'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.EU( gen )
return lazy
}
)
;$jam.EW
(   '$jam.GB'
,   $jam.EX( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.GB.escape( chunk )
str+= chunk
}
return $jam.GB( str )
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
;$jam.EW
(   '$jam.GC'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.GB( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.GB(regexp).count()
return $jam.EX( function( klass, proto ){
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
;$jam.EW
(   '$jam.GD'
,   $jam.EX( function( klass, proto ){
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
;$jam.EW
(   '$jam.GE'
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
;$jam.EW
(    '$jam.GF'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.GE()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.GC( lexems )
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
;$jam.EW
(   '$jam.GG'
,   $jam.EX( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.FD()
.handler( $jam.FC( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.EY
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.EY
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
;$jam.EW
(   '$jam.GH'
,   new function( ){
var factory= function( arg ){
if( !arg ) arg= {}
var open= arg.tokens && arg.tokens[0] || '{'
var close= arg.tokens && arg.tokens[1] || '}'
var openEncoded= $jam.GB.escape( open )
var closeEncoded= $jam.GB.escape( close )
var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
var parse= $jam.GF( new function(){
this[ openEncoded + openEncoded ]=
$jam.EU( open )
this[ closeEncoded +closeEncoded ]=
$jam.EU( close )
this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
Selector
})
return $jam.EX( function( klass, proto ){
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
$jam.EY
(   $jam.GA( function( ){
return $jam.EU( factory.Selector( $jam.GE() ) )
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
selector.toString= $jam.EU( str )
return selector
}
}
)
return factory
}
)
;$jam.EW
(   '$jam.GI'
,   $jam.GA( function(){
var poolNode= $jam.GA( function(){
var body= $jam.FE().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.FE().createElement( 'wc:A:pool' )
pool.style.display= 'none'
body.insertBefore( pool, body.firstChild )
return $jam.EU( pool )
})
var free= []
return function( proc ){
return function( ){
var res
var self= this
var args= arguments
var starter= free.pop()
if( !starter ){
var starter= $jam.FE().createElement( 'button' )
poolNode().appendChild( starter )
}
starter.onclick= function( ev ){
( ev || $jam.EV().event ).cancelBubble= true
res= proc.apply( self, args )
}
starter.click()
free.push( starter )
return res
}
}
})
)
;$jam.EW
(    '$jam.GJ'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.FB( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.EW
(   '$jam.GK'
,   function( map ){
var Selector= function( str, key ){
var keyList= key.split( ':' )
var fieldName= keyList.shift()
var selector= function( data ){
var value= ( fieldName === '.' ) ? data : data[ fieldName ]
if( value ) return selector
}
selector.toString= $jam.EU( str )
return selector
}
var Template= $jam.GH({ Selector: Selector })
for( var key in map ) map[ key ]= Template( map[ key ] )
return 
}
)
;$jam.EW
(   '$jam.GL'
,   $jam.EX( function( klass, proto ){
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
var lineParser= $jam.GB.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$
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
return $jam.GL( data )
}
return parser
}
})
)
;$jam.EW
(   '$jam.GM'
,   function( ){
return $jam.FE().body
}
)
;$jam.EW
(   '$jam.GN'
,   $jam.GI(function( source ){
return $jam.EV().eval( source )
})
)
;$jam.EW
(   '$jam.GO'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.FX().type( '$jam.GO' ).scream( event.target() )
}
$jam.FV( $jam.FE().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.EW
(   '$jam.GP'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.FX().type( '$jam.GP' ).scream( event.target() )
}
$jam.FV( $jam.FE().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.EW
(   '$jam.GQ'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.EV().confirm( 'Are you sure to delee this?' ) ) return
$jam.FX().type( '$jam.GQ' ).scream( event.target() )
}
$jam.FV( $jam.FE().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.EW
(   '$jam.GR'
,   new function(){
var scream=
$jam.GJ
(   50
,   function( target ){
$jam.FX().type( '$jam.GR' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.FV( $jam.FE().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.EW
(   '$jam.GS'
,   new function(){
var handler=
function( event ){
$jam.FX()
.type( '$jam.$eventScroll' )
.wheel( event.wheel() )
.scream( event.target() )
}
var docEl= $jam.FV( $jam.FE().documentElement )
docEl.listen( 'mousewheel', handler )
docEl.listen( 'DOMMouseScroll', handler )
}
)
;$jam.EW
(   '$jam.GT'
,   new function(){
var lastURI= $jam.FE().location.href
var refresh=
function( ){
var newURI= $jam.FE().location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.FX().type( '$jam.GT' ).scream( $jam.FE() )
}
$jam.EV().setInterval( refresh, 20)
}
)
;$jam.EW
(   '$jam.GV'
,   new function(){
var console= $jam.EV().console
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
;$jam.EW
(   '$jam.GW'
,   $jam.EV().encodeURIComponent
)
;$jam.FI
(   'wc:N'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.FV( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc:EA' ) )
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
;this.$lang=
function( name ){
return $lang[ name ] || $lang.T
}
$lang.T= $jam.FR
;$lang.GX=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;$lang.GY=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.T
return $jam.GE
(   $jam.GF( map )
,   $jam.FJ()
)
}
;$lang.V=
new function(){
var css=
function( str ){
return css.root( css.stylesheet( str ) )
}
css.root= $lang.GX( 'lang:V' )
css.remark= $lang.GX( 'lang:W' )
css.string= $lang.GX( 'lang:AC' )
css.bracket= $lang.GX( 'lang:AD' )
css.selector= $lang.GX( 'lang:X' )
css.tag= $lang.GX( 'lang:Y' )
css.id= $lang.GX( 'lang:Z' )
css.klass= $lang.GX( 'lang:AA' )
css.pseudo= $lang.GX( 'lang:AB' )
css.property= $lang.GX( 'lang:AE' )
css.value= $lang.GX( 'lang:AF' )
css.stylesheet=
$lang.GY( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.GE( $lang.T, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.GE( $lang.T, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.GE( $lang.T, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.GE( $lang.T, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.GE( $lang.T, css.pseudo )
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
$lang.GY( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.GE( $lang.T, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.GE( $lang.T, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.GE( $lang.T, css.value )
})
return css
}
;$lang.AG=
new function(){
var pcre=
function( str ){
return pcre.root( pcre.content( str ) )
}
pcre.root= $lang.GX( 'lang:AG' )
pcre.backslash= $lang.GX( 'lang:AH' )
pcre.control= $lang.GX( 'lang:AJ' )
pcre.spec= $lang.GX( 'lang:AI' )
pcre.text= $lang.GX( 'lang:EB' )
pcre.content=
$lang.GY( new function(){
this[ /\\([\s\S])/.source ]=
new function( ){
var backslash= pcre.backslash( '\\' )
return function( symbol ){
return backslash + pcre.spec( $lang.T( symbol ) )
}
}
this[ /([(){}\[\]$*+?^])/.source ]=
$jam.GE( $lang.T, pcre.control )
})
return pcre
}
;$lang.AK=
new function(){
var js=
function( str ){
return js.root( js.content( str ) )
}
js.root= $lang.GX( 'lang:AK' )
js.remark= $lang.GX( 'lang:AL' )
js.string= $lang.GX( 'lang:AM' )
js.internal= $lang.GX( 'lang:AN' )
js.external= $lang.GX( 'lang:AO' )
js.keyword= $lang.GX( 'lang:AP' )
js.number= $lang.GX( 'lang:AQ' )
js.regexp= $lang.GX( 'lang:AR' )
js.bracket= $lang.GX( 'lang:AS' )
js.operator= $lang.GX( 'lang:AT' )
js.content=
$lang.GY( new function(){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.GE( $lang.T, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.GE( $lang.T, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.GE( $lang.T, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.GE( $lang.T, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.GE( $lang.AG, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.GE( $lang.T, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.GE( $lang.T, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.GE( $lang.T, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.GE( $lang.T, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.GE( $lang.T, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.GE( $lang.T, js.operator )
})
return js
}
;$lang.AU=
new function(){
var sgml=
function( str ){
return sgml.root( sgml.content( str ) )
}
sgml.root= $lang.GX( 'lang:AU' )
sgml.tag= $lang.GX( 'lang:AV' )
sgml.tagBracket= $lang.GX( 'lang:EC' )
sgml.tagName= $lang.GX( 'lang:AW' )
sgml.attrName= $lang.GX( 'lang:AX' )
sgml.attrValue= $lang.GX( 'lang:AY' )
sgml.comment= $lang.GX( 'lang:AZ' )
sgml.decl= $lang.GX( 'lang:BA' )
sgml.tag=
$jam.GE
(   $lang.GY( new function(){
this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
function( bracket, tagName ){
return sgml.tagBracket( $lang.T( bracket ) ) + sgml.tagName( tagName )
} 
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.V.style( value ) + close )
return prefix + name + sep + value
}
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.AK( value ) + close )
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
,   $lang.GX( 'lang:AV' )
)
sgml.content=
$lang.GY( new function(){
this[ /(<!--[\s\S]*?-->)/.source ]=
$jam.GE( $lang.T, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.GE( $lang.T, sgml.decl )
this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.AU.tag( prefix )
postfix= $lang.AU.tag( postfix )
content= $lang.V( content )
return prefix + content + postfix
}
this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.AU.tag( prefix )
postfix= $lang.AU.tag( postfix )
content= $lang.AK( content )
return prefix + content + postfix
}
this[ /(<[^>]+>)/.source ]=
sgml.tag
})
return sgml
}
;$jam.FI
(   'wc:B'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FV( nodeRoot )
var source= $jam.FL( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.FV.Element( 'wc:BB' )
.parent( nodeRoot )
var nodeSource0=
$jam.FV.Element( 'wc:BC' )
.parent( nodeRoot )
var nodeSource=
$jam.FV.parse( '<wc:BM wc:ED="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jam.GI( function( ){
var source= $jam.FL( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
//nodeSource.text( source )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.FV( scripts[i] )
$jam.GN( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.GP', exec )
this.destroy=
function( ){
onCommit.sleep()
}
}
}
)
;$lang.EE=
new function( ){
var php=
function( str ){
return php.root( php.content( str ) )
}
php.root= $lang.GX( 'lang:EE' )
php.dollar= $lang.GX( 'lang:BD' )
php.variable= $lang.GX( 'lang:BE' )
php.string= $lang.GX( 'lang:BF' )
php.number= $lang.GX( 'lang:BI' )
php.func= $lang.GX( 'lang:BG' )
php.keyword= $lang.GX( 'lang:BH' )
php.content=
$lang.GY( new function(){
this[ /\b(__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
$jam.GE( $lang.T, php.keyword )
this[ /(\$)(\w+)\b/.source ]=
function( dollar, variable ){
dollar= $lang.EE.dollar( dollar )
variable= $lang.EE.variable( variable )
return dollar + variable
}
this[ /(\w+)(?=\s*\()/.source ]=
php.func
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.GE( $lang.T, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.GE( $lang.T, php.number )
})
return php
}
;$jam.EW
(    '$lang.EF'
,    new function(){
var tags=
function( str ){
return tags.root( tags.content( str ) )
}
tags.root= $lang.GX( 'lang:EF' )
tags.item= $lang.GX( 'lang:EG' )
tags.content=
$lang.GY( new function(){
this[ /^(\s*?)([^\n\r]+)(\s*?)$/.source ]=
function( open, text, close ){
return open + '<a href="?gist/list/' + $jam.FR( text ) + '">' + tags.item( text ) + '</a>' + close
}
})
return tags
}
) 
;$lang.BJ=
new function(){
var md=
function( str ){
return md.root( md.content( str ) )
}
md.root= $lang.GX( 'lang:BJ' )
md.header1= $lang.GX( 'lang:CA' )
md.header2= $lang.GX( 'lang:BZ' )
md.header3= $lang.GX( 'lang:BY' )
md.header4= $lang.GX( 'lang:EH' )
md.header5= $lang.GX( 'lang:EI' )
md.header6= $lang.GX( 'lang:EJ' )
md.headerMarker= $lang.GX( 'lang:CB' )
md.quote= $lang.GX( 'lang:CC' )
md.quoteMarker= $lang.GX( 'lang:CD' )
md.quoteInline= $lang.GX( 'lang:CE' )
md.quoteInlineMarker= $lang.GX( 'lang:CF' )
md.image= $lang.GX( 'lang:BP' )
md.imageHref= $lang.GX( 'lang:BQ' )
md.embed= $lang.GX( 'lang:BK' )
md.embedHref= $lang.GX( 'lang:BL' )
md.link= $lang.GX( 'lang:BR' )
md.linkMarker= $lang.GX( 'lang:BU' )
md.linkTitle= $lang.GX( 'lang:BS' )
md.linkHref= $lang.GX( 'lang:BT' )
md.author= $lang.GX( 'lang:BV' )
md.indent= $lang.GX( 'lang:BW' )
md.escapingMarker= $lang.GX( 'lang:CQ' )
md.emphasis= $lang.GX( 'lang:CR' )
md.emphasisMarker= $lang.GX( 'lang:CS' )
md.strong= $lang.GX( 'lang:CT' )
md.strongMarker= $lang.GX( 'lang:CU' )
md.super= $lang.GX( 'lang:CV' )
md.superMarker= $lang.GX( 'lang:CW' )
md.sub= $lang.GX( 'lang:CX' )
md.subMarker= $lang.GX( 'lang:CY' )
md.math= $lang.GX( 'lang:CG' )
md.remark= $lang.GX( 'lang:CZ' )
md.table= $lang.GX( 'lang:CH' )
md.tableRow= $lang.GX( 'lang:CI' )
md.tableCell= $lang.GX( 'lang:CK' )
md.tableMarker= $lang.GX( 'lang:CL' )
md.code= $lang.GX( 'lang:CM' )
md.codeMarker= $lang.GX( 'lang:CN' )
md.codeLang= $lang.GX( 'lang:CO' )
md.codeContent= $lang.GX( 'lang:CP' )
md.html= $lang.GX( 'lang:EK' )
md.htmlTag= $lang.GX( 'lang:EL' )
md.htmlContent= $lang.GX( 'lang:EM' )
md.para= $lang.GX( 'lang:BX' )
md.inline=
$lang.GY( new function(){
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
return md.link( '<a href="' + $jam.FR( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
// image
// [url]
this[ /(\[)([^\[\]]+)(\])/.source ]=
function( open, href, close ){
return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.FR( href ) + '"><object data="' + $jam.FR( href ) + '"></object></a>' )
}
// emphasis
// /some text/
this[ /([^\s"({[]\/)/.source ]=
$lang.T
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
$lang.T            
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
$lang.GY( new function(){
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
var embed= md.embed( '<wc:N wc:EA=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:N>' )
return href + embed
}
// image
// http://gif1.ru/gifs/267.gif
this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
function( url, close ){
var href= md.embedHref( url + close )
url= url.replace( /\xAD/g, '' )
var embed= md.embed( '<a href="' + $jam.FR( url ) + '"><image src="' + $jam.FR( url ) + '" /></a>' )
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
var rowSep= '<lang:CJ><wc:EN colspan="300">\n--</wc:EN></lang:CJ>'
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
;var DISQUS= DISQUS || new function( ){
this.settings= {}
this.extend= function( target, source ){
for( var key in source ) target[ key ]= source[ key ]
}
}
$jam.FI( 'wc:EO', function( nodeRoot ){
nodeRoot= $jam.FV( nodeRoot )
var script= $jam.FV.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.GW( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.BJ( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.FV.Element( 'wc:EP' )
$jam.FV.Element( 'wc:EQ' ).text( user.display_name ).parent( message )
$jam.FV.Element( 'wc:ER' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} )
;$jam.FI
(   'wc:BM'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FV( nodeRoot )
var source= $jam.FR( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
nodeRoot.clear()
var nodeSource= $jam.FV.parse( '<div class=" wc_editor_content " />' )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= $jam.GJ( 50, function( ){
//var source= $jam.FL( nodeSource.text() ).replace( /\n?\r?$/, '\n' ).$
var source= nodeSource.text()
if( source === sourceLast ) return
sourceLast= source
source=
$jam.FL( source )
.process( $lang( nodeRoot.attr( 'wc:ED' ) ) )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
//.replace( /[^\n<>](?:<[^<>]+>)*$/, '$&\n' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
var nodeRange= $jam.FZ().aimNodeContent( nodeSource )
var startPoint= $jam.FZ().collapse2start()
//console.log(nodeRange.html())
var endPoint= $jam.FZ().collapse2end()
var hasStart= nodeRange.hasRange( startPoint )
var hasEnd= nodeRange.hasRange( endPoint )
if( hasStart ){
var metRange= $jam.FZ()
.equalize( 'end2start', startPoint )
.equalize( 'start2start', nodeRange )
var offsetStart= metRange.text().length
}
if( hasEnd ){
var metRange= $jam.FZ()
.equalize( 'end2start', endPoint )
.equalize( 'start2start', nodeRange )
var offsetEnd= metRange.text().length
//console.log(metRange.html(),metRange.text(), offsetEnd)
}
//console.log(offsetStart,offsetEnd)
nodeSource.html( source )
var selRange= $jam.FZ()
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
//if( source.charAt( source.length -1 ) !== '\n' ) nodeSource.tail( $jam.FV.Text( '\n' ) )
//if( !source ) $jam.FZ().aimNode( nodeSource.head() ).collapse2end().select()
//if( nodeSource.tail() && nodeSource.tail().name() !== 'br' ) nodeSource.tail( $jam.FV.Element( 'br' ) )
} )
var onEdit=
nodeRoot.listen( '$jam.GR', update )
var onEnter=
nodeRoot.listen( 'keypress', function( event ){
event= $jam.FX( event )
if( !event.keyCode().enter ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.FZ().html( '<br/>' ).collapse2end().select()
})
var onAltSymbol=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.FX( event )
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
var symbol= symbolSet[ $jam.FW( event.keyCode() ) ]
if( !symbol ) return
event.defaultBehavior( false )
$jam.FZ().text( symbol ).collapse2end().select()
})
//var onBackspace=
//nodeRoot.listen( 'keydown', function( event ){
//    event= $jam.FX( event )
//    if( event.keyCode() != 8 ) return
//    if( event.keyAccel() ) return
//    event.defaultBehavior( false )
//    var fullRange= $jam.FZ().aimNodeContent( nodeSource )
//    var newOffset= fullRange.clone().equalize( 'end2start', $jam.FZ() ).text().length - 1
//    if( newOffset < 0 ) newOffset= 0
//    var range= fullRange.clone().move( newOffset ).equalize( 'end2end', $jam.FZ() )
//    range.dropContents()
//})
var onTab=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.FX( event )
if( !event.keyCode().tab ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.FZ().text( '    ' ).collapse2end().select()
})
var onLeave=
nodeSource.listen( 'blur', function( event ){
$jam.FX().type( '$jam.GP' ).scream( nodeRoot )
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.FX( event )
if( !event.keyMeta() ) return
nodeRoot.attr( 'wc:BN', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.FX( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc:BN', false )
event.defaultBehavior( false )
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
$jam.FB( 0, update )
nodeRoot.attr( 'wc:DA', true )
}
}
)
;$jam.FI
(   'wc:DC'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FV( nodeRoot )
var hlight= $lang( nodeRoot.state( 'lang' ) )
var source= $jam.FL( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;$jam.FI
(   'wc:DG'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.FV( nodeRoot )
var nodeHeader=
$jam.FV.parse( '<wc:DH title="ctrl + enter" />' )
.tail( $jam.FV.parse( '<wc:DK>Run ►' ) )
.tail( $jam.FV.parse( '<wc:DJ>inner (µs)' ) )
.tail( $jam.FV.parse( '<wc:DJ>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.FV.Element( 'wc:DD' ).parent( nodeRoot )
//var nodeClone= $jam.FV.parse( '<wc:DE title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.FV.parse( '<wc:DF>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:DI' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.FX()
.type( '$jam.GP' )
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
$jam.FI
(   'wc:DI'
,   new function( ){
var queue=
$jam.GG()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.FV( nodeRoot )
var source= $jam.FL( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.FV.parse( '<wc:DL><wc:BM wc:ED="js">' + $jam.FR( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.FV.parse( '<wc:DM class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.FV.parse( '<wc:DM class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.FV.Fragment() ) // for chrome 12
var calc= $jam.GI( function( source ){
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
$jam.FV.Element( 'wc:DI' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.GP', schedule )
var onClone=
nodeRoot.listen( '$jam.GO', clone )
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
;$jam.FI
(   'wc:C'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FV( nodeRoot )
var exec= $jam.GI( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.FL( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.FV.Element( 'wc:DO' ).parent( nodeRoot )
var nodeSource= $jam.FV.parse( '<wc:BM wc:ED="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.FV.Element( 'wc:DD' ).parent( nodeRoot )
var nodeClone= $jam.FV.parse( '<wc:DE title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.FV.parse( '<wc:DF>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
if( passed() !== 'wait' ) throw new Error( 'Test already done' )
}
_test.ok=
$jam.EY
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
$jam.EY
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
$jam.EY
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.FB( ms, noMoreWait )
}
)
var passed=
$jam.EY
(   function( ){
return nodeRoot.state( 'passed' )
}
,   function( val ){
nodeRoot.state( 'passed', val )
}
)
var print=
function( val ){
var node= $jam.FV.Element( 'wc:DP' )
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
print( $jam.FS( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc:DP' )
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
$jam.FV.Element( 'wc:C' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.GP', run )
var onClone=
nodeRoot.listen( '$jam.GO', clone )
var onClone=
nodeRoot.listen( '$jam.GQ', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.FX().type( '$jam.GO' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.FX().type( '$jam.GQ' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
_test.ok= _test.not= $jam.EU()
}
}
}
)
;$jam.FI
(   'wc:DR'
,   function( nodeRoot ){
nodeRoot= $jam.FV( nodeRoot )
nodeRoot.listen
(   '$jam.GR'
,   function( ){
var text= $jam.FQ( nodeRoot.html() )
nodeRoot.state( 'modified', text !== textLast )
}
)
nodeRoot.listen
(   '$jam.GR'
,   $jam.GJ
(   5000
,   save
)
)
nodeRoot.listen
(   '$jam.GP'
,   save
)
var textLast= $jam.FQ( nodeRoot.html() )
function save( ){
var text= $jam.FQ( nodeRoot.html() )
if( text === textLast ) return
var xhr= new XMLHttpRequest
xhr.open( text ? 'PUT' : 'DELETE', nodeRoot.attr( 'wc:ES' ) )
xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
xhr.send( nodeRoot.attr( 'wc:ET' ) + '=' + encodeURIComponent( text ) )
textLast= text
nodeRoot.state( 'modified', false )
}
return new function( ){
}
}
)
;$jam.GU( 'https://github.com/nin-jin/wc' )
;$jam.FI
(   'wc:DV'
,   function( nodeRoot ){
nodeRoot=
$jam.FV( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.FV.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.EY
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
;$jam.GU( 'https://github.com/nin-jin/doc' )
