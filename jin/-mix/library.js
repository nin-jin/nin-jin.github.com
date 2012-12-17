new function( window, document ){
    with ( this ){
// ../jin/method/jin_method.jam.js
this.$jin_method= function( func ){
    if( typeof func !== 'function' )
        return func
    
    var method= function( ){
        var args= [].slice.call( arguments )
        args.unshift( this )
        return func.apply( null, args )
    }
    
    method.call= func
    
    return method
}
;
// ../jin/class/jin_class.jam.js
this.$jin_class= function( scheme ){
    
    var factory= function( ){
        if( this instanceof factory ) return
        return factory.make.apply( factory, arguments )
    }
    var proto= factory.prototype
    
    factory.scheme= scheme
    
    factory.make= function( ){
        var obj= new this
        obj.init.apply( obj, arguments )
        return obj
    }
    
    proto.init= function( obj ){ }
    proto.destroy= function( obj ){
        for( var key in obj ){
            if( !obj.hasOwnProperty( key ) )
                continue
            delete obj[ key ]
        }
    }
    
    scheme( factory, proto )
    
    for( var key in proto ){
        if( !proto.hasOwnProperty( key ) )
            continue
        
        proto[ key ]= $jin_method( proto[ key ] )
    }
    
    return factory
}
;
// ../jin/mixin/jin_mixin.jam.js
this.$jin_mixin=
function( schemeMixin ){
    
    var mixin= $jin_class( schemeMixin )
    
    mixin.make=
    function( scheme ){
        return $jin_class( function( Class, proto ){
            schemeMixin( Class, proto )
            scheme( Class, proto )
        })
    }
    
    return mixin
}


;
// ../jin/wrapper/jin_wrapper.jam.js
this.$jin_wrapper=
$jin_mixin( function( $jin_wrapper, wrapper ){
    
    var make= $jin_wrapper.make
    $jin_wrapper.make=
    function( obj ){
        if( obj instanceof $jin_wrapper ) return obj
        
        return make.apply( this, arguments )
    }
    
    wrapper.$= null
    
    var init= wrapper.init
    wrapper.init= function( wrapper, value ){
        init.apply( this, arguments )
        wrapper.$= value
    }
    
})
;
// ../jin/nodeListener/jin_nodeListener.jam.js
this.$jin_nodeListener=
$jin_class( function( $jin_nodeListener, listener ){
    
    listener.node= null
    listener.event= null
    listener.handler= null
    
    listener.init=
    function( listener, node, event, handler ){
        listener.node= node
        listener.event= event
        listener.handler= handler
        
        listener.on()
        
        return listener
    }
    
    var destroy= listener.destroy
    listener.destroy=
    function( listener ){
        listener.off()
        
        destroy.apply( this, arguments )
    }
    
    listener.on=
    function( listener ){
        listener.node.addEventListener
        (   listener.event
        ,   listener.handler
        ,   false
        )
        
        return listener
    }
    
    listener.off=
    function( listener ){
        listener.node.removeEventListener
        (   listener.event
        ,   listener.handler
        ,   false
        )
        
        return listener
    }
    
});
// ../jin/unwrap/jin_unwrap.jam.js
this.$jin_unwrap= function( obj ){
    return obj.$ || obj
}
;
// ../jin/event/jin_event.jam.js
this.$jin_event= $jin_mixin( function( $jin_event, event ){
    $jin_wrapper.scheme.apply( this, arguments )
    
    $jin_event.type= null
    $jin_event.bubbles= false
    $jin_event.cancelable= false
    
    $jin_event.listen= function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   $jin_event.type
        ,   $jin_event.wrapHandler( handler )
        )
    }
    
    $jin_event.wrapHandler= function( handler ){
        return function( event ){
            return handler( $jin_event( event ) )
        }
    }
    
    $jin_event.toString=
    function( ){
        return $jin_event.type
    }
    
    var init= event.init
    event.init= function( event, raw ){
        if( arguments.length === 1 ){
            raw= document.createEvent( 'Event' )
            raw.initEvent( $jin_event.type, $jin_event.bubbles, $jin_event.cancelable )
        } else {
            raw= $jin_unwrap( raw )
        }
        init( event, raw )
    }
    
    event.scream=
    function( event, node ){
        node.dispatchEvent( event.$ )
        return event
    }
    
    event.target=
    function( event, target ){
        return event.$.target
    }
    
    event.type=
    function( event, type ){
        if( arguments.length === 1 )
            return event.$.type
        
        event.$.initEvent( type, event.bubbles(), event.cancelable() )
        return event
    }
    
    event.bubbles=
    function( event, bubbles ){
        if( arguments.length === 1 )
            return event.$.bubbles
        
        event.$.initEvent( event.type(), bubbles, event.cancelable() )
        return event
    }
    
    event.cancelable=
    function( event, cancelable ){
        if( arguments.length === 1 )
            return event.$.cancelable
        
        event.$.initEvent( event.type(), event.bubbles(), cancelable )
        return event
    }
    
    event.catched=
    function( event, catched ){
        if( arguments.length === 1 )
            return event.$.defaultPrevented || event.$.$jin_event_catched
        
        if( catched ) event.$.preventDefault()
        event.$.$jin_event_catched= event.$.defaultPrevented= catched
        
        return event
    }
    
    event.toString=
    function( event ){
        return $jin_event + '()'
    }
    
})
;
// ../jin/eventProof/jin_eventProof.jam.js
this.$jin_eventProof= $jin_mixin( function( $jin_eventProof, event ){
    $jin_event.scheme.apply( this, arguments )
    
    var scream= event.scream
    event.scream=
    function( event, node ){
        scream( event, node )
        
        if( !event.catched() )
            throw new Error( '[' + event + '] is not catched' )
        
        return event
    }
    
})
;
// ../jin/makeId/jin_makeId.jam.js
this.$jin_makeId= function( prefix ){
    prefix= prefix || ''
    return prefix + Math.random().toString( 32 ).substring( 2 )
};
// ../jin/onChange/jin_onChange.jam.js
this.$jin_onChange= $jin_event( function( $jin_onChange, event ){
    
    $jin_onChange.type= '$jin_onChange'
    
    $jin_onChange.listen= function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'DOMSubtreeModified'
        ,   $jin_onChange.wrapHandler( handler )
        )
    }
    
} )
;
// ../jin/onClick/jin_onClick.jam.js
this.$jin_onClick= $jin_event( function( $jin_onClick, event ){
    
    $jin_onClick.type= 'keypress'
    $jin_onClick.bubbles= true
    
} )
;
// ../jin/onElemAdd/jin_onElemAdd.jam.js
this.$jin_onElemAdd= $jin_event( function( $jin_onElemAdd, event ){
    
    $jin_onElemAdd.type= '$jin_onElemAdd'
    
    $jin_onElemAdd.listen=
    function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'DOMNodeInserted'
        ,   $jin_onElemAdd.wrapHandler( handler )
        )
    }
    
    var wrapHandler= $jin_onElemAdd.wrapHandler
    $jin_onElemAdd.wrapHandler= function( handler ){
        handler= wrapHandler( handler )
        
        return function( event ){
            event= $jin_onElemAdd( event )
            
            var target= event.target()
            if( target.nodeType !== 1 ) return
            
            if( /*@cc_on!@*/ false ) // TODO: implement feature detection
                return
            
            var elems= [].slice.call( target.getElementsByTagName( '*' ) )
            elems.unshift( event.target() )
            
            for( var i= 0; i < elems.length; ++i ){
                var lister= $jin_nodeListener
                (   elems[ i ]
                ,   $jin_onElemAdd.type
                ,   handler
                )
                
                $jin_onElemAdd().scream( elems[ i ] )
                lister.destroy()
            }
        }
    }
    
} )
;
// ../jin/onElemDrop/jin_onElemDrop.jam.js
this.$jin_onElemDrop= $jin_event( function( $jin_onElemDrop, event ){
    
    $jin_onElemDrop.type= '$jin_onElemDrop'
    
    $jin_onElemDrop.listen=
    function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'DOMNodeInserted'
        ,   $jin_onElemDrop.wrapHandler( handler )
        )
    }
    
    var wrapHandler= $jin_onElemDrop.wrapHandler
    $jin_onElemDrop.wrapHandler= function( handler ){
        handler= wrapHandler( handler )
        
        return function( event ){
            event= $jin_onElemDrop( event )
            
            var target= event.target()
            if( target.nodeType !== 1 ) return
            
            if( /*@cc_on!@*/ false ) // TODO: implement feature detection
                return
            
            var elems= [].slice.call( target.getElementsByTagName( '*' ) )
            elems.unshift( event.target() )
            
            for( var i= 0; i < elems.length; ++i ){
                var lister= $jin_nodeListener
                (   elems[ i ]
                ,   $jin_onElemDrop.type
                ,   handler
                )
                
                $jin_onElemDrop().scream( elems[ i ] )
                lister.destroy()
            }
        }
    }
    
} )
;
// ../jin/onError/jin_onError.jam.js
this.$jin_onError= $jin_event( function( $jin_onError, event ){
    
    $jin_onError.type= 'error'
    
    event.message= function( event, message ){
        if( arguments.length === 1 )
            return event.$.message
        
        event.$.message= message
        
        return event
    }
    
    event.file= function( event, file ){
        if( arguments.length === 1 )
            return event.$.filename
        
        event.$.filename= file
        
        return event
    }
    
    event.line= function( event, line ){
        if( arguments.length === 1 )
            return event.$.lineno
        
        event.$.lineno= line
        
        return event
    }
    
    event.toString= function( event ){
        return '$jin_onError( ' + event.message() + ' @ ' + event.file() + ':' + event.line() + ')'
    }
    
} )
//}( window.onerror );
// ../jin/onInput/jin_onInput.jam.js
this.$jin_onInput= $jin_event( function( $jin_onInput, event ){
    
    $jin_onInput.type= '$jin_onInput'
    
    $jin_onInput.listen= function( node, handler ){
        return $jin_nodeListener
        (   node
        ,   'DOMSubtreeModified'
        ,   $jin_onInput.wrapHandler( handler )
        )
    }
    
} )
;
// ../jin/onPress/jin_onPress.jam.js
this.$jin_onPress= $jin_event( function( $jin_onPress, event ){
    
    $jin_onPress.type= 'keypress'
    $jin_onPress.bubbles= true
    
} )
;
// ../jin/registry/jin_registry.jam.js
this.$jin_registry=
$jin_mixin( function( $jin_registry, registry ){
    var storage= {}
    
    var make= $jin_registry.make
    $jin_registry.make=
    function( name ){
        var key= '_' + name
        var obj= storage[ key ]
        if( obj ) return obj
        
        return storage[ key ]= make.apply( this, arguments )
    }
    
})
;
// ../jin/thread/jin_thread.jam.js
this.$jin_thread= function( proc ){
    return function( ){
        var self= this
        var args= arguments
        var res
        
        var id= $jin_makeId( '$jin_thread' )
        var launcher= function( event ){
            res= proc.apply( self, args )
        }
        
        window.addEventListener( id, launcher, false )
            var event= document.createEvent( 'Event' )
            event.initEvent( id, false, false )
            window.dispatchEvent( event )
        window.removeEventListener( id, launcher, false )
        
        return res
    }
}
;
// ../jin/test/jin_test.jam.js
this.$jin_test= $jin_class( function( $jin_test, test ){
    
    test.passed= null
    test.timeout= null
    test.onDone= null
    test.timer= null
    
    test.asserts= null
    test.results= null
    test.errors= null
    
    test.init= function( test, code, onDone ){
        test.asserts= []
        test.results= []
        test.errors= []
        test.onDone= onDone || function(){}
        
        var complete= false
        
        test.callback( function( ){
            if( typeof code === 'string' )
                code= new Function( 'test', code )
            
            if( !code ) return
            
            code( test )
            complete= true
        } ).call( )
        
        if( !complete ) test.passed= false
        
        if(( test.passed == null )&&( test.timeout != null )){
            test.timer= setTimeout( function( ){
                test.asserts.push( false )
                test.errors.push( new Error( 'timeout(' + test.timeout + ')' ) )
                test.done()
            }, test.timeout )
        } else {
            test.done()
        }
    }
    
    var AND= function( a, b ){ return a && b }
    
    test.done= function( test ){
        test.timer= clearTimeout( test.timer )
        
        if( test.passed != null )
            return
        
        test.passed= test.asserts.reduce( AND, true )
        test.onDone.call( null, test )
    }
    
    var compare= function( a, b ){
        return Number.isNaN( a )
        ? Number.isNaN( b )
        : ( a === b )
    }
    
    test.ok= function( test, value ){
        switch( arguments.length ){
            case 1:
                var passed= true
                break
            
            case 2:
                var passed= !!value
                break
            
            default:
                for( var i= 2; i < arguments.length; ++i ){
                    var passed= compare( arguments[ i ], arguments[ i - 1 ] )
                    if( !passed ) break;
                }
        }
        
        test.asserts.push( passed )
        test.results.push( [].slice.call( arguments, 1 ) )
        
        return test
    }
    
    test.not= function( test, value ){
        switch( arguments.length ){
            case 1:
                var passed= false
                break
            
            case 2:
                var passed= !value
                break
            
            default:
                for( var i= 2; i < arguments.length; ++i ){
                    var passed= !compare( arguments[ i ], arguments[ i - 1 ] )
                    if( !passed ) break;
                }
        }
        
        test.asserts.push( passed )
        test.results.push( [].slice.call( arguments, 1 ) )
        
        return test
    }
    
    test.callback= function( test, func ){
        return $jin_thread( function( ){
            try {
                return func.apply( this, arguments )
            } catch( error ){
                test.errors.push( error )
                throw error
            }
        } )
    }
    
    var destroy= test.destroy
    test.destroy= function( test ){
        test.timer= clearTimeout( test.timer )
        destroy( test )
    }
    
} )
        var scripts= document.getElementsByTagName( 'script' )
        var currentScript= document.currentScript || scripts[ scripts.length - 1 ]
        if( currentScript.src ) eval( currentScript.innerHTML )
    }
}( this.window, this.document )