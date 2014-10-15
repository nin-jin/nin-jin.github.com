/**
 * @name $jin
 * @class $jin
 * @singleton
 */
this.$jin = {}

;
this.$jin.value = function $jin_value( value ){
    
    var func = function $jin_value_instance( ){
        return value
    }
	
	func.valueOf = func
	func.toString = func
    
    func.$jin_value = value
    
    return func
}

;
this.$jin.root = $jin.value( this )

;
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

;
$jin.glob = function $jin_glob( name, value ){
    var keyList = name.split( '.' )
    var current = $jin.root()
    var currentName = ''
    
    for( var i = 0; i < keyList.length - 1; ++i ){
        var key = keyList[i] || 'prototype'
        
        if(!( key in current )){
            current[ key ] = $jin.trait.make( keyList.slice( 0, i + 1 ).join( '.' ) )
        }
        
        current = current[ key ]
    }
    
    var key = keyList[ keyList.length - 1 ] || 'prototype'
    
    if( arguments.length > 1 ){
        current[ key ] = value
    } else {
        value = current[ key ]
    }
    
    return value
}

;
/**
 * Создаёт функцию, используемую для создания других сущностей.
 *
 * Все сущности создаются единообразно, через так называемые дефайнеры, которые реализуют две сигнатуры:
 *
 *     function( path : string, config : any ) - в случае статического path лучше использовать вторую форму
 *
 *     function({ path : any }) - этот варинт добавляет $jin.definer
 *
 * Преимущества такого способа объявления сущностей в сравнении с традиционным присвоением:
 *
 *  * Автоматически создаются промежуточные пространства имён.
 *  * Каждая определенная в config функция имееет отображаемое являющееся полным путём к ней (очень удобно при отладке).
 *  * Возможно отслеживание затирания одной сущности другой (избавляет от проблем со случайным затиранием).
 *  * Возможно создание не одной сущности, а целого семейства.
 *  * Возможна регистрация одной сущности в более чем одном месте.
 *  * Каждое определение сущности не зависит от окружения и содержит полную информацию о ней (что, например, используется для генерации jsdoc/jsduck коментариев).
 *  * Легко найти сущность, по имени простым поиском.
 *
 * Недостатки:
 *
 *  * Чтобы IDE и генераторы документации понимали такие определения необходимы развесистые jsdoc/jsduck коментарии.
 *  * В каждом определении указывается полный путь к сущности.
 *
 * @param {string} path
 * @param {function( path: string, config : object )} definer
 */
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

;
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

;
/**
 * Создаёт произвольный метод по указанному пути.
 * В случае если по этому пути уже определен метод, то он будет замещен /конфликтным методом/, который бросает исключение привызове.
 * Чтобы перегрузить один метод другим, необходимо в теле второго упоменуть полное имя первого.
 *
 * Преимущества такого способа определения методов:
 *
 *  * Невозможно случайно затереть уже существующий метод - это возможно только явно.
 *  * Возможность определять методы в произвольном порядке, в том числе даже после примешивания штриха в другой класс.
 *  * Каждая реализация доступна по полному имени в том же объекте, что позволяет точно выбирать какую реализацию вызывать (например, когда надо вызвать реализацию деда в обход родителя), а также даёт минимальное пенельни по производительности (вызов напрямую, вместо apply).
 *
 * @name $jin.method
 * @method method
 * @param {{ path : function }} config
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.method': function( name, func ){
	
	var resolveList = func.jin_method_resolves
	if( !resolveList ){
		resolveList = func.jin_method_resolves = []
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

;
/**
 * @name $jin.mixin
 * @method mixin
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.mixin': function( targetPath, sourcePathList ){
    var trait = $jin.mixin.object( targetPath, sourcePathList )
    
	sourcePathList = sourcePathList.map( function( sourcePath ){
		return sourcePath + '.'
	})
	
    $jin.mixin.object( targetPath + '.', sourcePathList )
    
    return trait
}})

/**
 * @name $jin.mixin.object
 * @method object
 * @static
 * @member $jin.mixin
 */
