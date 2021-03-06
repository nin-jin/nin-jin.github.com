with( this ){
;// ../../jin.jam.js
this.$jin = {}

;// ../../value/jin-value.jam.js
this.$jin.value = function $jin_value( value ){
    
    var func = function $jin_value_instance( ){
        return func.$jin_value
    }
    
    func.$jin_value = value
    
    return func
}

;// ../../root/jin_root.jam.js
this.$jin.root = $jin.value( this )

;// ../../trait/jin_trait.jam.js
this.$jin.trait = function( name ){
    
    var trait = $jin.glob( name )
    if( trait ) return trait
    
    trait = $jin.trait.make( name )
    
    return $jin.glob( name, trait )
}

this.$jin.trait.make = function( name ){
    
    var trait = function jin_trait_instance( ){
		return trait.exec.apply( trait, arguments )
    }

    trait.displayName = name
    
    return trait
}

;// ../../glob/jin_glob.jam.js
$jin.glob = function $jin_glob( name, value ){
    var keyList = name.split( '.' )
    var current = $jin.root()
    var currentName = ''
    
    while( keyList.length > 1 ){
        var key = keyList.shift() || 'prototype'
        currentName += ( currentName ? '.' : '' ) + ( key === 'prototype' ? '' : key )
        
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

;// ../../definer/jin-definer.jam.js
$jin.definer = function( path, definer ){
	
	var wrapper = function( defines, arg ){
		if( arguments.length > 1 ){
			if( defines == null ) return function( path ){
				return definer( path, arg )
			}
			return definer.apply( null, arguments )
		} else {
			if( typeof defines === 'function' ) defines = new defines
			for( var path in defines ){
				definer( path, defines[ path ] )
			}
		}
	}
	
	return $jin.glob( path, wrapper )
}

$jin.definer( '$jin.definer', $jin.definer )

;// ../../func/jin_func.jam.js
this.$jin.func = {}

this.$jin.func.make = function( name ){
    var func = function( ){
        return func.execute( this, arguments )
    }
    return func
}

this.$jin.func.name = function( func, name ){
    if( arguments.length > 1 ) return func.$jin_func_name = name
    return func.name
    || func.$jin_func_name
    || func.toString().match( /^\s*function\s*([$\w]*)\s*\(/ )[ 1 ]
}

this.$jin.func.usages = function( func ){
	if( func.jin_func_usages ) return func.jin_func_usages
	var found = {}
	Object.toString.call( func ).replace( /\$[a-z][a-z0-9]+(\.[a-z][a-z0-9]*)+/g, function( token ){
		found[ token ] = true
	})
	return func.jin_func_usages = Object.keys( found )
}

;// ../../method/jin_method.jam.js
$jin.definer({ '$jin.method': function( ){ // arguments: resolveName*, path, func
    var resolveList = [].slice.call( arguments )
    var func = resolveList.pop()
    
	var name = resolveList.pop()
	if( !name ) throw new Error( 'Not defined method name' )
	
	if( !func.jin_method_resolves ){
		func.jin_method_resolves = resolveList
		Object.toString.call( func ).replace( /['"](\$[.\w]+)['"]/g, function( str, token ){
			if( resolveList.indexOf( token ) >= 0 ) return str
			resolveList.push( token )
		})
	}
	
    var funcName = func.displayName
    if( !funcName ) funcName = func.displayName = name
    //throw new Error( 'displayName is not defined in [' + func + ']' )
    
    var nameList = name.split( '.' )
    var methodName = nameList.pop()
    var ownerPath = nameList.join( '.' )
    var owner = $jin.trait( ownerPath )
    var slaveList = owner.jin_mixin_slaveList
    
    owner[ funcName ]= func
    
    if( slaveList ) slaveList.forEach( function( slavePath ){
        $jin.method( slavePath + '.' + methodName, func )
    })
    
    var existFunc = owner[ methodName ]
    checkConflict: {
        
        if( existFunc === void 0 ) break checkConflict
        
        if( typeof existFunc !== 'function' ){
            throw new Error( 'Can not redefine [' + existFunc + '] by [' + funcName + ']' )
        }
        
        if( func === existFunc ) return existFunc
        
        if( !existFunc.displayName ) break checkConflict
        
        func = $jin.method.merge( existFunc, func, name )
    }
    
    owner[ methodName ]= func
    
    if( slaveList ) slaveList.forEach( function( slavePath ){
        $jin.method( slavePath + '.' + methodName, func )
    })
    
    return func
}})

$jin.method.merge = function $jin_method_merge( left, right, name ){
    var leftConflicts = left.jin_method_conflicts || [ left ]
    var rightConflicts = right.jin_method_conflicts || [ right ]
    var conflictList = leftConflicts.concat( rightConflicts )

    var leftResolves = left.jin_method_resolves || []
    var rightResolves = right.jin_method_resolves || []
    var resolveList = leftResolves.concat( rightResolves )
    
    conflictList = conflictList.filter( function( conflict ){
        return !~resolveList.indexOf( conflict.displayName )
    })
    
    if( conflictList.length === 0 ){
        throw new Error( 'Can not resolve conflict ' + name + ' because cyrcullar resolving' )
    } else if( conflictList.length === 1 ){
        var func = conflictList[0]
    } else if( conflictList.length > 1 ){
        var func = $jin.func.make( name )
        func.execute = function( ){
            var conflictNames = conflictList.reduce( function( names, func ){
                var name = func.displayName
				if( names.indexOf( name ) >= 0 ) return names
				
				names.push( name )
				return names
            }, [] )
            throw new Error( "Conflict in [" + name + "] by [" + conflictNames + "]" )
        }
        func.displayName = name
        func.jin_method_conflicts = conflictList
    }
    
    func.jin_method_resolves = resolveList
    
    return func
}

;// ../../mixin/jin_mixin.jam.js
$jin.definer({ '$jin.mixin': function( targetPath, sourcePathList ){
    var trait = $jin.mixin.object( targetPath, sourcePathList )
    
	sourcePathList = sourcePathList.map( function( sourcePath ){
		return sourcePath + '.'
	})
	
    $jin.mixin.object( targetPath + '.', sourcePathList )
    
    return trait
}})

$jin.definer({ '$jin.mixin.object': function( targetPath, sourcePathList ){
    var target = $jin.trait( targetPath )
    
    sourcePathList.forEach( function( sourcePath ){
        var source = $jin.trait( sourcePath )
		
        if( !source.jin_mixin_slaveList ) source.jin_mixin_slaveList = []
        if( source.jin_mixin_slaveList.indexOf( targetPath ) >= 0 ) return
        
        for( var key in source ){
            var func = source[ key ]
			if( key.charAt(0) === '_' ) continue
			if( typeof func === 'function' ){
				if( !func.displayName ) func.displayName = sourcePath + '.' + key
			} else {
                if(!( key in target )) target[ key ] = void 0
                continue
            }
            
            var methodName = func.displayName.replace( /^([$\w]*\.)+/, '' )
			$jin.method( targetPath + '.' + methodName, func )
        }
		
        source.jin_mixin_slaveList.push( targetPath )
    })
    
    return target
}})

;// ../../konst/jin-konst.jam.js
$jin.definer({ '$jin.konst': function( path, gen ){
	$jin.method( path, function jin_konst_wrapper(){
		var key = '_' + path
		return this[ key ] || ( this[ key ] = gen.call( this ) )
	})
}})

;// ../../property/jin_property.jam.js
$jin.definer({ '$jin.property': function( ){ // arguments: resolveName*, path, filter
    var resolveList = [].slice.call( arguments )
    var filter = resolveList.pop()
    var name = resolveList.pop()
    var fieldName = '_' + name
	
	if( filter ){
		var property = function( next ){
			var prev = this[ fieldName ]
			if( arguments.length ){
				if( next === prev ) return this
				if( next === void 0 ){
					this[ fieldName ] = next
				} else {
					this[ fieldName ] = filter.call( this, next )
				}
				return this
			} else {
				if( prev === void 0 ){
					return this[ fieldName ] = filter.call( this )
				} else {
					return prev
				}
			}
		}
	} else {
		var property = function( value ){
			if( arguments.length ){
				this[ fieldName ] = value
				return this
			} else {
				return this[ fieldName ]
			}
		}
	}
    
    property.jin_method_resolves = filter && filter.jin_method_resolves || resolveList
    
    return $jin.method( name, property )
}})

$jin.definer({ '$jin.property.hash': function( path, config ){
	var fieldName = '_' + path
	var pull = config.pull || config.sync
	var put = config.put || config.sync
	var push = config.push
	
	var propHash = function( key, value ){
		var storage = this[ fieldName ]
		if( !storage ) storage = this[ fieldName ] = {}
		if( arguments.length > 1 ){
			var value2 = put ? put.call( this, key, value ) : value
			if( value2 === void 0 ) delete storage[ key ]
			else storage[ key ] = value2
			return this
		} else if( arguments.length ) {
			if( typeof key === 'object' ){
				for( var k in key ){
					propHash.call( this, k, key[ k ] )
				}
				return this
			}
			var value2 = storage[ key ]
			if( pull && value2 === void 0 ) value2 = storage[ key ] = pull.call( this, key )
			return value2
		} else {
			return storage
		}
	}
	
	return $jin.method( path, propHash )
}})

;// ../../klass/jin_klass.jam.js
$jin.definer({ '$jin.klass': function( path, mixins ){
    mixins.unshift( '$jin.klass' )
    var klass = $jin.mixin( path, mixins )
	return klass
}})

$jin.konst( '$jin.klass.klass', function( ){
	var klass = function Instance( ){ }
	klass.prototype = this.prototype
	return klass
})

$jin.method( '$jin.klass.exec', function( ){
	var klass = this.klass()
	var obj = new klass
	obj.init.apply( obj, arguments )
	return obj
} )

$jin.property( '$jin.klass.descendantClasses', function( ){ // TODO: use atoms!
	var paths = this.jin_mixin_slaveList || []
	var lists = paths.map( function( path ){
		var klass = $jin.glob( path )
		return klass.descendantClasses()
	} )
	return [].concat.apply( [ this ], lists )
} )

$jin.method( '$jin.klass.subClass', function( fields ){
	var klass = $jin.trait.make()
	for( var key in this ) klass[ key ] = this[ key ]
	var proto = klass.prototype = Object.create( this.prototype )
	for( var key in fields ) proto[ key ] = fields[ key ]
	return klass
} )

$jin.method( '$jin.klass.id', function( ){
    return this.displayName || this.name
} )

$jin.method( '$jin.klass.toString', function( ){
    return this.id()
} )

$jin.method( '$jin.klass..init', function( json ){
    return this.json( json )
} )

$jin.property( '$jin.klass..entangleList', Array )
$jin.method( '$jin.klass..entangle', function( value ){
    this.entangleList().push( value )
    return value
} )

$jin.method( '$jin.klass..destroy', function( ){
    
    this.entangleList().forEach( function( entangle ){
       entangle.destroy()
    } )
    
    for( var key in this ){
        delete this[ key ]
    }
    
    return this
} )

$jin.method( '$jin.klass..json', function( json ){
    if( !arguments.length ) return null
    
    if( !json ) return this
    
    for( var key in json ){
        this[ key ]( json[ key ] )
    }
    
    return this
} )

$jin.property( '$jin.klass..methodList', Object )
$jin.method( '$jin.klass..method', function( name ){
    var hash = this.methodHash()
    
    var method = hash[ '_' + name ]
    if( method ) return method
    
    method = function( ){
        return method.content[ method.methodName ].call( method.content, arguments )
    }
    
    return hash[ '_' + name ] = method
} )

;// ../../pool/jin-pool.jam.js
/**
 * Pool trait.
 * http://en.wikipedia.org/wiki/Object_pool_pattern
 */
$jin.klass({ '$jin.pool': [] })

/**
 * Storage of waiting instances
 */
$jin.property({ '$jin.pool.pool': function( ){
	return []
}})

/**
 * Reinitialize and return object from pool.
 * Otherwise create new one.
 */
$jin.method({ '$jin.pool.exec': function( ){
	var obj = this.pool().pop()
	if( !obj ) return this['$jin.klass.exec'].apply( this, arguments )
	
	obj.init.apply( obj, arguments )
	return obj
}})

/**
 * Store instance in pool instead destroying
 */
$jin.method({ '$jin.pool..destroy': function( ){
	this['$jin.klass..destroy']
	this.constructor.pool().push( this )
	return this
}})

;// ../../registry/jin_registry.jam.js
/**
 * Registry of singletons trait.
 * http://en.wikipedia.org/wiki/Multiton_pattern
 * Can be mixed with jin-pool trait.
 */

/**
 * Hash map of created instances.
 */
$jin.property.hash( '$jin.registry.storage', {} )

/**
 * Select instance from registry.
 * Otherwise creats new one.
 */
$jin.method( '$jin.klass.exec', '$jin.registry.exec', function( id ){
	if( !arguments.length ) return this['$jin.klass.exec']()
	
	if( id instanceof this ) return id
	id = String( id )
	
    var obj = id; while( typeof obj === 'string' ) obj = this.storage( obj )
	
    if( obj ) return obj
    
	var make = this['$jin.pool.exec'] || this['$jin.klass.exec']
	
    var newObj = make.call( this, { id: id } )
    var id2 = String( newObj.id() )
    
	if( id !== id2 ){
		var obj = this.storage( id2 )
		if( obj ) return obj
		this.storage( id, id2 )
	}
	
	this.storage( id2, newObj )
	
    return newObj
} )

/**
 * Identifier of instance.
 */
$jin.property( '$jin.registry..id', String )

/**
 * Removes from registry on destroy.
 */
$jin.method( '$jin.klass..destroy', '$jin.registry..destroy', function( ){
	this.constructor.storage( this.id(), null )
	var destroy = this['$jin.pool..destroy'] || this['$jin.klass..destroy']
	destroy.call( this )
} )

/**
 * Identifier as primitive representation.
 */
$jin.method( '$jin.klass..toString', '$jin.registry..toString', function( ){
    return this.id()
} )

;// ../../wrapper/jin_wrapper.jam.js
$jin.klass({ '$jin.wrapper': [] })

$jin.property( '$jin.wrapper..raw', null )

$jin.method( '$jin.klass.exec', '$jin.wrapper.exec', function( obj ){
    if( obj instanceof this ) return obj
    if( obj.raw ) obj = obj.raw()
    return this['$jin.klass.exec']( obj )
} )

$jin.method( '$jin.klass..init', '$jin.wrapper..init', function( obj ){
    this.raw( obj )
    return this
} )

;// ../../error/jin-error.jam.js
$jin.definer({ '$jin.error': function( path, traits ){
	var error = $jin.trait( path )
	error.prototype = new Error
	error.prototype.constructor = error
	$jin.mixin( path, [ '$jin.error' ] )	
}})

$jin.mixin({ '$jin.error': [ '$jin.wrapper' ] })

$jin.method({ '$jin.error.exec': function( message ){
	return this['$jin.wrapper.exec']( new Error( message ) )
}})

$jin.method({ '$jin.error..init': function( error ){
	this['$jin.wrapper..init']( error )
	this.name = this.constructor.id()
	this.message = error.message
	this.stack = error.stack
	return this
}})

;// ../../defer/jin_defer.js
$jin.defer = function( func ){
    $jin.defer.queue.push( func )
    if( !$jin.defer.scheduled ) $jin.defer.schedule()
    return { destroy: function(){
        var index = $jin.defer.queue.indexOf( func )
        if( ~index ) $jin.defer.queue.splice( index, 1 )
    }}
}

$jin.defer.queue = []
$jin.defer.scheduled = false

$jin.defer.schedule = function( ){
	if( typeof postMesasge === 'function' ) postMessage( '$jin.defer', document.location.href )
	else $jin.schedule( 0, $jin.defer.check )
	$jin.defer.scheduled = true
}

$jin.defer.check = function( event ){
	if( event ){
		if( event.data !== '$jin.defer' ) return
	}
	
	while( $jin.defer.queue.length ){
		var queue = $jin.defer.queue
		$jin.defer.queue = []
		
		queue.forEach(function handlerIterator( handler ){
			handler()
		})
	}
	
	$jin.defer.scheduled = false
}

if( typeof addEventListener === 'function' ) addEventListener( 'message', $jin.defer.check, true )

$jin.defer.callback = function( func ){
	var wrapper = function $jin_defer_callback_instance(){
		$jin.defer.scheduled = true
		try {
			return func.apply( this, arguments )
		} finally {
			$jin.defer.check()
		}
	}
	if( $jin.sync2async ) wrapper = $jin.sync2async( wrapper )
	return wrapper
}

;// ../../makeId/jin_makeId.jam.js
$jin.makeId = function( prefix ){
	var seeds = $jin.makeId.seeds 
	var seed = seeds[ prefix ] || 0
	seeds[ prefix ] = seed + 1
    return prefix + ':' + seed
}

$jin.makeId.seeds = {}

;// ../../log/jin-log.env=web.jam.js
$jin.method({ '$jin.log' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.log.apply( console, arguments )
}})

$jin.method({ '$jin.info' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.info.apply( console, arguments )
}})

$jin.method({ '$jin.warn' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.warn.apply( console, arguments )
}})

$jin.method({ '$jin.log.error' : function( error ){
	if( typeof console === 'undefined' ) return
	
	if( error.jin_log_isLogged ) return
	
	var message = error.stack || error
	
	if( console.exception ) console.exception( error )
	else if( console.error ) console.error( message )
	else if( console.log ) console.log( message )
	
	error.jin_log_isLogged = true
}})

$jin.method({ '$jin.log.error.ignore' : function( error ){
	error.jin_log_isLogged = true
	return error
}})

;// ../../schedule/jin_schedule.jam.js
$jin.method( '$jin.schedule', function( delay, handler ){
    var id = setTimeout( $jin.defer.callback( handler ), delay )
    return { destroy: function( ){
        clearTimeout( id )
    } }
} )

;// ../../atom/jin-atom.jam.js
$jin.error({ '$jin.atom.wait': [] })

$jin.klass({ '$jin.atom': [] })

$jin.atom.current = null
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._config', void 0 )
$jin.glob( '$jin.atom.._value', void 0 )
$jin.glob( '$jin.atom.._error', void 0 )
$jin.glob( '$jin.atom.._slice', 0 )
$jin.glob( '$jin.atom.._pulled', false )
$jin.glob( '$jin.atom.._slavesCount', 0 )
$jin.glob( '$jin.atom.._isScheduled', false )

$jin.method({ '$jin.atom.induce': function( ){
	var scheduled = this.scheduled

	scheduled: for( var i = 0; i < scheduled.length; ++i ){
		var queue = scheduled[i]
		if( !queue ) continue
		scheduled[i] = null
		
		for( var j = 0; j < queue.length; ++j ){
			var atom = queue[ j ]
			if( !atom ) continue
			if( !atom._isScheduled ) continue
			
			atom.pull()
			
			i = -1
		}
	}

	this._deferred = null
}})

$jin.method({ '$jin.atom.schedule': function( ){
	if( this._deferred ) return

	this._deferred = $jin.defer( this.induce.bind( this ) )
}})

$jin.method({ '$jin.atom.bound': function( handler ){
	var slave = this.current
	this.current = null
	handler()
	this.current = slave
	return this
}})

$jin.method({ '$jin.atom..init': function jin_atom__init( config ){
	'$jin.klass..init'
	this._id = $jin.makeId( '$jin.atom' )
	this._config = config
	this._value = config.value
	this._error = config.error
	this._slaves = {}
	this._masters = {}
}})

$jin.method({ '$jin.atom..destroy': function( ){
	this.disleadAll()
	this.disobeyAll()
	return this['$jin.klass..destroy']()
}})

$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

$jin.method({ '$jin.atom..get': function( ){
	var value = this._value
	if( this._config.pull && ( this._isScheduled || ( value === void 0 ) ) ) value = this.pull()

	var slave = this.constructor.current
	if( slave ){
		if( slave === this ) throw new Error( 'Circular dependency of atoms!' )
		slave.obey( this )
		this.lead( slave )
	}
	
	if( this._error ) throw this._error
	
	return value
}})

$jin.method({ '$jin.atom..valueOf': function( ){
	return this.get()
}})

$jin.method({ '$jin.atom..pull': function( ){
	var config = this._config
	if( !config.pull ) return this._value

	this._isScheduled = false
	
	this._error = void 0
	
	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	var prevCurrent = this.constructor.current
	this.constructor.current = this
	try {
		var value = config.pull.call( config.context, this._value )
		this.constructor.current = null
		this.put( value )
	} catch( error ){
		this.fail( error )
	}
	this.constructor.current = prevCurrent
	
	this._pulled = true
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this._value
}})

$jin.method({ '$jin.atom..put': function( next ){
	var slave = this.constructor.current
	this.constructor.current = null
	
	var config = this._config
	var merge = config.merge
	if( merge ){
		var context = config.context
		var prev = this._value
		next = merge.call( context, next, prev )
	}
	
	this.value( next )
	this._error = void 0
	this._pulled = false
	
	this.constructor.current = slave
	
	return this
}})

$jin.method({ '$jin.atom..fail': function( error ){
	this._error = error
	this.value( null )
	return this
}})

$jin.method({ '$jin.atom..mutate': function( mutator ){
	var context = this._config.context
	var prev = this._value
	var atom = this
	
	this.constructor.bound( function mutate( ){
		atom.put( mutator.call( context, prev ) )
	})
	
	return this
}})

$jin.method({ '$jin.atom..error': function( next ){
	if( arguments.length ) throw new Error( 'Property (error) is read only, use (fail) method' )
	return this._error
}})

$jin.method({ '$jin.atom..value': function( next ){
	var prev = this._value

	if( !arguments.length ) return prev

	if( next === prev && !this._error ) return this

	this._value = next
	
	var config = this._config
	var context = config.context
	
	var error = this._error
	if( error ){
		var fail = config.fail
		if( fail ){
			fail.call( context, error, prev )
		} else if( !this._slavesCount ){
			if(!( error instanceof this.constructor.wait )){
				$jin.log.error( error )
			}
		}
	} else {
		var push = config.push
		if( push ){
			push.call( context, next, prev )
		}
	}

	this.notify()

	return this
}})

$jin.method({ '$jin.atom..defined': function( ){
	return ( this._value !== void 0 )
}})

$jin.method({ '$jin.atom..slice': function( ){
	return this._slice
}})

$jin.method({ '$jin.atom..notify': function( ){
	var slaveExclude = this.constructor.current
	
	var slaves = this._slaves
	for( var id in slaves ){
		var slave = slaves[ id ]
		
		if( !slave ) continue
		if( slave === slaveExclude ) continue
		
		slave.update( this )
	}

	return this
}})

$jin.method({ '$jin.atom..update': function( ){
	if( this._isScheduled ) return
	
	var slice = this._slice

	var queue = this.constructor.scheduled[ slice ]
	if( !queue ) queue = this.constructor.scheduled[ slice ] = []

	queue.push( this )
	this._isScheduled = true

	this.constructor.schedule()

	return this
}})

$jin.method({ '$jin.atom..lead': function( slave ){
	var id = slave.id()
	
	var slaves = this._slaves
	if( !slaves[ id ] ){
		slaves[ id ] = slave
		++ this._slavesCount
	}

	return this
}})

$jin.method({ '$jin.atom..obey': function( master ){
	var id = master.id()
	
	this._masters[ id ] = master

	var masterSlice = master.slice()
	if( masterSlice >= this._slice ) this._slice = masterSlice + 1;

	return this
}})

$jin.method({ '$jin.atom..dislead': function( slave ){
	var id = slave.id()
	
	var slaves = this._slaves
	if( slaves[ id ] ){
		slaves[ id ] = void 0
		if( !-- this._slavesCount ) this.reap()
	}

	return this
}})

$jin.method({ '$jin.atom..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

$jin.method({ '$jin.atom..disleadAll': function( ){
	var slaves = this._slaves
	this._slaves = {}
	this._slavesCount = 0
	for( var id in slaves ){
		var slave = slaves[ id ]
		if( !slave ) continue
		
		slave.disobey( this )
	}
	this.reap()
}})

$jin.method({ '$jin.atom..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		var master = masters[ id ]
		if( !master ) continue
		
		master.dislead( this )
	}
	this._slice = 0
}})

$jin.method({ '$jin.atom..reap': function( ){
	if( this._config.push ) return this
	if( !this._pulled ) return this
	
	$jin.defer( function jin_atom_defferedReap( ){
		if( this._slavesCount ) return
		this.disobeyAll()
		this._value = void 0
		this._error = void 0
		this._slice = 0
	}.bind( this ))
	
	return this
}})

;// ../../atom/jin-atom_logs.jam.js
$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin({ '$jin.atom': [ '$jin.atom.logging' ] })
}})

