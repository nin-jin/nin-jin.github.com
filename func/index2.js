/**
 * @name $jin
 * @class $jin
 * @singleton
 */
this.$jin = {}

;
this.$jin.func = {}

;
var $jin;
(function ($jin) {
    (function (func) {
        function collector() {
            return function (next) {
                var res = [];
                var val;
                while (true) {
                    val = next();
                    if (val === void 0)
                        break;
                    res.push(val);
                }
                return res;
            };
        }
        func.collector = collector;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=collector.js.map

;
var $jin;
(function ($jin) {
    (function (func) {
        function filter(check) {
            return function (next) {
                return function () {
                    while (true) {
                        var val = next();
                        if ((val === void 0) || (check(val)))
                            return val;
                    }
                };
            };
        }
        func.filter = filter;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=filter.js.map

;
var $jin;
(function ($jin) {
    (function (func) {
        function iterator() {
            return function (list) {
                var index = 0;
                return function () {
                    return list[index++];
                };
            };
        }
        func.iterator = iterator;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=iterator.js.map

;
var $jin;
(function ($jin) {
    (function (func) {
        function limiter(count) {
            return function (next) {
                var index = 0;
                return function () {
                    if (index++ < count)
                        return next();
                };
            };
        }
        func.limiter = limiter;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=limiter.js.map

;
this.$jin.func.make = function( name ){
    var func = function( ){
        return func.execute( this, arguments )
    }
    return func
}

;
var $jin;
(function ($jin) {
    (function (func) {
        function mapper(transform) {
            return function (next) {
                return function () {
                    var val = next();
                    if (val !== void 0)
                        val = transform(val);
                    return val;
                };
            };
        }
        func.mapper = mapper;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=mapper.js.map

;
this.$jin.func.name = function( func, name ){
    if( arguments.length > 1 ) return func.$jin_func_name = name
    return func.name
    || func.$jin_func_name
    || func.toString().match( /^\s*function\s*([$\w]*)\s*\(/ )[ 1 ]
}

;
//# sourceMappingURL=pipe.js.map

;
var $jin;
(function ($jin) {
    (function (func) {
        function pipeline(procs) {
            return function (input) {
                for (var i = 0; i < procs.length; ++i) {
                    input = procs[i](input);
                }
                return input;
            };
        }
        func.pipeline = pipeline;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=pipeline.js.map

;
this.$jin.func.usages = function( func ){
	if( func.jin_func_usages ) return func.jin_func_usages
	var found = {}
	Object.toString.call( func ).replace( /\$[a-z][a-z0-9]+(\.[a-z][a-z0-9]*)+/g, function( token ){
		found[ token ] = true
	})
	return func.jin_func_usages = Object.keys( found )
}

//# sourceMappingURL=index.js.map