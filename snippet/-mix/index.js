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
;$jam.U=
function( init ){
var klass=
function( ){
if( this instanceof klass ) return this
return klass.create.apply( klass, arguments )
}
klass.constructor= $jam.U
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
;$jam.T( '$jam.V', $jam.R( $jam.S().document ) )
;$jam.T
(   '$jam.W'
,   function(){
var map= arguments
return function(){
return map[ arguments.length ].apply( this, arguments )
}
}
)
;$jam.T
(   '$jam.X'
,   {    'nbsp': ' '
,    'amp':  '&'
,    'lt':   '<'
,    'gt':   '>'
,    'quot': '"'
,    'apos': "'"
}
)
;$jam.T
(   '$jam.Y'
,   new function(){
var fromCharCode= $jam.S().String.fromCharCode
var parseInt= $jam.S().parseInt
var replacer= function( str, isHex, numb, name ){
if( name ) return $jam.X[ name ] || str
if( isHex ) numb= parseInt( numb, 16 )
return fromCharCode( numb )
}
return function( str ){
return String( str ).replace( /&(?:#(x)?(\d+)|(\w+));/g, replacer )
}
}
)
;$jam.T
(   '$jam.Z'
,   function( html ){
return $jam.Y
(   String( html )
.replace( /<div><br[^>]*>/gi, '\n' )
.replace( /<br[^>]*>/gi, '\n' )
.replace( /<div>/gi, '\n' )
.replace( /<[^<>]+>/g, '' )
)
}
)
;$jam.T
(   '$jam.AA'
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
(   '$jam.AB'
,   $jam.U( function( klass, proto ){
proto.constructor=
$jam.W
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
$jam.W
(   function( ){
return this.get( [] )
}
,   function( keyList ){
if( $jam.AA( keyList ) === 'String' ){
keyList= keyList.split( this.splitterKeys )
}
var cur= this.$.data
for( var i= 0; i < keyList.length; ++i ){
var key= keyList[ i ]
cur= cur[ key ]
if( $jam.AA( cur ) !== 'Object' ) break
}
return cur
}
)
proto.put=
$jam.W
(   null
,   function( keyList ){
return this.put( keyList, true )
}
,   function( keyList, value ){
if( $jam.AA( keyList ) === 'String' ){
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
if( $jam.AA( cur[ key ] ) === 'Object' ){
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
if( $jam.AA( json ) === 'String' ){
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
$jam.W
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
(   '$jam.AC'
,   $jam.U( function( klass, proto ){
proto.get=
function( index ){
var node= this.$[ index ]
return $jam.AD( node )
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
(   '$jam.AE'
,   function( obj ){
if( !obj ) return obj
var klass= obj.constructor
if( !klass ) return obj
var superClass= klass.constructor
if( superClass !== $jam.U ) return obj
return klass.raw( obj )
}
)
;$jam.AF=
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
;$jam.AG=
$jam.U( function( klass, proto ){
proto.constructor=
$jam.W
(   function( ){
this.$= $jam.V().createEvent( 'Event' )
this.$.initEvent( '', true, true )
return this
}
,   function( event ){
this.$= event
return this
}
)
proto.type=
$jam.W
(   function( ){
return this.$.type
}
,   function( type ){
this.$.initEvent( type, this.$.bubbles, this.$.cancelable )
return this
}
)
proto.data=
$jam.W
(   function( ){
return this.$.extendedData
}
,   function( data ){
this.$.extendedData= data
return this
}
)
proto.keyMeta=
$jam.W
(   function( ){
return Boolean( this.$.metaKey || this.$.ctrlKey )
}
)
proto.keyShift=
$jam.W
(   function( ){
return Boolean( this.$.shiftKey )
}
)
proto.keyAlt=
$jam.W
(   function( ){
return Boolean( this.$.altKey )
}
)
proto.keyAccel=
$jam.W
(   function( ){
return this.keyMeta() || this.keyShift() || this.keyAlt()
}
)
proto.keyCode=
$jam.W
(   function( ){
var code= this.$.keyCode
var keyCode= new Number( code )
keyCode[ $jam.AF( code ) ]= code
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
$jam.W
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
$jam.W
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
$jam.AE( node ).dispatchEvent( this.$ )
return this
}
})
;$jam.T
(   '$jam.AH'
,   $jam.U( function( klass, proto ){
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
$jam.W
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
$jam.W
(   function( ){
return this.$.node
}
,   function( node ){
this.sleep()
this.$.node= $jam.AE( node )
return this
}
)
proto.handler=
$jam.W
(   function( ){
return this.$.handler
}
,   function( handler ){
var self= this
this.sleep()
this.$.handler= handler
this.$.internalHandler=
function( event ){
return handler.call( self.node(), $jam.AG( event ) )
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
$jam.W
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
(   '$jam.AD'
,   $jam.U( function( klass, proto ){
klass.Element=
function( name ){
return klass.create( $jam.V().createElement( name ) )
}
klass.Text=
function( str ){
return klass.create( $jam.V().createTextNode( str ) )
}
klass.Comment=
function( str ){
return klass.create( $jam.V().createComment( str ) )
}
klass.Fragment=
function( ){
return klass.create( $jam.V().createDocumentFragment() )
}
proto.text=
$jam.W
(   function( ){
return $jam.Z( this.$.innerHTML )
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
$jam.W
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
$jam.W
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
$jam.W
(   function( ){
return this.param( [] )
}
,   function( key ){
return $jam.AB({ splitterChunks: ' ' }).merge( this.$.className || '' ).get( key )
}
,   function( key, value ){
this.$.className= $jam.AB({ splitterChunks: ' ' }).merge( this.$.className ).put( key, value )
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
$jam.W
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
return $jam.AC( filtered )
}
proto.childList=
function( name ){
var list= this.$.childNodes
var filtered= []
for( var i= this.head(); i; i= i.next() ){
if( name && i.name().replace( name, '' ) ) continue
filtered.push( i )
}
return $jam.AC( filtered )
}
proto.descList=
function( name ){
var list= this.$.getElementsByTagName( name )
var filtered= []
for( var i= 0; i < list.length; ++i ){
filtered.push( list[ i ] )
}
return $jam.AC( filtered )
}
proto.parent= 
$jam.W
(   function( ){
return $jam.AD( this.$.parentNode )
}
,   function( node ){
node= $jam.AE( node )
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
var node= $jam.AE( node )
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
//if( this.name() === 'br' ) return this;//this.prev( $jam.AD.Text( '\r\n' ) )
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
$jam.W
(   function(){
return $jam.AD( this.$.firstChild )
}
,   function( node ){
this.$.insertBefore( $jam.AE( node ), this.$.firstChild )
return this
}
)
proto.tail=
$jam.W
(   function(){
return $jam.AD( this.$.lastChild )
}
,   function( node ){
this.$.appendChild( $jam.AE( node ) )
return this
}
)
proto.next=
$jam.W
(   function(){
return $jam.AD( this.$.nextSibling )
}
,   function( node ){
var parent= this.$.parentNode
var next= this.$.nextSibling
parent.insertBefore( $jam.AE( node ), next ) 
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
$jam.W
(   function(){
return $jam.AD( this.$.previousSibling )
}
,   function( node ){
node= $jam.AE( node )
var parent= this.$.parentNode
parent.insertBefore( node, this.$ ) 
return this
}   
)
proto.inDom=
$jam.W
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
var fragment= $jam.AD.Fragment()
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
return $jam.AD( this.$.cloneNode( false ) )
}
proto.cloneTree=
function( ){
return $jam.AD( this.$.cloneNode( true ) )
}
proto.listen=
function( eventName, handler ){
return $jam.AH()
.eventName( eventName )
.node( this )
.handler( handler )
.listen()
}
})
)
;$jam.T
(   '$jam.AI'
,   new function(){
var lastURI= $jam.V().location.href
var refresh=
function( ){
var newURI= $jam.V().location.href
if( lastURI === newURI ) return
lastURI= newURI
$jam.AG().type( '$jam.AI' ).scream( $jam.V() )
}
$jam.S().setInterval( refresh, 20)
}
)
;$jam.T
(   '$jam.AJ'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 && event.keyCode() != 'S'.charCodeAt( 0 ) ) return
event.defaultBehavior( false )
$jam.AG().type( '$jam.AJ' ).scream( event.target() )
}
$jam.AD( $jam.V().documentElement )
.listen( 'keydown', handler )
}
)
;$jam.T
(   '$jam.AK'
,   new function( ){
var handler=
function( event ){
if( !event.keyShift() ) return
if( event.keyMeta() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 46 ) return
if( !$jam.S().confirm( 'Are you sure to delee this?' ) ) return
$jam.AG().type( '$jam.AK' ).scream( event.target() )
}
$jam.AD( $jam.V().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.T
(   '$jam.AL'
,   function( timeout, proc ){
var timerID= $jam.S().setTimeout( proc, timeout )
return function( ){
$jam.S().clearTimeout( timerID )
}
}
)
;$jam.T
(    '$jam.AM'
,    function( latency, func ){
var self
var arg
var stop
return function(){
self= this
arg= arguments
if( stop ) return
stop= $jam.AL( latency, function(){
stop= null
func.apply( self, arg )
})
}
}
)
;$jam.T
(   '$jam.AN'
,   new function(){
var scream=
$jam.AM
(   50
,   function( target ){
$jam.AG().type( '$jam.AN' ).scream( target )
}
)
var handler=
function( event ){
if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
scream( event.target() )
}
var node=
$jam.AD( $jam.V().documentElement )
node.listen( 'keyup', handler )
node.listen( 'cut', handler )
node.listen( 'paste', handler )
}
)
;$jam.T
(   '$jam.AO.then'
,   function( proc ){
var checker= function( ){
if( $jam.AO() ) proc()
else $jam.AL( 10, checker )
}
checker()
}
)
;$jam.T
(   '$jam.AO'
,   function( ){
var state= $jam.V().readyState
if( state === 'loaded' ) return true
if( state === 'complete' ) return true
return false
}
)
;$jam.T
(   '$jam.AP'
,   function( key, map ){
if( !map.hasOwnProperty( key ) ) {
throw new Error( 'Key [' + key + '] not found in map' )
}
return map[ key ]
}
)
;$jam.T
(   '$jam.AQ'
,   new function(){
var Support= function( state ){
var sup= $jam.R( state )
sup.select= function( map ){
return $jam.AP( this(), map )
}
return sup
}
var node= $jam.V().createElement( 'html:div' )
this.msie= Support(  false )
this.xmlModel= Support( ( $jam.S().DOMParser && $jam.S().XSLTProcessor ) ? 'w3c' : 'ms' )
}
)
;$jam.T
(   '$jam.AR'
,   function( tagName, factory ){
if(!( this instanceof $jam.AR )) return new $jam.AR( tagName, factory )
var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
var nodes= $jam.V().getElementsByTagName( tagName )
var elements= []
var rootNS=$jam.V().documentElement.namespaceURI
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
$jam.AO.then(function whenReady(){
$jam.S().clearInterval( interval )
attachIfLoaded= attach
tracking()
})
var docEl= $jam.V().documentElement
docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
var node= ev.target
check4attach([ node ])
if( !$jam.AQ.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
}, false )
docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
var node= ev.target
check4detach([ node ])
if( !$jam.AQ.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
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
;$jam.AR
(   'a'
,   function( el ){
var isTarget= ( el.href == $jam.V().location.href )
$jam.AD( el ).state( 'target', isTarget )
}
)
;$jam.AS=
$jam.U( function( klass, proto ){
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
(   '$jam.AT'
,   $jam.U( function( klass, proto ){
proto.constructor=
function( ){
this.$= { latency: 0, stopper: null, active: false }
return this
}
proto.latency=
$jam.W
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
$jam.W
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
$jam.W
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
$jam.AL
(   this.latency()
,   $jam.AS( this )
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
(   '$jam.AU'
,   $jam.U( function( klass, proto ){
proto.constructor=
function( ){
this.$= {}
this.$.queue= []
this.$.clock=
$jam.AT()
.handler( $jam.AS( this ).method( 'run' ) )
return this
}
proto.latency=
$jam.W
(   function( ){
return this.$.clock.latency()
}
,   function( val ){
this.$.clock.latency( val )
return this
}
)
proto.active=
$jam.W
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
;$jam.T
(   '$jam.AV'
,   $jam.U( function( klass, proto ){
proto.constructor=
function( data ){
this.$= String( $jam.AE( data ) || '' )
return this
}
proto.incIndent=
$jam.W
(   function( ){
this.$= this.$.replace( /^/mg, '    ' )
return this
}
)
proto.decIndent=
$jam.W
(   function( ){
this.$= this.$.replace( /^    |^\t/mg, '' )
return this
}
)
proto.minimizeIndent=
$jam.W
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
$jam.W
(   function( ){
this.$= this.$.replace( /\t/g, '    ' ).replace( /\u00A0/, ' ' )
return this
}
)
proto.trim=
$jam.W
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
$jam.W
(   null
,   function( proc ){
this.$= proc( this.$ )
return this
}
)
proto.replace=
$jam.W
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
$jam.W
(   null
,   function( count ){
this.$= Array( count + 1 ).join( this.$ )
return this
}
)
proto.length=
$jam.W
(   function( ){
return this.$.length
}
)
proto.toString=
$jam.W
(   function( ){
return this.$
}
)
})
)
;$jam.T
(   '$jam.AW'
,   function( str ){
return String( str )
.replace( /&/g, '&amp;' )
.replace( /</g, '&lt;' )
.replace( />/g, '&gt;' )
.replace( /"/g, '&quot;' )
.replace( /'/g, '&apos;' )
}
)
;$jam.T
(   '$jam.AX'
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
(   '$jam.AY'
,   $jam.AX( function(){
var poolNode= $jam.AX( function(){
var body= $jam.V().getElementsByTagName( 'body' )[ 0 ]
var pool= $jam.V().createElement( 'wc:H:pool' )
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
var starter= $jam.V().createElement( 'button' )
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
(   '$jam.AZ'
,   new function(){
var handler=
function( event ){
if( !event.keyMeta() ) return
if( !event.keyShift() ) return
if( event.keyAlt() ) return
if( event.keyCode() != 13 ) return
$jam.AG().type( '$jam.AZ' ).scream( event.target() )
}
$jam.AD( $jam.V().documentElement )
.listen( 'keyup', handler )
}
)
;$jam.AR
(   'wc:A'
,   new function( ){
return function( nodeRoot ){
nodeRoot= $jam.AD( nodeRoot )
var nodeHeader=
$jam.AD.parse( '<wc:B title="ctrl + enter" />' )
.tail( $jam.AD.parse( '<wc:E>Run ►' ) )
.tail( $jam.AD.parse( '<wc:D>inner (µs)' ) )
.tail( $jam.AD.parse( '<wc:D>outer (µs)' ) )
nodeRoot.head( nodeHeader )
//var nodeControls= $jam.AD.Element( 'wc:I' ).parent( nodeRoot )
//var nodeClone= $jam.AD.parse( '<wc:J title="ctrl+shift+enter">clone' ).parent( nodeControls )
//var nodeDelete= $jam.AD.parse( '<wc:K>delete' ).parent( nodeControls )
var refresh=
function( ){
var benchList= nodeRoot.childList( 'wc:C' )
for( var i= 0; i < benchList.length(); ++i ){
$jam.AG()
.type( '$jam.AJ' )
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
$jam.AR
(   'wc:C'
,   new function( ){
var queue=
$jam.AU()
.latency( 100 )
var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
return function( nodeRoot ){
nodeRoot= $jam.AD( nodeRoot )
var source= $jam.AV( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$
nodeRoot
.clear()
var nodeSource=
$jam.AD.parse( '<wc:F><wc:L wc:M="js">' + $jam.AW( source ) )
.parent( nodeRoot )
var nodeInner=
$jam.AD.parse( '<wc:G class=" source=inner " />' )
.parent( nodeRoot )
var nodeOuter=
$jam.AD.parse( '<wc:G class=" source=outer " />' )
.parent( nodeRoot )
nodeRoot.surround( $jam.AD.Fragment() ) // for chrome 12
var calc= $jam.AY( function( source ){
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
$jam.AD.Element( 'wc:C' )
.text( nodeSource.text() )
nodeRoot.prev( node )
}
var onCommit=
nodeRoot.listen( '$jam.AJ', schedule )
var onClone=
nodeRoot.listen( '$jam.AZ', clone )
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
;with( $jam )
$Component
(   'snippet:root'
,   function( nodeRoot ){
nodeRoot= $jam.AD( nodeRoot )
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
var content= $jam.AD.parse( '<wc:O class=" editable=true " />' ).text( source )
$jam.AD.Element( pair[0] ).tail( content ).parent( nodeContent )
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
$jam.AD.Element( 'a' )
.text( href )
.attr( 'href', href )
.parent( nodeLink )
} else {
var form= $jam.AD.parse( '<form method="post" target="_blank" action="http://goo.gl/action/shorten">' ).parent( nodeLink )
var url= $jam.AD.parse( '<input type="hidden" name="url" />' ).attr( 'value', $doc().location.href ).parent( form )
var submit= $jam.AD.parse( '<wc:Q><button type="submit">get short link' ).parent( form ) 
}
})
}
)
load()
var onURIChanged=
$jam.AD( $doc() ).listen( '$jam.AI', load )
var onCommit=
nodeRoot.listen( '$jam.AJ', save )
var onDelete=
nodeRoot.listen( '$jam.AK', save )
var onEdit=
nodeRoot.listen( '$jam.AN', function( ){
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