$jin.definer({ '$jin.mixin.object': function( targetPath, sourcePathList ){
	targetPath = String( targetPath )
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

;
/**
 * @name $jin.property
 * @method property
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.property': function( name, filter ){
    var fieldName = '_' + name
	
	if( filter ){
		var resolveList = filter.jin_method_resolves
		if( !resolveList ){
			resolveList = filter.jin_method_resolves = []
			Object.toString.call( filter ).replace( /['"](\$[.\w]+)['"]/g, function( str, token ){
				if( resolveList.indexOf( token ) >= 0 ) return str
				resolveList.push( token )
			})
		}
		
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
    
    property.jin_method_resolves = resolveList
    
    return $jin.method( name, property )
}})

/**
 * @name $jin.property.hash
 * @method hash
 * @static
 * @member $jin.property
 */
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

;
/**
 * @name $jin.klass
 * @method klass
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.klass': function( path, mixins ){
    mixins.unshift( '$jin.klass' )
    var klass = $jin.mixin( path, mixins )
	return klass
}})

/**
 * @name $jin.klass.exec
 * @method exec
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.exec': function( ){
	var klass = this._internalKlass
	if( !klass ){
		klass = this._internalKlass = function $jin_klass( args ){
			this.init.apply( this, args )
		}
		klass.prototype = this.prototype
	}
	return new klass( arguments )
}})

/**
 * @name $jin.klass.descendantClasses
 * @method descendantClasses
 * @static
 * @member $jin.klass
 */
$jin.property({ '$jin.klass.descendantClasses': function( ){ // TODO: use atoms!
	var paths = this.jin_mixin_slaveList || []
	var lists = paths.map( function( path ){
		var klass = $jin.glob( path )
		return klass.descendantClasses()
	} )
	return [].concat.apply( [ this ], lists )
}})

/**
 * @name $jin.klass.subClass
 * @method subClass
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.subClass': function( fields ){
	var klass = $jin.trait.make()
	for( var key in this ) klass[ key ] = this[ key ]
	var proto = klass.prototype = Object.create( this.prototype )
	for( var key in fields ) proto[ key ] = fields[ key ]
	return klass
}})

/**
 * @name $jin.klass.id
 * @method id
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.id': function( ){
    return this.displayName || this.name
}})

/**
 * @name $jin.klass.toString
 * @method toString
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.toString': function( ){
    return this.id()
}})

/**
 * @name $jin.klass#init
 * @method init
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..init': function( json ){
    return this.json( json )
}})

/**
 * @name $jin.klass#entangleList
 * @method entangleList
 * @member $jin.klass
 */
$jin.property({ '$jin.klass..entangleList': Array })

/**
 * @name $jin.klass#entangle
 * @method entangle
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..entangle': function( value ){
    this.entangleList().push( value )
    return value
}})

/**
 * @name $jin.klass#destroy
 * @method destroy
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..destroy': function( ){
    
    this.entangleList().forEach( function( entangle ){
       entangle.destroy()
    } )
    
    for( var key in this ){
        delete this[ key ]
    }
    
    return this
}})

/**
 * @name $jin.klass#json
 * @method json
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..json': function( json ){
    if( !arguments.length ) return null
    
    if( !json ) return this
    
    for( var key in json ){
        this[ key ]( json[ key ] )
    }
    
    return this
}})

/**
 * @name $jin.klass#methodList
 * @method methodList
 * @member $jin.klass
 */
$jin.property({ '$jin.klass..methodList': Object })

/**
 * @name $jin.klass#method
 * @method method
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..method': function( name ){
    var hash = this.methodHash()
    
    var method = hash[ '_' + name ]
    if( method ) return method
    
    method = function( ){
        return method.content[ method.methodName ].call( method.content, arguments )
    }
    
    return hash[ '_' + name ] = method
}})

;
$jin.identical = function( a, b ){
    if(( typeof a === 'number' )&&( typeof b === 'number' )){
        return String( a ) === String( b )
    }
    
    return ( a === b )
}

;
$jin.makeId = function( prefix ){
	var seeds = $jin.makeId.seeds 
    return seeds[ prefix ] = ( seeds[ prefix ] + 1 ) || 1
}

$jin.makeId.seeds = {}

;
/**
 * @name $jin.support.xmlModel
 * @method xmlModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.xmlModel': function( ){
    return ( window.DOMParser && window.XMLSerializer && window.XSLTProcessor ) ? 'w3c' : 'ms'
}})

/**
 * @name $jin.support.htmlModel
 * @method htmlModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.htmlModel': function( ){
    return document.createElement( 'html:div' ).namespaceURI !== void 0 ? 'w3c' : 'ms'
}})

/**
 * @name $jin.support.eventModel
 * @method eventModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.eventModel': function( ){
    return ( 'addEventListener' in document.createElement( 'div' ) ) ? 'w3c' : 'ms'
}})

/**
 * @name $jin.support.textModel
 * @method textModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.textModel': function( ){
    return ( 'createRange' in document ) ? 'w3c' : 'ms'
}})

;
//# sourceMappingURL=log.js.map

;
/**
 * @name $jin.log
 * @method log
 * @static
 */
$jin.method({ '$jin.log' : function( ){
	if( typeof console === 'undefined' ) return
	
	console.log.apply( console, arguments )

	return arguments[0]
}})

/**
 * @name $jin.info
 * @method info
 * @static
 */
$jin.method({ '$jin.info' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.info.apply( console, arguments )
}})

/**
 * @name $jin.warn
 * @method warn
 * @static
 */
$jin.method({ '$jin.warn' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.warn.apply( console, arguments )
}})

/**
 * @name $jin.log.error
 * @method error
 * @static
 */
$jin.method({ '$jin.log.error' : function( error ){
	if( typeof console === 'undefined' ) return
	
	if( error.jin_log_isLogged ) return
	
	var message = error.stack || error
	
	if( console.exception ) console.exception( error )
	else if( console.error ) console.error( message )
	else if( console.log ) console.log( message )
	
	error.jin_log_isLogged = true
}})

/**
 * @name $jin.log.error.ignore
 * @method ignore
 * @static
 */
$jin.method({ '$jin.log.error.ignore' : function( error ){
	error.jin_log_isLogged = true
	return error
}})

;
/**
 * @name $jin.thread
 * @method thread
 * @static
 * @member $jin
 */
$jin.method({ '$jin.thread': function( proc ){
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
}})


;
/**
 * @name $jin.mock
 * @class $jin.mock
 * @returns $jin.mock
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.mock': [] })

/**
 * @name $jin.mock#path
 * @method path
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..path': String })

/**
 * @name $jin.mock#ownerPath
 * @method ownerPath
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..ownerPath': function( ){
	return this.path().replace( /\.[^.]*$/, '' )
}})

/**
 * @name $jin.mock#fieldName
 * @method fieldName
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..fieldName': function(){
	return this.path().replace( /^.*\./, '' )
}})

/**
 * @name $jin.mock#value
 * @method value
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..value': null })

/**
 * @name $jin.mock#backupValue
 * @method backupValue
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..backupValue': null })

/**
 * @name $jin.mock#backupOwner
 * @method backupOwner
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..backupOwner': null })

/**
 * @name $jin.mock#mocking
 * @method mocking
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..mocking': function( mocking ){
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
}})

/**
 * @name $jin.mock#destroy
 * @method destroy
 * @member $jin.mock
 */
$jin.method({ '$jin.mock..destroy': function( ){
    this.mocking( false )
    this['$jin.klass..destroy']()
}})

;
//# sourceMappingURL=test.js.map

;
/**
 * @name $jin.test
 * @class $jin.test
 * @returns $jin.test
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.test': [] })

/**
 * @name $jin.test.completeList
 * @method completeList
 * @static
 * @member $jin.test
 */
$jin.property({ '$jin.test.completeList': Array })

/**
 * @name $jin.test.pendingList
 * @method pendingList
 * @static
 * @member $jin.test
 */
$jin.property({ '$jin.test.pendingList': Array })

/**
 * @name $jin.test.running
 * @method running
 * @static
 * @member $jin.test
 */
$jin.property({ '$jin.test.running': Array })

/**
 * @name $jin.test.start
 * @method start
 * @static
 * @member $jin.test
 */
$jin.method({ '$jin.test.start': function( ){
	setTimeout( function(){
		var next = this.pendingList().shift()
		if( next ) next.run()
	}.bind( this ), 0 )
}})

/**
 * @name $jin.test#code
 * @method code
 * @member $jin.test
 */
$jin.property({ '$jin.test..code': null })

/**
 * @name $jin.test#passed
 * @method passed
 * @member $jin.test
 */
$jin.property({ '$jin.test..passed': Boolean })

/**
 * @name $jin.test#timeout
 * @method timeout
 * @member $jin.test
 */
$jin.property({ '$jin.test..timeout': Number })

/**
 * @name $jin.test#timer
 * @method timer
 * @member $jin.test
 */
$jin.property({ '$jin.test..timer': null })

/**
 * @name $jin.test#asserts
 * @method asserts
 * @member $jin.test
 */
$jin.property({ '$jin.test..asserts': Array })

/**
 * @name $jin.test#results
 * @method results
 * @member $jin.test
 */
$jin.property({ '$jin.test..results': Array })

/**
 * @name $jin.test#errors
 * @method errors
 * @member $jin.test
 */
$jin.property({ '$jin.test..errors': Array })

/**
 * @name $jin.test#init
 * @method init
 * @member $jin.test
 */
$jin.method({ '$jin.test..init': function( code ){
    this['$jin.klass..init']
    this.code( code )
	this.constructor.pendingList().push( this )
    return this
}})

/**
 * @name $jin.test#destroy
 * @method destroy
 * @member $jin.test
 */
$jin.method({ '$jin.test..destroy': function( destroy ){
    var completeList = this.constructor.completeList()
    var pendingList = this.constructor.pendingList()
    
    completeList.splice( completeList.indexOf( this ), 1 )
    pendingList.splice( pendingList.indexOf( this ), 1 )
    
    return this['$jin.klass..destroy']()
}})

/**
 * @name $jin.test#run
 * @method run
 * @member $jin.test
 */
$jin.method({ '$jin.test..run': function( ){
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
}})

/**
 * @name $jin.test#done
 * @method done
 * @member $jin.test
 */
$jin.property({ '$jin.test..done': function( done ){
    if( !arguments.length ) return false
    if( this.done() ) return true
	
    this.timer( clearTimeout( this.timer() ) )
    
    var passed = true
    this.asserts().forEach( function( assert ){
        passed = passed && assert
    })
    this.passed( passed )
    
    this.constructor.completeList().push( this )
	this.constructor.start()

    return this
}})
    
/**
 * @name $jin.test#fail
 * @method fail
 * @member $jin.test
 */
$jin.method({ '$jin.test..fail': function(){
    throw new Error( 'Failed' )
}})

/**
 * @name $jin.test#ok
 * @method ok
 * @member $jin.test
 */
$jin.method({ '$jin.test..ok': function( value ){
    if( value ) return this
    
    throw new Error( 'Not true (' + value + ')' )
}})

/**
 * @name $jin.test#not
 * @method not
 * @member $jin.test
 */
$jin.method({ '$jin.test..not': function( value ){
    if( !value ) return this
    
    throw new Error( 'Not false (' + value + ')' )
}})

/**
 * @name $jin.test#equal
 * @method equal
 * @member $jin.test
 */
$jin.method({ '$jin.test..equal': function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( passed ) continue
        
        throw new Error( 'Not equal (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
}})

/**
 * @name $jin.test#unique
 * @method unique
 * @member $jin.test
 */
$jin.method({ '$jin.test..unique': function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( !passed ) continue
        
        throw new Error( 'Not unique (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
}})

/**
 * @name $jin.test#callback
 * @method callback
 * @member $jin.test
 */
$jin.method({ '$jin.test..callback': function( func ){
    var test = this
	func = $jin.thread( func )
    return function( ){
        var mockHash = test.mockHash()
		for( var name in mockHash ) mockHash[ name ].mocking( true )
        var res = func.apply( this, arguments )
		for( var name in mockHash ) mockHash[ name ].mocking( false )
		return res
    }
}})

/**
 * @name $jin.test#mockHash
 * @method mockHash
 * @member $jin.test
 */
$jin.property({ '$jin.test..mockHash': Object })

/**
 * @name $jin.test#mock
 * @method mock
 * @member $jin.test
 */
$jin.method({ '$jin.test..mock': function( path, value ){
    var mock = $jin.mock({ path: path, value: value, mocking: true })
    this.mockHash()[ path ] = mock
    return mock
}})

;
$jin.test( function mixin_anonymous( test ){
	var root = {
		foo: {
			bar: function(){ }
		}
	}
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	$jin.mixin.object({ 'bom': [ 'foo' ] })
	
	test.equal( root.bom.bar, root.foo.bar ) 
})


;
$jin.test( function defining( test ){
	var root = {}
	var func = function(){}
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name foo.bar
 * @method bar
 * @static
 * @member foo
 */
$jin.method({ 'foo.bar': func })
	
	test.equal( root.foo.bar, func )
})

$jin.test( function conflicting( test ){
	var root = {}
	var func1 = function(){}
	var func2 = function(){}
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name foo.bar
 * @method bar
 * @static
 * @member foo
 */
$jin.method({ 'foo.bar': func1 })
	/**
 * @name foo.bar
 * @method bar
 * @static
 * @member foo
 */
$jin.method({ 'foo.bar': func2 })
	
	try {
		root.foo.bar()
	} catch( e ){
		var error = e
	}
	
	test.ok( error )
})

$jin.test( function manual_resolving( test ){
	var root = {}
	var func1 = function(){ return 123 }
	var func2 = function(){ return 321 }
	func2.jin_method_resolves = [ '$f.bar1' ]
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name $f.bar1
 * @method bar1
 * @static
 * @member $f
 */
$jin.method({ '$f.bar1': func1 })
	/**
 * @name $f.bar2
 * @method bar2
 * @static
 * @member $f
 */
$jin.method({ '$f.bar2': func2 })
	
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func1 })
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func2 })
	
	root.$f.bar()
})

