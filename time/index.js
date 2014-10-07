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
/**
 * @name $jin.type
 * @method type
 * @member $jin
 * @static
 */
$jin.method({ '$jin.type': function( value ){
	var str = {}.toString.apply( value )
	var type = str.substring( 8, str.length - 1 )
	if( [ 'Window', 'global' ].indexOf( type ) >= 0  ) type = 'Global'
	return type
}})
;
/**
 * @name $jin.concater
 * @method concater
 * @member $jin
 * @static
 */
$jin.method({ '$jin.concater': function( funcs ){
	switch( funcs.length ){
		case 0: return String
		case 1: return funcs[0]
		default:
			var mid = Math.ceil( funcs.length / 2 )
			var first = $jin.concater( funcs.slice( 0, mid ) )
			var second = $jin.concater( funcs.slice( mid ) )
			var types = ( typeof first === 'function' ) + ':' + ( typeof second === 'function' )
			switch( types ){
				case 'true:true': return function( value ){
					return first( value ) + second( value )
				}
				case 'false:true': return function( value ){
					return first + second( value )
				}
				case 'true:false': return function( value ){
					return first( value ) + second
				}
				case 'false:false': return function( value ){
					return first + second
				}
			}
	}
}})

;
/**
 * Generator of date-formatters.
 * Date-formatter is a function that returns string representation of a date.
 *
 * 0 params: hash-table of all patterns
 * 1 param: return date-formatter by pattern
 * 2 params: assign date-formatter for pattern
 *
 * Mnemonics:
 *
 *  * single letter for numbers: M - month number, D - day of month.
 *  * uppercase letters for dates, lowercase for times: M - month number , m - minutes number
 *  * repeated letters for define register count: YYYY - full year, YY - shot year, MM - padded month number
 *  * words, same letter case: Month - localized capitalized month name
 *  * shortcuts: WD - short day of week, Mon - short month name.
 *  * special identifiers: iso8601, stamp.
 *
 * Complex patterns splits by words and then substitute by date-formatters for short patterns
 * For localize output override $jin.l10n( scope, text )
 *
 * Typical usage:
 *     var formatTime = $jin.time.format( 'Weekday, YYYY-MM-DD hh:mm' )
 *     formatTime( $jin.time.moment() )
 *
 * @name $jin.time.format
 * @method format
 * @member $jin.time
 * @param {string} [pattern]
 * @param {function( $jin.date )} [formatter]
 * @static
 */
$jin.property.hash({ '$jin.time.format': { pull: function( pattern ) {

	var lexems = $jin.time.format()
	var patterns = Object.keys( lexems )
	patterns.sort()
	patterns.reverse()

	var funcs = []

	var lexer = RegExp( '(.*?)(' + patterns.join( '|' ) + '|$)', 'g' )
	pattern.replace( lexer, function( str, text, token ){
		if( text ) funcs.push( $jin.value( text ) )
		if( token ) funcs.push( lexems[ token ] )
	})

	return $jin.concater( funcs )
}}})

;
/**
 * @name $jin.wrapper
 * @class $jin.wrapper
 * @returns $jin.wrapper
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.wrapper': [] })

/**
 * @name $jin.wrapper#raw
 * @method raw
 * @member $jin.wrapper
 */
$jin.property({ '$jin.wrapper..raw': null })

/**
 * @name $jin.wrapper.exec
 * @method exec
 * @static
 * @member $jin.wrapper
 */
$jin.method({ '$jin.wrapper.exec': function( obj ){
    if( obj instanceof this ) return obj
    if( obj.raw ) obj = obj.raw()
    return this['$jin.klass.exec']( obj )
}})

/**
 * @name $jin.wrapper#init
 * @method init
 * @member $jin.wrapper
 */
$jin.method({ '$jin.wrapper..init': function( obj ){
    this['$jin.klass..init']
    this.raw( obj )
    return this
}})

;
/**
 * @name $jin.merge.first
 * @method first
 * @member $jin.merge
 * @static
 */
$jin.method({ '$jin.merge.first': function( a, b ){
	return a
}})

/**
 * @name $jin.merge.last
 * @method last
 * @member $jin.merge
 * @static
 */
$jin.method({ '$jin.merge.last': function( a, b ){
	return b
}})

/**
 * @name $jin.merge.summ
 * @method summ
 * @member $jin.merge
 * @static
 */
$jin.method({ '$jin.merge.summ': function( a, b ){
	return a + b
}})

