;//../../jin/jin.jam.js?=HNVHU2C8
this.$jin = new function $jin( ){ }

;//../../jin/value/jin-value.jam.js?=HNVHU340
this.$jin.value = function $jin_value( value ){
    
    var func = function $jin_value_instance( ){
        return func.$jin_value
    }
    
    func.$jin_value = value
    
    return func
}

;//../../jin/root/jin_root.jam.js?=HNVHU2C8
this.$jin.root = $jin.value( this )

;//../../jin/glob/jin_glob.jam.js?=HNVHU2C8
this.$jin.glob = function $jin_glob( name, value ){
    var keyList = name.split( '_' )
    var current = $jin.root()
    var currentName = ''
    
    while( keyList.length > 1 ){
        var key = keyList.shift() || 'prototype'
        currentName += ( currentName ? '_' : '' ) + ( key === 'prototype' ? '' : key )
        
        if(!( key in current )){
            current[ key ] = $jin.trait.make( currentName )
        }
        
        current = current[ key ]
    }
    
    var key = keyList.shift() || 'prototype'
    
    if( arguments.length > 1 ){
        current[ key ] = value
    } else {
        value = current[ key ]
    }
    
    return value
}

;//../../jin/func/jin_func.jam.js?=HNVHU2C8
this.$jin.func = {}

this.$jin.func.make = function $jin_func_make( name ){
    eval( 'var func = function ' + name + '( ){\
        return func.execute( this, arguments )\
    }' )
    return func
}