$jin.test( function auto_resolving( test ){
	var root = {}
	var func1 = function(){ return 123 }
	var func2 = function(){ '$f.bar1'; return 321 }
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name $f.bar1
 * @method bar1
 * @static
 * @member $f
 */
$jin.method({ '$f.bar1': func1 })
	/**
 * @name $f.bar2
 * @method bar2
 * @static
 * @member $f
 */
$jin.method({ '$f.bar2': func2 })
	
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func1 })
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func2 })
	
	root.$f.bar()
})



;
var $jin;
(function ($jin) {
    var object = (function () {
        function object(name) {
            this.objectName = name || '' + ++$jin.object._object_seed;
        }
        object.create = function (config) {
            var parent = this;
            var klass = config.hasOwnProperty('constructor') ? config['constructor'] : function () {
                parent.apply(this, arguments);
            };
            klass.prototype = Object.create(this.prototype);
            for (var key in config) {
                klass.prototype[key] = config[key];
            }
            return klass;
        };

        object.prototype.destroy = function () {
            this.havings.forEach(function (having) {
                return having.destroy();
            });
            this.owner = null;
        };

        Object.defineProperty(object.prototype, "havings", {
            get: function () {
                var havings = [];
                for (var field in this) {
                    if (!this.hasOwnProperty(field))
                        continue;
                    var value = this[field];
                    if (!value)
                        continue;
                    if (value.owner !== this)
                        continue;
                    havings.push(value);
                }
                return havings;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(object.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            set: function (owner) {
                if (owner) {
                    owner[this.objectName] = this;
                } else {
                    if (!this._owner)
                        return;
                    this._owner[this.objectName] = null;
                }
                this._owner = owner;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(object.prototype, "objectPath", {
            get: function () {
                var path = this.objectName;
                if (this._owner)
                    path = this._owner.objectPath + '.' + path;
                return path;
            },
            enumerable: true,
            configurable: true
        });

        object.prototype.toString = function () {
            return this.objectName;
        };
        object._object_seed = 0;
        return object;
    })();
    $jin.object = object;
})($jin || ($jin = {}));
//# sourceMappingURL=object.js.map

;
var $jin;
(function ($jin) {
    (function (test) {
        $jin.test(function (test) {
            var one = new $jin.object();
            var two = new $jin.object();
            test.equal(Number(one.objectName) + 1, Number(two.objectName));
        });
    })($jin.test || ($jin.test = {}));
    var test = $jin.test;
})($jin || ($jin = {}));
//# sourceMappingURL=object.stage=dev.js.map

;
var $jin;
(function ($jin) {
    var schedule = (function () {
        function schedule(timeout, handler) {
            this._handler = handler;
            this.start(timeout);
        }
        schedule.prototype.isScheduled = function () {
            return this._timer != null;
        };

        schedule.prototype.start = function (timeout) {
            if (this._timer)
                return;
            this._timer = setTimeout(this._handler, timeout);
        };

        schedule.prototype.stop = function () {
            clearTimeout(this._timer);
            this._timer = null;
        };

        schedule.prototype.destroy = function () {
            this.stop();
        };
        schedule._queue = [];
        return schedule;
    })();
    $jin.schedule = schedule;
})($jin || ($jin = {}));
//# sourceMappingURL=schedule.js.map

;
var $jin;
(function ($jin) {
    var defer = (function () {
        function defer(handler) {
            this._handler = handler;
            $jin.defer.start(this);
        }
        defer.schedule = function () {
            if (this._schedule)
                return;
            if (!this._queue.length)
                return;

            this._schedule = new $jin.schedule(0, $jin.defer.run);
        };

        defer.start = function (defer) {
            this._queue.push(defer);
            this.schedule();
        };

        defer.stop = function (defer) {
            var index = this._queue.indexOf(defer);
            if (index >= 0)
                this._queue.splice(index, 1);
        };

        defer.callback = function (func) {
            return function () {
                var result = func.apply(this, arguments);
                $jin.defer.run();
                return result;
            };
        };

        defer.run = function () {
            $jin.defer._schedule = undefined;
            $jin.defer.schedule();
            var defer;
            while (defer = $jin.defer._queue.shift()) {
                defer.run();
            }
        };

        defer.prototype.destroy = function () {
            $jin.defer.stop(this);
        };

        defer.prototype.run = function () {
            this._handler();
        };
        defer._queue = [];
        return defer;
    })();
    $jin.defer = defer;
})($jin || ($jin = {}));
//# sourceMappingURL=defer.js.map

;
$jin.test( function deffering( test ){
    test.timeout( 0 )
    new $jin.defer(function(){
        test.equal( x, 1 )
        test.done( true )
    })
    var x = 1
} )

;
var $jin;
(function ($jin) {
    var enumeration = (function () {
        function enumeration(_name) {
            this._name = _name;
        }
        enumeration.prototype.toString = function () {
            return this._name;
        };
        return enumeration;
    })();
    $jin.enumeration = enumeration;
})($jin || ($jin = {}));
//# sourceMappingURL=enumeration.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom2) {
        var status = (function (_super) {
            __extends(status, _super);
            function status() {
                _super.apply(this, arguments);
            }
            status.clear = new status('clear');
            status.pull = new status('pull');
            status.actual = new status('actual');
            status.error = new status('error');
            return status;
        })($jin.enumeration);
        atom2.status = status;
    })($jin.atom2 || ($jin.atom2 = {}));
    var atom2 = $jin.atom2;
})($jin || ($jin = {}));
//# sourceMappingURL=atom-status.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom2) {
        var transit = (function (_super) {
            __extends(transit, _super);
            function transit(config) {
                _super.call(this, config.name);
                this._status = $jin.atom2.status.clear;
                this._masters = {};
                this._mastersDeep = 0;
                this._slavesCount = 0;

                var field = config.name;

                var owner = config.owner;
                if (owner) {
                    var prop = owner[field];
                    if (prop)
                        return prop;
                    this.owner = owner;
                }

                if (config.pull)
                    this._pull = config.pull;
                if (config.get)
                    this._get = config.get;
                if (config.merge)
                    this._merge = config.merge;
                if (config.put)
                    this._put = config.put;
                if (config.reap)
                    this._reap = config.reap;
                if (config.notify)
                    this._notify = config.notify;
                if (config.fail)
                    this._fail = config.fail;

                return this;
            }
            transit.induceSchedule = function () {
                var _this = this;
                if (!this._defer) {
                    this._defer = new $jin.defer(function () {
                        return _this.induce();
                    });
                }
            };

            transit.updateSchedule = function (atom) {
                var deep = atom.mastersDeep();
                var plan = this._updatePlan;
                var queue = plan[deep];
                if (!queue)
                    queue = plan[deep] = [];
                queue.push(atom);

                this.induceSchedule();
            };

            transit.reapSchedule = function (atom) {
                var plan = this._reapPlan[atom.objectPath] = atom;

                this.induceSchedule();
            };

            transit.induce = function () {
                var updatePlan = this._updatePlan;
                for (var deep = 0; deep < updatePlan.length; ++deep) {
                    var queue = updatePlan[deep];
                    if (!queue)
                        continue;
                    if (!queue.length)
                        continue;

                    var atom = queue.shift();
                    if (atom.status() === $jin.atom2.status.clear) {
                        atom.pull();
                    }

                    deep = -1;
                }

                var reapPlan = this._reapPlan;
                this._reapPlan = {};

                for (var id in reapPlan) {
                    var atom = reapPlan[id];
                    if (!atom)
                        continue;
                    if (atom.slavesCount() !== 0)
                        continue;
                    atom._reap();
                }

                this._defer = null;
            };

            transit.prototype.destroy = function () {
                this.clear();
                _super.prototype.destroy.call(this);
            };

            transit.prototype.status = function () {
                return this._status;
            };

            transit.prototype.value = function () {
                return this._value;
            };

            transit.prototype.error = function () {
                return this._error;
            };

            transit.prototype.mastersDeep = function () {
                return this._mastersDeep;
            };

            transit.prototype.slavesCount = function () {
                return this._slavesCount;
            };

            transit.prototype._get = function (value) {
                return value;
            };

            transit.prototype._pull = function (prev) {
                return prev;
            };

            transit.prototype._merge = function (next, prev) {
                return next;
            };

            transit.prototype._put = function (next, prev) {
                this.push(next);
            };

            transit.prototype._reap = function () {
                this.destroy();
            };

            transit.prototype._notify = function (next, prev) {
            };

            transit.prototype._fail = function (error) {
            };

            transit.prototype.push = function (next) {
                var prev = this._value;
                next = this._merge(next, prev);
                this._status = $jin.atom2.status.actual;
                this._value = next;
                if ((next !== prev) || this._error) {
                    this.notify(null, next, prev);
                }
                this._error = undefined;
                return next;
            };

            transit.prototype.fail = function (error) {
                this._status = $jin.atom2.status.error;
                if (this._error !== error) {
                    this._error = error;
                    this.notify(error, undefined, this._value);
                    this._value = undefined;
                }
                return error;
            };

            transit.prototype.notify = function (error, next, prev) {
                if (this._slavesCount) {
                    for (var slaveId in this._slaves) {
                        var slave = this._slaves[slaveId];
                        if (!slave)
                            continue;

                        slave.update();
                    }
                }
                if (error) {
                    this._fail(error);
                } else {
                    this._notify(next, prev);
                }
            };

            transit.prototype.update = function () {
                if (this._status === $jin.atom2.status.clear) {
                    return;
                }

                if (this._status === $jin.atom2.status.pull) {
                    return;
                }

                this._status = $jin.atom2.status.clear;

                $jin.atom2.transit.updateSchedule(this);
            };

            transit.prototype.touch = function () {
                var slave = $jin.atom2.transit.current;
                if (slave) {
                    this.lead(slave);
                    slave.obey(this);
                } else {
                    this.reap();
                }
            };

            transit.prototype.get = function () {
                if (this._status === $jin.atom2.status.pull) {
                    throw new Error('Cyclic dependency of atom:' + this.objectPath);
                }

                this.touch();

                if (this._status === $jin.atom2.status.clear) {
                    this.pull();
                }

                if (this._status === $jin.atom2.status.error) {
                    throw this._error;
                }

                if (this._status === $jin.atom2.status.actual) {
                    return this._get(this._value);
                }

                throw new Error('Unknown status ' + this._status);
            };

            transit.prototype.pull = function () {
                var lastCurrent = $jin.atom2.transit.current;
                $jin.atom2.transit.current = this;

                var oldMasters = this._masters;
                this._masters = {};

                this._status = $jin.atom2.status.pull;

                try  {
                    var value = this._value;
                    value = this._pull(value);
                    this.push(value);
                } catch (error) {
                    this.fail(error);
                } finally {
                    $jin.atom2.transit.current = lastCurrent;

                    for (var masterId in oldMasters) {
                        var master = oldMasters[masterId];
                        if (!master)
                            continue;

                        if (this._masters[masterId])
                            continue;

                        master.dislead(this);
                    }
                }
            };

            transit.prototype.set = function (next) {
                var prev = this._value;

                next = this._merge(next, prev);

                if (next !== prev) {
                    this._put(next, prev);
                }
            };

            transit.prototype.clear = function () {
                var prev = this._value;
                var next = this._value = undefined;

                this.disobeyAll();
                this._status = $jin.atom2.status.clear;
                this.notify(null, next, prev);
            };

            transit.prototype.reap = function () {
                $jin.atom2.transit.reapSchedule(this);
            };

            transit.prototype.lead = function (slave) {
                var slaveId = slave.objectPath;

                if (this._slaves) {
                    if (this._slaves[slaveId])
                        return;
                } else {
                    this._slaves = {};
                }

                this._slaves[slaveId] = slave;

                this._slavesCount++;
            };

            transit.prototype.dislead = function (slave) {
                var slaveId = slave.objectPath;
                if (!this._slaves[slaveId])
                    return;

                this._slaves[slaveId] = null;

                if (!--this._slavesCount) {
                    this.reap();
                }
            };

            transit.prototype.disleadAll = function () {
                if (!this._slavesCount)
                    return;

                for (var slaveId in this._slaves) {
                    var slave = this._slaves[slaveId];
                    if (!slave)
                        continue;

                    slave.disobey(this);
                }

                this._slaves = null;
                this._slavesCount = 0;

                this.reap();
            };

            transit.prototype.obey = function (master) {
                if (this._masters[master.objectPath])
                    return;
                this._masters[master.objectPath] = master;

                var masterDeep = master.mastersDeep();
                if ((this._mastersDeep - masterDeep) > 0)
                    return;

                this._mastersDeep = masterDeep + 1;
            };

            transit.prototype.disobey = function (master) {
                this._masters[master.objectPath] = null;
            };

            transit.prototype.disobeyAll = function () {
                if (!this._mastersDeep)
                    return;

                for (var masterId in this._masters) {
                    var master = this._masters[masterId];
                    if (!master)
                        continue;

                    master.dislead(this);
                }

                this._masters = {};
                this._mastersDeep = 0;
            };

            transit.prototype.then = function (done, fail) {
                var _this = this;
                if (!done)
                    done = function (value) {
                        return value;
                    };
                if (!fail)
                    fail = function (error) {
                        return error;
                    };

                var promise = new $jin.atom2.transit({
                    pull: function (prev) {
                        var next = _this.get();
                        if (next === prev)
                            return prev;

                        promise.disobeyAll();

                        return done(next);
                    },
                    fail: function (error) {
                        promise.disobeyAll();

                        fail(error);
                    }
                });

                promise.push(undefined);
                promise.update();

                return promise;
            };

            transit.prototype.catch = function (fail) {
                return this.then(null, fail);
            };
            transit._updatePlan = [];
            transit._reapPlan = {};
            return transit;
        })($jin.object);
        atom2.transit = transit;
    })($jin.atom2 || ($jin.atom2 = {}));
    var atom2 = $jin.atom2;
})($jin || ($jin = {}));
//# sourceMappingURL=atom-transit.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (prop) {
        (function (test) {
            $jin.test(function (test) {
                var atom1 = new $jin.atom2.transit({
                    pull: function (prev) {
                        return 0;
                    }
                });
                var atom2 = new $jin.atom2.transit({
                    pull: function (prev) {
                        return atom1.get() + 111;
                    }
                });
                var atom3 = new $jin.atom2.transit({
                    pull: function (prev) {
                        return atom2.get() + 333;
                    }
                });

                test.equal(atom3.get(), 444);
                test.equal(atom2.get(), 111);

                atom1.push(666);
                test.equal(atom3.get(), 444);
                test.equal(atom2.get(), 777);
                test.equal(atom3.get(), 1110);
            });

            var AtomTriplet = (function (_super) {
                __extends(AtomTriplet, _super);
                function AtomTriplet() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(AtomTriplet.prototype, "value1", {
                    get: function () {
                        return new $jin.atom2.transit({
                            owner: this,
                            name: '_value1'
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AtomTriplet.prototype, "value2", {
                    get: function () {
                        var _this = this;
                        return new $jin.atom2.transit({
                            owner: this,
                            name: '_value2',
                            pull: function (prev) {
                                return _this.value1.get() + 111;
                            }
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AtomTriplet.prototype, "value3", {
                    get: function () {
                        var _this = this;
                        return new $jin.atom2.transit({
                            owner: this,
                            name: '_value3',
                            pull: function (prev) {
                                return _this.value1.get() && _this.value2.get();
                            }
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                return AtomTriplet;
            })($jin.object);

            $jin.test(function (test) {
                var obj = new AtomTriplet();
                test.equal(obj.value1, obj.value1);
                test.unique(obj.value1, obj.value2);
                obj.value1.push(666);
                test.equal(obj.value2.get(), 777);
            });

            $jin.test(function (test) {
                var log = [];

                var source = new $jin.atom2.transit({});

                var target = source.then(function (value) {
                    log.push('then:' + value);
                    return value + 111;
                });

                target.then(function (value) {
                    return log.push('and:' + value);
                });

                log.push('end');

                setTimeout(function () {
                    test.equal(log.join(';'), 'end;then:666;and:777');
                    test.done(true);
                }, 0);

                source.push(666);

                test.timeout(100);
            });
        })(prop.test || (prop.test = {}));
        var test = prop.test;
    })($jin.prop || ($jin.prop = {}));
    var prop = $jin.prop;
})($jin || ($jin = {}));
//# sourceMappingURL=atom-transit.stage=dev.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom2) {
        var flag = (function (_super) {
            __extends(flag, _super);
            function flag() {
                _super.apply(this, arguments);
            }
            flag.prototype.toggle = function () {
                this.set(!this.get());
            };
            return flag;
        })($jin.atom2.transit);
        atom2.flag = flag;
    })($jin.atom2 || ($jin.atom2 = {}));
    var atom2 = $jin.atom2;
})($jin || ($jin = {}));
//# sourceMappingURL=atom-flag.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom2) {
        var list = (function (_super) {
            __extends(list, _super);
            function list() {
                _super.apply(this, arguments);
            }
            list.prototype._merge = function (next, prev) {
                if (!next || !prev)
                    return next;
                if (next.length !== prev.length)
                    return next;

                for (var i = 0; i < next.length; ++i) {
                    if (next[i] !== prev[i])
                        return next;
                }

                return prev;
            };

            list.prototype._get = function (value) {
                return value && value.slice(0);
            };

            list.prototype.append = function (values) {
                var value = this.get();
                value.push.apply(value, values);
                this.push(value);
            };

            list.prototype.prepend = function (values) {
                var value = this.get();
                value.unshift.apply(value, values);
                this.push(value);
            };

            list.prototype.cut = function (from, to) {
                var value = this.get();
                value.splice(from, to);
                this.push(value);
            };
            return list;
        })($jin.atom2.transit);
        atom2.list = list;
    })($jin.atom2 || ($jin.atom2 = {}));
    var atom2 = $jin.atom2;
})($jin || ($jin = {}));
//# sourceMappingURL=atom-list.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom2) {
        var numb = (function (_super) {
            __extends(numb, _super);
            function numb() {
                _super.apply(this, arguments);
            }
            numb.prototype.increment = function (value) {
                this.set(this.get() + value);
            };

            numb.prototype.decrement = function (value) {
                this.set(this.get() - value);
            };

            numb.prototype.multiply = function (value) {
                this.set(this.get() * value);
            };

            numb.prototype.divide = function (value) {
                this.set(this.get() / value);
            };
            return numb;
        })($jin.atom2.transit);
        atom2.numb = numb;
    })($jin.atom2 || ($jin.atom2 = {}));
    var atom2 = $jin.atom2;
})($jin || ($jin = {}));
//# sourceMappingURL=atom-numb.js.map

//# sourceMappingURL=index.js.map