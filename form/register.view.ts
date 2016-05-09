@ $mol_replace
class $my_register extends $mol.$my_register {

	@ $jin2_grab
	name( ) { return this.atom( '' ) }

	@ $jin2_grab
	zip( ) { return this.atom( '' ) }

	@ $jin2_grab
	zipInfo( ) { return this.atom<{ region : string , city : string }>( prev => {
		if( this.zip().get() ) {
			setTimeout( () => {
				this.zipInfo()['push']({ region : 'Russia' , city : 'Moscow' })
			}, 5000 )
		} else {
			return { region : '' , city : '' }
		}
	} ) }

	@ $jin2_grab
	region() { return this.atom<string>( prev => this.zipInfo().get().region ) }

	@ $jin2_grab
	city() { return this.atom<string>( prev => this.zipInfo().get().city ) }

	@ $jin2_grab
	carNumb( ) { return this.atom( '' ) }

	@ $jin2_grab
	carInfo( ) { return this.atom<{ model : string , age : string }>( prev => {
		if( this.carNumb().get() ) {
			setTimeout( () => {
				this.carInfo().set({ model : 'Tesla S' , age : '1' })
			}, 5000 )
		} else {
			return { model : '' , age : '' }
		}
	} ) }

	@ $jin2_grab
	carModel() { return this.atom<string>( prev => this.carInfo().get().model ) }

	@ $jin2_grab
	carAge() { return this.atom<string>( prev => this.carInfo().get().age ) }

	@ $jin2_grab
	social( ) { return this.atom( '' ) }

	@ $jin2_grab
	socialInfo( ) { return this.atom<{ sex : string , age : string , sexOrient : string }>( prev => {
		if( this.social().get() ) {
			setTimeout( () => {
				this.socialInfo().set({ sex : 'male' , age : '30' , sexOrient : '' })
			}, 5000 )
		} else {
			return { sex : '' , age : '' , sexOrient : '' }
		}
	} ) }

	@ $jin2_grab
	sex() { return this.atom<string>( prev => this.socialInfo().get().sex ) }

	@ $jin2_grab
	age() { return this.atom<string>( prev => this.socialInfo().get().age ) }

	@ $jin2_grab
	sexOrient() { return this.atom<string>( prev => this.socialInfo().get().sexOrient ) }

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

	submits() { return this.prop<Event>( null , next => {
		this.submit().get()
	} ) }
}