$jin.method({ '$jin.atom.logging..notify': function( ){
	var ctor = this.constructor

	ctor.log().push([ this._config.name || this._id, this._value, this._masters ])

	if( !ctor._deferedLogging ){
		ctor._deferedLogging = $jin.schedule( 0, function defferedLogging( ){
			ctor._deferedLogging = null
			if( console.groupCollapsed ) console.groupCollapsed('$jin.atom.log')
			ctor.log().forEach( function jin_atom_defferedLog( row ){
				$jin.log.apply( $jin, row )
			} )
			if( console.groupEnd ) console.groupEnd('$jin.atom.log')
			ctor.log( [] )
		} )
	}

	return this[ '$jin.atom..notify' ]()
}})

$jin.property({ '$jin.atom.logging.log': function( ){
	return []
}})

;// ../../atom/jin-atom_promise.jam.js
$jin.method({ '$jin.atom..then': function( done, fail ){
	if( this._error ){
		if( fail ) fail( this._error )
		return this
	}
	
	if( this._value ){
		done( this._value )
		return this
	}
	
	var self = this
	var listener = {
		id: $jin.value( $jin.makeId( $jin.func.name( done ) ) ),
		update: function( ){
			self.dislead( listener )
			
			var error = self.error()
			if( error !== void 0 ) return fail && fail( error )
			
			var value = self.value()
			if( value !== void 0 ) return done( value )
		}
	}
	this.lead( listener )
	
	return this
}})

