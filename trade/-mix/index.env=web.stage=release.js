;//../../jin/jin.jam.js?=HSN8TMCG
this.$jin = {}

;//../../jin/value/jin-value.jam.js?=HP6SVV48
this.$jin.value = function $jin_value( value ){
    
    var func = function $jin_value_instance( ){
        return func.$jin_value
    }
    
    func.$jin_value = value
    
    return func
}

;//../../jin/root/jin_root.jam.js?=HOPSL9XS
this.$jin.root = $jin.value( this )

;//../../jin/trait/jin_trait.jam.js?=HSN8TMCG
this.$jin.trait = function( name ){
    
    var trait = $jin.glob( name )
    if( trait ) return trait
    
    trait = $jin.trait.make( name )
    
    return $jin.glob( name, trait )
}

this.$jin.trait.make = function( name ){
    
    var trait = function( args ){
        if( this instanceof trait ){
            return this.init.apply( this, args || [] )
        } else {
            return trait.exec.apply( trait, arguments )
        }
    }

    trait.jin_method_path = name
    
    return trait
}

;//../../jin/glob/jin_glob.jam.js?=HSN8TMCG
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

;//../../jin/definer/jin-definer.jam.js?=HSN8TLKO
$jin.definer = function( path, definer ){
	
	var wrapper = function( defines ){
		if( arguments.length > 1 ){
			definer.apply( null, arguments )
		} else {
			for( var path in defines ){
				definer( path, defines[ path ] )
			}
		}
	}
	
	return $jin.glob( path, wrapper )
}

$jin.definer( '$jin.definer', $jin.definer )

;//../../jin/func/jin_func.jam.js?=HSN8TMCG
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

;//../../jin/method/jin_method.jam.js?=HSN9JUSG
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
	
    var funcName = func.jin_method_path
    if( !funcName ) funcName = func.jin_method_path = name
    //throw new Error( 'jin_method_path is not defined in [' + func + ']' )
    
    var nameList = name.split( '.' )
    var methodName = nameList.pop()
    var ownerPath = nameList.join( '.' )
    var owner = $jin.trait( ownerPath )
    var slaveList = owner.$jin_mixin_slaveList
    
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
        
        if( !existFunc.jin_method_path ) break checkConflict
        
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
        return !~resolveList.indexOf( conflict.jin_method_path )
    })
    
    if( conflictList.length === 0 ){
        throw new Error( 'Can not resolve conflict ' + name + ' because cyrcullar resolving' )
    } else if( conflictList.length === 1 ){
        var func = conflictList[0]
    } else if( conflictList.length > 1 ){
        var func = $jin.func.make( name )
        func.execute = function( ){
            var conflictNames = conflictList.reduce( function( names, func ){
                var name = func.jin_method_path
				if( names.indexOf( name ) >= 0 ) return names
				
				names.push( name )
				return names
            }, [] )
            throw new Error( "Conflict in [" + name + "] by [" + conflictNames + "]" )
        }
        func.jin_method_path = name
        func.jin_method_conflicts = conflictList
    }
    
    func.jin_method_resolves = resolveList
    
    return func
}

;//../../jin/mixin/jin_mixin.jam.js?=HSN8TMCG
this.$jin.mixin = function( ){ // arguments: sourceName+, targetName
    var trait = $jin.mixin.object.apply( this, arguments )
    
    for( var index = 0; index < arguments.length; ++index ){
        arguments[ index ] += '.'
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
            if(( typeof func !== 'function' )||( !func.jin_method_path )){
                if(!( key in target )) target[ key ] = void 0
                continue
            }
            
            var methodName = func.jin_method_path.replace( /^([$\w]*\.)+/, '' )
			$jin.method( targetPath + '.' + methodName, func )
        }
    })
    
    return target
}

;//../../jin/property/jin_property.jam.js?=HSN8TMCG
$jin.definer({ '$jin.property': function( ){ // arguments: resolveName*, path, filter
    var resolveList = [].slice.call( arguments )
    var filter = resolveList.pop()
    var name = resolveList.pop()
    var fieldName = '_' + name
	
	if( filter ){
		var property = function( next ){
			if( arguments.length ){
				if( next === void 0 ){
					this[ fieldName ] = next
				} else {
					this[ fieldName ] = filter.call( this, next )
				}
				return this
			} else {
				var prev = this[ fieldName ]
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
			var value2 = put ? put.call( key, value ) : value
			if( value2 === void 0 ) delete storage[ key ]
			else storage[ key ] = value2
		} else if( arguments.length ) {
			var value2 = storage[ key ]
			if( pull && value2 === void 0 ) value2 = storage[ key ] = pull.call( this, key )
			return value2
		} else {
			return storage
		}
	}
	
	return $jin.method( path, propHash )
}})

;//../../jin/klass/jin_klass.jam.js?=HSN8TMCG
$jin.definer({ '$jin.klass': function( path, mixins ){
    $jin.mixin( '$jin.klass', path )
    return $jin.mixin.apply( this, mixins.concat([ path ]) )
}})

$jin.method( '$jin.klass.exec', function( ){
	return new this( arguments )
} )

$jin.method( '$jin.klass.subClass', function( fields ){
	var klass = $jin.trait.make()
	for( var key in this ) klass[ key ] = this[ key ]
	var proto = klass.prototype = Object.create( this.prototype )
	for( var key in fields ) proto[ key ] = fields[ key ]
	return klass
} )

$jin.method( '$jin.klass.id', function( ){
    return this.jin_method_path || this.name
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

;//../../jin/pool/jin-pool.jam.js?=HSN8TMCG
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

;//../../jin/registry/jin_registry.jam.js?=HSN9JUSG
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
	if( id instanceof this ) return id
	id = String( id )
	
    var obj = id; while( typeof obj === 'string' ) obj = this.storage( obj )
	
    if( obj ) return obj
    
	var make = this['$jin.pool.exec'] || this['$jin.klass.exec']
	
    var newObj = make.call( this, { id: id } )
    var id2 = newObj.id()
    
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

;//../../jin/wrapper/jin_wrapper.jam.js?=HSN8TMCG
$jin.wrapper = function( ){ // arguments: sourceName*, targetName
    $jin.mixin.apply( this, arguments )
    
    var name = arguments[ arguments.length - 1 ]
    return $jin.mixin( '$jin.wrapper', name )
}

$jin.mixin( '$jin.klass', '$jin.wrapper' )
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

;//../../jin/error/jin-error.jam.js?=HSN8TLKO
$jin.definer({ '$jin.error': function( path, traits ){
	var error = $jin.trait( path )
	error.prototype = new Error
	error.prototype.constructor = error
	$jin.mixin( '$jin.error', path )	
}})

$jin.mixin( '$jin.wrapper', '$jin.error' )

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

;//../../jin/schedule/jin_schedule.jam.js?=HSN8TMCG
$jin.method( '$jin.schedule', function( delay, handler ){
    var id = setTimeout( $jin.defer.callback( handler ), delay )
    return { destroy: function( ){
        clearTimeout( id )
    } }
} )

;//../../jin/defer/jin_defer.env=web.jam.js?=HSN9JUSG
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
	if( window.addEventListener ) window.postMessage( '$jin.defer', document.location.href )
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

if( window.addEventListener ) window.addEventListener( 'message', $jin.defer.check, true )

$jin.defer.callback = function( func ){
	return function $jin_defer_callback_instance(){
		$jin.defer.scheduled = true
		try {
			return func.apply( this, arguments )
		} finally {
			$jin.defer.check()
		}
	}
}

;//../../jin/makeId/jin_makeId.jam.js?=HSN8TMCG
$jin.makeId = function( prefix ){
	var seeds = $jin.makeId.seeds 
	var seed = seeds[ prefix ] || 0
	seeds[ prefix ] = seed + 1
    return prefix + ':' + seed
}

$jin.makeId.seeds = {}

;//../../jin/log/jin-log.env=web.jam.js?=HSN8TMCG
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
	
	if( error.$jin_log_isLogged ) return
	
	var message = error.stack || error
	var logger = console.exception || console.error || console.log
	logger.call( console, message )
	
	error.$jin_log_isLogged = true
}})

;//../../jin/atom/jin-atom.jam.js?=HSN8TLKO
$jin.error({ '$jin.atom.wait': [] })

$jin.klass({ '$jin.atom': [] })

$jin.atom.slaves = []
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._config', void 0 )
$jin.glob( '$jin.atom.._value', void 0 )
$jin.glob( '$jin.atom.._error', void 0 )
$jin.glob( '$jin.atom.._slice', 0 )
$jin.glob( '$jin.atom.._pulled', false )
$jin.glob( '$jin.atom.._slavesCount', 0 )
$jin.glob( '$jin.atom.._scheduled', false )

$jin.method({ '$jin.atom.induce': function( ){
	var scheduled = $jin.atom.scheduled

	scheduled: for( var i = 0; i < scheduled.length; ++i ){
		var queue = scheduled[i]
		if( !queue ) continue
		scheduled[i] = null
		
		for( var atomId in queue ){
			var atom = queue[ atomId ]
			if( !atom ) continue
			
			atom.pull()
			
			i = -1
		}
	}

	$jin.atom._deferred = null
}})

$jin.method({ '$jin.atom.schedule': function( ){
	if( this._deferred ) return

	this._deferred = $jin.defer( this.induce )
}})

$jin.method({ '$jin.atom.bound': function( handler ){
	$jin.atom.slaves.unshift( null )
	try {
		handler()
	} finally {
		var stack = $jin.atom.slaves
		while( stack.length ){
			var top = stack.shift()
			if( top === null ) break
		}
	}
	return this
}})

$jin.method({ '$jin.atom..init': function jin_atom__init( config ){
	this['$jin.klass..init']
	this._id = $jin.makeId( '$jin.atom' )
	this._config = config
	this._value = config.value
	this._error = config.error
	this._slaves = {}
	this._masters = {}
	this._slice = 0
	this._pulled = false
	this._slavesCount = 0
	this._scheduled = false
}})

$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

$jin.method({ '$jin.atom..get': function( ){
	if( this._config.pull && ( this._scheduled || ( this._value === void 0 ) ) ) this.pull()

	var slave = $jin.atom.slaves[0]
	if( slave ){
		slave.obey( this )
		this.lead( slave )
	}
	
	if( this._error ) throw this._error
	
	return this._value
}})

$jin.method({ '$jin.atom..valueOf': function( ){
	return this.get()
}})

$jin.method({ '$jin.atom..pull': function( ){
	var config = this._config
	if( !config.pull ) return this._value

	if( this._scheduled ){
		this._scheduled = false
		var queue = $jin.atom.scheduled[ this._slice ]
		if( queue ){
			queue[ this._id ] = null
		}
	}
	
	this._error = void 0
	
	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	if( $jin.atom.slaves.indexOf( this ) >= 0 ) throw new Error( 'Recursive atom' )
	$jin.atom.slaves.unshift( this )
	try {
		try {
			var value = config.pull.call( config.context, this._value )
		} finally {
			var stack = $jin.atom.slaves
			while( stack.length ){
				var top = stack.shift()
				if( top === this ) break
			}
		}
		this.put( value )
	} catch( error ){
		this.fail( error )
	}

	this._pulled = true
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this._value
}})

$jin.method({ '$jin.atom..put': function( next ){
	var config = this._config
	var merge = config.merge
	if( merge ){
		var context = config.context
		var prev = this._value
		$jin.atom.bound( function jin_atom_mergeBound( ){
			next = merge.call( context, next, prev )
		})
	}
	
	this.value( next )
	this._error = void 0
	this._pulled = false
	
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
	
	$jin.atom.bound( function mutate( ){
		atom.put( mutator.call( context, prev ) )
	})
	
	return this
}})