this.$jin.func.name = function $jin_func_name( func, name ){
    if( arguments.length > 1 ) return func.$jin_func_name = name
    return func.name
    || func.$jin_func_name
    || func.toString().match( /^\s*function\s*([$\w]*)\s*\(/ )[ 1 ]
}

;//../../jin/method/jin_method.jam.js?=HOOGSDS0
this.$jin.method = function $jin_method( ){ // arguments: resolveName*, func
    var resolveList = [].slice.call( arguments )
    var func = resolveList.pop()
    
    var name = $jin.func.name( func )
    if( !name ) throw new Error( 'Can not register anonymous function' )
    
    func.$jin_method_name = name
    
    func.$jin_method_resolveList = resolveList
    
    $jin.method.define( name, func )
}

this.$jin.method.define = function $jin_method_define( name, func ){
    var funcName = func.$jin_method_name
    if( !funcName ) funcName = func.$jin_method_name = name
    //throw new Error( '$jin_method_name is not defined in [' + func + ']' )
    
    var nameList = name.split( '_' )
    var methodName = nameList.pop()
    var ownerPath = nameList.join( '_' )
    var owner = $jin.trait( ownerPath )
    var slaveList = owner.$jin_mixin_slaveList
    
    owner[ funcName ]= func
    
    if( slaveList ) slaveList.forEach( function( slavePath ){
        $jin.method.define( slavePath + '_' + methodName, func )
    })
    
    var existFunc = owner[ methodName ]
    checkConflict: {
        
        if( existFunc === void 0 ) break checkConflict
        
        if( typeof existFunc !== 'function' ){
            throw new Error( 'Can not redefine [' + existFunc + '] by [' + funcName + ']' )
        }
        
        if( func === existFunc ) return existFunc
        
        if( !existFunc.$jin_method_name ) break checkConflict
        
        func = $jin.method.merge( existFunc, func, name )
    }
    
    owner[ methodName ]= func
    
    if( slaveList ) slaveList.forEach( function( slavePath ){
        $jin.method.define( slavePath + '_' + methodName, func )
    })
    
    return func
}

this.$jin.method.merge = function $jin_method_merge( left, right, name ){
    var leftConflicts = left.$jin_method_conflictList || [ left ]
    var rightConflicts = right.$jin_method_conflictList || [ right ]
    var conflictList = leftConflicts.concat( rightConflicts )

    var leftResolves = left.$jin_method_resolveList || []
    var rightResolves = right.$jin_method_resolveList || []
    var resolveList = leftResolves.concat( rightResolves )
    
    conflictList = conflictList.filter( function( conflict ){
        return !~resolveList.indexOf( conflict.$jin_method_name )
    })
    
    if( conflictList.length === 0 ){
        throw new Error( 'Can not resolve conflict ' + name + ' because cyrcullar resolving' )
    } else if( conflictList.length === 1 ){
        var func = conflictList[0]
    } else if( conflictList.length > 1 ){
        var func = $jin.func.make( name )
        func.execute = function( ){
            var conflictNames = conflictList.map( function( func ){
                return func.$jin_method_name
            } )
            throw new Error( "Conflict in [" + name + "] by [" + conflictNames + "]" )
        }
        func.$jin_method_name = name
        func.$jin_method_conflictList = conflictList
    }
    
    func.$jin_method_resolveList = resolveList
    
    return func
}

;//../../jin/trait/jin_trait.jam.js?=HOIJYBO8
this.$jin.trait = function $jin_trait( name ){
    
    var trait = $jin.glob( name )
    if( trait ) return trait
    
    trait = $jin.trait.make( name )
    
    return $jin.glob( name, trait )
}

this.$jin.trait.make = function $jin_trait_make( name ){
    
    eval( 'var trait = function ' + name + '( args ){\
        if( this instanceof trait ){\
            return this.init.apply( this, args )\
        } else {\
            return trait.exec.apply( trait, arguments )\
        }\
    }' )

    trait.$jin_method_name = name
    
    return trait
}

;//../../jin/mixin/jin_mixin.jam.js?=HOIJYBO8
this.$jin.mixin = function( ){ // arguments: sourceName+, targetName
    var trait = $jin.mixin.object.apply( this, arguments )
    
    for( var index = 0; index < arguments.length; ++index ){
        arguments[ index ] += '_'
    }
    $jin.mixin.object.apply( this, arguments )
    
    return trait
}

this.$jin.mixin.object = function( ){ // arguments: sourceName+, targetName
    var sourcePathList = [].slice.call( arguments )
    var targetPath = sourcePathList.pop()
    var target = $jin.trait( targetPath )
    
    sourcePathList.forEach( function( sourcePath ){
        var source = $jin.trait( sourcePath )
        source.$jin_mixin_slaveList = source.$jin_mixin_slaveList || []
        if( ~source.$jin_mixin_slaveList.indexOf( targetPath ) ) return
        source.$jin_mixin_slaveList.push( targetPath )
        
        for( var key in source ){
            var func = source[ key ]
            if(( typeof func !== 'function' )||( !func.$jin_method_name )){
                if(!( key in target )) target[ key ] = void 0
                continue
            }
            
            var methodName = func.$jin_method_name.replace( /^([$\w]+_)+/, '' )
            $jin.method.define( targetPath + '_' + methodName, func )
        }
    })
    
    return target
}

;//../../jin/property/jin_property.jam.js?=HOIKIR0G
this.$jin.property = function $jin_property( ){ // arguments: resolveName*, filter
    var resolveList = [].slice.call( arguments )
    var filter = resolveList.pop()
    
    var name = filter.name = $jin.func.name( filter )
    if( !name ) throw new Error( 'Can not register anonymous property' )
    
    $jin.property.define.apply( $jin.property, resolveList.concat([ name, filter ]) )
}

this.$jin.property.define = function $jin_property_define( ){ // arguments: resolveName*, name, filter
    var resolveList = [].slice.call( arguments )
    var filter = resolveList.pop()
    var name = resolveList.pop()
    
    var property = function $jin_property( value ){
        if( arguments.length ){
            if( value === void 0 ){
                this[ property.fieldName ] = void 0
            } else {
                this[ property.fieldName ] = property.filter.apply( this, arguments )
            }
            return this
        } else {
            if( this[ property.fieldName ] === void 0 ){
                return this[ property.fieldName ] = property.filter.apply( this, arguments )
            } else {
                return this[ property.fieldName ]
            }
        }
    }
    
    property.filter = filter || function( value ){ return value }
    property.fieldName = '_' + name
    property.$jin_method_name = name
    property.$jin_method_resolveList = resolveList
    
    return $jin.method.define( name, property )
}

;//../../jin/klass/jin_klass.jam.js?=HOIJYBO8
$jin.klass = function $jin_klass( ){ // arguments: sourceName*, targetName
    var name = arguments[ arguments.length - 1 ]
    $jin.mixin( '$jin_klass', name )
    return $jin.mixin.apply( this, arguments )
}

$jin.method( function $jin_klass_exec( ){
    return new this( arguments )
} )

$jin.method( function $jin_klass_id( ){
    return this.$jin_method_name || this.name
} )

$jin.method( function $jin_klass_toString( ){
    return this.id()
} )

$jin.method( function $jin_klass__init( json ){
    return this.json( json )
} )

$jin.property.define( '$jin_klass__entangleList', Array )
$jin.method( function $jin_klass__entangle( value ){
    this.entangleList().push( value )
    return this
} )

$jin.method( function $jin_klass__destroy( ){
    
    this.entangleList().forEach( function( entangle ){
       entangle.destroy()
    } )
    
    for( var key in this ){
        delete this[ key ]
    }
    
    return this
} )

$jin.method( function $jin_klass__json( json ){
    if( !arguments.length ) return null
    
    if( !json ) return this
    
    for( var key in json ){
        this[ key ]( json[ key ] )
    }
    
    return this
} )

$jin.property.define( '$jin_klass__methodList', Object )
$jin.method( function $jin_klass__method( name ){
    var hash = this.methodHash()
    
    var method = hash[ '_' + name ]
    if( method ) return method
    
    method = function $jin_klass__method_instance( ){
        return method.content[ method.methodName ].call( method.content, arguments )
    }
    
    return hash[ '_' + name ] = method
} )

;//../../jin/registry/jin_registry.jam.js?=HOOGCLVK
$jin.property.define( '$jin_registry_storage', Object )
    
$jin.property.define( '$jin_registry__id', String )

$jin.method( '$jin_klass_exec', function $jin_registry_exec( id ){
    
    var key= '?' + id
    var storage = this.storage()
    
    var obj = storage[ key ]
    if( obj ) return obj
    
    var newObj = this.$jin_klass_exec( id )
    var key2 = '?' + newObj.id()
    
    var obj = storage[ key2 ]
    if( obj ) return obj
    
    return storage[ key ] = storage[ key2 ] = newObj
} )

$jin.method( '$jin_klass__init', function $jin_registry__init( id ){
    return this.id( id )
} )    

$jin.method( '$jin_klass__toString', function $jin_registry__toString( ){
    return this.id()
} )    

;//../../jin/alias/jin_alias.jam.js?=HNVHU2C8
this.$jin.alias = function $jin_alias( ){ // arguments: resolveName*, name, aliasedName
    var resolveList = [].slice.call( arguments )
    var aliasedName = String( resolveList.pop() )
    var name = String( resolveList.pop() )
    
    eval( 'var alias = function ' + name + '( ){ \
        return this[ alias.$jin_alias_name ].apply( this, arguments ) \
    }' )
    
    alias.$jin_alias_name = aliasedName
    
    return $jin.method.apply( $jin, resolveList.concat([ alias ]) )
}

;//../../jin/defer/jin_defer.env=web.jam.js?=HOK55SVK
$jin.method( function $jin_defer( func ){
    $jin.defer.queue.push( func )
    if( $jin.defer.queue.length < 2 ){
		if( window.postMessage ) window.postMessage( '$jin.defer', document.location.href )
		else window.setTimeout( $jin.defer.check, 0 )
	}
    return { destroy: function(){
        var index = $jin.defer.queue.indexOf( func )
        if( index ) $jin.defer.queue.splice( index, 1 )
    }}
} )

$jin.defer.queue = []

$jin.method( function $jin_defer_check( event ){
	
	if( typeof event === 'object' ){
		if( event.source !== window ) return
		if( event.data !== '$jin.defer' ) return
		event.stopPropagation();
	}
    
	var queue = $jin.defer.queue
	$jin.defer.queue = []
    queue.forEach(function( handler ){
		handler()
	})
} )

if( window.addEventListener ) window.addEventListener( 'message', $jin.defer.check, true )
else window.attachEvent( 'onmessage', $jin.defer.check )

;//../../jin/atom/jin_atom.jam.js?=HOLNAHNK
$jin.klass( '$jin_atom' )

$jin.glob( '$jin_atom_slaves', [] )

$jin.method( '$jin_klass__init', function $jin_atom__init( puller ){
    this._puller = puller
    this._slaves = []
    this._masters = []
    
    this.value( void 0 )
} )

$jin.method( function $jin_atom__get( ){
    var slave = $jin.atom.slaves[0]
    if( slave ) this.lead( slave )
    
    if( this._puller && ( this.value() === void 0 ) ) return this.pull()
    
    return this.value()
} )
$jin.alias( '$jin_atom__valueOf', 'get' )

$jin.method( function $jin_atom__pull( ){
    this.update( void 0 )
    
    this.disobeyAll()
    
    if( ~$jin.atom.slaves.indexOf( this ) ) throw new Error( 'Recursive atom' )
    $jin.atom.slaves.unshift( this )
    try {
        var value = this._puller( this.value() )
    } finally {
        if( $jin.atom.slaves[0] !== this ) throw new Error( 'Atom is not on top of stack' )
        $jin.atom.slaves.shift()
    }
    
    this.value( value )
    
    return value
} )

$jin.property( function $jin_atom__value( value ){
    if( !arguments.length ) return void 0
    
    if( value !== this.value() ) this.notify()
    
    return value
} )

$jin.method( function $jin_atom__defined( ){
    return ( this.value() !== void 0 )
} )

$jin.method( function $jin_atom__notify( ){
    this._slaves.forEach( function( slave ){
        slave.update()
    })

    return this
} )

$jin.property( function $jin_atom__update( ){
    if( arguments.length ) return
    return $jin.defer( this.pull.bind( this ) )
} )

$jin.method( function $jin_atom__lead( slave ){
    if( slave === this ) throw new Error( 'Self leading atom' )
    if( ~this._slaves.indexOf( slave ) ) return this
    
    this._slaves.unshift( slave )
    slave.obey( this )
    
    return this
} )

$jin.method( function $jin_atom__obey( master ){
    if( master === this ) throw new Error( 'Self obey atom' )
    if( ~this._masters.indexOf( master ) ) return this
    
    this._masters.unshift( master )
    master.lead( this )
    
    return this
} )

$jin.method( function $jin_atom__dislead( slave ){
    var index = this._slaves.indexOf( slave )
    if( !~index ) return this
    
    this._slaves.splice( index, 1 )    
    slave.disobey( this )
    
    this.reap()
    
    return this
} )

$jin.method( function $jin_atom__disobey( master ){
    var index = this._masters.indexOf( master )
    if( !~index ) return this
    
    this._masters.splice( index, 1 )
    master.dislead( this )
    
    return this
} )

$jin.method( function $jin_atom__disleadAll( ){
    var atom = this
    var slaves = this._slaves
    this._slaves = []
    slaves.forEach( function( slaves ){
        slaves.disobey( atom )
    })
    this.reap()
} )

$jin.method( function $jin_atom__disobeyAll( ){
    var atom = this
    var masters = this._masters
    this._masters = []
    if( masters ) masters.forEach( function( master ){
        master.dislead( atom )
    })
} )

$jin.method( function $jin_atom__reap( ){
    //if( this._slaves.length ) return
    //$jin.defer( function( ){
    //    if( !this._slaves || this._slaves.length ) return
    //    this.value( void 0 )
    //    this.disobeyAll()
    //}.bind( this ) )
} )

$jin.method( '$jin_klass__destroy', function $jin_atom__destroy( ){
    this.disobeyAll()
    this.disleadAll()
    return this.$jin_klass__destroy()
} )

;//../../jin/prop/jin_prop.jam.js?=HOMEC1HS
$jin.method( function $jin_prop( config ){
    
    var name = config.name
    
    var prop = $jin.func.make( name )
    
    prop.fieldName = '_' + name
    
    prop.execute = function $jin_prop__execute( context, args ){
        var atom = prop.atom( context )
        if( !args.length ) return atom.get()
        
        var val = args[0]
        atom.value( config.put.call( context, val ) )
        return context
    }
    
    prop.atom = function( context ){
        var atom = context[ prop.fieldName ]
        
        if( atom ) return atom
        
        return context[ prop.fieldName ] = $jin.atom( config.pull.bind( context ) )
    }
    
    prop.$jin_method_resolveList = config.resolve || []
    
    return $jin.method.define( name, prop )
})

$jin.method( function $jin_prop_hash( config ){
    
    var name = config.name
    
    var prop = $jin.func.make( name )
    
    prop.fieldName = '_' + name
    
    prop.execute = function $jin_prop__execute( context, args ){
        var key = args[0]
        var val = args[1]
        var atom = prop.atom( context, key )
        
        if( args.length < 2 ) return atom.get()
        
        return config.put.call( context, key, val )
    }
    
    prop.atomHash = function( context ){
        var atomHash = context[ prop.fieldName ]
        if( !atomHash ) atomHash = context[ prop.fieldName ] = {}
        return atomHash
    }
    
    prop.atom = function( context, key ){
        var atomHash = prop.atomHash( context )
        
        var atom = atomHash[ key ]
        if( atom ) return atom
        
        return atomHash[ key ] = $jin.atom( function( ){
            return config.pull.call( context, key )
        } )
    }
    
    return $jin.method( prop )
})

;//../../jin/state/jin_state.jam.js?=HNVHU340
//$jin.prop.hash({ handler:  function $jin_state_item( key, value ){
//    
//    if( arguments.length < 2 ) return
//    
//    if( Object( value ) === value ){
//        for( var k in value ) {
//            if( !value.hasOwnProperty( k ) ) continue
//            this.context[ this.name ]( key + '.' + k, value[ k ] )
//        }
//        return
//    } else {
//        if( value === void 0 ) return value
//        if( value === null ) return value
//        return String( value )
//    }
//    
//} } )

;//../../jin/wrapper/jin_wrapper.jam.js?=HOIJYBO8
$jin.wrapper = function $jin_wrapper( ){ // arguments: sourceName*, targetName
    $jin.mixin.apply( this, arguments )
    
    var name = arguments[ arguments.length - 1 ]
    return $jin.mixin( '$jin_wrapper', name )
}

$jin.mixin( '$jin_klass', '$jin_wrapper' )
$jin.property.define( '$jin_wrapper__raw', null )

$jin.method( '$jin_klass_exec', function $jin_wrapper_exec( obj ){
    if( obj instanceof this ) return obj
    if( obj.$jin_wrapper__raw ) obj = obj.raw()
    return this.$jin_klass_exec( obj )
} )

$jin.method( '$jin_klass__init', function $jin_wrapper__init( obj ){
    this.raw( obj )
    return this
} )

;//../../jin/env/jin_env.jam.js?=HNVHU2C8
this.$jin.env = $jin.value( function(){ return this }() )

;//../../jin/event/jin_event.jam.js?=HNXKTHCO
$jin.klass( '$jin_event' )

$jin.property( function $jin_event_type( ){
    return String( this )
} )

$jin.method( function $jin_event_listen( crier, handler ){
    return crier.listen( this.type(), handler )
} )


$jin.property.define( '$jin_event__target', null )
$jin.property.define( '$jin_event__catched', Boolean )
    
$jin.property( function $jin_event__type( type ){
    if( arguments.length ) return String( type )
    return String( this.constructor )
} )

$jin.method( function $jin_event__scream( crier ){
    crier.scream( this )
    return this
} )

;//../../jin/support/jin_support.env=web.jam.js?=HNVHU340
$jin.property( function $jin_support_xmlModel( ){
    return ( window.DOMParser && window.XMLSerializer && window.XSLTProcessor ) ? 'w3c' : 'ms'
} )

$jin.property( function $jin_support_htmlModel( ){
    return document.createElement( 'html:div' ).namespaceURI !== void 0 ? 'w3c' : 'ms'
} )

$jin.property( function $jin_support_eventModel( ){
    return ( 'addEventListener' in document.createElement( 'div' ) ) ? 'w3c' : 'ms'
} )

$jin.property( function $jin_support_textModel( ){
    return ( 'createRange' in document ) ? 'w3c' : 'ms'
} )

$jin.property( function $jin_support_vml( ){
    return /*@cc_on!@*/ false
} )

;//../../jin/vector/jin_vector.jam.js?=HNYAIW60
$jin.klass( '$jin_wrapper', '$jin_vector' )

$jin.method( function $jin_vector__x( val ){
	if( !arguments.length ) return this.raw()[0]
	this.raw()[0] = val
	return this
} )

$jin.method( function $jin_vector__y( val ){
	if( !arguments.length ) return this.raw()[1]
	this.raw()[1] = val
	return this
} )

$jin.method( function $jin_vector__z( val ){
	if( !arguments.length ) return this.raw()[2]
	this.raw()[2] = val
	return this
} )

;//../../jin/dom/event/jin_dom_event.env=web.jam.js?=HOORMVNC
$jin.klass( '$jin_wrapper', '$jin_event', '$jin_dom_event' )

$jin.property( '$jin_dom_event_bubbles', Boolean )
$jin.property( '$jin_dom_event_cancelable', Boolean )

$jin.method( '$jin_event_listen', function $jin_dom_event_listen( crier, handler ){
    return $jin.dom( crier ).listen( this.type(), handler )
} )

$jin.method( function $jin_dom_event__nativeEvent( ){
    var raw = this.raw()
    if( raw ) return raw
    
    var Event = this.constructor 
    var type = Event.type()
    var bubbles = Event.bubbles()
    var cancelable = Event.cancelable()
    
    if( $jin.support.eventModel() === 'ms' ){
        raw= document.createEventObject()
        raw.type = type
        raw.bubbles = bubbles
        raw.cancelable = cancelable
    } else {
        raw = document.createEvent( 'Event' )
        raw.initEvent( type, bubbles, cancelable )
    }
    
    this.raw( raw )
    
    return raw
} )

$jin.method( '$jin_event__target', function $jin_dom_event__target( ){
    return $jin.dom( this.nativeEvent().target || this.nativeEvent().srcElement )
} )

$jin.method( '$jin_event__type', function $jin_dom_event__type( type ){
    var nativeEvent = this.nativeEvent()
    type = String( type )
    
    if( !arguments.length ){
        return nativeEvent.$jin_dom_event_type || nativeEvent.type
    }
    
    nativeEvent.initEvent( type, this.bubbles(), this.cancelable() )
    nativeEvent.$jin_dom_event_type= nativeEvent.type= type
    
    return this
} )

$jin.method( function $jin_dom_event__bubbles( bubbles ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.bubbles
    }
    
    nativeEvent.initEvent( this.type(), Boolean( bubbles ), this.cancelable() )
    
    return this
} )