$jin.method({ '$jin.atom..catch': function( fail ){
	if( this._error ){
		fail( this._error )
		return this
	}
	
	var self = this
	var listener = {
		id: $jin.value( $jin.makeId( $jin.func.name( fail ) ) ),
		update: function( ){
			self.dislead( listener )
			
			var error = self.error()
			if( error !== void 0 ) return fail( error )
		}
	}
	this.lead( listener )
	
	return this
}})

;// ../../atom/prop/jin-atom-prop.jam.js
$jin.definer({ '$jin.atom.prop': function( path, config ){
    
	var pull = config.pull
	if( pull ) pull.displayName = path + '.pull'

	var put = config.put
	if( put ) put.displayName = path + '.put'

	var push = config.push
	if( push ) push.displayName = path + '.push'

	var merge = config.merge
	if( merge ) merge.displayName = path + '.merge'

    var prop = function jin_atom_prop_accessor( next ){
        var atom = propAtom.call( this )
        if( !arguments.length ) return atom.get()
        
		var prev = atom.value()
		var next2 = merge ? merge.call( this, next, prev ) : next
		
		var next3 = ( put && ( next2 !== prev ) ) ? put.call( this, next2, prev ) : next2
		
        atom.put( next3 )
		
        return this
    }
    
    var fieldName = '_' + path
    
    var propAtom = function jin_atom_prop_stor( ){
        var atom = this[ fieldName ]
        
        if( atom ) return atom
        
        return this[ fieldName ] = new $jin.atom(
		{	name: path /*+ ':' + this.id()*/
		,	context: this
		,	pull: pull
		,	push: push
		,	merge: merge
		,	value: config.value
		} )
    }

	prop.jin_method_resolves = config.resolves || []
	propAtom.jin_method_resolves = prop.jin_method_resolves.map( function( path ){
		return path + '_atom'
	} )

	$jin.method( path, prop )
	$jin.method( path + '_atom', propAtom )

    return prop
}})

$jin.definer({ '$jin.atom.prop.list': function( path, config ){
	if( !config.merge ) config.merge = function( next, prev ){
		if( !prev || !next ) return next
		
		if( next.length !== prev.length ) return next
		
		for( var i = 0; i < next.length; ++i ){
			if( next[ i ] === prev[ i ] ) continue
			return next
		}
		
		return prev
	}
	
	$jin.atom.prop( path, config )
	
	var propName = path.replace( /([$\w]*\.)+/, '' )
	
	$jin.method( path + '_add', function( newItems ){
        var items = this[propName]() || []
        
		if( config.merge ) newItems = config.merge.call( this, newItems )
		
        newItems = newItems.filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
	} )
	
	$jin.method( path + '_drop', function( oldItems ){
		var items = this[propName]() || []
        
		if( config.merge ) oldItems = config.merge.call( this, oldItems )
		
        items = items.filter( function( item ){
            return !~oldItems.indexOf( item )
        })
        
        this[propName]( items )
		
		return this
    } )
	
	$jin.method( path + '_has', function( item ){
		if( config.merge ) item = config.merge.call( this, [ item ] )[ 0 ]
		var items = this[propName]()
		if( !items ) return items
        
        return items.indexOf( item ) >= 0 
    } )
	
}})

