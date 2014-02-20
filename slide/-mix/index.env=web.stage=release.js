;//../../jin/jin.jam.js?=HRUSTW7K
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

;//../../jin/trait/jin_trait.jam.js?=HRUSTW7K
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

;//../../jin/glob/jin_glob.jam.js?=HRUSTW7K
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

;//../../jin/definer/jin-definer.jam.js?=HRUSTW7K
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

;//../../jin/func/jin_func.jam.js?=HRUSTW7K
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

;//../../jin/method/jin_method.jam.js?=HRUU1G40
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
            var conflictNames = conflictList.map( function( func ){
                return func.jin_method_path
            } )
            throw new Error( "Conflict in [" + name + "] by [" + conflictNames + "]" )
        }
        func.jin_method_path = name
        func.jin_method_conflicts = conflictList
    }
    
    func.jin_method_resolves = resolveList
    
    return func
}

;//../../jin/mixin/jin_mixin.jam.js?=HRUSTW7K
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

;//../../jin/property/jin_property.jam.js?=HRUSTW7K
$jin.definer({ '$jin.property': function( ){ // arguments: resolveName*, path, filter
    var resolveList = [].slice.call( arguments )
    var filter = resolveList.pop()
    var name = resolveList.pop()
    var fieldName = '_' + name
	
	if( filter ){
		var property = function( value ){
			if( arguments.length ){
				if( value === void 0 ){
					this[ fieldName ] = value
				} else {
					this[ fieldName ] = filter.call( this, value )
				}
				return this
			} else {
				var value = this[ fieldName ]
				if( value === void 0 ){
					return this[ fieldName ] = filter.call( this )
				} else {
					return value
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

;//../../jin/klass/jin_klass.jam.js?=HRUSTW7K
$jin.definer({ '$jin.klass': function( path, mixins ){
    $jin.mixin( '$jin.klass', path )
    return $jin.mixin.apply( this, mixins.concat([ path ]) )
}})

$jin.klass.old = function( ){ // arguments: sourceName*, targetName
    var name = arguments[ arguments.length - 1 ]
    $jin.mixin( '$jin.klass', name )
    return $jin.mixin.apply( this, arguments )
}

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

;//../../jin/registry/jin_registry.jam.js?=HRUU1G40
$jin.property.hash( '$jin.registry.storage', {} )

$jin.property( '$jin.registry..id', String )

$jin.method( '$jin.klass.exec', '$jin.registry.exec', function( id ){
	if( id instanceof this ) return id
	id = String( id )
	
    var obj = id; while( typeof obj === 'string' ) obj = this.storage( obj )
	
    if( obj ) return obj
    
    var newObj = (new this).id( id )
    var id2 = newObj.id()
    
    var obj = this.storage( id2 )
    if( obj ) return obj
    
	if( id !== id2 ) this.storage( id, id2 )
	this.storage( id2, newObj )
	
    return newObj
} )

$jin.method( '$jin.klass..destroy', '$jin.registry..destroy', function( ){
	this.constructor.storage( this.id(), null )
	this['$jin.klass..destroy']()
} )

$jin.method( '$jin.klass..toString', '$jin.registry..toString', function( ){
    return this.id()
} )

;//../../jin/schedule/jin_schedule.jam.js?=HRUSTW7K
$jin.method( '$jin.schedule', function( delay, handler ){
    var id = setTimeout( $jin.defer.callback( handler ), delay )
    return { destroy: function( ){
        clearTimeout( id )
    } }
} )

;//../../jin/defer/jin_defer.env=web.jam.js?=HRUU1G40
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

;//../../jin/makeId/jin_makeId.jam.js?=HRUSTW7K
$jin.makeId = function( prefix ){
	var seed = $jin.makeId.seeds[ prefix ] || 0
	$jin.makeId.seeds[ prefix ] = seed + 1
    return prefix + ':' + seed
}

$jin.makeId.seeds = {}

;//../../jin/atom/jin-atom.jam.js?=HRV33YQO
$jin.klass({ '$jin.atom': [] })

$jin.atom.slaves = []
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._value', void 0 )
$jin.glob( '$jin.atom.._error', void 0 )
$jin.glob( '$jin.atom.._slice', 0 )
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

			atom.pull( true )

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

$jin.method({ '$jin.atom..init': function $jin_atom__init( config ){
	this['$jin.klass..init']
	this._id = $jin.makeId( '$jin.atom' )
	this._name = config.name || this._id
	this._slaves = {}
	this._masters = {}
	if( config.pull ) this._pull = config.pull
	if( config.push ) this._push = config.push
	if( config.merge ) this._merge = config.merge
	if( config.fail ) this._fail = config.fail
	this._value = config.value
	this._context = config.context
}})

$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

$jin.method({ '$jin.atom..get': function( ){
	var slave = $jin.atom.slaves[0]
	if( slave ){
		slave.obey( this )
		this._slaves[ slave.id() ] = slave
	}
	
	if( this._pull && ( this._scheduled || ( this._value === void 0 ) ) ) this.pull()

	if( this._error ) throw this._error
	
	return this._value
}})

$jin.method({ '$jin.atom..valueOf': function( ){
	return this.get()
}})

$jin.method({ '$jin.atom..pull': function( skipUnScheduling  ){
	if( !skipUnScheduling && this._scheduled ){
		var queue = $jin.atom.scheduled[ this._slice ]
		queue[ this._id ] = null
		this.scheduled = false
	}
	
	this._error = void 0
	
	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0

	if( ~$jin.atom.slaves.indexOf( this ) ) throw new Error( 'Recursive atom' )
	$jin.atom.slaves.unshift( this )
	try {
		this.put( this._pull ? this._pull.call( this._context, this._value ) : this._value )
	} catch( error ){
		this.put( null )
		this._error = error
	} finally {
		var stack = $jin.atom.slaves
		while( stack.length ){
			var top = stack.shift()
			if( top === this ) break
		}
	}

	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this._value
}})

$jin.method({ '$jin.atom..put': function( next ){
	
	var merge = this._merge
	if( merge ){
		var context = this._context
		var prev = this._value
		$jin.atom.bound( function mutate( ){
			next = merge.call( context, next, prev )
		})
	}
	
	this.value( next )
	this._error = void 0
	
	return this
}})

$jin.method({ '$jin.atom..fail': function( error ){
	this._error = error
	this.value( null )
	return this
}})

$jin.method({ '$jin.atom..mutate': function( mutator ){
	var context = this._context
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
	
	var context = this._context
	
	var error = this._error
	if( error ){
		var fail = this._fail
		if( fail ){
			$jin.atom.bound( function( ){
				fail.call( context, error, prev )
			})
		}
	} else {
		var push = this._push
		if( push ){
			$jin.atom.bound( function( ){
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
	if( $jin.atom.logger ) $jin.atom.log.push( this._name, value )

	for( var id in this._slaves ){
		var slave = this._slaves[ id ]
		if( !slave ) continue
		slave.update()
	}

	//this._slaves = {}

	return this
}})

$jin.method({ '$jin.atom..update': function( slice, atom ){
	var slice = this._slice

	var queue = $jin.atom.scheduled[ slice ]
	if( !queue ) queue = $jin.atom.scheduled[ slice ] = {}

	queue[ this._id ] = this

	$jin.atom.schedule()

	return this
}})

$jin.method({ '$jin.atom..lead': function( slave ){
	if( slave === this ) throw new Error( 'Self leading atom' )
	var id = slave.id()

	this._slaves[ id ] = slave

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

	this._slaves[ id ] = void 0

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
	for( var id in slaves ){
		slaves[ id ].disobey( this )
	}
}})

$jin.method({ '$jin.atom..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		masters[ id ].dislead( this )
	}
	this._slice = 0
}})

$jin.method({ '$jin.atom..destroy': function( ){
	this.disobeyAll()
	this.disleadAll()
	return $jin.method['$jin.klass..destroy']()
}})

$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin( '$jin.atom.logging', '$jin.atom' )
}})

$jin.method({ '$jin.atom.logging..notify': function( ){
	var ctor = this.constructor

	ctor.log().push([ this._name, this._value, this._masters ])

	if( !ctor._deferedLogging ){
		ctor._deferedLogging = $jin.schedule( 0, function defferedLogging( ){
			ctor._deferedLogging = null
			console.groupCollapsed('$jin.atom.log')
			ctor.log().forEach( function( row ){
				console.log.apply( console, row )
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

;//../../jin/atom/prop/jin-atom-prop.jam.js?=HRUSTW7K
$jin.definer({ '$jin.atom.prop': function( path, config ){
    
	var pull = config.pull
	if( pull ) pull.jin_method_path = path + '.pull'

	var put = config.put
	if( put ) put.jin_method_path = path + '.put'

	var push = config.push
	if( push ) push.jin_method_path = path + '.push'

	var merge = config.merge
	if( merge ) merge.jin_method_path = path + '.merge'

    var prop = function( next ){
        var atom = propAtom.call( this )
        if( !arguments.length ) return atom.get()
        
		var prev = atom.value()
		var next2 = merge ? merge.call( this, next, prev ) : next
		
		var next3 = ( put && ( next2 !== prev ) ) ? put.call( this, next2, prev ) : next2
		
        atom.value( next3 )
		
        return this
    }
    
    var fieldName = '_' + path
    
    var propAtom = function( ){
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

;//../../jin/state/jin_state.jam.js?=HRUSTW7K
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

;//../../jin/wrapper/jin_wrapper.jam.js?=HRUSTW7K
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

;//../../jin/env/jin_env.jam.js?=HOPSL9XS
this.$jin.env = $jin.value( function(){ return this }() )

;//../../jin/alias/jin_alias.jam.js?=HRUSTW7K
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

;//../../jin/listener/jin_listener.jam.js?=HRUSTW7K
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

;//../../jin/event/jin_event.jam.js?=HRUSTW7K
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

;//../../jin/support/jin_support.env=web.jam.js?=HRUSTW7K
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

;//../../jin/vector/jin_vector.jam.js?=HRUSTW7K
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

;//../../jin/dom/event/jin_dom_event.env=web.jam.js?=HRUSTW7K
$jin.klass.old( '$jin.wrapper', '$jin.event', '$jin.dom.event' )

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
			console.error( error )
			return null
		}
	}
} )

$jin.method( '$jin.dom.event..offset', function( ){
    return $jin.vector([ this.nativeEvent().offsetX, this.nativeEvent().offsetX ])
} )

;//../../jin/dom/event/jin_dom_event_onBlur.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onBlur': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onBlur.type', function( ){
    return 'blur'
} )

;//../../jin/dom/event/jin_dom_event_onClick.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onClick.type', function( ){
    return 'click'
} )

;//../../jin/dom/event/jin_dom_event_onInput.env=web.jam.js?=HRUSTW7K
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

;//../../jin/dom/event/jin_dom_event_onPress.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onPress': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onPress.type', function( ){
    return 'keydown'
} )

;//../../jin/dom/event/jin_dom_event_onWheel.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onWheel': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onWheel.type', function( ){
    return 'wheel'
} )

;//../../jin/dom/event/jin_dom_event_onChange.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onChange': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onChange.type', function( ){
    return 'change'
} )

;//../../jin/dom/event/jin_dom_event_onResize.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onResize': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onResize.type', function( ){
    return 'resize'
} )

;//../../jin/dom/event/jin_dom_event_onScroll.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onScroll': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onScroll.type', function( ){
    return 'scroll'
} )

