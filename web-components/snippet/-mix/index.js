;// snippet/googl/googl.js
function googl(url, cb) {
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

;// snippet/jsonlib/jsonlib.js
// jsonlib.js
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

;// jam/jam/jam.jam
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}
$jam.$jam= $jam

;// jam/define/jam+define.jam
with( $jam )
$jam.$define=
function( key, value ){
    if( this[ key ] && ( this[ key ] !== value ) ){
        throw new Error( 'Redeclaration of [' + key + ']' )
    }
    this[ key ]= value
    return this
}

;// jam/Value/jam+Value.jam
with( $jam )
$jam.$Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam.$Value: ' + String( val )
    }
    return value
}

;// jam/glob/jam+glob.jam
with( $jam )
$jam.$glob= $Value( this )

;// jam/createNameSpace/wc+createNameSpace.jam
with( $jam )
$define( '$createNameSpace', function( name ){
    var proxy= function(){}
    proxy.prototype= this
    var ns= new proxy
    $define.call( $glob(), name, ns )
    ns.$define( name, ns )
    return ns
})

;// jam/switch/jam+switch.jam
with( $jam )
$define
(   '$switch'
,   function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
)

;// jam/doc/jam+doc.jam
with( $jam )
$define( '$doc', $Value( $glob().document ) )

;// jam/support/jam+support.jam
with( $jam )
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
        
        this.htmlModel= Support( node.namespaceURI !== void 0 ? 'w3c' : 'ms' )
        this.eventModel= Support( 'addEventListener' in node ? 'w3c' : 'ms' )
        this.selectionModel= Support( 'createRange' in $doc() ? 'w3c' : 'ms' )
        this.vml= Support( /*@cc_on!@*/ false )
    }
)

;// jam/schedule/jam+schedule.js
with( $jam )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().setTimeout( proc, timeout )
    return function( ){
        $glob().clearTimeout( timerID )
    }
})

;// jam/domReady/jam+domReady.jam
with( $jam )
$define
(   '$domReady'
,   function( ){
        var state= $doc().readyState
        if( state === 'loaded' ) return true
        if( state === 'complete' ) return true
        return false
    }
)

with( $jam )
$domReady.then=
function( proc ){
    var checker= function( ){
        if( $domReady() ) proc()
        else $schedule( 10, checker )
    }
    checker()
}