$jin.method({ '$jin.atom..value': function( next ){
	var prev = this._value

	if( !arguments.length ) return prev

	if( next === prev ) return this

	this._value = next
	
	var config = this._config
	var context = config.context
	
	var error = this._error
	if( error ){
		var fail = config.fail
		if( fail ){
			$jin.atom.bound( function jin_atom_failBound( ){
				fail.call( context, error, prev )
			})
		}
	} else {
		var push = config.push
		if( push ){
			$jin.atom.bound( function jin_atom_pushBound( ){
				push.call( context, next, prev )
			})
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
	var slaveExclude = $jin.atom.slaves[0]
	
	var slaves = this._slaves
	for( var id in slaves ){
		var slave = slaves[ id ]
		
		if( !slave ) continue
		if( slave === slaveExclude ) continue
		
		slave.update()
	}

	return this
}})

$jin.method({ '$jin.atom..update': function( ){
	var slice = this._slice

	var queue = $jin.atom.scheduled[ slice ]
	if( !queue ) queue = $jin.atom.scheduled[ slice ] = {}

	queue[ this._id ] = this
	this._scheduled = true

	$jin.atom.schedule()

	return this
}})

$jin.method({ '$jin.atom..lead': function( slave ){
	if( slave === this ) throw new Error( 'Self leading atom' )
	var id = slave.id()
	
	var slaves = this._slaves
	if( !slaves[ id ] ){
		slaves[ id ] = slave
		++ this._slavesCount
	}

	return this
}})

$jin.method({ '$jin.atom..obey': function( master ){
	if( master === this ) throw new Error( 'Self obey atom' )
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
		slaves[ id ].disobey( this )
	}
	this.reap()
}})

$jin.method({ '$jin.atom..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		masters[ id ].dislead( this )
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

$jin.method({ '$jin.atom..destroy': function( ){
	this.disleadAll()
	this.disobeyAll()
	if( this._scheduled ){
		var queue = $jin.atom.scheduled[ this._slice ]
		queue[ this._id ] = null
	}
	return this['$jin.klass..destroy']()
}})

$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin( '$jin.atom.logging', '$jin.atom' )
}})

$jin.method({ '$jin.atom.logging..notify': function( ){
	var ctor = this.constructor

	ctor.log().push([ this._config.name || this._id, this._value, this._masters ])

	if( !ctor._deferedLogging ){
		ctor._deferedLogging = $jin.schedule( 0, function defferedLogging( ){
			ctor._deferedLogging = null
			console.groupCollapsed('$jin.atom.log')
			ctor.log().forEach( function jin_atom_defferedLog( row ){
				$jin.log.apply( $jin, row )
			} )
			console.groupEnd('$jin.atom.log')
			ctor.log( [] )
		} )
	}

	return this[ '$jin.atom..notify' ]()
}})

$jin.property({ '$jin.atom.logging.log': function( ){
	return []
}})

;//../../jin/atom/prop/jin-atom-prop.jam.js?=HSN8TLKO
$jin.definer({ '$jin.atom.prop': function( path, config ){
    
	var pull = config.pull
	if( pull ) pull.jin_method_path = path + '.pull'

	var put = config.put
	if( put ) put.jin_method_path = path + '.put'

	var push = config.push
	if( push ) push.jin_method_path = path + '.push'

	var merge = config.merge
	if( merge ) merge.jin_method_path = path + '.merge'

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
        
        return this[ fieldName ] = $jin.atom(
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
        
        return atomHash[ key ] = $jin.atom(
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

;//../../jin/state/jin_state.jam.js?=HSN8TMCG
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

;//../../jin/env/jin_env.jam.js?=HOPSL9XS
this.$jin.env = $jin.value( function(){ return this }() )

;//../../jin/alias/jin_alias.jam.js?=HSN8TLKO
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

;//../../jin/listener/jin_listener.jam.js?=HSN8TMCG
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

;//../../jin/event/jin_event.jam.js?=HSN8TMCG
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

;//../../jin/support/jin_support.env=web.jam.js?=HSN8TMCG
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

;//../../jin/vector/jin_vector.jam.js?=HSN922CW
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

;//../../jin/dom/event/jin_dom_event.env=web.jam.js?=HSN8TLKO
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
    return $jin.vector([ this.nativeEvent().offsetX, this.nativeEvent().offsetX ])
} )

;//../../jin/dom/event/jin_dom_event_onBlur.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onBlur': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onBlur.type', function( ){
    return 'blur'
} )

;//../../jin/dom/event/jin_dom_event_onClick.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onClick.type', function( ){
    return 'click'
} )

;//../../jin/dom/event/jin_dom_event_onInput.env=web.jam.js?=HSN8TLKO
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

;//../../jin/dom/event/jin_dom_event_onPress.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onPress': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onPress.type', function( ){
    return 'keydown'
} )

;//../../jin/dom/event/jin_dom_event_onWheel.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onWheel': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onWheel.type', function( ){
    return 'wheel'
} )

;//../../jin/dom/event/jin_dom_event_onChange.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onChange': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onChange.type', function( ){
    return 'change'
} )

;//../../jin/dom/event/jin_dom_event_onResize.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onResize': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onResize.type', function( ){
    return 'resize'
} )

;//../../jin/dom/event/jin_dom_event_onScroll.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onScroll': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onScroll.type', function( ){
    return 'scroll'
} )

;//../../jin/dom/event/jin_dom_event_onDoubleClick.env=web.jam.js?=HSN8TLKO
$jin.klass({ '$jin.dom.event.onDoubleClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onDoubleClick.type', function( ){
    return 'dblclick'
} )

;//../../jin/dom/selection/jin-dom-selection.jam.js?=HSN8TLKO
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

;//../../jin/doc/jin_doc.jam.js?=HSN92A2O
$jin.klass({ '$jin.doc': [ '$jin.dom' ] })

$jin.method({ '$jin.doc.exec': function( node ){
	if( !arguments.length ) node = window.document
	
	var doc = node[ '$jin.doc' ]
	if( doc ) return doc
	
	return node[ '$jin.doc' ] = this['$jin.dom.exec']( node )
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

;//../../jin/dom/range/jin-dom-range.env=web.jam.js?=HSN8TLKO
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
	if( !html ) return $jin.dom( this.nativeRange().cloneContents() ).toString()
	
	var node = $jin.dom( html )
	this.replace( node )
	
	return this
}})

$jin.method({ '$jin.dom.range..text': function( text ){
	if( !text ) return $jin.dom.html2text( this.html() )
	
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

;//../../jin/dom/jin_dom.jam.js?=HSN9JUSG
$jin.klass({ '$jin.dom': [ '$jin.wrapper' ] })

$jin.method( '$jin.wrapper.exec', '$jin.dom.exec', function( node ){
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

;//../../jin/dom/jin_dom.env=web.jam.js?=HSN922CW
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
    
    $jin.mixin( '$jin.dom.ms', '$jin.dom' )
    
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

;//../../jin/state/local/jin_state_local.env=web.jam.js?=HSN8TMCG
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

;//../../jin/sample/jin_sample.jam.js?=HSN9JUSG
$jin.klass({ '$jin.sample': [ '$jin.dom' ] })

$jin.property({ '$jin.sample.strings': String })

$jin.property({ '$jin.sample.templates': function( ){
	var strings = $jin.sample.strings()
	if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
	return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
}})

$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample.exec': function( type ){
	var pool = $jin.sample.pool( type )
	var sample = pool.shift()
	
	if( !sample ){
		var proto = $jin.sample.proto( type )
		proto.rules()
		var node = proto.nativeNode().cloneNode( true )
		sample = this[ '$jin.dom.exec' ]( node ).proto( proto )
	}
	
	return sample
}})

$jin.atom.prop({ '$jin.sample..view': {
	push: function( next, prev ){
		if( next === prev ) return prev
		
		if( prev ){
			var protoId = this.proto().id()
			var prevSample = prev.sample( protoId )
			if( prevSample === this ) prev.sample( protoId, void 0 )
		}
		
		if( next == null ){
			var protoId = this.proto().id()
			var pool = $jin.sample.pool( protoId )
			pool.push( this )
		}
		
		return next
	}
}})

$jin.property({ '$jin.sample..covers': null })

$jin.property({ '$jin.sample..proto': function( proto ){
	
	var node = this.nativeNode()
	var rules = proto.rules()
	var sample = this
	var covers = []
	var protoId = proto.id()
	
	rules.forEach( function ruleIterator( rule ){
		var current = node
		
		var pull = function jin_sample_pull( prev ){
			try {
				var view = sample.view()
				if( !view ) return null
				
				return view[ rule.key ]()
			} catch( error ){
				if( error instanceof $jin.atom.wait ) return null
				throw error
			}
		}
		
		var fail = function( error ){
			$jin.log.error( error )
		}
		
		rule.path.forEach( function pathIterator( name ){
			current = current[ name ]
		} )
		
		if( rule.attrName ){
			var cover = $jin.atom(
			{	name: '$jin.sample:' + protoId + '/' + rule.path.join( '/' ) + '/@' + rule.attrName + '=' + rule.key
			,	pull: pull
			,	fail: fail
			,	push: function attrPush( next, prev ){
					if( next == null ) current.removeAttribute( rule.attrName )
					else current.setAttribute( rule.attrName, String( next ) )
				}
			})
			if( /^(value|checked)$/i.test( rule.attrName ) && /^(select|input|textarea)$/i.test( current.nodeName ) ){
				var handler = function( event ){
					var view = sample.view()
					if( !view ) return
					view[ rule.key ]( current[ rule.attrName ] )
				}
				sample.entangle( $jin.dom( current ).listen( 'input', handler ) )
				sample.entangle( $jin.dom( current ).listen( 'change', handler ) )
				sample.entangle( $jin.dom( current ).listen( 'click', handler ) )
			}
		} else if( rule.fieldName ){
			var cover = $jin.atom(
			{	name: '$jin.sample:' + protoId + '/' + rule.path.join( '/' ) + '/' + rule.fieldName + '=' + rule.key
			,	pull: pull
			,	fail: fail
			,	push: function fieldPush( next, prev ){
					if( next === void 0 ) return
					if( current[ rule.fieldName ] == next ) return
					current[ rule.fieldName ] = next
				}
			})
			if( /^(value|checked)$/i.test( rule.fieldName ) && /^(select|input|textarea)$/i.test( current.nodeName ) ){
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
			}
		} else if( rule.eventName ){
			var listener = $jin.dom( current ).listen( rule.eventName, function eventHandler( event ){
				var view = sample.view()
				if( !view ) return
				
				var handler = view[ rule.key ]
				if( !handler ) throw new Error( 'View handler in not defined (' + rule.key + ')' )
				
				handler.call( view, $jin.dom.event( event ) )
			})
			sample.entangle( listener )
			return
		} else if( rule.event ){
			var listener = rule.event.listen( current, function eventHandler( event ){
				var view = sample.view()
				if( !view ) return
				
				var handler = view[ rule.key ]
				if( !handler ) throw new Error( 'View handler in not defined (' + rule.key + ')' )
				
				handler.call( view, event )
			})
			sample.entangle( listener )
			return
		} else {
			var cover = $jin.atom(
			{	name: '$jin.sample:' + protoId + '/' + rule.path.join( '/' ) + '=' + rule.key
			,	pull: pull
			,	fail: fail
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
						if( item['$jin.view..element'] ) return item.element()
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
							var node = item[ '$jin.dom..nativeNode' ] ? item.nativeNode() : item
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
		}
		
		sample.entangle( cover )
		
		covers.push( cover )
		
		$jin.atom.bound( function( ){
			cover.pull()
		})
	} )
	
	this.covers( covers )
	
	return proto
}})

;//../../jin/sample/jin-sample-proto.jam.js?=HSN8TMCG
$jin.klass({ '$jin.sample.proto': [ '$jin.registry' ] })

$jin.property({ '$jin.sample.proto..nativeNode': function( ){
	var selector = '[' + this.id() + ']'
	
	var node = $jin.sample.templates().cssFind( selector )
	if( !node ) throw new Error( 'Sample not found (' + selector + ')' )
	
	return node.raw()
}})

$jin.property({ '$jin.sample.proto..rules': function( ){
	var node = this.nativeNode()
	
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
					rules.push({ key: key, path: path.slice() })
					
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
			for( var i = 0; i < attrs.length; ++i ){
				var attr = attrs[ i ]
				
				var found = /^\{(\w+)\}$/g.exec( attr.nodeValue )
				if( !found ) continue
				var key = found[1]
				
				rules.push({ key: key, path: path.slice(), attrName: attr.nodeName })
			}
			
			var props = node.getAttribute( 'jin-sample-props' )
			if( props ){
				props.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var subPath = chunk.split( /[-_:=.]/g )
					var key = subPath.pop()
					var fieldName = subPath.pop()
					
					rules.push({ key: key, path: path.concat( subPath ), fieldName: fieldName })
				} )
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
						rules.push({ key: key, path: path.slice(), eventName: name })
					} else {
						var event = $jin.glob( eventName )
						if( !event ) throw new Error( 'Unknown event [' + eventName + ']' )
						rules.push({ key: key, path: path.slice(), event: event })
					}
				} )
			}
			
		}
	}
	
	collect( node )
	
	return rules
}})

;//../../jin/view/jin_view.env=web.jam.js?=HSN9JUSG
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

