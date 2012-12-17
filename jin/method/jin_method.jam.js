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
