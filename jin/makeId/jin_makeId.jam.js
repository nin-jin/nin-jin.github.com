this.$jin_makeId= function( prefix ){
    prefix= prefix || ''
    return prefix + Math.random().toString( 32 ).substring( 2 )
}