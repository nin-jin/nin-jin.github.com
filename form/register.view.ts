@ $mol_replace
class $my_register extends $mol.$my_register {

	@ $jin2_grab
	name( ) { return new $jin2_atom( '' ) }

	@ $jin2_grab
	zip( ) { return new $jin2_atom( '' ) }

	@ $jin2_grab
	zipInfo( ) { return new $jin2_atom<{ region : string , city : string }>( prev => {
		if( this.zip().get() ) {
			setTimeout( () => {
				this.zipInfo().push({ region : 'Russia' , city : 'Moscow' })
			}, 5000 )
		} else {
			return { region : '' , city : '' }
		}
	} ) }

	@ $jin2_grab
	region() { return new $jin2_atom<string>( prev => this.zipInfo().get().region ) }

	@ $jin2_grab
	city() { return new $jin2_atom<string>( prev => this.zipInfo().get().city ) }

	@ $jin2_grab
	carNumb( ) { return new $jin2_atom( '' ) }

	@ $jin2_grab
	carInfo( ) { return new $jin2_atom<{ model : string , age : string }>( prev => {
		if( this.carNumb().get() ) {
			setTimeout( () => {
				this.carInfo().push({ model : 'Tesla S' , age : '1' })
			}, 5000 )
		} else {
			return { model : '' , age : '' }
		}
	} ) }

	@ $jin2_grab
	carModel() { return new $jin2_atom<string>( prev => this.carInfo().get().model ) }

	@ $jin2_grab
	carAge() { return new $jin2_atom<string>( prev => this.carInfo().get().age ) }

	@ $jin2_grab
	social( ) { return new $jin2_atom( '' ) }

	@ $jin2_grab
	socialInfo( ) { return new $jin2_atom<{ sex : string , age : string , sexOrient : string }>( prev => {
		if( this.social().get() ) {
			setTimeout( () => {
				this.socialInfo().push({ sex : 'male' , age : '30' , sexOrient : '' })
			}, 5000 )
		} else {
			return { sex : '' , age : '' , sexOrient : '' }
		}
	} ) }

	@ $jin2_grab
	sex() { return new $jin2_atom<string>( prev => this.socialInfo().get().sex ) }

	@ $jin2_grab
	age() { return new $jin2_atom<string>( prev => this.socialInfo().get().age ) }

	@ $jin2_grab
	sexOrient() { return new $jin2_atom<string>( prev => this.socialInfo().get().sexOrient ) }

	@ $jin2_grab
	submit() { return new $jin2_atom( prev => {
		
		var data = {
			name: this.name().get(),
			zip: this.zip().get(),
			region: this.region().get(),
			city: this.city().get(),
			carNumb: this.carNumb().get(),
			carModel: this.carModel().get(),
			carAge: this.carAge().get(),
			social: this.social().get(),
			sex: this.sex().get(),
			age: this.age().get(),
			sexOrient: this.sexOrient().get(),
		}
		
		if( !data.name ) alert( 'You must enter your name!' )
		else if( !data.region ) alert( 'You must enter your region!' )
		else if( !data.city ) alert( 'You must enter your city!' )
		else if( !data.social ) alert( 'You must enter social id!' )
		else if( !data.sex ) alert( 'You must enter your sex!' )
		else if( !data.age ) alert( 'You must enter your age!' )
		else if( !data.sexOrient ) alert( 'You must enter your sexual orientation!' )
		else alert( 'sended ' + JSON.stringify( data ) )
		
		this.submit().destroy()
	} ) }

	submits() { return new $jin2_prop<Event>( null , next => {
		this.submit().get()
	} ) }
}