$jin.method( function $jin_dom_event__cancelable( cancelable ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.cancelable
    }
    
    nativeEvent.initEvent( this.type(), this.bubbles(), Boolean( cancelable ) )
    
    return this
} )

$jin.method( '$jin_event__catched', function $jin_dom_event__catched( catched ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.defaultPrevented || nativeEvent.$jin_dom_event_catched
    }
    
    nativeEvent.returnValue= !catched
    
    if( catched && nativeEvent.preventDefault ){
        nativeEvent.preventDefault()
    }
    
    nativeEvent.$jin_dom_event_catched = nativeEvent.defaultPrevented = !!catched
    
    return this
} )

$jin.method( function $jin_dom_event__keyCode( ){
    return this.nativeEvent().keyCode
} )

$jin.method( function $jin_dom_event__mouseButton( ){
    return this.nativeEvent().button
} )

$jin.method( function $jin_dom_event__transfer( ){
    return this.nativeEvent().dataTransfer
} )

$jin.method( function $jin_event__data( data ){
	if( arguments.length ){
		var str = JSON.stringify( data )
		try {
			this.transfer().setData( 'text/json', str )
		} catch( error ){
			this.transfer().setData( 'Text', str )
		}
		return this
	} else {
		try {
			var str = this.transfer().getData( 'text/json' )
		} catch( error ){
			var str = this.transfer().getData( 'Text' )
		}
		try {
			var data = JSON.parse( str )
		} catch( error ){
			console.error( error )
		}
		return data || str
	}
} )

