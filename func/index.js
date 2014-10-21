/**
 * @name $jin
 * @class $jin
 * @singleton
 */
this.$jin = {}

;
this.$jin.func = {}

;
//# sourceMappingURL=pipe.js.map

;
var $jin;
(function ($jin) {
    (function (func) {
        function iterator(list) {
            var length = list.length;
            return function (state) {
                var state2 = state || {
                    key: -1,
                    val: null
                };
                var key = ++state2.key;
                if (key < length) {
                    state2.val = list[key];
                    return state2;
                }
                return null;
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
        function collector(next) {
            var res = [];
            for (var i; i = next(i);) {
                res.push(i.val);
            }
            return res;
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
                return function (state) {
                    var state2 = state || {
                        prev: null,
                        key: -1,
                        val: null
                    };
                    while (true) {
                        var prev = state2.prev = next(state2.prev);
                        if (!prev)
                            return null;
                        if (!check(prev.val))
                            continue;
                        ++state2.key;
                        state2.val = prev.val;
                        return state2;
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
        function limiter(count) {
            return function (next) {
                return function (state) {
                    var key = state ? state.key : 0;
                    return (key < count) ? next(state) : null;
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
                return function (state) {
                    var state2 = next(state);
                    if (!state2)
                        return null;
                    state2.val = transform(state2.val);
                    return state2;
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
var $jin;
(function ($jin) {
    (function (func) {
        function pipeline(procs) {
            return function (next) {
                for (var i = 0; i < procs.length; ++i) {
                    next = procs[i](next);
                }
                return next;
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