/**
 * @name $jin.merge.sub
 * @method sub
 * @member $jin.merge
 * @static
 */
$jin.method({ '$jin.merge.sub': function( a, b ){
	return a - b
}})

/**
 * @name $jin.merge.mult
 * @method mult
 * @member $jin.merge
 * @static
 */
$jin.method({ '$jin.merge.mult': function( a, b ){
	return a * b
}})

/**
 * @name $jin.merge.div
 * @method div
 * @member $jin.merge
 * @static
 */
$jin.method({ '$jin.merge.div': function( a, b ){
	return a * b
}})

;
/**
 * @name $jin.vector
 * @class $jin.vector
 * @returns $jin.vector
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.vector': [ '$jin.wrapper' ] })

/**
 * @name $jin.vector#init
 * @method init
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..init': function( data ){
	if( !arguments.length ) data = []
	switch( $jin.type( data ) ){
		case 'Array':
			return this['$jin.wrapper..init']( data )
		case 'Object':
			return this['$jin.wrapper..init']([]).json( data )
	}
	throw new Error( 'Wrong data for vector' )
}})

/**
 * @name $jin.vector#x
 * @method x
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..x': function( val ){
	if( !arguments.length ) return this.raw()[0]
	this.raw()[0] = val
	return this
}})

/**
 * @name $jin.vector#y
 * @method y
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..y': function( val ){
	if( !arguments.length ) return this.raw()[1]
	this.raw()[1] = val
	return this
}})

/**
 * @name $jin.vector#z
 * @method z
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..z': function( val ){
	if( !arguments.length ) return this.raw()[2]
	this.raw()[2] = val
	return this
}})

/**
 * @name $jin.vector.merge
 * @method merge
 * @static
 * @member $jin.vector
 */
$jin.method({ '$jin.vector.merge': function( merger, left, right ){
	left = $jin.vector( left ).raw()
	right = $jin.vector( right ).raw()
	
	var res = left.map( function( l, index ){
		var r = right[ index ]
		return merger( l, r )
	} )
	
	return $jin.vector( res )
}})

/**
 * @name $jin.vector#summ
 * @method summ
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..summ': function( right ){
	return $jin.vector.merge( $jin.merge.summ, this, right )
}})

/**
 * @name $jin.vector#sub
 * @method sub
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..sub': function( right ){
	return $jin.vector.merge( $jin.merge.sub, this, right )
}})

/**
 * @name $jin.vector#mult
 * @method mult
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..mult': function( right ){
	return $jin.vector.merge( $jin.merge.mult, this, right )
}})

/**
 * @name $jin.vector#div
 * @method div
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..div': function( right ){
	return $jin.vector.merge( $jin.merge.div, this, right )
}})

;
/**
 * @name $jin.l10n
 * @method l10n
 * @member $jin
 * @static
 */
$jin.method({ '$jin.l10n': function( scope, text ){
	return text
}})

;
/**
 * @name $jin.time.period
 * @class $jin.time.period
 * @mixins $jin.klass
 * @mixins $jin.vector
 * @returns $jin.time.period
 */
$jin.klass({ '$jin.time.period': [ '$jin.vector' ] })

/**
 * @name $jin.time.period.exec
 * @method exec
 * @member $jin.time.period
 * @static
 */
$jin.method({ '$jin.time.period.exec': function( period ){
	if( !arguments.length ) period = []
	switch( $jin.type( period ) ){
		case 'Number':
			period = [ 0, 0, 0, 0, 0, period ]
		case 'Object':
			if( period instanceof this ) return period;
		case 'Array':
			return this['$jin.klass.exec']( period )
		case 'String':
			var parser = /^P(?:([+-]?\d+(?:\.\d+)?)Y)?(?:([+-]?\d+(?:\.\d+)?)M)?(?:([+-]?\d+(?:\.\d+)?)D)?(?:T(?:([+-]?\d+(?:\.\d+)?)h)?(?:([+-]?\d+(?:\.\d+)?)m)?(?:([+-]?\d+(?:\.\d+)?)s)?)?$/i
			var found = parser.exec( period )
			if( found ){
				
				var items = found.slice( 1 ).map( function( val ){
					return Number( val ) || 0
				} )
				
				return this['$jin.klass.exec']( items )
			}
			
			var parser = /^[+-](\d+)(?::(\d+))?$/i
			var found = parser.exec( period )
			if( found ){
				
				var items = [ 0, 0, 0, found[1] | 0, found[2] | 0, 0 ]
				
				return this['$jin.klass.exec']( items )
			}
			
			throw new Error( 'Can not parse time period (' + period + ')' )
		case 'String':
			return this['$jin.wrapper.exec']( period )
		default:
			throw new Error( 'Wrong type of time period (' + $jin.type( period ) + ')' )
	}
}})

