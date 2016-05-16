this.$friends = {}

;
/**
 * @name $jin
 * @class $jin
 * @singleton
 */
this.$jin = {}

;
//value.js.map

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

;
this.$jin.func.make = function( name ){
    var func = function( ){
        return func.execute( this, arguments )
    }
    return func
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
this.$jin.env = $jin.value( function(){ return this }() )

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
//schedule.js.map

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
//defer.js.map

;
/**
 * @name $jin.listener
 * @class $jin.listener
 * @returns $jin.listener
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.listener': [] })

/**
 * @name $jin.listener#crier
 * @method crier
 * @member $jin.listener
 */
$jin.property({ '$jin.listener..crier': null })

/**
 * @name $jin.listener#eventName
 * @method eventName
 * @member $jin.listener
 */
$jin.property({ '$jin.listener..eventName': String })

/**
 * @name $jin.listener#handler
 * @method handler
 * @member $jin.listener
 */
$jin.property({ '$jin.listener..handler': null })

/**
 * @name $jin.listener#forget
 * @method forget
 * @member $jin.listener
 */
$jin.method({ '$jin.listener..forget': function( ){
    this.crier().forget( this.eventName(), this.handler() )
    return this
}})

/**
 * @name $jin.listener#destroy
 * @method destroy
 * @member $jin.listener
 */
$jin.method({ '$jin.listener..destroy': function( ){
    this.forget()
    this['$jin.klass..destroy']()
}})

;
/**
 * @name $jin.event
 * @class $jin.event
 * @returns $jin.event
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.event': [] })

/**
 * @name $jin.event_type
 * @method event_type
 * @static
 * @member $jin
 */
$jin.property({ '$jin.event_type': function( ){
    return String( this )
}})

/**
 * @name $jin.event.listen
 * @method listen
 * @static
 * @member $jin.event
 */
$jin.method({ '$jin.event.listen': function( crier, handler ){
	var ctor = this
	var wrapper = function( event ){
		return handler( ctor( event ) )
	}
    return crier.listen( this.type(), wrapper )
}})


/**
 * @name $jin.event#target
 * @method target
 * @member $jin.event
 */
$jin.property({ '$jin.event..target': null })
/**
 * @name $jin.event#catched
 * @method catched
 * @member $jin.event
 */
$jin.property({ '$jin.event..catched': Boolean })
    
/**
 * @name $jin.event#type
 * @method type
 * @member $jin.event
 */
$jin.property({ '$jin.event..type': function( type ){
    if( arguments.length ) return String( type )
    return String( this.constructor )
}})

/**
 * @name $jin.event#scream
 * @method scream
 * @member $jin.event
 */
$jin.method({ '$jin.event..scream': function( crier ){
    crier.scream( this )
    return this
}})

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
/**
 * @name $jin.atom1.pushable#notify
 * @method notify
 * @member $jin.atom1.pushable
 */
$jin.method({ '$jin.atom1.pushable..notify': function( next, prev ){
	$jin.atom1.bound( function( ){
		if( this._status === this.constructor.statusNull ) return
		if( this._status === this.constructor.statusError ) return
		
		this._push.call( this._owner, next, prev )
	}.bind(this) )

	return this[ '$jin.atom1.variable..notify' ]( next, prev )
}})


;
//log.js.map

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
 * @name $jin.atom1.logable#notify
 * @method notify
 * @member $jin.atom1.logable
 */
$jin.method({ '$jin.atom1.logable..notify': function( next, prev ){

	$jin.atom1.logable.history().push([ this._name, '=', this._value/*, this*/ ])

	$jin.atom1.logable.deferLog()

	return ( this[ '$jin.atom1.pushable..notify' ] || this[ '$jin.atom1.variable..notify' ] ).call( this, next, prev )
}})

/**
 * @name $jin.atom1.logable.history
 * @method history
 * @static
 * @member $jin.atom1.logable
 */
$jin.property({ '$jin.atom1.logable.history': function( ){
	return []
}})

/**
 * @name $jin.atom1.logable.deferLog
 * @method deferLog
 * @member $jin.atom1.logable
 * @static
 */
$jin.property({ '$jin.atom1.logable.deferLog': function( next  ){
	if( arguments.length ) return next
	
	return new $jin.schedule( 0, function defferedLogging( ){
		this.deferLog( void 0 )
		
		if( console.groupCollapsed ) console.groupCollapsed( '$jin.atom1.logable' )
		
		this.history().forEach( function jin_atom_defferedLog( row ){
			$jin.log.apply( $jin, row )
		} )
		this.history( [] )
		
		if( console.groupEnd ) console.groupEnd( '$jin.atom1.logable' )
		
	}.bind( this ) )
}})

;
/**
 * @name $jin.atom1.variable
 * @class $jin.atom1.variable
 * @mixins $jin.klass
 * @mixins $jin.atom1.thenable
 * @returns $jin.atom1.variable
 */
$jin.klass({ '$jin.atom1.variable': [ '$jin.atom1.thenable' ] })

/**
 * @name $jin.atom1.variable.enableLogs
 * @method enableLogs
 * @static
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable.enableLogs': function( ){
	$jin.mixin( this + '', [ '$jin.atom1.logable' ] )
}})

/**
 * Статус, когда значение неопределено.
 *
 * @name $jin.atom1.variable.statusNull
 * @method statusNull
 * @member $jin.atom1.variable
 * @static
 */
$jin.method({ '$jin.atom1.variable.statusNull': $jin.value( 'null' ) })

/**
 * Статус, когда значение установлено.
 *
 * @name $jin.atom1.variable.statusValue
 * @method statusValue
 * @member $jin.atom1.variable
 * @static
 */
$jin.method({ '$jin.atom1.variable.statusValue': $jin.value( 'value' ) })

/**
 * Статус, когда в качестве значения сохранена ошибка.
 *
 * @name $jin.atom1.variable.statusError
 * @method statusError
 * @member $jin.atom1.variable
 * @static
 */
$jin.method({ '$jin.atom1.variable.statusError': $jin.value( 'error' ) })

$jin.glob( '$jin.atom1.variable._seed', 0 )

/**
 * @name $jin.atom1.variable#init
 * @method init
 * @param {object} config
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..init': function( config ){
	this['$jin.klass..init']
	var klass = this.constructor
	
	this._id = ++$jin.atom1.variable._seed
	this._name = config.name
	
	if( config.error ){
		this._value = config.error
		this._status = klass.statusError
	} else {
		this._value = config.value
		this._status = ( config.value === void 0 ) ? klass.statusNull : klass.statusValue
	}
	
	this._slice = 0
	this._owner = config.objectOwner || config.context
	this._slaves = {}
}})

/**
 * @name $jin.atom1.variable#destroy
 * @method destroy
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..destroy': function( ){
	this.disleadAll()
	return this['$jin.klass..destroy']()
}})

/**
 * Автогенерированный идентификатор.
 *
 * @name $jin.atom1.variable#id
 * @method id
 * @returns {string}
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..id': function( ){
	return this._id
}})

/**
 * @name $jin.atom1.variable#status
 * @method status
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..status': function( next ){
	if( !arguments.length ) return this._status
	this._status = next
	return this
}})

/**
 * @name $jin.atom1.variable#value
 * @method value
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..value': function( next ){
	if( !arguments.length ) return this._value
	return this.put( next )
}})

/**
 * @name $jin.atom1.variable#name
 * @method name
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..name': function( ){
	return this._name + '|' + this._id
}})

/**
 * Текущий номер слоя. На один больше чем максимальный номер среди всех хозяев.
 *
 * @name $jin.atom1.variable#slice
 * @method slice
 * @returns {number}
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..slice': function( ){
	return this._slice
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom1.variable#get
 * @method get
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..get': function( ){
	var slave = $jin.atom1.current
	
	if( slave ){
		slave.obey( this )
		this.lead( slave )
	}
	
	if( this._status === this.constructor.statusError ){
		throw this._value
	} else {
		return this._value
	}
}})

/**
 * @name $jin.atom1.variable#valueOf
 * @method valueOf
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..valueOf': function( ){
	return this.get()
}})

/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom1.variable#change
 * @method change
 * @param {any} next
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..change': function( next, status ){
	this._status = status
	
	var prev = this._value
	if( next === prev ) return this
	
	this._value = next
	
	this.notify( next, prev )

	return this
}})

/**
 * @name $jin.atom1.variable#put
 * @method put
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..put': function( next ){
	return this.change( next, this.constructor.statusValue )
}})

/**
 * @name $jin.atom1.variable#fail
 * @method fail
 * @param {Error} error
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..fail': function( error ){
	return this.change( error, this.constructor.statusError )
}})

/**
 * @name $jin.atom1.variable#clear
 * @method clear
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..clear': function( ){
	//$jin.log('clear',this.name())
	return this.change( void 0, this.constructor.statusNull )
}})

/**
 * Изменить значение используя функцию преобразования.
 *
 * @name $jin.atom1.variable#mutate
 * @method mutate
 * @param {function( value )} mutator
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..mutate': function( mutator ){
	
	var slave = $jin.atom1.current
	$jin.atom1.current = null
	
	try {
		this.put( mutator( this._value ) )
	} catch( error ){
		this.fail( error )
	}
	
	$jin.atom1.current = slave
	
	return this
}})

/**
 * Уведомить ведомых, что значение изменилось.
 *
 * @name $jin.atom1.variable#notify
 * @method notify
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..notify': function( ){
	
	var slaves = this._slaves
	for( var id in slaves ){
		
		var slave = slaves[ id ]
		if( !slave ) continue
		
		slave.update( this )
	}

	return this
}})

/**
 * Добавить ведомого.
 *
 * @name $jin.atom1.variable#lead
 * @method lead
 * @param {$jin.atom1.variable} slave
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..lead': function( slave ){
	
	this._slaves[ slave.id() ] = slave

	return this
}})

/**
 * Убрать ведомого.
 *
 * @name $jin.atom1.variable#dislead
 * @method dislead
 * @param {$jin.atom1.variable} slave
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..dislead': function( slave ){
	
	this._slaves[ slave.id() ] = void 0

	return this
}})

/**
 * Выгнать всех ведомых и отписать их от себя.
 *
 * @name $jin.atom1.variable#disleadAll
 * @method disleadAll
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..disleadAll': function( ){
	var slaves = this._slaves
	
	this._slaves = {}
	
	for( var id in slaves ){
		var slave = slaves[ id ]
		if( !slave ) continue
		
		slave.disobey( this )
	}

}})

/**
 * Возращает атом, который дожидается вычисления текущего, после чего отписывается и вызывает один из колбэков.
 *
 * @name $jin.atom1.thenable#then
 * @method then
 * @param {function( result )} [done]
 * @param {function( error }} [fail]
 * @member $jin.atom1.thenable
 */
$jin.method({ '$jin.atom1.thenable..then': function( done, fail ){

	var promise = $jin.atom1({
		name: 'promise',
		context: this,
		pull: function( prev ){
			return prev || this.get()
		},
		merge: function( next, prev ){
			if( next === prev ) return prev
			promise.disobeyAll()
			return done ? done( next ) : next
		},
		fail: fail
	})
	new $jin.defer( promise.pull.bind( promise ) )
	
	return promise
}})

/**
 * Короткая запись для
 *     .then( null, function( error ){ ... } )
 *
 * @name $jin.atom1.thenable#catch
 * @method catch
 * @param {function( error }} [fail]
 * @member $jin.atom1.thenable
 */
$jin.method({ '$jin.atom1.thenable..catch': function( fail ){
	return this.then( null, fail )
}})

;
/**
 * @name $jin.atom1.pullable
 * @class $jin.atom1.pullable
 * @mixins $jin.klass
 * @mixins $jin.atom1.variable
 * @returns $jin.atom1.pullable
 */
$jin.klass({ '$jin.atom1.pullable': [ '$jin.atom1.variable' ] })

/**
 * Статус, когда идёт вычисление значения.
 *
 * @name $jin.atom1.pullable.statusSync
 * @method statusSync
 * @member $jin.atom1.pullable
 * @static
 */
$jin.method({ '$jin.atom1.pullable.statusSync': $jin.value( 'sync' ) })

$jin.glob( '$jin.atom1.pullable.pullPlan', [] )
$jin.glob( '$jin.atom1.pullable.clearPlan', [] )
$jin.glob( '$jin.atom1.pullable._defer', null )

/**
 * Инициирует вычисление всех запланированных к вычислению атомов. Вычисление происходит по слоям,
 * чем меньше у атома номер слоя (slice), тем  раньше он будет вычислен.
 *
 * @name $jin.atom1.pullable.induce
 * @method induce
 * @static
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable.induce': function( ){
	var pullable = $jin.atom1.pullable
	var pullPlan = pullable.pullPlan
	var statusNull = pullable.statusNull

	scheduled: for( var i = 0; i < pullPlan.length; ++i ){
		var queue = pullPlan[i]
		if( !queue ) continue
		pullPlan[i] = null
		
		for( var j = 0; j < queue.length; ++j ){
			var atom = queue[ j ]
			if( !atom ) continue
			if( atom.status() !== statusNull ) continue
			
			atom.pull()
			
			i = -1
		}
	}
	
	while( true ){
		var clearPlan = pullable.clearPlan
		if( !clearPlan.length ) break
		pullable.clearPlan = []
		
		for( var i = 0; i < clearPlan.length; ++i ){
			var atom = clearPlan[ i ]
			if( atom.slavesCount() ) continue
			atom.freeze()
		}
	}
	
	pullable._defer = null
}})

/**
 * Запланировать вычисление отложенных атомов как можно скорее.
 *
 * @name $jin.atom1.pullable.schedule
 * @method schedule
 * @static
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable.schedule': function( ){
	if( $jin.atom1.pullable._defer ) return

	$jin.atom1.pullable._defer = new $jin.defer( $jin.atom1.pullable.induce )
}})

/**
 * @name $jin.atom1.pullable#init
 * @method init
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..init': function( config ){
	this['$jin.atom1.variable..init']( config )
	this._slavesCount = 0
	this._masters = {}
}})

/**
 * @name $jin.atom1.pullable#slavesCount
 * @method slavesCount
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..slavesCount': function( ){
	return this._slavesCount
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom1.pullable#get
 * @method get
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..get': function( ){
	var status = this._status
	var klass = this.constructor
	
	if( status === klass.statusSync ) throw new Error( 'Circular atom (' + this.name() + ')' )
	
	if( status === klass.statusNull ) this.pull()

	return this['$jin.atom1.variable..get']()
}})

/**
 * @name $jin.atom1.pullable#freeze
 * @method freeze
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..freeze': function( ){
	this.disobeyAll()
	this.status( this.constructor.statusNull )
	return this
}})

/**
 * @name $jin.atom1.pullable#clear
 * @method clear
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..clear': function( ){
	this.freeze()

	return this['$jin.atom1.variable..clear']()
}})

/**
 * Немедленно вычислить значение.
 *
 * @name $jin.atom1.pullable#pull
 * @method pull
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..pull': function( ){
	this._status = this.constructor.statusSync

	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	var prevCurrent = $jin.atom1.current
	$jin.atom1.current = this
	try {
		var next = this._pull.call( this._owner, this._value )
		this.put( next )
	} catch( error ){
		this.fail( error )
	}
	$jin.atom1.current = prevCurrent
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this
}})

/**
 * Запланировать обновление.
 *
 * @name $jin.atom1.pullable#update
 * @method update
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..update': function( atom ){
	var status = this._status
	var pullable = $jin.atom1.pullable
	
	if( status === pullable.statusSync ) return
	else if( status === pullable.statusNull ) return
	
	var slice = this._slice

	var pullPlan = pullable.pullPlan
	var queue = pullPlan[ slice ]
	if( !queue ) queue = pullPlan[ slice ] = []

	queue.push( this )
	
	this._status = pullable.statusNull

	pullable.schedule()

	return this
}})

/**
 * Приписать к хозяину.
 *
 * @name $jin.atom1.pullable#obey
 * @method obey
 * @param {$jin.atom} master
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..obey': function( master ){
	var id = master.id()
	
	this._masters[ id ] = master

	var masterSlice = master.slice()
	if( masterSlice >= this._slice ) this._slice = masterSlice + 1;

	return this
}})

/**
 * Отписать от хозяина.
 *
 * @name $jin.atom1.pullable#disobey
 * @method disobey
 * @param {$jin.atom} master
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

/**
 * Отписаться от всех хозяев и убежать от них.
 *
 * @name $jin.atom1.pullable#disobeyAll
 * @method disobeyAll
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		var master = masters[ id ]
		if( !master ) continue
		
		master.dislead( this )
	}
}})

/**
 * @name $jin.atom1.pullable#lead
 * @method lead
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..lead': function( slave ){
	if( this._slaves[ slave.id() ] ) return this
	
	this[ '$jin.atom1.variable..lead' ]( slave )

	++this._slavesCount
	
	return this
}})

/**
 * @name $jin.atom1.pullable#dislead
 * @method dislead
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..dislead': function( slave ){
	if( !this._slaves[ slave.id() ] ) return this
	
	this[ '$jin.atom1.variable..dislead' ]( slave )
	
	if( !--this._slavesCount ) this.reap()
	
	return this
}})

/**
 * @name $jin.atom1.pullable#disleadAll
 * @method disleadAll
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..disleadAll': function( ){
	
	this[ '$jin.atom1.variable..disleadAll' ]()
	
	this._slavesCount = 0
	
	this.reap()

	return this
}})

/**
 * @name $jin.atom1.pullable#reap
 * @method reap
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..reap': function( ){
	if( !this._slice ) return
	
	var pullable = $jin.atom1.pullable
	
	pullable.clearPlan.push( this )
	pullable.schedule()
	
	return this
}})

;
/**
 * @name $jin.atom1.getable#get
 * @method get
 * @member $jin.atom1.getable
 */
$jin.method({ '$jin.atom1.getable..get': function( ){
	var value = this['$jin.atom1.pullable..get']()
	return this._get.call( this._owner, value )
}})

;
/**
 * @name $jin.atom1.clearable#freeze
 * @method freeze
 * @member $jin.atom1.clearable
 */
$jin.method({ '$jin.atom1.clearable..freeze': function( ){
	this._clear.call( this._owner )
	
	return this['$jin.atom1.pullable..freeze']()
}})

;
/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom1.mergable#put
 * @method put
 * @param {any} next
 * @member $jin.atom1.mergable
 */
$jin.method({ '$jin.atom1.mergable..put': function( next ){
	
	var prev = ( this._status === this.constructor.statusError ) ? null : this._value
	var next2 = this._merge.call( this._owner, next, prev )
	
	return this['$jin.atom1.variable..put']( next2 )
}})

;
/**
 * @name $jin.atom1.failable#fail
 * @method fail
 * @member $jin.atom1.failable
 */
$jin.method({ '$jin.atom1.failable..fail': function( error ){
	this[ '$jin.atom1.variable..fail' ]( error )
	
	return $jin.atom1.bound( function( ){
		return this._fail.call( this._owner, error )
	}.bind(this) )
}})


;
/**
 * @name $jin.error
 * @method error
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.error': function( path, traits ){
	var error = $jin.trait( path )
	error.prototype = new Error
	error.prototype.constructor = error
	$jin.mixin( path, [ '$jin.error' ] )	
}})

$jin.mixin({ '$jin.error': [ '$jin.wrapper' ] })

/**
 * @name $jin.error.exec
 * @method exec
 * @static
 * @member $jin.error
 */
$jin.method({ '$jin.error.exec': function( message ){
	return this['$jin.wrapper.exec']( new Error( message ) )
}})

/**
 * @name $jin.error#init
 * @method init
 * @member $jin.error
 */
$jin.method({ '$jin.error..init': function( error ){
	this['$jin.wrapper..init']( error )
	this.name = this.constructor.id()
	this.message = error.message
	this.stack = error.stack
	return this
}})

;
/**
 * Атом - минимальный кирпичик реактивного приложения. Умеет:
 *
 *  * хранит в себе значение или ошибку (value)
 *  * обладает состоянием (status)
 *  * лениво вычисляет значение (pull) и автоматически подписываться на изменения значений атомов, от которых зависит (obey).
 *  * вызывать обработчики в случае изменения значения (push) или возникновении ошибки (fail)
 *  * сливать новое значение с предыдущим через колбэк (merge)
 *
 * @name $jin.atom
 * @class $jin.atom
 * @cfg {string} name - Имя атома. Используется для отладки. Старайтесь давать атомам уникальные имена.
 * @cfg {any} value - Исходное значение атома. undefined в качестве значения означает, что оно не определено и его надлежит вычислить.
 * @cfg {Error} error - Объект ошибки. При попытке получения значения атома извне она будет бросаться в качестве исключения.
 * @cfg {function( prev )} pull - Функция ленивого вычисления значения.
 * @cfg {function( next, prev )} push - Обработчик изменения значения. В качестве аргументов принимает новое и старое значения.
 * @cfg {function( next, prev )} merge - Функция слияния нового значения со старым. Вызывается перед записью нового значения. Может валидировать, нормализовывать и даже отменять изменение.
 * @cfg {function( error )} fail - Обработчик возникновения ошибки.
 * @cfg {object} context - Контекст в котором вызываются все обработчики.
 * @returns $jin.atom
 * @mixins $jin.klass
 * @mixins $jin.atom1.variable
 * @mixins $jin.atom1.pullable
 * @mixins $jin.atom1.mergable
 * @mixins $jin.atom1.pushable
 */

/**
 * @name $jin.atom1
 * @class $jin.atom1
 * @mixins $jin.klass
 * @returns $jin.atom1
 */
$jin.klass({ '$jin.atom1': [
	'$jin.atom1.variable',
	'$jin.atom1.pullable',
	'$jin.atom1.getable',
	'$jin.atom1.clearable',
	'$jin.atom1.mergable',
	'$jin.atom1.pushable',
	'$jin.atom1.failable'
]})

$jin.glob( '$jin.atom1.current', null )

/**
 * Исключение, которое можно бросить в атоме, чтобы прервать вычисление всей текущей цепочки атомов.
 *
 * На любом уровне его можно либо перехватить через try-catch, либо обработать через fail метод атома.
 *
 * @name $jin.atom1.wait
 * @class $jin.atom1.wait
 * @mixins $jin.error
 * @returns $jin.atom1.wait
 */
$jin.error({ '$jin.atom1.wait': [] })

/**
 * Временно отключить автоматическое слежение за зависимостями, выполнить функцию и включить слежение обратно.
 * Возвращает то, что вернула функция.
 *
 * @name $jin.atom1.bound
 * @method bound
 * @param {function} handler
 * @static
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.bound': function( handler ){
	var slave = this.current
	this.current = null
	var res = handler()
	this.current = slave
	return res
}})

/**
 * @name $jin.atom1#init
 * @method init
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1..init': function( config ){
	
	this['$jin.atom1.pullable..init']( config )
	
	if( config.get ) this._get = config.get
	if( config.pull ) this._pull = config.pull
	if( config.merge ) this._merge = config.merge
	if( config.push ) this._push = config.push
	if( config.fail ) this._fail = config.fail
	if( config.clear ) this._clear = config.clear
}})

/**
 * @name $jin.atom1#_get
 * @method _get
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.._get': function( prev ){
	return prev
}})

/**
 * @name $jin.atom1#_pull
 * @method _pull
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.._pull': function( prev ){
	return prev
}})

/**
 * @name $jin.atom1#_merge
 * @method _merge
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.._merge': function( next ){
	return next
} })

/**
 * @name $jin.atom1#_push
 * @method _push
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.._push': function( ){ } })

/**
 * @name $jin.atom1#_fail
 * @method _fail
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.._fail': function( error ){
	$jin.log.error( error )
} })

/**
 * @name $jin.atom1#_clear
 * @method _clear
 * @member $jin.atom1
 */
$jin.method({ '$jin.atom1.._clear': function( ){ } })

;
/**
 * @name $jin.list
 * @class $jin.list
 * @returns $jin.list
 */
$jin.glob( '$jin.list', function( ){
	var iframe = document.createElement( 'iframe' )
	iframe.id = 'jin-list'
	document.body.appendChild( iframe )
	var Array = iframe.contentWindow.Array
	//document.body.removeChild( iframe )
	return Array
}() )

$jin.mixin({ '$jin.list': [ 'Array' ] })

;
/**
 * @name $jin.list.cast
 * @method cast
 * @member $jin.list
 * @static
 */
$jin.method({ '$jin.list.cast': function( list ){
	if( list instanceof this ) return list
	return this.apply( null, list )
}})

/**
 * @name $jin.list.generate
 * @method generate
 * @member $jin.list
 * @static
 */
$jin.method({ '$jin.list.generate': function( count, make ){
	var list = this( count )
	for( var i = 0; i < count; ++i ) list[ i ] = make( i )
	return list
}})

/**
 * @name $jin.list.isEqual
 * @method isEqual
 * @member $jin.list
 * @static
 */
$jin.method({ '$jin.list.isEqual': function( left, right ){
	if( left.length !== right.length ) return false
	
	for( var i = 0; i < left.length; ++i ){
		if( left[ i ] !== right[ i ] ) return false
	}
	
	return true
}})


/**
 * @name $jin.list#bisect
 * @method bisect
 * @member $jin.list
 */
$jin.method({ '$jin.list..bisect': function( check ){
    var lo = 0
    var hi = this.length
    
    if( !this.length ) return -1
    
    while( lo < hi ){
        var mid = ( lo + hi ) >> 1
        var val = this[ mid ]
        if( check( val ) ) hi = mid
        else lo = mid + 1
    }
    
    return lo
}})

/**
 * @name $jin.list#head
 * @method head
 * @member $jin.list
 */
$jin.method({ '$jin.list..head': function( value ){
	if( !arguments.length ) return this[ 0 ]
	
	this.unshift( value )
	return this
}})

/**
 * @name $jin.list#tail
 * @method tail
 * @member $jin.list
 */
$jin.method({ '$jin.list..tail': function( value ){
	if( !arguments.length ) return this[ this.length - 1 ]
	
	this.push( value )
	return this
}})

/**
 * @name $jin.list#has
 * @method has
 * @member $jin.list
 */
$jin.method({ '$jin.list..has': function( value ){
	return this.indexOf( value ) >= 0
}})


;
/**
 * @name $jin.atom1.prop
 * @method prop
 * @static
 * @member $jin.atom1
 */
$jin.definer({ '$jin.atom1.prop': function( path, config ){
    if( !config.name ) config.name = path
	
	config.clear = config.clear || function( ){
		this[ fieldName ] = null;
	}
	
    var prop = function jin_atom_prop_accessor( next ){
        var atom = propAtom.call( this )
        if( !arguments.length ) return atom.get()
        
		if( next === void 0 ){
			atom.clear()
			return this
		}
		
		var prev = atom.value()
		var next2 = config.merge ? config.merge.call( this, next, prev ) : next
		
		if( next2 === prev ) return this
		
		var next3 = config.put ? config.put.call( this, next2, prev ) : next2
		
		if( next3 !== void 0 ) atom.put( next3 )
		
        return this
    }
    
    var fieldName = '_' + path
    
    var propAtom = function jin_atom_prop_stor( ){
		var atom = this[ fieldName ]
		if( atom ) return atom
		
		config.context = this
        return this[ fieldName ] = Atom( config )
    }

	prop.jin_method_resolves = config.resolves || []
	propAtom.jin_method_resolves = prop.jin_method_resolves.map( function( path ){
		return path + '_atom'
	} )

	$jin.method( path, prop )
	$jin.method( path + '_atom', propAtom )

	// var Atom = $jin.klass( path + '.atom', [ '$jin.atom1.variable' ] ) // very slow init
	var Atom = $jin.atom1.subClass({})
	
	Atom.prototype._name = path
	
	if( config.get ){
		config.get.displayName = path + '.get'
		Atom.prototype._get = config.get
		$jin.mixin( Atom, [ '$jin.atom1.getable' ] )
	}
	
	if( config.pull ){
		config.pull.displayName = path + '.pull'
		Atom.prototype._pull = config.pull
		$jin.mixin( Atom, [ '$jin.atom1.pullable' ] )
	}
	
	if( config.clear ){
		config.clear.displayName = path + '.clear'
		Atom.prototype._clear = config.clear
		$jin.mixin( Atom, [ '$jin.atom1.clearable' ] )
	}
	
	if( config.push ){
		config.push.displayName = path + '.push'
		Atom.prototype._push = config.push
		$jin.mixin( Atom, [ '$jin.atom1.pushable' ] )
	}
	
	if( config.fail ){
		config.fail.displayName = path + '.fail'
		Atom.prototype._fail = config.fail
		$jin.mixin( Atom, [ '$jin.atom1.failable' ] )
	}
	
	if( config.merge ){
		config.merge.displayName = path + '.merge'
		Atom.prototype._merge = config.merge
		$jin.mixin( Atom, [ '$jin.atom1.mergable' ] )
	}
	
    return prop
}})

/**
 * @name $jin.atom1.prop.list
 * @method list
 * @static
 * @member $jin.atom1.prop
 */
$jin.definer({ '$jin.atom1.prop.list': function( path, config ){
	var baseMerge = config.merge
	config.merge = function( next, prev ){
		if( !next ) return next
		
		if( baseMerge ){
			next = baseMerge.call( this, next, prev )
			if( next === prev ) return next;
		}
		
		if( !prev ) return next
		if( $jin.list.isEqual( next, prev ) ) return prev
		
		return next
	}
	
	$jin.atom1.prop( path, config )
	
	var propName = path.replace( /([$\w]*\.)+/, '' )
	
	var add = function( newItems ){
        var items = this[ propName + '_atom' ]().value() || []
        
		if( config.merge ) newItems = config.merge.call( this, newItems )
		
        newItems = newItems.filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
	}
	add.jin_method_resolves = ( config.resolves || [] ).map( function( path ){
		return path + '_add'
	} )
	$jin.method( path + '_add', add )
	
	var drop = function( dropItems ){
		var items = this[ propName + '_atom' ]().value() || []
        
		if( config.merge ) dropItems = config.merge.call( this, dropItems )
		
        items = items.filter( function( item ){
            return dropItems.indexOf( item ) === -1
        })
        
        this[propName]( items )
		
		return this
    }
	drop.jin_method_resolves = ( config.resolves || [] ).map( function( path ){
		return path + '_drop'
	} )
	$jin.method( path + '_drop', drop )

	var has = function( item ){
		if( config.merge ) item = config.merge.call( this, [ item ] )[ 0 ]
		var items = this[propName]()
		if( !items ) return items
        
        return items.indexOf( item ) >= 0 
    }
	has.jin_method_resolves = ( config.resolves || [] ).map( function( path ){
		return path + '_has'
	} )
	$jin.method( path + '_has', has )
	
}})

/**
 * @name $jin.atom1.prop.hash
 * @method hash
 * @static
 * @member $jin.atom1.prop
 */
$jin.definer({ '$jin.atom1.prop.hash': function( path, config ){
    
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
		
		if( next === void 0 ) atom.clear()
		else atom.put( next )
		
		return this;
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
        
        return atomHash[ key ] = $jin.atom1(
		{	name: path + ':' + key /* + ':' + this.id()*/
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

	$jin.method( path + '_atom', function( key ){
		return prop.atom( this, key )
    } )
	
	$jin.method( path + '_clear', function( ){
		var atomHash = this[ fieldName ]
		for( var key in atomHash ) atomHash[ key ].clear()
    } )
	
    return prop
}})

;
//$jin.atom1.prop.hash({ handler:  function $jin_state_item( key, value ){
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

;
/**
 * @name $jin.state.local
 * @class $jin.state.local
 * @returns $jin.state.local
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.state.local': [] })

$jin.atom1.prop( '$jin.state.local.storage',
{   pull: function( ){
        return window.localStorage || {}
    }
} )

$jin.atom1.prop( '$jin.state.local.listener',
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

$jin.atom1.prop.hash( '$jin.state.local.item',
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
 * @name $jin.dom.event
 * @class $jin.dom.event
 * @returns $jin.dom.event
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 * @mixins $jin.event
 */
$jin.klass({ '$jin.dom.event': [ '$jin.wrapper', '$jin.event' ] })

/**
 * @name $jin.dom.event.bubbles
 * @method bubbles
 * @static
 * @member $jin.dom.event
 */
$jin.property({ '$jin.dom.event.bubbles': Boolean })

/**
 * @name $jin.dom.event.cancelable
 * @method cancelable
 * @static
 * @member $jin.dom.event
 */
$jin.property({ '$jin.dom.event.cancelable': Boolean })

/**
 * @name $jin.dom.event.listen
 * @method listen
 * @static
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event.listen': function( crier, handler ){
	crier = $jin.dom( crier )
    return this[ '$jin.event.listen' ]( crier, handler )
}})

/**
 * @name $jin.dom.event#nativeEvent
 * @method nativeEvent
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..nativeEvent': function( ){
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
}})

/**
 * @name $jin.dom.event#target
 * @method target
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..target': function( ){
    this['$jin.event..target']
    return $jin.dom( this.nativeEvent().target || this.nativeEvent().srcElement )
}})

/**
 * @name $jin.dom.event#type
 * @method type
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..type': function( type ){
    this['$jin.event..type']
    var nativeEvent = this.nativeEvent()
    type = String( type )
    
    if( !arguments.length ){
        return nativeEvent.$jin_dom_event_type || nativeEvent.type
    }
    
    nativeEvent.initEvent( type, this.bubbles(), this.cancelable() )
    nativeEvent.$jin_dom_event_type= nativeEvent.type= type
    
    return this
}})

/**
 * @name $jin.dom.event#bubbles
 * @method bubbles
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..bubbles': function( bubbles ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.bubbles
    }
    
    nativeEvent.initEvent( this.type(), Boolean( bubbles ), this.cancelable() )
    
    return this
}})

/**
 * @name $jin.dom.event#cancelable
 * @method cancelable
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..cancelable': function( cancelable ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.cancelable
    }
    
    nativeEvent.initEvent( this.type(), this.bubbles(), Boolean( cancelable ) )
    
    return this
}})

/**
 * @name $jin.dom.event#catched
 * @method catched
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..catched': function( catched ){
    this['$jin.event..catched']
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.defaultPrevented || nativeEvent.$jin_dom_event_catched || ( nativeEvent.returnValue === false )
    }
    
    nativeEvent.returnValue= !catched
    
    if( catched && nativeEvent.preventDefault ){
        nativeEvent.preventDefault()
    }
    
    nativeEvent.$jin_dom_event_catched = nativeEvent.defaultPrevented = !!catched
    
    return this
}})

/**
 * @name $jin.dom.event#keyCode
 * @method keyCode
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..keyCode': function( ){
    return this.nativeEvent().keyCode
}})

/**
 * @name $jin.dom.event#modCtrl
 * @method modCtrl
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..modCtrl': function( ){
	var nativeEvent = this.nativeEvent()
    return nativeEvent.ctrlKey || nativeEvent.metaKey
}})

/**
 * @name $jin.dom.event#modAlt
 * @method modAlt
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..modAlt': function( ){
    return this.nativeEvent().altKey
}})

/**
 * @name $jin.dom.event#modShift
 * @method modShift
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..modShift': function( ){
    return this.nativeEvent().shiftKey
}})

/**
 * @name $jin.dom.event#mouseButton
 * @method mouseButton
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..mouseButton': function( ){
    return this.nativeEvent().button
}})

/**
 * @name $jin.dom.event#transfer
 * @method transfer
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..transfer': function( ){
    return this.nativeEvent().dataTransfer
}})

/**
 * @name $jin.dom.event#data
 * @method data
 * @member $jin.dom.event
 */
$jin.property({ '$jin.dom.event..data': function( data ){
	function encode( data ){
		var str = JSON.stringify( data )
		var res = ''
		for( var i = 0; i < str.length; ++i ){
			var code = str.charCodeAt(i)
			res += '\\u'
			res += ( ( code >> 12 ) % 16 ).toString( 16 )
			res += ( ( code >> 8 ) % 16 ).toString( 16 )
			res += ( ( code >> 4 ) % 16 ).toString( 16 )
			res += ( code % 16 ).toString( 16 )
		}
		return res
	}
	
	function decode( str ){
		return JSON.parse( JSON.parse( '"' + str + '"' ) )
	}
	
	var transfer = this.transfer()
	if( arguments.length ){
		var str = encode( data )
		$jin.state.local.item( '$jin.dom.event.data', str )
		
		str = '$jin.dom.event.data:' + str
		//transfer.setData( 'Text', str )
		try {
			transfer.setData( str, '' )
		} catch( error ){ }
		
		return data
	} else {
		var str = transfer.getData( 'Text' )
		if( str ) str = str.split( /^$jin.dom.event.data:/ )[1]
		if( !str ){
			var types = transfer.types
			if( types ) for( var i = 0; i < types.length; ++i ){
				var type = transfer.types[i]
				if( !type ) continue
				str = type.split( /^$jin.dom.event.data:/ )[1]
				if( !str ) continue
			}
		}
		if( !str ) str = $jin.state.local.item( '$jin.dom.event.data' )
		if( !str ) return {}
		return decode( str )
	}
}})

/**
 * @name $jin.dom.event#offset
 * @method offset
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..offset': function( ){
    return $jin.vector([ this.nativeEvent().offsetX, this.nativeEvent().offsetY ])
}})

/**
 * @name $jin.dom.event#pos
 * @method pos
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..pos': function( ){
    return $jin.vector([ this.nativeEvent().pageX, this.nativeEvent().pageY ])
}})

;
/**
 * @name $jin.dom.event.onBlur
 * @class $jin.dom.event.onBlur
 * @returns $jin.dom.event.onBlur
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onBlur': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onBlur.type
 * @method type
 * @static
 * @member $jin.dom.event.onBlur
 */
$jin.method({ '$jin.dom.event.onBlur.type': function( ){
    this['$jin.event.type']
    return 'blur'
}})

;
/**
 * @name $jin.dom.event.onClick
 * @class $jin.dom.event.onClick
 * @returns $jin.dom.event.onClick
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onClick': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onClick.type
 * @method type
 * @static
 * @member $jin.dom.event.onClick
 */
$jin.method({ '$jin.dom.event.onClick.type': function( ){
    this['$jin.event.type']
    return 'click'
}})

;
/**
 * @name $jin.dom.event.onInput
 * @class $jin.dom.event.onInput
 * @returns $jin.dom.event.onInput
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onInput': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onInput.type
 * @method type
 * @static
 * @member $jin.dom.event.onInput
 */
$jin.method({ '$jin.dom.event.onInput.type': function( ){
    this['$jin.event.type']
    return 'input'
}})

//$jin.method( '$jin.dom.event.listen', '$jin.dom.event.onInput_listen', function( crier, handler ){
//	var crier = $jin.dom( crier )
//	
//	crier.editable( true )
//	
//	return this.$jin.dom.event.listen( crier, handler )
//} )

;
/**
 * @name $jin.dom.event.onPress
 * @class $jin.dom.event.onPress
 * @returns $jin.dom.event.onPress
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onPress': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onPress.type
 * @method type
 * @static
 * @member $jin.dom.event.onPress
 */
$jin.method({ '$jin.dom.event.onPress.type': function( ){
    this['$jin.event.type']
    return 'keydown'
}})

;
/**
 * @name $jin.dom.event.onWheel
 * @class $jin.dom.event.onWheel
 * @returns $jin.dom.event.onWheel
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onWheel': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onWheel.type
 * @method type
 * @static
 * @member $jin.dom.event.onWheel
 */
$jin.method({ '$jin.dom.event.onWheel.type': function( ){
    this['$jin.event.type']
    return 'wheel'
}})

;
/**
 * @name $jin.dom.event.onChange
 * @class $jin.dom.event.onChange
 * @returns $jin.dom.event.onChange
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onChange': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onChange.type
 * @method type
 * @static
 * @member $jin.dom.event.onChange
 */
$jin.method({ '$jin.dom.event.onChange.type': function( ){
    this['$jin.event.type']
    return 'change'
}})

;
/**
 * @name $jin.dom.event.onResize
 * @class $jin.dom.event.onResize
 * @returns $jin.dom.event.onResize
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onResize': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onResize.type
 * @method type
 * @static
 * @member $jin.dom.event.onResize
 */
$jin.method({ '$jin.dom.event.onResize.type': function( ){
    this['$jin.event.type']
    return 'resize'
}})

;
/**
 * @name $jin.dom.event.onScroll
 * @class $jin.dom.event.onScroll
 * @returns $jin.dom.event.onScroll
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onScroll': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onScroll.type
 * @method type
 * @static
 * @member $jin.dom.event.onScroll
 */
$jin.method({ '$jin.dom.event.onScroll.type': function( ){
    this['$jin.event.type']
    return 'scroll'
}})

;
/**
 * @name $jin.dom.event.onDoubleClick
 * @class $jin.dom.event.onDoubleClick
 * @returns $jin.dom.event.onDoubleClick
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onDoubleClick': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onDoubleClick.type
 * @method type
 * @static
 * @member $jin.dom.event.onDoubleClick
 */
$jin.method({ '$jin.dom.event.onDoubleClick.type': function( ){
    this['$jin.event.type']
    return 'dblclick'
}})

;
/**
 * @name $jin.dom.selection
 * @class $jin.dom.selection
 * @returns $jin.dom.selection
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.dom.selection': [ '$jin.wrapper' ] })

/**
 * @name $jin.dom.selection#raw
 * @method raw
 * @member $jin.dom.selection
 */
$jin.method({ '$jin.dom.selection..raw': function(){
	this['$jin.wrapper..raw']
	return this.nativeSelection.apply( this, arguments )
}})

/**
 * @name $jin.dom.selection#nativeSelection
 * @method nativeSelection
 * @member $jin.dom.selection
 */
$jin.property({ '$jin.dom.selection..nativeSelection': null })

/**
 * @name $jin.dom.selection#clear
 * @method clear
 * @member $jin.dom.selection
 */
$jin.method({ '$jin.dom.selection..clear': function( ){
	var sel = this.nativeSelection()
	if( sel.removeAllRanges ) sel.removeAllRanges()
	else if( sel.clear ) sel.clear()
	else throw new Error( 'Unsupported selection type' )
	
	return this
}})

/**
 * @name $jin.dom.selection#range
 * @method range
 * @member $jin.dom.selection
 */
$jin.method({ '$jin.dom.selection..range': function( ){
	var sel = this.nativeSelection()
	if( sel.rangeCount ) return $jin.dom.range( sel.getRangeAt( 0 ).cloneRange() )
	if( document.createRange ) return $jin.dom.range( document.createRange() )
	if( sel.createRange ) return $jin.dom.range( sel.createRange() )
	throw new Error( 'Unsupported selection type' )
}})

;
/**
 * @name $jin.doc
 * @class $jin.doc
 * @returns $jin.doc
 * @mixins $jin.klass
 * @mixins $jin.dom
 */
$jin.klass({ '$jin.doc': [ '$jin.dom' ] })

/**
 * @name $jin.doc.exec
 * @method exec
 * @static
 * @member $jin.doc
 */
$jin.method({ '$jin.doc.exec': function( node ){
	if( !arguments.length ) node = window.document
	
	var doc = node[ '$jin.doc' ]
	if( doc ) return doc
	
	return node[ '$jin.doc' ] = this['$jin.wrapper.exec']( node )
}})

/**
 * @name $jin.doc#findById
 * @method findById
 * @member $jin.doc
 */
$jin.method({ '$jin.doc..findById': function( id ){
	return $jin.dom( this.nativeNode().getElementById( id ) )
}})

/**
 * @name $jin.doc#selection
 * @method selection
 * @member $jin.doc
 */
$jin.method({ '$jin.doc..selection': function( ){
	var doc = this.nativeNode()
	return $jin.dom.selection( doc.defaultView ? doc.defaultView.getSelection() : doc.selection )
}})

/**
 * @name $jin.doc#sizeListener
 * @method sizeListener
 * @member $jin.doc
 */
$jin.property({ '$jin.doc..sizeListener': function( ){
	return this.entangle( $jin.dom.event.onResize.listen( window, function( ){
		this.size( void 0 )
	}.bind( this ) ) )
} } )

/**
 * @name $jin.doc#size
 * @method size
 * @member $jin.doc
 */
$jin.atom1.prop({ '$jin.doc..size': {
	resolves: [ '$jin.dom..size' ],
	pull: function( ){
		this.sizeListener()
		var root = document.documentElement
		return $jin.vector([ root.clientWidth, root.clientHeight ])
	}
} } )

;
/**
 * @name $jin.dom.range
 * @class $jin.dom.range
 * @returns $jin.dom.range
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.dom.range': [ '$jin.wrapper' ] })

/**
 * @name $jin.dom.range#raw
 * @method raw
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..raw': function(){
	this['$jin.wrapper..raw']
	return this.nativeRange.apply( this, arguments )
}})

/**
 * @name $jin.dom.range#nativeRange
 * @method nativeRange
 * @member $jin.dom.range
 */
$jin.property({ '$jin.dom.range..nativeRange': function( range ){
	if( !range ) throw new Error( 'Wrong TextRange object (' + range + ')' )
	return range
}})

/**
 * @name $jin.dom.range.create
 * @method create
 * @static
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range.create': function( ){
	return $jin.doc().selection().range()
}})

/**
 * @name $jin.dom.range#select
 * @method select
 * @member $jin.dom.range
 */
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

/**
 * @name $jin.dom.range#collapse2start
 * @method collapse2start
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..collapse2start': function( ){
	this.nativeRange().collapse( true )
	return this
}})

/**
 * @name $jin.dom.range#collapse2end
 * @method collapse2end
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..collapse2end': function( ){
	this.nativeRange().collapse( false )
	return this
}})

/**
 * @name $jin.dom.range#clear
 * @method clear
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..clear': function( ){
	this.nativeRange().deleteContents()
	return this
}})

/**
 * @name $jin.dom.range#html
 * @method html
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..html': function( html ){
	if( !arguments.length ) return $jin.dom( this.nativeRange().cloneContents() ).toString()
	
	var node = $jin.dom( html )
	this.replace( node )
	
	return this
}})

/**
 * @name $jin.dom.range#text
 * @method text
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..text': function( text ){
	if( !arguments.length ) return $jin.dom.html2text( this.html() )
	
	this.html( $jin.dom.escape( text ) )
	
	return this
}})

/**
 * @name $jin.dom.range#replace
 * @method replace
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..replace': function( dom ){
	var node = $jin.dom( dom ).nativeNode()
	var range = this.nativeRange()
	
	this.clear()
	range.insertNode( node )
	range.selectNode( node )
	
	return this
}})

/**
 * @name $jin.dom.range#ancestor
 * @method ancestor
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..ancestor': function( ){
	return $jin.dom( this.nativeRange().commonAncestorContainer )
}})

if( $jin.support.textModel() === 'w3c' ){
	/**
 * @name $jin.dom.range#compare
 * @method compare
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..compare': function( how, range ){
		if( range.nativeRange ) range = range.nativeRange()
		how = Range[ how.replace( '2', '_to_' ).toUpperCase() ]
		
		return range.compareBoundaryPoints( how, this.nativeRange() )
	}})
} else {
	/**
 * @name $jin.dom.range#compare
 * @method compare
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..compare': function( how, range ){
		if( range.nativeRange ) range = range.nativeRange()
		how = { start2start: 'StartToStart', start2end: 'StartToEnd', end2start: 'EndToStart', end2end: 'EndToEnd' }[ how ]
		
		return range.compareEndPoints( how, this.nativeRange() )
	}})
}

/**
 * @name $jin.dom.range#hasRange
 * @method hasRange
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..hasRange': function( range ){
	if( range.nativeRange ) range = range.nativeRange()
	var isAfterStart = ( this.compare( 'start2start', range ) >= 0 )
	var isBeforeEnd = ( this.compare( 'end2end', range ) <= 0 )
	return isAfterStart && isBeforeEnd
}})

/**
 * @name $jin.dom.range#equalize
 * @method equalize
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..equalize': function( how, range ){
	if( range.nativeRange ) range = range.nativeRange()
	how = how.split( 2 )
	var method = { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
	this.nativeRange()[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
	return this
}})

/**
 * @name $jin.dom.range#clone
 * @method clone
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..clone': function( ){
	return $jin.dom.range( this.nativeRange().cloneRange() )
}})

/**
 * @name $jin.dom.range#aimNodeContent
 * @method aimNodeContent
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..aimNodeContent': function( node ){
	if( node.nativeNode ) node = node.nativeNode()
	var range = this.nativeRange()
	if( range.selectNodeContents ) range.selectNodeContents( node )
	else if( range.moveToElementText ) range.moveToElementText ( node )
	return this
}})

/**
 * @name $jin.dom.range#aimNode
 * @method aimNode
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..aimNode': function( node ){
	if( node.nativeNode ) node = node.nativeNode()
	this.nativeRange().selectNode( node )
	return this
}})

/**
 * @name $jin.dom.range#move
 * @method move
 * @member $jin.dom.range
 */
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
		if( current.name() === 'BR' ){
			if( offset ){
				offset -= 1
			} else {
				var range = $jin.dom.range.create().aimNode( current )
				this.equalize( 'start2start', range )
				return this
			}
		}
		current = current.delve()
	}
	
	return this
}})

