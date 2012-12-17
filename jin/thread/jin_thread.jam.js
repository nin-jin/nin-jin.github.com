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