$jin.definer({ '$jin.atom.prop.hash': function( path, config ){
    
	var pull = config.pull
	var put = config.put
	var push = config.push
	var merge = config.merge
	
    var prop = function( key, next ){
        var atom = prop.atom( this, key )
        
        if( arguments.length < 2 ) return atom.get()
        
		var prev = atom.value()
		if( merge ) next = merge.call( this, key, next, prev )
		
        if( put && ( next !== prev ) ) next = put.call( this, key, next, prev )
		atom.value( next )
    }
    
    var fieldName = fieldName = '_' + path
    
    prop.atomHash = function( context ){
        var atomHash = context[ fieldName ]
        if( !atomHash ) atomHash = context[ fieldName ] = {}
        return atomHash
    }
    
    prop.atom = function( context, key ){
        var atomHash = prop.atomHash( context )
        
        var atom = atomHash[ key ]
        if( atom ) return atom
        
        return atomHash[ key ] = new $jin.atom(
		{	name: path/* + ':' + this.id()*/
		,	context: context
		,	pull: pull && function( prev ){
				return pull.call( context, key, prev )
			}
		,	push: push && function( next, prev ){
				return push.call( context, key, next, prev )
			}
		,	merge: merge
		} )
    }

	$jin.method( path, prop )

    return prop
}})

;// ../../state/jin_state.jam.js
//$jin.atom.prop.hash({ handler:  function $jin_state_item( key, value ){
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

;// ../../env/jin_env.jam.js
this.$jin.env = $jin.value( function(){ return this }() )

;// ../../alias/jin_alias.jam.js
$jin.alias = function( ){ // arguments: resolveName*, name, aliasedName
    var resolveList = [].slice.call( arguments )
    var aliasedName = String( resolveList.pop() )
    var name = String( resolveList.pop() )
    
    var alias = function( ){
        return this[ alias.$jin_alias_name ].apply( this, arguments )
    }
    
    alias.$jin_alias_name = aliasedName
    
    return $jin.method.apply( null, resolveList.concat([ name, alias ]) )
}

;// ../../listener/jin_listener.jam.js
$jin.klass({ '$jin.listener': [] })

$jin.property( '$jin.listener..crier', null )
$jin.property( '$jin.listener..eventName', String )
$jin.property( '$jin.listener..handler', null )

$jin.method( '$jin.listener..forget', function( ){
    this.crier().forget( this.eventName(), this.handler() )
    return this
} )

$jin.method( '$jin.klass..destroy', '$jin.listener..destroy', function( ){
    this.forget()
    this['$jin.klass..destroy']()
} )

;// ../../event/jin_event.jam.js
$jin.klass({ '$jin.event': [] })

$jin.property( '$jin.event_type', function( ){
    return String( this )
} )

$jin.method( '$jin.event.listen', function( crier, handler ){
	var ctor = this
	var wrapper = function( event ){
		return handler( ctor( event ) )
	}
    return crier.listen( this.type(), wrapper )
} )


$jin.property( '$jin.event..target', null )
$jin.property( '$jin.event..catched', Boolean )
    
$jin.property( '$jin.event..type', function( type ){
    if( arguments.length ) return String( type )
    return String( this.constructor )
} )

$jin.method( '$jin.event..scream', function( crier ){
    crier.scream( this )
    return this
} )

;// ../../support/jin_support.env=web.jam.js
$jin.property( '$jin.support.xmlModel', function( ){
    return ( window.DOMParser && window.XMLSerializer && window.XSLTProcessor ) ? 'w3c' : 'ms'
} )

$jin.property( '$jin.support.htmlModel', function( ){
    return document.createElement( 'html:div' ).namespaceURI !== void 0 ? 'w3c' : 'ms'
} )

$jin.property( '$jin.support.eventModel', function( ){
    return ( 'addEventListener' in document.createElement( 'div' ) ) ? 'w3c' : 'ms'
} )

$jin.property( '$jin.support.textModel', function( ){
    return ( 'createRange' in document ) ? 'w3c' : 'ms'
} )

;// ../../vector/jin_vector.jam.js
$jin.klass({ '$jin.vector': [ '$jin.wrapper' ] })

$jin.method( '$jin.vector..x', function( val ){
	if( !arguments.length ) return this.raw()[0]
	this.raw()[0] = val
	return this
} )

$jin.method( '$jin.vector..y', function( val ){
	if( !arguments.length ) return this.raw()[1]
	this.raw()[1] = val
	return this
} )

$jin.method( '$jin.vector..z', function( val ){
	if( !arguments.length ) return this.raw()[2]
	this.raw()[2] = val
	return this
} )

$jin.method( '$jin.vector.merge', function( merger, left, right ){
	left = $jin.vector( left ).raw()
	right = $jin.vector( right ).raw()
	
	var res = left.map( function( l, index ){
		var r = right[ index ]
		return merger( l, r )
	} )
	
	return $jin.vector( res )
} )

$jin.method( '$jin.vector..summ', function( right ){
	return $jin.vector.merge( function( a, b ){ return a + b }, this, right )
} )

;// ../../dom/event/jin_dom_event.env=web.jam.js
$jin.klass({ '$jin.dom.event': [ '$jin.wrapper', '$jin.event' ] })

$jin.property( '$jin.dom.event.bubbles', Boolean )
$jin.property( '$jin.dom.event.cancelable', Boolean )

$jin.method( '$jin.event.listen', '$jin.dom.event.listen', function( crier, handler ){
	crier = $jin.dom( crier )
    return this[ '$jin.event.listen' ]( crier, handler )
} )

$jin.method( '$jin.dom.event..nativeEvent', function( ){
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

$jin.method( '$jin.event..target', '$jin.dom.event..target', function( ){
    return $jin.dom( this.nativeEvent().target || this.nativeEvent().srcElement )
} )

$jin.method( '$jin.event..type', '$jin.dom.event..type', function( type ){
    var nativeEvent = this.nativeEvent()
    type = String( type )
    
    if( !arguments.length ){
        return nativeEvent.$jin_dom_event_type || nativeEvent.type
    }
    
    nativeEvent.initEvent( type, this.bubbles(), this.cancelable() )
    nativeEvent.$jin_dom_event_type= nativeEvent.type= type
    
    return this
} )

$jin.method( '$jin.dom.event..bubbles', function( bubbles ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.bubbles
    }
    
    nativeEvent.initEvent( this.type(), Boolean( bubbles ), this.cancelable() )
    
    return this
} )

$jin.method( '$jin.dom.event..cancelable', function( cancelable ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.cancelable
    }
    
    nativeEvent.initEvent( this.type(), this.bubbles(), Boolean( cancelable ) )
    
    return this
} )