;
/**
 * @name $jin.dom
 * @class $jin.dom
 * @returns $jin.dom
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
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

/**
 * @name $jin.dom.env
 * @method env
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.env': function( ){
    return $jin.env()
}})

/**
 * @name $jin.dom.escape
 * @method escape
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.escape': function( val ){
    return val.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&apos;' )
}})

/**
 * @name $jin.dom.decode
 * @method decode
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.decode': function( text ){
	var decoder = document.createElement( 'textarea' )
	decoder.innerHTML = text
	return decoder.value
}})

/**
 * @name $jin.dom.html2text
 * @method html2text
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.html2text': function( html ){
	return $jin.dom.decode(
		String( html )
		//.replace( /<span[^>]*>/gi, '' )
		//.replace( /<div[^>]*><br[^>]*><\/div>?/gi, '\n' )
		//.replace( /(^|\n)<div[^>]*>/gi, '' )
		//.replace( /<br[^>]*><\/div>/gi, '' )
		//.replace( /<div[^>]*>/gi, '\n' )
		.replace( /<br[^>]*>/gi, '\n' )
		.replace( /<[^<>]+>/g, '' )
	)
}})

/**
 * @name $jin.dom#init
 * @method init
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..init': function( node ){
    this['$jin.wrapper..init']
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
}})

/**
 * @name $jin.dom#raw
 * @method raw
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..raw': function(){
	this['$jin.wrapper..raw']
	return this.nativeNode.apply( this, arguments )
}})

/**
 * @name $jin.dom#nativeNode
 * @method nativeNode
 * @member $jin.dom
 */
