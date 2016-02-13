// Task model
class $mol_app_todo_task extends $jin2_atom<any> {

	get() : this {
		return super.get()
	}
	
	_ = this
	error = null

	id() {
		return new $jin2_prop( () => this.objectId )
	}
	
    @ $jin2_grab
    data() {
		return new $jin2_atom(
            () => $jin2_state_local.item( this.objectPath ).get() || { title : '' , completed : false } ,
            ( next ) => {
                var prev = this.data().get()
                if( next && prev ) for( var key in prev ) if(!( key in next )) next[ key ] = prev[ key ]
                $jin2_state_local.item( this.objectPath ).set( next )
                return next 
            }
        ) 
    }

    @ $jin2_grab
	title() {
		return new $jin2_atom<string>(
            () => this.data().get().title ,
            next => {
				this.data().set({ title : next })
				return next
			}
        )
	}

    @ $jin2_grab
	completed() {
		return new $jin2_atom(
            () => this.data().get().completed ,
            next => {
                this.data().set({ completed : next })
                return next
            }
        )
	}
	
}