;// jam/Component/jam+Component.jam
with( $jam )
$define( '$Component', function( tagName, factory ){
    if(!( this instanceof $Component )) return new $Component( tagName, factory )
    var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()

    var isBroken= ( $support.htmlModel() === 'ms' )
    var chunks= /(?:(\w+):)?([-\w]+)/.exec( tagName )
    var scopeName= isBroken && chunks && chunks[1] || ''
    var localName= isBroken && chunks && chunks[2] || tagName
    var nodes= $doc().getElementsByTagName( localName )

    var elements= []

    var checkName=
    ( tagName === '*' )
    ?    $Value( true )
    :    new function(){
            var nameChecker= RegExp( '^' + localName + '$', 'i' )
            if( isBroken ){
                var scopeChecker= RegExp( '^' + scopeName + '$', 'i' )
                return function( el ){
                    return scopeChecker.test( el.scopeName ) && nameChecker.test( el.nodeName )
                }
            }
            return function( el ){
                if( el.namespaceURI && el.namespaceURI !== 'http://www.w3.org/1999/xhtml' ) return false
                return nameChecker.test( el.nodeName )
            }
        }
    
    var isAttached=
    function( el ){
        return typeof el[ fieldName ] === 'object'
    }
    
    var attach=
    function( el ){

        el[ fieldName ]= null
        var widget= factory( el )
        el[ fieldName ]= widget || null
        if( widget ) elements.push( el )
    }
    
    var attachIfLoaded=
    function( el ){
        var cur= el
        do {
            if( !cur.nextSibling ) continue
            attach( el )
            break
        } while( cur= cur.parentNode )
    }
    
    var dropElement=
    function( el ){
        for( var i= 0; i < elements.length; ++i ){
            if( elements[ i ] !== el ) continue
            elements.splice( i, 1 )
            return
        }
    }
    
    var detach=
    function( nodeList ){
        for( var i= 0, len= nodeList.length; i < len; ++i ){
            var node= nodeList[ i ]
            var widget= node[ fieldName ]
            if( widget.destroy ) widget.destroy()
            node[ fieldName ]= void 0
            dropElement( node )
        }
    }
    
    var check4attach=
    function( nodeList ){
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

    var check4detach=
    function( nodeList ){
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

    var tracking=
    function( ){
        check4attach( nodes )
        check4detach( elements )
    }

    var interval=
    $glob().setInterval( tracking, 200 )

    $domReady.then(function(){
        if( $support.eventModel() === 'w3c' ){
            $glob().clearInterval( interval )
        }
        attachIfLoaded= attach
        tracking()
    })

    if( $support.eventModel() === 'w3c' ){
        var docEl= $doc().documentElement
        docEl.addEventListener( 'DOMNodeInserted', function( ev ){
            var node= ev.target
            $schedule( 0, function( ){
                check4attach([ node ])
                if( node.getElementsByTagName ) check4attach( node.getElementsByTagName( '*' ) )
            })
        }, false )
        docEl.addEventListener( 'DOMNodeRemoved', function( ev ){
            var node= ev.target
            $schedule( 0, function( ){
                check4detach([ node ])
                if( node.getElementsByTagName ) check4detach( node.getElementsByTagName( '*' ) )
            })
        }, false )
    }
    
    this.tagName= $Value( tagName )
    this.factory= $Value( factory )
    this.elements=
    function( ){
        return elements.slice( 0 )
    }
})

;// jam/Class/jam+Class.jam
with( $jam )
$jam.$Class=
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
with( $jam )
$define
(   '$Poly'
,   function(){
        var map= arguments
        return function(){
            return map[ arguments.length ].apply( this, arguments )
        }
    }
)

;// jam/htmlEntities/jam+htmlEntities.jam
with( $jam )
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
with( $jam )
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
with( $jam )
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
with( $jam )
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
with( $jam )
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
with( $jam )
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

;// jam/raw/jam+raw.jam
with( $jam )
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

;// jam/Event/jam+Event.jam
with( $jam )
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
        
        proto.target=
        $support.eventModel.select
        (   {   'w3c': function( ){
                    return this.$.target
                }
            ,   'ms': function( ){
                    return this.$.srcElement
                }
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
with( $jam )
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
                            var event= event.originalEvent || event
                            if( event.type !== self.type() ) return 
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
                    this.$.node.attachEvent( 'on' + this.$.eventName, this.$.internalHandler )
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
with( $jam )
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
        
        proto.childList=
        function( name ){
            var list= this.$.childNodes
            var filtered= []
            
            for( var i= this.head(); i; i= i.next() ){
                if( name && ( i.name() !== name ) ) continue
                filtered.push( i )
            }
            
            return $NodeList( filtered )
        }
        
        proto.descList=
        function( name ){
            var list= this.$.getElementsByTagName( name )
            var filtered= []
            
            for( var i= 0; i < list.length; ++i ){
                filtered.push( list[ i ] )
            }
            
            return $NodeList( filtered )
        }

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

;// jam/Throttler/jam+Throttler.js
with( $jam )
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

;// jam/String/jam+String.jam
with( $jam )
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

;// jam/eventURIChanged/jam+eventURIChanged.jam
with( $jam )
$define
(   '$eventURIChanged'
,   new function(){
        
        var lastURI= $doc().location.href
        
        var refresh=
        function( ){
            var newURI= $doc().location.href
            if( lastURI === newURI ) return
            lastURI= newURI
            $Event().type( '$jam.$eventURIChanged' ).scream( $doc() )
        }
        
        $glob().setInterval( refresh, 20)
    }
)

;// jam/eventCommit/jam+eventCommit.jam
with( $jam )
$define
(   '$eventCommit'
,   new function(){
        var handler=
        function( event ){
            if( !event.keyMeta() ) return
            if( event.keyShift() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 13 ) return
            $Event().type( '$jam.$eventCommit' ).scream( event.target() )
        }
        
        $Node( $doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// jam/eventDelete/jam+eventDelete.jam
with( $jam )
$define
(   '$eventDelete'
,   new function( ){
    }
)

;// jam/eventEdit/jam+eventEdit.jam
with( $jam )
$define
(   '$eventEdit'
,   new function(){
        
        var handler=
        $Throttler
        (   50
        ,   function( event ){
                $Event().type( '$jam.$eventEdit' ).scream( event.target() )
            }
        )

        var node=
        $Node( $doc().documentElement )
        
        node.listen( 'keyup', handler )
        node.listen( 'cut', handler )
        node.listen( 'paste', handler )

    }
)

;// html/html/html.jam
$jam.$createNameSpace( '$html' )

;// html/a/html-a.jam
with( $html )
$Component
(   'a'
,   function( el ){
        var isTarget= ( el.href == $doc().location.href )
        $Node( el ).state( 'target', isTarget )
    }
)

;// wc/wc/wc.jam
$jam.$createNameSpace( '$wc' )

;// jam/Obj/jam+Obj.jam
with( $jam )
$jam.$Obj=
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
with( $jam )
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

;// jam/TaskQueue/jam+TaskQueue.jam
with( $jam )
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

;// jam/htmlEscape/jam+htmlEscape.jam
with( $jam )
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

;// jam/Lazy/jam+Lazy.jam
with( $jam )
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

;// jam/Thread/jam+Thread.jam
with( $jam )
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

;// jam/eventClone/jam+eventClone.jam
with( $jam )
$define
(   '$eventClone'
,   new function(){
        var handler=
        function( event ){
            if( !event.keyMeta() ) return
            if( !event.keyShift() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 13 ) return
            $Event().type( '$jam.$eventClone' ).scream( event.target() )
        }
        
        $Node( $doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// wc/js-bench/wc_js-bench.jam
with( $wc )
$Component
(   'wc:js-bench_list'
,   new function( ){
        return function( nodeRoot ){
            nodeRoot= $Node( nodeRoot )
            
            var nodeHeader=
            $Node.parse( '<wc:js-bench_header title="ctrl + enter" />' )
            .tail( $Node.parse( '<wc:js-bench_runner>Run ►' ) )
            .tail( $Node.parse( '<wc:js-bench_column>inner (µs)' ) )
            .tail( $Node.parse( '<wc:js-bench_column>outer (µs)' ) )
            
            nodeRoot.head( nodeHeader )

            //var nodeControls= $Node.Element( 'wc:hontrol' ).parent( nodeRoot )
            //var nodeClone= $Node.parse( '<wc:hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
            //var nodeDelete= $Node.parse( '<wc:hontrol_delete>delete' ).parent( nodeControls )

            var refresh=
            function( ){
                var benchList= nodeRoot.childList( 'wc:js-bench' )
                for( var i= 0; i < benchList.length(); ++i ){
                    $Event()
                    .type( '$jam.$eventCommit' )
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

with( $wc )
$Component
(   'wc:js-bench'
,   new function( ){
    
        var queue=
        $TaskQueue()
        .latency( 100 )
    
        var parser= /^([\s\S]*?)_bench\.begin\(\)([\s\S]*)_bench\.end\(\)([\s\S]*)$/
    
        return function( nodeRoot ){

            nodeRoot= $Node( nodeRoot )
            var source= $String( nodeRoot.text() ).minimizeIndent().trim( /[\r\n]/ ).$

            nodeRoot
            .clear()
            
            var nodeSource=
            $Node.parse( '<wc:js-bench_source><wc:hlight class=" lang=js editable=true ">' + $htmlEscape( source ) )
            .parent( nodeRoot )
            
            var nodeInner=
            $Node.parse( '<wc:js-bench_result class=" source=inner " />' )
            .parent( nodeRoot )

            var nodeOuter=
            $Node.parse( '<wc:js-bench_result class=" source=outer " />' )
            .parent( nodeRoot )
            
            nodeRoot.surround( $Node.Fragment() ) // for chrome 12
            
            var calc= $Thread( function( source ){
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
                $Node.Element( 'wc:js-bench' )
                .text( nodeSource.text() )
                nodeRoot.prev( node )
            }
            
            var onCommit=
            nodeRoot.listen( '$jam.$eventCommit', schedule )
            
            var onClone=
            nodeRoot.listen( '$jam.$eventClone', clone )
            
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

;// snippet/snippet/snippet.jam
$wc.$createNameSpace( '$snippet' )

with( $snippet )
$Component
(   'snippet:root'
,   function( nodeRoot ){
        nodeRoot= $Node( nodeRoot )
        var nodeContent= nodeRoot.descList( 'snippet:content' ).get( 0 )
        var nodeLink= nodeRoot.descList( 'snippet:link' ).get( 0 )
        
        var load=
        function( ){
            nodeContent.clear()
            var hash= $doc().location.hash
            if( !hash ) hash= '#h1=Snippet!;wc:js-test=_test.ok()'
            var chunks= hash.substring( 1 ).split( ';' )
            for( var i= 0; i < chunks.length; ++i ){
                var pair= chunks[i].split( '=' )
                if( pair.length < 2 ) continue
                var source= decodeURIComponent( pair[1] ).replace( /\t/, '    ' )
                var content= $Node.parse( '<wc:hlight class=" editable=true " />' ).text( source )
                $Node.Element( pair[0] ).tail( content ).parent( nodeContent )
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
                    if( child.name() === 'wc:js-test' ){
                        var source= child.childList( 'wc:js-test_source' ).get(0).text()
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
                        $Node.Element( 'a' )
                        .text( href )
                        .attr( 'href', href )
                        .parent( nodeLink )
                    } else {
                        var form= $Node.parse( '<form method="post" target="_blank" action="http://goo.gl/action/shorten">' ).parent( nodeLink )
                        var url= $Node.parse( '<input type="hidden" name="url" />' ).attr( 'value', $doc().location.href ).parent( form )
                        var submit= $Node.parse( '<wc:button><button type="submit">get short link' ).parent( form ) 
                    }
                })
            }
        )
        
        load()
        
        var onURIChanged=
        $Node( $doc() ).listen( '$jam.$eventURIChanged', load )
        
        var onCommit=
        nodeRoot.listen( '$jam.$eventCommit', save )
        
        var onDelete=
        nodeRoot.listen( '$jam.$eventDelete', save )
        
        var onEdit=
        nodeRoot.listen( '$jam.$eventEdit', function( ){
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