$jin.method( '$jin.event..catched', '$jin.dom.event..catched', function( catched ){
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

$jin.method( '$jin.dom.event..keyCode', function( ){
    return this.nativeEvent().keyCode
} )

$jin.method( '$jin.dom.event..modCtrl', function( ){
	var nativeEvent = this.nativeEvent()
    return nativeEvent.ctrlKey || nativeEvent.metaKey
} )

$jin.method( '$jin.dom.event..modAlt', function( ){
    return this.nativeEvent().altKey
} )

$jin.method( '$jin.dom.event..modShift', function( ){
    return this.nativeEvent().shiftKey
} )

$jin.method( '$jin.dom.event..mouseButton', function( ){
    return this.nativeEvent().button
} )

$jin.method( '$jin.dom.event..transfer', function( ){
    return this.nativeEvent().dataTransfer
} )

$jin.property( '$jin.dom.event..data', function( data ){
	if( arguments.length ){
		var str = data ? JSON.stringify( data ) : data
		
		$jin.state.local.item( '$jin.dom.event.data', str )
		
		if( str ){
			try {
				this.transfer().setData( 'text/json', str )
			} catch( error ){
				this.transfer().setData( 'Text', str )
			}
		}
		
		return data
	} else {
		try {
			var str = this.transfer().getData( 'text/json' )
		} catch( error ){
			var str = this.transfer().getData( 'Text' )
		}
		
		if( !str ) str = $jin.state.local.item( '$jin.dom.event.data' )
		if( !str ) return null
		
		try {
			return JSON.parse( str )
		} catch( error ){
			$jin.log.error( error )
			return null
		}
	}
} )

$jin.method( '$jin.dom.event..offset', function( ){
    return $jin.vector([ this.nativeEvent().offsetX, this.nativeEvent().offsetY ])
} )

$jin.method( '$jin.dom.event..pos', function( ){
    return $jin.vector([ this.nativeEvent().pageX, this.nativeEvent().pageY ])
} )

;// ../../dom/event/jin_dom_event_onBlur.env=web.jam.js
$jin.klass({ '$jin.dom.event.onBlur': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onBlur.type', function( ){
    return 'blur'
} )

;// ../../dom/event/jin_dom_event_onClick.env=web.jam.js
$jin.klass({ '$jin.dom.event.onClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onClick.type', function( ){
    return 'click'
} )

;// ../../dom/event/jin_dom_event_onInput.env=web.jam.js
$jin.klass({ '$jin.dom.event.onInput': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onInput.type', function( ){
    return 'input'
} )

//$jin.method( '$jin.dom.event.listen', '$jin.dom.event.onInput_listen', function( crier, handler ){
//	var crier = $jin.dom( crier )
//	
//	crier.editable( true )
//	
//	return this.$jin.dom.event.listen( crier, handler )
//} )

;// ../../dom/event/jin_dom_event_onPress.env=web.jam.js
$jin.klass({ '$jin.dom.event.onPress': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onPress.type', function( ){
    return 'keydown'
} )

;// ../../dom/event/jin_dom_event_onWheel.env=web.jam.js
$jin.klass({ '$jin.dom.event.onWheel': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onWheel.type', function( ){
    return 'wheel'
} )

;// ../../dom/event/jin_dom_event_onChange.env=web.jam.js
$jin.klass({ '$jin.dom.event.onChange': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onChange.type', function( ){
    return 'change'
} )

;// ../../dom/event/jin_dom_event_onResize.env=web.jam.js
$jin.klass({ '$jin.dom.event.onResize': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onResize.type', function( ){
    return 'resize'
} )

;// ../../dom/event/jin_dom_event_onScroll.env=web.jam.js
$jin.klass({ '$jin.dom.event.onScroll': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onScroll.type', function( ){
    return 'scroll'
} )

;// ../../dom/event/jin_dom_event_onDoubleClick.env=web.jam.js
$jin.klass({ '$jin.dom.event.onDoubleClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onDoubleClick.type', function( ){
    return 'dblclick'
} )

;// ../../dom/selection/jin-dom-selection.jam.js
$jin.klass({ '$jin.dom.selection': [ '$jin.wrapper' ] })

$jin.alias( '$jin.wrapper..raw', '$jin.dom.selection..raw', 'nativeSelection' )

$jin.property( '$jin.dom.selection..nativeSelection', null )

$jin.method( '$jin.dom.selection..clear', function( ){
	var sel = this.nativeSelection()
	if( sel.removeAllRanges ) sel.removeAllRanges()
	else if( sel.clear ) sel.clear()
	else throw new Error( 'Unsupported selection type' )
	
	return this
} )

$jin.method( '$jin.dom.selection..range', function( ){
	var sel = this.nativeSelection()
	if( sel.rangeCount ) return $jin.dom.range( sel.getRangeAt( 0 ).cloneRange() )
	if( document.createRange ) return $jin.dom.range( document.createRange() )
	if( sel.createRange ) return $jin.dom.range( sel.createRange() )
	throw new Error( 'Unsupported selection type' )
} )

;// ../../doc/jin_doc.jam.js
$jin.klass({ '$jin.doc': [ '$jin.dom' ] })

$jin.method({ '$jin.doc.exec': function( node ){
	if( !arguments.length ) node = window.document
	
	var doc = node[ '$jin.doc' ]
	if( doc ) return doc
	
	return node[ '$jin.doc' ] = this['$jin.wrapper.exec']( node )
}})

$jin.method({ '$jin.doc..findById': function( id ){
	return $jin.dom( this.nativeNode().getElementById( id ) )
}})

$jin.method({ '$jin.doc..selection': function( ){
	var doc = this.nativeNode()
	return $jin.dom.selection( doc.selection || doc.defaultView.getSelection() )
}})

$jin.property({ '$jin.doc..sizeListener': function( ){
	return this.entangle( $jin.dom.event.onResize.listen( window, function( ){
		this.size( void 0 )
	}.bind( this ) ) )
} } )

$jin.atom.prop({ '$jin.doc..size': {
	resolves: [ '$jin.dom..size' ],
	pull: function( ){
		this.sizeListener()
		var root = document.documentElement
		return $jin.vector([ root.clientWidth, root.clientHeight ])
	}
} } )

;// ../../dom/range/jin-dom-range.env=web.jam.js
$jin.klass({ '$jin.dom.range': [ '$jin.wrapper' ] })

$jin.alias( '$jin.wrapper..raw', '$jin.dom.range..raw', 'nativeRange' )

$jin.property({ '$jin.dom.range..nativeRange': function( range ){
	if( !range ) throw new Error( 'Wrong TextRange object (' + range + ')' )
	return range
}})

$jin.method({ '$jin.dom.range.create': function( ){
	return $jin.doc().selection().range()
}})

$jin.method({ '$jin.dom.range..select': function( ){
	var sel = $jin.doc().selection()
	var range = this.nativeRange()
	if( range.select ){
		range.select()
	} else {
		sel.clear()
		sel.nativeSelection().addRange( range )
	}
	return this
}})

$jin.method({ '$jin.dom.range..collapse2start': function( ){
	this.nativeRange().collapse( true )
	return this
}})

$jin.method({ '$jin.dom.range..collapse2end': function( ){
	this.nativeRange().collapse( false )
	return this
}})

$jin.method({ '$jin.dom.range..clear': function( ){
	this.nativeRange().deleteContents()
	return this
}})

$jin.method({ '$jin.dom.range..html': function( html ){
	if( !arguments.length ) return $jin.dom( this.nativeRange().cloneContents() ).toString()
	
	var node = $jin.dom( html )
	this.replace( node )
	
	return this
}})

$jin.method({ '$jin.dom.range..text': function( text ){
	if( !arguments.length ) return $jin.dom.html2text( this.html() )
	
	this.html( $jin.dom.escape( text ) )
	
	return this
}})

$jin.method({ '$jin.dom.range..replace': function( dom ){
	var node = $jin.dom( dom ).nativeNode()
	var range = this.nativeRange()
	
	this.clear()
	range.insertNode( node )
	range.selectNode( node )
	
	return this
}})

$jin.method({ '$jin.dom.range..ancestor': function( ){
	return $jin.dom( this.nativeRange().commonAncestorContainer )
}})

if( $jin.support.textModel() === 'w3c' ){
	$jin.method({ '$jin.dom.range..compare': function( how, range ){
		if( range.nativeRange ) range = range.nativeRange()
		how = Range[ how.replace( '2', '_to_' ).toUpperCase() ]
		
		return range.compareBoundaryPoints( how, this.nativeRange() )
	}})
} else {
	$jin.method({ '$jin.dom.range..compare': function( how, range ){
		if( range.nativeRange ) range = range.nativeRange()
		how = { start2start: 'StartToStart', start2end: 'StartToEnd', end2start: 'EndToStart', end2end: 'EndToEnd' }[ how ]
		
		return range.compareEndPoints( how, this.nativeRange() )
	}})
}

$jin.method({ '$jin.dom.range..hasRange': function( range ){
	if( range.nativeRange ) range = range.nativeRange()
	var isAfterStart = ( this.compare( 'start2start', range ) >= 0 )
	var isBeforeEnd = ( this.compare( 'end2end', range ) <= 0 )
	return isAfterStart && isBeforeEnd
}})

$jin.method({ '$jin.dom.range..equalize': function( how, range ){
	if( range.nativeRange ) range = range.nativeRange()
	how = how.split( 2 )
	var method = { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
	this.nativeRange()[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
	return this
}})

$jin.method({ '$jin.dom.range..clone': function( ){
	return $jin.dom.range( this.nativeRange().cloneRange() )
}})

$jin.method({ '$jin.dom.range..aimNodeContent': function( node ){
	if( node.nativeNode ) node = node.nativeNode()
	var range = this.nativeRange()
	if( range.selectNodeContents ) range.selectNodeContents( node )
	else if( range.moveToElementText ) range.moveToElementText ( node )
	return this
}})

$jin.method({ '$jin.dom.range..aimNode': function( node ){
	if( node.nativeNode ) node = node.nativeNode()
	this.nativeRange().selectNode( node )
	return this
}})

$jin.method({ '$jin.dom.range..move': function( offset ){
	this.collapse2start()
	
	if( offset === 0 ) return this
	
	var thisRange = this.nativeRange()
	
	var current = $jin.dom( thisRange.startContainer )
	if( thisRange.startOffset ){
		var temp = current.nativeNode().childNodes[ thisRange.startOffset - 1 ]
		if( temp ){
			current = $jin.dom( temp ).follow()
		} else {
			offset += thisRange.startOffset
		}
	}
	
	while( current ){
		if( current.name() === '#text' ){
			var range = $jin.dom.range.create().aimNode( current )
			var length = current.nativeNode().nodeValue.length
			
			if( !offset ){
				this.equalize( 'start2start', range )
				return this
			} else if( offset > length ){
				offset -= length
			} else {
				this.nativeRange().setStart( current.nativeNode(), offset )
				return this
			}
		}
		if( current.name() === 'br' ){
			if( offset > 1 ){
				offset -= 1
			} else {
				var range = $jin.dom.range.create().aimNode( current )
				this.equalize( 'start2end', range )
				return this
			}
		}
		current = current.delve()
	}
	
	return this
}})

;// ../../identical/jin_identical.jam.js
$jin.identical = function( a, b ){
    if(( typeof a === 'number' )&&( typeof b === 'number' )){
        return String( a ) === String( b )
    }
    
    return ( a === b )
}

;// ../../thread/jin_thread.env=web.jam.js
$jin.method( '$jin.thread', function( proc ){
    return function $jin_thread_wrapper( ){
        var self= this
        var args= arguments
        var res
        
        var id= $jin.makeId( '$jin.thread' )
        var launcher = function $jin_thread_launcher( event ){
            res= proc.apply( self, args )
        }
        
		if( $jin.support.eventModel() === 'w3c' ){
			window.addEventListener( id, launcher, false )
				var event= document.createEvent( 'Event' )
				event.initEvent( id, false, false )
				window.dispatchEvent( event )
			window.removeEventListener( id, launcher, false )
		} else {
			try {
				launcher()
			} catch( error ){
				$jin.log.error( error )
			}
		}
        
        return res
    }
} )

;// ../../mock/jin_mock.jam.js
$jin.klass({ '$jin.mock': [] })

$jin.property( '$jin.mock..path', String )
$jin.property( '$jin.mock..ownerPath', function(){
	return this.path().replace( /\.[^.]*$/, '' )
} )
$jin.property( '$jin.mock..fieldName', function(){
	return this.path().replace( /^.*\./, '' )
} )

$jin.property( '$jin.mock..value', null )
$jin.property( '$jin.mock..backupValue', null )
$jin.property( '$jin.mock..backupOwner', null )

$jin.property( '$jin.mock..mocking', function( mocking ){
    var fieldName = this.fieldName()
    if( mocking ){
		var owner =  $jin.trait( this.ownerPath() )
		this.backupOwner( owner )
        this.backupValue( owner[ fieldName ] )
        owner[ fieldName ] = this.value()
    } else {
		var owner = this.backupOwner()
        owner[ fieldName ] = this.backupValue()
        this.backupOwner( null )
        this.backupValue( null )
    }
    return mocking
} )

$jin.method( '$jin.klass..destroy', '$jin.mock..destroy', function( ){
    this.mocking( false )
    this['$jin.klass..destroy']()
} )

;// ../../test/jin_test.jam.js
$jin.klass({ '$jin.test': [] })

$jin.property( '$jin.test.completeList', Array )
$jin.property( '$jin.test.pendingList', Array )
$jin.property( '$jin.test.running', Array )
$jin.property( '$jin.test.timer', null )

$jin.method( '$jin.test.next', function( next ){
	if( arguments.length ) this.pendingList().push( next )
	
	clearTimeout( this.timer() )
	this.timer( setTimeout( function( ){
	    var next = this.pendingList()[0]
		if( next ) next.run()
	}.bind( this ), 0 ) )
} )

$jin.property( '$jin.test..code', null )

$jin.property( '$jin.test..passed', Boolean )
$jin.property( '$jin.test..timeout', Number )
$jin.property( '$jin.test..timer', null )

$jin.property( '$jin.test..asserts', Array )
$jin.property( '$jin.test..results', Array )
$jin.property( '$jin.test..errors', Array )

$jin.method( '$jin.klass..init', '$jin.test..init', function( code ){
    this.code( code )
	this.constructor.next( this )
    return this
} )

$jin.method( '$jin.klass..destroy', '$jin.test..destroy', function( destroy ){
    var completeList = this.constructor.completeList()
    var pendingList = this.constructor.pendingList()
    
    completeList.splice( completeList.indexOf( this ), 1 )
    pendingList.splice( pendingList.indexOf( this ), 1 )
    
    return this['$jin.klass..destroy']()
} )

$jin.method( '$jin.test..run', function( ){
    var test = this
    
    var complete = false
    this.callback( function( ){
        if( typeof this.code() === 'string' )
            this.code( new Function( 'test', this.code() ) )
        
        this.code()( this )
        complete = true
    } ).call( this )
    
    this.asserts().push( complete )
    
    if( this.timeout() ){
        if( !this.done() ){
            this.timer( setTimeout( this.callback( function( ){
                test.asserts().push( false )
                var error = new Error( 'timeout (' + test.timeout() + ') of ' + test.code() )
                test.errors().push( error )
                test.done( true )
                throw error
            }), this.timeout() ))
        }
    } else {
        this.done( true )
    }
} )

$jin.property( '$jin.test..done', function( done ){
    if( !arguments.length ) return false
    
    this.timer( clearTimeout( this.timer() ) )
    
    var passed = true
    this.asserts().forEach( function( assert ){
        passed = passed && assert
    })
    this.passed( passed )
    
    this.constructor.completeList().push( this )
    var pendingList = this.constructor.pendingList()
    pendingList.splice( pendingList.indexOf( this ), 1 )
	
	this.constructor.next()

    return this
} )
    
$jin.method( '$jin.test..fail', function(){
    throw new Error( 'Failed' )
} )

$jin.method( '$jin.test..ok', function( value ){
    if( value ) return this
    
    throw new Error( 'Not true (' + value + ')' )
} )

$jin.method( '$jin.test..not', function( value ){
    if( !value ) return this
    
    throw new Error( 'Not false (' + value + ')' )
} )

$jin.method( '$jin.test..equal', function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( passed ) continue
        
        throw new Error( 'Not equal (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
} )

$jin.method( '$jin.test..unique', function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( !passed ) continue
        
        throw new Error( 'Not unique (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
} )

$jin.method( '$jin.test..callback', function( func ){
    var test = this
    return $jin.thread( function( ){
        var mockHash = test.mockHash()
        try {
            for( var name in mockHash ) mockHash[ name ].mocking( true )
            return func.apply( this, arguments )
        } catch( error ){
            test.errors().push( error )
            throw error
        } finally {
            for( var name in mockHash ) mockHash[ name ].mocking( false )
        }
    } )
} )

$jin.property( '$jin.test..mockHash', Object )

$jin.method( '$jin.test..mock', function( path, value ){
    var mock = $jin.mock({ path: path, value: value, mocking: true })
    this.mockHash()[ path ] = mock
    return mock
} )

;// ../../dom/jin_dom.jam.js
$jin.klass({ '$jin.dom': [ '$jin.wrapper' ] })

//$jin.method( '$jin.wrapper.exec', '$jin.wrapper.exec', function( node ){
//    if( node instanceof this ) return node
//    
//    //var name = String( this )
//    //var obj = node[ name ]
//    //if( obj && ( obj instanceof this ) ) return obj
//    
//    var obj = new this([ node ])
//    
//    //try {
//    //    obj.nativeNode()[ name ] = this
//    //} catch( e ){}
//    
//    return obj
//} )

$jin.method( '$jin.dom.env', function( ){
    return $jin.env()
} )

$jin.method( '$jin.dom.escape', function( val ){
    return val.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&apos;' )
} )

$jin.method( '$jin.dom.decode', function( text ){
	var decoder = document.createElement( 'textarea' )
	decoder.innerHTML = text
	return decoder.value
} )

$jin.method( '$jin.dom.html2text', function( html ){
	return $jin.dom.decode(
		String( html )
		.replace( /<div><br[^>]*>/gi, '\n' )
		.replace( /<br[^>]*>/gi, '\n' )
		.replace( /<div>/gi, '\n' )
		.replace( /<[^<>]+>/g, '' )
	)
} )


$jin.method( '$jin.wrapper..init', '$jin.dom..init', function( node ){
    if( typeof node === 'string' ){
		if( $jin.dom.env().DOMParser ){
			var parser = new( $jin.dom.env().DOMParser )
			var doc = parser.parseFromString( '<body>' + node + '</body>', 'application/xhtml+xml' )
			doc = doc.documentElement || doc
		} else {
			var doc = document.createElement( 'div' )
			doc.innerHTML = node
			//var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
			//doc.async= false
			//doc.loadXML( node )
		}
		
		if( doc.childNodes.length > 1 ){
			node = document.createDocumentFragment()
			var cur; while( cur = doc.firstChild ) node.appendChild( cur )
		} else {
			node = doc.firstChild
		}
		
	    this.nativeNode( node )
		
		var errorNode = doc.getElementsByTagName( 'parsererror' )[0]
		if( errorNode ) throw new Error( this.text() )
		
		return this
    } else {
        if( typeof node.raw === 'function' ) node = node.raw()
	    this.nativeNode( node )
		return this
    }
} )

$jin.alias( '$jin.wrapper..raw', '$jin.dom..raw', 'nativeNode' )
$jin.property( '$jin.dom..nativeNode', null )
    
$jin.method( '$jin.dom..nativeDoc', function( ){
    var node = this.raw()
    return node.ownerDocument || node
} )
    
$jin.method( '$jin.dom..toString', function( ){
    var serializer = new( $jin.dom.env().XMLSerializer )
    return serializer.serializeToString( this.nativeNode() )
} )
    
$jin.method( '$jin.dom..transform', function( stylesheet ){
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( $jin.dom( stylesheet ).nativeDoc() )
    var doc= proc.transformToDocument( this.nativeNode() )
    return $jin.dom( doc )
} )
    
$jin.method( '$jin.dom..render', function( from, to ){
    from= $jin.dom( from ).nativeNode()
    to= $jin.dom( to ).nativeNode()
    
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( this.nativeDoc() )
    var res= proc.transformToFragment( from, to.ownerDocument )
    to.innerHTML= ''
    to.appendChild( res )
    
    return this
} )
    
$jin.method( '$jin.dom..name', function( ){
    return this.nativeNode().nodeName
} )

$jin.method( '$jin.dom..attr', function( name, value ){
    if( arguments.length > 1 ){
        if( value == null ) this.nativeNode().removeAttribute( name )
        else this.nativeNode().setAttribute( name, value )
        return this
    } else {
        return this.nativeNode().getAttribute( name )
    }
} )
    
$jin.method( '$jin.dom..attrList', function( ){
    var nodes= this.nativeNode().attributes
    
    if( !nodes ) return []
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
} )

$jin.method( '$jin.dom..text', function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.textContent = String( value )
        return this
    } else {
        return node.textContent
    }
} )

$jin.method( '$jin.dom..clear', function( ){
    var node = this.nativeNode()
    var child
    while( child= node.firstChild ){
        node.removeChild( child )
    }
    return this
} )

$jin.method( '$jin.dom..parent', function( parent ){
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

$jin.method( '$jin.dom..next', function( next ){
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

$jin.method( '$jin.dom..prev', function( prev ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var prev = node.previousSibling
        if( prev ) prev = $jin.dom( prev )
        return prev
    }
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node )
    return this
} )

$jin.method( '$jin.dom..head', function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.firstChild
        if( node ) node = $jin.dom( node )
        return node
    }
    node.insertBefore( $jin.dom( dom ).nativeNode(), this.head().nativeNode() )
    return this
} )

$jin.method( '$jin.dom..tail', function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.lastChild
        if( node ) node = $jin.dom( node )
        return node
    }
    $jin.dom( dom ).parent( this )
    return this
} )

$jin.method( '$jin.dom..follow', function( ){
	var node = this
	while( true ){
		var next = node.next()
		if( next ) return next
		node = node.parent()
		if( !node ) return null
	}
} )

$jin.method( '$jin.dom..precede', function( ){
	var dom = this
	while( true ){
		var next = node.prev()
		if( next ) return next
		dom = dom.parent()
		if( !dom ) return null
	}
} )

$jin.method( '$jin.dom..delve', function( ){
	return this.head() || this.follow()
} )

$jin.method( '$jin.dom..childList', function( ){
    var nodes= this.nativeNode().childNodes
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
} )

$jin.method( '$jin.dom..xpathFind', function( xpath ){
    var node= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null ).iterateNext()
    if( !node ) return node
    return $jin.dom( node )
} )

$jin.method( '$jin.dom..xpathSelect', function( xpath ){
    var list= []
    
    var found= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null )
    for( var node; node= found.iterateNext(); ) list.push( $jin.dom( node ) )
    
    return list
} )

