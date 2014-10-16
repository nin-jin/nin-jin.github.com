$jin.klass({ '$jin.todo.view': [ '$jin.view' ] })

$jin.property({ '$jin.todo.view..todo': $jin.todo })

$jin.atom.prop({ '$jin.todo.view..details':
{   pull: function( oldView ){
        var task = this.todo().task()
		if( !task ) return $jin.todo.intro( this.id() + ';' + 'intro' )
		
        var view = task.viewDetails()( this.id() + ';' + 'details' )
		view.task( task )
        return view
    }
}})

$jin.atom.prop({ '$jin.todo.view..items':
{   pull: function( oldItems ){
        
		var todo = this.todo()
        var models = todo.list().slice()
		
		if( !models.length ){
			return $jin.todo.noitems( this.id() + ';' + 'noitems' )
		}
		
		models.sort( function( a, b ){
			if( a.number() > b.number() ) return -1
			else return 1
		})
		
        var newItems = models.map( function( item, index ){
			return item.viewRow( this.id() + ';' + 'item=' + index ).list( todo )
        }.bind( this ) )
		
        return newItems
    }
}})

$jin.atom.prop({ '$jin.todo.view..ballance':
{   pull: function( oldView ){
        return 0.3
    }
,	put: Number
}})

$jin.model.prop(
{   name: '$jin.todo.view..shrinkDetails'
,   parse: Number
,	def: 0.5
} )

$jin.atom.prop({ '$jin.todo.view..shrinkList':
{   pull: function( oldView ){
        return 1
    }
,	put: Number
}})

$jin.method({ '$jin.todo.view..onResizeStart': function( event ){
	event.view( null )
	event.data({ view: this.id(), action: 'resize' })
}})

$jin.method({ '$jin.todo.view..onResizeMove': function( event ){
	//var data = event.data()
	//if( data.view !== this.id() ) return
	//if( data.action !== 'resize' ) return
	
	var k = event.raw().x / this.element().nativeNode().offsetWidth
	k = Math.min( 0.9, Math.max( 0.1, k ) )
	this.shrinkDetails( ( 1 - k ) / k )
	
	event.catched( true )
}})

$jin.method({ '$jin.todo.view..onAddTask': function( event ){
	var list = this.todo().list()
	var last
	list.forEach( function( task ){
		if( !last ) last = task
		if( task.number() > last.number() ) last = task
	} )
	
	var id = last ? 1 + last.number() : 1
	
	var task = $jin.task( id )
	this.todo().listAdd([ task ]).task( task )
}})

$jin.method({ '$jin.todo.view..onClear': function( event ){
	this.todo().clear()
}})
