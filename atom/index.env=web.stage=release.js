;//../../jin/jin.jam.js?=HSPXP6TC
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

;//../../jin/trait/jin_trait.jam.js?=HSPXP7L4
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

;//../../jin/glob/jin_glob.jam.js?=HSPXP6TC
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

;//../../jin/definer/jin-definer.jam.js?=HSPXP6TC
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

;//../../jin/func/jin_func.jam.js?=HSPXP6TC
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

;//../../jin/method/jin_method.jam.js?=HSPXP6TC
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

;//../../jin/mixin/jin_mixin.jam.js?=HSQ2AWV4
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
			if( typeof func === 'function' ){
				if( !func.jin_method_path ) func.jin_method_path = sourcePath + '.' + key
			} else {
                if(!( key in target )) target[ key ] = void 0
                continue
            }
            
            var methodName = func.jin_method_path.replace( /^([$\w]*\.)+/, '' )
			$jin.method( targetPath + '.' + methodName, func )
        }
		
        source.jin_mixin_slaveList.push( targetPath )
    })
    
    return target
}})

;//../../jin/property/jin_property.jam.js?=HSPXP6TC
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

;//../../jin/klass/jin_klass.jam.js?=HSPXP6TC
$jin.definer({ '$jin.klass': function( path, mixins ){
    mixins.unshift( '$jin.klass' )
    return $jin.mixin( path, mixins )
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

;//../../jin/wrapper/jin_wrapper.jam.js?=HSPXP7L4
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

;//../../jin/error/jin-error.jam.js?=HSPXP6TC
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

;//../../jin/schedule/jin_schedule.jam.js?=HSPXP6TC
$jin.method( '$jin.schedule', function( delay, handler ){
    var id = setTimeout( $jin.defer.callback( handler ), delay )
    return { destroy: function( ){
        clearTimeout( id )
    } }
} )

;//../../jin/defer/jin_defer.env=web.jam.js?=HSPXP6TC
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

;//../../jin/makeId/jin_makeId.jam.js?=HSPXP6TC
$jin.makeId = function( prefix ){
	var seeds = $jin.makeId.seeds 
	var seed = seeds[ prefix ] || 0
	seeds[ prefix ] = seed + 1
    return prefix + ':' + seed
}

$jin.makeId.seeds = {}

;//../../jin/log/jin-log.env=web.jam.js?=HSPXP6TC
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
	
	if( console.exception ) console.exception( error )
	else if( console.error ) console.error( message )
	else if( console.log ) console.log( message )
	
	error.$jin_log_isLogged = true
}})

;//../../jin/atom/jin-atom.jam.js?=HSPXP6TC
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
		var value = config.pull.call( config.context, this._value )
		this.put( value )
	} catch( error ){
		this.fail( error )
	} finally {
		var stack = $jin.atom.slaves
		while( stack.length ){
			var top = stack.shift()
			if( top === this ) break
		}
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
	$jin.mixin({ '$jin.atom': [ '$jin.atom.logging' ] })
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

;//../../jin/atom/prop/jin-atom-prop.jam.js?=HSPXP6TC
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