$jin.property({ '$jin.dom..nativeNode': null })
    
/**
 * @name $jin.dom#nativeDoc
 * @method nativeDoc
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..nativeDoc': function( ){
    var node = this.raw()
    return node.ownerDocument || node
}})
    
/**
 * @name $jin.dom#toString
 * @method toString
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..toString': function( ){
    var serializer = new( $jin.dom.env().XMLSerializer )
    return serializer.serializeToString( this.nativeNode() )
}})
    
/**
 * @name $jin.dom#transform
 * @method transform
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..transform': function( stylesheet ){
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( $jin.dom( stylesheet ).nativeDoc() )
    var doc= proc.transformToDocument( this.nativeNode() )
    return $jin.dom( doc )
}})
    
/**
 * @name $jin.dom#render
 * @method render
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..render': function( from, to ){
    from= $jin.dom( from ).nativeNode()
    to= $jin.dom( to ).nativeNode()
    
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( this.nativeDoc() )
    var res= proc.transformToFragment( from, to.ownerDocument )
    to.innerHTML= ''
    to.appendChild( res )
    
    return this
}})
    
/**
 * @name $jin.dom#name
 * @method name
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..name': function( ){
	var node = this.nativeNode()
    return node.nodeName
}})

/**
 * @name $jin.dom#attr
 * @method attr
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..attr': function( name, value ){
    if( arguments.length > 1 ){
        if( value == null ) this.nativeNode().removeAttribute( name )
        else this.nativeNode().setAttribute( name, value )
        return this
    } else {
        return this.nativeNode().getAttribute( name )
    }
}})
    
/**
 * @name $jin.dom#attrList
 * @method attrList
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..attrList': function( ){
    var nodes= this.nativeNode().attributes
    
    if( !nodes ) return []
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
}})

/**
 * @name $jin.dom#text
 * @method text
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..text': function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
	    if( 'innerText' in node ) node.innerText = value
        else if( 'textContent' in node ) node.textContent = value
	    else throw new Error( 'Can not put text to node (' + node + ')' )
        return this
    } else {
        return $jin.dom.html2text( this.html() )
    }
}})

/**
 * @name $jin.dom#clear
 * @method clear
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..clear': function( ){
    var node = this.nativeNode()
    var child
    while( child= node.firstChild ){
        node.removeChild( child )
    }
    return this
}})

/**
 * @name $jin.dom#parent
 * @method parent
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..parent': function( parent ){
    var node = this.nativeNode()
    if( arguments.length ){
        if( parent == null ){
            parent= node.parentNode
            if( parent ) parent.removeChild( node )
        } else {
            var parentNode = $jin.dom( parent ).nativeNode()
            if( node.parentNode !== parentNode ) parentNode.appendChild( node )
        }
        return this
    } else {
        parent= node.parentNode || node.ownerElement
        return parent ? $jin.dom( parent ) : parent
    }
}})

/**
 * @name $jin.dom#next
 * @method next
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..next': function( next ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var next = node.nextSibling
        if( next ) next = $jin.dom( next )
        return next
    }
    throw new Error( 'Not implemented' )
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node.nextSibling )
    return this
}})

/**
 * @name $jin.dom#prev
 * @method prev
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..prev': function( prev ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var prev = node.previousSibling
        if( prev ) prev = $jin.dom( prev )
        return prev
    }
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node )
    return this
}})

/**
 * @name $jin.dom#head
 * @method head
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..head': function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.firstChild
        if( node ) node = $jin.dom( node )
        return node
    }
    node.insertBefore( $jin.dom( dom ).nativeNode(), this.head().nativeNode() )
    return this
}})

/**
 * @name $jin.dom#tail
 * @method tail
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..tail': function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.lastChild
        if( node ) node = $jin.dom( node )
        return node
    }
    $jin.dom( dom ).parent( this )
    return this
}})

/**
 * @name $jin.dom#follow
 * @method follow
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..follow': function( ){
	var node = this
	while( true ){
		var next = node.next()
		if( next ) return next
		node = node.parent()
		if( !node ) return null
	}
}})

/**
 * @name $jin.dom#precede
 * @method precede
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..precede': function( ){
	var dom = this
	while( true ){
		var next = node.prev()
		if( next ) return next
		dom = dom.parent()
		if( !dom ) return null
	}
}})

/**
 * @name $jin.dom#delve
 * @method delve
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..delve': function( ){
	return this.head() || this.follow()
}})

/**
 * @name $jin.dom#childList
 * @method childList
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..childList': function( ){
    var nodes= this.nativeNode().childNodes
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
}})

/**
 * @name $jin.dom#xpathFind
 * @method xpathFind
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..xpathFind': function( xpath ){
    var node= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null ).iterateNext()
    if( !node ) return node
    return $jin.dom( node )
}})

/**
 * @name $jin.dom#xpathSelect
 * @method xpathSelect
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..xpathSelect': function( xpath ){
    var list= []
    
    var found= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null )
    for( var node; node= found.iterateNext(); ) list.push( $jin.dom( node ) )
    
    return list
}})

/**
 * @name $jin.dom#cssFind
 * @method cssFind
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..cssFind': function( css ){
    var node = this.nativeNode().querySelector( css )
    if( !node ) return node
    return $jin.dom( node )
}})

/**
 * @name $jin.dom#cssSelect
 * @method cssSelect
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..cssSelect': function( css ){
    return [].slice.call( this.nativeNode().querySelectorAll( css ) ).map( $jin.dom )
}})

/**
 * @name $jin.dom#clone
 * @method clone
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..clone': function( ){
    return $jin.dom( this.nativeNode().cloneNode() )
}})

/**
 * @name $jin.dom#cloneTree
 * @method cloneTree
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..cloneTree': function( ){
    return $jin.dom( this.nativeNode().cloneNode( true ) )
}})


/**
 * @name $jin.dom#makeText
 * @method makeText
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeText': function( value ){
    return $jin.dom( this.nativeDoc().createTextNode( value ) )
}})

/**
 * @name $jin.dom#makeFragment
 * @method makeFragment
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeFragment': function( ){
    return $jin.dom( this.nativeDoc().createDocumentFragment() )
}})

/**
 * @name $jin.dom#makePI
 * @method makePI
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makePI': function( name, content ){
    return $jin.dom( this.nativeDoc().createProcessingInstruction( name, content ) )
}})

/**
 * @name $jin.dom#makeElement
 * @method makeElement
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeElement': function( name, ns ){
    if( arguments.length > 1 ){
        return $jin.dom( this.nativeDoc().createElementNS( ns, name ) )
    } else {
        return $jin.dom( this.nativeDoc().createElement( name ) )
    }
}})

/**
 * @name $jin.dom#makeTree
 * @method makeTree
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeTree': function( json ){
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
}})

/**
 * @name $jin.dom#listen
 * @method listen
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..listen': function( eventName, handler ){
	handler = $jin.defer.callback( handler )
    this.nativeNode().addEventListener( eventName, handler, false )
    return $jin.listener().crier( this ).eventName( eventName ).handler( handler )
}})

/**
 * @name $jin.dom#forget
 * @method forget
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..forget': function( eventName, handler ){
    this.nativeNode().removeEventListener( eventName, handler, false )
    return this
}})

/**
 * @name $jin.dom#scream
 * @method scream
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..scream': function( event ){
    event = $jin.dom.event( event )
    this.nativeNode().dispatchEvent( event.nativeEvent() )
    return this
}})

/**
 * @name $jin.dom#flexShrink
 * @method flexShrink
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..flexShrink': function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.style.flexShrink = String( value )
        return this
    } else {
        return document.getComputedStyles( node ).flexShrink
    }
}})

/**
 * @name $jin.dom#normalize
 * @method normalize
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..normalize': function( map ){
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
}})

/**
 * @name $jin.dom#tree
 * @method tree
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..tree': function( items ){
	if( !arguments.length ) throw new Error( 'Not implemented yet' )

	var node = this
	this.clear()

	items.forEach( function( item ){
		if( typeof item === 'string' ){
			var child = node.makeText( item )
		} else {
			var child = node.makeElement( item.nodeName )
			if( item.childNodes ) child.tree( item.childNodes )
		}
		child.parent( node )
	} )

	return this
}})

/**
 * @name $jin.dom#rangeAround
 * @method rangeAround
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..rangeAround': function( ){
	return $jin.dom.range.create().aimNode( this )
}})

/**
 * @name $jin.dom#rangeContent
 * @method rangeContent
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..rangeContent': function( ){
	return $jin.dom.range.create().aimNodeContent( this )
}})

;
/**
 * @name $jin.dom#html
 * @method html
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..html': function( html ){
    if( arguments.length ){
        this.nativeNode().innerHTML = html
        return this
    } else {
		var node = this.nativeNode()
		if( 'innerHTML' in node ) return node.innerHTML
        return this.toString()
    }
}})

/**
 * @name $jin.dom#size
 * @method size
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..size': function( ){
	var node = this.nativeNode()
	return $jin.vector([ node.offsetWidth, node.ofsfetHeight ])
}})

if( $jin.support.xmlModel() === 'ms' ){
    
    $jin.mixin({ '$jin.dom': [ '$jin.dom.ms' ] })
    
    /**
     * @name $jin.dom.ms#toString
     * @method toString
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..toString': function( ){
        this['$jin.dom..toString']
        return String( this.nativeNode().xml )
    }})

    /**
     * works incorrectly =( use render instead
     * @name $jin.dom.ms#transform
     * @method transform
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..transform': function( stylesheet ){
        this['$jin.dom..transform']
        var result= this.nativeNode().transformNode( $jin.dom( stylesheet ).nativeNode() )
        return $jin.dom.parse( result )
    }})

    /**
     * @name $jin.dom.ms#render
     * @method render
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..render': function( from, to ){
        this['$jin.dom..render']
        from = $jin.dom( from ).nativeNode()
        to = $jin.dom( to ).nativeNode()
        
        to.innerHTML= from.transformNode( this.nativeDoc() )
    }})
    
    /**
     * @name $jin.dom.ms#select
     * @method select
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..select': function( xpath ){
        this['$jin.dom..select']
        var list= []
        
        var found= this.nativeNode().selectNodes( xpath )
        for( var i= 0; i < found.length; ++i ) list.push( $jin.dom( found[ i ] ) )
        
        return list
    }})

}

if( $jin.support.eventModel() === 'ms' ){

    /**
     * @name $jin.dom.ms#listen
     * @method listen
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..listen': function( eventName, handler ){
        this['$jin.dom..listen']
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().attachEvent( eventName, function( ){
            var event = $jin.dom.event( window.event )
            //if( event.type() !== eventName ) return
            return handler( event )
        } )
        return this
    }})
    
    /**
     * @name $jin.dom.ms#forget
     * @method forget
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..forget': function( eventName, handler ){
        this['$jin.dom..forget']
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().detachEvent( eventName, handler )
        return this
    }})
    
    /**
     * @name $jin.dom.ms#scream
     * @method scream
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..scream': function( event ){
        this['$jin.dom..scream']
        event = $jin.dom.event( event )
        var eventName = this.normalizeEventName( event.type() )
        this.nativeNode().fireEvent( eventName, event.nativeEvent() )
        return this
    }})

    /**
     * @name $jin.dom.ms#normalizeEventName
     * @method normalizeEventName
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..normalizeEventName': function( eventName ){
        return /^[a-zA-Z]+$/.test( eventName ) ? 'on' + eventName : 'onbeforeeditfocus'
    }})
    
}

;
/**
 * @name $jin.sample
 * @class $jin.sample
 * @returns $jin.sample
 * @mixins $jin.klass
 * @mixins $jin.dom
 */
