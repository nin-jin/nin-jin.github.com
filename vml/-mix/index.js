;// jam/jam/jam.jam
if( this.$jam$ ) throw new Error( 'Redeclaration of [$jam$]' )
var $jam$= {}
$jam$.$jam$= $jam$

;// jam/define/jam+define.jam
with( $jam$ )
$jam$.$define=
function( key, value ){
    if( this[ key ] && ( this[ key ] !== value ) ){
        throw new Error( 'Redeclaration of [' + key + ']' )
    }
    this[ key ]= value
    return this
}

;// jam/Value/jam+Value.jam
with( $jam$ )
$jam$.$Value= function( val ){
    var value= function(){
        return val
    }
    value.toString= function(){
        return '$jam$.$Value: ' + String( val )
    }
    return value
}

;// jam/switch/jam+switch.jam
with( $jam$ )
$define
(   '$switch'
,   function( key, map ){
        if( !map.hasOwnProperty( key ) ) {
            throw new Error( 'Key [' + key + '] not found in map' )
        }
        return map[ key ]
    }
)

;// jam/glob/jam+glob.jam
with( $jam$ )
$jam$.$glob= $Value( this )

;// jam/doc/jam+doc.jam
with( $jam$ )
$define( '$doc', $Value( $glob().document ) )

;// jam/support/jam+support.jam
with( $jam$ )
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
        
        this.msie= Support( /*@cc_on!@*/ false )
        this.xmlModel= Support( ( $glob().DOMParser && $glob().XSLTProcessor ) ? 'w3c' : 'ms' )
        this.htmlModel= Support( node.namespaceURI !== void 0 ? 'w3c' : 'ms' )
        this.eventModel= Support( 'addEventListener' in node ? 'w3c' : 'ms' )
        this.selectionModel= Support( 'createRange' in $doc() ? 'w3c' : 'ms' )
        this.vml= this.msie
    }
)

;// jam/schedule/jam+schedule.js
with( $jam$ )
$define( '$schedule', function( timeout, proc ){
    var timerID= $glob().setTimeout( proc, timeout )
    return function( ){
        $glob().clearTimeout( timerID )
    }
})

;// jam/domReady/jam+domReady.jam
with( $jam$ )
$define
(   '$domReady'
,   function( ){
        var state= $doc().readyState
        if( state === 'loaded' ) return true
        if( state === 'complete' ) return true
        return false
    }
)

with( $jam$ )
$domReady.then=
function( proc ){
    var checker= function( ){
        if( $domReady() ) proc()
        else $schedule( 10, checker )
    }
    checker()
}

;// jam/Component/jam+Component.jam
with( $jam$ )
$define( '$Component', function( tagName, factory ){
    if(!( this instanceof $Component )) return new $Component( tagName, factory )
    var fieldName= 'componnet|' + tagName + '|' + (new Date).getTime()

    var isBroken= ( $support.htmlModel() === 'ms' )
    var chunks= /(?:(\w+):)?([-\w]+)/.exec( tagName )
    var scopeName= isBroken && chunks && chunks[1] || ''
    var localName= isBroken && chunks && chunks[2] || tagName
    var nodes= $doc().getElementsByTagName( localName )

    var elements= []
    var rootNS=$doc().documentElement.namespaceURI

    var checkName=
    ( tagName === '*' )
    ?    $Value( true )
    :    new function(){
            var nameChecker= RegExp( '^' + localName + '$', 'i' )
            if( isBroken ){
                var scopeChecker= RegExp( '^' + scopeName + '$', 'i' )
                return function checkName_broken( el ){
                    return scopeChecker.test( el.scopeName ) && nameChecker.test( el.nodeName )
                }
            }
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
    $glob().setInterval( tracking, 200 )

    $domReady.then(function whenReady(){
        if( $support.eventModel() === 'w3c' ){
            $glob().clearInterval( interval )
        }
        attachIfLoaded= attach
        tracking()
    })

    if( $support.eventModel() === 'w3c' ){
        var docEl= $doc().documentElement
        docEl.addEventListener( 'DOMNodeInserted', function whenNodeInserted( ev ){
            var node= ev.target
            //$schedule( 0, function( ){
                check4attach([ node ])
                if( !$support.msie() && node.getElementsByTagName ) check4attach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
        docEl.addEventListener( 'DOMNodeRemoved', function whenNodeRemoved( ev ){
            var node= ev.target
            //$schedule( 0, function( ){
                check4detach([ node ])
                if( !$support.msie() && node.getElementsByTagName ) check4detach( node.getElementsByTagName( tagName ) )
            //})
        }, false )
    }
    
    this.tagName= $Value( tagName )
    this.factory= $Value( factory )
    this.elements=
    function elements( ){
        return elements.slice( 0 )
    }
})

;// vml/shape/vml_shape.jam
$jam$.$Component( 'vml:shape', function( node ){
    node.style.height= '100%'
    node.style.height= ''
    node.style.width= '100%'
    node.style.width= ''

    return null
} )

;// jam/htmlize/jam+htmlize.jam
with( $jam$ )
$define
(   '$htmlize'
,   function( ns ){
        if( !$doc().getElementsByTagNameNS ) return
        var nodeList= $doc().getElementsByTagNameNS( ns, '*' )
        var docEl= $doc().documentElement
        
        var tracking= function( ){
            sleep()
            var node
            while( node= nodeList[0] ){
                var parent= node.parentNode
                var newNode= $doc().createElement( node.nodeName )
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
        
        $domReady.then( tracking )
        rise()
        
        function rise( ){
            docEl.addEventListener( 'DOMNodeInserted', tracking, false )
        }
        function sleep( ){
            docEl.removeEventListener( 'DOMNodeInserted', tracking, false )
        }
    }
)

;// vml/vml/vml.jam
if( !$jam$.$support.vml() ) $jam$.$htmlize( 'urn:schemas-microsoft-com:vml' )

