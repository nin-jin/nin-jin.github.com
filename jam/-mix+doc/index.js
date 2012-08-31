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
;$jam.BI( '$jam.BQ', $jam.BG( $jam.BH().document ) )
;$jam.BI
(   '$jam.BN'
,   function( timeout, proc ){
var timerID= $jam.BH().setTimeout( proc, timeout )
return function( ){
$jam.BH().clearTimeout( timerID )
}
}
)
;$jam.BI
(   '$jam.BR.then'
,   function( proc ){
var checker= function( ){
if( $jam.BR() ) proc()
else $jam.BN( 10, checker )
}
checker()
}
)
;$jam.BI
(   '$jam.BR'
,   function( ){
var state= $jam.BQ().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.DG=
function( ns ){
if( !$jam.BQ().getElementsByTagNameNS ) return
var nodeList= $jam.BQ().getElementsByTagNameNS( ns, '*' )
var docEl= $jam.BQ().documentElement
var tracking= function( ){
sleep()
var node
while( node= nodeList[0] ){
var parent= node.parentNode
var newNode= $jam.BQ().createElement( node.nodeName )
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
$jam.BR.then( tracking )
tracking()
function rise( ){
docEl.addEventListener( 'DOMNodeInserted', tracking, false )
}
function sleep( ){
docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
}
}
;$jam.BI
(   '$jam.BS'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.BI
(   '$jam.BT'
,   new function(){
var Support= function( state ){
var sup= $jam.BG( state )
sup.select= function( map ){
return $jam.BS( this(), map )
}
return sup
}
var node= $jam.BQ().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.BH().DOMParser && $jam.BH().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.BI
(   '$jam.BU'
,   function( tagName, factory ){
if(!( this instanceof $jam.BU )) return new $jam.BU( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.BQ().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.BQ().documentElement.namespaceURI
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
$jam.BR.then(function whenReady(){
$jam.BH().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.BQ().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.BT.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.BT.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
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
(   '$jam.BK'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.BI
(   '$jam.CA'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.BI
(   '$jam.CB'
,   new function(){
var fromCharCode= $jam.BH().String.fromCharCode
var parseInt= $jam.BH().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.CA[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.BI
(   '$jam.CC'
,   function( html ){
return $jam.CB
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.BI
(   '$jam.CE'
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
(   '$jam.CF'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BK
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
$jam.BK
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.CE( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.CE( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.BK
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.CE( keyList ) === 'String' ){
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
if( $jam.CE( cur[ key ] ) === 'Object' ){
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
if( $jam.CE( json ) === 'String' ){
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
$jam.BK
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
(   '$jam.CG'
,   $jam.BJ( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.CH( node )
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
(   '$jam.BW'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.BJ ) return obj
return klass.raw( obj )
}
)
;$jam.CI=
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
;$jam.CJ=
$jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BK
(   function( ){
this.$= $jam.BQ().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.BK
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.BK
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.BK
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.BK
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.BK
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.BK
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.BK
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.CI( code ) ]= code
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
$jam.BK
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
$jam.BK
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
$jam.BW( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.BI
(   '$jam.CK'
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
$jam.BK
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
$jam.BK
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.BW( node )
return this
}
)
proto.handler=
$jam.BK
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.CJ( event ) )
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
$jam.BK
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
(   '$jam.CH'
,   $jam.BJ( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.BQ().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.BQ().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.BQ().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.BQ().createDocumentFragment() )
}
proto.text=
$jam.BK
(   function( ){
return $jam.CC( this.$.innerHTML )
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
$jam.BK
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
$jam.BK
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
$jam.BK
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.CF({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.CF({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.BK
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
return $jam.CG( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.CG( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.CG( filtered )
}
proto.parent= 
$jam.BK
(   function( ){
return $jam.CH( this.$.parentNode )
}
,   function( node ){
node= $jam.BW( node )
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
var node= $jam.BW( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.CH.Text( '\r\n' ) )
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
$jam.BK
(   function(){
return $jam.CH( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.BW( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.BK
(   function(){
return $jam.CH( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.BW( node ) )
return this
}
)
proto.next=
$jam.BK
(   function(){
return $jam.CH( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.BW( node ), next ) 
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
$jam.BK
(   function(){
return $jam.CH( this.$.previousSibling )
}
,   function( node ){
node= $jam.BW( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.BK
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
var fragment= $jam.CH.Fragment()
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
return $jam.CH( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.CH( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.CK()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.BU
(   'a'
,   function( el ){
var isTarget= ( el.href == $jam.BQ().location.href )
$jam.CH( el ).state( 'target', isTarget )
}
)
;$jam.BI
(   '$jam.BL'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BK
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
(    '$jam.BM'
,    function( func ){
var cache= $jam.BL()
return function( key ){
if( cache.has( key ) ) return cache.get( key )
var value= func.apply( this, arguments )
cache.put( key, value )
return value 
}
}
)
;$jam.BO=
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
(   '$jam.BP'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.BK
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
$jam.BK
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
$jam.BK
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
$jam.BN
(   this.latency()
,   $jam.BO( this )
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
(   '$jam.BV'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$jam.BI
(   '$jam.BX'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.BW( data ) || '' )
return this
}
proto.incIndent=
$jam.BK
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.BK
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.BK
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
$jam.BK
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.BK
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
$jam.BK
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.BK
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
$jam.BK
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.BK
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.BK
(   function( ){
return this.$
}
)
})
)
;$jam.BI
(   '$jam.BY'
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
$jam.BT.xmlModel.select(
{   'w3c': function( ){
var serializer= new XMLSerializer
var text= serializer.serializeToString( this.$ )
return text
}
,   'ms': function( ){
return $jam.BX( this.$.xml ).trim().$
}
})
proto.transform=
$jam.BT.xmlModel.select(
{   'w3c': function( stylesheet ){
var proc= new XSLTProcessor
proc.importStylesheet( $jam.BW( stylesheet ) )
var doc= proc.transformToDocument( this.$ )
return $jam.BY( doc )
}
,   'ms': function( stylesheet ){
var text= this.$.transformNode( $jam.BW( stylesheet ) )
return $jam.BY.parse( text )
}
})
klass.parse=
$jam.BT.xmlModel.select(
{   'w3c': function( str ){
var parser= new DOMParser
var doc= parser.parseFromString( str, 'text/xml' )
return $jam.BY( doc )
}
,   'ms': function( str ){
var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
doc.async= false
doc.loadXML( str )
return $jam.BY( doc )
}
})
})
)
;$jam.BI
(  '$jam.BZ'
,   function( ){
return $jam.BH().getSelection()
}
)
;$jam.BI
(   '$jam.CD'
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
(   '$jam.CL'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
$jam.BK
(   function( ){
var sel= $jam.BZ()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= $jam.BQ().createRange()
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
var sel= $jam.BZ()
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
$jam.BK
(   function( ){
return $jam.CC( this.html() )
}
,   function( text ){
this.html( $jam.CD( text ) )
return this
}
)
proto.html=
$jam.BK
(   function( ){
return $jam.CH( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.CH.parse( html ).$ : $jam.CH.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.BW( node )
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
range= $jam.CL( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.CL( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.CL( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.CH( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.CH( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.CL().aimNode( current )
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
var range= $jam.CL().aimNode( current )
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
return $jam.CL( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.BW( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.BW( node ) )
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
(   '$jam.CN'
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
if( i % 2 ) chunk= $jam.CN.escape( chunk )
str+= chunk
}
return $jam.CN( str )
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
(   '$jam.CO'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.CN( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.CN(regexp).count()
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
(   '$jam.CP'
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
(   '$jam.CQ'
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
(    '$jam.CR'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.CQ()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.CO( lexems )
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
(   '$jam.CS'
,   $jam.BJ( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.BP()
.handler( $jam.BO( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.BK
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.BK
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
(   '$jam.CT'
,   new function( ){
var factory= function( arg ){
if( !arg ) arg= {}
var open= arg.tokens && arg.tokens[0] || '{'
var close= arg.tokens && arg.tokens[1] || '}'
var openEncoded= $jam.CN.escape( open )
var closeEncoded= $jam.CN.escape( close )
var Selector= arg.Selector || arg.encoder && factory.Selector( arg.encoder ) || factory.Selector()
var parse= $jam.CR( new function(){
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
$jam.BK
(   $jam.CM( function( ){
return $jam.BG( factory.Selector( $jam.CQ() ) )
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
(   '$jam.CU'
,   $jam.CM( function(){
var poolNode= $jam.CM( function(){
var body= $jam.BQ().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.BQ().createElement( 'wc:A:pool' )
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
var starter= $jam.BQ().createElement( 'button' )
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
(    '$jam.CV'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.BN( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.BI
(   '$jam.CW'
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
var Template= $jam.CT({ Selector: Selector })
for( var key in map ) map[ key ]= Template( map[ key ] )
return 
}
)
;$jam.BI
(   '$jam.CX'
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
var lineParser= $jam.CN.build( '^((?:', oneIndent, ')*)(.*?)(?:', valSep, '(.*))?$' ).$
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
return $jam.CX( data )
}
return parser
}
})
)
;$jam.BI
(   '$jam.CY'
,   function( ){
return $jam.BQ().body
}
)
;$jam.BI
(   '$jam.CZ'
,   $jam.CU(function( source ){
return $jam.BH().eval( source )
})
)
;$jam.BI
(   '$jam.DA'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.CJ().type( '$jam.DA' ).scream( event.target() )
}
$jam.CH( $jam.BQ().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.BI
(   '$jam.DB'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.CJ().type( '$jam.DB' ).scream( event.target() )
}
$jam.CH( $jam.BQ().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.BI
(   '$jam.DC'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.BH().confirm( 'Are you sure to delee this?' ) ) return
$jam.CJ().type( '$jam.DC' ).scream( event.target() )
}
$jam.CH( $jam.BQ().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.BI
(   '$jam.DD'
,   new function(){
var scream=
$jam.CV
(   50
,   function( target ){
$jam.CJ().type( '$jam.DD' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.CH( $jam.BQ().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.BI
(   '$jam.DE'
,   new function(){
var handler=
function( event ){
$jam.CJ()
.type( '$jam.$eventScroll' )
.wheel( event.wheel() )
.scream( event.target() )
}
var docEl= $jam.CH( $jam.BQ().documentElement )
docEl.listen( 'mousewheel', handler )
docEl.listen( 'DOMMouseScroll', handler )
}
)
;$jam.BI
(   '$jam.DF'
,   new function(){
var lastURI= $jam.BQ().location.href
var refresh=
function( ){
var newURI= $jam.BQ().location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.CJ().type( '$jam.DF' ).scream( $jam.BQ() )
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
;$jam.BU
(   'wc:N'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.CH( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc:AX' ) )
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
$lang.text= $jam.CD
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
return $jam.CQ
(   $jam.CR( map )
,   $jam.BV()
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
$jam.CQ( $lang.text, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CQ( $lang.text, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CQ( $lang.text, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CQ( $lang.text, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CQ( $lang.text, css.pseudo )
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
$jam.CQ( $lang.text, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.CQ( $lang.text, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.CQ( $lang.text, css.value )
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
$jam.CQ( $lang.text, pcre.control )
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
$jam.CQ( $lang.text, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.CQ( $lang.text, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.CQ( $lang.text, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.CQ( $lang.text, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.CQ( $lang.pcre, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.CQ( $lang.text, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.CQ( $lang.text, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.CQ( $lang.text, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.CQ( $lang.text, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.CQ( $lang.text, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.CQ( $lang.text, js.operator )
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
$jam.CQ
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
$jam.CQ( $lang.text, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.CQ( $lang.text, sgml.decl )
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
;$jam.BU
(   'wc:B'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.CH( nodeRoot )
var source= $jam.BX( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.CH.Element( 'wc:T' )
.parent( nodeRoot )
var nodeSource0=
$jam.CH.Element( 'wc:U' )
.parent( nodeRoot )
var nodeSource=
$jam.CH.parse( '<wc:V wc:AY="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jam.CU( function( ){
var source= $jam.BX( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
//nodeSource.text( source )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.CH( scripts[i] )
$jam.CZ( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.DB', exec )
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
$jam.CQ( $lang.text, php.keyword )
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
$jam.CQ( $lang.text, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.CQ( $lang.text, php.number )
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
return open + '<a href="?gist/list/' + $jam.CD( text ) + '">' + tags.item( text ) + '</a>' + close
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
return md.link( '<a href="' + $jam.CD( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
// image
// [url]
this[ /(\[)([^\[\]]+)(\])/.source ]=
function( open, href, close ){
return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.CD( href ) + '"><object data="' + $jam.CD( href ) + '"></object></a>' )
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
var embed= md.embed( '<wc:N wc:AX=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:N>' )
return href + embed
}
// image
// http://gif1.ru/gifs/267.gif
this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
function( url, close ){
var href= md.embedHref( url + close )
url= url.replace( /\xAD/g, '' )
var embed= md.embed( '<a href="' + $jam.CD( url ) + '"><image src="' + $jam.CD( url ) + '" /></a>' )
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
$jam.BU( 'wc:BA', function( nodeRoot ){
nodeRoot= $jam.CH( nodeRoot )
var script= $jam.CH.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.DI( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.md( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.CH.Element( 'wc:BB' )
$jam.CH.Element( 'wc:BC' ).text( user.display_name ).parent( message )
$jam.CH.Element( 'wc:BD' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} )
;$jam.BU
(   'wc:V'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.CH( nodeRoot )
var source= $jam.CD( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
nodeRoot.clear()
var nodeSource= $jam.CH.parse( '<div class=" wc_editor_content " />' )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= $jam.CV( 50, function( ){
//var source= $jam.BX( nodeSource.text() ).replace( /\n?\r?$/, '\n' ).$
var source= nodeSource.text()
if( source === sourceLast ) return
sourceLast= source
source=
$jam.BX( source )
.process( $lang( nodeRoot.attr( 'wc:AY' ) ) )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
//.replace( /[^\n<>](?:<[^<>]+>)*$/, '$&\n' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
var nodeRange= $jam.CL().aimNodeContent( nodeSource )
var startPoint= $jam.CL().collapse2start()
//console.log(nodeRange.html())
var endPoint= $jam.CL().collapse2end()
var hasStart= nodeRange.hasRange( startPoint )
var hasEnd= nodeRange.hasRange( endPoint )
if( hasStart ){
var metRange= $jam.CL()
.equalize( 'end2start', startPoint )
.equalize( 'start2start', nodeRange )
var offsetStart= metRange.text().length
}
if( hasEnd ){
var metRange= $jam.CL()
.equalize( 'end2start', endPoint )
.equalize( 'start2start', nodeRange )
var offsetEnd= metRange.text().length
//console.log(metRange.html(),metRange.text(), offsetEnd)
}
//console.log(offsetStart,offsetEnd)
nodeSource.html( source )
var selRange= $jam.CL()
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
//if( source.charAt( source.length -1 ) !== '\n' ) nodeSource.tail( $jam.CH.Text( '\n' ) )
//if( !source ) $jam.CL().aimNode( nodeSource.head() ).collapse2end().select()
//if( nodeSource.tail() && nodeSource.tail().name() !== 'br' ) nodeSource.tail( $jam.CH.Element( 'br' ) )
} )
var onEdit=
nodeRoot.listen( '$jam.DD', update )
var onEnter=
nodeRoot.listen( 'keypress', function( event ){
event= $jam.CJ( event )
if( !event.keyCode().enter ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.CL().html( '<br/>' ).collapse2end().select()
})
var onAltSymbol=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.CJ( event )
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
var symbol= symbolSet[ $jam.CI( event.keyCode() ) ]
if( !symbol ) return
event.defaultBehavior( false )
$jam.CL().text( symbol ).collapse2end().select()
})
//var onBackspace=
//nodeRoot.listen( 'keydown', function( event ){
//    event= $jam.CJ( event )
//    if( event.keyCode() != 8 ) return
//    if( event.keyAccel() ) return
//    event.defaultBehavior( false )
//    var fullRange= $jam.CL().aimNodeContent( nodeSource )
//    var newOffset= fullRange.clone().equalize( 'end2start', $jam.CL() ).text().length - 1
//    if( newOffset < 0 ) newOffset= 0
//    var range= fullRange.clone().move( newOffset ).equalize( 'end2end', $jam.CL() )
//    range.dropContents()
//})
var onTab=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.CJ( event )
if( !event.keyCode().tab ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.CL().text( '    ' ).collapse2end().select()
})
var onLeave=
nodeSource.listen( 'blur', function( event ){
$jam.CJ().type( '$jam.DB' ).scream( nodeRoot )
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.CJ( event )
if( !event.keyMeta() ) return
nodeRoot.attr( 'wc:W', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.CJ( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc:W', false )
event.defaultBehavior( false )
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
$jam.BN( 0, update )
nodeRoot.attr( 'wc:X', true )
}
}
)
;$jam.BU
(   'wc:Z'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.CH( nodeRoot )
var hlight= $lang( nodeRoot.state( 'lang' ) )
var source= $jam.BX( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;$jam.BU
(   'wc:AD'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.CH( nodeRoot )
var nodeHeader=
$jam.CH.parse( '<wc:AE title="ctrl + enter" />' )
.tail( $jam.CH.parse( '<wc:AH>Run ►' ) )
.tail( $jam.CH.parse( '<wc:AG>inner (µs)' ) )
.tail( $jam.CH.parse( '<wc:AG>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.CH.Element( 'wc:AA' ).parent( nodeRoot )
//var nodeClone= $jam.CH.parse( '<wc:AB title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.CH.parse( '<wc:AC>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:AF' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.CJ()
.type( '$jam.DB' )
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
$jam.BU
(   'wc:AF'
,   new function( ){
var queue=
$jam.CS()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.CH( nodeRoot )
var source= $jam.BX( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.CH.parse( '<wc:AI><wc:V wc:AY="js">' + $jam.CD( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.CH.parse( '<wc:AJ class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.CH.parse( '<wc:AJ class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.CH.Fragment() ) // for chrome 12
var calc= $jam.CU( function( source ){
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
$jam.CH.Element( 'wc:AF' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.DB', schedule )
var onClone=
nodeRoot.listen( '$jam.DA', clone )
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
;$jam.BU
(   'wc:C'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.CH( nodeRoot )
var exec= $jam.CU( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.BX( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.CH.Element( 'wc:AL' ).parent( nodeRoot )
var nodeSource= $jam.CH.parse( '<wc:V wc:AY="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.CH.Element( 'wc:AA' ).parent( nodeRoot )
var nodeClone= $jam.CH.parse( '<wc:AB title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.CH.parse( '<wc:AC>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
if( passed() !== 'wait' ) throw new Error( 'Test already done' )
}
_test.ok=
$jam.BK
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
$jam.BK
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
$jam.BK
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.BN( ms, noMoreWait )
}
)
var passed=
$jam.BK
(   function( ){
return nodeRoot.state( 'passed' )
}
,   function( val ){
nodeRoot.state( 'passed', val )
}
)
var print=
function( val ){
var node= $jam.CH.Element( 'wc:AM' )
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
print( $jam.CE( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc:AM' )
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
$jam.CH.Element( 'wc:C' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.DB', run )
var onClone=
nodeRoot.listen( '$jam.DA', clone )
var onClone=
nodeRoot.listen( '$jam.DC', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.CJ().type( '$jam.DA' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.CJ().type( '$jam.DC' ).scream( event.target() )
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
;$jam.BU
(   'wc:AO'
,   function( nodeRoot ){
nodeRoot= $jam.CH( nodeRoot )
nodeRoot.listen
(   '$jam.DD'
,   function( ){
var text= $jam.CC( nodeRoot.html() )
nodeRoot.state( 'modified', text !== textLast )
}
)
nodeRoot.listen
(   '$jam.DD'
,   $jam.CV
(   5000
,   save
)
)
nodeRoot.listen
(   '$jam.DB'
,   save
)
var textLast= $jam.CC( nodeRoot.html() )
function save( ){
var text= $jam.CC( nodeRoot.html() )
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
;$jam.DG( 'https://github.com/nin-jin/wc' )
;$jam.BU
(   'wc:AS'
,   function( nodeRoot ){
nodeRoot=
$jam.CH( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.CH.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.BK
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
;$jam.DG( 'https://github.com/nin-jin/doc' )
