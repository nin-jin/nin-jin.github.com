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
