this.$jin_wrapper=
$jin_mixin( function( $jin_wrapper, wrapper ){
    
    var make= $jin_wrapper.make
    $jin_wrapper.make=
    function( obj ){
        if( obj instanceof $jin_wrapper ) return obj
        
        return make.apply( this, arguments )
    }
    
    wrapper.$= null
    
    var init= wrapper.init
    wrapper.init= function( wrapper, value ){
        init.apply( this, arguments )
        wrapper.$= value
    }
    
})