$jin.klass({ '$jin.sample': [ '$jin.dom' ] })

/**
 * @name $jin.sample.strings
 * @method strings
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample.strings': {
	value: '',
	put: function( next, prev ){
		return $jin.sample.strings() + next
	}
}})

/**
 * @name $jin.sample.templates
 * @method templates
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample.templates': {
	pull: function( ){
		var strings = this.strings()
		if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
		return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
	}
}})

/**
 * @name $jin.sample.dom
 * @method dom
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop.hash({ '$jin.sample.dom': {
	pull: function( name ){
		var selector = '[' + name + ']'
		
		var dom = $jin.sample.templates().cssFind( selector )
		if( !dom ) throw new Error( 'Sample not found (' + selector + ')' )
		
		return dom.nativeNode()
	}
}})

/**
 * @name $jin.sample.rules
 * @method rules
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop.hash({ '$jin.sample.rules': { pull: function( name ){
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
							var cover = $jin.atom1(
							{	name: rule.coverName
							,	context: sample
							,	pull: function jin_sample_pullChilds( ){
									var view = sample.view()
									if( !view ) return null

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									return prop.call( view )
								}
							, 	merge: function contentPull( nextItems, prevItems ){ return $jin.atom1.bound( function( ){
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
										//if( item.element ) return item.element()
										return item
									} )
									
									prevItems.reduceRight( function jin_sample_freePrevs( nope, item ){
										if( typeof item === 'string' ) return
										if( nextItems.indexOf( item ) !== -1 ) return
										var sample = item.element ? item.element() : item 
										if( sample.view ) sample.view( null )
									}, void 0 )
									
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
											var node = item
											if( node.element ) node = node.element()
											if( node.nativeNode ) node = node.nativeNode()
											var index = elements.indexOf( node )
											if( index >= 0 ) elements[ index ]  = null
											return node
										}
									} )
									
									var removeNode = function jin_sample_removeNode( node ){
										if( !node ) return
										if( node.parentNode !== current ) return
										current.removeChild( node )
									}
									
									elements.forEach( removeNode )
									textNodes.forEach( removeNode )
									
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
								})}
							} )
							sample.entangle( cover )
							cover.pull()
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
			
			var props = node.getAttribute( 'jin-sample-props' )
			if( props ){
				props.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var subPath = chunk.split( /[-_:=.]/g )
					if( !subPath[0] ) return

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

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Handler (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									prop.call( view, current[ rule.fieldName ] )
								}
								sample.entangle( $jin.dom( current ).listen( 'input', handler ) )
								sample.entangle( $jin.dom( current ).listen( 'change', handler ) )
								sample.entangle( $jin.dom( current ).listen( 'click', handler ) )
							}
							if( rule.fieldName === 'scrollTop' ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									prop.call( view, current.scrollTop )
								}
								sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
							} else if( rule.fieldName === 'scrollLeft' ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									prop.call( view, current.scrollLeft )
								}
								sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
							}
							var cover = $jin.atom1(
							{	name: rule.coverName
							,	context: sample
							,	pull: function jin_sample_pullProp( ){
									var view = sample.view()
									if( !view ) return null

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									return prop.call( view )
								}
							,	push: function fieldPush( next, prev ){
									if( next == null ) return
									if( current[ rule.fieldName ] == next ) return
									current[ rule.fieldName ] = next
								}
							})
							sample.entangle( cover )
							cover.pull()
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
					if( !eventName[0] ) return

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
						var cover = $jin.atom1(
						{	name: rule.coverName
						,	context: sample
						,	pull: function jin_sample_pullAttr( ){
								var view = sample.view()
								if( !view ) return null

								var prop = view[ rule.key ]
								if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

								var next = prop.call( view )
								return next ? String( next ) : next
							}
						,	push: function attrPush( next, prev ){
								if( next == null ) node.removeAttribute( rule.attrName )
								else node.setAttribute( rule.attrName, next )
							}
						})
						sample.entangle( cover )
						cover.pull()
					}
				}
				rules.push( rule )
				
				node.removeAttribute( attrName )
			})
			
		}
	}
	
	collect( node )
	
	return rules
}}})

/**
 * @name $jin.sample.pool
 * @method pool
 * @static
 * @member $jin.sample
 */