;//../../jin/dom/event/jin_dom_event_onDoubleClick.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.dom.event.onDoubleClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onDoubleClick.type', function( ){
    return 'dblclick'
} )

;//../../jin/dom/selection/jin-dom-selection.jam.js?=HRUSTW7K
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

;//../../jin/doc/jin_doc.jam.js?=HRUSTW7K
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
	pull: function( ){
		this.sizeListener()
		var root = document.documentElement
		return $jin.vector([ root.clientWidth, root.clientHeight ])
	}
} } )

;//../../jin/dom/range/jin-dom-range.env=web.jam.js?=HRUSTW7K
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

;//../../jin/dom/jin_dom.jam.js?=HRUU1G40
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

;//../../jin/dom/jin_dom.env=web.jam.js?=HRUSTW7K
$jin.method( '$jin.dom..html', function( html ){
    if( arguments.length ){
        this.nativeNode().innerHTML = html
        return this
    } else {
        return this.nativeNode().innerHTML
    }
} )

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

;//../../jin/state/local/jin_state_local.env=web.jam.js?=HRUSTW7K
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

;//../../jin/sample/jin_sample.jam.js?=HRV5A4S8
$jin.klass({ '$jin.sample': [ '$jin.dom' ] })
$jin.klass({ '$jin.sample.proto': [ '$jin.registry' ] })