/**
 * @name $jin.time.period#toString
 * @method toString
 * @member $jin.time.period
 */
$jin.method({ '$jin.time.period..toString': function( pattern ){
	if( !pattern ){
		pattern = 'P'
		if( this.years() ) pattern += '#Y'
		if( this.months() ) pattern += '#M'
		if( this.days() ) pattern += '#D'
		
		var timePattern = ''
		if( this.hours() ) timePattern += '#h'
		if( this.minutes() ) timePattern += '#m'
		if( this.seconds() ) timePattern += '#s'
		
		if( timePattern ) pattern += 'T' + timePattern
	}
	return $jin.time.format( pattern )( this )
}})

/**
 * @name $jin.time.period#years
 * @method years
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..years': function( value ){
	if( arguments.length ) this.raw()[0] = value
	return this.raw()[0]
}})

/**
 * @name $jin.time.period#months
 * @method months
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..months': function( value ){
	if( arguments.length ) this.raw()[1] = value
	return this.raw()[1]
}})

/**
 * @name $jin.time.period#days
 * @method days
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..days': function( value ){
	if( arguments.length ) this.raw()[2] = value
	return this.raw()[2]
}})

/**
 * @name $jin.time.period#hours
 * @method hours
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..hours': function( value ){
	if( arguments.length ) this.raw()[3] = value
	return this.raw()[3]
}})

/**
 * @name $jin.time.period#minutes
 * @method minutes
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..minutes': function( value ){
	if( arguments.length ) this.raw()[4] = value
	return this.raw()[4]
}})

/**
 * @name $jin.time.period#seconds
 * @method seconds
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..seconds': function( value ){
	if( arguments.length ) this.raw()[5] = value
	return this.raw()[5]
}})

;
$jin.time.format( '#Y', function( period ){
	return period.years() + 'Y'
})

$jin.time.format( '#M', function( period ){
	return period.months() + 'M'
})

$jin.time.format( '#D', function( period ){
	return period.days() + 'D'
})

$jin.time.format( '#h', function( period ){
	return period.hours() + 'h'
})

$jin.time.format( '#m', function( period ){
	return period.minutes() + 'm'
})

$jin.time.format( '#s', function( period ){
	return period.seconds() + 's'
})


$jin.time.format( '# years', function( count ){
	return $jin.l10n.plural( '$jin.time.format:years', count )
})

;
/**
 * @name $jin.ensure.number.range
 * @method range
 * @member $jin.ensure.number
 * @static
 */
$jin.method({ '$jin.ensure.number.range': function( min, max ){
	if( min == null ) min = Number.NEGATIVE_INFINITY
	if( max == null ) max = Number.POSITIVE_INFINITY
	return function( value ){
		if( !arguments.length ) return
		var norm = Number( value )
		if( norm >= min && norm <= max ) return norm
		throw new Error( 'Value must be in range (' + min + '..' + max + ') but given (' + value + ')' )
	}
} })

;
/**
 * @name $jin.ensure.string.paddedLeft
 * @method paddedLeft
 * @member $jin.ensure.string
 * @static
 */
$jin.method({ '$jin.ensure.string.paddedLeft': function( count, letter ){
	if( !letter ) letter = ' '
	return function( value ){
		value = String( value )
		while( value.length < count ) value = letter + value
		return value
	}
}})

/**
 * @name $jin.ensure.string.lowerCase
 * @method lowerCase
 * @member $jin.ensure.string
 * @static
 */
$jin.method({ '$jin.ensure.string.lowerCase': function( ){
	return function( str ){
		return String( str ).toLowerCase()
	}
}})

;
/**
 * @name $jin.pipe
 * @method pipe
 * @member $jin
 * @static
 */
$jin.method({ '$jin.pipe': function( funcs ){
	switch( funcs.length ){
		case 0: return $jin.pipe.nop
		case 1: return funcs[0]
		default:
			var mid = Math.ceil( funcs.length / 2 )
			var inner = $jin.pipe( funcs.slice( 0, mid ) )
			var outer = $jin.pipe( funcs.slice( mid ) )
			return function( value ){
				return outer( inner( value ) )
			}
	}
}})

