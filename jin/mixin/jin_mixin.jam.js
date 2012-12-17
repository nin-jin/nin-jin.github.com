this.$jin_mixin=
function( schemeMixin ){
    
    var mixin= $jin_class( schemeMixin )
    
    mixin.make=
    function( scheme ){
        return $jin_class( function( Class, proto ){
            schemeMixin( Class, proto )
            scheme( Class, proto )
        })
    }
    
    return mixin
}