$jin.method( '$jin.dom..cssFind', function( css ){
    var node = this.nativeNode().querySelector( css )
    if( !node ) return node
    return $jin.dom( node )
} )

$jin.method( '$jin.dom..cssSelect', function( css ){
    return [].slice.call( this.nativeNode().querySelectorAll( css ) ).map( $jin.dom )
} )

$jin.method( '$jin.dom..clone', function( ){
    return $jin.dom( this.nativeNode().cloneNode() )
} )

$jin.method( '$jin.dom..cloneTree', function( ){
    return $jin.dom( this.nativeNode().cloneNode( true ) )
} )


$jin.method( '$jin.dom..makeText', function( value ){
    return $jin.dom( this.nativeDoc().createTextNode( value ) )
} )

$jin.method( '$jin.dom..makeFragment', function( ){
    return $jin.dom( this.nativeDoc().createDocumentFragment() )
} )

$jin.method( '$jin.dom..makePI', function( name, content ){
    return $jin.dom( this.nativeDoc().createProcessingInstruction( name, content ) )
} )

$jin.method( '$jin.dom..makeElement', function( name, ns ){
    if( arguments.length > 1 ){
        return $jin.dom( this.nativeDoc().createElementNS( ns, name ) )
    } else {
        return $jin.dom( this.nativeDoc().createElement( name ) )
    }
} )

