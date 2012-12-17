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