;//../../jin/plotter/jin-plotter.jam.js?=HSN91YI0
$jin.klass({ '$jin.plotter': [ '$jin.view' ] })

$jin.method({ '$jin.plotter..screen': function( ){
	return this.element().nativeNode().getContext( '2d' )
}})

$jin.method({ '$jin.plotter..colors': function( ){
	return [ '#f00', '#0a0', '#00f', '#aa0', '#a0a', '#0aa', '#390', '#039', '#903', '#309', '#930', '#093' ]
}})

$jin.atom.prop({ '$jin.plotter..rect': {
	pull: function( next ){
		var min = $jin.vector([ 0, 0 ])
		var max = $jin.vector([ 0, 0 ])
		
		var plots = this.plots()
		
		for( var id in plots ){
			var plot = plots[ id ]
			
			for( var x in plot ){
				x = Number( x )
				if( isNaN( x ) ) continue
				
				var y = plot[ x ]
				
				min = $jin.vector.merge( Math.min, min, [ x, y ] )
				max = $jin.vector.merge( Math.max, max, [ x, y ] )
			}
		}
		
		return { min: min, max: max }
	}
}})

$jin.atom.prop({ '$jin.plotter..plots': {} })

$jin.atom.prop({ '$jin.plotter..size': {
	pull: function(){
		return $jin.vector([ this.width(), this.height() ])
	}
}})

$jin.atom.prop({ '$jin.plotter..width': {
	pull: function(){
		return $jin.doc().size().x()
	}
}})

$jin.atom.prop({ '$jin.plotter..height': {
	pull: function(){
		return $jin.doc().size().y()
	}
}})

$jin.atom.prop({ '$jin.plotter..generation': {
	pull: function( prev ){
		var plots = this.plots()
		var screen = this.screen()
		var colors = this.colors()
		var rect = this.rect()
		var size = this.size()
		
		var mult = $jin.vector([ size.x() / ( rect.max.x() - rect.min.x() ), - size.y() / ( rect.max.y() - rect.min.y() ) ])
		var offset = $jin.vector([ - rect.min.x() * mult.x(), size.y() - rect.min.y() * mult.y() ])
		var plotIndex = 0
		
		screen.width = size.x()
		screen.height = size.y()
		screen.clearRect(0, 0, screen.width, screen.height )
		screen.font="25px Segoe UI"
		screen.globalAlpha = .9
		
		for( var id in plots ){
			var plot = plots[ id ]
			var color = colors[ plotIndex ]
			
			screen.beginPath()
			screen.strokeStyle = color
			
			for( var x in plot ){
				var y = plot[ x ]
				screen.lineTo( offset.x() + x * mult.x(), offset.y() + y * mult.y() )
			}
			
			screen.stroke()
			
			++ plotIndex
		}
		
		screen.fillStyle = 'gray'
		screen.textAlign = 'left'
		screen.fillText( "0", offset.x() + 5, offset.y() - 5 )
		
		return ( prev || 0 ) + 1
	}
}})

;//../../jin/trade/jin-trade.jam.js?=HSN91YI0
$jin.klass({ '$jin.trade': [ '$jin.view' ] })

$jin.atom.prop({ '$jin.trade..graph': {
	pull: function( ){
		try {
			return this.make( 'graph', $jin.plotter ).plots( this.plots() )
		} catch( error ){
			return error.message
		}
	}
}})

$jin.atom.prop({ '$jin.trade..plots': {
	pull: function( ){
		var next = {}
		
		next.btc2usd = this.history()
		next.volume = this.volume()
		
		var strategies = this.strategies()
		var fees = this.fees()
		var startBudget = this.startBTC() 
		
		for( var strategyId in strategies ){
			var strategy = new strategies[ strategyId ]
			
			var strategyHistory = Array( next.btc2usd.length )
			var btc = startBudget
			var usd = 0
			var maxBudget = 0
			
			for( var index = 0; index < next.btc2usd.length; ++index ){
				var value = next.btc2usd[ index ]
				var command = strategy.learn( value, budget, fees )
				
				if( command === 'exchange' ){
					command = btc ? 'prefer-usd' : 'prefer-btc'
				}
				
				if( command === 'prefer-btc' && usd > 0 ){
					usd -= usd * fees
					btc += usd / value
					usd = 0
				}
				
				if( command === 'prefer-usd' && btc > fees ){
					btc -= btc * fees
					usd += btc * value
					btc = 0
				}
				
				var budget = usd + btc * value
				if( budget > maxBudget ) maxBudget = budget
				
				strategyHistory[ index ] = budget / startBudget
				
				if( budget < maxBudget * .66 ) break;
				if( budget < startBudget * .9 ) break;
			}
			
			next[ strategyId ] = strategyHistory
		}
		
		return next
	}
}})

$jin.atom.prop({ '$jin.trade..legend': {
	pull: function( ){
		var plots = this.plots()
		var colors = this.graph().colors()
		var items = []
		var index = 0
		for( var name in plots ){
			items.push( this.make( name, $jin.trade.legend.item ).name( name ).color( colors[ index ] ) )
			++index
		}
		return items
	}
}})