$jin.method( '$jin.dom..makeTree', function( json ){
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

$jin.method( '$jin.dom..listen', function( eventName, handler ){
	handler = $jin.defer.callback( handler )
    this.nativeNode().addEventListener( eventName, handler, false )
    return $jin.listener().crier( this ).eventName( eventName ).handler( handler )
} )

$jin.method( '$jin.dom..forget', function( eventName, handler ){
    this.nativeNode().removeEventListener( eventName, handler, false )
    return this
} )

$jin.method( '$jin.dom..scream', function( event ){
    event = $jin.dom.event( event )
    this.nativeNode().dispatchEvent( event.nativeEvent() )
    return this
} )

$jin.method( '$jin.dom..flexShrink', function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.style.flexShrink = String( value )
        return this
    } else {
        return document.getComputedStyles( node ).flexShrink
    }
} )

$jin.method( '$jin.dom..normalize', function( map ){
    var node = this.nativeNode()
	
	var childs = []
	for( var i = 0; i < node.childNodes.length; ++i ){
		childs.push( node.childNodes[ i ] )
	}
	
	childs.forEach( function normalizeChild( child ){
		var name = child.nodeName
		var handler = map[ name ] || map[ '' ]
		if( handler ){
			var newChild = handler.call( map, child )
			if( newChild === child ) return
		}
		if( newChild ){
			if( newChild.nodeName ) newChild = [ newChild ]
			for( var i = 0; i < newChild.length; ++i ){
				node.insertBefore( newChild[i], child )
			}
		}
		node.removeChild( child )
	} )
	
	return this
} )

$jin.method( '$jin.dom..rangeAround', function( ){
	return $jin.dom.range.create().aimNode( this )
} )

$jin.method( '$jin.dom..rangeContent', function( ){
	return $jin.dom.range.create().aimNodeContent( this )
} )

;// ../../dom/jin_dom.env=web.jam.js
$jin.method( '$jin.dom..html', function( html ){
    if( arguments.length ){
        this.nativeNode().innerHTML = html
        return this
    } else {
        return this.nativeNode().innerHTML
    }
} )

$jin.method({ '$jin.dom..size': function( ){
	var node = this.nativeNode()
	return $jin.vector([ node.offsetWidth, node.ofsfetHeight ])
}})

if( $jin.support.xmlModel() === 'ms' ){
    
    $jin.mixin({ '$jin.dom': [ '$jin.dom.ms' ] })
    
    $jin.method( '$jin.dom..toString', '$jin.dom.ms..toString', function( ){
        return String( this.nativeNode().xml )
    } )

    // works incorrectly =( use render instead
    $jin.method( '$jin.dom..transform', '$jin.dom.ms..transform', function( stylesheet ){
        var result= this.nativeNode().transformNode( $jin.dom( stylesheet ).nativeNode() )
        return $jin.dom.parse( result )
    } )

    $jin.method( '$jin.dom..render', '$jin.dom.ms..render', function( from, to ){
        from = $jin.dom( from ).nativeNode()
        to = $jin.dom( to ).nativeNode()
        
        to.innerHTML= from.transformNode( this.nativeDoc() )
    } )
    
    $jin.method( '$jin.dom..text', '$jin.dom.ms..text', function( value ){
        var node = this.nativeNode()
        if( arguments.length ){
            node.innerText = value
            return this
        } else {
            return node.innerText
        }
    } )
    
    $jin.method( '$jin.dom..select', '$jin.dom.ms..select', function( xpath ){
        var list= []
        
        var found= this.nativeNode().selectNodes( xpath )
        for( var i= 0; i < found.length; ++i ) list.push( $jin.dom( found[ i ] ) )
        
        return list
    } )

}

if( $jin.support.eventModel() === 'ms' ){

    $jin.method( '$jin.dom..listen', '$jin.dom.ms..listen', function( eventName, handler ){
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().attachEvent( eventName, function( ){
            var event = $jin.dom.event( window.event )
            //if( event.type() !== eventName ) return
            return handler( event )
        } )
        return this
    } )
    
    $jin.method( '$jin.dom..forget', '$jin.dom.ms..forget', function( eventName, handler ){
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().detachEvent( eventName, handler )
        return this
    } )
    
    $jin.method( '$jin.dom..scream', '$jin.dom.ms..scream', function( event ){
        event = $jin.dom.event( event )
        var eventName = this.normalizeEventName( event.type() )
        this.nativeNode().fireEvent( eventName, event.nativeEvent() )
        return this
    } )

    $jin.method( '$jin.dom.ms..normalizeEventName', function( eventName ){
        return /^[a-zA-Z]+$/.test( eventName ) ? 'on' + eventName : 'onbeforeeditfocus'
    } )
    
}

;// ../../dom/jin-dom-test.env=web.jam.js
$jin.test( function hasRange_including( test ){
	var root = $jin.dom( '<div> </div>' ).parent( document.body )
	var text = root.childList()[0]
	
	test.ok( root.rangeContent().hasRange( text.rangeContent() ) )
	
	root.parent( null )
} )

$jin.test( function hasRange_excluding( test ){
	var one = $jin.dom( '<div></div>' ).parent( document.body )
	var two = $jin.dom( '<div></div>' ).parent( document.body )
	
	test.not( one.rangeAround().hasRange( two.rangeAround() ) )
	
	one.parent( null )
	two.parent( null )
} )

$jin.test( function hasRange_equal( test ){
	var root = $jin.dom( '<div></div>' ).parent( document.body )
	
	test.ok( root.rangeAround().hasRange( root.rangeAround() ) )
	test.ok( root.rangeContent().hasRange( root.rangeContent() ) )
	
	root.parent( null )
} )

;// ../../state/local/jin_state_local.env=web.jam.js
$jin.klass({ '$jin.state.local': [] })

$jin.atom.prop( '$jin.state.local.storage',
{   pull: function( ){
        return window.localStorage || {}
    }
} )

