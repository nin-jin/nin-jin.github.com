$jin.klass({ '$jin.task': [ '$jin.model.klass' ] })

$jin.model.prop({ name: '$jin.task..title' })

$jin.model.prop({ name: '$jin.task..description' })

$jin.method({ '$jin.task..viewDetails': function( ){
    return $jin.task.view.details
}})

$jin.method({ '$jin.task..viewRow': function( id ){
    return $jin.task.view.item( id ).task( this )
}})

$jin.method({ '$jin.task..number': function( ){
    return Number( this.id() )
}})

$jin.method({ '$jin.task..clear': function( ){
	this.title( null )
	this.description( null )
}})
