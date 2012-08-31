;if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
;$jam.BG= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.BG: ' + String( val )
}
return value
}
;$jam.BH= $jam.BG( this )
;$jam.BI=
new function( ){
var Ghost= function(){}
return function( key, value ){
var keyList= key.split( '.' )
var obj= $jam.BH()
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
;$jam.BI( '$jam.BK', $jam.BG( $jam.BH().document ) )
;$jam.BI
(   '$jam.CA'
,   function( timeout, proc ){
var timerID= $jam.BH().setTimeout( proc, timeout )
return function( ){
$jam.BH().clearTimeout( timerID )
}
}
)
;$jam.BI
(   '$jam.CD.then'
,   function( proc ){
var checker= function( ){
if( $jam.CD() ) proc()
else $jam.CA( 10, checker )
}
checker()
}
)
;$jam.BI
(   '$jam.CD'
,   function( ){
var state= $jam.BK().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.CP=
function( ns ){
if( !$jam.BK().getElementsByTagNameNS ) return
var nodeList= $jam.BK().getElementsByTagNameNS( ns, '*' )
var docEl= $jam.BK().documentElement
var tracking= function( ){
sleep()
var node
while( node= nodeList[0] ){
var parent= node.parentNode
var newNode= $jam.BK().createElement( node.nodeName )
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
$jam.CD.then( tracking )
tracking()
function rise( ){
docEl.addEventListener( 'DOMNodeInserted', tracking, false )
}
function sleep( ){
docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
}
}
;$jam.BI
(   '$jam.CE'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.BI
(   '$jam.CF'
,   new function(){
var Support= function( state ){
var sup= $jam.BG( state )
sup.select= function( map ){
return $jam.CE( this(), map )
}
return sup
}
var node= $jam.BK().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.BH().DOMParser && $jam.BH().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.BI
(   '$jam.CG'
,   function( tagName, factory ){
if(!( this instanceof $jam.CG )) return new $jam.CG( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.BK().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.BK().documentElement.namespaceURI
var checkName=
( tagName === '*' )
?    $jam.BG( true )
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
$jam.BH().setInterval( tracking, 200 )
$jam.CD.then(function whenReady(){
$jam.BH().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.BK().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.CF.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.CF.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
}, false )
this.tagName= $jam.BG( tagName )
this.factory= $jam.BG( factory )
this.elements=
function elements( ){
return elements.slice( 0 )
}
tracking()
}
)
;$jam.BJ=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.BJ
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
;$jam.BI
(   '$jam.BL'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.BI
(   '$jam.BM'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.BI
(   '$jam.BN'
,   new function(){
var fromCharCode= $jam.BH().String.fromCharCode
var parseInt= $jam.BH().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.BM[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.BI
(   '$jam.BO'
,   function( html ){
return $jam.BN
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.BI
(   '$jam.BP'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === $jam.BH() ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;$jam.BI
(   '$jam.BQ'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BL
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
$jam.BL
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.BP( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.BP( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.BL
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.BP( keyList ) === 'String' ){
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
if( $jam.BP( cur[ key ] ) === 'Object' ){
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
if( $jam.BP( json ) === 'String' ){
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
$jam.BL
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
;$jam.BI
(   '$jam.BR'
,   $jam.BJ( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.BS( node )
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
;$jam.BI
(   '$jam.BT'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.BJ ) return obj
return klass.raw( obj )
}
)
;$jam.BU=
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
;$jam.BV=
$jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BL
(   function( ){
this.$= $jam.BK().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.BL
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.BL
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.BL
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.BL
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.BL
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.BL
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.BL
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.BU( code ) ]= code
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
$jam.BL
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
$jam.BL
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
$jam.BT( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.BI
(   '$jam.BW'
,   $jam.BJ( function( klass, proto ){
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
$jam.BL
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
$jam.BL
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.BT( node )
return this
}
)
proto.handler=
$jam.BL
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.BV( event ) )
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
$jam.BL
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
;$jam.BI
(   '$jam.BS'
,   $jam.BJ( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.BK().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.BK().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.BK().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.BK().createDocumentFragment() )
}
proto.text=
$jam.BL
(   function( ){
return $jam.BO( this.$.innerHTML )
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
$jam.BL
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
$jam.BL
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
$jam.BL
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.BQ({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.BQ({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.BL
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
return $jam.BR( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.BR( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.BR( filtered )
}
proto.parent= 
$jam.BL
(   function( ){
return $jam.BS( this.$.parentNode )
}
,   function( node ){
node= $jam.BT( node )
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
var node= $jam.BT( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.BS.Text( '\r\n' ) )
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
$jam.BL
(   function(){
return $jam.BS( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.BT( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.BL
(   function(){
return $jam.BS( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.BT( node ) )
return this
}
)
proto.next=
$jam.BL
(   function(){
return $jam.BS( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.BT( node ), next ) 
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
$jam.BL
(   function(){
return $jam.BS( this.$.previousSibling )
}
,   function( node ){
node= $jam.BT( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.BL
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
var fragment= $jam.BS.Fragment()
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
return $jam.BS( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.BS( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.BW()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.CG
(   'a'
,   function( el ){
var isTarget= ( el.href == $jam.BK().location.href )
$jam.BS( el ).state( 'target', isTarget )
}
)
;$jam.BI
(   '$jam.CQ'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BL
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
;$jam.BI
(    '$jam.CR'
,    function( func ){
var cache= $jam.CQ()
return function( key ){
if( cache.has( key ) ) return cache.get( key )
var value= func.apply( this, arguments )
cache.put( key, value )
return value 
}
}
)
;$jam.CH=
$jam.BJ( function( klass, proto ){
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
;$jam.BI
(   '$jam.CI'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.BL
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
$jam.BL
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
$jam.BL
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
$jam.CA
(   this.latency()
,   $jam.CH( this )
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
;$jam.BI
(   '$jam.CS'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$jam.BI
(   '$jam.CK'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.BT( data ) || '' )
return this
}
proto.incIndent=
$jam.BL
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.BL
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.BL
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
$jam.BL
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.BL
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
$jam.BL
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.BL
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
$jam.BL
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.BL
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.BL
(   function( ){
return this.$
}
)
})
)
;$jam.BI
(   '$jam.CT'
,   $jam.BJ( function( klass, proto ){
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
$jam.CF.xmlModel.select(
{   'w3c': function( ){
var serializer= new XMLSerializer
var text= serializer.serializeToString( this.$ )
return text
}
,   'ms': function( ){
return $jam.CK( this.$.xml ).trim().$
}
})
proto.transform=
$jam.CF.xmlModel.select(
{   'w3c': function( stylesheet ){
var proc= new XSLTProcessor
proc.importStylesheet( $jam.BT( stylesheet ) )
var doc= proc.transformToDocument( this.$ )
return $jam.CT( doc )
}
,   'ms': function( stylesheet ){
var text= this.$.transformNode( $jam.BT( stylesheet ) )
return $jam.CT.parse( text )
}
})
klass.parse=
$jam.CF.xmlModel.select(
{   'w3c': function( str ){
var parser= new DOMParser
var doc= parser.parseFromString( str, 'text/xml' )
return $jam.CT( doc )
}
,   'ms': function( str ){
var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
doc.async= false
doc.loadXML( str )
return $jam.CT( doc )
}
})
})
)
;$jam.BI
(  '$jam.CU'
,   function( ){
return $jam.BH().getSelection()
}
)
;$jam.BI
(   '$jam.CL'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;$jam.BI
(   '$jam.CV'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BL
(   function( ){
var sel= $jam.CU()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= $jam.BK().createRange()
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
var sel= $jam.CU()
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
$jam.BL
(   function( ){
return $jam.BO( this.html() )
}
,   function( text ){
this.html( $jam.CL( text ) )
return this
}
)
proto.html=
$jam.BL
(   function( ){
return $jam.BS( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.BS.parse( html ).$ : $jam.BS.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.BT( node )
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
range= $jam.CV( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.CV( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.CV( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.BS( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.BS( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.CV().aimNode( current )
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
var range= $jam.CV().aimNode( current )
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
return $jam.CV( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.BT( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.BT( node ) )
return this
}
})
)
;$jam.BI
(   '$jam.CM'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.BG( gen )
return lazy
}
)
;$jam.BI
(   '$jam.CW'
,   $jam.BJ( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.CW.escape( chunk )
str+= chunk
}
return $jam.CW( str )
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
;$jam.BI
(   '$jam.CX'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.CW( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.CW(regexp).count()
return $jam.BJ( function( klass, proto ){
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
;$jam.BI
(   '$jam.CY'
,   $jam.BJ( function( klass, proto ){
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
;$jam.BI
(   '$jam.CZ'
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
;$jam.BI
(    '$jam.DA'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.CZ()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.CX( lexems )
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
;$jam.BI
(   '$jam.CJ'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.CI()
.handler( $jam.CH( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.BL
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.BL
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
;$jam.BI
(   '$jam.DB'
,   new function( ){
var factory= function( arg ){
if( !arg ) arg= {}
var open= arg.tokens && arg.tokens[0] || '{'
var close= arg.tokens && arg.tokens[1] || '}'
var openEncoded= $jam.CW.escape( open )
var closeEncoded= $jam.CW.escape( close )
var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
var parse= $jam.DA( new function(){
this[ openEncoded + openEncoded ]=
$jam.BG( open )
this[ closeEncoded +closeEncoded ]=
$jam.BG( close )
this[ '(' + openEncoded + '([^' + openEncoded + closeEncoded + ']*)' + closeEncoded + ')' ]=
Selector
})
return $jam.BJ( function( klass, proto ){
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
$jam.BL
(   $jam.CM( function( ){
return $jam.BG( factory.Selector( $jam.CZ() ) )
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
selector.toString= $jam.BG( str )
return selector
}
}
)
return factory
}
)
;$jam.BI
(   '$jam.CN'
,   $jam.CM( function(){
var poolNode= $jam.CM( function(){
var body= $jam.BK().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.BK().createElement( 'wc:H:pool' )
pool.style.display= 'none'
body.insertBefore( pool, body.firstChild )
return $jam.BG( pool )
})
var free= []
return function( proc ){
return function( ){
var res
var self= this
var args= arguments
var starter= free.pop()
if( !starter ){
var starter= $jam.BK().createElement( 'button' )
poolNode().appendChild( starter )
}
starter.onclick= function( ev ){
( ev || $jam.BH().event ).cancelBubble= true
res= proc.apply( self, args )
}
starter.click()
free.push( starter )
return res
}
}
})
)
;$jam.BI
(    '$jam.CB'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.CA( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.BI
(   '$jam.DC'
,   function( map ){
var Selector= function( str, key ){
var keyList= key.split( ':' )
var fieldName= keyList.shift()
var selector= function( data ){
var value= ( fieldName === '.' ) ? data : data[ fieldName ]
if( value ) return selector
}
selector.toString= $jam.BG( str )
return selector
}
var Template= $jam.DB({ Selector: Selector })
for( var key in map ) map[ key ]= Template( map[ key ] )
return 
}
)
;$jam.BI
(   '$jam.DD'
,   $jam.BJ( function( klass, proto ){
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
var lineParser= $jam.CW.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$
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
return $jam.DD( data )
}
return parser
}
})
)
;$jam.BI
(   '$jam.DE'
,   function( ){
return $jam.BK().body
}
)
;$jam.BI
(   '$jam.DF'
,   $jam.CN(function( source ){
return $jam.BH().eval( source )
})
)
;$jam.BI
(   '$jam.CO'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.BV().type( '$jam.CO' ).scream( event.target() )
}
$jam.BS( $jam.BK().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.BI
(   '$jam.BY'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.BV().type( '$jam.BY' ).scream( event.target() )
}
$jam.BS( $jam.BK().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.BI
(   '$jam.BZ'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.BH().confirm( 'Are you sure to delee this?' ) ) return
$jam.BV().type( '$jam.BZ' ).scream( event.target() )
}
$jam.BS( $jam.BK().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.BI
(   '$jam.CC'
,   new function(){
var scream=
$jam.CB
(   50
,   function( target ){
$jam.BV().type( '$jam.CC' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.BS( $jam.BK().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.BI
(   '$jam.DG'
,   new function(){
var handler=
function( event ){
$jam.BV()
.type( '$jam.$eventScroll' )
.wheel( event.wheel() )
.scream( event.target() )
}
var docEl= $jam.BS( $jam.BK().documentElement )
docEl.listen( 'mousewheel', handler )
docEl.listen( 'DOMMouseScroll', handler )
}
)
;$jam.BI
(   '$jam.BX'
,   new function(){
var lastURI= $jam.BK().location.href
var refresh=
function( ){
var newURI= $jam.BK().location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.BV().type( '$jam.BX' ).scream( $jam.BK() )
}
$jam.BH().setInterval( refresh, 20)
}
)
;$jam.BI
(   '$jam.DH'
,   new function(){
var console= $jam.BH().console
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
;$jam.BI
(   '$jam.DI'
,   $jam.BH().encodeURIComponent
)
;$jam.CG
(   'wc:AC'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.BS( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc:AY' ) )
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
return $lang[ name ] || $lang.text
}
$lang.text= $jam.CL
;$lang.Wrapper=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;$lang.Parser=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.text
return $jam.CZ
(   $jam.DA( map )
,   $jam.CS()
)
}
;$lang.css=
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
$jam.CZ( $lang.text, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CZ( $lang.text, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CZ( $lang.text, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CZ( $lang.text, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CZ( $lang.text, css.pseudo )
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
$jam.CZ( $lang.text, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.CZ( $lang.text, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.CZ( $lang.text, css.value )
})
return css
}
;$lang.pcre=
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
$jam.CZ( $lang.text, pcre.control )
})
return pcre
}
;$lang.js=
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
$jam.CZ( $lang.text, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.CZ( $lang.text, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.CZ( $lang.text, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.CZ( $lang.text, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.CZ( $lang.pcre, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.CZ( $lang.text, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.CZ( $lang.text, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.CZ( $lang.text, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.CZ( $lang.text, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.CZ( $lang.text, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.CZ( $lang.text, js.operator )
})
return js
}
;$lang.sgml=
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
$jam.CZ
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
$jam.CZ( $lang.text, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.CZ( $lang.text, sgml.decl )
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
;$jam.CG
(   'wc:R'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BS( nodeRoot )
var source= $jam.CK( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.BS.Element( 'wc:AH' )
.parent( nodeRoot )
var nodeSource0=
$jam.BS.Element( 'wc:AI' )
.parent( nodeRoot )
var nodeSource=
$jam.BS.parse( '<wc:L wc:M="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jam.CN( function( ){
var source= $jam.CK( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
//nodeSource.text( source )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.BS( scripts[i] )
$jam.DF( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.BY', exec )
this.destroy=
function( ){
onCommit.sleep()
}
}
}
)
;$lang.php=
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
$jam.CZ( $lang.text, php.keyword )
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
$jam.CZ( $lang.text, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.CZ( $lang.text, php.number )
})
return php
}
;$jam.BI
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
return open + '<a href="?gist/list/' + $jam.CL( text ) + '">' + tags.item( text ) + '</a>' + close
}
})
return tags
}
) 
;$lang.md=
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
return md.link( '<a href="' + $jam.CL( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
// image
// [url]
this[ /(\[)([^\[\]]+)(\])/.source ]=
function( open, href, close ){
return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.CL( href ) + '"><object data="' + $jam.CL( href ) + '"></object></a>' )
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
var embed= md.embed( '<wc:AC wc:AY=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:AC>' )
return href + embed
}
// image
// http://gif1.ru/gifs/267.gif
this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
function( url, close ){
var href= md.embedHref( url + close )
url= url.replace( /\xAD/g, '' )
var embed= md.embed( '<a href="' + $jam.CL( url ) + '"><image src="' + $jam.CL( url ) + '" /></a>' )
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
var rowSep= '<lang:md_table-row-sep><wc:AZ colspan="300">\n--</wc:AZ></lang:md_table-row-sep>'
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
$jam.CG( 'wc:BA', function( nodeRoot ){
nodeRoot= $jam.BS( nodeRoot )
var script= $jam.BS.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.DI( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.md( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.BS.Element( 'wc:BB' )
$jam.BS.Element( 'wc:BC' ).text( user.display_name ).parent( message )
$jam.BS.Element( 'wc:BD' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} )
;$jam.CG
(   'wc:L'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BS( nodeRoot )
var source= $jam.CL( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
nodeRoot.clear()
var nodeSource= $jam.BS.parse( '<div class=" wc_editor_content " />' )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= $jam.CB( 50, function( ){
//var source= $jam.CK( nodeSource.text() ).replace( /\n?\r?$/, '\n' ).$
var source= nodeSource.text()
if( source === sourceLast ) return
sourceLast= source
source=
$jam.CK( source )
.process( $lang( nodeRoot.attr( 'wc:M' ) ) )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
//.replace( /[^\n<>](?:<[^<>]+>)*$/, '$&\n' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
var nodeRange= $jam.CV().aimNodeContent( nodeSource )
var startPoint= $jam.CV().collapse2start()
//console.log(nodeRange.html())
var endPoint= $jam.CV().collapse2end()
var hasStart= nodeRange.hasRange( startPoint )
var hasEnd= nodeRange.hasRange( endPoint )
if( hasStart ){
var metRange= $jam.CV()
.equalize( 'end2start', startPoint )
.equalize( 'start2start', nodeRange )
var offsetStart= metRange.text().length
}
if( hasEnd ){
var metRange= $jam.CV()
.equalize( 'end2start', endPoint )
.equalize( 'start2start', nodeRange )
var offsetEnd= metRange.text().length
//console.log(metRange.html(),metRange.text(), offsetEnd)
}
//console.log(offsetStart,offsetEnd)
nodeSource.html( source )
var selRange= $jam.CV()
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
//if( source.charAt( source.length -1 ) !== '\n' ) nodeSource.tail( $jam.BS.Text( '\n' ) )
//if( !source ) $jam.CV().aimNode( nodeSource.head() ).collapse2end().select()
//if( nodeSource.tail() && nodeSource.tail().name() !== 'br' ) nodeSource.tail( $jam.BS.Element( 'br' ) )
} )
var onEdit=
nodeRoot.listen( '$jam.CC', update )
var onEnter=
nodeRoot.listen( 'keypress', function( event ){
event= $jam.BV( event )
if( !event.keyCode().enter ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.CV().html( '<br/>' ).collapse2end().select()
})
var onAltSymbol=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.BV( event )
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
var symbol= symbolSet[ $jam.BU( event.keyCode() ) ]
if( !symbol ) return
event.defaultBehavior( false )
$jam.CV().text( symbol ).collapse2end().select()
})
//var onBackspace=
//nodeRoot.listen( 'keydown', function( event ){
//    event= $jam.BV( event )
//    if( event.keyCode() != 8 ) return
//    if( event.keyAccel() ) return
//    event.defaultBehavior( false )
//    var fullRange= $jam.CV().aimNodeContent( nodeSource )
//    var newOffset= fullRange.clone().equalize( 'end2start', $jam.CV() ).text().length - 1
//    if( newOffset < 0 ) newOffset= 0
//    var range= fullRange.clone().move( newOffset ).equalize( 'end2end', $jam.CV() )
//    range.dropContents()
//})
var onTab=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.BV( event )
if( !event.keyCode().tab ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.CV().text( '    ' ).collapse2end().select()
})
var onLeave=
nodeSource.listen( 'blur', function( event ){
$jam.BV().type( '$jam.BY' ).scream( nodeRoot )
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.BV( event )
if( !event.keyMeta() ) return
nodeRoot.attr( 'wc:AJ', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.BV( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc:AJ', false )
event.defaultBehavior( false )
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
$jam.CA( 0, update )
nodeRoot.attr( 'wc:AK', true )
}
}
)
;$jam.CG
(   'wc:O'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BS( nodeRoot )
var hlight= $lang( nodeRoot.state( 'lang' ) )
var source= $jam.CK( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;$jam.CG
(   'wc:A'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.BS( nodeRoot )
var nodeHeader=
$jam.BS.parse( '<wc:B title="ctrl + enter" />' )
.tail( $jam.BS.parse( '<wc:E>Run ►' ) )
.tail( $jam.BS.parse( '<wc:D>inner (µs)' ) )
.tail( $jam.BS.parse( '<wc:D>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.BS.Element( 'wc:I' ).parent( nodeRoot )
//var nodeClone= $jam.BS.parse( '<wc:J title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.BS.parse( '<wc:K>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:C' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.BV()
.type( '$jam.BY' )
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
$jam.CG
(   'wc:C'
,   new function( ){
var queue=
$jam.CJ()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.BS( nodeRoot )
var source= $jam.CK( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.BS.parse( '<wc:F><wc:L wc:M="js">' + $jam.CL( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.BS.parse( '<wc:G class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.BS.parse( '<wc:G class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.BS.Fragment() ) // for chrome 12
var calc= $jam.CN( function( source ){
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
$jam.BS.Element( 'wc:C' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.BY', schedule )
var onClone=
nodeRoot.listen( '$jam.CO', clone )
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
;$jam.CG
(   'wc:N'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BS( nodeRoot )
var exec= $jam.CN( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.CK( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.BS.Element( 'wc:P' ).parent( nodeRoot )
var nodeSource= $jam.BS.parse( '<wc:L wc:M="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.BS.Element( 'wc:I' ).parent( nodeRoot )
var nodeClone= $jam.BS.parse( '<wc:J title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.BS.parse( '<wc:K>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
if( passed() !== 'wait' ) throw new Error( 'Test already done' )
}
_test.ok=
$jam.BL
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
$jam.BL
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
$jam.BL
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.CA( ms, noMoreWait )
}
)
var passed=
$jam.BL
(   function( ){
return nodeRoot.state( 'passed' )
}
,   function( val ){
nodeRoot.state( 'passed', val )
}
)
var print=
function( val ){
var node= $jam.BS.Element( 'wc:AN' )
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
print( $jam.BP( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc:AN' )
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
$jam.BS.Element( 'wc:N' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.BY', run )
var onClone=
nodeRoot.listen( '$jam.CO', clone )
var onClone=
nodeRoot.listen( '$jam.BZ', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.BV().type( '$jam.CO' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.BV().type( '$jam.BZ' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
_test.ok= _test.not= $jam.BG()
}
}
}
)
;$jam.CG
(   'wc:AP'
,   function( nodeRoot ){
nodeRoot= $jam.BS( nodeRoot )
nodeRoot.listen
(   '$jam.CC'
,   function( ){
var text= $jam.BO( nodeRoot.html() )
nodeRoot.state( 'modified', text !== textLast )
}
)
nodeRoot.listen
(   '$jam.CC'
,   $jam.CB
(   5000
,   save
)
)
nodeRoot.listen
(   '$jam.BY'
,   save
)
var textLast= $jam.BO( nodeRoot.html() )
function save( ){
var text= $jam.BO( nodeRoot.html() )
if( text === textLast ) return
var xhr= new XMLHttpRequest
xhr.open( text ? 'PUT' : 'DELETE', nodeRoot.attr( 'wc:BE' ) )
xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
xhr.send( nodeRoot.attr( 'wc:BF' ) + '=' + encodeURIComponent( text ) )
textLast= text
nodeRoot.state( 'modified', false )
}
return new function( ){
}
}
)
;$jam.CP( 'https://github.com/nin-jin/wc' )
;$jam.CG
(   'wc:AT'
,   function( nodeRoot ){
nodeRoot=
$jam.BS( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.BS.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.BL
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
;$jam.CP( 'https://github.com/nin-jin/doc' )
;function googl(url, cb) {
jsonlib.fetch({
url: 'https://www.googleapis.com/urlshortener/v1/url',
header: 'Content-Type: application/json',
data: JSON.stringify({longUrl: url})
}, function (m) {
var result = null;
try {
result = JSON.parse(m.content).id;
if (typeof result != 'string') result = null;
} catch (e) {
result = null;
}
cb(result);
});
}
;// jsonlib.js
//
// Creates a global jsonlib object with several functions:
//
// jsonlib.ip(cb) -     Calls back cb with your current ip address (as a
//                      string) from the point of view of the server,
//                      e.g., cb("10.123.123.12").  cb is called with null
//                      if there is a failure.
// jsonlib.time(cb) -   Calls back cb with the current number of seconds
//                      since epoch (as a float) from the point of view of
//                      the server, e.g., cb(1276427503.73405).  cb is
//                      called with null if there is a failure.
// jsonlib.scrape("div[class=story] h2 a", "http://www.nytimes.com/", cb) -
//                      Calls back cb with an array of text contents of the
//                      elements selected by the given css selector,
//                      taken from the webpage fetched from the given url.
//                      cb is called with null if there is a failure.
// jsonlib.scrapeattr("href", "div[class=story] h2 a",
//                    "http://www.nytimes.com/", cb) -
//                      Calls back cb with an array containing the given
//                      attribute value for each element selected by the
//                      the css selector, taken from the webpage fetched
//                      from the given url.  cb is called with null if
//                      there is a failure.
// jsonlib.fetch(url, cb) -
// jsonlib.fetch({ url: url, select: selector, extract: name, ... } ,cb) -
//                      Raw interface to the jsonlib /fetch call.  Fetches
//                      the raw html at the given url as well as all HTTP
//                      headers, optionally applying a css selector and
//                      an extract option.  Calls back cb with an object
//                      containing a 'headers' field, and a 'content' field
//                      and other fields, as returned from the jsonlib server.
//                      cb is called with an object containing an 'error'
//                      field if there is a failure.
// jsonlib.urandom(cb) -
// jsonlib.urandom({ bytes: count, format: "array" }, cb) -
//                      Provides access to the server's secure RNG urandom.
//                      The two-argument form can specify any number of bytes
//                      and a format of either "array" or "string", which
//                      will be passed to the callback function.  The default
//                      number of bytes is 256 and the default format is
//                      string.  cb is called with null if there is a failure.
if (typeof(jsonlib) != 'object') {
jsonlib = {};
}
(function(lib) {
var counter = (new Date).getTime(),
head,
window = this,
domain = 'http://call.jsonlib.com/',
securedomain = 'https://jsonlib.appspot.com/',
timeout = 6000,
nul = null;
// Use a <script> tag to load a json url
function loadscript(url) {
var script = document.createElement('script'),
done = false;
script.src = url;
script.async = true;
script.onload = script.onreadystatechange = function() {
if (!done && (!this.readyState || this.readyState === "loaded" ||
this.readyState === "complete")) {
done = true;
script.onload = script.onreadystatechange = nul;
if (script && script.parentNode) {
script.parentNode.removeChild(script);
}
}
};
if (!head) {
head = document.getElementsByTagName('head')[0];
}
head.appendChild(script);
}
// Set up a jsonp call with a temporary global callback function
function invoke(url, params, callback, field, def) {
var query = "?",
jsonp = "jsonlib_cb_" + (++counter),
timer;
params = params || {};
for (key in params) {
if (params.hasOwnProperty(key)) {
query += encodeURIComponent(key) + "=" +
encodeURIComponent(params[key]) + "&";
}
}
window[jsonp] = function(data) {
clearTimeout(timer)
window[jsonp] = nul;
if (callback) {
if (field) {
if (data.hasOwnProperty(field)) { data = data[field]; }
else { data = def; }
}
callback(data);
}
try {
delete window[jsonp];
} catch (e) {}
};
timer = setTimeout(function() {
window[jsonp] = nul;
callback(def);
try {
delete window[jsonp];
} catch (e) {}
}, timeout);
loadscript(url + query + "callback=" + jsonp);
return jsonp;
}
// Choose an api domain to use.  If the underlying url is https,
// then use an https domain for the jsonlib call.
function pickdomain(arg) {
if (typeof arg.url == 'string' && arg.url.indexOf('https:') == 0) {
return securedomain;
} else {
return domain;
}
}
// Exported functions below.
function ip(ondone) {
invoke(domain + 'ip', { }, ondone, 'ip', nul);
}
function time(ondone) {
invoke(domain + 'time', { }, ondone, 'time', nul);
}
function echo(arg, ondone) {
invoke(domain + 'echo', arg, ondone, nul, nul);
}
function urandom(arg, ondone) {
if (arguments.length == 1) { ondone = arg; arg = {}; }
invoke(securedomain + 'urandom', arg, ondone, 'urandom', nul);
}
function fetch(arg, ondone) {
if (typeof arg == 'string') {
arg = { url: arg };
}
invoke(pickdomain(arg) + 'fetch', arg, ondone, nul, { 'error': 'timeout' });
}
function scrape(select, url, ondone) {
var arg;
if (typeof select == 'string') {
arg = { url: url, select: select, extract: 'text' };
} else {
arg = { url: url, extract: 'text' };
for (var k in select) {
if (select.hasOwnProperty(k)) {
arg[k] = select[k];
}
}
}
invoke(pickdomain(arg) + 'fetch', arg, ondone, 'content', nul);
}
function scrapeattr(attr, select, url, ondone) {
scrape({ select: select, extract: 'attr_' + attr }, url, ondone);
}
lib['ip'] = ip;
lib['time'] = time;
lib['fetch'] = fetch;
lib['scrape'] = scrape;
lib['scrapeattr'] = scrapeattr;
lib['urandom'] = urandom;
}(jsonlib));
;with( $jam )
$Component
(   'snippet:root'
,   function( nodeRoot ){
nodeRoot= $jam.BS( nodeRoot )
var nodeContent= nodeRoot.descList( 'snippet:content' ).get( 0 )
var nodeLink= nodeRoot.descList( 'snippet:link' ).get( 0 )
var load=
function( ){
nodeContent.clear()
var hash= $doc().location.hash
if( !hash ) hash= '#h1=Snippet!;wc:N=_test.ok()'
var chunks= hash.substring( 1 ).split( ';' )
for( var i= 0; i < chunks.length; ++i ){
var pair= chunks[i].split( '=' )
if( pair.length < 2 ) continue
var source= decodeURIComponent( pair[1] ).replace( /\t/, '    ' )
var content= $jam.BS.parse( '<wc:O class=" editable=true " />' ).text( source )
$jam.BS.Element( pair[0] ).tail( content ).parent( nodeContent )
}
}
var save=
$Throttler
(   50
,   function( ){
var chunks= []
var childList= nodeContent.childList()
for( var i= 0; i < childList.length(); ++i ){
var child= childList.get( i )
if( child.name() === 'wc:N' ){
var source= child.childList( 'wc:P' ).get(0).text()
} else {
var source= child.text()
}
source= $String( source ).trim( /[\r\n]/ ).replace( /    /, '\t' ).$
chunks.push( child.name() + '=' + encodeURIComponent( source ) )
}
$doc().location= '#' + chunks.join( ';' )
nodeLink.clear()
googl($doc().location.href,function( href ){
if( href ){
$jam.BS.Element( 'a' )
.text( href )
.attr( 'href', href )
.parent( nodeLink )
} else {
var form= $jam.BS.parse( '<form method="post" target="_blank" action="http://goo.gl/action/shorten">' ).parent( nodeLink )
var url= $jam.BS.parse( '<input type="hidden" name="url" />' ).attr( 'value', $doc().location.href ).parent( form )
var submit= $jam.BS.parse( '<wc:Q><button type="submit">get short link' ).parent( form ) 
}
})
}
)
load()
var onURIChanged=
$jam.BS( $doc() ).listen( '$jam.BX', load )
var onCommit=
nodeRoot.listen( '$jam.BY', save )
var onDelete=
nodeRoot.listen( '$jam.BZ', save )
var onEdit=
nodeRoot.listen( '$jam.CC', function( ){
nodeLink.clear()
})
return new function( ){
this.destroy=
function( ){
onURIChanged.sleep()
onCommit.sleep()
onDelete.sleep()
onEdit.sleep()
}
}
}
)
