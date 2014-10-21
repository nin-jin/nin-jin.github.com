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
            return function (input) {
                var res = [];
                while (input.next()) {
                    res.push(input.val);
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
            return function (input) {
                return {
                    key: -1,
                    val: null,
                    next: function () {
                        while (true) {
                            if (!input.next())
                                return null;
                            if (!check(input.val))
                                continue;
                            ++this.key;
                            this.val = input.val;
                            return this;
                        }
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
                var length = list.length;
                return {
                    key: -1,
                    val: null,
                    next: function () {
                        ++this.key;
                        if (this.key >= length)
                            return null;
                        this.val = list[this.key];
                        return this;
                    }
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
            count = count - 1;
            return function (input) {
                return {
                    key: -1,
                    val: null,
                    next: function () {
                        if (this.key < count) {
                            input.next();
                            this.key = input.key;
                            this.val = input.val;
                            return this;
                        } else {
                            return null;
                        }
                    }
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
            return function (input) {
                return {
                    next: function () {
                        if (!input.next())
                            return null;
                        this.key = input.key;
                        this.val = transform(input.val);
                        return this;
                    }
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
var proc = $jin.func.pipeline([
    $jin.func.iterator(),
    $jin.func.mapper(function (x) {
        return x * x;
    }),
    $jin.func.filter(function (x) {
        return x % 2;
    }),
    $jin.func.limiter(2),
    $jin.func.collector()
]);
//# sourceMappingURL=func.js.map

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