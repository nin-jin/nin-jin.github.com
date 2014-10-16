$jin.klass({ '$jin.task.view.details': [ '$jin.view' ] })

$jin.atom.prop( '$jin.task.view.details..todo',
{   pull: function( ){}
,   put: function( val ){
        return val
    }
} )

$jin.atom.prop( '$jin.task.view.details..task',
{   pull: function( ){}
,   put: function( val ){
        return val
    }
} )

$jin.atom.prop( '$jin.task.view.details..title',
{   pull: function( ){
        return this.task().title()
    }
} )

$jin.atom.prop( '$jin.task.view.details..description',
{   pull: function( ){
        return this.task().description()
    }
} )

$jin.atom.prop( '$jin.task.view.details..editableTitle',
{   pull: function( ){
        return true
    }
} )

$jin.atom.prop( '$jin.task.view.details..editableDescription',
{   pull: function( ){
        return !!this.task().title()
    }
} )

$jin.atom.prop( '$jin.task.view.details..visibleDescription',
{   pull: function( ){
        return !!this.task().title() || !!this.task().description()
    }
} )

$jin.method( '$jin.task.view.details..onChangeTitle', function( event ){
	this.task().title( event.target().text() )
} )

$jin.method( '$jin.task.view.details..onChangeDescription', function( event ){
	this.task().description( event.target().text() )
} )
