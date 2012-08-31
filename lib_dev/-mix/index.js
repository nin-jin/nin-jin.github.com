;if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
;$jam.R= function( val ){
var value= function(){
return val
}
value.toString= function(){
return '$jam.R: ' + String( val )
}
return value
}
;$jam.S= $jam.R( this )
;$jam.T=
new function( ){
var Ghost= function(){}
return function( key, value ){
var keyList= key.split( '.' )
var obj= $jam.S()
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
;$jam.T( '$jam.U', $jam.R( $jam.S().document ) )
;$jam.T
(   '$jam.V'
,   function( timeout, proc ){
var timerID= $jam.S().setTimeout( proc, timeout )
return function( ){
$jam.S().clearTimeout( timerID )
}
}
)
;$jam.T
(   '$jam.W.then'
,   function( proc ){
var checker= function( ){
if( $jam.W() ) proc()
else $jam.V( 10, checker )
}
checker()
}
)
;$jam.T
(   '$jam.W'
,   function( ){
var state= $jam.U().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.T
(   '$jam.X'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.T
(   '$jam.Y'
,   new function(){
var Support= function( state ){
var sup= $jam.R( state )
sup.select= function( map ){
return $jam.X( this(), map )
}
return sup
}
var node= $jam.U().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.S().DOMParser && $jam.S().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.T
(   '$jam.Z'
,   function( tagName, factory ){
if(!( this instanceof $jam.Z )) return new $jam.Z( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.U().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.U().documentElement.namespaceURI
var checkName=
( tagName === '*' )
?    $jam.R( true )
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
$jam.S().setInterval( tracking, 200 )
$jam.W.then(function whenReady(){
$jam.S().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.U().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.Y.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.Y.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
}, false )
this.tagName= $jam.R( tagName )
this.factory= $jam.R( factory )
this.elements=
function elements( ){
return elements.slice( 0 )
}
tracking()
}
)
;$jam.AA=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.AA
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
;$jam.T
(   '$jam.AB'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.T
(   '$jam.AC'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.T
(   '$jam.AD'
,   new function(){
var fromCharCode= $jam.S().String.fromCharCode
var parseInt= $jam.S().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.AC[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.T
(   '$jam.AE'
,   function( html ){
return $jam.AD
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.T
(   '$jam.AF'
,   new function( ){
var toString = {}.toString
return function( val ){
if( val === void 0 ) return 'Undefined'
if( val === null ) return 'Null'
if( val === $jam.S() ) return 'Global'
return toString.call( val ).replace( /^\[object |\]$/g, '' )
}
}
)
;$jam.T
(   '$jam.AG'
,   $jam.AA( function( klass, proto ){
proto.constructor=
$jam.AB
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
$jam.AB
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.AF( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.AF( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.AB
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.AF( keyList ) === 'String' ){
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
if( $jam.AF( cur[ key ] ) === 'Object' ){
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
if( $jam.AF( json ) === 'String' ){
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
$jam.AB
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
;$jam.T
(   '$jam.AH'
,   $jam.AA( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.AI( node )
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
;$jam.T
(   '$jam.AJ'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.AA ) return obj
return klass.raw( obj )
}
)
;$jam.AK=
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
;$jam.AL=
$jam.AA( function( klass, proto ){
proto.constructor=
$jam.AB
(   function( ){
this.$= $jam.U().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.AB
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.AB
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.AB
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.AB
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.AB
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.AB
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.AB
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.AK( code ) ]= code
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
$jam.AB
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
$jam.AB
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
$jam.AJ( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.T
(   '$jam.AM'
,   $jam.AA( function( klass, proto ){
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
$jam.AB
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
$jam.AB
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.AJ( node )
return this
}
)
proto.handler=
$jam.AB
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.AL( event ) )
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
$jam.AB
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
;$jam.T
(   '$jam.AI'
,   $jam.AA( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.U().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.U().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.U().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.U().createDocumentFragment() )
}
proto.text=
$jam.AB
(   function( ){
return $jam.AE( this.$.innerHTML )
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
$jam.AB
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
$jam.AB
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
$jam.AB
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.AG({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.AG({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.AB
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
return $jam.AH( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.AH( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.AH( filtered )
}
proto.parent= 
$jam.AB
(   function( ){
return $jam.AI( this.$.parentNode )
}
,   function( node ){
node= $jam.AJ( node )
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
var node= $jam.AJ( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.AI.Text( '\r\n' ) )
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
$jam.AB
(   function(){
return $jam.AI( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.AJ( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.AB
(   function(){
return $jam.AI( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.AJ( node ) )
return this
}
)
proto.next=
$jam.AB
(   function(){
return $jam.AI( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.AJ( node ), next ) 
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
$jam.AB
(   function(){
return $jam.AI( this.$.previousSibling )
}
,   function( node ){
node= $jam.AJ( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.AB
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
var fragment= $jam.AI.Fragment()
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
return $jam.AI( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.AI( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.AM()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.T
(   '$jam.AN'
,   function( gen ){
var proc= function(){
proc= gen.call( this )
return proc.apply( this, arguments )
}
var lazy= function(){
return proc.apply( this, arguments )
}
lazy.gen= $jam.R( gen )
return lazy
}
)
;$jam.T
(   '$jam.AO'
,   $jam.AN( function(){
var poolNode= $jam.AN( function(){
var body= $jam.U().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.U().createElement( 'wc:M:pool' )
pool.style.display= 'none'
body.insertBefore( pool, body.firstChild )
return $jam.R( pool )
})
var free= []
return function( proc ){
return function( ){
var res
var self= this
var args= arguments
var starter= free.pop()
if( !starter ){
var starter= $jam.U().createElement( 'button' )
poolNode().appendChild( starter )
}
starter.onclick= function( ev ){
( ev || $jam.S().event ).cancelBubble= true
res= proc.apply( self, args )
}
starter.click()
free.push( starter )
return res
}
}
})
)
;$jam.T
(   '$jam.AP'
,   $jam.AA( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.AJ( data ) || '' )
return this
}
proto.incIndent=
$jam.AB
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.AB
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.AB
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
$jam.AB
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.AB
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
$jam.AB
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.AB
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
$jam.AB
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.AB
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.AB
(   function( ){
return this.$
}
)
})
)
;$jam.T
(   '$jam.AQ'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.AL().type( '$jam.AQ' ).scream( event.target() )
}
$jam.AI( $jam.U().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.T
(   '$jam.AR'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.AL().type( '$jam.AR' ).scream( event.target() )
}
$jam.AI( $jam.U().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.T
(   '$jam.AS'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.S().confirm( 'Are you sure to delee this?' ) ) return
$jam.AL().type( '$jam.AS' ).scream( event.target() )
}
$jam.AI( $jam.U().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.T
(   '$jam.AT'
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
$lang.text= $jam.AT
;$lang.Wrapper=
function( name ){
var prefix= '<' + name + '>'
var postfix= '</' + name + '>'
return function( content ){
return prefix + content + postfix
}
}
;$jam.T
(   '$jam.AU'
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
;$jam.T
(   '$jam.AV'
,   $jam.AA( function( klass, proto ){
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
if( i % 2 ) chunk= $jam.AV.escape( chunk )
str+= chunk
}
return $jam.AV( str )
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
;$jam.T
(   '$jam.AW'
,   function( lexems ){
if( !lexems ) throw new Error( 'lexems is required' )
var nameList= []
var regexpList= []
var sizeList= []
for( var name in lexems ){
var regexp= $jam.AV( lexems[ name ] )
nameList.push( name )
regexpList.push( regexp.source() )
sizeList.push( regexp.count() )
}
var regexp= RegExp( '([\\s\\S]*?)(?:((' + regexpList.join( ')|(' ) + '))|($\n?))', 'gm' )
var count= $jam.AV(regexp).count()
return $jam.AA( function( klass, proto ){
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
;$jam.T
(    '$jam.AX'
,    function( syntaxes ){
var lexems= []
var handlers= []
handlers[ '' ]= syntaxes[ '' ] || $jam.AU()
for( var regexp in syntaxes ){
if( !syntaxes.hasOwnProperty( regexp ) ) continue
if( !regexp ) continue
lexems.push( RegExp( regexp ) )
handlers.push( syntaxes[ regexp ] )
}
var lexer= $jam.AW( lexems )
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
;$jam.T
(   '$jam.AY'
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
return $jam.AU
(   $jam.AX( map )
,   $jam.AY()
)
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
$jam.AU( $lang.text, pcre.control )
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
$jam.AU( $lang.text, js.remark )
this[ /(\/\/[^\n]*)/.source ]=
$jam.AU( $lang.text, js.remark )
this[ /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/.source ]=
$jam.AU( $lang.text, js.string )
this[ /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/.source ]=
$jam.AU( $lang.text, js.string )
this[ /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/[mig]*)/.source ]=
$jam.AU( $lang.pcre, js.regexp )
this[ /\b(_[\w$]*)\b/.source ]=
$jam.AU( $lang.text, js.internal )
this[ /(\$[\w$]*)(?![\w$])/.source ]=
$jam.AU( $lang.text, js.external )
this[ /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|void|try|catch|null|typeof|instanceof|return|delete|window|document|let|each|yield)\b/.source ]=
$jam.AU( $lang.text, js.keyword )
this[ /((?:\d*\.)?\d(?:[eE])?)/.source ]=
$jam.AU( $lang.text, js.number )
this[ /([(){}\[\]])/.source ]=
$jam.AU( $lang.text, js.bracket )
this[ /(\+{1,2}|-{1,2}|\*|\/|&{1,2}|\|{1,2}|={1,2}|%|\^|!)/.source ]=
$jam.AU( $lang.text, js.operator )
})
return js
}
;$jam.Z
(   'wc:A'
,   function( nodeRoot ){
return new function( ){
nodeRoot= $jam.AI( nodeRoot )
var exec= $jam.AO( function( ){
var source= nodeSource.text()
var proc= new Function( '_test', source )
proc( _test )
return true
})
var source= $jam.AP( nodeRoot.text() ).minimizeIndent().trim( /[\n\r]/ ).$
nodeRoot.clear()
var nodeSource0= $jam.AI.Element( 'wc:C' ).parent( nodeRoot )
var nodeSource= $jam.AI.parse( '<wc:N wc:O="js" />' ).text( source ).parent( nodeSource0 )
var nodeControls= $jam.AI.Element( 'wc:E' ).parent( nodeRoot )
var nodeClone= $jam.AI.parse( '<wc:P title="ctrl+shift+enter">clone' ).parent( nodeControls )
var nodeDelete= $jam.AI.parse( '<wc:Q>delete' ).parent( nodeControls )
var _test= {}
var checkDone= function( ){
if( passed() !== 'wait' ) throw new Error( 'Test already done' )
}
_test.ok=
$jam.AB
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
$jam.AB
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
$jam.AB
(   null
,   function( ms ){
if( stop ) throw new Error( 'Deadline redeclaration' )
stop= $jam.V( ms, noMoreWait )
}
)
var passed=
$jam.AB
(   function( ){
return nodeRoot.state( 'passed' )
}
,   function( val ){
nodeRoot.state( 'passed', val )
}
)
var print=
function( val ){
var node= $jam.AI.Element( 'wc:D' )
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
print( $jam.AF( val ) + ': ' + val )
}
var run=
function( ){
var results= nodeRoot.childList( 'wc:D' )
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
$jam.AI.Element( 'wc:A' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var del=
function( ){
nodeRoot.parent( null )
}
run()
var onCommit=
nodeRoot.listen( '$jam.AQ', run )
var onClone=
nodeRoot.listen( '$jam.AR', clone )
var onClone=
nodeRoot.listen( '$jam.AS', del )
var onCloneClick=
nodeClone.listen( 'click', function( event ){
$jam.AL().type( '$jam.AR' ).scream( event.target() )
})
var onDeleteClick=
nodeDelete.listen( 'click', function( event ){
$jam.AL().type( '$jam.AS' ).scream( event.target() )
})
this.destroy=
function( ){
onCommit.sleep()
onClone.sleep()
onCloneClick.sleep()
onDeleteClick.sleep()
if( stop ) stop()
_test.ok= _test.not= $jam.R()
}
}
}
)
;$jam.AZ=
$jam.AA( function( klass, proto ){
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
;$jam.T
(   '$jam.BA'
,   $jam.AA( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.AB
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
$jam.AB
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
$jam.AB
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
$jam.V
(   this.latency()
,   $jam.AZ( this )
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
;$jam.T
(   '$jam.BB'
,   $jam.AA( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.BA()
.handler( $jam.AZ( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.AB
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.AB
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
;$jam.Z
(   'wc:F'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.AI( nodeRoot )
var nodeHeader=
$jam.AI.parse( '<wc:G title="ctrl + enter" />' )
.tail( $jam.AI.parse( '<wc:J>Run ►' ) )
.tail( $jam.AI.parse( '<wc:I>inner (µs)' ) )
.tail( $jam.AI.parse( '<wc:I>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.AI.Element( 'wc:E' ).parent( nodeRoot )
//var nodeClone= $jam.AI.parse( '<wc:P title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.AI.parse( '<wc:Q>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:H' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.AL()
.type( '$jam.AQ' )
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
$jam.Z
(   'wc:H'
,   new function( ){
var queue=
$jam.BB()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.AI( nodeRoot )
var source= $jam.AP( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.AI.parse( '<wc:K><wc:N wc:O="js">' + $jam.AT( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.AI.parse( '<wc:L class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.AI.parse( '<wc:L class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.AI.Fragment() ) // for chrome 12
var calc= $jam.AO( function( source ){
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
$jam.AI.Element( 'wc:H' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.AQ', schedule )
var onClone=
nodeRoot.listen( '$jam.AR', clone )
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
