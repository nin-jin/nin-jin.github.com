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