$jin.method( function $jin_dom_event__offset( ){
    return $jin.vector([ this.nativeEvent().offsetX, this.nativeEvent().offsetX ])
} )

;//../../jin/dom/event/jin_dom_event_onInput.env=web.jam.js?=HOORA634
$jin.klass( '$jin_dom_event', '$jin_dom_event_onInput' )

$jin.method( '$jin_event_type', function $jin_dom_event_onInput_type( ){
    return 'input'
} )

//$jin.method( '$jin_dom_event_listen', function $jin_dom_event_onInput_listen( crier, handler ){
//	var crier = $jin.dom( crier )
//	
//	crier.editable( true )
//	
//	return this.$jin_dom_event_listen( crier, handler )
//} )

;//../../jin/listener/jin_listener.jam.js?=HNVHU2C8
$jin.klass( '$jin_listener' )

$jin.property.define( '$jin_listener__crier', null )
$jin.property.define( '$jin_listener__eventName', String )
$jin.property.define( '$jin_listener__handler', null )

$jin.method( function $jin_listener__forget( ){
    this.crier().forget( this.eventName(), this.handler() )
    return this
} )

$jin.method( '$jin_klass__destroy',  function $jin_listener__destroy( ){
    this.forget()
    this.$jin_klass__destroy()
} )

;//../../jin/dom/jin_dom.jam.js?=HOPF1VN4
$jin.klass( '$jin_wrapper', '$jin_dom' )

$jin.method( '$jin_wrapper_exec', function $jin_dom_exec( node ){
    if( node instanceof this ) return node
    
    //var name = String( this )
    //var obj = node[ name ]
    //if( obj && ( obj instanceof this ) ) return obj
    
    var obj = new this([ node ])
    
    //try {
    //    obj.nativeNode()[ name ] = this
    //} catch( e ){}
    
    return obj
} )

$jin.method( function $jin_dom_env( ){
    return $jin.env()
} )

$jin.method( function $jin_dom_escape( val ){
    return val.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&apos;' )
} )


$jin.method( '$jin_wrapper__init', function $jin_dom__init( node ){
    if( typeof node === 'string' ){
        var parser = new( $jin.dom.env().DOMParser )
        var doc = parser.parseFromString( String( node ), 'text/xml' )
        node = doc.documentElement || doc
    } else {
        if( node.$jin_wrapper__raw ) node = node.raw()
    }
    
    this.nativeNode( node )
    
    return this
} )

$jin.alias( '$jin_wrapper__raw', '$jin_dom__raw', 'nativeNode' )
$jin.property.define( '$jin_dom__nativeNode', null )
    
$jin.method( function $jin_dom__nativeDoc( ){
    var node = this.raw()
    return node.ownerDocument || node
} )
    
$jin.method( function $jin_dom__toString( ){
    var serializer= new( $jin.dom.env().XMLSerializer )
    return serializer.serializeToString( this.nativeNode() )
} )
    
$jin.method( function $jin_dom__transform( stylesheet ){
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( $jin.dom( stylesheet ).nativeDoc() )
    var doc= proc.transformToDocument( this.nativeNode() )
    return $jin.dom( doc )
} )
    
$jin.method( function $jin_dom__render( from, to ){
    from= $jin.dom( from ).nativeNode()
    to= $jin.dom( to ).nativeNode()
    
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( this.nativeDoc() )
    var res= proc.transformToFragment( from, to.ownerDocument )
    to.innerHTML= ''
    to.appendChild( res )
    
    return this
} )
    
$jin.method( function $jin_dom__name( ){
    return this.nativeNode().nodeName
} )

$jin.method( function $jin_dom__attr( name, value ){
    if( arguments.length > 1 ){
        if( value == null ) this.nativeNode().removeAttribute( name )
        else this.nativeNode().setAttribute( name, value )
        return this
    } else {
        return this.nativeNode().getAttribute( name )
    }
} )
    
$jin.method( function $jin_dom__attrList( ){
    var nodes= this.nativeNode().attributes
    
    if( !nodes ) return []
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
} )

$jin.method( function $jin_dom__text( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.textContent = String( value )
        return this
    } else {
        return node.textContent
    }
} )

$jin.method( function $jin_dom__clear( ){
    var node = this.nativeNode()
    var child
    while( child= node.firstChild ){
        node.removeChild( child )
    }
    return this
} )

$jin.method( function $jin_dom__parent( parent ){
    var node = this.nativeNode()
    if( arguments.length ){
        if( parent == null ){
            parent= node.parentNode
            if( parent ) parent.removeChild( node )
        } else {
            $jin.dom( parent ).nativeNode().appendChild( node )
        }
        return this
    } else {
        parent= node.parentNode || node.ownerElement
        return parent ? $jin.dom( parent ) : parent
    }
} )

