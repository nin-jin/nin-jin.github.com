var $jin = this.$jin = {}

;
//# sourceMappingURL=dumb.js.map
;
function $jin2_log() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
    }
    if (typeof console === 'undefined')
        return;
    console.log(console, arguments);
    return arguments[0];
}
function $jin2_log_info(message) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    if (typeof console === 'undefined')
        return;
    if (!$jin2_log_filter.test(message))
        return;
    console.log(message, values);
}
function $jin2_log_warn(message) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    if (typeof console === 'undefined')
        return;
    if (!$jin2_log_filter.test(message))
        return;
    return console.warn.apply(console, arguments);
}
function $jin2_log_error(error) {
    if (typeof console === 'undefined')
        return;
    if (error.jin_log_isLogged)
        return;
    var message = error.stack || error;
    if (console['exception'])
        console['exception'](error);
    else if (console.error)
        console.error(message);
    else if (console.log)
        console.log(message);
    error.jin_log_isLogged = true;
}
function $jin2_log_error_ignore(error) {
    error.jin_log_isLogged = true;
    return error;
}
var $jin2_log_filter = /^$/;
//# sourceMappingURL=log.env=web.js.map
;
function $jin2_object_path(obj) {
    var path = obj.objectPath;
    if (path)
        return path;
    if (typeof obj === 'function') {
        return obj.objectPath = obj.name || Function.toString.call(obj).match(/^\s*function\s*([$\w]*)\s*\(/)[1];
    }
    throw new Error("Field not defined (objectPath)");
}
var $jin2_object = (function () {
    function $jin2_object() {
        this._objectName = null;
        this._objectPath = null;
        this._objectOwner = null;
    }
    $jin2_object.prototype.destroy = function () {
        $jin2_log_info(this.objectPath + ' destroy');
        for (var key in this) {
            var val = this[key];
            if (!val)
                continue;
            if (val.objectOwner !== this)
                continue;
            val.destroy();
        }
        this.objectOwner = null;
    };
    $jin2_object.toString = function () {
        return this.objectPath;
    };
    $jin2_object.prototype.toString = function () {
        return this.objectPath;
    };
    Object.defineProperty($jin2_object.prototype, "objectName", {
        get: function () { return this._objectName; },
        set: function (next) {
            if (this._objectName != null)
                throw new Error("Property already defined (" + this.objectPath + ".objectName)");
            this._objectName = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectPath", {
        get: function () {
            return (this._objectPath == null)
                ? (this._objectPath = $jin2_object_path(this.objectOwner) + '.' + this.objectName)
                : this._objectPath;
        },
        set: function (next) {
            if (this._objectPath != null)
                throw new Error("Property already defined (" + this.objectPath + ".objectPath)");
            this._objectPath = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectOwner", {
        get: function () { return this._objectOwner; },
        set: function (next) {
            var ownerField = this.objectName;
            if (next) {
                var prev = this._objectOwner;
                if (prev)
                    throw new Error("Property already defined (" + this.objectPath + ".objectOwner");
                var nextVal = next[ownerField];
                if (nextVal === this)
                    return;
                if (nextVal)
                    throw new Error("Property already defined (" + next.objectPath + "." + ownerField + ")");
                this._objectOwner = next;
                next[ownerField] = this;
            }
            else {
                var prev = this._objectOwner;
                if (!prev)
                    return;
                prev[ownerField] = null;
                this._objectOwner = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    $jin2_object.prototype.objectEquals = function (other) {
        return this === other;
    };
    $jin2_object.prototype.setup = function (init) {
        init(this);
        return this;
    };
    return $jin2_object;
}());
//# sourceMappingURL=object.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_prop = (function (_super) {
    __extends($jin2_prop, _super);
    function $jin2_prop(pull, put) {
        _super.call(this);
        if (typeof pull === 'function')
            this.pull_ = pull;
        else
            this.pull_ = function () { return pull; };
        if (put)
            this.put_ = put;
    }
    Object.defineProperty($jin2_prop.prototype, "objectOwner", {
        get: function () {
            return this._objectOwner;
        },
        set: function (next) {
            this._objectOwner = next;
        },
        enumerable: true,
        configurable: true
    });
    $jin2_prop.prototype.pull_ = function (prev) {
        throw new Error("Pulling not supportetd (" + this.objectPath + ")");
    };
    $jin2_prop.prototype.put_ = function (next, prev) {
        throw new Error("Putting not supportetd (" + this.objectPath + ")");
    };
    $jin2_prop.prototype.get = function () {
        return this.pull_();
    };
    $jin2_prop.prototype.set = function (next, prev) {
        return this.put_(next, prev);
    };
    $jin2_prop.prototype.mutate = function (mutate) {
        var prev = this.get();
        var next = mutate.call(this.objectOwner, prev);
        this.set(next, prev);
        return next;
    };
    return $jin2_prop;
}($jin2_object));
//# sourceMappingURL=prop.js.map
;
var $jin2_state_stack = {};
//# sourceMappingURL=stack.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Map;
var Set;
var $jin2_atom = (function (_super) {
    __extends($jin2_atom, _super);
    function $jin2_atom(pull, put, reap) {
        _super.call(this);
        this._ = void 0;
        this.error = $jin2_atom.obsolete;
        this.masters = null;
        this.mastersDeep = 0;
        this.slaves = null;
        if (typeof pull === 'function')
            this.pull_ = pull;
        else if (pull !== void 0)
            this.push(pull);
        if (put)
            this.put_ = put;
        if (reap)
            this.reap_ = reap;
    }
    $jin2_atom.prototype.prop = function (pull, put, reap) {
        return new $jin2_atom(pull, put, reap);
    };
    $jin2_atom.prototype.wrap = function (get, set) {
        var _this = this;
        return new $jin2_atom(get ? (function () { return get(_this.get()); }) : function () { return _this.get(); }, set ? function (next, prev) { return _this.set(set(next)); } : function (next, prev) { return _this.set(next, prev); });
    };
    $jin2_atom.prototype.pull_ = function (prev) { throw $jin2_atom.wait; };
    $jin2_atom.prototype.norm_ = function (next, prev) { return next; };
    $jin2_atom.prototype.put_ = function (next, prev) { return next; };
    $jin2_atom.prototype.notify_ = function (next, prev) { };
    $jin2_atom.prototype.fail_ = function (error) { return void 0; };
    $jin2_atom.prototype.reap_ = function () { return true; };
    $jin2_atom.prototype.reap = function () {
        $jin2_atom._planReap.delete(this);
        if (this.slaves)
            return;
        if (this.reap_()) {
            this.destroy();
            return true;
        }
        return false;
    };
    $jin2_atom.prototype.destroy = function () {
        $jin2_atom._planReap.delete(this);
        this.disobeyAll();
        _super.prototype.destroy.call(this);
    };
    $jin2_atom.prototype.get = function () {
        var slave = $jin2_atom.stack[$jin2_atom.stack.length - 1];
        if (slave)
            this.lead(slave);
        if (this.error === $jin2_atom.obsolete)
            this.pull();
        if (slave)
            slave.obey(this);
        if (this.error)
            throw this.error;
        return this._;
    };
    $jin2_atom.prototype.pull = function () {
        var _this = this;
        $jin2_log_info('pull ' + (this._objectOwner && this.objectPath));
        if (this.masters) {
            this.masters.forEach(function (linked, master) {
                _this.masters.set(master, false);
            });
        }
        this.mastersDeep = 0;
        this.error = $jin2_atom.wait;
        var index = $jin2_atom.stack.length;
        $jin2_atom.stack.push(this);
        var next = this.pull_(this._);
        $jin2_atom.stack.length = index;
        if (next !== void 0)
            this.push(next);
        if (this.masters) {
            var masters = this.masters;
            this.masters.forEach(function (linked, master) {
                if (linked)
                    return;
                masters.delete(master);
                master.dislead(_this);
            });
            if (!masters.size)
                this.masters = null;
        }
        return this._;
    };
    $jin2_atom.prototype.push = function (next) {
        var prev = this._;
        next = this.norm_(next, prev);
        this.error = null;
        if (next !== prev) {
            this._ = next;
            this.notify(prev);
        }
        return next;
    };
    $jin2_atom.prototype.set = function (next, prev) {
        var value = this._;
        next = this.norm_(next, value);
        if (prev !== void 0)
            prev = this.norm_(prev, value);
        if (next !== value) {
            next = this.put_(next, prev);
            if (next !== void 0) {
                this.push(next);
            }
        }
        return this._;
    };
    $jin2_atom.prototype.clear = function () {
        var prev = this._;
        this._ = void 0;
        this.error = $jin2_atom.obsolete;
        this.notify(prev);
        return void 0;
    };
    $jin2_atom.prototype.notifySlaves = function () {
        if (this.slaves) {
            this.slaves.forEach(function (slave) { return slave.update(); });
        }
    };
    $jin2_atom.prototype.notify = function (prev) {
        $jin2_log_info('notify ' + (this._objectOwner && this.objectPath), this._, prev);
        this.notifySlaves();
        this.notify_(this._, prev);
    };
    $jin2_atom.prototype.fail = function (error) {
        if (this.error === error)
            return;
        this.error = error;
        this.notifySlaves();
        var value = this.fail_(error);
        if (value !== void 0)
            this.push(value);
    };
    $jin2_atom.prototype.update = function () {
        if (this.error === $jin2_atom.obsolete)
            return;
        this.error = $jin2_atom.obsolete;
        $jin2_atom.actualize(this);
    };
    $jin2_atom.prototype.lead = function (slave) {
        if (!this.slaves)
            this.slaves = new Set;
        this.slaves.add(slave);
        $jin2_atom._planReap.delete(this);
    };
    $jin2_atom.prototype.dislead = function (slave) {
        if (!this.slaves)
            return;
        this.slaves.delete(slave);
        if (!this.slaves.size) {
            this.slaves = null;
            $jin2_atom.collect(this);
        }
    };
    $jin2_atom.prototype.disleadAll = function () {
        var _this = this;
        if (!this.slaves)
            return;
        this.slaves.forEach(function (slave) { return slave.disobey(_this); });
        this.slaves = null;
        $jin2_atom.collect(this);
    };
    $jin2_atom.prototype.obey = function (master) {
        if (!this.masters)
            this.masters = new Map;
        this.masters.set(master, true);
        var masterDeep = master.mastersDeep;
        if (this.mastersDeep <= masterDeep) {
            this.mastersDeep = masterDeep + 1;
        }
    };
    $jin2_atom.prototype.disobey = function (master) {
        if (!this.masters)
            return;
        this.masters.delete(master);
        if (!this.masters.size)
            this.masters = null;
    };
    $jin2_atom.prototype.disobeyAll = function () {
        var _this = this;
        if (!this.masters)
            return;
        this.masters.forEach(function (linked, master) { return master.dislead(_this); });
        this.masters = null;
        this.mastersDeep = 0;
    };
    $jin2_atom.prototype.mutate = function (mutate) {
        var next = mutate.call(this.objectOwner, this._);
        return this.set(next);
    };
    $jin2_atom.prototype.on = function (notify, fail) {
        if (!notify)
            notify = function (value) { return null; };
        if (!fail)
            fail = function (error) { return null; };
        var source = this;
        var Listener = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                _super.apply(this, arguments);
            }
            class_1.prototype.pull_ = function (prev) {
                return notify(source.get());
            };
            class_1.prototype.fail_ = function (error) {
                if (error === $jin2_atom.wait)
                    return;
                return fail(error);
            };
            return class_1;
        }($jin2_atom));
        var listener = new Listener;
        listener.objectName = 'listener';
        listener.objectOwner = this;
        listener.push(null);
        listener.update();
        return listener;
    };
    $jin2_atom.prototype.then = function (notify, fail) {
        if (!notify)
            notify = function (value) { return null; };
        if (!fail)
            fail = function (error) { return null; };
        var source = this;
        var Promise = (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                _super.apply(this, arguments);
            }
            class_2.prototype.pull_ = function (prev) {
                var val = source.get();
                if (val == void 0)
                    return;
                this.disobeyAll();
                return notify(val);
            };
            class_2.prototype.fail_ = function (error) {
                if (error === $jin2_atom.wait)
                    return;
                promise.disobeyAll();
                return fail(error);
            };
            return class_2;
        }($jin2_atom));
        var promise = new Promise;
        promise.objectName = 'promise';
        promise.objectOwner = this;
        promise.push(null);
        promise.update();
        return promise;
    };
    $jin2_atom.prototype.catch = function (fail) {
        return this.then(null, fail);
    };
    $jin2_atom.actualize = function (atom) {
        var deep = atom.mastersDeep;
        var plan = this._planPull;
        var level = plan[deep];
        if (!level)
            level = plan[deep] = [];
        level.push(atom);
        if (deep < this._minUpdateDeep)
            this._minUpdateDeep = deep;
        this.schedule();
    };
    $jin2_atom.collect = function (atom) {
        this._planReap.add(atom);
        this.schedule();
    };
    $jin2_atom.schedule = function () {
        var _this = this;
        if (this._scheduled)
            return;
        requestAnimationFrame(function () {
            _this._scheduled = false;
            _this.induce();
        });
        this._scheduled = true;
    };
    $jin2_atom.induce = function () {
        while (true) {
            while (this._minUpdateDeep < this._planPull.length) {
                var level = this._planPull[this._minUpdateDeep++];
                if (!level)
                    continue;
                if (!level.length)
                    continue;
                var atom = level.shift();
                if (level.length)
                    this._minUpdateDeep--;
                if (atom.error !== this.obsolete)
                    continue;
                atom.pull();
            }
            var someReaped = false;
            this._planReap.forEach(function (atom) {
                someReaped = atom.reap();
            });
            if (!someReaped)
                break;
        }
    };
    $jin2_atom.wait = new Error('Wait...');
    $jin2_atom.obsolete = new Error('Obsolate state!');
    $jin2_atom.stack = $jin2_state_stack['$jin2_atom_stack'] = [];
    $jin2_atom._planPull = [];
    $jin2_atom._planReap = new Set;
    $jin2_atom._minUpdateDeep = 0;
    return $jin2_atom;
}($jin2_object));
var $jin2_atom_list = (function (_super) {
    __extends($jin2_atom_list, _super);
    function $jin2_atom_list() {
        _super.apply(this, arguments);
    }
    $jin2_atom_list.prop = function (pull, put, reap) {
        return new $jin2_atom_list(pull, put, reap);
    };
    $jin2_atom_list.prototype.norm_ = function (next, prev) {
        if (!prev || !next)
            return next;
        if (next.length !== prev.length)
            return next;
        for (var i = 0; i < next.length; ++i) {
            if (next[i] === prev[i])
                continue;
            return next;
        }
        return prev;
    };
    return $jin2_atom_list;
}($jin2_atom));
window.addEventListener('error', function (event) {
    $jin2_atom.schedule();
    var stack = $jin2_atom.stack;
    $jin2_atom.stack = [];
    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
        var atom = stack_1[_i];
        console.debug(atom.objectPath);
    }
    for (var _a = 0, stack_2 = stack; _a < stack_2.length; _a++) {
        var atom = stack_2[_a];
        atom.fail(event['error']);
    }
});
//# sourceMappingURL=atom.js.map
;
function $jin2_grab(prototype, name, descr) {
    var makeValue = descr.value;
    descr.value = function (key) {
        var field = name + '(' + (JSON.stringify(key) || '') + ')';
        if (this[field])
            return this[field];
        var obj = makeValue.call(this, key);
        obj.objectName = field;
        obj.objectOwner = this;
        return obj;
    };
}
//# sourceMappingURL=grab.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_state_arg = (function (_super) {
    __extends($mol_state_arg, _super);
    function $mol_state_arg() {
        _super.apply(this, arguments);
    }
    $mol_state_arg.prototype.key = function () { return new $jin2_prop(''); };
    $mol_state_arg.prototype.item = function (key) {
        var prefix = this.key().get();
        return $mol_state_arg.item(prefix ? (prefix + '.' + key) : key);
    };
    $mol_state_arg.prototype.link = function (next) {
        var _this = this;
        return new $jin2_prop(function () { return $mol_state_arg.make((_a = {}, _a[_this.key().get()] = next, _a)); var _a; });
    };
    $mol_state_arg.prototype.pull_ = function () {
        return $mol_state_arg.dict().get()[this.key().get()] || null;
    };
    $mol_state_arg.prototype.put_ = function (next) {
        $mol_state_arg.dict().set((_a = {}, _a[this.key().get()] = next, _a));
        return next;
        var _a;
    };
    $mol_state_arg.item = function (key) {
        return (new this).setup(function (_) {
            _.key = function () { return new $jin2_prop(key); };
        });
    };
    $mol_state_arg.href = function () {
        return new $jin2_atom(function () { return window.location.search + window.location.hash; }, function (next) { return document.location.href = next; });
    };
    $mol_state_arg.dict = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var href = _this.href().get();
            var chunks = href.split(/[\/\?#!&;]/g);
            var params = {};
            chunks.forEach(function (chunk) {
                if (!chunk)
                    return;
                var vals = chunk.split(/[:=]/).map(decodeURIComponent);
                params[vals[0]] = vals[1] || '';
            });
            return params;
        }, function (next) {
            _this.href().set(_this.make(next));
        });
    };
    $mol_state_arg.make = function (next) {
        var params = {};
        var prev = this.dict().get();
        for (var key in prev) {
            if (key in next)
                continue;
            params[key] = prev[key];
        }
        for (var key in next) {
            params[key] = next[key];
        }
        var chunks = [];
        for (var key in params) {
            if (null == params[key])
                continue;
            chunks.push([key].concat(params[key]).map(encodeURIComponent).join('='));
        }
        chunks.sort();
        return '#' + chunks.join('#');
    };
    __decorate([
        $jin2_grab
    ], $mol_state_arg.prototype, "link", null);
    __decorate([
        $jin2_grab
    ], $mol_state_arg, "item", null);
    __decorate([
        $jin2_grab
    ], $mol_state_arg, "href", null);
    __decorate([
        $jin2_grab
    ], $mol_state_arg, "dict", null);
    return $mol_state_arg;
}($jin2_atom));
window.addEventListener('hashchange', function () { return $mol_state_arg.href().update(); });
//# sourceMappingURL=arg.env=web.js.map
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $jin2_state_local = (function () {
    function $jin2_state_local() {
    }
    $jin2_state_local.item = function (key) {
        return new $jin2_atom(function () { return JSON.parse(localStorage.getItem(key) || "null"); }, function (next) {
            if (next == null) {
                localStorage.removeItem(key);
                return null;
            }
            else {
                localStorage.setItem(key, JSON.stringify(next));
                return next;
            }
        });
    };
    __decorate([
        $jin2_grab
    ], $jin2_state_local, "item", null);
    return $jin2_state_local;
}());
window.addEventListener('storage', function (event) { return $jin2_state_local.item(event.key).update(); });
//# sourceMappingURL=local.env=web.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_model = (function (_super) {
    __extends($mol_model, _super);
    function $mol_model() {
        _super.apply(this, arguments);
        this._ = this;
        this.error = null;
    }
    $mol_model.app = function (id) {
        return new this();
    };
    $mol_model.prototype.get = function () {
        return _super.prototype.get.call(this);
    };
    $mol_model.prototype.prop = function (pull, put) {
        return new $jin2_prop(pull, put);
    };
    $mol_model.prototype.atom = function (pull, put, reap) {
        return new $jin2_atom(pull, put, reap);
    };
    $mol_model.prototype.argument = function () {
        var owner = this.objectOwner;
        if (owner && owner.argument)
            return owner.argument();
        else
            return $mol_state_arg.item();
    };
    $mol_model.prototype.persist = function (path) {
        var chunk = this.objectName;
        if (path)
            chunk += '.' + path;
        var owner = this.objectOwner;
        if (owner && owner.persist)
            return owner.persist(chunk);
        else
            return $jin2_state_local.item(chunk);
    };
    __decorate([
        $jin2_grab
    ], $mol_model, "app", null);
    return $mol_model;
}($jin2_atom));
//# sourceMappingURL=model.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_vary = (function (_super) {
    __extends($jin2_vary, _super);
    function $jin2_vary(pull, put) {
        _super.call(this);
        if (pull)
            this.pull_ = pull;
        if (put)
            this.put_ = put;
    }
    Object.defineProperty($jin2_vary.prototype, "objectOwner", {
        get: function () {
            return this._objectOwner;
        },
        set: function (next) {
            this._objectOwner = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_vary.prototype, "value", {
        get: function () {
            return this.objectOwner['_' + this.objectName];
        },
        set: function (next) {
            this.objectOwner['_' + this.objectName] = next;
        },
        enumerable: true,
        configurable: true
    });
    $jin2_vary.prototype.get_ = function (value) { return value; };
    $jin2_vary.prototype.pull_ = function (prev) { return prev; };
    $jin2_vary.prototype.norm_ = function (next, prev) { return next; };
    $jin2_vary.prototype.put_ = function (next, prev) { return next; };
    $jin2_vary.prototype.notify_ = function (next, prev) { };
    $jin2_vary.prototype.get = function () {
        var value = this.value;
        if (value === undefined)
            value = this.pull();
        return this.get_(value);
    };
    $jin2_vary.prototype.pull = function () {
        var value = this.pull_(this.value);
        return this.push(value);
    };
    $jin2_vary.prototype.push = function (next) {
        var prev = this.value;
        next = this.norm_(next, prev);
        if (next !== prev) {
            this.value = next;
            this.notify(prev);
        }
        return next;
    };
    $jin2_vary.prototype.clear = function () {
        var prev = this.value;
        this.value = void 0;
        this.notify(prev);
        return void 0;
    };
    $jin2_vary.prototype.set = function (next, prev) {
        var value = this.value;
        next = this.norm_(next, value);
        if (prev !== undefined)
            prev = this.norm_(prev, value);
        if (next !== value) {
            next = this.put_(next, prev);
            if (next !== void 0)
                this.value = next;
        }
        return next;
    };
    $jin2_vary.prototype.mutate = function (mutate) {
        var next = mutate.call(this.objectOwner, this.value);
        return this.set(next);
    };
    $jin2_vary.prototype.notify = function (prev) {
        this.notify_(this.value, prev);
    };
    return $jin2_vary;
}($jin2_object));
//# sourceMappingURL=vary.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_view = (function (_super) {
    __extends($mol_view, _super);
    function $mol_view() {
        _super.apply(this, arguments);
    }
    $mol_view.prototype.tagName = function () {
        return this.prop('div');
    };
    $mol_view.prototype.nameSpace = function () {
        return this.prop('http://www.w3.org/1999/xhtml');
    };
    $mol_view.prototype.child = function () { return this.prop(null); };
    $mol_view.prototype.childNodes = function () { return this.child(); };
    $mol_view.prototype.attrNames = function () {
        if (this.hasOwnProperty('_attrNames'))
            return this._attrNames;
        var names = this._attrNames = [];
        for (var key in this) {
            if (key.substring(0, 5) !== 'attr_')
                continue;
            if (typeof this[key] !== 'function')
                continue;
            names.push(key.substring(5));
        }
        return names;
    };
    $mol_view.prototype.fieldNames = function () {
        if (this.hasOwnProperty('_fieldNames'))
            return this._fieldNames;
        var names = this._fieldNames = [];
        for (var key in this) {
            if (key.substring(0, 6) !== 'field_')
                continue;
            if (typeof this[key] !== 'function')
                continue;
            names.push(key.substring(6));
        }
        return names;
    };
    $mol_view.prototype.eventNames = function () {
        if (this.hasOwnProperty('_eventNames'))
            return this._eventNames;
        var names = this._eventNames = [];
        for (var key in this) {
            if (key.substring(0, 6) !== 'event_')
                continue;
            if (typeof this[key] !== 'function')
                continue;
            names.push(key.substring(6));
        }
        return names;
    };
    $mol_view.prototype.node = function () {
        var _this = this;
        return new $jin2_vary(function () {
            var id = _this.objectPath;
            var prev = document.getElementById(id);
            if (!prev) {
                prev = document.createElementNS(_this.nameSpace().get(), _this.tagName().get());
                prev.setAttribute('id', id);
            }
            Object.getPrototypeOf(_this).eventNames().forEach(function (name) {
                var prop = _this['event_' + name]();
                prev.addEventListener(name, function (event) {
                    prop.set(event);
                    $jin2_atom.induce();
                });
            });
            var proto1 = _this.objectOwner;
            while (proto1 && (proto1.constructor !== $mol_view) && (proto1.constructor !== Function)) {
                var className = $jin2_object_path(proto1.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, '') + '_' + _this.objectName.replace(/\(.*/g, ''), '');
                proto1 = Object.getPrototypeOf(proto1);
            }
            var proto2 = _this;
            while (proto2 && (proto2.constructor !== $mol_view)) {
                var className = $jin2_object_path(proto2.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, ''), "");
                proto2 = Object.getPrototypeOf(proto2);
            }
            return prev;
        });
    };
    $mol_view.prototype.version = function () {
        var _this = this;
        var prop = this.atom(function () {
            var prev = _this.node().get();
            Object.getPrototypeOf(_this).attrNames().forEach(function (name) {
                var n = _this['attr_' + name]().get();
                if (n == null) {
                    prev.removeAttribute(name);
                }
                else {
                    prev.setAttribute(name, String(n));
                }
            });
            var childs = _this.childNodes().get();
            if (childs != null) {
                var childViews = [].concat.apply([], [].concat(childs));
                var childNodes = prev.childNodes;
                var nextNode = prev.firstChild;
                for (var i = 0; i < childViews.length; ++i) {
                    var view = childViews[i];
                    if (typeof view === 'object') {
                        if (view) {
                            var existsNode = view.node().get();
                            while (true) {
                                if (!nextNode) {
                                    prev.appendChild(existsNode);
                                    break;
                                }
                                if (nextNode == existsNode) {
                                    nextNode = nextNode.nextSibling;
                                    break;
                                }
                                else {
                                    if (childViews.indexOf(nextNode) === -1) {
                                        var nn = nextNode.nextSibling;
                                        prev.removeChild(nextNode);
                                        nextNode = nn;
                                    }
                                    else {
                                        prev.insertBefore(existsNode, nextNode);
                                        break;
                                    }
                                }
                            }
                            view.version().get();
                        }
                    }
                    else {
                        if (nextNode && nextNode.nodeName === '#text') {
                            nextNode.nodeValue = String(view);
                            nextNode = nextNode.nextSibling;
                        }
                        else {
                            var textNode = document.createTextNode(String(view));
                            prev.insertBefore(textNode, nextNode);
                        }
                    }
                }
                while (nextNode) {
                    var currNode = nextNode;
                    nextNode = currNode.nextSibling;
                    prev.removeChild(currNode);
                }
            }
            Object.getPrototypeOf(_this).fieldNames().forEach(function (path) {
                var names = path.split('_');
                var obj = prev;
                for (var i = 0; i < names.length - 1; ++i) {
                    if (names[i])
                        obj = obj[names[i]];
                }
                var field = names[names.length - 1];
                var val = _this['field_' + path]().get();
                if (obj[field] !== val)
                    obj[field] = val;
            });
            prev.removeAttribute('mol_view_error');
            return prev;
        });
        prop['fail_'] = function (error) {
            var node = _this.node().get();
            node.setAttribute('mol_view_error', error.message);
            return node;
        };
        return prop;
    };
    __decorate([
        $jin2_grab
    ], $mol_view.prototype, "node", null);
    __decorate([
        $jin2_grab
    ], $mol_view.prototype, "version", null);
    return $mol_view;
}($mol_model));
function $mol_replace(Class) {
    $mol[Class.name] = Class;
    window[Class.name] = Class;
    return Class;
}
document.addEventListener('DOMContentLoaded', function (event) {
    var nodes = document.querySelectorAll('[mol_view_app]');
    for (var i = nodes.length - 1; i >= 0; --i) {
        var node = nodes[i];
        var klass = node.getAttribute('mol_view_app');
        node.id = klass + '.app()';
        var app = $mol[klass].app();
        app.node().get();
        app.version().get();
    }
});
//# sourceMappingURL=view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_scroller = (function (_super) {
        __extends($mol_scroller, _super);
        function $mol_scroller() {
            _super.apply(this, arguments);
        }
        $mol_scroller.prototype.overflowTop = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowTop = function () { return this.overflowTop(); };
        $mol_scroller.prototype.overflowBottom = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowBottom = function () { return this.overflowBottom(); };
        $mol_scroller.prototype.overflowLeft = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowLeft = function () { return this.overflowLeft(); };
        $mol_scroller.prototype.overflowRight = function () { return this.prop(false, function (a) { return a; }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowRight = function () { return this.overflowRight(); };
        $mol_scroller.prototype.scrolls = function () { return this.prop(null, function (a) { return a; }); };
        $mol_scroller.prototype.event_scroll = function () { return this.scrolls(); };
        $mol_scroller.prototype.event_overflow = function () { return this.scrolls(); };
        $mol_scroller.prototype.event_underflow = function () { return this.scrolls(); };
        $mol_scroller.prototype.scrollTop = function () { return this.prop(0, function (a) { return a; }); };
        $mol_scroller.prototype.field_scrollTop = function () { return this.scrollTop(); };
        $mol_scroller.prototype.scrollLeft = function () { return this.prop(0, function (a) { return a; }); };
        $mol_scroller.prototype.field_scrollLeft = function () { return this.scrollLeft(); };
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowBottom", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowLeft", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "overflowRight", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "scrolls", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "scrollTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller.prototype, "scrollLeft", null);
        $mol_scroller = __decorate([
            $mol_replace
        ], $mol_scroller);
        return $mol_scroller;
    }($mol_view));
    $mol.$mol_scroller = $mol_scroller;
})($mol || ($mol = {}));
//# sourceMappingURL=scroller.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_scroller = (function (_super) {
    __extends($mol_scroller, _super);
    function $mol_scroller() {
        _super.apply(this, arguments);
    }
    $mol_scroller.prototype.scrollTop = function () {
        var state = this.persist('scrollTop');
        return this.prop(function () { return Number(state.get()) || 0; }, function (next) { return (state.set(next), next); });
    };
    $mol_scroller.prototype.scrollLeft = function () {
        var state = this.persist('scrollLeft');
        return this.prop(function () { return Number(state.get()) || 0; }, function (next) { return (state.set(next), next); });
    };
    $mol_scroller.prototype.scrollHeight = function () {
        var _this = this;
        return this.atom(function () { return _this.node().get().scrollHeight; });
    };
    $mol_scroller.prototype.scrollWidth = function () {
        var _this = this;
        return this.atom(function () { return _this.node().get().scrollWidth; });
    };
    $mol_scroller.prototype.offsetHeight = function () {
        var _this = this;
        return this.atom(function () { return _this.node().get().offsetHeight; });
    };
    $mol_scroller.prototype.offsetWidth = function () {
        var _this = this;
        return this.atom(function () { return _this.node().get().offsetWidth; });
    };
    $mol_scroller.prototype.scrolls = function () {
        var _this = this;
        return this.prop(null, function (event) {
            _this.scrollTop().set(event.target.scrollTop);
            _this.scrollLeft().set(event.target.scrollLeft);
            _this.scrollHeight().set(event.target.scrollHeight);
            _this.scrollWidth().set(event.target.scrollWidth);
            _this.offsetHeight().set(event.target.offsetHeight);
            _this.offsetWidth().set(event.target.offsetWidth);
        });
    };
    $mol_scroller.prototype.overflowTop = function () {
        var _this = this;
        return this.prop(function () { return _this.scrollTop().get() > 0; });
    };
    $mol_scroller.prototype.overflowLeft = function () {
        var _this = this;
        return this.prop(function () { return _this.scrollLeft().get() > 0; });
    };
    $mol_scroller.prototype.overflowBottom = function () {
        var _this = this;
        return this.prop(function () { return (_this.scrollHeight().get() - _this.scrollTop().get() - _this.offsetHeight().get()) > 0; });
    };
    $mol_scroller.prototype.overflowRight = function () {
        var _this = this;
        return this.prop(function () { return (_this.scrollWidth().get() - _this.scrollLeft().get() - _this.offsetWidth().get()) > 0; });
    };
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollTop", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollLeft", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollWidth", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "offsetHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "offsetWidth", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrolls", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowTop", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowLeft", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowBottom", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "overflowRight", null);
    $mol_scroller = __decorate([
        $mol_replace
    ], $mol_scroller);
    return $mol_scroller;
}($mol.$mol_scroller));
//# sourceMappingURL=scroller.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_lister = (function (_super) {
        __extends($mol_lister, _super);
        function $mol_lister() {
            _super.apply(this, arguments);
        }
        $mol_lister.prototype.rowMinHeight = function () { return this.prop(38, function (a) { return a; }); };
        $mol_lister.prototype.limitStart = function () { return this.prop(0, function (a) { return a; }); };
        $mol_lister.prototype.limitEnd = function () { return this.prop(0, function (a) { return a; }); };
        $mol_lister.prototype.itemsCount = function () { return this.prop(0, function (a) { return a; }); };
        $mol_lister.prototype.fillerStartHeight = function () { return this.prop("0 ", function (a) { return a; }); };
        $mol_lister.prototype.fillerStart = function () {
            var _this = this;
            var view = new $mol.$mol_lister_filler;
            view.height = function () { return _this.fillerStartHeight(); };
            return view;
        };
        $mol_lister.prototype.items = function () { return this.prop(null, function (a) { return a; }); };
        $mol_lister.prototype.itemsVisible = function () { return this.items(); };
        $mol_lister.prototype.fillerEndHeight = function () { return this.prop("0 ", function (a) { return a; }); };
        $mol_lister.prototype.fillerEnd = function () {
            var _this = this;
            var view = new $mol.$mol_lister_filler;
            view.height = function () { return _this.fillerEndHeight(); };
            return view;
        };
        $mol_lister.prototype.child = function () {
            var _this = this;
            return this.prop(function () { return [_this.fillerStart().get(), _this.itemsVisible().get(), _this.fillerEnd().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "rowMinHeight", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "limitStart", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "limitEnd", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "itemsCount", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerStartHeight", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerStart", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "items", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerEndHeight", null);
        __decorate([
            $jin2_grab
        ], $mol_lister.prototype, "fillerEnd", null);
        $mol_lister = __decorate([
            $mol_replace
        ], $mol_lister);
        return $mol_lister;
    }($mol_view));
    $mol.$mol_lister = $mol_lister;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_lister_filler = (function (_super) {
        __extends($mol_lister_filler, _super);
        function $mol_lister_filler() {
            _super.apply(this, arguments);
        }
        $mol_lister_filler.prototype.height = function () { return this.prop("0", function (a) { return a; }); };
        $mol_lister_filler.prototype.field_style_height = function () { return this.height(); };
        __decorate([
            $jin2_grab
        ], $mol_lister_filler.prototype, "height", null);
        $mol_lister_filler = __decorate([
            $mol_replace
        ], $mol_lister_filler);
        return $mol_lister_filler;
    }($mol_view));
    $mol.$mol_lister_filler = $mol_lister_filler;
})($mol || ($mol = {}));
//# sourceMappingURL=lister.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_lister = (function (_super) {
    __extends($mol_lister, _super);
    function $mol_lister() {
        _super.apply(this, arguments);
    }
    $mol_lister.prototype.scroller = function () {
        var _this = this;
        return this.atom(function () {
            var scroller = _this;
            while (scroller && !scroller['scrollTop'])
                scroller = scroller.objectOwner;
            return scroller;
        });
    };
    $mol_lister.prototype.limitStart = function () {
        return this.prop(function () {
            return 0;
        });
    };
    $mol_lister.prototype.limitEnd = function () {
        var _this = this;
        return this.atom(function () {
            var offset = screen.height;
            var scroller = _this.scroller().get();
            if (scroller)
                offset += scroller['scrollTop']().get();
            var limit = Math.ceil(offset / _this.rowMinHeight().get());
            return limit;
        });
    };
    $mol_lister.prototype.itemsVisible = function () {
        var _this = this;
        return $jin2_atom_list.prop(function () {
            var items = _this.items().get();
            if (!items)
                return [];
            return items.slice(_this.limitStart().get(), _this.limitEnd().get());
        });
    };
    $mol_lister.prototype.fillerStartHeight = function () {
        var _this = this;
        return this.prop(function () { return _this.limitStart().get() * _this.rowMinHeight().get() + 'px'; });
    };
    $mol_lister.prototype.itemsCount = function () {
        var _this = this;
        return this.prop(function () { return _this.items().get().length; });
    };
    $mol_lister.prototype.fillerEndHeight = function () {
        var _this = this;
        return this.prop(function () { return Math.max(0, (_this.itemsCount().get() - _this.limitEnd().get()) * _this.rowMinHeight().get()) + 'px'; });
    };
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "scroller", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "limitStart", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "limitEnd", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "itemsVisible", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "fillerStartHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "itemsCount", null);
    __decorate([
        $jin2_grab
    ], $mol_lister.prototype, "fillerEndHeight", null);
    $mol_lister = __decorate([
        $mol_replace
    ], $mol_lister);
    return $mol_lister;
}($mol.$mol_lister));
//# sourceMappingURL=lister.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_floater = (function (_super) {
        __extends($mol_floater, _super);
        function $mol_floater() {
            _super.apply(this, arguments);
        }
        $mol_floater.prototype.transform = function () { return this.prop("none", function (a) { return a; }); };
        $mol_floater.prototype.field_style_transform = function () { return this.transform(); };
        $mol_floater.prototype.floatHor = function () { return this.prop(true, function (a) { return a; }); };
        $mol_floater.prototype.floatingHor = function () { return this.floatHor(); };
        $mol_floater.prototype.attr_mol_floater_floatingHor = function () { return this.floatingHor(); };
        $mol_floater.prototype.floatVert = function () { return this.prop(true, function (a) { return a; }); };
        $mol_floater.prototype.floatingVert = function () { return this.floatVert(); };
        $mol_floater.prototype.attr_mol_floater_floatingVert = function () { return this.floatingVert(); };
        __decorate([
            $jin2_grab
        ], $mol_floater.prototype, "transform", null);
        __decorate([
            $jin2_grab
        ], $mol_floater.prototype, "floatHor", null);
        __decorate([
            $jin2_grab
        ], $mol_floater.prototype, "floatVert", null);
        $mol_floater = __decorate([
            $mol_replace
        ], $mol_floater);
        return $mol_floater;
    }($mol_view));
    $mol.$mol_floater = $mol_floater;
})($mol || ($mol = {}));
//# sourceMappingURL=floater.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_floater = (function (_super) {
    __extends($mol_floater, _super);
    function $mol_floater() {
        _super.apply(this, arguments);
    }
    $mol_floater.prototype.scroller = function () {
        var _this = this;
        return this.atom(function () {
            var scroller = _this;
            while (scroller && !scroller['scrollTop'])
                scroller = scroller.objectOwner;
            return scroller;
        });
    };
    $mol_floater.prototype.offset = function () {
        var _this = this;
        return this.atom(function () {
            var scroller = _this.scroller().get();
            if (!scroller)
                return [0, 0];
            return [
                _this.floatHor().get() ? scroller['scrollLeft']().get() : 0,
                _this.floatVert().get() ? scroller['scrollTop']().get() : 0,
            ];
        });
    };
    $mol_floater.prototype.transform = function () {
        var _this = this;
        return this.prop(function () {
            var offset = _this.offset().get();
            return "translate( " + offset[0] + "px , " + offset[1] + "px )";
        });
    };
    $mol_floater.prototype.floatingHor = function () {
        var _this = this;
        return this.prop(function () {
            return _this.offset().get()[0] > 0;
        });
    };
    $mol_floater.prototype.floatingVert = function () {
        var _this = this;
        return this.prop(function () {
            return _this.offset().get()[1] > 0;
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_floater.prototype, "scroller", null);
    __decorate([
        $jin2_grab
    ], $mol_floater.prototype, "offset", null);
    __decorate([
        $jin2_grab
    ], $mol_floater.prototype, "transform", null);
    __decorate([
        $jin2_grab
    ], $mol_floater.prototype, "floatingHor", null);
    __decorate([
        $jin2_grab
    ], $mol_floater.prototype, "floatingVert", null);
    $mol_floater = __decorate([
        $mol_replace
    ], $mol_floater);
    return $mol_floater;
}($mol.$mol_floater));
//# sourceMappingURL=floater.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_tabler = (function (_super) {
        __extends($mol_tabler, _super);
        function $mol_tabler() {
            _super.apply(this, arguments);
        }
        $mol_tabler.prototype.rows = function () { return this.prop(null, function (a) { return a; }); };
        $mol_tabler.prototype.rowsVisible = function () { return this.rows(); };
        $mol_tabler.prototype.rowsCount = function () { return this.prop(null, function (a) { return a; }); };
        $mol_tabler.prototype.lister = function () {
            var _this = this;
            var view = new $mol.$mol_lister;
            view.itemsVisible = function () { return _this.rowsVisible(); };
            view.itemsCount = function () { return _this.rowsCount(); };
            return view;
        };
        $mol_tabler.prototype.child = function () { return this.lister(); };
        __decorate([
            $jin2_grab
        ], $mol_tabler.prototype, "rows", null);
        __decorate([
            $jin2_grab
        ], $mol_tabler.prototype, "rowsCount", null);
        __decorate([
            $jin2_grab
        ], $mol_tabler.prototype, "lister", null);
        $mol_tabler = __decorate([
            $mol_replace
        ], $mol_tabler);
        return $mol_tabler;
    }($mol.$mol_scroller));
    $mol.$mol_tabler = $mol_tabler;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_tabler_header = (function (_super) {
        __extends($mol_tabler_header, _super);
        function $mol_tabler_header() {
            _super.apply(this, arguments);
        }
        $mol_tabler_header = __decorate([
            $mol_replace
        ], $mol_tabler_header);
        return $mol_tabler_header;
    }($mol.$mol_floater));
    $mol.$mol_tabler_header = $mol_tabler_header;
})($mol || ($mol = {}));
//# sourceMappingURL=tabler.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_stringer = (function (_super) {
        __extends($mol_stringer, _super);
        function $mol_stringer() {
            _super.apply(this, arguments);
        }
        $mol_stringer.prototype.valueChanged = function () { return this.prop("", function (a) { return a; }); };
        $mol_stringer.prototype.hint = function () { return this.prop("", function (a) { return a; }); };
        $mol_stringer.prototype.attr_mol_stringer_hint = function () { return this.hint(); };
        $mol_stringer.prototype.field_tabIndex = function () { return this.prop(0, function (a) { return a; }); };
        $mol_stringer.prototype.editable = function () { return this.prop(true, function (a) { return a; }); };
        $mol_stringer.prototype.field_contentEditable = function () { return this.editable(); };
        $mol_stringer.prototype.value = function () { return this.prop("", function (a) { return a; }); };
        $mol_stringer.prototype.field_textContent = function () { return this.value(); };
        $mol_stringer.prototype.presses = function () { return this.prop(null, function (a) { return a; }); };
        $mol_stringer.prototype.event_keydown = function () { return this.presses(); };
        $mol_stringer.prototype.changes = function () { return this.prop(null, function (a) { return a; }); };
        $mol_stringer.prototype.event_input = function () { return this.changes(); };
        $mol_stringer.prototype.commits = function () { return this.prop(null, function (a) { return a; }); };
        $mol_stringer.prototype.blurs = function () { return this.commits(); };
        $mol_stringer.prototype.event_blur = function () { return this.blurs(); };
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "valueChanged", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "hint", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "field_tabIndex", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "editable", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "presses", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "changes", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "commits", null);
        $mol_stringer = __decorate([
            $mol_replace
        ], $mol_stringer);
        return $mol_stringer;
    }($mol_view));
    $mol.$mol_stringer = $mol_stringer;
})($mol || ($mol = {}));
//# sourceMappingURL=stringer.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_stringer = (function (_super) {
    __extends($mol_stringer, _super);
    function $mol_stringer() {
        _super.apply(this, arguments);
    }
    $mol_stringer.prototype.presses = function () {
        var _this = this;
        return this.prop(null, function (next) {
            switch (next.keyCode) {
                case 13:
                    _this.commits().set(next);
                    next.target.blur();
                    break;
                case 27:
                    _this.reverts().set(next);
                    next.target.blur();
                    break;
                default: return;
            }
            next.preventDefault();
        });
    };
    $mol_stringer.prototype.changes = function () {
        var _this = this;
        return this.prop(null, function (next) {
            _this.valueChanged().set(next.target.textContent.trim());
        });
    };
    $mol_stringer.prototype.commits = function () {
        var _this = this;
        return this.prop(null, function (next) {
            _this.value().set(next.target.textContent.trim());
            _this.reverts().set(next);
        });
    };
    $mol_stringer.prototype.reverts = function () {
        var _this = this;
        return this.prop(null, function (next) {
            next.target.textContent = _this.value().get();
            _this.changes().set(next);
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "presses", null);
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "changes", null);
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "commits", null);
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "reverts", null);
    $mol_stringer = __decorate([
        $mol_replace
    ], $mol_stringer);
    return $mol_stringer;
}($mol.$mol_stringer));
//# sourceMappingURL=stringer.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_app_calc = (function (_super) {
        __extends($mol_app_calc, _super);
        function $mol_app_calc() {
            _super.apply(this, arguments);
        }
        $mol_app_calc = __decorate([
            $mol_replace
        ], $mol_app_calc);
        return $mol_app_calc;
    }($mol.$mol_tabler));
    $mol.$mol_app_calc = $mol_app_calc;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_app_calc_cell = (function (_super) {
        __extends($mol_app_calc_cell, _super);
        function $mol_app_calc_cell() {
            _super.apply(this, arguments);
        }
        $mol_app_calc_cell.prototype.result = function () { return this.prop("", function (a) { return a; }); };
        $mol_app_calc_cell.prototype.attr_mol_app_calc_cell_result = function () { return this.result(); };
        __decorate([
            $jin2_grab
        ], $mol_app_calc_cell.prototype, "result", null);
        $mol_app_calc_cell = __decorate([
            $mol_replace
        ], $mol_app_calc_cell);
        return $mol_app_calc_cell;
    }($mol.$mol_stringer));
    $mol.$mol_app_calc_cell = $mol_app_calc_cell;
})($mol || ($mol = {}));
//# sourceMappingURL=calc.view.tree.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol_app_calc = (function (_super) {
    __extends($mol_app_calc, _super);
    function $mol_app_calc() {
        _super.apply(this, arguments);
    }
    $mol_app_calc.prototype.rowsCount = function () { return this.atom(100); };
    $mol_app_calc.prototype.rowsVisible = function () {
        var _this = this;
        return this.atom(function () {
            var rows = [_this.row(0).get()];
            var start = _this.lister().limitStart().get();
            var end = _this.lister().limitEnd().get();
            for (var i = start; i < end; ++i) {
                rows.push(_this.row(i).get());
            }
            return rows;
        });
    };
    $mol_app_calc.prototype.row = function (id) {
        var _this = this;
        return (new $mol_view).setup(function (_) {
            _.child = function () { return _this.prop(function () {
                var cells = [];
                for (var i = 0; i < 16; ++i) {
                    if (i > 0) {
                        if (id > 0) {
                            cells.push(_this.cell(_this.number2string(i - 1) + id).get());
                        }
                        else {
                            cells.push(_this.header(_this.number2string(i - 1)).get());
                        }
                    }
                    else {
                        if (id > 0) {
                            cells.push(_this.header(String(id)).get());
                        }
                        else {
                            cells.push(_this.header('').get());
                        }
                    }
                }
                return cells;
            }); };
        });
    };
    $mol_app_calc.prototype.header = function (id) {
        var _this = this;
        return (new $mol.$mol_tabler_header).setup(function (_) {
            _.child = function () { return _this.prop(id || '#'); };
            _.floatVert = function () { return _this.prop(!id || /^[A-Z]/.test(id)); };
            _.floatHor = function () { return _this.prop(!id || /[0-9]$/.test(id)); };
        });
    };
    $mol_app_calc.prototype.cell = function (id) {
        var _this = this;
        return (new $mol.$mol_app_calc_cell).setup(function (_) {
            _.hint = function () { return _this.prop(''); };
            _.result = function () { return _this.result(id); };
            _.value = function () { return _this.value(id); };
        });
    };
    $mol_app_calc.prototype.value = function (id) {
        var state = this.persist('value_' + id);
        return this.prop(function () { return state.get(); }, function (next) {
            var numb = Number(next);
            if (numb.toString() == next)
                return state.set(numb);
            return state.set(next);
        });
    };
    $mol_app_calc.prototype.func = function (id) {
        var _this = this;
        return this.atom(function () {
            var code = _this.value(id).get()
                .replace(/^=/, 'return ')
                .replace(/#/, 'Math.')
                .replace(/\b([A-Z]+[0-9]+)\b/g, '_.result("$1").get()');
            return new Function('_', code);
        });
    };
    $mol_app_calc.prototype.result = function (id) {
        var _this = this;
        return this.atom(function () {
            var val = _this.value(id).get();
            var res = (val && (val[0] === '=')) ? _this.func(id).get()(_this) : val;
            return res;
        });
    };
    $mol_app_calc.prototype.number2string = function (numb) {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var str = '';
        do {
            str = letters[numb % 26] + str;
            numb = Math.floor(numb / 26);
        } while (numb);
        return str;
    };
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "rowsCount", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "rowsVisible", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "row", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "header", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "cell", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "value", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "func", null);
    __decorate([
        $jin2_grab
    ], $mol_app_calc.prototype, "result", null);
    $mol_app_calc = __decorate([
        $mol_replace
    ], $mol_app_calc);
    return $mol_app_calc;
}($mol.$mol_app_calc));
//# sourceMappingURL=calc.view.js.map
//# sourceMappingURL=index.env=web.stage=release.js.map