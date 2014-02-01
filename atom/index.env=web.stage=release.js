;//../../jin/jin.jam.js?=HR3O8C54
this.$jin = function $jin( make, defs ){
	if( typeof defs === 'function' ) defs = new defs
	
	for( var path in defs ){
		if( !defs.hasOwnProperty( path ) ) continue
		
		make( path, defs[ path ] )
	}
	
	return this
}

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

;//../../jin/trait/jin_trait.jam.js?=HR3O8C54
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

;//../../jin/glob/jin_glob.jam.js?=HR3O8C54
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

;//../../jin/definer/jin-definer.jam.js?=HR3O8C54
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

;//../../jin/func/jin_func.jam.js?=HR3O8C54
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

;//../../jin/method/jin_method.jam.js?=HR3O8C54
$jin.definer({ '$jin.method': function( ){ // arguments: resolveName*, path, func
    var resolveList = [].slice.call( arguments )
    var func = resolveList.pop()
    
	var name = resolveList.pop()
	if( !name ) throw new Error( 'Not defined method name' )
	
	if( !func.jin_method_resolves ) func.jin_method_resolves = resolveList
	
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

;//../../jin/mixin/jin_mixin.jam.js?=HR3O8C54
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

;//../../jin/property/jin_property.jam.js?=HR3O8C54
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
			if( value2 === void 0 ) delete storage[ '?' + key ]
			else storage[ '?' + key ] = value2
		} else if( arguments.length ) {
			var value2 = storage[ '?' + key ]
			if( pull && value2 === void 0 ) value2 = storage[ '?' + key ] = pull.call( this, key )
			return value2
		} else {
			return storage
		}
	}
	
	return $jin.method( path, propHash )
}})

;//../../jin/klass/jin_klass.jam.js?=HR4RPVAO
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

;//../../jin/schedule/jin_schedule.jam.js?=HR3O8C54
$jin.method( '$jin.schedule', function( delay, handler ){
    var id = setTimeout( $jin.defer.callback( handler ), delay )
    return { destroy: function( ){
        clearTimeout( id )
    } }
} )

;//../../jin/defer/jin_defer.env=web.jam.js?=HR3O8C54
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

;//../../jin/makeId/jin_makeId.jam.js?=HR3O8C54
$jin.makeId = function( prefix ){
	var seed = $jin.makeId.seeds[ prefix ] || 0
	$jin.makeId.seeds[ prefix ] = seed + 1
    return prefix + ':' + seed
}

$jin.makeId.seeds = {}

;//../../jin/atom/jin-atom.jam.js?=HR4RL734
$jin.klass({ '$jin.atom': [] })

$jin.atom.slaves = []
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._value', void 0 )
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

$jin.method( '$jin.klass..init', '$jin.atom..init', function $jin_atom__init( config ){
	this._id = $jin.makeId( '$jin.atom' )
	this._name = config.name || this._id
	this._slaves = {}
	this._masters = {}
	if( config.pull ) this._pull = config.pull
	if( config.push ) this._push = config.push
	if( config.merge ) this._merge = config.merge
	this._context = config.context
})

$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

$jin.method({ '$jin.atom..get': function( ){
	var slave = $jin.atom.slaves[0]
	if( slave ){
		slave.obey( this )
		this._slaves[ slave.id() ] = slave
	}

	if( this._pull && ( this._scheduled || ( this._value === void 0 ) ) ) return this.pull()

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

	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0

	if( ~$jin.atom.slaves.indexOf( this ) ) throw new Error( 'Recursive atom' )
	$jin.atom.slaves.unshift( this )
	try {
		var newValue = this._pull ? this._pull.call( this._context, this._value ) : this._value
	} finally {
		if( $jin.atom.slaves[0] !== this ) throw new Error( 'Atom is not on top of stack' )
		$jin.atom.slaves.shift()
	}

	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	//if( newValue === void 0 ) return this._value

	if( this._merge ) newValue = this._merge.call( this._context, newValue, this._value )

	this.value( newValue )

	return newValue
}})

$jin.method({ '$jin.atom..put': function( next ){
	if( this._merge ) next = this._merge.call( this._context, next, this._value )
	this.value( next )
	return this
}})

$jin.method({ '$jin.atom..value': function( value ){
	var oldValue = this._value

	if( !arguments.length ) return oldValue

	if( value === oldValue ) return this

	this._value = value
	if( this._push ) this._push.call( this._context, value, oldValue )

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

$jin.method( '$jin.klass..destroy', '$jin.atom..destroy', function( ){
	this.disobeyAll()
	this.disleadAll()
	return $jin.method['$jin.klass..destroy']()
})

$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin( '$jin.atom.logging', '$jin.atom' )
}})

$jin.method( '$jin.atom..notify', '$jin.atom.logging..notify', function( ){
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
})

$jin.property({ '$jin.atom.logging.log': function( ){
	return []
}})

;//../../jin/atom/prop/jin-atom-prop.jam.js?=HR503QKW
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
		} )
    }

	prop.jin_method_resolves = config.resolves || []
	propAtom.jin_method_resolves = prop.jin_method_resolves.map( function( path ){
		return path + 'Atom'
	} )

	$jin.method( path, prop )
	$jin.method( path + 'Atom', propAtom )

    return prop
}})

$jin.definer({ '$jin.atom.prop.list': function( path, config ){
	$jin.atom.prop( path, config )
	
	var propName = path.replace( /([$\w]*\.)+/, '' )
	
	$jin.method( path + 'Add', function( newItems ){
        var items = this[propName]() || []
        
		if( config.merge ) newItems = config.merge.call( this, newItems )
		
        newItems = newItems.filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
	} )
	
	$jin.method( path + 'Drop', function( oldItems ){
		var items = this[propName]() || []
        
		if( config.merge ) oldItems = config.merge.call( this, oldItems )
		
        items = items.filter( function( item ){
            return !~oldItems.indexOf( item )
        })
        
        this[propName]( items )
		
		return this
    } )
	
	$jin.method( path + 'Has', function( item ){
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
