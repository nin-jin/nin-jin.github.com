$jin.klass({ '$jin.task.view.item': [ '$jin.view' ] })

$jin.property({ '$jin.task.view.item..list': null })

$jin.atom.prop({ '$jin.task.view.item..task':
{   pull: function(){}
,   put: $jin.task
}})

$jin.atom.prop({ '$jin.task.view.item..title':
{   pull: function( ){
		return this.task().title()
	}
}})

$jin.atom.prop({ '$jin.task.view.item..uri':
{   pull: function( ){
		return '#task=' + this.task().id()
	}
}})

$jin.atom.prop({ '$jin.task.view.item..current':
{   pull: function( ){
		return String( this.list().task() === this.task() )
	}
}})

$jin.method({ '$jin.task.view.item..onReActivate': function( event ){
	this.list().focusDetails()
	event.catched( true )
}})

$jin.method({ '$jin.task.view.item..onTaskDrop': function( event ){
	this.list().listDrop([ this.task() ])
	event.catched( true )
}})