$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

/**
 * @name $jin.sample.exec
 * @method exec
 * @static
 * @member $jin.sample
 */
$jin.method({ '$jin.sample.exec': function( type ){
	this['$jin.wrapper.exec']
	
	var pool = this.pool( type )
	var sample = pool.pop()
	
	if( !sample ) sample = this[ '$jin.klass.exec' ]({ type: type })
	
	return sample
}})


/**
 * @name $jin.sample#init
 * @method init
 * @member $jin.sample
 */
$jin.method({ '$jin.sample..init': function( config ){
	this['$jin.dom..init']
    return this['$jin.klass..init']( config )
}})

/**
 * @name $jin.sample#type
 * @method type
 * @member $jin.sample
 */
$jin.property({ '$jin.sample..type': String })

/**
 * @name $jin.sample#view
 * @method view
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample..view': {
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

/**
 * @name $jin.sample#nativeNode
 * @method nativeNode
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample..nativeNode': {
	resolves: [ '$jin.dom..nativeNode' ],
	pull: function( ){
		var rules = this.constructor.rules( this.type() )
		return this.constructor.dom( this.type() ).cloneNode( true )
	},
	push: function( next ){
		if( !next ) throw new Error( 'Not found source node' )
		
		var rules = this.constructor.rules( this.type() )
		var sample = this
		
		rules.forEach( function ruleIterator( rule ){
			var current = next
			
			rule.path.forEach( function pathIterator( name ){
				current = current[ name ]
			} )
			
			if( !current ) throw new Error( 'Not found target node' )
			
			rule.attach( rule, sample, current )
		} )
	}
}})

;
/**
 * @name $jin.view1
 * @class $jin.view1
 * @returns $jin.view1
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.view1': [] })

/**
 * @name $jin.view1.exec
 * @method exec
 * @member $jin.view1
 * @static
 */
$jin.method({ '$jin.view1.exec': function( config ){
	if( typeof config === 'string' ) config = { id: config }
	return this[ '$jin.klass.exec' ]( config )
}})

/**
 * @name $jin.view1.sampleProtoId
 * @method sampleProtoId
 * @static
 * @member $jin.view1
 */
$jin.property({ '$jin.view1.sampleProtoId': function( ){
	return String( this ).replace( /\$/, '' ).replace( /\./g, '-' ).toLowerCase()
}})

/**
 * @name $jin.view1#state
 * @method state
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..state': function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
}})

/**
 * @name $jin.view1#name
 * @method name
 * @member $jin.view1
 */
$jin.property({ '$jin.view1..name': String })

/**
 * @name $jin.view1#id
 * @method id
 * @member $jin.view1
 */
$jin.property({ '$jin.view1..id': function( ){
	var id = this.name()

	var parent = this.parent()
	if( parent ) id = parent.id() + ';' + id

	return id
} })

/**
 * @name $jin.view1#parent
 * @method parent
 * @member $jin.view1
 */
$jin.property({ '$jin.view1..parent': null })

/**
 * @name $jin.view1#element
 * @method element
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..element': function( key ){
	var protoId = this.constructor.sampleProtoId()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
}})

/**
 * @name $jin.view1#sample
 * @method sample
 * @member $jin.view1
 */
$jin.property.hash({ '$jin.view1..sample': {
    pull: function( type ){
        return $jin.sample( type ).view( this )
    }
}})

/**
 * @name $jin.view1#childs
 * @method childs
 * @member $jin.view1
 */
$jin.property.hash({ '$jin.view1..childs': { } })

/**
 * @name $jin.view1#child
 * @method child
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..child': function( name, factory ){
	var child = this.childs( name )
	if( child ) return child
	
	child = factory({ name: name, parent: this })
	this.childs( name, child )
	
	return child
}})

/**
 * @name $jin.view1#nativeNode
 * @method nativeNode
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..nativeNode': function( ){
    return this.element('').nativeNode()
}})

/**
 * @name $jin.view1#toString
 * @method toString
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..toString': function( ){
    return this.constructor + '=' + this.id()
}})

/**
 * @name $jin.view1#destroy
 * @method destroy
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..destroy': function( ){
	//var samples = this.sample()
	//for( var key in samples ) samples[ key ].view( null )
	this['$jin.klass..destroy']()
}})

/**
 * @name $jin.view1#focused
 * @method focused
 * @member $jin.view1
 */
$jin.atom1.prop({ '$jin.view1..focused': {
	pull: function( ){
		return null
	},
	push: function( next ){
		var parent = this.parent()
		if( !parent ) return

		parent.focused( next && this.name() )
	}
}})

;

;
/**
 * Registry of singletons trait.
 * http://en.wikipedia.org/wiki/Multiton_pattern
 * Can be mixed with jin-pool trait.
 */

/**
 * Hash map of created instances.
 * @name $jin.registry.storage
 * @method storage
 * @static
 * @member $jin.registry
 */
$jin.property.hash({ '$jin.registry.storage': {} })

/**
 * Select instance from registry.
 * Otherwise creats new one.
 * @name $jin.registry.exec
 * @method exec
 * @static
 * @member $jin.registry
 */
$jin.method({ '$jin.registry.exec': function( id ){
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
}})

/**
 * Identifier of instance.
 * @name $jin.registry#id
 * @method id
 * @member $jin.registry
 */
$jin.property({ '$jin.registry..id': String })

/**
 * Removes from registry on destroy.
 * @name $jin.registry#destroy
 * @method destroy
 * @member $jin.registry
 */
$jin.method({ '$jin.registry..destroy': function( ){
	this.constructor.storage( this.id(), null )
	var destroy = this['$jin.pool..destroy'] || this['$jin.klass..destroy']
	destroy.call( this )
}})

/**
 * Identifier as primitive representation.
 * @name $jin.registry#toString
 * @method toString
 * @member $jin.registry
 */
$jin.method({ '$jin.registry..toString': function( ){
    this['$jin.klass..toString']
    return this.id()
}})

;
//uri.js.map

;
/**
 * @name $jin.uri
 * @class $jin.uri
 * @returns $jin.uri
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.uri': [] })

/**
 * @name $jin.uri.chunkSep
 * @method chunkSep
 * @static
 * @member $jin.uri
 */
$jin.property({ '$jin.uri.chunkSep': function( sep ){
    return '&'
}})

/**
 * @name $jin.uri.valueSep
 * @method valueSep
 * @static
 * @member $jin.uri
 */
$jin.property({ '$jin.uri.valueSep': function( sep ){
    return '='
}})

/**
 * @name $jin.uri.escape
 * @method escape
 * @static
 * @member $jin.uri
 */
$jin.method({ '$jin.uri.escape': function( str ){
    return String( str )
    .replace
    (   /[^- a-zA-Z\/?@!$'()*,.~\xA0-\uD7FF\uE000-\uFDCF\uFDF0-\uFFEF]+/g
    ,   encodeURIComponent
    )
    .replace( / /g, '+' )
}})


/**
 * @name $jin.uri#scheme
 * @method scheme
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..scheme': String })

/**
 * @name $jin.uri#slashes
 * @method slashes
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..slashes': Boolean })

/**
 * @name $jin.uri#login
 * @method login
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..login': String })

/**
 * @name $jin.uri#password
 * @method password
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..password': String })

/**
 * @name $jin.uri#host
 * @method host
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..host': String })

/**
 * @name $jin.uri#port
 * @method port
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..port': Number })

/**
 * @name $jin.uri#path
 * @method path
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..path': String })

/**
 * @name $jin.uri#query
 * @method query
 * @member $jin.uri
 */
$jin.property.hash({ '$jin.uri..query': {} })

/**
 * @name $jin.uri#hash
 * @method hash
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..hash': String })

/**
 * @name $jin.uri#json
 * @method json
 * @member $jin.uri
 */
$jin.method({ '$jin.uri..json': function( json ){
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
    for( key in query ) json.query[ key ] = query[ key ]
    
    json.hash = this.hash()
    
    return json
}})

/**
 * @name $jin.uri#resolve
 * @method resolve
 * @member $jin.uri
 */
$jin.method({ '$jin.uri..resolve': function( str ){
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
}})

/**
 * @name $jin.uri#toString
 * @method toString
 * @member $jin.uri
 */
$jin.method({ '$jin.uri..toString': function( ){
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
}})

/**
 * @name $jin.uri.parse
 * @method parse
 * @static
 * @member $jin.uri
 */
$jin.method({ '$jin.uri.parse': function( string ){
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
            var values = chunk.split( Uri.valueSep() ).map( function( value ){
	            return decodeURIComponent( value.replace( /\+/g, ' ' ) )
            } )
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
        .replace( /^\/\//, function( str, port ){
	        config.slashes = true
	        return ''
        } )
        .replace( /^([^@]+)@/, function( str, auth ){
            var pair = auth.split( ':' )
            config.login = pair[0]
            config.password = pair[1]
            return ''
        } )
        return ''
    } )
    
    return this( config )
}})

;
/**
 * @name $jin.uri.query
 * @class $jin.uri.query
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 * @returns $jin.uri.query
 */
$jin.klass({ '$jin.uri.query': [ '$jin.wrapper' ] })

/**
 * @name $jin.uri.query.exec
 * @method exec
 * @member $jin.uri.query
 * @static
 */
$jin.method({ '$jin.uri.query.exec': function( params ){
	if( typeof params === 'string' ){
        var chunkList = params.split( /[;&\n]+/ )
        params = {}
        chunkList.forEach( function( chunk ){
            var values = chunk.split( /[_:=]/ ).map( function( value ){
	            return decodeURIComponent( value.replace( /\+/g, ' ' ) )
            } )
            var key = values.shift()
            params[ key ] = values
        }.bind(this) )
	}
	
	return this['$jin.wrapper.exec']( params )
}})

/**
 * @name $jin.uri.query#toString
 * @method toString
 * @member $jin.uri.query
 */
$jin.method({ '$jin.uri.query..toString': function( syntax ){
	if( !syntax ) syntax = ';='
	
    var chunks = []
	var params = this.raw()
    
	for( var key in params ){
        var chunk = [ key ].concat( params[ key ] )
		.map( function( val ){
			return $jin.uri.escape( val )
		})
		.join( syntax[1] )
        chunks.push( chunk )
    }
    
    return chunks.join( syntax[0] )
}})

;
/**
 * @name $jin.cookie
 * @method cookie
 * @member $jin
 * @static
 */
$jin.method({ '$jin.cookie': function( name, config ){
	if( arguments.length > 1 ){
		var query = {}
		query[ name ] = config.birthDay
		document.cookie = $jin.uri({ query : query }).toString().substring( 1 )
		return config.birthDay
	}
	var cookies = $jin.uri.parse( '?' + document.cookie.replace( /; /g, '&' ) ).query()
	if( arguments.length < 1 ) return cookies
	return cookies[ name ]
}})

;
$jin.request = function( options ){
    var xhr = new XMLHttpRequest
	var body = options.body
	if( $jin.type( body ) === 'Object' ){
		var form = new FormData
		for( var key in body ){
			form.append( key, body[ key ] )
		}
		body = form
	}
	xhr.withCredentials = true
	if( options.sync ){
		xhr.open( options.method || 'GET', options.uri, false )
		if( options.type ) xhr.setRequestHeader( 'Content-Type', options.type )
		xhr.send( body )
		return xhr
	} else {
		var atom = $jin.atom1({ name: '$jin.request:' + options.uri })
		xhr.open( options.method || 'GET', options.uri, true )
		if( options.type ) xhr.setRequestHeader( 'Content-Type', options.type )
		xhr.onload = function( ){
			atom.put( xhr )
		}
		xhr.onerror = function( ){
			atom.fail( xhr )
		}
		xhr.send( body )
		return atom
	}
}

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
//pipe.js.map

;
$jin.pipe = function( funcs ){
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
}

$jin.pipe.nop = function( value ){
	return value
}
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
 * @name $jin.state.url
 * @class $jin.state.url
 * @returns $jin.state.url
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.state.url': [] })

$jin.atom1.prop( '$jin.state.url.href',
{   pull: function( ){
        return document.location.href
    }
,   put: String
} )

$jin.atom1.prop( '$jin.state.url.hash',
{   pull: function( ){
        return $jin.uri.query( $jin.uri.parse( this.href() ).hash() ).raw()
    }
} )

$jin.atom1.prop( '$jin.state.url.listener',
{   pull: function( ){
        return setInterval( function( ){
            $jin.state.url.href_atom().pull()
        }, 50 )
    }
} )

$jin.atom1.prop.hash( '$jin.state.url.item',
{   pull: function( key ){
        this.listener()
        var val = this.hash()[ key ]
        return ( val == null ) ? null : val
    }
,   put: function( key, value ){
        var hash = this.hash()
        
        if( value == null ) delete hash[ key ]
        else hash[ key ] = value

		document.location = '#' + $jin.uri.query( hash ).toString( ';=' )

		return value
    }
} )

;
/**
 * @name $friends.contact
 * @class $friends.contact
 * @mixins $jin.klass
 * @mixins $jin.registry
 * @returns $friends.contact
 */
$jin.klass({ '$friends.contact': [ '$jin.registry' ] })

/**
 * @name $friends.contact#uri
 * @method uri
 * @member $friends.contact
 */
$jin.property({ '$friends.contact..uri': function( ){
	return '?contact=' + this.id()
}})

$jin.atom1.prop({ '$friends.contact..data': {
	pull: function( ){
		return JSON.parse( $jin.state.local.item( this.uri() ) || '{}' )
	},
	push: function( next ){
		$jin.state.local.item( this.uri(), JSON.stringify( next ) );
	},
	put: function( next , prev ) {
		if( prev ){
			for( var key in prev ){
				if( key in next ) continue
				next[ key ] = prev[ key ]	
			}
		}
		
		next.id = this.id()
		$friends.sync.set({ contact : next })

		return next
	}
}})

/**
 * @name $friends.contact#name
 * @method name
 * @member $friends.contact
 */
$jin.atom1.prop({ '$friends.contact..name': {
	pull: function( ){
		return this.data().name || ''
	},
	put: function( next ){
		if( next ) $friends.user.current().contacts_add([ this ])
		else $friends.user.current().contacts_drop([ this ])
		this.data({ name : next })
	}
}})

/**
 * @name $friends.contact#image
 * @method image
 * @member $friends.contact
 */
