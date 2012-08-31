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
;$jam.EW( '$jam.EX', $jam.EU( $jam.EV().document ) )
;$jam.EW
(   '$jam.EY'
,   function( timeout, proc ){
var timerID= $jam.EV().setTimeout( proc, timeout )
return function( ){
$jam.EV().clearTimeout( timerID )
}
}
)
;$jam.EW
(   '$jam.EZ.then'
,   function( proc ){
var checker= function( ){
if( $jam.EZ() ) proc()
else $jam.EY( 10, checker )
}
checker()
}
)
;$jam.EW
(   '$jam.EZ'
,   function( ){
var state= $jam.EX().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.EW
(   '$jam.FA'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.EW
(   '$jam.FB'
,   new function(){
var Support= function( state ){
var sup= $jam.EU( state )
sup.select= function( map ){
return $jam.FA( this(), map )
}
return sup
}
var node= $jam.EX().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.EV().DOMParser && $jam.EV().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.EW
(   '$jam.FC'
,   function( tagName, factory ){
if(!( this instanceof $jam.FC )) return new $jam.FC( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.EX().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.EX().documentElement.namespaceURI
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
$jam.EZ.then(function whenReady(){
$jam.EV().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.EX().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.FB.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.FB.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
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
;$jam.FD=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.FD
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
(   '$jam.FE'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.EW
(   '$jam.FF'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.EW
(   '$jam.FG'
,   new function(){
var fromCharCode= $jam.EV().String.fromCharCode
var parseInt= $jam.EV().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.FF[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.EW
(   '$jam.FH'
,   function( html ){
return $jam.FG
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.EW
(   '$jam.FI'
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
(   '$jam.FJ'
,   $jam.FD( function( klass, proto ){
proto.constructor=
$jam.FE
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
$jam.FE
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.FI( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.FI( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.FE
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.FI( keyList ) === 'String' ){
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
if( $jam.FI( cur[ key ] ) === 'Object' ){
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
if( $jam.FI( json ) === 'String' ){
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
$jam.FE
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
(   '$jam.FK'
,   $jam.FD( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.FL( node )
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
(   '$jam.FM'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.FD ) return obj
return klass.raw( obj )
}
)
;$jam.FN=
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
;$jam.FO=
$jam.FD( function( klass, proto ){
proto.constructor=
$jam.FE
(   function( ){
this.$= $jam.EX().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.FE
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.FE
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.FE
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.FE
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.FE
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.FE
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.FE
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.FN( code ) ]= code
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
$jam.FE
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
$jam.FE
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
$jam.FM( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.EW
(   '$jam.FP'
,   $jam.FD( function( klass, proto ){
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
$jam.FE
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
$jam.FE
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.FM( node )
return this
}
)
proto.handler=
$jam.FE
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.FO( event ) )
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
$jam.FE
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
(   '$jam.FL'
,   $jam.FD( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.EX().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.EX().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.EX().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.EX().createDocumentFragment() )
}
proto.text=
$jam.FE
(   function( ){
return $jam.FH( this.$.innerHTML )
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
$jam.FE
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
$jam.FE
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
$jam.FE
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.FJ({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.FJ({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.FE
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
return $jam.FK( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.FK( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.FK( filtered )
}
proto.parent= 
$jam.FE
(   function( ){
return $jam.FL( this.$.parentNode )
}
,   function( node ){
node= $jam.FM( node )
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
var node= $jam.FM( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.FL.Text( '\r\n' ) )
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
$jam.FE
(   function(){
return $jam.FL( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.FM( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.FE
(   function(){
return $jam.FL( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.FM( node ) )
return this
}
)
proto.next=
$jam.FE
(   function(){
return $jam.FL( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.FM( node ), next ) 
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
$jam.FE
(   function(){
return $jam.FL( this.$.previousSibling )
}
,   function( node ){
node= $jam.FM( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.FE
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
var fragment= $jam.FL.Fragment()
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
return $jam.FL( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.FL( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.FP()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.FC
(   'wc:C'
,   function( nodeRoot ){
return new function( ){
var update= function( ){
nodeRoot= $jam.FL( nodeRoot )
var ratio= parseFloat( nodeRoot.attr( 'wc:DY' ) )
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
;$jam.EW
(   '$jam.FQ'
,   $jam.FD( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.FM( data ) || '' )
return this
}
proto.incIndent=
$jam.FE
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.FE
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.FE
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
$jam.FE
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.FE
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
$jam.FE
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.FE
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
$jam.FE
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.FE
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.FE
(   function( ){
return this.$
}
)
})
)
;$jam.EW
(   '$jam.FR'
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
(   '$jam.FS'
,   $jam.FR( function(){
var poolNode= $jam.FR( function(){
var body= $jam.EX().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.EX().createElement( 'wc:DZ:pool' )
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
var starter= $jam.EX().createElement( 'button' )
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
(   '$jam.FT'
,   $jam.FS(function( source ){
return $jam.EV().eval( source )
})
)
;$jam.EW
(   '$jam.FU'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.FO().type( '$jam.FU' ).scream( event.target() )
}
$jam.FL( $jam.EX().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.EW
(   '$jam.FV'
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
return $lang[ name ] || $lang.I
}
$lang.I= $jam.FV
;$lang.FW=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;$jam.EW
(   '$jam.FX'
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
(   '$jam.FY'
,   $jam.FD( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.FY.escape( chunk )
str+= chunk
}
return $jam.FY( str )
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
(   '$jam.FZ'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.FY( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.FY(regexp).count()
return $jam.FD( function( klass, proto ){
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
(    '$jam.GA'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.FX()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.FZ( lexems )
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
(   '$jam.GB'
,   function( delim ){
delim= delim || ''
return function( list ){
return list.join( delim )
}
}
)
;$lang.GC=
function( map ){
if( !map[ '' ] ) map[ '' ]= $lang.I
return $jam.FX
(   $jam.GA( map )
,   $jam.GB()
)
}
;$lang.K=
new function(){
var css=
function( str ){
return css.root( css.stylesheet( str ) )
}
css.root= $lang.FW( 'lang:K' )
css.remark= $lang.FW( 'lang:L' )
css.string= $lang.FW( 'lang:R' )
css.bracket= $lang.FW( 'lang:S' )
css.selector= $lang.FW( 'lang:M' )
css.tag= $lang.FW( 'lang:N' )
css.id= $lang.FW( 'lang:O' )
css.klass= $lang.FW( 'lang:P' )
css.pseudo= $lang.FW( 'lang:Q' )
css.property= $lang.FW( 'lang:T' )
css.value= $lang.FW( 'lang:U' )
css.stylesheet=
$lang.GC( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.FX( $lang.I, css.remark )
this[ /(\*|(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.FX( $lang.I, css.tag )
this[ /(#(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.FX( $lang.I, css.id )
this[ /(\.(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.FX( $lang.I, css.klass )
this[ /(::?(?:\\[\s\S]|[\w-])+)/.source ]=
$jam.FX( $lang.I, css.pseudo )
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
$lang.GC( new function( ){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.FX( $lang.I, css.remark )
this[ /([\w-]+\s*:)/.source  ]=
$jam.FX( $lang.I, css.property )
this[ /([^:]+?(?:;|$))/.source ]=
$jam.FX( $lang.I, css.value )
})
return css
}
;$lang.V=
new function(){
var pcre=
function( str ){
return pcre.root( pcre.content( str ) )
}
pcre.root= $lang.FW( 'lang:V' )
pcre.backslash= $lang.FW( 'lang:W' )
pcre.control= $lang.FW( 'lang:Y' )
pcre.spec= $lang.FW( 'lang:X' )
pcre.text= $lang.FW( 'lang:EA' )
pcre.content=
$lang.GC( new function(){
this[ /\\([\s\S])/.source ]=
new function( ){
var backslash= pcre.backslash( '\\' )
return function( symbol ){
return backslash + pcre.spec( $lang.I( symbol ) )
}
}
this[ /([(){}\[\]$*+?^])/.source ]=
$jam.FX( $lang.I, pcre.control )
})
return pcre
}
;$lang.Z=
new function(){
var js=
function( str ){
return js.root( js.content( str ) )
}
js.root= $lang.FW( 'lang:Z' )
js.remark= $lang.FW( 'lang:AA' )
js.string= $lang.FW( 'lang:AB' )
js.internal= $lang.FW( 'lang:AC' )
js.external= $lang.FW( 'lang:AD' )
js.keyword= $lang.FW( 'lang:AE' )
js.number= $lang.FW( 'lang:AF' )
js.regexp= $lang.FW( 'lang:AG' )
js.bracket= $lang.FW( 'lang:AH' )
js.operator= $lang.FW( 'lang:AI' )
js.content=
$lang.GC( new function(){
this[ /(\/\*[\s\S]*?\*\/)/.source ]=
$jam.FX( $lang.I, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.FX( $lang.I, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.FX( $lang.I, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.FX( $lang.I, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.FX( $lang.V, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.FX( $lang.I, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.FX( $lang.I, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.FX( $lang.I, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.FX( $lang.I, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.FX( $lang.I, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.FX( $lang.I, js.operator )
})
return js
}
;$lang.AJ=
new function(){
var sgml=
function( str ){
return sgml.root( sgml.content( str ) )
}
sgml.root= $lang.FW( 'lang:AJ' )
sgml.tag= $lang.FW( 'lang:AK' )
sgml.tagBracket= $lang.FW( 'lang:EB' )
sgml.tagName= $lang.FW( 'lang:AL' )
sgml.attrName= $lang.FW( 'lang:AM' )
sgml.attrValue= $lang.FW( 'lang:AN' )
sgml.comment= $lang.FW( 'lang:AO' )
sgml.decl= $lang.FW( 'lang:AP' )
sgml.tag=
$jam.FX
(   $lang.GC( new function(){
this[ /^(<\/?)([a-zA-Z][\w:-]*)/.source ]=
function( bracket, tagName ){
return sgml.tagBracket( $lang.I( bracket ) ) + sgml.tagName( tagName )
} 
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([sS][tT][yY][lL][eE])(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.K.style( value ) + close )
return prefix + name + sep + value
}
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(")([\s\S]*?)(")/.source ]=
this[ /(\s)([oO][nN]\w+)(\s*=\s*)(')([\s\S]*?)(')/.source ]=
function( prefix, name, sep, open, value, close ){
name= sgml.attrName( name )
value= sgml.attrValue( open + $lang.Z( value ) + close )
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
,   $lang.FW( 'lang:AK' )
)
sgml.content=
$lang.GC( new function(){
this[ /(<!--[\s\S]*?-->)/.source ]=
$jam.FX( $lang.I, sgml.comment )
this[ /(<![\s\S]*?>)/.source ]=
$jam.FX( $lang.I, sgml.decl )
this[ /(<[sS][tT][yY][lL][eE][^>]*>)([\s\S]+?)(<\/[sS][tT][yY][lL][eE]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.AJ.tag( prefix )
postfix= $lang.AJ.tag( postfix )
content= $lang.K( content )
return prefix + content + postfix
}
this[ /(<[sS][cC][rR][iI][pP][tT][^>]*>)([\s\S]+?)(<\/[sS][cC][rR][iI][pP][tT]>)/.source ]=
function( prefix, content, postfix ){
prefix= $lang.AJ.tag( prefix )
postfix= $lang.AJ.tag( postfix )
content= $lang.Z( content )
return prefix + content + postfix
}
this[ /(<[^>]+>)/.source ]=
sgml.tag
})
return sgml
}
;$jam.FC
(   'wc:A'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FL( nodeRoot )
var source= $jam.FQ( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeResult=
$jam.FL.Element( 'wc:AQ' )
.parent( nodeRoot )
var nodeSource0=
$jam.FL.Element( 'wc:AR' )
.parent( nodeRoot )
var nodeSource=
$jam.FL.parse( '<wc:BC wc:EC="sgml" />' )
.text( source )
.parent( nodeSource0 )
var exec= $jam.FS( function( ){
var source= $jam.FQ( nodeSource.text() ).minimizeIndent().trim( /[\n\r]/ )
//nodeSource.text( source )
nodeResult.html( source )
var scripts= nodeResult.descList( 'script' )
for( var i= 0; i < scripts.length; ++i ){
var script= $jam.FL( scripts[i] )
$jam.FT( script.text() )
}
return true
})
exec()
var onCommit=
nodeSource.listen( '$jam.FU', exec )
this.destroy=
function( ){
onCommit.sleep()
}
}
}
)
;$jam.EW
(   '$jam.GD'
,   $jam.EV().encodeURIComponent
)
;$lang.ED=
new function( ){
var php=
function( str ){
return php.root( php.content( str ) )
}
php.root= $lang.FW( 'lang:ED' )
php.dollar= $lang.FW( 'lang:AT' )
php.variable= $lang.FW( 'lang:AU' )
php.string= $lang.FW( 'lang:AV' )
php.number= $lang.FW( 'lang:AY' )
php.func= $lang.FW( 'lang:AW' )
php.keyword= $lang.FW( 'lang:AX' )
php.content=
$lang.GC( new function(){
this[ /\b(__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|for|foreach|function|global|gotoif|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/.source ]=
$jam.FX( $lang.I, php.keyword )
this[ /(\$)(\w+)\b/.source ]=
function( dollar, variable ){
dollar= $lang.ED.dollar( dollar )
variable= $lang.ED.variable( variable )
return dollar + variable
}
this[ /(\w+)(?=\s*\()/.source ]=
php.func
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.FX( $lang.I, php.string )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.FX( $lang.I, php.number )
})
return php
}
;$jam.EW
(    '$lang.EE'
,    new function(){
var tags=
function( str ){
return tags.root( tags.content( str ) )
}
tags.root= $lang.FW( 'lang:EE' )
tags.item= $lang.FW( 'lang:EF' )
tags.content=
$lang.GC( new function(){
this[ /^(\s*?)([^\n\r]+)(\s*?)$/.source ]=
function( open, text, close ){
return open + '<a href="?gist/list/' + $jam.FV( text ) + '">' + tags.item( text ) + '</a>' + close
}
})
return tags
}
) 
;$lang.AZ=
new function(){
var md=
function( str ){
return md.root( md.content( str ) )
}
md.root= $lang.FW( 'lang:AZ' )
md.header1= $lang.FW( 'lang:BQ' )
md.header2= $lang.FW( 'lang:BP' )
md.header3= $lang.FW( 'lang:BO' )
md.header4= $lang.FW( 'lang:EG' )
md.header5= $lang.FW( 'lang:EH' )
md.header6= $lang.FW( 'lang:EI' )
md.headerMarker= $lang.FW( 'lang:BR' )
md.quote= $lang.FW( 'lang:BS' )
md.quoteMarker= $lang.FW( 'lang:BT' )
md.quoteInline= $lang.FW( 'lang:BU' )
md.quoteInlineMarker= $lang.FW( 'lang:BV' )
md.image= $lang.FW( 'lang:BF' )
md.imageHref= $lang.FW( 'lang:BG' )
md.embed= $lang.FW( 'lang:BA' )
md.embedHref= $lang.FW( 'lang:BB' )
md.link= $lang.FW( 'lang:BH' )
md.linkMarker= $lang.FW( 'lang:BK' )
md.linkTitle= $lang.FW( 'lang:BI' )
md.linkHref= $lang.FW( 'lang:BJ' )
md.author= $lang.FW( 'lang:BL' )
md.indent= $lang.FW( 'lang:BM' )
md.escapingMarker= $lang.FW( 'lang:CG' )
md.emphasis= $lang.FW( 'lang:CH' )
md.emphasisMarker= $lang.FW( 'lang:CI' )
md.strong= $lang.FW( 'lang:CJ' )
md.strongMarker= $lang.FW( 'lang:CK' )
md.super= $lang.FW( 'lang:CL' )
md.superMarker= $lang.FW( 'lang:CM' )
md.sub= $lang.FW( 'lang:CN' )
md.subMarker= $lang.FW( 'lang:CO' )
md.math= $lang.FW( 'lang:BW' )
md.remark= $lang.FW( 'lang:CP' )
md.table= $lang.FW( 'lang:BX' )
md.tableRow= $lang.FW( 'lang:BY' )
md.tableCell= $lang.FW( 'lang:CA' )
md.tableMarker= $lang.FW( 'lang:CB' )
md.code= $lang.FW( 'lang:CC' )
md.codeMarker= $lang.FW( 'lang:CD' )
md.codeLang= $lang.FW( 'lang:CE' )
md.codeContent= $lang.FW( 'lang:CF' )
md.html= $lang.FW( 'lang:EJ' )
md.htmlTag= $lang.FW( 'lang:EK' )
md.htmlContent= $lang.FW( 'lang:EL' )
md.para= $lang.FW( 'lang:BN' )
md.inline=
$lang.GC( new function(){
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
return md.link( '<a href="' + $jam.FV( uri ) + '">' + open + title + middle + href + close + '</a>' )
}
// image
// [url]
this[ /(\[)([^\[\]]+)(\])/.source ]=
function( open, href, close ){
return md.image( md.imageHref( open + href + close ) + '<a href="' + $jam.FV( href ) + '"><object data="' + $jam.FV( href ) + '"></object></a>' )
}
// emphasis
// /some text/
this[ /([^\s"({[]\/)/.source ]=
$lang.I
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
$lang.I            
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
$lang.GC( new function(){
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
var embed= md.embed( '<wc:C wc:DY=".75"><iframe class="wc_lang_md_embed-object" src="' + uri + '" allowfullscreen></iframe></wc:C>' )
return href + embed
}
// image
// http://gif1.ru/gifs/267.gif
this[ /^((?:[\?\/\.]|https?:|ftps?:).*?)$(\n?)/.source ]=
function( url, close ){
var href= md.embedHref( url + close )
url= url.replace( /\xAD/g, '' )
var embed= md.embed( '<a href="' + $jam.FV( url ) + '"><image src="' + $jam.FV( url ) + '" /></a>' )
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
var rowSep= '<lang:BZ><wc:EM colspan="300">\n--</wc:EM></lang:BZ>'
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
$jam.FC( 'wc:EN', function( nodeRoot ){
nodeRoot= $jam.FL( nodeRoot )
var script= $jam.FL.Element( 'script' ).attr( 'src', '//nin-jin.disqus.com/thread.js?url=' + $jam.GD( '//' + document.location.host + document.location.pathname ) )
script.listen( 'load', function( ){
console.log( DISQUS.jsonData )
var thread= nodeRoot.html( $lang.AZ( '  0 *a* b' ) )
var postList= DISQUS.jsonData.posts
var userList= DISQUS.jsonData.users
for( var id in postList ){
var post= postList[ id ]
var user= userList[ post.user_key ]
var message= $jam.FL.Element( 'wc:EO' )
$jam.FL.Element( 'wc:EP' ).text( user.display_name ).parent( message )
$jam.FL.Element( 'wc:EQ' ).text( post.raw_message ).parent( message )
message.parent( nodeRoot )
}
} )
nodeRoot.head( script )
} )
;$jam.EW
(    '$jam.GE'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.EY( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.EW
(  '$jam.GF'
,   function( ){
return $jam.EV().getSelection()
}
)
;$jam.EW
(   '$jam.GG'
,   $jam.FD( function( klass, proto ){
proto.constructor=
$jam.FE
(   function( ){
var sel= $jam.GF()
if( sel.rangeCount ) this.$= sel.getRangeAt( 0 ).cloneRange()
else this.$= $jam.EX().createRange()
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
var sel= $jam.GF()
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
$jam.FE
(   function( ){
return $jam.FH( this.html() )
}
,   function( text ){
this.html( $jam.FV( text ) )
return this
}
)
proto.html=
$jam.FE
(   function( ){
return $jam.FL( this.$.cloneContents() ).toString()
}
,   function( html ){
var node= html ? $jam.FL.parse( html ).$ : $jam.FL.Text( '' ).$
this.replace( node )
return this
}
)
proto.replace=
function( node ){
node= $jam.FM( node )
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
range= $jam.GG( range ).$
how= Range[ how.replace( '2', '_to_' ).toUpperCase() ]
return range.compareBoundaryPoints( how, this.$ )
}
proto.hasRange=
function( range ){
range= $jam.GG( range )
var isAfterStart= ( this.compare( 'start2start', range ) >= 0 )
var isBeforeEnd= ( this.compare( 'end2end', range ) <= 0 )
return isAfterStart && isBeforeEnd
}
proto.equalize=
function( how, range ){
how= how.split( 2 )
var method= { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
range= $jam.GG( range ).$
this.$[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
return this
}
proto.move=
function( offset ){
this.collapse2start()
if( offset === 0 ) return this
var current= $jam.FL( this.$.startContainer )
if( this.$.startOffset ){
var temp= current.$.childNodes[ this.$.startOffset - 1 ]
if( temp ){
current= $jam.FL( temp ).follow()
} else {
offset+= this.$.startOffset
}
}
while( current ){
if( current.name() === '#text' ){
var range= $jam.GG().aimNode( current )
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
var range= $jam.GG().aimNode( current )
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
return $jam.GG( this.$.cloneRange() )
}
proto.aimNodeContent=
function( node ){
this.$.selectNodeContents( $jam.FM( node ) )
return this
}
proto.aimNode=
function( node ){
this.$.selectNode( $jam.FM( node ) )
return this
}
})
)
;$jam.EW
(   '$jam.GH'
,   new function(){
var scream=
$jam.GE
(   50
,   function( target ){
$jam.FO().type( '$jam.GH' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.FL( $jam.EX().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.FC
(   'wc:BC'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FL( nodeRoot )
var source= $jam.FV( nodeRoot.text() ).replace( /\r?\n/g, '<br />' )
nodeRoot.clear()
var nodeSource= $jam.FL.parse( '<div class=" wc_editor_content " />' )
.html( source )
.parent( nodeRoot )
var sourceLast= ''
var update= $jam.GE( 50, function( ){
//var source= $jam.FQ( nodeSource.text() ).replace( /\n?\r?$/, '\n' ).$
var source= nodeSource.text()
if( source === sourceLast ) return
sourceLast= source
source=
$jam.FQ( source )
.process( $lang( nodeRoot.attr( 'wc:EC' ) ) )
.replace( /  /g, '\u00A0 ' )
.replace( /  /g, ' \u00A0' )
//.replace( /[^\n<>](?:<[^<>]+>)*$/, '$&\n' )
.replace( /$/, '\n' )
.replace( /\n/g, '<br/>' )
.$
var nodeRange= $jam.GG().aimNodeContent( nodeSource )
var startPoint= $jam.GG().collapse2start()
//console.log(nodeRange.html())
var endPoint= $jam.GG().collapse2end()
var hasStart= nodeRange.hasRange( startPoint )
var hasEnd= nodeRange.hasRange( endPoint )
if( hasStart ){
var metRange= $jam.GG()
.equalize( 'end2start', startPoint )
.equalize( 'start2start', nodeRange )
var offsetStart= metRange.text().length
}
if( hasEnd ){
var metRange= $jam.GG()
.equalize( 'end2start', endPoint )
.equalize( 'start2start', nodeRange )
var offsetEnd= metRange.text().length
//console.log(metRange.html(),metRange.text(), offsetEnd)
}
//console.log(offsetStart,offsetEnd)
nodeSource.html( source )
var selRange= $jam.GG()
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
//if( source.charAt( source.length -1 ) !== '\n' ) nodeSource.tail( $jam.FL.Text( '\n' ) )
//if( !source ) $jam.GG().aimNode( nodeSource.head() ).collapse2end().select()
//if( nodeSource.tail() && nodeSource.tail().name() !== 'br' ) nodeSource.tail( $jam.FL.Element( 'br' ) )
} )
var onEdit=
nodeRoot.listen( '$jam.GH', update )
var onEnter=
nodeRoot.listen( 'keypress', function( event ){
event= $jam.FO( event )
if( !event.keyCode().enter ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.GG().html( '<br/>' ).collapse2end().select()
})
var onAltSymbol=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.FO( event )
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
var symbol= symbolSet[ $jam.FN( event.keyCode() ) ]
if( !symbol ) return
event.defaultBehavior( false )
$jam.GG().text( symbol ).collapse2end().select()
})
//var onBackspace=
//nodeRoot.listen( 'keydown', function( event ){
//    event= $jam.FO( event )
//    if( event.keyCode() != 8 ) return
//    if( event.keyAccel() ) return
//    event.defaultBehavior( false )
//    var fullRange= $jam.GG().aimNodeContent( nodeSource )
//    var newOffset= fullRange.clone().equalize( 'end2start', $jam.GG() ).text().length - 1
//    if( newOffset < 0 ) newOffset= 0
//    var range= fullRange.clone().move( newOffset ).equalize( 'end2end', $jam.GG() )
//    range.dropContents()
//})
var onTab=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.FO( event )
if( !event.keyCode().tab ) return
if( event.keyAccel() ) return
event.defaultBehavior( false )
$jam.GG().text( '    ' ).collapse2end().select()
})
var onLeave=
nodeSource.listen( 'blur', function( event ){
$jam.FO().type( '$jam.FU' ).scream( nodeRoot )
})
var onActivate=
nodeRoot.listen( 'mousedown', function( event ){
event= $jam.FO( event )
if( !event.keyMeta() ) return
nodeRoot.attr( 'wc:BD', true )
nodeSource.editable( true )
})
var onDeactivate=
nodeRoot.listen( 'keydown', function( event ){
event= $jam.FO( event )
if( !event.keyCode().escape ) return
nodeSource.editable( false )
nodeRoot.attr( 'wc:BD', false )
event.defaultBehavior( false )
})
this.destroy= function( ){
onEdit.sleep()
onLeave.sleep()
}
$jam.EY( 0, update )
nodeRoot.attr( 'wc:CQ', true )
}
}
)
;$jam.FC
(   'wc:CT'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FL( nodeRoot )
var hlight= $lang( nodeRoot.state( 'lang' ) )
var source= $jam.FQ( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.html( hlight( source ) )
}
}
)
;$jam.GI=
$jam.FD( function( klass, proto ){
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
(   '$jam.GJ'
,   $jam.FD( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.FE
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
$jam.FE
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
$jam.FE
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
$jam.EY
(   this.latency()
,   $jam.GI( this )
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
(   '$jam.GK'
,   $jam.FD( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.GJ()
.handler( $jam.GI( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.FE
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.FE
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
(   '$jam.GL'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.FO().type( '$jam.GL' ).scream( event.target() )
}
$jam.FL( $jam.EX().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.FC
(   'wc:CX'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.FL( nodeRoot )
var nodeHeader=
$jam.FL.parse( '<wc:CY title="ctrl + enter" />' )
.tail( $jam.FL.parse( '<wc:DB>Run ►' ) )
.tail( $jam.FL.parse( '<wc:DA>inner (µs)' ) )
.tail( $jam.FL.parse( '<wc:DA>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.FL.Element( 'wc:CU' ).parent( nodeRoot )
//var nodeClone= $jam.FL.parse( '<wc:CV title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.FL.parse( '<wc:CW>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:CZ' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.FO()
.type( '$jam.FU' )
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
$jam.FC
(   'wc:CZ'
,   new function( ){
var queue=
$jam.GK()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.FL( nodeRoot )
var source= $jam.FQ( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.FL.parse( '<wc:DC><wc:BC wc:EC="js">' + $jam.FV( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.FL.parse( '<wc:DD class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.FL.parse( '<wc:DD class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.FL.Fragment() ) // for chrome 12
var calc= $jam.FS( function( source ){
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
$jam.FL.Element( 'wc:CZ' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.FU', schedule )
var onClone=
nodeRoot.listen( '$jam.GL', clone )
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
;$jam.EW
(   '$jam.GM'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.EV().confirm( 'Are you sure to delee this?' ) ) return
$jam.FO().type( '$jam.GM' ).scream( event.target() )
}
$jam.FL( $jam.EX().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.FC
(   'wc:B'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.FL( nodeRoot )
var exec= $jam.FS( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.FQ( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.FL.Element( 'wc:DF' ).parent( nodeRoot )
var nodeSource= $jam.FL.parse( '<wc:BC wc:EC="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.FL.Element( 'wc:CU' ).parent( nodeRoot )
var nodeClone= $jam.FL.parse( '<wc:CV title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.FL.parse( '<wc:CW>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
if( passed() !== 'wait' ) throw new Error( 'Test already done' )
}
_test.ok=
$jam.FE
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
$jam.FE
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
$jam.FE
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.EY( ms, noMoreWait )
}
)
var passed=
$jam.FE
(   function( ){
return nodeRoot.state( 'passed' )
}
,   function( val ){
nodeRoot.state( 'passed', val )
}
)
var print=
function( val ){
var node= $jam.FL.Element( 'wc:DG' )
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
print( $jam.FI( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc:DG' )
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
$jam.FL.Element( 'wc:B' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.FU', run )
var onClone=
nodeRoot.listen( '$jam.GL', clone )
var onClone=
nodeRoot.listen( '$jam.GM', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.FO().type( '$jam.GL' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.FO().type( '$jam.GM' ).scream( event.target() )
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
;$jam.FC
(   'wc:DI'
,   function( nodeRoot ){
nodeRoot= $jam.FL( nodeRoot )
nodeRoot.listen
(   '$jam.GH'
,   function( ){
var text= $jam.FH( nodeRoot.html() )
nodeRoot.state( 'modified', text !== textLast )
}
)
nodeRoot.listen
(   '$jam.GH'
,   $jam.GE
(   5000
,   save
)
)
nodeRoot.listen
(   '$jam.FU'
,   save
)
var textLast= $jam.FH( nodeRoot.html() )
function save( ){
var text= $jam.FH( nodeRoot.html() )
if( text === textLast ) return
var xhr= new XMLHttpRequest
xhr.open( text ? 'PUT' : 'DELETE', nodeRoot.attr( 'wc:ER' ) )
xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' )
xhr.send( nodeRoot.attr( 'wc:ES' ) + '=' + encodeURIComponent( text ) )
textLast= text
nodeRoot.state( 'modified', false )
}
return new function( ){
}
}
)
;$jam.GN=
function( ns ){
if( !$jam.EX().getElementsByTagNameNS ) return
var nodeList= $jam.EX().getElementsByTagNameNS( ns, '*' )
var docEl= $jam.EX().documentElement
var tracking= function( ){
sleep()
var node
while( node= nodeList[0] ){
var parent= node.parentNode
var newNode= $jam.EX().createElement( node.nodeName )
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
$jam.EZ.then( tracking )
tracking()
function rise( ){
docEl.addEventListener( 'DOMNodeInserted', tracking, false )
}
function sleep( ){
docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
}
}
;$jam.GN( 'https://github.com/nin-jin/wc' )
;$jam.FC
(   'wc:DN'
,   function( nodeRoot ){
nodeRoot=
$jam.FL( nodeRoot )
var nodeLink=
nodeRoot.childList( 'a' ).get( 0 )
var nodeFrame=
nodeRoot.childList( 'iframe' ).get( 0 )
if( !nodeFrame ) nodeFrame= $jam.FL.Element( 'iframe' ).parent( nodeRoot )
nodeFrame.attr( 'src', nodeLink.attr( 'href' ) )
var opened=
$jam.FE
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