$jin.atom.prop({ '$jin.trade..history': {
	pull: function( prev ){
		var history = $jin.state.local.item( this.id() + ';history' )
		if( history ){
			var time = Number( $jin.state.local.item( this.id() + ';history;time' ) ) || 0
			history = history.split( ',' ).map( Number )
		}
		
		if( !time || ( time + 1000 * 60 * 5 ) < Date.now() ){
			var id = 'jin_trade_jsonp_' + Date.now()
			var script = document.createElement( 'script' )
			var url = 'https://www.cryptsy.com/json/ajaxtradechartmonth_3.json?callback=' + id
			script.src = 'http://jsonp.jit.su/?url=' + encodeURIComponent( url ) + '&callback=' + id
			window[ id ] = function( data ){
				delete window[ id ]
				document.body.removeChild( script )
				var history = data.map( function( moment ){
					return 1 / moment[ 1 ] // open
				})
				$jin.state.local.item( this.id() + ';history', history )
				$jin.state.local.item( this.id() + ';history;time', Date.now() )
			}.bind( this )
			document.body.appendChild( script )
		}
		
		if( !history ) throw $jin.atom.wait( 'Loading month history from cryptsy.com...' )
		
		//var history = [1006.82,1008.57,1008.63,1009.84,1009.65,1007.26,1010.79,1011,1018.4,1020.82,1018.52,1021.84,1021.71,1021.18,1016.28,1018.09,1016.36,1016.47,1016.24,1016.15,1017.96,1019.26,1015.36,1015.16,1017.98,1016.95,1015.27,1015.04,1015,1012.55,1005.54,1011.84,1004.22,1003.72,1004.72,1004.18,1003.74,1003.8,1003.77,1003.79,1003.7,1012.12,1001.2,1001.03,1001.05,1001.01,1008.83,1001.28,1010.76,1003.81,1007.71,1007.94,1008.72,1006.05,1006.52,1003.88,1012.41,1012.91,1010,1012.42,1014.63,1010.21,1006.8,1010.33,1011,1007.07,1012.14,1007.93,1008.77,1012.02,1013.75,1013.86,1013.93,1006.41,1007.13,1006.01,1006.36,1011,1011.14,1012.05,1011,1011.28,1013.45,1014.78,1010,1010,1009.64,1007.79,1006.65,1009.62,1010,1010,1010,1010.93,1010,1010,1009.73,1010.77,1008.84,1008.84,1008.87,1009,1007.18,1005.71,1005.33,1005.26,1004.47,1004.47,1010.24,1004.47,1007.1,1003,1008.25,1003.1,1003.11,1009.4,1013.89,1005.01,1014.66,1005.89,1006.01,1006.01,1006.02,1006.12,1006.12,1006.12,1006.01,1006,1006.02,1006,1006.02,1006,1005.89,1001.06,998.03,995.87,994.51,998.27,998.79,993.35,995.33,998.93,997.01,993.35,996.41,994.37,994.6,993.46,993.1,993.3,995.03,994.77,993.07,991.03,990.39,989.92,991.72,986.95,986.27,987.8,987.22,990.27,987.49,991.99,992,998.04,993.2,999.88,999.87,1003.5,993.39,999.15,1003.75,1000.69,1001,1002.35,995.78,996.94,994.01,998.81,994.78,994.34,1001.61,1001,1000,992.48,991.21,998.4,989.86,989.25,998.49,997,987.28,986.3,993.31,986.31,987,987,987.09,987.07,987.06,987,987,988.84,987.23,987.2,986.32,985.9,986.04,994.52,989.93,987,989.22,986.71,985.6,986.05,985.54,985.48,986,985.48,985.48,985.48,988.52,984.47,984.96,985.29,984.89,985.3,985.25,984.47,984.46,992.9,985.6,984.93,984.92,984.93,984.83,991.8,989.39,985.44,989.81,984.61,984.53,984.45,987.81,984.45,986.05,985.18,990,985.32,985.22,985.84,985.69,984.88,985.14,984.57,985.46,988.82,984.64,987.21,986.36,991.1,994,994.38,993.32,993.99,994.1,990.83,990,994,994.09,994.44,994.44,990.11,994.37,992.2,994.17,993,993.75,994.3,993.25,992.82,995,996.98,994.69,996,995.5,995.39,994.15,996.6,995.89,994.3,996.1,996.94,993,992.9,992.66,992.26,996,997.38,998,996.17,993.23,991,993.22,985.65,985.54,985.95,986.06,984.33,985,985.09,983.5,983.5,983.5,984,988.52,984,984,983.5,983.47,983.45,983.34,981.1,979.84,979,978.97,978.69,978.51,978.48,978.45,978.45,978.45,978.45,978.45,977.9,976.49,976.45,976.46,976.6,976.45,976.45,976.49,976.45,976.49,981.52,977,980.52,978.63,976.93,976.61,976.46,976.46,976.5,977,977.5,977.5,977.5,977.5,980.62,982.57,982.56,982.57,983.35,979.33,983.49,981,983.5,983.5,983.5,981.24,980.92,983.5,981.13,983.5,983.5,983.25,983.43,983.49,983.4,983.5,983.46,983.5,980.39,983.5,983.5,983.5,983.49,983.5,983.32,983.32,983.5,983.32,983.47,983.32,983.32,983.31,983.5,983.5,983.5,983.5,983.5,983.5,992.91,988.95,984.11,983.19,983.3,984.3,987.08,989.79,989.79,989.79,987,986.91,985.24,988.76,989.79,989.79,986.74,986.72,989.6,991.37,990.3,992,991.79,990.29,992,992,992,990.44,992,990.41,990.19,990.19,990.18,991.52,991.92,992,986.54,988.1,986.04,981.01,983.26,980.03,978.73,982.9,977.28,977.96,980,979.44,983.88,985,977.24,977.26,983.68,977.12,977.49,976.94,977.6,976.5,976.51,976.4,976,975.95,978,976.59,976,976,976.01,976,976,979.99,976.26,975.08,977.94,979.96,974.55,973.03,973.9,973.9,973.91,973.36,973.03,973.06,978.7,978.7,979.48,980,970.16,970,966,966,966.47,967.73,974.43,973.24,966.14,966.18,975.73,975,974.98,974.93,974.91,974.89,967.11,974.41,965.34,971,963.11,970.67,964.29,964,961.13,960.08,960.02,962.94,963.14,960.11,962.2,960.42,969.21,964.1,962.23,962.26,962.01,960.16,960.01,959.78,956.48,956.14,955.16,957.49,959.44,955.01,961.48,955.03,957.38,955.18,955.6,954.74,958.41,955.6,954.18,953.01,953.31,954.17,956.28,953.04,957.72,959.78,953.68,961.11,968.48,956.98,968.73,969.51,967,965.12,966,967.96,967.97,967.98,967.99,967.98,967.99,967.98,966,965.99,958.1,958.39,952.91,956.55,952.62,957,955.85,960.9,960.91,960.95,952.91,953,958.9,958.9,953.15,958.83,958.9,956.76,953.33,958.49,953.42,953.33,948.89,952.61,948.06,929.26,927.61,936.42,942.41,940,940,935.45,940,939.98,939.94,939.94,939.95,935.87,930.51,932.2,931.83,937,940.21,945.22,947.91,946,947.86,950.98,956.26,949.62,950.03,942.46,942.2,941.71,941.68,938.03,933.04,937.89,930.52,937.26,938.13,940,940,940.85,933.49,938.79,944.96,944.93,943.4,946.99,944.62,946.96,937.09,937.82,945.7,945,945.33,946,946,941.13,946,946,946,942.75,941.86,946,940.2,945.87,945.88,940.95,940.36,945.85,945.83,945.05,945.78,945.78,940.54,944.47,945,940.76,944.47,945.12,945.82,948.89,945.19,953.06,951.38,951.2,950.1,954.71,955.41,957,957.84,958,958.48,959.07,962.01,960.8,962.24,963.19,964.82,963.26,961.74,955.03,950.58,951.57,956.55,952.54,953.24,952.15,954,953.35,953.37,951.43,951.68,951.45,951.49,951.79,951.5,950.11,952.67,950.57,952.89,950.08,954.21,955.04,961.11,960.96,954.71,957.48,955.59,960.01,956.29,956.07,955.7,950.94,955.44,950.05,949.29,949.95,949.57,948.09,950,948.38,948.57,948.65,948.02,948.12,948.15,948.03,949.63,948,955.98,952.24,954.37,950.23,948.37,949.36,950.72,948.5,948.41,948,948.14,948.1,949.57,948.3,953.26,949.13,949,956.84,956.66,950.12,956.92,958.01,964.2,966.44,960.48,960.65,960.48,962.89,964.46,960.04,962.48,965,966.9,966.82,967,960.29,957.46,958,963.11,957.7,964.32,958,958,958,958.1,960,964.49,964.24,960,960.62,963.41,956.88,958.98,961.87,957.57,955.2,962.08,961.16,955.02,955.74,955.01,961.92,961,960.85,961.07,962.3,965.85,967.13,962.67,959.63,959.59,959.59,959.37,959.59,959.59,964,968.35,968.77,961.5,968.68,961.52,961.61,967,967,967,967.84,967.01,965.88,967.27,964.95,964.21,963.8,964.47,964,963.96,963.81,963.84,962.28,962.29,962.28,962.3,962.28,965,955.4,949.99,950,950,950.71,959,959,959.13,951.18,951,951,958.55,959.48,955,953.31,950.29,949.67,954.76,954.79,954.88,954.9,954.9,950.89,954.9,949.57,949.56,953.99,952.29,949.58,949.56,952.89,954.8,950.05,950.49,954.8,952.66,949.59,949.23,949,949.03,953.32,953.99,951.72,954,950.7,954,953.74,954,951.38,951.79,951.84,952.91,950.64,951.6,957.78,956,951.85,948.04,957.93,954,951.85,948.28,946.1,954,955.15,956,955.45,955,954.99,954.98,947.26,954.99,955,950,949.9,946.53,954.99,954.99,953,951.5,953,951.55,946.26,950,948.22,949.54,948.47,949.26,948.97,948.96,948.85,949,948.37,947.66,948.79,952.77,952.78,953.88,953.88,953.55,953.25,950,948.29,953.01,951.49,955,952.49,950,949.68,955.17,956.96,956.91,956.89,956.86,956.52,955.25,955.25,955.25,947.87,952.89,956.28,956.84,956.57,954.2,957,957,957,957,953,952.91,956.96,954.21,955,955,957,957.56,959.86,958.74,958.9,959.45,958.74,950.98,951.61,957,952.88,958,957,950.66,951.44,950.28,949.96,950,950,949.9,949.92,949.99,949.96,949.9,949.04,949,947.16,946,946,945.79,945.17,945.16,944.63,943.23,949.33,948.07,943.11,943.1,943.1,943.52,947.77,943.9,948.8,949.46,944.01,948.21,947.85,944,948.08,942.63,946.95,943.67,943.15,942.37,945.16,942.64,942.23,945.23,943.45,942.2,945,945,944.81,943.39,945.66,945.8,944.54,943.18,943.33,945.8,942.34,945.37,948.12,945.34,943.17,944.25,942.77,942.34,946.91,943,943.94,943.8,947.2,948.4,945.77,945.75,946.8,946.8,941.3,942.79,944.91,940.15,954.26,946.16,945.25,956.78,955.94,945.62,945.35,945.02,947.21,947.22,946.08,948.08,946.05,949,945.14,944.36,944.36,944.88,943.83,941.36,949.03,944.7,944.97,944.84,944.35,944.55,940.9,940.96,940.99,940.06,940.13,940,940,940.59,940.01,940,940,940.07,940,940,940,940.1,940.1,940.94,940.47,940.98,940.51,940,940.36,940,940,940,940,940.38,939.37,939.24,939.38,938,940.53,938.11,939.07,938.79,940.97,941.44,946.18,944.03,942.56,942.27,939.7,937.91,937.14,937.15,937.14,942.2,940.45,936.03,932.9,930.02,930.4,929.51,931.76,933.34,930.35,931.17,931.86,930.33,930.03,930.03,930.04,930.07,927.73,928,928.01,937.18,929.63,930.52,928.21,928.03,936.96,928.03,928.03,929.44,936.83,928.03,936.46,928.43,928.07,936.51,928.1,938.03,939.44,939.61,928.51,929.7,930.11,930.91,936.14,939.32,935.61,937.2,939.86,939.71,939.85,940,940.98,941,945.3,942.09,945.33,946.8,943.52,942.04,940.84,938.59,942.82,943.37,943.46,940.92,940.48,943.11,938.39,938.66,946.07,940.63,941.36,946.91,944.67,942.15,941.76,937.97,934.5,942.51,942.65,939.59,943.55,942.18,938.29,935.67,936.37,937.48,935.02,935.02,935.02,929.6,928.12,928.84,929.72,927.57,927.4,930.53,928.37,932,927.51,927.57,927.88,927.8,929.86,923.53,928.84,926.06,921.3,929.83,921,922.07,926.88,927.77,926.79,923.98,928.32,922.51,922.42,922.17,929.62,923.02,923.02,927.74,924.29,922.28,922.2,926.65,928.18,926.63,924.38,927.37,928.75,928.88,928.73,923.26,931.02,923.17,932.98,934.4,928.05,925.37,933.36,927.59,926.26,926.99,926.62,926.12,929.98,927,929.65,930.26,927.64,928.69,927.15,925.97,929.32,926.77,933.62,925.21,925.21,930.9,930.48,932.89,933.26,934.9,931.73,934.9,934.89,934.89,934.89,934.89,936.26,933.77,933.46,937.9,933.88,933.26,933.46,939.68,933.66,938.09,938.17,936.28,933.01,935.15,940.46,941,941.9,937.61,942.2,943.68,944.22,945.44,945.58,945.56,940.05,945.5,944,944,944,940.02,943.59,943.83,943.88,943.89,943.89,943.89,925.28,916.05,914.15,912.45,913.3,915.54,923.12,916.11,917.82,912.73,912.3,915.94,912.92,919,913.15,912.5,914.12,918.5,917.36,918.44,918.47,918.5,919.9,922.5,922.5,916.32,915.5,915.3,920,919,919.07,920.47,922.01,922.5,922.5,922.5,922.5,922.48,923,922.72,917.75,916,923.9,924,923.6,918,920,920,920,922.01,923.45,923.19,920,922.22,918.7,918.7,918.7,923.99,924.28,924.7,924.64,918.61,918.77,916.78,920,920,918.78,924.41,918.7,922.89,918.7,923,918.22,919.9,919.4,918.7,916,918.7,915.14,915.85,913.31,913.91,914,913.66,911.54,910.35,910,910,909.41,907.79,907.19,907.78,907.17,907.04,907.24,907.42,907.79,909.96,907.49,908.7,909.96,908.71,907.98,915.8,916.21,912.73,915.91,921.34,922,912.34,909.25,908.55,913.45,921.2,915.91,910.5,915.86,911.19,911.19,921.71,910.94,910.12,910.04,915,915,911,911,911,910.95,910.1,910.02,910.01,910.98,910.57,913.39,914.61,912.65,913,921.7,921.9,921.9,922,922.89,924.45,915.56,915.56,915.55,925.39,928.89,918.96,927.9,927.9,917.76,917.31,913.57,919.16,923,920.5,920.65,915.01,915.01,922.83,915.29,915.5,915.09,913.15,912.36,912.15,912.01,918.6,922.69,924.25,919.98,921.8,920.48,922.16,923.86,920.1,920.1,920.1,920,916.78,912.45,910.69,911.16,910.71,919.39,920.45,910.1,910.01,910.01,918.08,911,911,925.69,913.2,916.25,916.93,914.82,914.99,916.8,918,917.49,916.72,916.59,915.99,917.28,926.08,916.1,916.31,916.36,917,920.86,922.81,917.01,917.01,917.01,917.01,917.01,923.9,918.01,918.01,918,918,923.41,918,927.56,931.33,931.18,931.46,932.15,930.16,934.53,935.01,935.34,934.47,931.16,931.23,930.33,930,929.92,932,930,929.9,929.89,931.33,930.99,927.87,931.03,927.87,927.87,932.56,927.87,927.86,927.86,927.86,927.68,927,927,927.21,927.87,927.87,927.87,925.85,927.58,927.68,925,925.6,923.84,923.84,923.84,924.47,923.84,923.84,923.84,922.83,927.87,920.17,920.16,926.83,920.9,926.99,920.16,920.16,920.16,926.97,926,926,920.17,926,919.03,924.5,916.91,915.77,915.77,924.92,915.97,915.77,924.71,915.45,923.2,922.12,924.61,921.84,915.6,923,916.02,916.05,923,923,918.93,917.51,915.93,922.64,916.16,916.16,916.18,915.78,915.14,915.15,915.14,919,915.01,918.95,919,915.12,916.63,919,920,916,919,919,919,917.46,919,918.86,919.53,919,915.4,919.18,914.91,918.86,914.11,914.11,914.11,914.11,914.11,913.27,911.54,911,910.3,915.71,911,910.92,916,915.99,910.1,916,916,914.68,915.9,915,915,915,915,915.12,915.83,915.9,914.12,916.82,910.22,918,911.43,919.93,921.34,921.45,921.45,916.17,918,918.56,920.23,920,921,921.06,915.33,915,921.39,915,914.86,912.33,910.3,907.2,910,905.38,918.98,916.99,916.74,907.52,911.42,907.32,908.24,905.2,905.2,909.99,910,910.84,905.75,905.49,909.98,905.15,905.07,910.6,909.83,904.66,910.92,910.86,902.89,903.08,903.32,901.2,901,901.69,900.61,900.46,900.02,900.03,902.1,894.11,885,888.18,887.64,886.23,883.11,889.92,888.7,890.46,889.87,896.84,894.4,891.25,893.7,890.59,891.47,895.95,898.01,904.72,909.98,909.94,909.93,909.55,902.54,898.11,905,904.06,906.23,901.93,902.32,904.8,897.67,890.55,894.96,885.79,883.72,883.97,884.92,890,890,890.81,885.79,892.6,890.23,894.72,894,895,890.1,895,899.22,895.34,900,895.13,890.3,895.03,898.99,895.16,896.36,895.15,895,895.09,897.07,899,896.36,896.82,895.86,895.09,895,899.8,899.08,898.4,899.07,900.91,895.43,900,902.88,900,900,900.23,902.08,900.11,898.96,898.94,897.84,895,894.41,898.86,898.14,898.57,900,900.08,902,903.96,903.85]
		//var history = [644.83,643.38,642.88,642.82,642.72,641.29,642.77,642.53,641.52,643.92,641.57,643.49,641.22,640.32,641.08,641.28,641.55,641.55,642.15,644.03,641.21,642.38,644.72,645.38,645.76,646.59,644.76,643.46,647.57,646.27,645.94,645.0,647.81,643.35,641.55,641.29,641.81,641.27,643.18,640.86,643.79,637.76,641.28,641.28,644.27,644.29,644.29,643.17,643.05,641.35,640.6,640.57,641.6,643.68,645.01,644.61,641.37,645.1,643.36,646.0,643.21,646.6,642.73,642.85,644.61,647.74,639.59,638.59,638.59,637.81,637.74,638.76,638.48,637.05,641.55,638.58,639.68,635.64,635.19,638.41,636.59,637.54,637.04,641.51,641.41,640.62,639.59,640.11,639.64,643.34,642.54,638.58,638.58,639.71,643.11,640.61,643.11,644.78,646.56,648.67,647.16,643.61,647.5,653.65,646.96,642.88,640.03,634.07,625.45,625.36,625.06,623.56,621.99,623.48,625.37,625.35,624.05,622.9,623.64,623.85,624.89,624.9,623.3,624.9,623.69,623.69,623.81,626.39,624.83,624.26,626.06,625.08,622.16,621.84,620.92,620.92,618.62,621.43,621.43,621.25,621.17,620.45,620.55,620.39,620.11,620.28,619.61,615.04,620.33,620.4,617.37,620.4,618.85,618.23,615.67,616.39,616.54,616.23,615.29,618.54,618.54,618.57,620.55,619.61,617.36,617.36,621.09,619.91,619.91,617.35,617.35,617.36,617.36,619.43,618.54,617.0,619.9,617.35,619.29,618.92,619.53,619.55,620.45,617.02,616.64,621.96,625.2,623.58,626.16,625.96,625.38,621.81,621.77,624.55,621.25,621.24,623.24,620.53,616.27,617.25,621.24,620.12,618.74,618.72,617.5,618.74,617.5,618.05,612.22,613.02,614.3,613.22,616.74,617.48,614.29,613.49,613.58,614.45,615.58,612.8,610.22,607.21,609.95,609.64,610.59,609.22,611.21,611.22,608.0,608.05,607.24,612.19,610.38,613.75,618.23,618.02,619.98,622.38,621.24,623.75,622.74,622.3,623.54,622.36,620.45,621.73,623.17,619.9,620.24,622.24,623.82,620.22,620.19,620.14,618.27,622.57,624.18,626.02,626.35,628.26,629.16,629.26,629.26,625.99,629.26,628.25,631.26,626.85,632.22,630.76,628.0,627.62,626.18,626.21,626.25,625.75,628.23,626.83,627.47,628.76,623.92,626.39,626.25,622.45,622.56,625.89,626.74,626.53,623.99,620.7,620.34,620.01,618.78,618.48,618.17,619.73,619.75,620.12,620.46,621.98,623.34,621.4,622.24,623.99,625.62,622.86,623.3,624.55,628.97,629.65,630.29,633.26,636.16,633.26,634.28,630.85,632.36,636.27,637.76,636.51,637.49,639.27,634.52,627.97,629.77,631.55,632.25,631.85,633.45,632.79,633.26,633.26,633.26,630.85,632.73,631.31,631.26,629.53,629.93,628.38,626.24,630.17,630.05,628.46,631.13,631.15,629.26,628.29,628.97,631.26,629.96,627.31,637.27,631.26,625.05,625.24,619.49,624.49,622.24,623.92,617.44,617.33,621.0,618.22,622.63,619.14,618.92,623.34,628.48,628.89,632.56,631.22,630.26,633.24,629.14,630.25,630.98,636.54,636.27,632.64,628.26,626.31,634.24,638.93,637.87,633.98,640.28,642.19,644.69,643.4,644.67,644.79,644.58,644.29,641.37,641.28,647.29,646.43,644.26,640.77,640.78,643.28,639.73,637.07,636.57,632.51,639.27,642.46,638.53,640.88,647.15,648.06,653.3,649.93,648.62,647.29,648.29,646.12,645.29,651.4,658.32,659.11,659.34,660.32,661.25,658.65,659.98,659.34,660.63,659.77,660.9,656.3,661.6,661.18,664.17,664.19,661.61,663.58,663.58,663.58,662.63,661.92,661.58,659.65,658.23,658.11,660.82,661.25,659.13,660.43,662.64,660.0,664.83,664.83,664.83,667.33,665.36,665.11,668.31,667.13,665.37,668.33,666.78,668.64,666.0,666.35,666.33,665.83,668.33,666.33,668.13,669.82,669.33,670.1,669.33,669.33,666.36,666.34,663.33,664.93,661.33,660.83,660.2,661.33,661.0,659.01,660.33,659.33,661.25,659.61,659.5,657.54,656.99,656.51,657.33,658.83,656.99,658.0,658.33,659.32,657.32,659.0,656.9,657.42,657.09,655.33,655.0,661.11,658.33,662.78,662.34,665.66,664.65,666.15,666.45,664.0,664.65,662.48,657.46,659.66,660.26,656.0,657.6,657.62,655.0,658.29,660.49,660.6,658.61,654.61,661.65,670.59,670.12,670.79,671.6,673.22,671.68,671.88,671.83,667.48,670.52,671.11,672.68,668.66,672.68,671.41,675.59,674.68,672.69,673.68,671.88,667.69,670.57,669.86,667.66,669.86,667.86,667.79,668.87,669.67,671.07,668.93,670.67,669.7,667.0,672.47,672.38,671.68,668.99,671.17,669.67,667.0,670.34,670.67,668.93,670.05,672.06,670.04,672.68,673.43,673.46,676.5,676.57,676.65,674.38,674.72,675.46,676.15,677.7,676.16,676.69,677.84,674.74,675.33,676.7,677.7,674.0,676.7,676.12,674.04,676.12,672.53,672.41,673.39,671.9,672.38,673.28,676.1,672.1,675.19,673.31,673.52,673.27,675.1,671.02,673.57,672.69,676.16,672.88,669.14,669.75,669.94,666.34,670.28,672.47,671.61,672.27,668.66,669.53,669.32,668.67,669.67,666.01,668.57,668.54,666.5,671.59,666.32,666.88,667.66,667.68,668.28,665.72,666.15,667.46,666.66,666.67,669.16,666.67,666.83,668.66,668.14,667.54,666.45,667.1,667.65,662.74,666.66,662.72,665.14,665.65,662.64,667.43,669.99,668.89,674.59,672.75,675.65,672.16,671.58,670.4,668.66,666.91,668.66,670.47,666.99,668.8,670.59,668.23,666.76,666.66,667.66,665.65,663.98,665.8,666.65,664.3,669.67,665.0,667.66,665.0,669.15,665.66,668.65,668.24,662.29,659.85,660.63,659.74,654.9,659.51,658.04,655.47,659.65,656.62,660.67,661.15,663.42,663.9,661.41,658.5,665.05,667.9,669.5,671.36,672.1,672.09,671.88,669.49,674.69,667.73,667.88,670.35,672.68,668.67,669.57,668.76,668.76,667.73,668.66,668.67,671.44,665.99,666.59,667.5,666.99,665.0,659.5,658.64,662.64,664.45,661.98,662.61,668.42,669.81,671.17,665.2,668.04,677.74,677.72,677.74,679.21,681.25,680.71,680.38,679.81,678.84,679.84,675.96,677.75,679.71,679.71,677.68,673.69,670.27,672.68,672.68,672.67,672.21,670.97,666.5,669.08,668.16,670.75,672.68,668.22,677.69,672.68,670.67,670.23,669.18,670.67,665.0,662.0,666.77,667.66,677.06,673.44,676.19,677.7,678.07,685.59,679.35,677.61,678.31,679.54,684.71,676.05,667.66,676.7,679.71,682.72,679.71,683.83,688.74,696.78,696.43,691.57,691.57,685.88,694.7,698.63,698.78,698.83,696.79,701.6,697.38,694.77,699.78,695.77,696.68,694.75,691.76,693.63,686.01,689.59,693.07,696.76,695.76,692.87,691.44,686.0,690.51,687.74,687.74,689.75,688.74,686.14,686.14,681.06,679.81,685.73,688.74,690.75,692.75,691.76,686.74,688.74,677.91,677.7,680.71,682.72,677.02,677.4,673.68,674.6,673.0,670.67,669.07,669.76,668.65,667.66,673.78,673.25,674.69,671.33,670.67,674.79,676.56,669.02,669.0,671.68,676.2,678.06,680.11,678.91,678.79,679.01,680.99,686.29,686.0,691.86,692.76,696.78,691.17,692.79,696.56,692.43,686.05,688.7,688.0,691.05,694.77,688.04,688.3,688.75,689.42,680.21,672.01,671.11,676.02,680.03,677.75,677.03,683.4,678.28,671.34,667.99,673.4,669.65,670.32,669.33,666.33,668.31,673.35,666.98,671.34,665.3,660.89,663.2,668.77,671.14,677.37,662.4,651.24,658.26,666.83,656.27,656.24,671.34,671.62,688.9,690.74,683.4,701.79,685.41,675.06,693.45,703.5,657.72,651.16,634.79,627.16,626.24,623.78,629.77,629.24,620.2,620.49,619.73,628.42,626.74,622.41,611.62,607.45,593.32,592.61,594.04,593.35,594.62,594.61,595.07,596.75,595.08,595.55,596.71,593.55,595.48,596.06,596.68,597.06,593.84,597.17,599.58,600.58,598.62,594.6,591.83,592.53,593.92,586.14,595.56,597.3,593.57,607.47,605.61,603.59,601.54,600.08,597.08,595.63,590.05,589.01,592.91,593.54,590.53,594.04,587.59,580.45,574.28]
		//var history = [643.21,643.23,642.97,643.18,641.27,641.28,641.82,640.4,641.58,642.3,644.09,646.29,646.29,644.83,643.38,642.88,642.82,642.72,641.29,642.77,642.53,641.52,643.92,641.57,643.49,641.22,640.32,641.08,641.28,641.55,641.55,642.15,644.03,641.21,642.38,644.72,645.38,645.76,646.59,644.76,643.46,647.57,646.27,645.94,645.0,647.81,643.35,641.55,641.29,641.81,641.27,643.18,640.86,643.79,637.76,641.28,641.28,644.27,644.29,644.29,643.17,643.05,641.35,640.6,640.57,641.6,643.68,645.01,644.61,641.37,645.1,643.36,646.0,643.21,646.6,642.73,642.85,644.61,647.74,639.59,638.59,638.59,637.81,637.74,638.76,638.48,637.05,641.55,638.58,639.68,635.64,635.19,638.41,636.59,637.54,637.04,641.51,641.41,640.62,639.59,640.11,639.64,643.34,642.54,638.58,638.58,639.71,643.11,640.61,643.11,644.78,646.56,648.67,647.16,643.61,647.5,653.65,646.96,642.88,640.03,634.07,625.45,625.36,625.06,623.56,621.99,623.48,625.37,625.35,624.05,622.9,623.64,623.85,624.89,624.9,623.3,624.9,623.69,623.69,623.81,626.39,624.83,624.26,626.06,625.08,622.16,621.84,620.92,620.92,618.62,621.43,621.43,621.25,621.17,620.45,620.55,620.39,620.11,620.28,619.61,615.04,620.33,620.4,617.37,620.4,618.85,618.23,615.67,616.39,616.54,616.23,615.29,618.54,618.54,618.57,620.55,619.61,617.36,617.36,621.09,619.91,619.91,617.35,617.35,617.36,617.36,619.43,618.54,617.0,619.9,617.35,619.29,618.92,619.53,619.55,620.45,617.02,616.64,621.96,625.2,623.58,626.16,625.96,625.38,621.81,621.77,624.55,621.25,621.24,623.24,620.53,616.27,617.25,621.24,620.12,618.74,618.72,617.5,618.74,617.5,618.05,612.22,613.02,614.3,613.22,616.74,617.48,614.29,613.49,613.58,614.45,615.58,612.8,610.22,607.21,609.95,609.64,610.59,609.22,611.21,611.22,608.0,608.05,607.24,612.19,610.38,613.75,618.23,618.02,619.98,622.38,621.24,623.75,622.74,622.3,623.54,622.36,620.45,621.73,623.17,619.9,620.24,622.24,623.82,620.22,620.19,620.14,618.27,622.57,624.18,626.02,626.35,628.26,629.16,629.26,629.26,625.99,629.26,628.25,631.26,626.85,632.22,630.76,628.0,627.62,626.18,626.21,626.25,625.75,628.23,626.83,627.47,628.76,623.92,626.39,626.25,622.45,622.56,625.89,626.74,626.53,623.99,620.7,620.34,620.01,618.78,618.48,618.17,619.73,619.75,620.12,620.46,621.98,623.34,621.4,622.24,623.99,625.62,622.86,623.3,624.55,628.97,629.65,630.29,633.26,636.16,633.26,634.28,630.85,632.36,636.27,637.76,636.51,637.49,639.27,634.52,627.97,629.77,631.55,632.25,631.85,633.45,632.79,633.26,633.26,633.26,630.85,632.73,631.31,631.26,629.53,629.93,628.38,626.24,630.17,630.05,628.46,631.13,631.15,629.26,628.29,628.97,631.26,629.96,627.31,637.27,631.26,625.05,625.24,619.49,624.49,622.24,623.92,617.44,617.33,621.0,618.22,622.63,619.14,618.92,623.34,628.48,628.89,632.56,631.22,630.26,633.24,629.14,630.25,630.98,636.54,636.27,632.64,628.26,626.31,634.24,638.93,637.87,633.98,640.28,642.19,644.69,643.4,644.67,644.79,644.58,644.29,641.37,641.28,647.29,646.43,644.26,640.77,640.78,643.28,639.73,637.07,636.57,632.51,639.27,642.46,638.53,640.88,647.15,648.06,653.3,649.93,648.62,647.29,648.29,646.12,645.29,651.4,658.32,659.11,659.34,660.32,661.25,658.65,659.98,659.34,660.63,659.77,660.9,656.3,661.6,661.18,664.17,664.19,661.61,663.58,663.58,663.58,662.63,661.92,661.58,659.65,658.23,658.11,660.82,661.25,659.13,660.43,662.64,660.0,664.83,664.83,664.83,667.33,665.36,665.11,668.31,667.13,665.37,668.33,666.78,668.64,666.0,666.35,666.33,665.83,668.33,666.33,668.13,669.82,669.33,670.1,669.33,669.33,666.36,666.34,663.33,664.93,661.33,660.83,660.2,661.33,661.0,659.01,660.33,659.33,661.25,659.61,659.5,657.54,656.99,656.51,657.33,658.83,656.99,658.0,658.33,659.32,657.32,659.0,656.9,657.42,657.09,655.33,655.0,661.11,658.33,662.78,662.34,665.66,664.65,666.15,666.45,664.0,664.65,662.48,657.46,659.66,660.26,656.0,657.6,657.62,655.0,658.29,660.49,660.6,658.61,654.61,661.65,670.59,670.12,670.79,671.6,673.22,671.68,671.88,671.83,667.48,670.52,671.11,672.68,668.66,672.68,671.41,675.59,674.68,672.69,673.68,671.88,667.69,670.57,669.86,667.66,669.86,667.86,667.79,668.87,669.67,671.07,668.93,670.67,669.7,667.0,672.47,672.38,671.68,668.99,671.17,669.67,667.0,670.34,670.67,668.93,670.05,672.06,670.04,672.68,673.43,673.46,676.5,676.57,676.65,674.38,674.72,675.46,676.15,677.7,676.16,676.69,677.84,674.74,675.33,676.7,677.7,674.0,676.7,676.12,674.04,676.12,672.53,672.41,673.39,671.9,672.38,673.28,676.1,672.1,675.19,673.31,673.52,673.27,675.1,671.02,673.57,672.69,676.16,672.88,669.14,669.75,669.94,666.34,670.28,672.47,671.61,672.27,668.66,669.53,669.32,668.67,669.67,666.01,668.57,668.54,666.5,671.59,666.32,666.88,667.66,667.68,668.28,665.72,666.15,667.46,666.66,666.67,669.16,666.67,666.83,668.66,668.14,667.54,666.45,667.1,667.65,662.74,666.66,662.72,665.14,665.65,662.64,667.43,669.99,668.89,674.59,672.75,675.65,672.16,671.58,670.4,668.66,666.91,668.66,670.47,666.99,668.8,670.59,668.23,666.76,666.66,667.66,665.65,663.98,665.8,666.65,664.3,669.67,665.0,667.66,665.0,669.15,665.66,668.65,668.24,662.29,659.85,660.63,659.74,654.9,659.51,658.04,655.47,659.65,656.62,660.67,661.15,663.42,663.9,661.41,658.5,665.05,667.9,669.5,671.36,672.1,672.09,671.88,669.49,674.69,667.73,667.88,670.35,672.68,668.67,669.57,668.76,668.76,667.73,668.66,668.67,671.44,665.99,666.59,667.5,666.99,665.0,659.5,658.64,662.64,664.45,661.98,662.61,668.42,669.81,671.17,665.2,668.04,677.74,677.72,677.74,679.21,681.25,680.71,680.38,679.81,678.84,679.84,675.96,677.75,679.71,679.71,677.68,673.69,670.27,672.68,672.68,672.67,672.21,670.97,666.5,669.08,668.16,670.75,672.68,668.22,677.69,672.68,670.67,670.23,669.18,670.67,665.0,662.0,666.77,667.66,677.06,673.44,676.19,677.7,678.07,685.59,679.35,677.61,678.31,679.54,684.71,676.05,667.66,676.7,679.71,682.72,679.71,683.83,688.74,696.78,696.43,691.57,691.57,685.88,694.7,698.63,698.78,698.83,696.79,701.6,697.38,694.77,699.78,695.77,696.68,694.75,691.76,693.63,686.01,689.59,693.07,696.76,695.76,692.87,691.44,686.0,690.51,687.74,687.74,689.75,688.74,686.14,686.14,681.06,679.81,685.73,688.74,690.75,692.75,691.76,686.74,688.74,677.91,677.7,680.71,682.72,677.02,677.4,673.68,674.6,673.0,670.67,669.07,669.76,668.65,667.66,673.78,673.25,674.69,671.33,670.67,674.79,676.56,669.02,669.0,671.68,676.2,678.06,680.11,678.91,678.79,679.01,680.99,686.29,686.0,691.86,692.76,696.78,691.17,692.79,696.56,692.43,686.05,688.7,688.0,691.05,694.77,688.04,688.3,688.75,689.42,680.21,672.01,671.11,676.02,680.03,677.75,677.03,683.4,678.28,671.34,667.99,673.4,669.65,670.32,669.33,666.33,668.31,673.35,666.98,671.34,665.3,660.89,663.2,668.77,671.14,677.37,662.4,651.24,658.26,666.83,656.27,656.24,671.34,671.62,688.9,690.74,683.4,701.79,685.41,675.06,693.45,703.5,657.72,651.16,634.79,627.16,626.24,623.78,629.77,629.24,620.2,620.49,619.73,628.42,626.74,622.41,611.62,607.45,593.32,592.61,594.04,593.35,594.62,594.61,595.07,596.75,595.08,595.55,596.71,593.55,595.48,596.06,596.68,597.06,593.84,597.17,599.58,600.58,598.62,594.6,591.83,592.53,593.92,586.14,595.56,597.3,593.57,607.47,605.61,603.59,601.54,600.08,597.08,595.63,590.05,589.01,592.91,593.54,590.53,594.04,587.59,580.45,574.28,571.42,569.67,571.38,571.41,573.43,575.42,572.92,573.42,570.32,573.42,573.44,573.44,581.2,581.18,577.71,577.71,579.47,579.22,578.33,576.58,576.27,575.49,575.46,572.0,571.4,569.39,568.39,570.1,569.64,568.49,573.38,570.89,570.8,572.41,573.41,571.62,571.42,575.54,575.54,574.98,574.94,574.43,573.97,572.73,571.2,566.57,565.69,573.42,558.46,556.83,558.33,560.34,561.34,559.75,558.2,558.34,561.81,562.58,564.62,563.36,563.95,564.93,563.66,563.81,561.85,562.56,565.21,565.37,564.94,564.58,564.96,567.38,564.0,564.37,562.35,562.35,565.27,564.84,562.41,560.54,564.34,558.6,563.36,564.27,564.22,565.35,565.93,566.84,565.44,568.94,563.99,566.93,566.71,565.93,562.0,564.92,561.59,564.93,562.91,565.6,564.54,560.9,562.9,563.62,567.83,568.41,568.7,564.85,568.14,567.93,569.36,565.5,569.54,567.95,569.63,570.67,572.98,573.05,573.39,569.99,571.33,574.85,571.34,573.87,572.99,573.69,572.98,573.11,573.11,567.01,571.97,571.77,572.98,573.28,571.95,572.49,572.98,573.18,573.7,572.49,568.5,571.26,569.52,569.73,568.95,566.94,566.94,569.44,565.26,568.65,568.65,568.51,566.33,566.34,562.4,566.19,562.98,565.04,563.29,565.93,568.64,568.65,567.46,568.61,567.47,567.83,566.93,568.8,567.1,573.74,572.04,573.94,573.94,572.68,572.68,573.02,576.13,575.63,575.62,575.62,574.04,572.89,572.78,572.78,572.78,572.78,572.79,572.56,572.54,567.45,572.59,566.76,572.87,572.96,573.08,572.11,574.12,576.69,577.9,578.14,579.04,574.0,577.29,580.95,580.18,580.15,574.0,578.94,579.16,578.16,578.16,577.8,578.13,578.16,578.65,578.73,578.96,577.26,576.95,571.74,578.16,574.0,577.11,576.31,576.64,577.22,577.57,570.44,576.25,571.6,576.71,575.7,580.36,579.39,576.57,569.14,561.39,568.69,568.85,567.84,570.59,571.72,571.31,571.28,571.28,567.85,561.0,569.88,571.21,572.91,568.15,562.44,560.0,565.76,565.88,567.85,567.84,565.54,564.81,568.36,561.22,569.36,564.82,567.52,563.91,564.15,567.06,566.83,567.55,569.85,570.38,570.38,562.5,568.85,570.86,570.88,562.21,570.09,568.04,569.97,569.36,570.09,571.86,571.14,571.05,567.84,568.85,569.15,566.84,564.98,574.87,566.91,574.74,571.58,566.23,567.79,565.81,566.4,564.8,565.24,567.84,565.6,562.87,570.21,569.26,571.21,561.62,564.14,565.95,563.53,564.05,565.08,556.07,561.77,563.13,561.1,559.34,558.78,554.53,550.99,558.27,557.58,559.44,552.37,544.32,548.9,556.16,557.41,553.35,548.86,553.85,548.74,545.31,547.34,554.5,547.16,555.41,559.34,561.46,559.25,565.48,563.41,562.26,563.8,563.09,563.17,569.15,559.98,561.46,562.21,559.44,567.39,569.02,566.05,562.48,572.54,577.56,577.42,580.62,577.58,582.47,582.6,581.6,580.1,582.32,581.86,580.85,577.49,581.5,582.6,576.95,581.61,581.52,581.62,581.69,578.1,574.56,574.56,575.47,574.09,571.54,571.4,575.52,576.96,577.55,574.56,573.1,571.54,576.58,572.38,569.74,562.37,562.46,559.66,562.0,568.21,562.46,563.46,562.69,561.35,562.65,564.46,561.36,562.46,567.72,570.73,571.54,572.4,572.54,571.23,569.52,573.06,570.9,572.75,575.15,575.55,565.1,574.54,569.73,583.62,582.62,583.05,577.02,581.4,576.09,579.61,579.6,580.05,579.99,580.06,578.03,573.51,579.45,577.7,578.79,581.62,583.45,580.56,577.2,581.57,583.1,585.11,579.71,576.6,580.15,582.16,580.14,582.36,579.6,577.77,581.14,579.58,577.58,577.11,585.54,589.47,585.86,590.87,592.49,591.34,593.21,590.68,591.58,593.41,591.41,594.36,590.08,589.96,586.97,589.38,589.62,590.69,592.09,592.09,589.38,588.48,583.81,587.71,589.78,591.7,586.56,596.37,592.44,592.43,592.19,592.15,590.69,584.11,591.03,589.68,589.68,584.93,591.46,587.72,585.03,588.54,589.68,588.89,587.81,587.76,588.67,591.46,592.38,591.83,588.74,584.0,589.68,589.18,590.89,592.7,590.69,587.68,589.52,587.16,583.59,591.39,588.27,589.68,590.27,588.67,589.44,588.33,587.69,591.7,591.05,588.44,588.67,591.66,592.6,593.6,588.3,598.06,593.84,591.7,590.06,592.72,594.72,587.19,592.7,592.67,592.67,592.2,591.68,591.7,587.0,590.69,589.68,584.63,584.62,584.63,584.33,584.62,584.62,582.62,583.76,580.97,583.34,583.4,573.18,574.01,577.58,579.9,580.61,579.6,585.77,588.89,584.09,581.53,582.62,580.61,580.58,581.62,580.43,578.59,579.73,580.32,577.6,577.58,580.76,582.68,578.91,587.28,586.66,582.93,582.93,587.65,589.6,589.67,586.52,589.5,588.57,588.58,590.25,591.12,593.04,592.22,592.23,584.29,584.37,587.12,582.19,585.26,588.15,585.83,589.04,591.27,586.93,593.46,595.86,592.28,595.33,599.04,601.47,602.37,602.42,604.39,600.61,597.73,595.31,592.97,590.46,585.23,587.07,588.16,592.03,592.28,598.34,597.25,595.83,583.19,576.06,575.28,579.33,573.11,574.4,576.14,574.1,572.36,573.25,575.13,582.2,585.06,585.93,583.35,581.1,583.7,581.65,592.9,597.33,598.08,598.0,593.29,591.27,593.89,592.28,592.1,590.65,593.29,595.31,592.29,592.02,585.87,586.47,589.05,590.0,581.99,587.98,586.91,595.05,586.49,573.76,579.34,573.38,575.28,564.3,579.05,572.81,570.34,579.38,577.82,585.48,579.97,577.91,573.25,576.59,568.14,577.32,579.36,565.86,580.38,584.46,586.71,588.64,593.94,587.68,587.52,593.96,602.82,607.82,599.66,595.75,593.35,596.33,590.48,585.58,592.62,586.55,595.68,593.6,607.9,601.8,612.12,614.15,619.14,619.0,614.24,612.0,606.94,598.74,601.79,607.2,609.96,608.95,584.86,590.08,604.86,599.23,589.69,586.28,582.52,581.02,570.0,574.93,573.9,573.9,577.79,583.74,573.37,572.18,569.4,570.07,570.5,564.84,568.13,577.03,568.08,579.12,562.13,575.09,577.84,578.1,583.28,583.36,582.6,567.63,577.3,580.16,566.25,541.0,558.0,537.91,552.52,555.16,557.37,553.76,556.97,557.8,544.05,539.89,546.03,530.95,545.67,556.25,552.09,544.89,545.82,524.83,540.44,521.66,531.48,531.29,530.49,536.11,536.04,532.49,533.85,533.04,536.08,536.12,534.06,513.02,536.41,536.44,518.0,538.72,536.46,529.66,530.02,520.63,528.85,530.84,529.93,527.99,536.27,522.5,536.75,524.0,540.79,543.67,549.08,515.0,557.92,545.32,535.14,537.17,530.77,534.58,536.65,523.18,521.11,515.43,516.04,513.85,509.78,509.79,505.53,512.87,518.5,515.66,524.19,519.29,509.66,512.21,498.24,505.4,504.95,523.57,521.08,523.15,510.7,528.34,533.53,505.46,514.14,529.38,515.53,508.63,516.92,507.57,501.56,481.72,478.62,490.5,460.0,489.06,479.41,454.04,475.98,483.53,493.53,487.86,465.13,468.14,470.67,451.58,447.2,435.0,427.98,409.0,417.7,434.36,464.0,480.02,471.41,461.92,449.62,449.89,465.15,459.92,486.02,477.97,493.49,507.58,500.0,489.57,489.98,493.96,496.94,480.11,495.0,517.0,503.71,500.0,500.0,505.41,519.99,528.0,524.96,529.82,523.9,515.66,527.55,509.84,517.99,514.8,523.54,525.05,527.67,543.3,547.19,549.39,548.2,543.59,542.61,540.21,544.96,549.0,547.01,547.5,535.77,535.27,534.8,538.97,540.81,540.81,542.25,542.19,542.81,547.37,546.31,542.8,548.78,553.25,550.93,549.6,552.81,553.83,551.78,555.29,558.44,550.0,551.55,546.58,537.69,556.56,557.78,565.99,562.38,563.56,564.16,567.32,567.33,567.42,567.7,568.57,569.57,572.52,572.6,567.57,569.89,572.56,575.2,578.37,576.55,567.67,568.85,567.57,570.57,570.0,564.5,549.98,577.97,576.24,579.05,579.08,578.78,578.53,579.08,579.08,579.08,579.08,579.08,579.07,578.58,578.09,578.09,577.68,577.08,577.08,576.54,576.58,577.58,578.15,576.76,575.57,570.56,569.57,569.03,568.09,568.53,565.95,568.31,565.56,565.55,563.38,567.07,565.0,563.7,563.55,558.7,557.66,566.13,561.08,559.4,557.56,560.57,568.83,569.91,576.83,580.27,580.25,579.34,580.27,580.27,580.27,580.27,580.27,577.84,574.38,579.03,580.27,576.92,574.0,574.92,578.92,580.98,580.97,585.99,594.12,590.94,599.98,596.29,594.43,595.95,599.96,602.95,607.22,606.62,606.62,606.98,609.34,610.0,612.02,611.98,611.48,614.87,610.98,610.98,614.87,613.89,613.38,613.9,616.97,617.84,611.98,610.02,609.35,611.76,612.83,606.81,607.73,608.18,615.57,623.29,623.39,624.87,625.43,625.13,622.88,621.86,627.4,629.66,628.13,627.83,626.69,626.48,623.63,627.71,629.34,630.89,628.07,628.0,628.74,631.95,635.4,634.4,634.89,630.63,628.89,627.0,627.0,627.01,629.78,627.62,627.46,629.38,624.87,624.77,623.87,621.8,627.48,629.4,623.01,628.76,628.63,627.57,623.07,625.86,629.14,626.87,616.84,624.36,624.09,624.42,627.21,628.55,629.88,630.45,624.87,628.47,632.15,638.05,638.83,639.0,644.99,640.92,646.22,642.0,643.02,640.82,635.45,629.61,625.85,629.87,628.88,629.93,629.88,627.69,624.71,621.86,620.71,620.77,620.99,617.99,611.96,621.44,621.24,625.95,620.5,621.75,621.75,621.63,620.75,621.66,618.86,621.11,621.06,622.82,622.87,626.77,619.36,623.77,624.7,618.88,618.85,618.52,617.28,619.97,619.71,615.34,614.84,611.73,609.55,608.51,609.04,608.29,606.95,608.11,613.43,613.17,611.63,613.14,612.68,611.41,611.44,613.24,614.45,608.12,607.42,606.85,605.76,608.19,609.23,609.42,606.84,606.62,605.93,606.67,607.37,606.96,606.15,605.75,610.94,609.27,608.66,603.6,606.19,607.07,606.91,607.41,603.23,602.3,600.39,595.0,597.32,593.92,595.97,596.53,601.52,600.39,606.84,604.2,606.4,601.5,599.24,602.39,609.0,597.99,618.86,602.9,595.37,592.35,584.31,583.0,581.32,580.31,578.6,577.3,578.73,577.0,580.46,577.0,576.3,577.3,577.88,579.25,582.2,582.22,579.31,581.32,581.13,577.13,582.82,580.31,578.88,581.82,581.73,577.28,574.2,575.28,572.48,573.84,572.54,571.48,571.79,572.28,573.02,571.48,575.31,571.97,573.46,575.39,575.36,577.26,576.73,576.96,579.31,574.41,572.71,577.84,574.86,571.28,568.91,567.27,568.28,564.0,563.31,567.19,567.88,565.87,566.11,570.42,570.27,573.66,574.68,573.57,573.9,576.22,575.21,574.74,572.46,574.29,572.47,574.12,575.21,577.26,572.9,575.89,576.3,577.18,577.31,577.32,580.29,580.21,581.16,580.5,578.21,574.55,575.56,578.45,577.13,577.01,580.29,577.5,581.68,582.74,585.67,586.34,581.87,581.82,586.34,587.34,577.52,577.03,577.07,572.29,572.06,572.06,572.28,568.63,568.64,570.63,569.27,567.52,571.88,573.38,574.91,572.71,578.03,573.63,574.61,567.55,568.27,567.99,568.41,566.64,565.1,564.95,562.85,563.57,566.1,563.0,563.29,567.26,565.51,570.13,567.54,568.26,570.27,569.06,565.68,565.68,564.25,562.24,560.2,568.75,569.23,568.46,565.7,574.73,575.41,572.27,574.98,567.0,566.37,570.85,575.63,576.3,585.67,587.76,587.78,587.68,582.69,588.25,588.65,587.0,587.34,585.21,587.34,586.98,584.41,579.62,578.3,579.81,582.23,582.32,581.31,577.04,574.12,575.29,576.3,572.0,577.81,582.09,584.33,588.34,584.65,582.92,580.0,589.19,581.53,577.0,580.81,580.58,577.43,578.94,577.23,583.32,574.26,573.38,571.37,575.12,572.97,566.64,567.14,561.73,561.23,569.24,570.0,572.28,565.25,551.74,552.2,553.47,558.22,553.2,549.5,552.21,549.94,553.6,556.08,555.2,552.2,554.29,553.98,550.96,561.0,560.68,560.22,556.84,556.03,550.12,547.17,538.99,540.87,550.19,549.79,546.18,553.57,547.18,556.71,562.35,563.23,562.74,564.25,568.12,566.27,569.28,567.43,571.49,570.69,572.54,568.93,567.53,573.41,572.29,566.63,569.78,573.43,574.43,576.98,581.3,580.24,579.11,581.32,583.28,582.02,582.12,588.48,587.62,586.83,583.39,578.0,579.76,577.35,577.3,577.4,574.0,579.31,585.33,578.79,581.85,580.31,582.29,581.49,587.34,587.27,582.86,593.48,594.37,594.37,596.89,601.07,600.61,602.91,602.95,602.19,602.14,602.4,601.73,600.39,597.2,602.15,602.16,599.97,603.77,598.88,597.62,598.38,597.25,598.72,599.12,598.29,599.59,602.3,602.4,600.31,593.15,590.84,594.6,595.69,598.51,599.31,595.47,594.43,600.3,609.18,608.77,612.22,613.55,611.85,611.22,608.36,601.2,609.38,608.69,613.45,613.22,616.33,605.49,612.02,600.23,596.55,603.2,612.22,616.23,622.56,622.9,624.85,625.25,624.07,622.23,624.56,625.67,625.56,627.41,626.25,629.44,627.42,626.25,626.25,626.1,628.6,625.67,628.14,628.24,626.45,627.13,624.25,631.0,631.25,629.7,628.2,629.82,627.73,627.91,629.58,629.62,629.11,628.16,629.73,627.72,629.2,627.26,625.71,624.35,627.85,623.68,623.12,625.67,627.68,623.44,628.09,627.75,622.72,623.27,619.24,628.76,629.26,630.92,632.58,630.36,633.65,634.34,633.74,636.77,635.22,633.26,632.4,636.61,636.61,637.13,636.81,636.27,633.62,634.73,635.0,631.77,630.27,629.25,629.47,629.26,626.5,624.93,625.14,626.25,629.25,629.25,626.85,630.26,628.88,626.42,626.41,626.6,628.24,625.67,626.25,626.25,625.75,626.05,628.65,627.43,627.6,625.03,628.38,628.84,627.1,626.25,624.25,625.35,625.24,624.25,625.25,623.78,623.85,623.8,625.36,624.19,623.68,625.36,625.83,625.36,622.85,623.88,622.34,625.5,623.44,621.0,624.18,622.84,620.01,623.24,625.94,624.5,623.69,627.23,628.85,628.96,627.96,626.85,627.6,626.41,626.57,626.2,626.32,625.19,628.03,628.05,628.04,626.32,628.96,629.52,628.1,628.09,629.72,628.15,626.15,626.45,624.99,625.25,628.28,625.98,630.61,631.25,630.17,630.17,628.84,629.25,631.14,631.18,631.14,629.26,629.26,629.03,629.26,629.2,627.91,629.26,627.69,627.97,627.97,627.47,627.17,627.16,623.19,626.26,629.8,628.12,629.29,629.28,629.27,628.96,628.86,626.88,628.1,627.72,627.6,626.35,626.85,627.32,628.11,629.0,628.77,627.29,628.69,626.5,626.53,625.46,624.99,622.2,625.65,626.5,626.69,625.35,625.65,623.2,624.82,623.29,623.76,623.48,625.42,625.95,628.5,625.18,630.51,625.99,629.27,629.44,629.76,630.01,627.5,627.5,629.09,626.92,627.5,622.92,624.48,624.57,620.02,616.5,619.48,618.32,624.46,625.6,628.44,629.51,628.62,630.46,628.0,626.12,628.16,630.4,628.91,632.63,631.04,630.69,629.98,625.44,627.58,627.62,626.86,630.25,631.47,632.72,632.45,635.92,638.04,637.97,638.23,638.48,636.54,636.47,635.53,637.63,636.85,637.54,638.54,638.54,640.55,639.89,638.17,638.68,636.52,637.5,636.45,635.86,638.4,637.07,637.54,638.85,639.55,639.55,642.5,640.55,640.97,640.55,641.55,641.56,641.47,643.11,644.99,646.0,642.57,646.58,646.07,647.05,647.49,650.59,649.75,649.82,648.52,643.93,646.51,643.56,650.6,647.97,644.49,644.82,644.81,643.26,640.77,645.88,641.0,640.87,643.63,642.31,645.57,641.56,639.13,637.82,635.93,637.54,634.53,636.92,637.32,636.19,631.46,631.27,630.82,635.14,635.72,632.81,634.09,635.72,631.89,632.54,632.24,630.02,633.59,636.13,634.14,638.01,637.25,638.29,639.7,638.77,638.66,640.99,636.0,641.4,642.56,639.49,638.58,639.54,637.81,636.36,636.85,639.39,646.69,644.28,644.28,644.26,644.27,643.36,641.56,646.97,646.97,650.58,652.07,650.01,650.39,652.58,649.62,647.57,647.58,645.65,645.27,642.61,643.56,648.09,647.71,647.98,649.05,650.19,650.59,650.53,651.64,650.9,656.29,651.17,657.99,656.08,656.92,661.49,658.27,655.98,654.99,649.73,653.98,649.47,649.45,655.32,646.0,654.98,652.98,635.95,628.65,627.2,630.37,620.93,627.94,631.72,633.87,630.95,630.96,634.75,634.32,635.53,631.47,637.0,636.85,632.35,624.94,626.89,630.71,623.93,622.26,619.22,616.2,620.39,610.02,617.73,616.92,615.17,616.11,620.87,618.92,613.92,612.18,611.3,614.76,612.17,611.0,614.92,614.92,619.01,622.7,620.93,620.93,624.16,624.18,622.47,622.45,625.99,624.94,625.56,621.95,626.94,627.39,634.04,637.77,633.52,626.94,625.84,622.94,621.06,615.93,625.17,626.04,621.93,624.35,625.5,637.83,624.16,614.92,610.92,604.5,603.87,607.61,607.75,600.9,605.91,604.82,607.04,607.02,610.81,610.76,612.92,612.1,614.37,619.63,611.65,611.85,616.57,613.55,612.92,606.91,604.75,611.92,615.97,616.92,618.23,615.92,621.43,623.97,622.01,626.0,625.94,627.94,628.57,627.86,632.9,633.35,628.95,630.44,629.94,625.99,625.92,629.93,628.57,627.51,631.63,634.95,635.41,625.94,631.4,635.88,636.95,637.96,638.97,626.44,626.94,631.95,626.97,620.01,635.95,633.95,635.17,635.95,640.96,647.98,649.27,652.48,654.67,652.54,652.23,653.03,654.68,654.88,655.96,655.51,654.59,653.22,654.97,653.36,654.35,653.7,650.55,653.81,655.31,657.88,655.31,655.01,654.79,653.2,649.47,651.84,653.3,651.84,651.21,648.67,652.98,649.35,659.32,649.96,651.3,657.46,658.0,661.32,662.28,662.41,662.9,662.82,663.73,665.58,663.68,662.57,667.58,668.91,668.86,667.02,664.87,667.71,664.36,662.13,667.72,669.98,663.29,664.35,665.51,666.93,654.78,656.74,656.41,659.13,658.47,656.32,655.22,653.3,653.3,651.29,654.31,654.55,657.14,655.15,656.3,656.77,657.94,655.38,656.53,657.31,657.68,657.98,656.91,666.29,656.74,649.11,651.77,648.85,654.4,655.31,655.31,656.64,658.22,655.17,653.18,653.18,653.41,656.27,650.45,649.78,649.79,655.52,660.54,660.56,655.19,655.19,655.04,650.1,658.59,658.59,656.21,655.45,655.36,660.24,662.46,661.81,662.46,662.22,662.46,662.26,662.26,662.46,664.07,657.74,656.43,656.43,649.5,656.21,651.49,658.94,660.12,655.94,664.78,660.24,656.26,654.98,654.9,654.9,650.19,654.85,657.41,656.1,654.05,656.21,653.17,644.91,649.54,645.6,653.08,654.49,659.95,660.19,659.3,664.95,662.28,663.61,666.28,666.29,663.64,666.29,667.3,669.31,645.34,658.22,661.99,658.05,655.07,650.97,651.17,650.89,652.19,653.82,656.11,652.18,665.28,654.89,652.23,648.93,649.15,645.22,650.1,645.55,641.28,640.17,641.08,640.34,640.34,644.1,644.04,647.14,651.87,657.1,657.12,657.12,660.21,657.12,655.97,657.1,660.23,656.78,658.52,658.63,658.22,665.05,660.03,660.45,662.45,661.16,666.95,666.44,665.28,667.3,666.46,661.2,669.75,677.87,675.7,674.35,677.29,671.0,670.38,674.77,675.2,674.2,684.42,681.61,677.38,671.33,666.87,665.87,670.32,672.34,668.31,672.99,667.92,663.03,669.31,666.68,663.26,666.6,667.3,676.37,678.08,676.37,682.91,687.51,686.93,680.4,678.39,683.42,683.49,677.38,683.5,689.61,687.0,698.53,688.87,681.77,685.44,690.69,692.5,714.18,695.52,682.1,679.0,680.01,685.44,652.06,650.41,645.11,642.1,641.13,635.0,632.52,638.39,642.09,635.04,634.64,644.11,647.14,642.09,641.09,633.4,637.54,637.61,635.88,641.12,637.06,639.37,630.91,640.08,633.02,629.51,640.05,643.1,636.06,650.76,642.75,633.0,624.0,593.15,600.75,588.49,600.77,600.77,599.15,602.78,593.69,591.63,586.74,594.72,589.67,574.56,579.58,582.61,581.64,577.07,594.44,599.76,597.98,603.69,606.77,594.74,612.86,620.1,614.39,619.45,620.13,628.98,614.4,607.02,615.18,607.01,607.83,596.77,598.8,599.02,607.25,566.5,550.37,560.45,576.99,589.68,586.54,595.74,591.76,586.66,588.65,584.88,589.68,605.93,606.86,609.03,612.83,614.87,606.93,609.22,608.34,609.0,614.88,612.86,620.93,618.24,625.6,625.47,624.96,622.38,618.91,623.19,625.87,620.32,611.76,614.48,611.05,612.86,613.87,619.22,621.0,624.02,620.22,627.98,632.0,628.97,620.75,612.6,624.96,621.94,626.04,631.5,639.15,641.5,642.09,639.0,637.06,633.01,637.91,645.84,650.1,641.15,641.8,649.15,643.97,649.15,650.17,653.18,654.91,654.91,654.21,653.94,648.0,653.18,653.18,653.18,653.18,652.01,649.21,646.87,644.04,652.18,650.58,651.86,650.62,655.19,657.06,658.37,660.24,660.24,660.23,659.72,657.6,659.07,659.23,655.19,655.2,655.2,654.19,652.53,649.41,655.45,654.19,650.36,650.67,653.08,654.09,654.19,652.73,651.17,656.85,659.77,652.38,645.66,650.01,650.26,651.67,652.19,655.82,657.22,658.19,658.22,659.06,652.4,657.38,654.65,652.4,660.42,656.16,661.17,659.59,660.7,661.43,662.16,662.42,662.55,660.24,655.65,647.34,655.34,652.7,655.3,654.09,655.22,655.18,656.52,661.74,661.73,661.02,661.25,662.38,661.71,661.25,660.58,659.05,660.18,659.49,661.94,662.47,656.84,665.26,662.26,659.18,662.17,660.24,656.98,657.21,655.21,656.51,663.26,663.26,665.27,667.91,668.3,669.26,671.43,672.31,670.42,671.1,664.15,671.71,669.31,669.41,672.24,669.53,671.99,669.52,671.33,668.83,668.7,667.94,667.37,667.3,670.32,668.3,670.32,671.33,672.39,671.54,667.1,678.72,675.69,673.58,672.88,674.69,669.43,675.68,674.66,676.7,673.34,675.11,677.72,680.74,669.3,665.97,654.0,662.8,664.78,666.56,661.99,662.56,661.53,660.84,655.52,656.75,656.53,664.89,665.57,665.7,670.64,663.46,670.69,665.59,661.96,661.05,664.58,666.6,667.62,667.77,663.38,663.38,662.56,654.1,662.66,661.4,658.85,657.85,658.52,659.53,659.53,654.85,650.89,651.37,652.62,650.65,648.46,647.08,653.86,653.94,654.64,651.45,659.53,636.22,653.41,661.65,665.58,665.59,669.32,674.66,665.59,666.6,668.62,669.63,678.33,681.74,680.23,682.52,682.52,676.36,675.36,675.35,677.49,688.43,680.32,680.26,690.49,680.4,679.4,682.41,667.37,679.39,677.36,672.31,667.87,676.99,680.39,676.36,666.25,674.33,676.36,681.58,668.69,670.83,666.66,686.81,683.88,683.76,681.75,674.47,681.72,683.88,689.4,680.67,673.63,670.0,659.96,666.55,660.51,665.43,659.56,651.37,652.19,646.29,645.39,646.24,653.37,654.4,650.99,643.56,650.35,656.42,669.83,667.57,653.89,668.56,675.78,659.53,660.94,656.52,650.88,672.13,672.51,676.81,677.27,658.93,670.53,681.06,685.94,682.0,692.12,692.93,693.6,693.52,691.68,691.12,698.46,698.16,695.38,690.08,692.5,694.5,698.53,700.95,700.95,699.28,703.68,705.6,705.6,700.0,704.59,705.6,706.6,706.6,705.6,705.6,705.58,700.0,699.55,709.81,708.92,710.14,712.26,714.67,711.64,711.64,704.79,705.59,705.58,701.64,701.64,701.64,700.55,704.4,705.47,693.98,702.58,701.88,710.07,717.61,720.12,718.14,718.21,714.0,719.69,715.37,715.66,711.9,716.18,707.02,708.87,713.42,713.06,712.05,711.82,713.06,708.72,709.42,714.04,709.13,715.08,715.59,717.1,718.31,719.15,722.14,718.24,719.79,721.65,717.0,712.27,711.79,705.91,707.89,709.57,708.42,717.09,711.57,710.13,713.31,714.07,709.71,709.07,714.06,709.72,708.82,693.0,698.92,694.83,692.56,693.41,697.91,698.12,692.92,697.16,695.87,691.53,682.01,688.82,688.16,696.9,676.42,676.66,680.74,677.1,684.78,678.63,681.75,680.74,676.81,673.21,675.68,671.94,674.0,671.75,671.65,675.69,676.73,680.84,674.61,674.62,673.56,670.21,668.62,666.6,665.59,665.86,672.66,662.51,666.95,665.94,673.0,678.03,682.01,678.55,672.34,664.43,670.08,674.01,683.48,681.07,682.11,686.12,686.12,695.1,686.12,685.31,678.27,671.99,675.01,676.74,676.03,654.84,649.73,641.72,643.27,641.36,641.67,647.56,643.14]
		//history.reverse()
		return history
	}
}})