/**
 * @name $jin.pipe.nop
 * @method nop
 * @member $jin.pipe
 * @static
 */
$jin.method({ '$jin.pipe.nop': function( value ){
	return value
}})
;
/**
 * @name $jin.time.moment
 * @class $jin.time.moment
 * @mixins $jin.klass
 * @returns $jin.time.moment
 */
$jin.klass({ '$jin.time.moment': [] })

/**
 * @name $jin.time.moment.exec
 * @method exec
 * @member $jin.time.moment
 * @static
 */
$jin.method({ '$jin.time.moment.exec': function( time ){
	if( !arguments.length ) time = new Date
	switch( $jin.type( time ) ){
		case 'Number':
			time = new Date( time )
		case 'Date':
			return this['$jin.klass.exec']({ nativeDate: time })
		case 'String':
			var parsed = /^(?:(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d))?)?)?(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d\d\d))?)?)?(Z|[\+\-](\d\d)(?::?(\d\d)?)?)?)?$/.exec( time )
			if( !parsed ) throw new Error( 'Can not parse time moment (' + time + ')' )
			
			return this['$jin.klass.exec']({
				year: parsed[1],
				month: parsed[2] && ( parsed[2] - 1 ),
				day: parsed[3] && ( parsed[3] - 1 ),
				hour: parsed[4],
				minute: parsed[5],
				second: parsed[6],
				millisecond: parsed[7]/*,
				offset: parsed[8]*/
			})
		case 'Object':
			if( time instanceof this ) return time
			return this['$jin.klass.exec']( time )
		default:
			throw new Error( 'Wrong type of time moment (' + $jin.type( time ) + ')' )
	}
}})

/**
 * @name $jin.time.moment#nativeDate
 * @method nativeDate
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..nativeDate': function( date ){
	if( arguments.length ){
		this.year( date.getFullYear() )
		this.month( date.getMonth() )
		this.day( date.getDate() - 1 )
		this.hour( date.getHours() )
		this.minute( date.getMinutes() )
		this.second( date.getSeconds() )
		this.millisecond( date.getMilliseconds() )
		//this.offset( data.getTimezoneOffset() )
	} else {
		return new Date(
			this.year() || 0,
			this.month() || 0,
			this.day() + 1 || 1,
			this.hour() || 0,
			this.minute() || 0,
			this.second() || 0,
			this.millisecond() || 0
		)
	}
}})

/**
 * @name $jin.time.moment#toString
 * @method toString
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..toString': function( pattern ){
	if( !pattern ){
		pattern = ''
		if( !isNaN( this.year() ) ) pattern += 'YYYY'
		if( !isNaN( this.month() ) ) pattern += '-MM'
		if( !isNaN( this.day() ) ) pattern += '-DD'
		if( !isNaN( this.hour() ) ) pattern += 'Thh'
		if( !isNaN( this.minute() ) ) pattern += ':mm'
		if( !isNaN( this.second() ) ) pattern += ':ss'
		if( !isNaN( this.millisecond() ) ) pattern += '.sss'
		//if( !isNaN( this.offset() ) ) pattern += 'zone'
	}
	return $jin.time.format( pattern )( this )
}})

/**
 * @name $jin.time.moment#shift
 * @method shift
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..shift': function( period ){
	period = $jin.time.period( period )
	
	var year = ( this.year() | 0 ) + ( period.years() | 0 )
	var month = ( this.month() | 0 ) + ( period.months() | 0 )
	var day = ( this.day() | 0 ) + ( period.days() | 0 )
	var hour = ( this.hour() | 0 ) + ( period.hours() | 0 )
	var minute = ( this.minute() | 0 ) + ( period.minutes() | 0 )
	var second = ( this.second() | 0 ) + ( period.seconds() | 0 )
	
	var date = new Date( year, month, day + 1, hour, minute, second )
	
	var time = $jin.time.moment({})
	
	if( !isNaN( this.year() ) ) time.year( date.getFullYear() )
	if( !isNaN( this.month() ) ) time.month( date.getMonth() )
	if( !isNaN( this.day() ) ) time.day( date.getDate() - 1 )
	if( !isNaN( this.hour() ) ) time.hour( date.getHours() )
	if( !isNaN( this.minute() ) ) time.minute( date.getMinutes() )
	if( !isNaN( this.second() ) ) time.second( date.getSeconds() )
	
	return time
}})

/**
 * @name $jin.time.moment#clone
 * @method clone
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..clone': function( ){
	return $jin.time.moment({
		year: this.year(),
		month: this.month(),
		day: this.day(),
		hour: this.hour(),
		minute: this.minute(),
		second: this.second(),
		millisecond: this.millisecond()
	})
}})

/**
 * @name $jin.time.moment#year
 * @method year
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..year': $jin.ensure.number.range( 0, 3000 ) })

/**
 * @name $jin.time.moment#month
 * @method month
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..month': $jin.ensure.number.range( 0, 11 ) })

/**
 * @name $jin.time.moment#weekDay
 * @method weekDay
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..weekDay': function( ){
	return this.nativeDate().getDay()
}})

/**
 * @name $jin.time.moment#day
 * @method day
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..day': $jin.ensure.number.range( 0, 30 ) })

/**
 * @name $jin.time.moment#hour
 * @method hour
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..hour': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time.moment#minute
 * @method minute
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..minute': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time.moment#second
 * @method second
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..second': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time.moment#millisecond
 * @method millisecond
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..millisecond': $jin.ensure.number.range( 0, 1000 ) })

/**
 * @name $jin.time.moment#offset
 * @method offset
 * @member $jin.time.moment
 //*/