$jin.atom1.prop({ '$friends.contact..image': {
	pull: function( ){
		return this.data().avatar || ''
	},
	put: function( next ){
		this.data({ avatar : next })
	}
}})

/**
 * @name $friends.contact#remarks
 * @method remarks
 * @member $friends.contact
 */
$jin.atom1.prop({ '$friends.contact..description': {
	pull: function( ){
		return this.data().description || ''
	},
	put: function( next ){
		this.data({ description : next })
	}
}})

$jin.atom1.prop({ '$friends.contact..lastMeeting': {
	pull: function( ){
		return $jin.time.moment( this.data().lastMeeting || $jin.time.moment().toString( 'YYYY-MM-DD' ) )
	},
	merge: function( next , prev ){
		if( next + '' === prev + '' ) return prev
		return next
	},
	put: function( next ){
		this.data({ lastMeeting : String( next ) })
	}
}})

$jin.atom1.prop({ '$friends.contact..nextMeeting': {
	pull: function( ){
		var next = this.data().nextMeeting
		if( next ) return $jin.time.moment( next )
		
		var scalesSelf = this.importance()
		var scalesAll = {}
		$friends.user.current().scales().forEach( function( scale ) {
			scalesAll[ scale.id() ] = $friends.user.current().importance()[ scale.id() ]
		})
		var strengthList = []
		var total = 0
		for( var key in scalesAll ) {
			var strength = scalesAll[ key ] * ( scalesSelf[ key ] || 0 )
			strengthList.push( strength )
			total += strength
		}
		total = total / strengthList.length || .01
		var delay = Math.round( 3.65 / total )
		var next = this.lastMeeting().shift({ days : delay })
		return next
	},
	put: function( next ){
		this.data({ nextMeeting : String( next ) })
	}
}})

$jin.atom1.prop({ '$friends.contact..vkLink': {
	pull: function( ){
		return this.data().vkLink || ''
	},
	put: function( next ){
		this.data({ vkLink : next })
	}
}})

/**
 * @name $friends.contact#values
 * @method values
 * @member $friends.contact
 */
$jin.atom1.prop({ '$friends.contact..importance': {
	pull: function( ){
		return this.data().importance || { }
	},
	put: function( next, prev ) {
		if( prev ){
			for( var key in prev ){
				if( key in next ) continue
				next[ key ] = prev[ key ]
			}
		}
		this.data({ importance : next })
	}
}})

/**
 * @name $friends.contact.current
 * @method current
 * @member $friends.contact
 * @static
 */
$jin.atom1.prop({ '$friends.contact.current': {
	pull: function( ){
		var ids = $jin.state.url.item( 'contact' ) || []
		return ids.map( function( id ){
			return $friends.contact( id || Math.random() )
		} )
	}
}})

;
$jin.klass({ '$friends.scale': [ '$jin.registry' ] })

$jin.property({ '$friends.scale..uri': function( ){
    return '?scale=' + this.id()
}})

$jin.atom1.prop({ '$friends.scale..data': {
    pull: function( ){
        return JSON.parse( $jin.state.local.item( this.uri() ) || '{}' )
    },
    push: function( next ){
        $jin.state.local.item( this.uri(), JSON.stringify( next ) );
    },
    put: function( next , prev ) {
        if( prev ){
            for( var key in prev ){
                if( key in next ) continue
                next[ key ] = prev[ key ]
            }
        }

        next.id = this.id()
        $friends.sync.set({ scale : next })

        return next
    }
}})

$jin.atom1.prop({ '$friends.scale..name': {
    pull: function( ){
        return this.data().name || { family : 'Семья' , hobby : 'Хобби' , work : 'Работа' }[ this.id() ]
    },
    put: function( next ){
        if( next ) $friends.user.current().scales_add([ this ])
        else $friends.user.current().scales_drop([ this ])
        this.data({ name : next })
    }
}})

$jin.atom1.prop({ '$friends.scale..importance': {
    pull: function( ){
        return this.data().importance || .5
    },
    put: function( next ){
        this.data({ importance : next })
    }
}})

;
$jin.method({ '$friends.sync.request' : function( config ) {
    return $jin.request( config )
}})

$jin.method({ '$friends.sync.get' : function( params ) {
    return $friends.sync.request({
        method: 'get',
        uri : '?friends&' + ( params || '' )
    })
    .then( function( request ){
        var resp = JSON.parse( request.responseText )
        resp.forEach( function( model ){
            switch( model['@class'] ) {
                case 'friends-user' :
                    $friends.user.current().data_atom().put( model )
                    break
                case 'friends-contact' :
                    var contact = $friends.contact( model.id )
                    contact.data_atom().put( model )
                    break
                case 'friends-scale' :
                    var scale = $friends.scale( model.id )
                    scale.data_atom().put( model )
                    break
            }
        } )
    } )
}})

$jin.property({ '$friends.sync.setQueue' : function( next ){
    if( arguments.length ) return next
    return {}
} })
$jin.property({ '$friends.sync.setDefer' : function( next ) {
    if( arguments.length ) return next
    
    return new $jin.defer( function(){
        $friends.sync.request({
            method : 'put',
            uri : '?friends',
            type : 'application/json',
            body : JSON.stringify({
                session : { key : $friends.user.current().token() },
                data : Object.keys( this.setQueue() ).map( function( key ){
                    var param = {}
                    param[ key.replace( /:.*/ , '' ) ] = this.setQueue()[ key ]
                    return param
                }.bind( this ))
            })
        })

        this.setQueue( void 0 )
        this.setDefer( void 0 )
    }.bind( this ))
}})
$jin.method({ '$friends.sync.set' : function( params ) {
    var queue = this.setQueue()
    for( var type in params ) {
        var data = params[ type ]
        var key = type + ':' + data.id
        if( queue[ key ] ) {
            for( var field in data ) {
                queue[key][field] = data[ field ]
            }
        } else {
            queue[key] = data
        }
    }
    this.setDefer()
}})
;
var $jin;
(function ($jin) {
    var object = (function () {
        function object() {
            this.objectId = ++$jin.object._objectIdSeed;
        }
        object.makeConstructor = function (parent) {
            return function jin_object() {
                parent.apply(this, arguments);
            };
        };

        object.makeClass = function (config) {
            var parent = this;
            var klass = config.hasOwnProperty('constructor') ? config['constructor'] : this.makeConstructor(parent);
            klass.prototype = Object.create(this.prototype);
            for (var key in this) {
                if (this[key] === void 0)
                    continue;
                klass[key] = this[key];
            }
            for (var key in config) {
                if (config[key] === void 0)
                    continue;
                klass.prototype[key] = config[key];
            }
            return klass;
        };

        object.prototype.destroy = function () {
            if (this.objectHavings) {
                for (var id in this.objectHavings) {
                    this.objectHavings[id].destroy();
                }
            }
            this.objectOwner = null;
        };

        Object.defineProperty(object.prototype, "objectOwner", {
            get: function () {
                return this._objectOwner;
            },
            set: function (next) {
                var prev = this._objectOwner;
                if (next === prev)
                    return;
                if (prev)
                    prev.objectHavings[this.objectId] = null;
                if (next) {
                    if (!next.objectHavings)
                        next.objectHavings = {};
                    next.objectHavings[this.objectId] = this;
                }
                this._objectOwner = next;
            },
            enumerable: true,
            configurable: true
        });
        object._objectIdSeed = 0;
        return object;
    })();
    $jin.object = object;
})($jin || ($jin = {}));
//object.js.map

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
//enumeration.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom) {
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
        atom.status = status;
    })($jin.atom || ($jin.atom = {}));
    var atom = $jin.atom;
})($jin || ($jin = {}));
//status.js.map

;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    (function (atom) {
        var prop = (function (_super) {
            __extends(prop, _super);
            function prop(config) {
                if (config.field) {
                    var genericHost = config.host['constructor'];
                    var genericField = config.field || '_state';

                    var instanceHost = config.host || this;

                    var instanceMap = instanceHost[genericField];
                    if (!instanceMap)
                        instanceMap = instanceHost[genericField] = {};

                    var instanceField = config.param;

                    var instance = instanceMap[instanceField];
                    if (instance)
                        return instance;

                    var klass = genericHost[genericField];
                    if (!klass)
                        klass = genericHost[genericField] = this['constructor'].makeClass({
                            field: config.field,
                            persist: config.persist,
                            _pull: config.pull,
                            _get: config.get,
                            _merge: config.merge,
                            _put: config.put,
                            _reap: config.reap,
                            _notify: config.notify,
                            _fail: config.fail
                        });

                    return instanceMap[instanceField] = new klass({
                        host: config.host,
                        param: config.param,
                        status: config.status,
                        value: config.value,
                        error: config.error
                    });
                }

                _super.call(this);

                this.host = config.host || this;
                this.param = config.param;

                this.status = config.status || $jin.atom.status.clear;
                this.value = config.value;
                this.error = config.error;

                this.slavesCount = 0;
                this.mastersDeep = 0;

                if (!config.host) {
                    this.persist = config.persist;
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
                }
            }
            prop.swap = function (atom) {
                var last = this.currentSlave;
                this.currentSlave = atom;
                return last;
            };

            prop.induceSchedule = function () {
                var _this = this;
                if (!this._defer) {
                    this._defer = new $jin.defer(function () {
                        return _this.induce();
                    });
                }
            };

            prop.updateSchedule = function (atom) {
                var deep = atom.mastersDeep;
                var plan = this._updatePlan;
                var queue = plan[deep];
                if (!queue)
                    queue = plan[deep] = [];
                queue.push(atom);

                this.induceSchedule();
            };

            prop.reapSchedule = function (atom) {
                var plan = this._reapPlan[atom.objectId] = atom;

                this.induceSchedule();
            };

            prop.induce = function () {
                var updatePlan = $jin.atom.prop._updatePlan;
                for (var deep = 0; deep < updatePlan.length; ++deep) {
                    var queue = updatePlan[deep];
                    if (!queue)
                        continue;
                    if (!queue.length)
                        continue;

                    var atom = queue.shift();
                    if (atom.status === $jin.atom.status.clear) {
                        atom.pull();
                    }

                    deep = -1;
                }

                var reapPlan = $jin.atom.prop._reapPlan;
                this._reapPlan = {};

                for (var id in reapPlan) {
                    var atom = reapPlan[id];
                    if (!atom)
                        continue;
                    if (atom.slavesCount !== 0)
                        continue;
                    atom._reap(atom);
                }

                this._defer = null;
            };

            prop.prototype.destroy = function () {
                this.clear();
                _super.prototype.destroy.call(this);
            };

            prop.prototype._get = function (atom, value) {
                return value;
            };

            prop.prototype._pull = function (atom, prev) {
                return prev;
            };

            prop.prototype._merge = function (atom, next, prev) {
                return next;
            };

            prop.prototype._put = function (atom, next, prev) {
                this.push(next);
            };

            prop.prototype._reap = function (atom) {
                this.destroy();
            };

            prop.prototype._notify = function (atom, next, prev) {
            };

            prop.prototype._fail = function (atom, error) {
            };

            prop.prototype.push = function (next) {
                var prev = this.value;
                next = this.merge(next, prev);
                this.status = $jin.atom.status.actual;
                this.value = next;
                if ((next !== prev) || this.error) {
                    this.notify(null, next, prev);
                }
                this.error = undefined;
                return next;
            };

            prop.prototype.fail = function (error) {
                this.status = $jin.atom.status.error;
                if (this.error !== error) {
                    this.error = error;
                    this.notify(error, undefined, this.value);
                    this.value = undefined;
                }
                return error;
            };

            prop.prototype.notify = function (error, next, prev) {
                if (this.slavesCount) {
                    for (var slaveId in this.slaves) {
                        var slave = this.slaves[slaveId];
                        if (!slave)
                            continue;

                        slave.update();
                    }
                }
                if (error) {
                    this._fail(this, error);
                } else {
                    this._notify(this, next, prev);
                }
            };

            prop.prototype.update = function () {
                if (this.status === $jin.atom.status.clear) {
                    return;
                }

                if (this.status === $jin.atom.status.pull) {
                    return;
                }

                this.status = $jin.atom.status.clear;

                $jin.atom.prop.updateSchedule(this);
            };

            prop.prototype.touch = function () {
                var slave = $jin.atom.prop.currentSlave;
                if (slave) {
                    this.lead(slave);
                    slave.obey(this);
                } else {
                    if (!this.persist && !this.slavesCount)
                        this.reap();
                }
            };

            prop.prototype.get = function () {
                if (this.status === $jin.atom.status.pull) {
                    throw new Error('Cyclic dependency of atom:' + this.objectId);
                }

                this.touch();

                if (this.status === $jin.atom.status.clear) {
                    this.pull();
                }

                if (this.status === $jin.atom.status.error) {
                    throw this.error;
                }

                if (this.status === $jin.atom.status.actual) {
                    return this._get(this, this.value);
                }

                throw new Error('Unknown status ' + this.status);
            };

            prop.prototype.pull = function () {
                var lastCurrent = $jin.atom.prop.swap(this);

                var oldMasters = this.masters;

                this.status = $jin.atom.status.pull;

                try  {
                    var value = this.value;
                    value = this._pull(this, value);
                    this.push(value);
                } catch (error) {
                    this.fail(error);
                } finally {
                    $jin.atom.prop.swap(lastCurrent);

                    if (oldMasters)
                        for (var masterId in oldMasters) {
                            var master = oldMasters[masterId];
                            if (!master)
                                continue;

                            if (this.masters && this.masters[masterId])
                                continue;

                            master.dislead(this);
                        }

                    if (this.status === $jin.atom.status.clear)
                        debugger;
                }
            };

            prop.prototype.set = function (next) {
                var prev = this.value;

                next = this.merge(next, prev);

                if (next !== prev) {
                    this.put(next);
                }
            };

            prop.prototype.put = function (next) {
                return this._put(this, next, this.value);
            };

            prop.prototype.mutate = function (mutate) {
                this.set(mutate(this.get()));
            };

            prop.prototype.merge = function (next, prev) {
                return this._merge(this, next, prev);
            };

            prop.prototype.clear = function () {
                var prev = this.value;
                var next = this.value = undefined;

                this.disobeyAll();
                this.status = $jin.atom.status.clear;
                this.notify(null, next, prev);
            };

            prop.prototype.reap = function () {
                $jin.atom.prop.reapSchedule(this);
            };

            prop.prototype.lead = function (slave) {
                var slaveId = slave.objectId;

                if (this.slaves) {
                    if (this.slaves[slaveId])
                        return;
                } else {
                    this.slaves = {};
                }

                this.slaves[slaveId] = slave;

                this.slavesCount++;
            };

            prop.prototype.dislead = function (slave) {
                var slaveId = slave.objectId;
                if (!this.slaves[slaveId])
                    return;

                this.slaves[slaveId] = null;

                if (!--this.slavesCount) {
                    this.reap();
                }
            };

            prop.prototype.disleadAll = function () {
                if (!this.slavesCount)
                    return;

                for (var slaveId in this.slaves) {
                    var slave = this.slaves[slaveId];
                    if (!slave)
                        continue;

                    slave.disobey(this);
                }

                this.slaves = null;
                this.slavesCount = 0;

                this.reap();
            };

            prop.prototype.obey = function (master) {
                if (!this.masters)
                    this.masters = {};
                if (this.masters[master.objectId])
                    return;
                this.masters[master.objectId] = master;

                var masterDeep = master.mastersDeep;
                if ((this.mastersDeep - masterDeep) > 0)
                    return;

                this.mastersDeep = masterDeep + 1;
            };

            prop.prototype.disobey = function (master) {
                if (!this.masters)
                    return;
                this.masters[master.objectId] = null;
            };

            prop.prototype.disobeyAll = function () {
                if (!this.mastersDeep)
                    return;

                for (var masterId in this.masters) {
                    var master = this.masters[masterId];
                    if (!master)
                        continue;

                    master.dislead(this);
                }

                this.masters = null;
                this.mastersDeep = 0;
                this.status = $jin.atom.status.clear;
            };

            prop.prototype.then = function (done, fail) {
                var _this = this;
                if (!done)
                    done = function (value) {
                        return null;
                    };
                if (!fail)
                    fail = function (error) {
                        return $jin.log.error(error);
                    };

                var promise = new $jin.atom.prop({
                    pull: function (promise, prev) {
                        var next = _this.get();
                        if (next === prev)
                            return prev;

                        promise.disobeyAll();

                        return done(next);
                    },
                    fail: function (promise, error) {
                        promise.disobeyAll();

                        fail(error);
                    }
                });

                promise.push(undefined);
                promise.update();

                return promise;
            };

            prop.prototype.catch = function (fail) {
                return this.then(null, fail);
            };
            prop._updatePlan = [];
            prop._reapPlan = {};
            return prop;
        })($jin.object);
        atom.prop = prop;
    })($jin.atom || ($jin.atom = {}));
    var atom = $jin.atom;
})($jin || ($jin = {}));
//atom.js.map