$jin.method( function $jin_dom__next( next ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var next = node.nextSibling
        if( next ) next = $jin.dom( next )
        return next
    }
    throw new Error( 'Not implemented' )
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node.nextSibling )
    return this
} )

$jin.method( function $jin_dom__prev( prev ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var prev = node.previousSibling
        if( prev ) prev = $jin.dom( prev )
        return prev
    }
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node )
    return this
} )

$jin.method( function $jin_dom__head( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.firstChild
        if( node ) node = $jin.dom( node )
        return node
    }
    node.insertBefore( $jin.dom( dom ).nativeNode(), this.head().nativeNode() )
    return this
} )

$jin.method( function $jin_dom__tail( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.lastChild
        if( node ) node = $jin.dom( node )
        return node
    }
    $jin.dom( dom ).parent( this )
    return this
} )

$jin.method( function $jin_dom__childList( ){
    var nodes= this.nativeNode().childNodes
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
} )

$jin.method( function $jin_dom__select( xpath ){
    var list= []
    
    var found= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null )
    for( var node; node= found.iterateNext(); ) list.push( $jin.dom( node ) )
    
    return list
} )

$jin.method( function $jin_dom__xpath( xpath ){
    var node= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null ).iterateNext()
    if( !node ) return node
    return $jin.dom( node )
} )

$jin.method( function $jin_dom__css( css ){
    var node = this.nativeNode().querySelector( css )
    if( !node ) return node
    return $jin.dom( node )
} )


$jin.method( function $jin_dom__clone( ){
    return $jin.dom( this.nativeNode().cloneNode() )
} )

$jin.method( function $jin_dom__cloneTree( ){
    return $jin.dom( this.nativeNode().cloneNode( true ) )
} )


$jin.method( function $jin_dom__makeText( value ){
    return $jin.dom( this.nativeDoc().createTextNode( value ) )
} )

$jin.method( function $jin_dom__makeFragment( ){
    return $jin.dom( this.nativeDoc().createDocumentFragment() )
} )

$jin.method( function $jin_dom__makePI( name, content ){
    return $jin.dom( this.nativeDoc().createProcessingInstruction( name, content ) )
} )

$jin.method( function $jin_dom__makeElement( name, ns ){
    if( arguments.length > 1 ){
        return $jin.dom( this.nativeDoc().createElementNS( ns, name ) )
    } else {
        return $jin.dom( this.nativeDoc().createElement( name ) )
    }
} )

$jin.method( function $jin_dom__makeTree( json ){
    if( !json ) return this.makeFragment()
    if( ~[ 'string', 'number' ].indexOf( typeof json ) ) return this.makeText( json )
    
    var result = this.makeFragment()
    for( var key in json ){
        if( !json.hasOwnProperty( key ) ) continue
        
        var val = json[ key ]
        if( !key || Number( key ) == key ){
            this.makeTree( val ).parent( result )
        } else {
            var dom = this.makeElement( key )
            this.makeTree( val ).parent( dom )
            dom.parent( result )
        }
    }
    return result
} )

$jin.method( function $jin_dom__listen( eventName, handler ){
    var wrappedHandler = function( event ){
        return handler( $jin.dom.event( event ) )
    }
    this.nativeNode().addEventListener( eventName, wrappedHandler, false )
    return $jin.listener().crier( this ).eventName( eventName ).handler( wrappedHandler )
} )

$jin.method( function $jin_dom__forget( eventName, handler ){
    this.nativeNode().removeEventListener( eventName, handler, false )
    return this
} )

$jin.method( function $jin_dom__scream( event ){
    event = $jin.dom.event( event )
    this.nativeNode().dispatchEvent( event.nativeEvent() )
    return this
} )

$jin.method( function $jin_dom__flexShrink( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.style.flexShrink = String( value )
        return this
    } else {
        return document.getComputedStyles( node ).flexShrink
    }
} )


;//../../jin/dom/jin_dom.env=web.jam.js?=HNXAUUUW
$jin.method( function $jin_dom__html( html ){
    if( arguments.length ){
        this.nativeNode().innerHTML = html
        return this
    } else {
        return this.nativeNode().innerHTML
    }
} )

if( $jin.support.xmlModel() === 'ms' ){
    
    $jin.mixin( '$jin_dom_ms', '$jin_dom' )
    
    $jin.method( '$jin_dom__toString', function $jin_dom_ms__toString( ){
        return String( this.nativeNode().xml )
    } )

    // works incorrectly =( use render instead
    $jin.method( '$jin_dom__transform', function $jin_dom_ms__transform( stylesheet ){
        var result= this.nativeNode().transformNode( $jin.dom( stylesheet ).nativeNode() )
        return $jin.dom.parse( result )
    } )

    $jin.method( '$jin_dom__render', function $jin_dom_ms__render( from, to ){
        from= $jin.dom( from ).nativeNode()
        to= $jin.dom( to ).nativeNode()
        
        to.innerHTML= from.transformNode( this.nativeDoc() )
    } )
    
    $jin.method( '$jin_dom__text', function $jin_dom_ms__text( value ){
        var node = this.nativeNode()
        if( arguments.length ){
            node.innerText = value
            return this
        } else {
            return node.innerText
        }
    } )
    
    $jin.method( '$jin_dom__select', function $jin_dom_ms__select( xpath ){
        var list= []
        
        var found= this.nativeNode().selectNodes( xpath )
        for( var i= 0; i < found.length; ++i ) list.push( $jin.dom( found[ i ] ) )
        
        return list
    } )

    $jin.method( '$jin_dom_parse', function $jin_dom_ms_parse( str ){
        var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
        doc.async= false
        doc.loadXML( str )
        return $jin.dom( doc.documentElement || doc )
    } )

}

if( $jin.support.eventModel() === 'ms' ){

    $jin.method( '$jin_dom__listen', function $jin_dom_ms__listen( eventName, handler ){
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().attachEvent( eventName, function( ){
            var event = $jin.dom.event( window.event )
            //if( event.type() !== eventName ) return
            return handler( event )
        } )
        return this
    } )
    
    $jin.method( '$jin_dom__forget', function $jin_dom_ms__forget( eventName, handler ){
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().detachEvent( eventName, handler )
        return this
    } )
    
    $jin.method( '$jin_dom__scream', function $jin_dom_ms__scream( event ){
        event = $jin.dom.event( event )
        var eventName = this.normalizeEventName( event.type() )
        this.nativeNode().fireEvent( eventName, event.nativeEvent() )
        return this
    } )

    $jin.method( function $jin_dom_ms__normalizeEventName( eventName ){
        return /^[a-zA-Z]+$/.test( eventName ) ? 'on' + eventName : 'onbeforeeditfocus'
    } )
    
}

;//../../jin/state/local/jin_state_local.env=web.jam.js?=HOIJYBO8
$jin.klass( '$jin_state_local' )

$jin.prop(
{   name: '$jin_state_local_storage'
,   pull: function( ){
        return window.localStorage || {}
    }
} )

$jin.prop(
{   name: '$jin_state_local_listener'
,   pull: function( ){
        var context = this
        return $jin.dom( window ).listen( 'storage', function( event ){
            var key = event.nativeEvent().key
            if( key ){
                context.item.atom( context, key ).pull()
            } else {
                var hash = context.item.atomHash( context )
                for( var key in hash ){
                    hash[ key ].pull()
                }
            }
        } )
    }
} )