//$ jin.property({ '$jin.time.moment..offset': $jin.time.period })

;
$jin.time.format( 'Month', function( time ){
	var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
	return $jin.l10n( '$jin.time.format:Month', months[ time.month() ] )
})
$jin.time.format( 'month', $jin.pipe([ $jin.time.format( 'Month' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'Mon', function( time ){
	var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
	return $jin.l10n( '$jin.time.format:Mon', months[ time.month() ] )
})
$jin.time.format( 'mon', $jin.pipe([ $jin.time.format( 'Mon' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'Weekday', function( time ){
	var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
	return $jin.l10n( '$jin.time.format:Weekday', days[ time.weekDay() ] )
})
$jin.time.format( 'weekday', $jin.pipe([ $jin.time.format( 'Weekday' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'WD', function( time ){
	var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
	return $jin.l10n( '$jin.time.format:WD', days[ time.weekDay() ] )
})
$jin.time.format( 'wd', $jin.pipe([ $jin.time.format( 'WD' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'YYYY', function( time ){
	return String( time.year() )
})
$jin.time.format( 'AD', function( time ){
	return Math.ceil( time.year() / 100 )
})
$jin.time.format( 'YY', function( time ){
	return String( time.year() % 100 )
})

$jin.time.format( 'M', function( time ){
	return String( time.month() + 1 )
})
$jin.time.format( 'MM', $jin.pipe([ $jin.time.format( 'M' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 'D', function( time ){
	return String( time.day() + 1 )
})
$jin.time.format( 'DD', $jin.pipe([ $jin.time.format( 'D' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 'h', function( time ){
	return String( time.hour() )
})
$jin.time.format( 'hh', $jin.pipe([ $jin.time.format( 'h' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 'm', function( time ){
	return String( time.minute() )
})
$jin.time.format( 'mm', $jin.pipe([ $jin.time.format( 'm' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 's', function( time ){
	return String( time.second() )
})
$jin.time.format( 'ss', $jin.pipe([ $jin.time.format( 's' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )
$jin.time.format( 'sss', $jin.pipe([
	function( time ){
		return String( time.millisecond() )
	},
	$jin.ensure.string.paddedLeft( 3, '0' )
]))

$jin.time.format( 'zone', function( time ){
	var pad2 = $jin.ensure.string.paddedLeft( 2, '0' )
	var offset = time.offset()
	if( offset < 0 ){
		var sign = '+'
		offset = -offset
	} else {
		var sign = '-'
	}
	return sign + pad2( Math.floor( offset / 60 ) ) + ':' + pad2( offset % 60 )
})


;
/**
 * @name $jin.time.exec
 * @method exec
 * @member $jin.time
 * @static
 */
$jin.method({ '$jin.time.exec': function( time ){
	if( !arguments.length ) return $jin.time.moment()
	switch( $jin.type( time ) ){
		case 'Number':
		case 'Date':
			return $jin.time.moment( time )
		case 'String':
			if( /^[P+-]/i.test( time ) ) return $jin.time.period( time )
			return $jin.time.moment( time )
		default:
			throw new Error( 'Wrong type of time (' + $jin.type( time ) + ')' )
	}
}})

;

//# sourceMappingURL=index.js.map