;
var $jin;
(function ($jin) {
    (function (jsonp) {
        function fetch(uri) {
            var promise = new $jin.atom.prop({});
            var id = '_jin_jsonp_' + Math.random().toString(32).substring(2).toUpperCase();
            window[id] = function (data) {
                if (script.parentNode)
                    script.parentNode.removeChild(script);
                delete window[id];
                promise.push(data);
            };
            var script = document.createElement('script');
            script.src = uri + id;
            document.head.appendChild(script);
            return promise;
        }
        jsonp.fetch = fetch;
    })($jin.jsonp || ($jin.jsonp = {}));
    var jsonp = $jin.jsonp;
})($jin || ($jin = {}));
//jsonp.env=web.js.map

;
$jin.klass({ '$friends.user' : [ '$jin.registry' ] })

$jin.property({ '$friends.user.current' : function( ){
	return $friends.user( '' )
}})

$jin.atom1.prop({ '$friends.user..token' : {
	pull: function( ){
		return $jin.cookie( 'friends-session-key' ) || Date.now().toString(32) + Math.random().toString( 32 ).substring( 2 )
	},
	merge: String
}})

$jin.atom1.prop({ '$friends.user..data': {
	pull: function( prev ){
		if( !prev ) $friends.sync.get()
		return JSON.parse( $jin.state.local.item( '?user=' ) || '{}' )
	},
	push: function( next ) {
		$jin.state.local.item( '?user=', JSON.stringify( next ) );
	},
	put: function( next , prev ) {
		if( prev ){
			for( var key in prev ){
				if( key in next ) continue
				next[ key ] = prev[ key ]
			}
		}

		$friends.sync.set({ user : next })

		return next
	}
}})

$jin.atom1.prop({ '$friends.user..name': {
	pull: function( ){
		return this.data().name
	},
	put: function( next ){
		this.data({ name : next })
	}
}})

$jin.atom1.prop({ '$friends.user..mail': {
	pull: function( ){
		return this.data().mail
	},
	put: function( next ){
		this.data({ mail : next })
	}
}})

$jin.atom1.prop({ '$friends.user..vkLink': {
	pull: function( ){
		return this.data().vkLink || ''
	},
	put: function( next ){
		this.data({ vkLink : next })
		
		var found = /^https?:\/\/vk.com\/(\w+)/.exec( next )
		if( found ) onLink( found[1] )

		function onLink( name ) {
			var url = 'https://api.vk.com/method/users.get?user_ids=' + name + '&fields=photo_max&lang=ru&v=5.8&callback='
			$jin.jsonp.fetch( url ).then( onUserData )
		}

		function onUserData( resp ) {
			var donor = resp.response[0]
			var url = 'https://api.vk.com/method/friends.get?user_id=' + donor.id + '&lang=ru&v=5.8&callback='
			$jin.jsonp.fetch(url).then(onFriends)
		}

		function onFriends( resp ) {
			var friendIds = resp.response.items.slice( 0 , 400 )
			var fields = ['photo_max']

			var url = 'https://api.vk.com/method/users.get?user_ids=' + friendIds + '&fields=' + fields + '&order=hints&lang=ru&v=5.8&callback='
			$jin.jsonp.fetch(url).then(onFriendsData)
		}

		function onFriendsData( resp ){
			var friends = resp.response
			friends.forEach( function( friend ){
				var contact = $friends.contact( 'vk-' + friend.id )
				contact.name( friend.first_name + ' ' + friend.last_name )
				contact.image( friend.photo_max )
				contact.vkLink( 'https://vk.com/id' + friend.id )
			})
		}
	}
}})

$jin.atom1.prop({ '$friends.user..theme': {
	pull: function( ){
		return this.data().theme || {}
	},
	put: function( next , prev ){
		this.data({ theme : next })
	}
}})

$jin.atom1.prop.list({ '$friends.user..contacts': {
	pull: function( prev ){
		return ( this.data().contacts || prev || [] ).map( $friends.contact )
	},
	put: function( next ){
		this.data({ contacts : next.map( String ) })
		return next
	}
}})

$jin.atom1.prop.list({ '$friends.user..scales': {
	pull: function( prev ){
		return ( this.data().scales || [ 'family' , 'hobby' , 'work' ] ).map( $friends.scale )
	},
	put: function( next , prev ){
		this.data({ scales : next.map( String ) })
		return next
	}
}})

$jin.atom1.prop({ '$friends.user..importance': {
	pull: function( ){
		var importance = this.data().importance || { }
		this.scales().forEach( function( scale ){
			if( importance[ scale.id() ] === void 0 ) {
				importance[ scale.id() ] = .5
			}
		})
		return importance
	},
	put: function( next, prev ) {
		if( prev ){
			for( var key in prev ){
				if( key in next ) continue
				next[ key ] = prev[ key ]
			}
		}
		this.data({ importance : next })
	}
}})

;
$jin.sample.strings( "<div friends-application=\"\" id=\"{id}\"\n    jin-sample-props=\"\n        style.background=background\n    \"\n\t>\n\t{content}\n</div>\n\n<div friends-application-header=\"\">\n\t<a friends-application-header-exit=\"\"\n\t   href=\"#\"\n\t   jin-sample-events=\" onclick=onExit \"\n\t\t\t>\n\t\tВыход\n\t</a>\n\t<div friends-application-header-title=\"\">\n\t\t<a friends-application-header-profile=\"\"\n\t\t    href=\"#profile=\"\n\t\t\t>\n\t\t\tМои\n\t\t</a>\n\t\t<a friends-application-header-gallery=\"\"\n\t\t    href=\"#\"\n\t\t\t>\n\t\t\tДрузья\n\t\t</a>\n\t</div>\n\t<a friends-application-header-add=\"\"\n\t   href=\"{linkToAdd}\"\n\t\t\t>\n\t\tДобавить\n\t</a>\n</div>" )
;
/**
 * @name $friends.application
 * @class $friends.application
 * @mixins $jin.klass
 * @mixins $jin.view1
 * @returns $friends.application
 */
$jin.klass({ '$friends.application': [ '$jin.view1' ] })

/**
 * @name $friends.application#content
 * @method content
 * @member $friends.application
 */
$jin.atom1.prop.list({ '$friends.application..content': {
	pull: function( ){
		var next = []
		
		next.push( this.element( 'header' ) )
		
		next.push( this.child( 'gallery', $friends.gallery ) )
		
		return next
	}
}})

/**
 * @name $friends.application#title
 * @method title
 * @member $friends.application
 */
$jin.atom1.prop({ '$friends.application..title': {
	pull: function( ){
		return 'Мои Друзья'
	}
}})

$jin.atom1.prop({ '$friends.application..background': {
	pull: function( ){
		return $friends.user.current().theme().background
	}
}})

/**
 * @name $friends.application#linkToAdd
 * @method linkToAdd
 * @member $friends.application
 */
$jin.atom1.prop({ '$friends.application..linkToAdd': {
	pull: function( ){
		var query = Object.create( $jin.state.url.hash() )
		query.contact = [ Date.now().toString( 32 ) ]
		return $jin.uri({ query: query } ).toString().replace( /^\?/, '#' )
	}
}})

$jin.method({ '$friends.application..onExit' : function( event ) {
	localStorage.clear()
	document.cookie = 'friends-session-key=;path=/'
	location.replace('')
}})

if( $jin.state.url.item( 'key' ) ) {
	document.cookie = 'friends-session-key=' + encodeURIComponent( $jin.state.url.item( 'key' ) ) + ';path=/;max-age=' + ( 60 * 60 * 24 * 265 * 10 )
	$jin.state.url.item( 'key' , null )
}

;
$jin.klass({ '$friends.contact.view' : [ '$jin.view1' ] })

/**
 * @name $friends.contact.view#contact
 * @method contact
 * @member $friends.contact.viewRoot
 */
$jin.atom1.prop({ '$friends.contact.view..contact': {
}});

/**
 * @name $friends.contact.view#isOpened
 * @method isOpened
 * @member $friends.contact.viewRoot
 */
$jin.atom1.prop({ '$friends.contact.view..isOpened': {
	pull: function( ){
		return $friends.contact.current().indexOf( this.contact() ) !== -1;
	}
}})

$jin.atom1.prop({ '$friends.contact.view..lastMeeting': {
	pull: function( ){
		return this.contact().lastMeeting()
	},
	put: function( next ){
		this.contact().lastMeeting( $jin.time.moment( next ) )
	}
}})

$jin.atom1.prop({ '$friends.contact.view..nextMeeting': {
	pull: function( ){
		return this.contact().nextMeeting()
	},
	put: function( next ){
		this.contact().nextMeeting( $jin.time.moment( next ) )
	}
}})

/**
 * @name $friends.contact.view.details#contactImage
 * @method contactImage
 * @member $friends.contact.viewRoot.details
 */
$jin.atom1.prop({ '$friends.contact.view..contactImage': {
	pull: function( ){
		return this.contact().image() || 'http://vk.com/images/camera_200.gif'
	}
}})

$jin.atom1.prop({ '$friends.contact.view..contactName': {
	pull: function( ){
		return this.contact().name()
	},
	put : function( next ) {
		this.contact().name( next )
	}
}})

$jin.atom1.prop({ '$friends.contact.view..description': {
	pull : function( ){
		return this.contact().description()
	},
	put : function( next ) {
		this.contact().description( next )
	}
}})

$jin.atom1.prop({ '$friends.contact.view..vkLink': {
	pull : function( ){
		return this.contact().vkLink()
	},
}})
;
$jin.klass({ '$friends.scale.view' : [ '$jin.view1' ] })

/**
 * @name $friends.scale.view#title
 * @method title
 * @member $friends.scale.viewRoot
 */
$jin.atom1.prop({ '$friends.scale.view..scale': { merge : $friends.scale } })

$jin.atom1.prop({ '$friends.scale.view..scaleName': { 
    pull : function( ) {
        return this.scale().name()
    }
} })

;
$jin.klass({ '$friends.scale.view.tag' : [ '$friends.contact.view', '$friends.scale.view' ] })

/**
 * @name $friends.scale.view.tag#strength
 * @method strength
 * @member $friends.scale.viewRoot.tag
 */
$jin.atom1.prop({ '$friends.scale.view.tag..importance': {
	pull: function( ){
		return this.contact().importance()[ this.scale().id() ] || 0
	}
}})

/**
 * @name $friends.scale.view.tag#opacity
 * @method opacity
 * @member $friends.scale.viewRoot.tag
 */
$jin.atom1.prop({ '$friends.scale.view.tag..color': {
	pull: function( ){
		return 'rgba( 0 , 255 , 255 , ' + this.importance().toPrecision( 2 ) + ' ) '
	}
}})

;
$jin.sample.strings( "<div friends-scale-view-tag=\"\" id=\"{id}\"\n    jin-sample-props=\"\n        style.backgroundColor=color\n    \"\n    title=\"{scaleName}\"\n\t>\n</div>\n" )
;
$jin.klass({ '$friends.contact.view.card' : [ '$friends.contact.view' ] })

/**
 * @name $friends.contact.view.card#link
 * @method link
 * @member $friends.contact.viewRoot.card
 */
$jin.atom1.prop({ '$friends.contact.view.card..link': {
	pull: function( ){
		var query = Object.create( $jin.state.url.hash() )
		query.contact = [ this.contact().toString() ]
		query.profile = void 0
		return $jin.uri({ query: query } ).toString().replace( /^\?/, '#' )
	}
}})

/**
 * @name $friends.contact.view.card#values
 * @method values
 * @member $friends.contact.viewRoot.card
 */
$jin.atom1.prop({ '$friends.contact.view.card..scales': {
	pull: function( ){
		var importance = this.contact().importance()
		var next = []
		for( var scaleId in importance ) {
			next.push( this.child( 'scale=' + scaleId, $friends.scale.view.tag ).contact( this.contact() ).scale( scaleId ) )
		}
		return next
	}
}})

;
$jin.sample.strings( "<a friends-contact-view-card=\"\" id=\"{id}\"\n    friends-contact-view-card-opened=\"{isOpened}\"\n    href=\"{link}\"\n\t>\n\t<div friends-contact-view-card-name=\"\">{contactName}</div>\n\t<img friends-contact-view-card-image=\"\" src=\"{contactImage}\" />\n\t<div friends-contact-view-card-values=\"\">{scales}</div>\n</a>\n" )
;
$jin.sample.strings( "<div jin-editor=\"{render}\" id=\"{id}\"\n\tjin-editor-name=\"{name}\"\n\tjin-sample-props=\"\n\t\tcontentEditable=isEditable\n\t\"\n    jin-sample-events=\"\n\t\toninput=onInput\n\t\tonkeypress=onKeyPress\n\t\t-onkeyup=onInput\n\t\t-onmouseup=onInput\n\t\t-onchange=onInput\n\t\t-onDOMSubtreeModified=onInput\n\t\tonfocus=onFocus\n\t\tonblur=onBlur\n    \"\n\t>\n</div>\n" )
;
document.execCommand( 'DefaultParagraphSeparator', false, 'div' )

/**
 * @name $jin.editor
 * @class $jin.editor
 * @mixins $jin.klass
 * @mixins $jin.view1
 * @returns $jin.editor
 */
$jin.klass({ '$jin.editor': [ '$jin.view1' ] })

/**
 * @name $jin.editor#isEditable
 * @method isEditable
 * @member $jin.editor
 */
$jin.atom1.prop({ '$jin.editor..isEditable': {
	pull: function( ){
		return true
	}
}})

/**
 * @name $jin.editor#valueProp
 * @method valueProp
 * @member $jin.editor
 */
$jin.atom1.prop({ '$jin.editor..valueProp': {
	pull: function( ){
		return $jin.value()
	}
}})

/**
 * @name $jin.editor#focus
 * @method focus
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..focus': function( ){
	this.nativeNode().focus()
}})

/**
 * @name $jin.editor#render
 * @method render
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..render': function( ){
	this.value()
	return true
}})

/**
 * @name $jin.editor#value
 * @method value
 * @member $jin.editor
 */
$jin.atom1.prop({ '$jin.editor..value': {
	pull: function( ){
		return this.valueProp()()
	},
	put: function( next ){
		this.valueProp()( next )
		return next
	},
	push: function( next ){
		if( next == null ) return
		
		//$jin.log( 'from', JSON.stringify( this.element().text() ) )
		//$jin.log( 'next', JSON.stringify( next ) )
		
		var content = next.split( '\n' ).map( function( str ){
			return {
				nodeName: 'div',
				childNodes: str
				? [
					str,
					{ nodeName: 'br' }
				] : [
					{ nodeName: 'br' }
				]
			}
		} )
		
		//$jin.log( 'next', JSON.stringify( content ) )
		
		var sel = $jin.dom.range.create()
		var target = this.element()
		
		if( target.parent() && target.rangeContent().hasRange( sel ) ) {

			var offsetStart = $jin.dom(target.rangeContent().equalize('end2start', sel).nativeRange().cloneContents()).text().length
			var offsetEnd = $jin.dom(target.rangeContent().equalize('end2end', sel).nativeRange().cloneContents()).text().length

			this.element().tree(content)

			var zone = target.rangeContent()
			var selStart = zone.clone().move(offsetStart)
			var selEnd = zone.clone().move(offsetEnd)

			zone
				.equalize('start2start', selStart)
				.equalize('end2end', selEnd)
				.select()
		} else {
			this.element().tree(content)
		}
		//$jin.log( offsetStart, offsetEnd )
		
		//$jin.log( 'to', JSON.stringify( this.element().text() ) )
	}
}})

