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