$jin.property({ '$jin.sample.strings': String })

$jin.property({ '$jin.sample.templates': function( ){
	var strings = $jin.sample.strings()
	if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
	return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
}})

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

$jin.atom.prop({ '$jin.sample..view': {} })

$jin.property({ '$jin.sample..covers': null })

$jin.property({ '$jin.sample..activated': function( val ){
	if( !arguments.length ) return
	var covers = this.covers()
	
	if( val ){
		//$jin.atom.slaves.unshift( null )
		covers.forEach( function( cover ){
			cover.update()
		} )
		//$jin.atom.slaves.shift()
	} else {
		covers.forEach( function( cover ){
			cover.disobeyAll()
		} )
	}
}})

$jin.method({ '$jin.sample.proto..make': function( view ){
	var pool = $jin.sample.pool( this.id() )
	var sample = pool.pop()
	if( !sample ){
		var rules = this.rules()
		var node = this.nativeNode().cloneNode( true )
		sample = $jin.sample( node ).proto( this ).rules( rules )
	}
	//sample.view( view )
	return sample
}})

$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample..free': function( ){
	//this.view( null )
	$jin.sample.pool( this.proto().id() ).push( this )
}})

$jin.property({ '$jin.sample..proto': null })

$jin.method({ '$jin.sample..rules': function( rules ){
	if( !arguments.length ) throw new Error( 'Rules is not getter' )
	
	var node = this.nativeNode()
	var sample = this
	var covers = []
	var protoId = this.proto().id()
	
	rules.forEach( function ruleIterator( rule ){
		var current = node
		
		var pull = function( prev ){
			var view = sample.view()
			if( !view ) return
			
			return view[ rule.key ]()
		}
		
		var fail = function( error ){
			console.error( error )
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
			,	push: function(){}
			,	fail: fail
			, 	pull: function contentPull( oldValue ){
					var view = sample.view()
					
					var value = view ? view[ rule.key ]() : null
					
					if( typeof value !== 'object' ){
						var content = ( value == null ) ? '' : String( value )
						
						if( 'textContent' in current ) var oldContent = current.textContent
						else var oldContent = current.innerText
						
						if( content === oldContent ) return 
						
						if( 'textContent' in current ) current.textContent = content
						else current.innerText = content
						
						return value
					}
					
					if(( value == null )||( typeof oldValue !== 'object' )){
						var child; while( child = current.firstChild ) current.removeChild( child )
						oldValue = []
					}
					
					if( value == null ) return value
					
					if(!( value.length >= 0 )) value = [ value ]
					
					if( oldValue === value ) return value
					
					value = value.map( function( item, index ){
						if( item == null ) return
						
						if( typeof item !== 'object' ) item = document.createTextNode( String( item ) )
						
						return item
					} )
					
					oldValue = oldValue || []
					
					oldValue = oldValue.filter( function( item ){
						var newIndex = value.indexOf( item )
						if( ~newIndex ) return true
						
						if( typeof item.nativeNode === 'function' ) var itemNode = item.nativeNode()
						else var itemNode = item
						
						if( itemNode.parentNode === current ){
							current.removeChild( itemNode )
							if( typeof item.freezed === 'function' ) item.freezed( true )
						}
						
						return false
					} )
					
					value.forEach( function( item, index ){
						var oldItem = oldValue[ index ]
						if( oldItem === item ) return
						
						if( typeof item.freezed === 'function' ) item.freezed( false )
						
						if( typeof item.nativeNode === 'function' ) item = item.nativeNode()
						if( oldItem && ( typeof oldItem.nativeNode === 'function' ) ) oldItem = oldItem.nativeNode()
						current.insertBefore( item, oldItem || null )
					} )
					
					return value
				}
			} )
		}
		
		sample.entangle( cover )
		
		covers.push( cover )
		
		$jin.atom.slaves.unshift( null )
		cover.pull()
		$jin.atom.slaves.shift()
	} )
	
	this.covers( covers )
	
	return this
}})

