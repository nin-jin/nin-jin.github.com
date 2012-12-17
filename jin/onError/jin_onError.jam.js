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

//window.onerror= new function( onerror ){
//    return function( message, file, line ){
//        var event= $jin_onError()
//        event.message( message ).file( file ).line( line )
//        event.scream( window )
//        
//        if( onerror ) return onerror.apply( this, arguments )
//    }
//}( window.onerror )