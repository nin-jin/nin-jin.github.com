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