;//../../jin/view/jin_view.env=web.jam.js?=HRUU1G40
$jin.klass({ '$jin.view': [ '$jin.registry' ] })

$jin.method( '$jin.view..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.property.hash( '$jin.view..sample', { pull: function( protoId ){
    var proto = $jin.sample.proto( protoId )
	
	var sample = proto.make( this )
	sample.view( this )
	//this.entangle( sample )
	//sample.activated( true )
	
    return sample
} } )

$jin.property( '$jin.view..htmlID', function( ){
	return String( this.constructor ).replace( /^\$/, '' ).replace( /\./g, '-' ).toLowerCase()
} )

$jin.method( '$jin.view..element', function( key ){
	var protoId = this.htmlID()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
} )

$jin.property( '$jin.view..freezed', function( val ){
    if( !arguments.length ) return true
	
	if( val ){
		var samples = this.sample()
		
		for( var protoId in samples ){
			//samples[ protoId ].activated( false )
			samples[ protoId ].view( null ).free()
			this.sample( protoId, void 0 )
		}
	} else {
		var samples = this.sample()
		
		for( var protoId in samples ){
			//samples[ protoId ].activated( true )
		}
	}
	
	return !!val
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

;//../../jin/uri/jin_uri.jam.js?=HRUSTW7K
$jin.klass({ '$jin.uri': [] })

$jin.property( '$jin.uri.chunkSep', function( sep ){
    return '&'
})

$jin.property( '$jin.uri.valueSep', function( sep ){
    return '='
})

$jin.method( '$jin.uri.escape', function( str ){
    return String( str )
    .replace
    (   /[^- a-zA-Z\/?:@!$'()*+,._~\xA0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\x{4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD\uE000-\uF8FF\uF0000-\uFFFFD\u100000-\u10FFFD}]+/
    ,   encodeURIComponent
    )
    .replace( / /g, '+' )
} )


$jin.property( '$jin.uri..scheme', String )
$jin.property( '$jin.uri..slashes', Boolean )
$jin.property( '$jin.uri..login', String )
$jin.property( '$jin.uri..password', String )
$jin.property( '$jin.uri..host', String )
$jin.property( '$jin.uri..port', Number )
$jin.property( '$jin.uri..path', String )
$jin.property( '$jin.uri..query', Object )
$jin.property( '$jin.uri..hash', String )

$jin.method( '$jin.klass..json', '$jin.uri..json', function( json ){
    if( arguments.length ) return this['$jin.klass..json']( json )
    
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

$jin.method( '$jin.uri..resolve', function( str ){
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

$jin.method( '$jin.uri..toString', function( ){
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

$jin.method( '$jin.uri.parse', function( string ){
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

;//../../jin/state/url/jin_state_url.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.state.url': [] })

$jin.atom.prop( '$jin.state.url.href',
{   pull: function( ){
        return document.location.search + document.location.hash
    }
,   put: String
} )

$jin.atom.prop( '$jin.state.url.hash',
{   pull: function( ){
        var href = this.href().replace( /#/, '?' )
        return $jin.uri.parse( href ).query()
    }
} )

$jin.atom.prop( '$jin.state.url.listener',
{   pull: function( ){
        return setInterval( function( ){
            $jin.state.url.href( document.location.search + document.location.hash )
        }, 50 )
    }
} )

$jin.atom.prop.hash( '$jin.state.url.item',
{   pull: function( key ){
        this.listener()
        var val = this.hash()[ key ]
        return ( val == null ) ? null : val
    }
,   put: function( key, value ){
        var hash = this.hash()
        
        if( value == null ) delete hash[ key ]
        else hash[ key ] = value
        
        document.location = $jin.uri({ query: hash }).toString().replace( '?', '#' ) || '#'
    }
} )

;//../../jin/slide/jin-slide.env=web.jam.js?=HRUSTW7K
$jin.klass({ '$jin.slide': [ '$jin.view' ] })

$jin.property({ '$jin.slide..stack': null })

$jin.atom.prop({ '$jin.slide..resizeCount': {
	pull: function( ){
		$jin.dom.event.onResize.listen( window, function(){
			this.resizeCount( this.resizeCount() + 1 )
		}.bind( this ) )
		return 0
	}
}})

$jin.atom.prop({ '$jin.slide..zoom': {
	pull: function( ){
		this.resizeCount()
		var size = Math.min( document.documentElement.clientWidth, document.documentElement.clientHeight )
		var next = size / 360
		return next
	}
}})

$jin.atom.prop({ '$jin.slide..pageNodeList': {
	pull: function( ){
		var nodes = $jin.doc().cssSelect( '#' + this.id() + ' > section' )
		nodes.forEach( function( node ){
			node.parent( null )
		} )
		return nodes
	}
}})

$jin.atom.prop({ '$jin.slide..pageNodeMap': {
	pull: function( ){
		var map = {}
		this.pageNodeList().forEach( function( node ){
			map[ node.attr( 'jin-slide-page' ) ] = node
		} )
		return map
	}
}})

$jin.atom.prop({ '$jin.slide..pageNodeCurrent': {
	pull: function( prev ){
		var id = $jin.state.url.item( 'slide' )
		return this.pageNodeMap()[ id ] || this.pageNodeList()[ 0 ]
	},
	put: function( next, prev ){
		if( !next ) return prev
		
		$jin.state.url.item( 'slide', next.attr( 'jin-slide-page' ) )
		return next
	}
}})

$jin.atom.prop({ '$jin.slide..pageNumber': {
	pull: function( prev ){
		return this.pageNodeList().indexOf( this.pageNodeCurrent() )
	},
	put: function( next, prev ){
		var nodes = this.pageNodeList()
		if(( next >= 0 )&&( next < nodes.length )){
			this.pageNodeCurrent( nodes[ next ] )
			return next
		} else {
			return prev
		}
	}
}})

$jin.method({ '$jin.slide..goPrev': function( ){
	this.pageNumber( this.pageNumber() - 1 )
	return this
}})

$jin.method({ '$jin.slide..goNext': function( ){
	this.pageNumber( this.pageNumber() + 1 )
	return this
}})

$jin.method({ '$jin.slide..onWheel': function( event ){
	if( event.nativeEvent().wheelDelta < 0 ) this.goNext()
	else this.goPrev()
	event.catched( true )
}})

$jin.method({ '$jin.slide..onPress': function( event ){
	var code = event.keyCode()
	
	if( [ 34, 39, 40 ].indexOf( code ) >= 0 ) this.goNext()
	else if( [ 33, 37, 38 ].indexOf( code ) >= 0 ) this.goPrev()
	else return
	
	event.catched( true )
}})