$jin.prop.hash(
{   name: '$jin_state_local_item'
,   pull: function( key ){
        this.listener()
        var val = this.storage()[ key ]
        return ( val == null ) ? null : val
    }
,   put: function( key, value ){
        
        if( value == null ){
            delete this.storage()[ key ]
            return null
        }
        
        if( Object( value ) === value ){
            for( var k in value ) {
                if( !value.hasOwnProperty( k ) ) continue
                this.item( key + ';' + k, value[ k ] )
            }
            return
        }
        
        value = this.storage()[ key ] = String( value )
        
        this.item.atom( this, key ).update()
        
        return value
    }
} )

;//../../jin/model/jin_model.jam.js?=HOOH4PG8
$jin.klass( '$jin_registry', '$jin_model_klass' )

$jin.method( function $jin_model_klass__state( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.method( function $jin_model_prop( config ){
    var parse = config.parse || function( val ){ return val }
    var serial = config.parse || String
    
    var prop = $jin.prop(
    {   name: config.name
    ,   pull: function( ){
            var val = this.state( config.name + '=' + this )
            if( val === null ) val = config.def
            val = parse.call( this, val )
            return ( val === void 0 ) ? null : val
        }
    ,   put: function( val ){
            val = serial.call( this, val )
            this.state( config.name + '=' + this, String( val ) )
            return 
        }
    } )
    
    return prop
} )

$jin.method( function $jin_model_list( config ){
    
    var propName = config.name.match( /[a-z0-9]+$/i )[0]
    
    var parseItem = config.parseItem || function( val ){ return val }
    var parse = config.parse || function( val ){
        return ( ( typeof val === 'string' ) ? val.split( ',' ) : val /*|| []*/ ).map( parseItem, this )
    }
    
    var serialItem = config.serialItem || String
    var serial = config.serial || function( val ){
        return ( typeof val === 'string' ) ? val : val.map( serialItem, this ).join( ',' )
    }
    
    $jin.model.prop(
    {   name: config.name
    ,   parse: parse
    ,   serial: serial
    ,   def: config.def
    } )
    
    $jin.method.define( config.name + 'Add', function( newItems ){
        var items = this[propName]()
        
        newItems = parse( newItems ).filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
    })

    $jin.method.define( config.name + 'Drop', function( oldItems ){
        oldItems = parse( oldItems )
        
        var items = this[propName]().filter( function( item ){
            return !~oldItems.indexOf( item )
        })
        
        this[propName]( items )
		
		return this
    })
    
} )

;//../../jin/sample/jin_sample.jam.js?=HOPF45FK
$jin.prop.hash(
{   name: '$jin_sample'
,   pull: function $jin_sample_pull( id ){
        var selector = '[jin_sample_list]>[' + id + ']'
        
        var node = document.querySelector( selector )
        if( !node ) throw new Error( 'Sample not found (' + selector + ')' )
        
        return $jin.sample.make( node )
    }
} )

$jin.method( function $jin_sample_make( proto )
{
    var path = []
    var rules = []
    
    function collect( node ){
        
        var attrs = node.attributes
        if( attrs ){
            for( var i = 0; i < attrs.length; ++i ){
                var attr = attrs[ i ]
                
                var found = /^\{(\w+)\}$/g.exec( attr.nodeValue )
                if( !found ) continue
                var key = found[1]
                
                rules.push({ key: key, path: path.slice(), attrName: attr.nodeName })
            }
        }
        
        var props = node.getAttribute && node.getAttribute( 'jin_sample_props' )
        if( props ){
            props.split( /[; &]+/g )
            .forEach( function( chunk ){
                var subPath = chunk.split( /[-_:=.]/g )
                var key = subPath.pop()
                var fieldName = subPath.pop()
                
                rules.push({ key: key, path: path.concat( subPath ), fieldName: fieldName })
            } )
        }
        
        var events = node.getAttribute && node.getAttribute( 'jin_sample_events' )
        if( events ){
            events.split( /[; &]+/g )
            .forEach( function( chunk ){
                var eventName = chunk.split( /[-_:=.]/g )
                var key = eventName.pop()
                eventName = eventName.join( '_' )
                var event = $jin.glob( eventName )
                if( !event ) throw new Error( 'Unknown event [' + eventName + ']' )
                rules.push({ key: key, path: path.slice(), event: event })
            } )
        }
        
        if( node.childNodes ){
            for( var i = 0; i < node.childNodes.length; ++i ){
                var child = node.childNodes[i]
                
                if( child.nodeName === '#text' ){
                    var found = /\{(\w+)\}/g.exec( child.nodeValue )
                    if( !found ) continue
                    var key = found[1]
                    
                    rules.push({ key: key, path: path.slice() })
                } else {
                    path.push( 'childNodes', i )
                        collect( child )
                    path.pop(); path.pop()
                }
            }
        }
    }
    
    collect( proto )
    
    return function $jin_sample_make( view ){        
        var node = proto.cloneNode( true )
        node.setAttribute( 'id', view.id() )
        
        rules.forEach( function $jin_sample__proceedRule( rule ){
            var current = node
            
            rule.path.forEach( function( name ){
                current = current[ name ]
            } )
            
            if( rule.attrName ){
                var cover = $jin.atom( function $jin_sample__syncAttr( oldValue ){
                    var value = view[ rule.key ]()
                    if( oldValue === value ) return value
                    
                    if( value == null ) current.removeAttribute( rule.attrName )
                    else current.setAttribute( rule.attrName, String( value ) )
                    
                    return value
                } )
            } else if( rule.fieldName ){
                var cover = $jin.atom( function $jin_sample__syncField( oldValue ){
                    var value = view[ rule.key ]()
                    if( oldValue === value ) return value
                    
                    return current[ rule.fieldName ] = value
                } )
            } else if( rule.event ){
                var listener = rule.event.listen( current, view[ rule.key ].bind( view ) )
                view.entangle( listener )
                return
            } else {
                var cover = $jin.atom( function $jin_sample__syncNodes( oldValue ){
                    var value = view[ rule.key ]()
                    
                    if( typeof value !== 'object' ){
                        var content = ( value == null ) ? '' : String( value )
                        
                        if( 'textContent' in current ) var oldContent = current.textContent
                        else var oldContent = current.innerText
                        
                        if( content === oldContent ) return 
                        
                        if( 'textContent' in current ) current.textContent = content
                        else current.innerText = content
                        
                        return value
                    }
                    
                    if( oldValue === value ) return value
                    
                    var child; while( child = current.firstChild ) current.removeChild( child )
                    
                    if( value == null ) return value
                    
                    if( typeof value.raw === 'function' ){
                        var content = value.raw()
                    } else {
                        var content = value
                    }
                    
                    if( content.length ){
                        content.forEach( function( item ){
                            if( item == null ) return
                            
                            if( typeof item !== 'object' ) item = document.createTextNode( String( item ) )
                            if( typeof item.raw === 'function' ) item = item.raw()
                            
                            current.appendChild( item )
                        })
                    } else {
                        current.appendChild( content )
                    }
                    
                    return value
                } )
            }
            
            cover.pull()
            
            view.entangle( cover )
        } )
        
        return node
    }
    
} )

;//../../jin/view/jin_view.env=web.jam.js?=HOOT19OW
$jin.klass( '$jin_registry', '$jin_dom', '$jin_view' )

$jin.method( function $jin_view__state( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.method( '$jin_registry_exec', '$jin_dom_exec', function $jin_view_exec( config ){
    return this.$jin_registry_exec( config )
} )

$jin.method( '$jin_registry__init', '$jin_dom__init', function $jin_view__init( config ){
    return this.$jin_registry__init( config )
} )

$jin.property( '$jin_dom__nativeNode', function $jin_view__nativeNode( node ){
    var Sample = $jin.sample( String( this.constructor ).replace( /^\$/, '' ) )
    return Sample( this )
} )

$jin.property( '$jin_registry__toString', '$jin_dom__toString', '$jin_dom_ms__toString', function $jin_view__toString( ){
	return this.$jin_registry__toString()
} )

;//../../jin/task/jin_task.jam.js?=HOL7MC8O
$jin.klass( '$jin_model_klass', '$jin_task' )

$jin.model.prop({ name: '$jin_task__title' })

$jin.model.prop({ name: '$jin_task__description' })

$jin.method( function $jin_task__viewDetails( ){
    return $jin.task.view.details
} )

$jin.method( function $jin_task__viewItem( ){
    return $jin.task.view.item
} )


;//../../jin/task/jin_task_view_item.jam.js?=HOL7MC8O
$jin.klass( '$jin_view', '$jin_task_view_item' )

$jin.property.define( '$jin_task_view_item__list', null )
$jin.property.define( '$jin_task_view_item__task', null )

$jin.prop(
{   name: '$jin_task_view_item__title'
,   pull: function( ){
        return this.task().title()
    }
} )

$jin.prop(
{   name: '$jin_task_view_item__uri'
,   pull: function( ){
        return '#task=' + this.task().id()
    }
} )

$jin.prop(
{   name: '$jin_task_view_item__current'
,   pull: function( ){
        return String( this.list().task() === this.task() )
    }
} )

;//../../jin/task/jin_task_view_details.jam.js?=HOORFJRC
$jin.klass( '$jin_view', '$jin_task_view_details' )

$jin.prop(
{   name: '$jin_task_view_details__todo'
,   pull: function( ){}
,   put: function( val ){
        return val
    }
} )

$jin.prop(
{   name: '$jin_task_view_details__task'
,   pull: function( ){}
,   put: function( val ){
        return val
    }
} )

$jin.prop(
{   name: '$jin_task_view_details__title'
,   pull: function( ){
        return this.task().title()
    }
} )

$jin.prop(
{   name: '$jin_task_view_details__description'
,   pull: function( ){
        return this.task().description()
    }
} )

$jin.prop(
{   name: '$jin_task_view_details__editableTitle'
,   pull: function( ){
        return true
    }
} )

$jin.prop(
{   name: '$jin_task_view_details__editableDescription'
,   pull: function( ){
        return !!this.task().title()
    }
} )

$jin.prop(
{   name: '$jin_task_view_details__visibleDescription'
,   pull: function( ){
        return !!this.task().title() || !!this.task().description()
    }
} )

$jin.method( function $jin_task_view_details__onChangeTitle( event ){
	this.task().title( event.target().text() )
} )

$jin.method( function $jin_task_view_details__onChangeDescription( event ){
	this.task().description( event.target().text() )
} )

;//../../jin/uri/jin_uri.jam.js?=HNVHU340
$jin.klass( '$jin_uri' )

$jin.property( function $jin_uri_chunkSep( sep ){
    return '&'
})

$jin.property( function $jin_uri_valueSep( sep ){
    return '='
})

$jin.method( function $jin_uri_escape( str ){
    return String( str )
    .replace
    (   /[^- a-zA-Z\/?:@!$'()*+,._~\xA0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\x{4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD\uE000-\uF8FF\uF0000-\uFFFFD\u100000-\u10FFFD}]+/
    ,   encodeURIComponent
    )
    .replace( / /g, '+' )
} )


$jin.property.define( '$jin_uri__scheme', String )
$jin.property.define( '$jin_uri__slashes', Boolean )
$jin.property.define( '$jin_uri__login', String )
$jin.property.define( '$jin_uri__password', String )
$jin.property.define( '$jin_uri__host', String )
$jin.property.define( '$jin_uri__port', Number )
$jin.property.define( '$jin_uri__path', String )
$jin.property.define( '$jin_uri__query', Object )
$jin.property.define( '$jin_uri__hash', String )

$jin.method( '$jin_klass__json', function $jin_uri__json( json ){
    if( arguments.length ) return this.$jin_klass__json( json )
    
    json = {}
    json.scheme = this.scheme()
    json.slashes = this.slashes()
    json.login = this.login()
    json.password = this.password()
    json.host = this.host()
    json.port = this.port()
    json.path = this.path()
    
    var query = this.query()
    json.query = {}
    for( key in query ) json.query = query[ key ]
    
    json.hash = this.hash()
    
    return json
} )

$jin.method( function $jin_uri__resolve( str ){
    var uri = $jin.uri.parse( String( str ) )
    
    if( !uri.scheme() ) uri.scheme( this.scheme() )
    else return uri
    
    if( !uri.slashes() ) uri.slashes( this.slashes() )
    if( !uri.host() ){
        uri.login( this.login() )
        uri.password( this.password() )
        uri.host( this.host() )
        uri.port( this.port() )
    } else {
        return uri
    }
    
    if( uri.path()[0] !== '/' ) uri.path( this.path().replace( /[^\/]+$/, '' ) + uri.path() )
    else return uri
    
    return uri
} )

$jin.method( function $jin_uri__toString( ){
    var Uri = this.constructor
    
    var link = ''
    
    if( this.scheme() ) link += this.scheme() + ':'
    if( this.slashes() ) link += '//'
    
    if( this.login() ){
        link += this.login()
        if( this.password() ) link += ':' + this.password()
        link += '@'
    }
    
    if( this.host() ) link += this.host()
    if( this.port() ) link += ':' + Number( this.port() )
    if( this.path() ) link += this.path()
    
    var chunks = []
    for( var key in this.query() ){
        var chunk = [ key ].concat( this.query()[ key ] ).map( function( val ){ return Uri.escape( val ) }).join( Uri.valueSep() )
        chunks.push( chunk )
    }
    if( chunks.length ){
        link += '?' + chunks.join( Uri.chunkSep() )
    }
    
    if( this.hash() ) link = '#' + this.hash()
    
    return link
} )

$jin.method( function $jin_uri_parse( string ){
    var Uri = this
    
    var config = {}
    
    config.path = string
    .replace( /#(.*)$/, function( str, hash ){
        config.hash = hash
        return ''
    } )
    .replace( /\?(.*)$/, function( str, queryString ){
        var chunkList = queryString.split( Uri.chunkSep() )
        var query = {}
        chunkList.forEach( function( chunk ){
            var values = chunk.split( Uri.valueSep() ).map( decodeURIComponent )
            var key = values.shift()
            query[ key ] = values
        }.bind(this) )
        config.query = query
        return ''
    } )
    .replace( /^([^\/:@]+):/, function( str, scheme ){
        config.scheme = scheme
        return ''
    } )
    .replace( /^(\/\/[^\/]*)/, function( str, origin ){
        config.host = origin
        .replace( /:(\d+)$/, function( str, port ){
            config.port = port
            return ''
        } )
        .replace( /^([^@]+)@/, function( str, auth ){
            var pair = auth.split( ':' )
            config.login = pair[0]
            config.password = pair[1]
            return ''
        } )
        .replace( /^\/\//, function( str, port ){
            config.slashes = true
            return ''
        } )
        return ''
    } )
    
    return this( config )
} )

;//../../jin/state/url/jin_state_url.env=web.jam.js?=HOL7MC8O
$jin.klass( '$jin_state_url' )

$jin.prop(
{   name: '$jin_state_url_href'
,   pull: function( ){
        return document.location.search + document.location.hash
    }
,   put: String
} )

$jin.prop(
{   name: '$jin_state_url_hash'
,   pull: function( ){
        var href = this.href().replace( /#/, '?' )
        return $jin.uri.parse( href ).query()
    }
} )

$jin.prop(
{   name: '$jin_state_url_listener'
,   pull: function( ){
        return setInterval( function( ){
            $jin.state.url.href( document.location.search + document.location.hash )
        }, 50 )
    }
} )

$jin.prop.hash(
{   name: '$jin_state_url_item'
,   pull: function( key ){
        this.listener()
        var val = this.hash()[ key ]
        return ( val == null ) ? null : val
    }
,   put: function( key, value ){
        throw new Error( 'Not implemented yet' )
    }
} )

;//../../jin/doc/jin_doc.jam.js?=HOIJYBO8
$jin.klass( '$jin_dom', '$jin_doc' )

$jin.method( '$jin_dom_exec', function $jin_doc_exec( node ){
	return this.$jin_dom_exec( arguments.length ? node : window.document )
} )

$jin.method( function $jin_doc__findById( id ){
	return $jin.dom( this.nativeNode().getElementById( id ) )
} )

;//../../jin/dnd/jin_dnd_event.env=web.jam.js?=HNXKT1X4
$jin.klass( '$jin_dom_event', '$jin_dnd_event' )

$jin.method( function $jin_dnd_event__view( dom, x, y ){
	if( dom ){
		dom = $jin.dom( dom )
	} else {
		dom = $jin.doc().makeElement( 'div' )
		dom.nativeNode().style.background = 'red'
		dom.nativeNode().style.visibility = 'hidden'
		dom.parent( document.body )
	}
	
	try {
		this.transfer().setDragImage( dom.nativeNode(), x, y )
	} catch( e ){ }
	
	return this
} )

;//../../jin/dnd/jin_dnd_onEnd.env=web.jam.js?=HNXKT1X4
$jin.klass( '$jin_dom_event', '$jin_dnd_onEnd' )

$jin.method( '$jin_event_type', function $jin_dnd_onEnd_type( ){
    return 'dragleave'
} )

;//../../jin/dnd/jin_dnd_onDrag.env=web.jam.js?=HNYQPL0O
$jin.klass( '$jin_dom_event', '$jin_dnd_onDrag' )

$jin.method( '$jin_event_type', function $jin_dnd_onDrag_type( ){
    return 'drag'
} )

;//../../jin/dnd/jin_dnd_onDrop.env=web.jam.js?=HNXKT1X4
$jin.klass( '$jin_dnd_event', '$jin_dnd_onDrop' )

$jin.method( '$jin_event_type', function $jin_dnd_onDrop_type( ){
    return 'drop'
} )

;//../../jin/dnd/jin_dnd_onOver.env=web.jam.js?=HNXKT2OW
$jin.klass( '$jin_dom_event', '$jin_dnd_onOver' )

$jin.method( '$jin_event_type', function $jin_dnd_onOver_type( ){
    return 'dragover'
} )

;//../../jin/dnd/jin_dnd_onEnter.env=web.jam.js?=HNYQP06O
$jin.klass( '$jin_dom_event', '$jin_dnd_onEnter' )

$jin.method( '$jin_event_type', function $jin_dnd_onEnter_type( ){
    return 'dragenter'
} )

;//../../jin/dnd/jin_dnd_onLeave.env=web.jam.js?=HNXKT2OW
$jin.klass( '$jin_dom_event', '$jin_dnd_onLeave' )

$jin.method( '$jin_event_type', function $jin_dnd_onLeave_type( ){
    return 'dragleave'
} )

;//../../jin/dnd/jin_dnd_onStart.env=web.jam.js?=HOONKC6O
$jin.klass( '$jin_dnd_event', '$jin_dnd_onStart' )

$jin.method( '$jin_event_type', function $jin_dnd_onStart_type( ){
    return 'dragstart'
} )

$jin.method( '$jin_dom_event_listen', function $jin_dnd_onStart_listen( crier, handler ){
	var crier = $jin.dom( crier )
	
	crier.nativeNode().draggable = true
	
    var onStart = crier.listen( 'dragstart', function( event ){ handler( $jin.dnd.onStart( event ) ) } )
    var onSelectStart = crier.listen( 'selectstart', function( event ){
		event.target().dragDrop()
		event.catched( true )
	} )
	
	return { destroy: function(){
		onStart.destroy()
		onSelectStart.destroy()
		crier.nativeNode().draggable = false
	}}
} )

;//../../jin/todo/jin_todo.jam.js?=HOL7MC8O
$jin.klass( '$jin_model_klass', '$jin_todo' )

$jin.method( function $jin_todo__view( ){
    return $jin.todo.view
} )

$jin.prop(
{   name: '$jin_todo__task'
,   pull: function( ){
        return $jin.task( $jin.state.url.item( 'task' ) || 1 )
    }
})

$jin.model.list(
{   name: '$jin_todo__list'
,   parseItem: $jin.task
,   def: '1,2,3'
} )


;//../../jin/todo/jin_todo_view.jam.js?=HOOQXJM0
$jin.klass( '$jin_view', '$jin_todo_view' )

$jin.property.define( '$jin_todo_view__todo', $jin.todo )

$jin.prop(
{   name: '$jin_todo_view__details'
,   pull: function( oldView ){
        var task = this.todo().task()
        var view = task.viewDetails()( this.id() + ';' + 'details' )
		view.task( task )
        return view
    }
} )

$jin.prop(
{   name: '$jin_todo_view__items'
,   pull: function( oldItems ){
        
		var todo = this.todo()
        var models = todo.list()
		
        var newItems = models.map( function( item, index ){
			var view = item.viewItem()( this.id() + ';' + 'item=' + index )
			view.task( item )
			view.list( todo )
            return view
        }.bind( this ) )
		
        return newItems
    }
} )

$jin.prop(
{   name: '$jin_todo_view__ballance'
,   pull: function( oldView ){
        return 0.3
    }
,	put: Number
} )

$jin.model.prop(
{   name: '$jin_todo_view__shrinkDetails'
,   parse: Number
,	def: 0.5
} )

$jin.prop(
{   name: '$jin_todo_view__shrinkList'
,   pull: function( oldView ){
        return 1
    }
,	put: Number
} )


$jin.method( function $jin_todo_view__onResizeStart( event ){
	event.view( null )
	event.data({ view: this.id(), action: 'resize' })
} )

$jin.method( function $jin_todo_view__onResizeMove( event ){
	//var data = event.data()
	//if( data.view !== this.id() ) return
	//if( data.action !== 'resize' ) return
	
	var k = event.raw().x / this.raw().offsetWidth
	k = Math.min( 0.9, Math.max( 0.1, k ) )
	this.shrinkDetails( ( 1 - k ) / k )
	
	event.catched( true )
} )