$jin.atom.prop( '$jin.state.local.listener',
{   pull: function( ){
        var context = this
        return $jin.dom( window ).listen( 'storage', function( event ){
			event = $jin.dom.event( event )
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

$jin.atom.prop.hash( '$jin.state.local.item',
{   pull: function( key ){
        this.listener()
        var val = this.storage()[ key ]
        return ( val == null ) ? null : val
    }
,   put: function( key, value ){
        
        if( value == null ){
            delete this.storage()[ key ]
        } else {
	        value = this.storage()[ key ] = String( value )
		}
        
        this.item.atom( this, key ).update()
        
        return value
    }
} )

;// ../../sample/jin_sample.jam.js
$jin.klass({ '$jin.sample': [ '$jin.dom' ] })

$jin.atom.prop({ '$jin.sample.strings': {
	value: '',
	put: function( next, prev ){
		return $jin.sample.strings() + next
	}
}})

$jin.atom.prop({ '$jin.sample.templates': {
	pull: function( ){
		var strings = this.strings()
		if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
		return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
	}
}})

$jin.atom.prop.hash({ '$jin.sample.dom': {
	pull: function( name ){
		var selector = '[' + name + ']'
		
		var dom = $jin.sample.templates().cssFind( selector )
		if( !dom ) throw new Error( 'Sample not found (' + selector + ')' )
		
		return dom.nativeNode()
	}
}})

$jin.atom.prop.hash({ '$jin.sample.rules': { pull: function( name ){
	var node = this.dom( name )
	
	var path = []
	var rules = []
	
	function collect( node ){
		
		if( node.childNodes ){
			for( var i = 0; i < node.childNodes.length; ++i ){
				var child = node.childNodes[i]
				
				if( child.nodeName === '#text' ){
					var found = /\{(\w+)\}/g.exec( child.nodeValue )
					if( !found ) continue
					
					var key = found[1]
					rules.push({
						key: key,
						path: path.slice(),
						coverName: '$jin.sample:' + name + '/' + path.join( '/' ) + '=' + key,
						attach: function( rule, sample, current ){
							var cover = new $jin.atom(
							{	name: rule.coverName
							,	pull: function jin_sample_pull( ){
									var view = sample.view()
									if( !view ) return null
									
									return view[ rule.key ]()
								}
							, 	merge: function contentPull( nextItems, prevItems ){
									
									if( !prevItems ) prevItems = []
									
									if( nextItems == null ){
										nextItems = [ '' ]
									} else if( typeof nextItems === 'object' ){
										nextItems = [].concat( nextItems )
									} else {
										nextItems = [ String( nextItems ) ]
									}
									
									nextItems = nextItems.filter( function jin_sample_filterNulls( item ){
										return( item != null )
									} )
									
									if( !nextItems.length ) nextItems.push( '' )
									
									nextItems = nextItems.map( function jin_sample_normalizeNext( item ){
										if( typeof item !== 'object' ) return String( item )
										if( item.element ) return item.element()
										return item
									} )
									
									var textNodes = []
									var elements = []
									
									var nodes = current.childNodes
									for( var i = 0; i < nodes.length; ++i ){
										var node = nodes[i]
										if( node.nodeName === '#text' ) textNodes.push( node )
										else elements.push( node )
									}
									
									var nextNodes = nextItems.map( function jin_sample_generateNodes( item ){
										if( typeof item === 'string' ){
											var node = textNodes.shift()
											if( !node ) node = document.createTextNode( item )
											else if( node.nodeValue !== item ) node.nodeValue = item
											return node
										} else {
											var node = item.nativeNode ? item.nativeNode() : item
											var index = elements.indexOf( node )
											if( index >= 0 ) elements[ index ]  = null
											return node
										}
									} )
									
									var removeNode = function jin_sample_removeNode( node ){
										if( !node ) return
										current.removeChild( node )
									}
									
									elements.forEach( removeNode )
									textNodes.forEach( removeNode )
									
									prevItems.map( function jin_sample_freePrevs( item ){
										if( typeof item === 'string' ) return
										if( !item['$jin.sample..view'] ) return
										if( nextItems.indexOf( item ) >= 0 ) return
										item.view( null )
									} )
									
									for( var i = nextNodes.length; i > 0; --i ){
										var next = nextNodes[ i ]
										var node = nextNodes[ i - 1 ]
										if( next ){
											if( node.nextNode !== next ) current.insertBefore( node, next )
										} else {
											if( node.parentNode !== current ) current.appendChild( node )
										}
									}
									
									return nextItems
								}
							} )
							sample.entangle( cover )
							$jin.atom.bound( function( ){
								cover.pull()
							} )
						}
					})
					
					while( node.firstChild ) node.removeChild( node.firstChild )
					break;
				} else {
					path.push( 'childNodes', i )
						collect( child )
					path.pop(); path.pop()
				}
			}
		}
		
		var attrs = node.attributes
		if( attrs ){
			var attrList = []
			for( var i = 0; i < attrs.length; ++i ){
				attrList.push( attrs[ i ] )
			}
			attrList.forEach( function( attr ){
				var found = /^\{(\w+)\}$/g.exec( attr.nodeValue )
				if( !found ) return
				
				var key = found[1]
				var attrName = attr.nodeName
				
				var rule = {
					key: key,
					attrName: attrName,
					coverName: '$jin.sample:' + name + '/' + path.join( '/' ) + '/@' + attrName + '=' + key,
					path: path.slice(),
					attach: function( rule, sample, node ){
						var cover = new $jin.atom(
						{	name: rule.coverName
						,	pull: function jin_sample_pull( ){
								var view = sample.view()
								if( !view ) return null
								
								var next = view[ rule.key ]()
								return next ? String( next ) : next
							}
						,	push: function attrPush( next, prev ){
								if( next == null ) node.removeAttribute( rule.attrName )
								else node.setAttribute( rule.attrName, next )
							}
						})
						sample.entangle( cover )
						$jin.atom.bound( function( ){
							cover.pull()
						} )
					}
				}
				rules.push( rule )
				
				node.removeAttribute( attrName )
			})
			
			var props = node.getAttribute( 'jin-sample-props' )
			if( props ){
				props.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var subPath = chunk.split( /[-_:=.]/g )
					var key = subPath.pop()
					var fieldName = subPath.pop()
					
					rules.push({
						key: key,
						path: path.concat( subPath ),
						coverName: '$jin.sample:' + name + '/' + path.join( '/' ) +  ( subPath.length ? '.' + subPath.join( '.' ) : '' ) + '.' + fieldName + '=' + key,
						fieldName: fieldName,
						attach: function( rule, sample, current ){
							if( [ 'value', 'checked' ].indexOf( rule.fieldName ) !== -1 && [ 'select', 'input', 'textarea' ].indexOf( node.nodeName ) !== -1 ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return
									view[ rule.key ]( current[ rule.fieldName ] )
								}
								sample.entangle( $jin.dom( current ).listen( 'input', handler ) )
								sample.entangle( $jin.dom( current ).listen( 'change', handler ) )
								sample.entangle( $jin.dom( current ).listen( 'click', handler ) )
							}
							if( rule.fieldName === 'scrollTop' ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return
									
									view[ rule.key ]( current.scrollTop )
								}
								sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
							} else if( rule.fieldName === 'scrollLeft' ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return
									
									view[ rule.key ]( current.scrollLeft )
								}
								sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
							}
							var cover = new $jin.atom(
							{	name: rule.coverName
							,	pull: function jin_sample_pull( ){
									var view = sample.view()
									if( !view ) return null
									
									return view[ rule.key ]()
								}
							,	push: function fieldPush( next, prev ){
									if( next == null ) return
									//if( current[ rule.fieldName ] == next ) return
									current[ rule.fieldName ] = next
								}
							})
							sample.entangle( cover )
							$jin.atom.bound( function( ){
								cover.pull()
							} )
						}
					})
				} )
				node.removeAttribute( 'jin-sample-props' )
			}
			
			var events = node.getAttribute( 'jin-sample-events' )
			if( events ){
				events.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var eventName = chunk.split( /[-_:=.]/g )
					var key = eventName.pop()
					eventName = eventName.join( '.' )
					
					var shortFound = /^(on)(\w+)$/.exec( eventName )
					if( shortFound ){
						var type = shortFound[1]
						var name = shortFound[2]
						rules.push({
							key: key,
							path: path.slice(),
							eventName: name,
							attach: function( rule, sample, current ){
								var listener = $jin.dom( current ).listen( rule.eventName, function eventHandler( event ){
									var view = sample.view()
									if( !view ) return
									
									var handler = view[ rule.key ]
									if( !handler ) throw new Error( 'View handler is not defined (' + view.constructor + '..' + rule.key + ')' )
									
									handler.call( view, $jin.dom.event( event ) )
								})
								sample.entangle( listener )
							}
						})
					} else {
						var event = $jin.glob( eventName )
						if( !event ) throw new Error( 'Unknown event [' + eventName + ']' )
						rules.push({
							key: key,
							path: path.slice(),
							event: event,
							attach: function( rule, sample, current ){
								var listener = rule.event.listen( current, function eventHandler( event ){
									var view = sample.view()
									if( !view ) return
									
									var handler = view[ rule.key ]
									if( !handler ) throw new Error( 'View handler is not defined (' + view.constructor + '..'  + rule.key + ')' )
									
									handler.call( view, event )
								})
								sample.entangle( listener )
							}
						})
					}
				} )
				node.removeAttribute( 'jin-sample-events' )
			}
			
		}
	}
	
	collect( node )
	
	return rules
}}})

$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample.exec': function( type ){
	'$jin.wrapper.exec'
	
	var pool = this.pool( type )
	var sample = pool.shift()
	
	if( !sample ) sample = this[ '$jin.klass.exec' ]({ type: type })
	
	return sample
}})


$jin.method({ '$jin.sample..init': function( config ){
	'$jin.dom..init'
    return this['$jin.klass..init']( config )
}})

$jin.property({ '$jin.sample..type': String })

$jin.atom.prop({ '$jin.sample..view': {
	push: function( next, prev ){
		if( next === prev ) return prev
		
		if( prev ){
			var type = this.type()
			var prevSample = prev.sample( type )
			if( prevSample === this ) prev.sample( type, void 0 )
		}
		
		if( next == null ){
			var pool = $jin.sample.pool( this.type() )
			pool.push( this )
		}
		
		return next
	}
}})

//$jin.property({ '$jin.sample..covers': null })

$jin.atom.prop({ '$jin.sample..nativeNode': {
	resolves: [ '$jin.dom..nativeNode' ],
	pull: function( ){
		
		var type = this.type()
		var node = this.constructor.dom( type ).cloneNode( true )
		var rules = this.constructor.rules( type )
		var sample = this
		
		rules.forEach( function ruleIterator( rule ){
			var current = node
			
			rule.path.forEach( function pathIterator( name ){
				current = current[ name ]
			} )
			
			rule.attach( rule, sample, current )
		} )
		
		return node
	}
}})

;// ../jin_view.env=web.jam.js
$jin.klass({ '$jin.view': [ '$jin.registry'/*, '$jin.pool'*/ ] })

$jin.method( '$jin.view..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.property.hash( '$jin.view..sample', { pull: function( type ){
    return $jin.sample( type ).view( this )
} } )

$jin.property( '$jin.view..htmlID', function( ){
	return String( this.constructor ).replace( /^\$/, '' ).replace( /\./g, '-' ).toLowerCase()
} )

$jin.method( '$jin.view..element', function( key ){
	var protoId = this.htmlID()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
} )

$jin.method( '$jin.view..nativeNode', function( ){
    return this.element().nativeNode()
} )

$jin.method( '$jin.view..clone', function( id ){
	var Klass = this.constructor
    return Klass( id )
} )

$jin.method( '$jin.view..make', function( postfix, factory ){
    return factory( this.id() + ';' + postfix )
} )

}