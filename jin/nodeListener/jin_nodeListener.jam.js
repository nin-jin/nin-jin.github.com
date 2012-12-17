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
    
})