/**
 * @name $jin.editor#onInput
 * @method onInput
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onInput': function( event ){

	var target = event.target();

//
//	//	target.normalize({
//	//		'#text': function( node ){
//	////			var prevText = node.nodeValue;
//	////			var nextText = prevText.replace( /^\s+(?=[^\s])/g, '' ).replace( / /g, '\u00A0' );
//	////			if( prevText !== nextText ) node.nodeValue = nextText;
//	//			return node
//	//		},
//	//		'br': $jin.pipe([]),
//	//		'': function( node ){
//	//			return node.childNodes
//	//		}
//	//	})
//
//	var zone = target.rangeContent()
//	var selStart = zone.clone().move( offsetStart )
//	var selEnd = zone.clone().move( offsetEnd )
//
//	zone
//		.equalize( 'start2start', selStart )
//		.equalize( 'end2end', selEnd )
//		.select()

	var text = target.text().replace( /\n$/, '' )
	
	this.value( text )
}})

/**
 * @name $jin.editor#onFocus
 * @method onFocus
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onFocus': function( event ){
	this.focused( 'true' )
}})

/**
 * @name $jin.editor#onBlur
 * @method onBlur
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onBlur': function( event ){
	this.focused( null )
}})

/**
 * @name $jin.editor#onKeyPress
 * @method onKeyPress
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onKeyPress': function( event ){

	var target = event.target();

	if( event.keyCode() === 13 ){
		var br = target.makeElement( 'br' )
		$jin.dom.range.create().replace( br )

		var next = br.next()
		if( next ) next.rangeContent().collapse2start().select()
		else br.rangeContent().collapse2end().select()

		event.catched( true )
	}
	
	this.onInput( event )
}})

;
$jin.klass({ '$friends.scale.view.editor.option' : [ '$friends.contact.view', '$friends.scale.view' ] })

/**
 * @name $friends.scale.view.editor.option#strength
 * @method strength
 * @member $friends.scale.viewRoot.editor.option
 */
$jin.atom1.prop({ '$friends.scale.view.editor.option..importance': {
	pull: function( ){
		return this.contact().importance()[ this.scale().id() ] || 0
	}
}})

$jin.atom1.prop({ '$friends.scale.view.editor.option..importanceOption': {} })

/**
 * @name $friends.scale.view.editor.option#opacity
 * @method opacity
 * @member $friends.scale.viewRoot.editor.option
 */
$jin.atom1.prop({ '$friends.scale.view.editor.option..color': {
	pull: function( ){
		var opacity = ( this.importance() < this.importanceOption() ) ? 0 : this.importanceOption().toPrecision( 2 )
		return 'rgba( 0 , 255 , 255 , ' + opacity + ' ) '
	}
}})

/**
 * @name $friends.scale.view.editor.option#onActivate
 * @method onActivate
 * @member $friends.scale.view.editor.option
 */
$jin.method({ '$friends.scale.view.editor.option..onActivate': function( event ){
	if( event.catched() ) return
	
	var importance = {}
	importance[ this.scale().id() ] = this.importanceOption()
	this.contact().importance( importance )
}})

;
$jin.sample.strings( "<div friends-scale-view-editor-option=\"\" id=\"{id}\"\n    jin-sample-props=\"\n        style.backgroundColor=color\n    \"\n    jin-sample-events=\"\n        onmouseup=onActivate\n    \"\n\t>\n</div>\n" )
;
$jin.klass({ '$friends.scale.view.editor' : [ '$friends.contact.view' , '$friends.scale.view' ] })

/**
 * @name $friends.scale.view.editor#content
 * @method content
 * @member $friends.scale.viewRoot.editor
 */
$jin.atom1.prop({ '$friends.scale.view.editor..content': {
	pull: function( ){
		var next = []
		
		var scale = this.scale()
		
		next.push( this.child( 'name;editor' , $jin.editor ).valueProp( scale.name.bind( scale ) ) )
		
		var currentStrength = this.contact().importance()[ scale.id() ] || 0
		
		var count = 5
		for( var i = 0 ; i < count ; ++i ) {
			var strength = i / ( count - 1 )
			//if( strength > currentStrength ) strength = 0
			var option = this.child( 'option=' + i , $friends.scale.view.editor.option )
			option.contact( this.contact() )
			option.scale( scale )
			option.importanceOption( strength )
			next.push( option )
		}
		
		return next
	}
}})

;
$jin.sample.strings( "<div friends-scale-view-editor=\"\" id=\"{id}\">\n    {content}\n</div>\n" )
;
$jin.klass({ '$friends.contact.view.details' : [ '$friends.contact.view' ] })

/**
 * @name $friends.contact.view.details#content
 * @method content
 * @member $friends.contact.viewRoot.details
 */
$jin.atom1.prop({ '$friends.contact.view.details..scales': {
	pull: function( ){
		var next = []
		
		var contact = this.contact()
		
		$friends.user.current().scales().forEach( function( scale ) {
			next.push( this.child( 'scale;editor=' + scale.id(), $friends.scale.view.editor ).contact( this.contact() ).scale( scale ) )
		}.bind( this ))

		return next
	},
	push : function(){
		this.onShow()
	}
	//push: function( next, prev ){
	//	if( !this.contact().name() ){
	//		new $jin.schedule( 100, function( ){
	//			this.child( 'title' ).focus()
	//		}.bind( this ) )
	//	}
	//}
}});

/**
 * @name $friends.contact.view.details#onShow
 * @method onShow
 * @member $friends.contact.view.details
 */
$jin.method({ '$friends.contact.view.details..onShow': function( event ){
	new $jin.schedule( 0 , function( ) {
		if( !this.contactName() ) this.element().cssFind( '[friends-contact-view-details-name]' ).nativeNode().focus()
	}.bind( this ) )
}})
;
$jin.sample.strings( "<div friends-contact-view-details=\"\" id=\"{id}\"\n    jin-sample-events=\"\n        onDOMNodeInsertedIntoDocument=onShow\n    \"\n\t>\n\t<input friends-contact-view-details-name=\"\"\n        placeholder=\"Имя\"\n        jin-sample-props=\"\n\t\t\tvalue=contactName\n\t\t\"\n\t/>\n\t<img friends-contact-view-details-image=\"\" src=\"{contactImage}\" />\n\t<div friends-contact-view-details-dates=\"\">\n\t\t<input friends-contact-view-details-lastmeeting=\"\"\n\t        title=\"Последняя встреча\"\n\t        type=\"date\"\n\t        jin-sample-props=\"\n\t            value=lastMeeting\n\t\t\t\"\n\t\t/>\n\t\t...\n\t\t<input friends-contact-view-details-lastmeeting=\"\"\n\t        title=\"Следующая встреча\"\n\t        type=\"date\"\n\t        jin-sample-props=\"\n\t            value=nextMeeting\n\t\t\t\"\n\t\t/>\n\t</div>\n\t<div friends-contact-view-details-scales=\"\">\n\t\t{scales}\n\t</div>\n\t<a friends-contact-view-details-vklink=\"\" href=\"{vkLink}\" target=\"_blank\">Написать ВКонтакте</a>\n\t<textarea friends-contact-view-details-description=\"\"\n        placeholder=\"\"\n        jin-sample-props=\"\n\t\t\tvalue=description\n\t\t\"\n\t\t>\n\t</textarea>\n</div>\n\n\n\t\n" )
;
$jin.klass({ '$friends.contact.view.row' : [ '$friends.contact.view' ] })

/**
 * @name $friends.contact.view.row#contactName
 * @method contactName
 * @member $friends.contact.viewRoot.row
 */
$jin.atom1.prop({ '$friends.contact.view.row..contactName': {
	pull: function( ){
		return this.contact().name()
	}
}})

/**
 * @name $friends.contact.view.row#contactImage
 * @method contactImage
 * @member $friends.contact.viewRoot.row
 */
$jin.atom1.prop({ '$friends.contact.view.row..contactImage': {
	pull: function( ){
		return this.contact().image()
	}
}})

/**
 * @name $friends.contact.view.row#link
 * @method link
 * @member $friends.contact.viewRoot.row
 */
$jin.atom1.prop({ '$friends.contact.view.row..link': {
	pull: function( ){
		var query = Object.create( $jin.state.url.hash() )
		query.contact = [ this.contact().toString() ]
		return $jin.uri({ query: query } ).toString().replace( /^\?/, '#' )
	}
}})

;
$jin.sample.strings( "<a friends-contact-view-row=\"\" id=\"{id}\"\n    friends-contact-view-row-opened=\"{isOpened}\"\n    href=\"{link}\"\n\t>\n\t<img friends-contact-view-row-image=\"\" src=\"{contactImage}\" />\n\t<div friends-contact-view-row-name=\"\">{contactName}</div>\n</a>\n" )
;
$jin.klass({ '$friends.user.view.color' : [ '$jin.view1' ] })

$jin.atom1.prop({ '$friends.user.view.color..user': {}})

/**
 * @name $friends.user.view.color#onActivate
 * @method onActivate
 * @member $friends.user.view.color
 */
$jin.method({ '$friends.user.view.color..onActivate': function( event ){
	$friends.user.current().theme({ background : this.background() })
}})

/**
 * @name $friends.scale.view.tag#opacity
 * @method opacity
 * @member $friends.scale.viewRoot.tag
 */
$jin.atom1.prop({ '$friends.user.view.color..background': {} })

;
$jin.sample.strings( "<button friends-user-view-color=\"\" id=\"{id}\"\n    jin-sample-props=\"\n        style.background=background\n    \"\n    jin-sample-events=\"\n        onclick=onActivate\n    \"\n\t>\n</button>\n" )
;
$jin.klass({ '$friends.user.view.details' : [ '$jin.view1' ] })

$jin.atom1.prop({ '$friends.user.view.details..user': {}})
/**
 * @name $friends.user.view.details#content
 * @method content
 * @member $friends.user.viewRoot.details
 */
$jin.atom1.prop({ '$friends.user.view.details..userName': {
	pull: function( ){
		return this.user().name()
	},
	push: function( next ){
		return this.user().name( next )
	}
}});

$jin.atom1.prop({ '$friends.user.view.details..userMail': {
	pull: function( ){
		return this.user().mail()
	},
	push: function( next ){
		return this.user().mail( next )
	}
}});

$jin.atom1.prop({ '$friends.user.view.details..vkLink': {
	pull: function( ){
		return this.user().vkLink()
	},
	push: function( next ){
		return this.user().vkLink( next )
	}
}});

$jin.atom1.prop({ '$friends.user.view.details..colors': {
	pull: function( ){
		var colors = [ 'rgb(157, 110, 162)' , '#5F74AB' , 'rgb(94, 138, 80)' ]
		return colors.map( function( color ) {
			return this.child( 'color=' + color, $friends.user.view.color ).user( this.user() ).background( color )
		}.bind( this ))
	}
}});

$jin.atom1.prop({ '$friends.user.view.details..isExpanded': {
} });

/**
 * @name $friends.user.view.details#onActivate
 * @method onActivate
 * @member $friends.user.view.details
 */
$jin.method({ '$friends.user.view.details..onActivate': function(){
	document.location = '#profile'
} });

$jin.atom1.prop({ '$friends.user.view.details..scales': {
	pull: function( ){
		var next = []

		$friends.user.current().scales().forEach( function( scale ) {
			next.push( this.child( 'scale;editor=' + scale.id(), $friends.scale.view.editor ).contact( $friends.user.current() ).scale( scale ) )
		}.bind( this ))

		return next
	}
} });


;
$jin.sample.strings( "<div friends-user-view-details=\"\" id=\"{id}\"\n\t friends-user-view-details-expanded=\"{isExpanded}\"\n\t jin-sample-events=\"\n\t \tonclick=onActivate\n\t \"\n\t>\n\t<input friends-user-view-details-name=\"\"\n\t    placeholder=\"Ваше имя\"\n\t    required=\"required\"\n\t\tjin-sample-props=\"\n\t\t\tvalue=userName\n\t\t\"\n\t/>\n\t<input friends-user-view-details-mail=\"\"\n\t    placeholder=\"Интернет почта\"\n\t    required=\"required\"\n\t    type=\"email\"\n        jin-sample-props=\"\n\t\t\tvalue=userMail\n\t\t\"\n\t/>\n\t<input friends-user-view-details-vkontakte=\"\"\n\t    placeholder=\"Сылка VKontakte\"\n\t    required=\"required\"\n\t    jin-sample-props=\"\n\t\t\tvalue=vkLink\n\t\t\"\n\t/>\n\t<div friends-user-view-details-colors=\"\">\n\t\t{colors}\n\t</div>\n\t<div friends-user-view-details-scales=\"\">\n\t\t{scales}\n\t</div>\n</div>\n" )
;
$jin.klass({ '$friends.message' : [ '$jin.view1' ] })

/**
 * @name $friends.message#text
 * @method text
 * @member $friends.message
 */
$jin.atom1.prop({ '$friends.message..text': {
	merge: String
}})

;
$jin.sample.strings( "<div friends-message=\"\" id=\"{id}\"\n\t>\n\t{text}\n</div>\n" )
;
$jin.klass({ '$friends.gallery' : [ '$jin.view1' ] })

/**
 * @name $friends.gallery#title
 * @method title
 * @member $friends.gallery
 */
$jin.atom1.prop({ '$friends.gallery..title': {
	pull: function( ){
		return $friends.contact.current().map( function( contact ){
			return contact.name()
		} ).join( ', ' )
	}
}})

/**
 * @name $friends.gallery#content
 * @method content
 * @member $friends.gallery
 */
$jin.atom1.prop.list({ '$friends.gallery..content': {
	pull: function( ){
		var next = []
		var gallery = this

		var contacts = $friends.contact.current()
		if( contacts.length ) {
			contacts.forEach( function( contact, index ){
				var details = gallery.child( 'details;contact=' + contact, $friends.contact.view.details ).contact( contact )
				next.push( details )
			} )
		}
		
		if( $friends.user.current().contacts().length ){
			next.push( this.element( 'lister' ) )
		} else {
			next.push( gallery.element( 'welcome' ) )
		}

		//if( !contacts.length ) {
			var details = gallery.child( 'details;profile', $friends.user.view.details ).user( $friends.user.current()).isExpanded( !contacts.length )
			next.push( details )
		//}
		
		return next
	}
}})

/**
 * @name $friends.gallery#items
 * @method items
 * @member $friends.gallery
 */
$jin.atom1.prop.list({ '$friends.gallery..items': {
	pull: function( ){
		var gallery = this
		var map = {
			'cards' : $friends.contact.view.card,
			'table' : $friends.contact.view.row
		}
		var contactView = map[ $jin.state.url.item( 'layout' ) ] || map.cards
		var contacts = $friends.user.current().contacts()
		if( contacts.length ){
			contacts = contacts.slice(0)
			contacts.sort( function( left , right ){
				left = left.nextMeeting().toString()
				right = right.nextMeeting().toString()
				if ( left > right ) return 1 
				if ( right > left ) return -1
				return 0
			})
			return contacts.map( function( contact , index ){
				return gallery.child( 'contact=' + contact , contactView ).contact( contact )
			} ).concat( [ this.element( 'lister-tail' ) ] )
		} else {
		}
	},
	fail: function( error ){
		this.items([ this.child( 'error', $friends.message ).text( error.message ) ])
	}
}})

;
$jin.sample.strings( "<div friends-gallery=\"\" id=\"{id}\" name=\"contact=15&amp;layout=rows\">\n\t{content}\n</div>\n\n<div friends-gallery-lister=\"\">\n\t<div friends-gallery-lister-items=\"\">\n\t\t{items}\n\t</div>\n</div>\n\n<div friends-gallery-lister-tail=\"\">\n</div>\n\n<div friends-gallery-header=\"\">\n\t{details}\n</div>\n\n<div friends-gallery-welcome=\"\">\n\t<div friends-gallery-welcome-content=\"\">\n\t\t<h1>Не теряйте друзей!</h1>\n\t\t<p>И мы вам в этом поможем!\n\t\t\tПросто добавьте, информацию о них и встречах с ними,\n\t\t\tа мы будем напоминать вам если с кем-то из них вы давно не общались.</p>\n\t</div>\n</div>\n" )
//# sourceMappingURL=index.js.map