$jin.atom.prop({ '$jin.trade..volume': {
	pull: function( ){
		var history = this.history()
		var last = history[0]
		return history.map( function( value, index ){
			var volume = value - last
			last = value
			return volume
		} )
	}
}})

$jin.atom.prop({ '$jin.trade..fees': {
	pull: function( ){
		return 0.003
	}
}})

$jin.atom.prop({ '$jin.trade..startBTC': {
	pull: function( ){
		return 1
	}
}})

$jin.atom.prop({ '$jin.trade..strategies': {
	pull: function( ){
		var next = {}
		
		next.randomStrategy = function( ){
			this.learn = function( value ){
				if( Math.random() < .02 ) return 'exchange'
			}
		}
		
		next.proStrategy = function( ){
			this.last
			this.learn = function( value ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value < last ) return 'prefer-usd'
				if( value > last ) return 'prefer-btc'
			}
		}
		
		next.contraStrategy = function( ){
			this.last
			this.learn = function( value ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value < last ) return 'prefer-btc'
				if( value > last ) return 'prefer-usd'
			}
		}
		
		next.safeContraStrategy = function( ){
			this.last
			this.learn = function( value, budget, fees ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value - last < - fees * value * 2 ) return 'prefer-btc'
				if( value - last > + fees * value * 2 ) return 'prefer-usd'
				//this.last = last
			}
		}
		
		next.safeProStrategy = function( ){
			this.last
			this.learn = function( value, budget, fees ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value < last - fees * value * 5 ) return 'prefer-usd'
				if( value > last + fees * value * 5 ) return 'prefer-btc'
			}
		}
		
		return next
	}
}})

;//../../jin/trade/jin-trade-legend-item.jam.js?=HSN91YI0
$jin.klass({ '$jin.trade.legend.item': [ '$jin.view' ] })

$jin.atom.prop({ '$jin.trade.legend.item..name': {} })

$jin.atom.prop({ '$jin.trade.legend.item..color': {} })

$jin.atom.prop({ '$jin.trade.legend.item..isActive': {
	pull: function( ){
		return true
	}
} })
