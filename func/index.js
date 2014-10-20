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
            return function (state) {
                if (!state) {
                    if (!list.length)
                        return null;
                    state = {
                        key: -1,
                        val: null
                    };
                }
                if (++state.key < list.length) {
                    state.val = list[state.key];
                    return state;
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
        function combiner(procs) {
            return function (next) {
                for (var i = 0; i < procs.length; ++i) {
                    next = procs[i](next);
                }
                return next;
            };
        }
        func.combiner = combiner;
    })($jin.func || ($jin.func = {}));
    var func = $jin.func;
})($jin || ($jin = {}));
//# sourceMappingURL=combiner.js.map

;
var $jin;
(function ($jin) {
    (function (func) {
        function filter(check) {
            return function (next) {
                return function (state) {
                    if (!state) {
                        state = {
                            prev: null,
                            key: -1,
                            val: null
                        };
                    }
                    while (true) {
                        state.prev = next(state.prev);
                        if (!state.prev)
                            return null;
                        if (!check(state.prev.val))
                            continue;
                        ++state.key;
                        state.val = state.prev.val;
                        return state;
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
                    state = next(state);
                    if (!state)
                        return null;
                    state.val = transform(state.val);
                    return state;
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
this.$jin.func.usages = function( func ){
	if( func.jin_func_usages ) return func.jin_func_usages
	var found = {}
	Object.toString.call( func ).replace( /\$[a-z][a-z0-9]+(\.[a-z][a-z0-9]*)+/g, function( token ){
		found[ token ] = true
	})
	return func.jin_func_usages = Object.keys( found )
}

//# sourceMappingURL=index.js.map