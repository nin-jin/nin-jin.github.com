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

;// jam/jam/jam.jam.js
if( this.$jam ) throw new Error( 'Redeclaration of [$jam]' )
var $jam= {}

;// jam/Value/jam+Value.jam.js
$jam.Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam.Value: ' + String( val )
    }
    return value
}

;// jam/glob/jam+glob.jam.js
$jam.glob= $jam.Value( this )

;// jam/define/jam+define.jam.js
$jam.define=
new function( ){

    var Ghost= function(){}
    
    return function( key, value ){
        var keyList= key.split( '.' )
        
        var obj= $jam.glob()
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

;// jam/Class/jam+Class.jam.js
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

;// jam/doc/jam+doc.jam.js
$jam.define( '$jam.doc', $jam.Value( $jam.glob().document ) )

;// jam/Poly/jam+Poly.jam.js
$jam.define
(   '$jam.Poly'
,   function(){
        var map= arguments
        return function(){
            return map[ arguments.length ].apply( this, arguments )
        }
    }
)

;// jam/htmlEntities/jam+htmlEntities.jam.js
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

;// jam/htmlDecode/jam+htmlDecode.jam.js
$jam.define
(   '$jam.htmlDecode'
,   new function(){
        var fromCharCode= $jam.glob().String.fromCharCode
        var parseInt= $jam.glob().parseInt
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

;// jam/html2text/jam+html2text.jam.js
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

;// jam/classOf/jam+classOf.jam.js
$jam.define
(   '$jam.classOf'
,   new function( ){
        var toString = {}.toString
        return function( val ){
            if( val === void 0 ) return 'Undefined'
            if( val === null ) return 'Null'
            if( val === $jam.glob() ) return 'Global'
            return toString.call( val ).replace( /^\[object |\]$/g, '' )
        }
    }
)

;// jam/Hiqus/jam+Hiqus.jam.js
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

;// jam/NodeList/jam+NodeList.jam.js
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

;// jam/raw/jam+raw.jam.js
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

;// jam/keyCode/jam+keyCode.jam.js
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
    
}
;// jam/Event/jam+Event.jam.js
$jam.Event=
$jam.Class( function( klass, proto ){

    proto.constructor=
    $jam.Poly
    (   function( ){
            this.$= $jam.doc().createEvent( 'Event' )
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

;// jam/Observer/jam+Observer.jam.js
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

;// jam/Node/jam+Node.jam.js
$jam.define
(   '$jam.Node'
,   $jam.Class( function( klass, proto ){
        
        klass.Element=
        function( name ){
            return klass.create( $jam.doc().createElement( name ) )
        }
        
        klass.Text=
        function( str ){
            return klass.create( $jam.doc().createTextNode( str ) )
        }
        
        klass.Comment=
        function( str ){
            return klass.create( $jam.doc().createComment( str ) )
        }
        
        klass.Fragment=
        function( ){
            return klass.create( $jam.doc().createDocumentFragment() )
        }
        
        proto.text=
        $jam.Poly
        (   function( ){
                return $jam.html2text( this.$.innerHTML )
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
        $jam.Poly
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
            //if( this.name() === 'br' ) return this;//this.prev( $jam.Node.Text( '\r\n' ) )
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

;// jam/eventURIChanged/jam+eventURIChanged.jam.js
$jam.define
(   '$jam.eventURIChanged'
,   new function(){
        
        var lastURI= $jam.doc().location.href
        
        var refresh=
        function( ){
            var newURI= $jam.doc().location.href
            if( lastURI === newURI ) return
            lastURI= newURI
            $jam.Event().type( '$jam.eventURIChanged' ).scream( $jam.doc() )
        }
        
        $jam.glob().setInterval( refresh, 20)
    }
)

;// jam/eventCommit/jam+eventCommit.jam.js
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
        
        $jam.Node( $jam.doc().documentElement )
        .listen( 'keydown', handler )
    }
)

;// jam/eventDelete/jam+eventDelete.jam.js
$jam.define
(   '$jam.eventDelete'
,   new function( ){
        var handler=
        function( event ){
            if( !event.keyShift() ) return
            if( event.keyMeta() ) return
            if( event.keyAlt() ) return
            if( event.keyCode() != 46 ) return
            if( !$jam.glob().confirm( 'Are you sure to delee this?' ) ) return
            $jam.Event().type( '$jam.eventDelete' ).scream( event.target() )
        }
        
        $jam.Node( $jam.doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// jam/schedule/jam+schedule.jam.js
$jam.define
(   '$jam.schedule'
,   function( timeout, proc ){
        var timerID= $jam.glob().setTimeout( proc, timeout )
        return function( ){
            $jam.glob().clearTimeout( timerID )
        }
    }
)

;// jam/Throttler/jam+Throttler.jam.js
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

;// jam/eventEdit/jam+eventEdit.jam.js
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

        var handler=
        function( event ){
            if( event.keyCode() >= 16 && event.keyCode() <= 18 ) return
            if( event.keyCode() >= 33 && event.keyCode() <= 40 ) return
            scream( event.target() )
        }

        var node=
        $jam.Node( $jam.doc().documentElement )
        
        node.listen( 'keyup', handler )
        node.listen( 'cut', handler )
        node.listen( 'paste', handler )

    }
)

;// jam/domReady/jam+domReady+then.jam.js
$jam.define
(   '$jam.domReady.then'
,   function( proc ){
        var checker= function( ){
            if( $jam.domReady() ) proc()
            else $jam.schedule( 10, checker )
        }
        checker()
    }
)
;// jam/domReady/jam+domReady.jam.js
$jam.define
(   '$jam.domReady'
,   function( ){
        var state= $jam.doc().readyState
        if( state === 'loaded' ) return true
        if( state === 'complete' ) return true
        return false
    }
)

;// jam/switch/jam+switch.jam.js
$jam.define
(   '$jam.switch'
,   function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
)

;// jam/support/jam+support.jam.js
$jam.define
(   '$jam.support'
,   new function(){
        var Support= function( state ){
            var sup= $jam.Value( state )
            sup.select= function( map ){
                return $jam.switch( this(), map )
            }
            return sup
        }
    
        var node= $jam.doc().createElement( 'html:div' )
        
        this.msie= Support( /*@cc_on!@*/ false )
        this.xmlModel= Support( ( $jam.glob().DOMParser && $jam.glob().XSLTProcessor ) ? 'w3c' : 'ms' )
    }
)

;// jam/Component/jam+Component.jam.js
$jam.define
(   '$jam.Component'
,   function( tagName, factory ){
        if(!( this instanceof $jam.Component )) return new $jam.Component( tagName, factory )
        var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()
    
        var nodes= $jam.doc().getElementsByTagName( tagName )
    
        var elements= []
        var rootNS=$jam.doc().documentElement.namespaceURI
    
        var checkName=
        ( tagName === '*' )
        ?    $jam.Value( true )
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
        $jam.glob().setInterval( tracking, 200 )
    
        $jam.domReady.then(function whenReady(){
            $jam.glob().clearInterval( interval )
            attachIfLoaded= attach
            tracking()
        })
    
        var docEl= $jam.doc().documentElement
        docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
            var node= ev.target
            //$jam.schedule( 0, function( ){
                check4attach([ node ])
                if( !$jam.support.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
        docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
            var node= ev.target
            //$jam.schedule( 0, function( ){
                check4detach([ node ])
                if( !$jam.support.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
            //})
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

;// html/a/html-a.jam.js
$jam.Component
(   'a'
,   function( el ){
        var isTarget= ( el.href == $jam.doc().location.href )
        $jam.Node( el ).state( 'target', isTarget )
    }
)

;// jam/Obj/jam+Obj.jam.js
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

;// jam/Clock/jam+Clock.jam.js
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

;// jam/TaskQueue/jam+TaskQueue.jam.js
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

;// jam/String/jam+String.jam.js
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

;// jam/htmlEscape/jam+htmlEscape.jam.js
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

;// jam/Lazy/jam+Lazy.jam.js
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

;// jam/Thread/jam+Thread.jam.js
$jam.define
(   '$jam.Thread'
,   $jam.Lazy( function(){
    
        var poolNode= $jam.Lazy( function(){
            var body= $jam.doc().getElementsByTagName( 'body' )[ 0 ]
            var pool= $jam.doc().createElement( 'wc:Thread:pool' )
            pool.style.display= 'none'
            body.insertBefore( pool, body.firstChild )
            return $jam.Value( pool )
        })
            
        var free= []
    
        return function( proc ){
            return function( ){
                var res
                var self= this
                var args= arguments
    
                var starter= free.pop()
                if( !starter ){
                    var starter= $jam.doc().createElement( 'button' )
                    poolNode().appendChild( starter )
                }
                
                starter.onclick= function( ev ){
                    ( ev || $jam.glob().event ).cancelBubble= true
                    res= proc.apply( self, args )
                }
                starter.click()
    
                free.push( starter )
                return res
            }
        }
    
    })
)

;// jam/eventClone/jam+eventClone.jam.js
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
        
        $jam.Node( $jam.doc().documentElement )
        .listen( 'keyup', handler )
    }
)

;// wc/js-bench/wc_js-bench.jam.js
$jam.Component
(   'wc:js-bench_list'
,   new function( ){
        return function( nodeRoot ){
            nodeRoot= $jam.Node( nodeRoot )
            
            var nodeHeader=
            $jam.Node.parse( '<wc:js-bench_header title="ctrl + enter" />' )
            .tail( $jam.Node.parse( '<wc:js-bench_runner>Run ►' ) )
            .tail( $jam.Node.parse( '<wc:js-bench_column>inner (µs)' ) )
            .tail( $jam.Node.parse( '<wc:js-bench_column>outer (µs)' ) )
            
            nodeRoot.head( nodeHeader )

            //var nodeControls= $jam.Node.Element( 'wc:hontrol' ).parent( nodeRoot )
            //var nodeClone= $jam.Node.parse( '<wc:hontrol_clone title="ctrl+shift+enter">clone' ).parent( nodeControls )
            //var nodeDelete= $jam.Node.parse( '<wc:hontrol_delete>delete' ).parent( nodeControls )

            var refresh=
            function( ){
                var benchList= nodeRoot.childList( 'wc:js-bench' )
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
(   'wc:js-bench'
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
            $jam.Node.parse( '<wc:js-bench_source><wc:editor wc:editor_hlight="js">' + $jam.htmlEscape( source ) )
            .parent( nodeRoot )
            
            var nodeInner=
            $jam.Node.parse( '<wc:js-bench_result class=" source=inner " />' )
            .parent( nodeRoot )

            var nodeOuter=
            $jam.Node.parse( '<wc:js-bench_result class=" source=outer " />' )
            .parent( nodeRoot )
            
            nodeRoot.surround( $jam.Node.Fragment() ) // for chrome 12
            
            var calc= $jam.Thread( function( source ){
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
                $jam.Node.Element( 'wc:js-bench' )
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

;// snippet/snippet/snippet.jam.js
with( $jam )
$Component
(   'snippet:root'
,   function( nodeRoot ){
        nodeRoot= $jam.Node( nodeRoot )
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
                var content= $jam.Node.parse( '<wc:hlight class=" editable=true " />' ).text( source )
                $jam.Node.Element( pair[0] ).tail( content ).parent( nodeContent )
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
                        $jam.Node.Element( 'a' )
                        .text( href )
                        .attr( 'href', href )
                        .parent( nodeLink )
                    } else {
                        var form= $jam.Node.parse( '<form method="post" target="_blank" action="http://goo.gl/action/shorten">' ).parent( nodeLink )
                        var url= $jam.Node.parse( '<input type="hidden" name="url" />' ).attr( 'value', $doc().location.href ).parent( form )
                        var submit= $jam.Node.parse( '<wc:button><button type="submit">get short link' ).parent( form ) 
                    }
                })
            }
        )
        
        load()
        
        var onURIChanged=
        $jam.Node( $doc() ).listen( '$jam.eventURIChanged', load )
        
        var onCommit=
        nodeRoot.listen( '$jam.eventCommit', save )
        
        var onDelete=
        nodeRoot.listen( '$jam.eventDelete', save )
        
        var onEdit=
        nodeRoot.listen( '$jam.eventEdit', function( ){
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

