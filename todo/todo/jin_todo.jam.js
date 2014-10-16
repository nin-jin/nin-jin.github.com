$jin.klass({ '$jin.todo': [ '$jin.model.klass' ] })

$jin.method({ '$jin.todo..view': function( id ){
    return $jin.todo.view( id ).todo( this )
}})

$jin.model.list(
{   name: '$jin.todo..list'
,   parseItem: $jin.task
} )

$jin.atom.prop({ '$jin.todo..task':
{   pull: function( ){
		var id = $jin.state.url.item( 'task' )
		if( id ) return $jin.task( id )
		
		var list = this.list()
		return list[ list.length - 1 ] || null
    }
,   put: function( task ){
        $jin.state.url.item( 'task', task )
    }
}})

$jin.method({ '$jin.todo..clear': function( ){
	this.list().forEach( function( task ){
		task.clear()
	} )
	this.list( [] ).task( null )
}})
