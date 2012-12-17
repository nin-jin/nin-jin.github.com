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
