;if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
;$jam.BF= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.BF: ' + String( val )
}
return value
}
;$jam.BG= $jam.BF( this )
;$jam.BH=
new function( ){
var Ghost= function(){}
return function( key, value ){
var keyList= key.split( '.' )
var obj= $jam.BG()
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
;$jam.BH( '$jam.BI', $jam.BF( $jam.BG().document ) )
;$jam.BH
(   '$jam.BJ'
,   function( timeout, proc ){
var timerID= $jam.BG().setTimeout( proc, timeout )
return function( ){
$jam.BG().clearTimeout( timerID )
}
}
)
;$jam.BH
(   '$jam.BK.then'
,   function( proc ){
var checker= function( ){
if( $jam.BK() ) proc()
else $jam.BJ( 10, checker )
}
checker()
}
)
;$jam.BH
(   '$jam.BK'
,   function( ){
var state= $jam.BI().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.BH
(   '$jam.BL'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.BH
(   '$jam.BM'
,   new function(){
var Support= function( state ){
var sup= $jam.BF( state )
sup.select= function( map ){
return $jam.BL( this(), map )
}
return sup
}
var node= $jam.BI().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.BG().DOMParser && $jam.BG().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.BH
(   '$jam.BN'
,   function( tagName, factory ){
if(!( this instanceof $jam.BN )) return new $jam.BN( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.BI().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.BI().documentElement.namespaceURI
var checkName=
( tagName === '*' )
?    $jam.BF( true )
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
$jam.BG().setInterval( tracking, 200 )
$jam.BK.then(function whenReady(){
$jam.BG().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.BI().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.BM.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.BM.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
}, false )
this.tagName= $jam.BF( tagName )
this.factory= $jam.BF( factory )
this.elements=
function elements( ){
return elements.slice( 0 )
}
tracking()
}
)
;$jam.BO=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.BO
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
;$jam.BH
(   '$jam.BP'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.BH
(   '$jam.BQ'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.BH
(   '$jam.BR'
,   new function(){
var fromCharCode= $jam.BG().String.fromCharCode
var parseInt= $jam.BG().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.BQ[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.BH
(   '$jam.BS'
,   function( html ){
return $jam.BR
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.BH
(   '$jam.BT'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === $jam.BG() ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;$jam.BH
(   '$jam.BU'
,   $jam.BO( function( klass, proto ){
proto.constructor=
$jam.BP
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
$jam.BP
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.BT( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.BT( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.BP
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.BT( keyList ) === 'String' ){
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
if( $jam.BT( cur[ key ] ) === 'Object' ){
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
if( $jam.BT( json ) === 'String' ){
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
$jam.BP
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
;$jam.BH
(   '$jam.BV'
,   $jam.BO( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.BW( node )
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
;$jam.BH
(   '$jam.BX'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.BO ) return obj
return klass.raw( obj )
}
)
;$jam.BY=
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
;$jam.BZ=
$jam.BO( function( klass, proto ){
proto.constructor=
$jam.BP
(   function( ){
this.$= $jam.BI().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.BP
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.BP
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.BP
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.BP
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.BP
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.BP
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.BP
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.BY( code ) ]= code
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
$jam.BP
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
$jam.BP
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
$jam.BX( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.BH
(   '$jam.CA'
,   $jam.BO( function( klass, proto ){
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
$jam.BP
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
$jam.BP
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.BX( node )
return this
}
)
proto.handler=
$jam.BP
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.BZ( event ) )
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
$jam.BP
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
;$jam.BH
(   '$jam.BW'
,   $jam.BO( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.BI().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.BI().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.BI().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.BI().createDocumentFragment() )
}
proto.text=
$jam.BP
(   function( ){
return $jam.BS( this.$.innerHTML )
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
$jam.BP
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
$jam.BP
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
$jam.BP
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.BU({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.BU({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.BP
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
return $jam.BV( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.BV( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.BV( filtered )
}
proto.parent= 
$jam.BP
(   function( ){
return $jam.BW( this.$.parentNode )
}
,   function( node ){
node= $jam.BX( node )
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
var node= $jam.BX( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.BW.Text( '\r\n' ) )
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
$jam.BP
(   function(){
return $jam.BW( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.BX( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.BP
(   function(){
return $jam.BW( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.BX( node ) )
return this
}
)
proto.next=
$jam.BP
(   function(){
return $jam.BW( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.BX( node ), next ) 
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
$jam.BP
(   function(){
return $jam.BW( this.$.previousSibling )
}
,   function( node ){
node= $jam.BX( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.BP
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
var fragment= $jam.BW.Fragment()
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
return $jam.BW( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.BW( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.CA()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.BN
(   'wc:C'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.BW( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc:AV' ) )
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
;$jam.BH
(   '$jam.CB'
,   $jam.BO( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.BX( data ) || '' )
return this
}
proto.incIndent=
$jam.BP
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.BP
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.BP
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
$jam.BP
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.BP
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
$jam.BP
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.BP
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
$jam.BP
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.BP
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.BP
(   function( ){
return this.$
}
)
})
)
;$jam.BH
(   '$jam.CC'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.BF( gen )
return lazy
}
)
;$jam.BH
(   '$jam.CD'
,   $jam.CC( function(){
var poolNode= $jam.CC( function(){
var body= $jam.BI().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.BI().createElement( 'wc:AW:pool' )
pool.style.display= 'none'
body.insertBefore( pool, body.firstChild )
return $jam.BF( pool )
})
var free= []
return function( proc ){
return function( ){
var res
var self= this
var args= arguments
var starter= free.pop()
if( !starter ){
var starter= $jam.BI().createElement( 'button' )
poolNode().appendChild( starter )
}
starter.onclick= function( ev ){
( ev || $jam.BG().event ).cancelBubble= true
res= proc.apply( self, args )
}
starter.click()
free.push( starter )
return res
}
}
})
)
;$jam.BH
(   '$jam.CE'
,   $jam.CD(function( source ){
return $jam.BG().eval( source )
})
)
;$jam.BH
(   '$jam.CF'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.BZ().type( '$jam.CF' ).scream( event.target() )
}
$jam.BW( $jam.BI().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.BH
(   '$jam.CG'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;this.$lang=
function( name ){
return $lang[ name ] || $lang.text
}
$lang.text= $jam.CG
;$lang.Wrapper=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;$jam.BH
(   '$jam.CH'
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
;$jam.BH
(   '$jam.CI'
,   $jam.BO( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.CI.escape( chunk )
str+= chunk
}
return $jam.CI( str )
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
;$jam.BH
(   '$jam.CJ'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.CI( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.CI(regexp).count()
return $jam.BO( function( klass, proto ){
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
;$jam.BH
(    '$jam.CK'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.CH()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.CJ( lexems )
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
;$jam.BH
(   '$jam.CL'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$lang.Parser=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.text
return $jam.CH
(   $jam.CK( map )
,   $jam.CL()
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
$jam.CH( $lang.text, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CH( $lang.text, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CH( $lang.text, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CH( $lang.text, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.CH( $lang.text, css.pseudo )
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
$jam.CH( $lang.text, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.CH( $lang.text, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.CH( $lang.text, css.value )
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
$jam.CH( $lang.text, pcre.control )
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
$jam.CH( $lang.text, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.CH( $lang.text, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.CH( $lang.text, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.CH( $lang.text, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.CH( $lang.pcre, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.CH( $lang.text, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.CH( $lang.text, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.CH( $lang.text, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.CH( $lang.text, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.CH( $lang.text, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.CH( $lang.text, js.operator )
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
$jam.CH
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
$jam.CH( $lang.text, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.CH( $lang.text, sgml.decl )
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
;$jam.BN
(   'wc:A'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BW( nodeRoot )
var source= $jam.CB( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.BW.Element( 'wc:I' )
.parent( nodeRoot )
var nodeSource0=
$jam.BW.Element( 'wc:J' )
.parent( nodeRoot )
var nodeSource=
$jam.BW.parse( '<wc:L wc:AX="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jam.CD( function( ){
var source= $jam.CB( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
//nodeSource.text( source )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.BW( scripts[i] )
$jam.CE( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.CF', exec )
this.destroy=
function( ){
onCommit.sleep()
}
}
}
)
;$jam.BH
(   '$jam.CM'
,   $jam.BG().encodeURIComponent
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
$jam.CH( $lang.text, php.keyword )
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
$jam.CH( $lang.text, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.CH( $lang.text, php.number )
})
return php
}
;$jam.BH
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
return open + '<a href="?gist/list/' + $jam.CG( text ) + '">' + tags.item( text ) + '</a>' + close
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
return md.link( '<a href="' + $jam.CG( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
// image
// [url]
this[ /(\[)([^\[\]]+)(\])/.source ]=
function( open, href, close ){
return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.CG( href ) + '"><object data="' + $jam.CG( href ) + '"></object></a>' )
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
var embed= md.embed( '<wc:C wc:AV=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:C>' )
return href + embed
}
// image
// http://gif1.ru/gifs/267.gif
this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
function( url, close ){
var href= md.embedHref( url + close )
url= url.replace( /\xAD/g, '' )
var embed= md.embed( '<a href="' + $jam.CG( url ) + '"><image src="' + $jam.CG( url ) + '" /></a>' )
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
var rowSep= '<lang:md_table-row-sep><wc:AY colspan="300">\n--</wc:AY></lang:md_table-row-sep>'
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
$jam.BN( 'wc:AZ', function( nodeRoot ){
nodeRoot= $jam.BW( nodeRoot )
var script= $jam.BW.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.CM( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.md( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.BW.Element( 'wc:BA' )
$jam.BW.Element( 'wc:BB' ).text( user.display_name ).parent( message )
$jam.BW.Element( 'wc:BC' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} )
;$jam.BH
(    '$jam.CN'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.BJ( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.BH
(  '$jam.CO'
,   function( ){
return $jam.BG().getSelection()
}
)
;$jam.BH
(   '$jam.CP'
,   $jam.BO( function( klass, proto ){
proto.constructor=
$jam.BP
(   function( ){
var sel= $jam.CO()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= $jam.BI().createRange()
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
var sel= $jam.CO()
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
$jam.BP
(   function( ){
return $jam.BS( this.html() )
}
,   function( text ){
this.html( $jam.CG( text ) )
return this
}
)
proto.html=
$jam.BP
(   function( ){
return $jam.BW( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.BW.parse( html ).$ : $jam.BW.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.BX( node )
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
range= $jam.CP( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.CP( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.CP( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.BW( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.BW( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.CP().aimNode( current )
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
var range= $jam.CP().aimNode( current )
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
return $jam.CP( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.BX( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.BX( node ) )
return this
}
})
)
;$jam.BH
(   '$jam.CQ'
,   new function(){
var scream=
$jam.CN
(   50
,   function( target ){
$jam.BZ().type( '$jam.CQ' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.BW( $jam.BI().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.BN
(   'wc:L'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BW( nodeRoot )
var source= $jam.CG( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
nodeRoot.clear()
var nodeSource= $jam.BW.parse( '<div class=" wc_editor_content " />' )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= $jam.CN( 50, function( ){
//var source= $jam.CB( nodeSource.text() ).replace( /\n?\r?$/, '\n' ).$
var source= nodeSource.text()
if( source === sourceLast ) return
sourceLast= source
source=
$jam.CB( source )
.process( $lang( nodeRoot.attr( 'wc:AX' ) ) )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
//.replace( /[^\n<>](?:<[^<>]+>)*$/, '$&\n' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
var nodeRange= $jam.CP().aimNodeContent( nodeSource )
var startPoint= $jam.CP().collapse2start()
//console.log(nodeRange.html())
var endPoint= $jam.CP().collapse2end()
var hasStart= nodeRange.hasRange( startPoint )
var hasEnd= nodeRange.hasRange( endPoint )
if( hasStart ){
var metRange= $jam.CP()
.equalize( 'end2start', startPoint )
.equalize( 'start2start', nodeRange )
var offsetStart= metRange.text().length
}
if( hasEnd ){
var metRange= $jam.CP()
.equalize( 'end2start', endPoint )
.equalize( 'start2start', nodeRange )
var offsetEnd= metRange.text().length
//console.log(metRange.html(),metRange.text(), offsetEnd)
}
//console.log(offsetStart,offsetEnd)
nodeSource.html( source )
var selRange= $jam.CP()
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
//if( source.charAt( source.length -1 ) !== '\n' ) nodeSource.tail( $jam.BW.Text( '\n' ) )
//if( !source ) $jam.CP().aimNode( nodeSource.head() ).collapse2end().select()
//if( nodeSource.tail() && nodeSource.tail().name() !== 'br' ) nodeSource.tail( $jam.BW.Element( 'br' ) )
} )
var onEdit=
nodeRoot.listen( '$jam.CQ', update )
var onEnter=
nodeRoot.listen( 'keypress', function( event ){
event= $jam.BZ( event )
if( !event.keyCode().enter ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.CP().html( '<br/>' ).collapse2end().select()
})
var onAltSymbol=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.BZ( event )
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
var symbol= symbolSet[ $jam.BY( event.keyCode() ) ]
if( !symbol ) return
event.defaultBehavior( false )
$jam.CP().text( symbol ).collapse2end().select()
})
//var onBackspace=
//nodeRoot.listen( 'keydown', function( event ){
//    event= $jam.BZ( event )
//    if( event.keyCode() != 8 ) return
//    if( event.keyAccel() ) return
//    event.defaultBehavior( false )
//    var fullRange= $jam.CP().aimNodeContent( nodeSource )
//    var newOffset= fullRange.clone().equalize( 'end2start', $jam.CP() ).text().length - 1
//    if( newOffset < 0 ) newOffset= 0
//    var range= fullRange.clone().move( newOffset ).equalize( 'end2end', $jam.CP() )
//    range.dropContents()
//})
var onTab=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.BZ( event )
if( !event.keyCode().tab ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.CP().text( '    ' ).collapse2end().select()
})
var onLeave=
nodeSource.listen( 'blur', function( event ){
$jam.BZ().type( '$jam.CF' ).scream( nodeRoot )
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.BZ( event )
if( !event.keyMeta() ) return
nodeRoot.attr( 'wc:M', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.BZ( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc:M', false )
event.defaultBehavior( false )
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
$jam.BJ( 0, update )
nodeRoot.attr( 'wc:N', true )
}
}
)
;$jam.BN
(   'wc:Q'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BW( nodeRoot )
var hlight= $lang( nodeRoot.state( 'lang' ) )
var source= $jam.CB( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;$jam.CR=
$jam.BO( function( klass, proto ){
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
;$jam.BH
(   '$jam.CS'
,   $jam.BO( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.BP
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
$jam.BP
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
$jam.BP
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
$jam.BJ
(   this.latency()
,   $jam.CR( this )
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
;$jam.BH
(   '$jam.CT'
,   $jam.BO( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.CS()
.handler( $jam.CR( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.BP
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.BP
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
;$jam.BH
(   '$jam.CU'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.BZ().type( '$jam.CU' ).scream( event.target() )
}
$jam.BW( $jam.BI().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.BN
(   'wc:U'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.BW( nodeRoot )
var nodeHeader=
$jam.BW.parse( '<wc:V title="ctrl + enter" />' )
.tail( $jam.BW.parse( '<wc:Y>Run ►' ) )
.tail( $jam.BW.parse( '<wc:X>inner (µs)' ) )
.tail( $jam.BW.parse( '<wc:X>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.BW.Element( 'wc:R' ).parent( nodeRoot )
//var nodeClone= $jam.BW.parse( '<wc:S title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.BW.parse( '<wc:T>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:W' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.BZ()
.type( '$jam.CF' )
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
$jam.BN
(   'wc:W'
,   new function( ){
var queue=
$jam.CT()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.BW( nodeRoot )
var source= $jam.CB( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.BW.parse( '<wc:Z><wc:L wc:AX="js">' + $jam.CG( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.BW.parse( '<wc:AA class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.BW.parse( '<wc:AA class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.BW.Fragment() ) // for chrome 12
var calc= $jam.CD( function( source ){
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
$jam.BW.Element( 'wc:W' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.CF', schedule )
var onClone=
nodeRoot.listen( '$jam.CU', clone )
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
;$jam.BH
(   '$jam.CV'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.BG().confirm( 'Are you sure to delee this?' ) ) return
$jam.BZ().type( '$jam.CV' ).scream( event.target() )
}
$jam.BW( $jam.BI().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.BN
(   'wc:B'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.BW( nodeRoot )
var exec= $jam.CD( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.CB( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.BW.Element( 'wc:AC' ).parent( nodeRoot )
var nodeSource= $jam.BW.parse( '<wc:L wc:AX="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.BW.Element( 'wc:R' ).parent( nodeRoot )
var nodeClone= $jam.BW.parse( '<wc:S title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.BW.parse( '<wc:T>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
if( passed() !== 'wait' ) throw new Error( 'Test already done' )
}
_test.ok=
$jam.BP
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
$jam.BP
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
$jam.BP
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.BJ( ms, noMoreWait )
}
)
var passed=
$jam.BP
(   function( ){
return nodeRoot.state( 'passed' )
}
,   function( val ){
nodeRoot.state( 'passed', val )
}
)
var print=
function( val ){
var node= $jam.BW.Element( 'wc:AD' )
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
print( $jam.BT( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc:AD' )
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
$jam.BW.Element( 'wc:B' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.CF', run )
var onClone=
nodeRoot.listen( '$jam.CU', clone )
var onClone=
nodeRoot.listen( '$jam.CV', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.BZ().type( '$jam.CU' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.BZ().type( '$jam.CV' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
_test.ok= _test.not= $jam.BF()
}
}
}
)
;$jam.BN
(   'wc:AF'
,   function( nodeRoot ){
nodeRoot= $jam.BW( nodeRoot )
nodeRoot.listen
(   '$jam.CQ'
,   function( ){
var text= $jam.BS( nodeRoot.html() )
nodeRoot.state( 'modified', text !== textLast )
}
)
nodeRoot.listen
(   '$jam.CQ'
,   $jam.CN
(   5000
,   save
)
)
nodeRoot.listen
(   '$jam.CF'
,   save
)
var textLast= $jam.BS( nodeRoot.html() )
function save( ){
var text= $jam.BS( nodeRoot.html() )
if( text === textLast ) return
var xhr= new XMLHttpRequest
xhr.open( text ? 'PUT' : 'DELETE', nodeRoot.attr( 'wc:BD' ) )
xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
xhr.send( nodeRoot.attr( 'wc:BE' ) + '=' + encodeURIComponent( text ) )
textLast= text
nodeRoot.state( 'modified', false )
}
return new function( ){
}
}
)
;$jam.CW=
function( ns ){
if( !$jam.BI().getElementsByTagNameNS ) return
var nodeList= $jam.BI().getElementsByTagNameNS( ns, '*' )
var docEl= $jam.BI().documentElement
var tracking= function( ){
sleep()
var node
while( node= nodeList[0] ){
var parent= node.parentNode
var newNode= $jam.BI().createElement( node.nodeName )
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
$jam.BK.then( tracking )
tracking()
function rise( ){
docEl.addEventListener( 'DOMNodeInserted', tracking, false )
}
function sleep( ){
docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
}
}
;$jam.CW( 'https://github.com/nin-jin/wc' )
;$jam.BN
(   'wc:AK'
,   function( nodeRoot ){
nodeRoot=
$jam.BW( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.BW.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.BP
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
