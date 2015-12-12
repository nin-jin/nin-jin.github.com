var $jin = this.$jin = {}

;
//dumb.js.map
;
function $jin2_error(info) {
    var error = new Error(info.reason);
    Object.defineProperty(error, 'message', {
        get: function () {
            return JSON.stringify(this.info);
        }
    });
    error['info'] = info;
    return error;
}
//error.js.map
;
function $jin2_object_path(obj) {
    var path = obj.objectPath;
    if (path)
        return path;
    if (typeof obj === 'function') {
        return obj.objectPath = obj.name || Function.toString.call(obj).match(/^\s*function\s*([$\w]*)\s*\(/)[1];
    }
    throw $jin2_error({ reason: 'Field not defined', field: 'objectPath' });
}
var $jin2_object = (function () {
    function $jin2_object(config) {
        if (config)
            this.objectAssign(config);
    }
    $jin2_object.prototype.destroy = function () {
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
    $jin2_object.make = function (arg) {
        return new this(arg);
    };
    $jin2_object.toString = function () {
        return this.objectPath;
    };
    $jin2_object.prototype.toString = function () {
        return this.objectPath;
    };
    Object.defineProperty($jin2_object.prototype, "objectName", {
        get: function () {
            return this._objectName || (this._objectName = '_' + ++$jin2_object.seed);
        },
        set: function (next) {
            if (this._objectName !== void 0)
                throw $jin2_error({
                    reason: 'Property already defined',
                    path: this.objectPath + '.objectName',
                    next: next,
                    prev: this._objectName,
                });
            this._objectName = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectId", {
        get: function () {
            return (this._objectId === void 0) ? '' : this._objectId;
        },
        set: function (next) {
            if (this._objectId !== void 0)
                throw $jin2_error({
                    reason: 'Property already defined',
                    path: this.objectPath + '.objectId',
                    next: next,
                    prev: this._objectId,
                });
            this._objectId = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectPath", {
        get: function () {
            if (this._objectPath)
                return this._objectPath;
            var owner = this.objectOwner;
            return this._objectPath = $jin2_object_path(owner) + '.' + this.objectName + '_' + this.objectId;
        },
        set: function (next) {
            if (this._objectPath)
                throw $jin2_error({
                    reason: 'Property already defined',
                    path: this.objectPath + '.objectPath',
                    next: next,
                    prev: this._objectPath,
                });
            this._objectPath = next;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_object.prototype, "objectOwner", {
        get: function () {
            if (this._objectOwner)
                return this._objectOwner;
            throw $jin2_error({
                reason: 'Property not defined',
                name: 'objectOwner',
            });
        },
        set: function (next) {
            var ownerField = this.objectName + '_' + this.objectId;
            if (next) {
                var prev = this._objectOwner;
                if (prev)
                    throw $jin2_error({
                        reason: 'Property already defined',
                        path: this.objectPath + '.objectOwner',
                        prev: prev,
                        next: next
                    });
                var nextVal = next[ownerField];
                if (nextVal === this)
                    return;
                if (nextVal)
                    throw $jin2_error({
                        reason: 'Property already defined',
                        path: next.objectPath + '.' + ownerField,
                        prev: nextVal,
                        next: this
                    });
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
    $jin2_object.prototype.objectAssign = function (config) {
        for (var key in config) {
            if (config[key] === void 0)
                continue;
            this[key] = config[key];
        }
        return this;
    };
    $jin2_object.prototype.objectEquals = function (other) {
        return this === other;
    };
    $jin2_object.subClass = function (config) {
        var parent = this;
        var subClass = config.hasOwnProperty('constructor')
            ? config['constructor']
            : function () {
                parent.apply(this, arguments);
            };
        subClass.prototype = Object.create(this.prototype);
        subClass.prototype.constructor = subClass;
        for (var key in this) {
            if (this[key] === void 0)
                continue;
            subClass[key] = this[key];
        }
        subClass.prototype.objectAssign(config);
        return subClass;
    };
    $jin2_object.seed = 0;
    return $jin2_object;
})();
//object.js.map
;
function $jin2_lazy(prototype, name, descr) {
    var prefix = name + '_';
    var getValue = function (id) {
        if (id === void 0) { id = ''; }
        var field = prefix + id;
        if (this[field])
            return this[field];
        var obj = makeValue.call(this, id);
        obj.objectAssign({
            objectName: name,
            objectId: id,
            objectOwner: this,
        });
        return obj;
    };
    if (descr.get) {
        var makeValue = descr.get;
        descr.get = getValue;
        descr.set = function (next) {
            if (typeof next === 'function') {
                makeValue = next;
            }
            else {
                this[prefix] = next;
            }
        };
    }
    else {
        var makeValue = descr.value;
        descr.value = getValue;
    }
}
//lazy.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_prop = (function (_super) {
    __extends($jin2_prop, _super);
    function $jin2_prop(config) {
        _super.call(this, config);
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
        return prev;
    };
    $jin2_prop.prototype.put_ = function (next, prev) {
        throw $jin2_error({ reason: 'Read only' });
        return void 0;
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
        return this.set(next, prev);
    };
    return $jin2_prop;
})($jin2_object);
//prop.js.map
;
var $jin2_state_stack = {};
//state.js.map
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
//log.env=web.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_atom = (function (_super) {
    __extends($jin2_atom, _super);
    function $jin2_atom(config) {
        _super.call(this, config);
        this.error = $jin2_atom.obsolete;
        this.mastersDeep = 0;
        this.slavesCount = 0;
        $jin2_atom.count++;
    }
    $jin2_atom.prototype.get_ = function (value) { return value; };
    $jin2_atom.prototype.pull_ = function (prev) { return prev; };
    $jin2_atom.prototype.norm_ = function (next, prev) { return next; };
    $jin2_atom.prototype.put_ = function (next, prev) { return next; };
    $jin2_atom.prototype.notify_ = function (next, prev) { };
    $jin2_atom.prototype.fail_ = function (error) { return void 0; };
    $jin2_atom.prototype.reap_ = function () { return true; };
    $jin2_atom.prototype.reap = function () {
        $jin2_atom._planReap[this.objectPath] = null;
        if (this.slavesCount)
            return;
        if (this.reap_()) {
            this.destroy();
            return true;
        }
        return false;
    };
    $jin2_atom.prototype.destroy = function () {
        $jin2_atom._planReap[this.objectPath] = null;
        this.disobeyAll();
        _super.prototype.destroy.call(this);
    };
    $jin2_atom.prototype.touch = function () {
        var slave = $jin2_state_stack['$jin2_atom_current'];
        if (!slave)
            return;
        $jin2_atom.link(this, slave);
    };
    $jin2_atom.prototype.get = function () {
        this.touch();
        if (this.error === $jin2_atom.obsolete)
            this.pull();
        if (this.error)
            throw this.error;
        return this.get_(this.value_);
    };
    $jin2_atom.prototype.pull = function () {
        var backup = $jin2_atom.swap(this);
        var oldMasters = this.masters;
        this.masters = null;
        this.mastersDeep = 0;
        this.error = $jin2_atom.wait;
        try {
            var next = this.pull_(this.value_);
            if (next !== void 0)
                this.push(next);
            return this.value_;
        }
        catch (error) {
            this.fail(error);
            if (error !== $jin2_atom.wait)
                throw error;
            return this.value_;
        }
        finally {
            $jin2_atom.swap(backup);
            if (oldMasters)
                for (var masterName in oldMasters) {
                    var master = oldMasters[masterName];
                    if (!master)
                        continue;
                    if (this.masters && this.masters[masterName])
                        continue;
                    master.dislead(this);
                }
        }
    };
    $jin2_atom.prototype.push = function (next) {
        var prev = this.value_;
        next = this.norm_(next, prev);
        this.error = null;
        if (next !== prev) {
            this.value_ = next;
            this.notify(prev);
        }
        return next;
    };
    $jin2_atom.prototype.set = function (next, prev) {
        var value = this.value_;
        next = this.norm_(next, value);
        if (prev !== void 0)
            prev = this.norm_(prev, value);
        if (next !== value) {
            next = this.put_(next, prev);
            if (next !== void 0) {
                this.push(next);
            }
        }
        return this.value_;
    };
    $jin2_atom.prototype.clear = function () {
        var prev = this.value_;
        this.value_ = void 0;
        this.error = $jin2_atom.obsolete;
        this.notify(prev);
        return void 0;
    };
    $jin2_atom.prototype.notifySlaves = function () {
        if (this.slavesCount) {
            for (var slaveName in this.slaves) {
                var slave = this.slaves[slaveName];
                if (!slave)
                    continue;
                slave.update();
            }
        }
    };
    $jin2_atom.prototype.notify = function (prev) {
        $jin2_log_info(this.objectPath, this.value_, prev);
        this.notifySlaves();
        var backup = $jin2_atom.swap(this);
        try {
            this.notify_(this.value_, prev);
        }
        finally {
            $jin2_atom.swap(backup);
        }
    };
    $jin2_atom.prototype.fail = function (error) {
        this.error = error;
        this.notifySlaves();
        var value = this.fail_(error);
        if (value !== void 0)
            this.push(value);
        if (!this.slavesCount && error !== $jin2_atom.wait)
            $jin2_log_error(error);
    };
    $jin2_atom.prototype.update = function () {
        if (this.error === $jin2_atom.obsolete)
            return;
        this.error = $jin2_atom.obsolete;
        $jin2_atom.actualize(this);
    };
    $jin2_atom.prototype.lead = function (slave) {
        var slaveName = slave.objectPath;
        if (this.slaves) {
            if (this.slaves[slaveName])
                return false;
        }
        else {
            this.slaves = {};
        }
        this.slaves[slaveName] = slave;
        delete $jin2_atom._planReap[this.objectPath];
        this.slavesCount++;
        return true;
    };
    $jin2_atom.prototype.dislead = function (slave) {
        var slaveName = slave.objectPath;
        if (!this.slaves[slaveName])
            return;
        this.slaves[slaveName] = null;
        if (!--this.slavesCount) {
            $jin2_atom.collect(this);
        }
    };
    $jin2_atom.prototype.disleadAll = function () {
        if (!this.slavesCount)
            return;
        for (var slaveName in this.slaves) {
            var slave = this.slaves[slaveName];
            if (!slave)
                continue;
            slave.disobey(this);
        }
        this.slaves = null;
        this.slavesCount = 0;
        $jin2_atom.collect(this);
    };
    $jin2_atom.prototype.obey = function (master) {
        var masters = this.masters;
        if (!masters)
            masters = this.masters = {};
        var masterName = master.objectPath;
        if (masters[masterName])
            return false;
        masters[masterName] = master;
        var masterDeep = master.mastersDeep;
        if (this.mastersDeep <= masterDeep) {
            this.mastersDeep = masterDeep + 1;
        }
        return true;
    };
    $jin2_atom.prototype.disobey = function (master) {
        if (!this.masters)
            return;
        this.masters[master.objectPath] = null;
    };
    $jin2_atom.prototype.disobeyAll = function () {
        if (!this.mastersDeep)
            return;
        for (var masterName in this.masters) {
            var master = this.masters[masterName];
            if (!master)
                continue;
            master.dislead(this);
        }
        this.masters = null;
        this.mastersDeep = 0;
    };
    $jin2_atom.prototype.mutate = function (mutate) {
        var next = mutate.call(this.objectOwner, this.value_);
        return this.set(next);
    };
    $jin2_atom.prototype.on = function (notify, fail) {
        var _this = this;
        if (!notify)
            notify = function (value) { return null; };
        if (!fail)
            fail = function (error) { return (console.error(error), null); };
        var Listener = $jin2_atom.subClass({
            pull_: function (listener, prev) {
                listener.push(notify(_this.get()));
            },
            fail_: function (listener, error) {
                if (listener.error === $jin2_atom.wait)
                    return;
                listener.push(fail(listener.error));
            }
        });
        var listener = new Listener({});
        listener.update();
        return listener;
    };
    $jin2_atom.prototype.then = function (notify, fail) {
        var _this = this;
        if (!notify)
            notify = function (value) { return null; };
        if (!fail)
            fail = function (error) { return (console.error(error), null); };
        var promise = new $jin2_atom({
            pull_: function (prev) {
                try {
                    return notify(_this.get());
                }
                catch (error) {
                    if (error === $jin2_atom.wait)
                        return;
                    throw error;
                }
            },
            notify_: function (next) {
                promise.disobeyAll();
            },
            fail_: function (error) {
                if (error === $jin2_atom.wait)
                    return void 0;
                promise.disobeyAll();
                return fail(error);
            },
        });
        promise.pull();
        return promise;
    };
    $jin2_atom.prototype.catch = function (fail) {
        return this.then(null, fail);
    };
    $jin2_atom.link = function (master, slave) {
        if (slave.obey(master)) {
            master.lead(slave);
        }
    };
    $jin2_atom.swap = function (next) {
        var prev = $jin2_state_stack['$jin2_atom_current'];
        $jin2_state_stack['$jin2_atom_current'] = next;
        return prev;
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
        this._planReap[atom.objectPath] = atom;
        this.schedule();
    };
    $jin2_atom.schedule = function () {
        if (this._timer)
            return;
        this._timer = setTimeout(this.induce.bind(this), 0);
    };
    $jin2_atom.induce = function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this.schedule();
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
            for (var atomName in this._planReap) {
                var atom = this._planReap[atomName];
                if (!atom)
                    continue;
                someReaped = atom.reap();
            }
            if (!someReaped)
                break;
        }
        clearTimeout(this._timer);
        this._timer = null;
    };
    $jin2_atom.wait = new Error('Waiting for pulling...');
    $jin2_atom.obsolete = new Error('Obsolate state!');
    $jin2_atom.count = 0;
    $jin2_atom._planPull = [];
    $jin2_atom._planReap = {};
    $jin2_atom._minUpdateDeep = 0;
    return $jin2_atom;
})($jin2_object);
var $jin2_atom_own = (function (_super) {
    __extends($jin2_atom_own, _super);
    function $jin2_atom_own() {
        _super.apply(this, arguments);
    }
    $jin2_atom_own.prototype.push = function (next) {
        var prev = this.value_;
        next = this.norm_(next, prev);
        this.error = null;
        if (next !== prev) {
            next.objectName = 'value';
            next.objectOwner = this;
            this.notify(prev);
        }
        return next;
    };
    return $jin2_atom_own;
})($jin2_atom);
var $jin2_atom_list = (function (_super) {
    __extends($jin2_atom_list, _super);
    function $jin2_atom_list() {
        _super.apply(this, arguments);
    }
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
})($jin2_atom);
//atom.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $jin2_vary = (function (_super) {
    __extends($jin2_vary, _super);
    function $jin2_vary(config) {
        _super.call(this, config);
        $jin2_atom.count++;
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
            return this.objectOwner['_' + this.objectName + '_' + this.objectId];
        },
        set: function (next) {
            this.objectOwner['_' + this.objectName + '_' + this.objectId] = next;
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
})($jin2_object);
var $jin2_vary_own = (function (_super) {
    __extends($jin2_vary_own, _super);
    function $jin2_vary_own() {
        _super.apply(this, arguments);
    }
    $jin2_vary_own.prototype.push = function (next) {
        var prev = this.value;
        next = this.norm_(next, prev);
        if (next !== prev) {
            next.objectName = '_' + this.objectName;
            next.objectId = this.objectId;
            next.objectOwner = this.objectOwner;
            this.notify(prev);
        }
        return next;
    };
    return $jin2_vary_own;
})($jin2_vary);
//vary.js.map
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
var $jin2_view_div = (function (_super) {
    __extends($jin2_view_div, _super);
    function $jin2_view_div() {
        _super.apply(this, arguments);
    }
    $jin2_view_div.prototype.get = function () { return this; };
    Object.defineProperty($jin2_view_div.prototype, "tagName", {
        get: function () {
            return new $jin2_prop({
                pull_: function () { return 'div'; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_div.prototype, "child", {
        get: function () {
            return new $jin2_prop({
                pull_: function () { return []; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_div.prototype, "attr", {
        get: function () {
            return new $jin2_prop({
                pull_: function () { return ({}); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_div.prototype, "field", {
        get: function () {
            return new $jin2_prop({
                pull_: function () { return ({}); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_div.prototype, "event", {
        get: function () {
            return new $jin2_prop({
                pull_: function () { return ({}); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_div.prototype, "node", {
        get: function () {
            var _this = this;
            return new $jin2_vary({
                pull_: function () {
                    var id = _this.objectPath;
                    var node = document.getElementById(id);
                    if (node)
                        return node;
                    node = document.createElement(_this.tagName.get());
                    node.id = id;
                    return node;
                },
                notify_: function (next) {
                    var router = (document.body === next) ? document : next;
                    var events = _this.event.get();
                    for (var name in events) {
                        var prop = events[name];
                        router.addEventListener(name, function (event) {
                            if (event.defaultPrevented)
                                return;
                            prop.set(event);
                            $jin2_atom.induce();
                        }, false);
                    }
                    _this.version.pull();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_div.prototype, "version", {
        get: function () {
            var _this = this;
            return new $jin2_atom({
                pull_: function (prev) {
                    var version = prev + 1 || 0;
                    var node = _this.node.get();
                    var proto1 = _this.objectOwner;
                    while (proto1 && (proto1 !== $jin2_view_div.prototype)) {
                        var className = $jin2_object_path(proto1.constructor);
                        if (!className)
                            continue;
                        node.setAttribute(className.replace(/\$/g, ''), _this.objectName);
                        proto1 = Object.getPrototypeOf(proto1);
                    }
                    var proto2 = _this;
                    while (proto2 && (proto2 !== $jin2_view_div.prototype)) {
                        var className = $jin2_object_path(proto2.constructor);
                        if (!className)
                            continue;
                        node.setAttribute(className.replace(/\$/g, ''), "");
                        proto2 = Object.getPrototypeOf(proto2);
                    }
                    var attrs = _this.attr.get();
                    for (var name in attrs) {
                        var p = node.getAttribute(name);
                        var n = String(attrs[name].get());
                        if (p !== n) {
                            node.setAttribute(name, n);
                        }
                    }
                    var childViews = [].concat.apply([], [].concat(_this.child.get()));
                    var childNodes = node.childNodes;
                    for (var i = 0; i < childViews.length; ++i) {
                        var nextNode = childNodes[i];
                        var view = childViews[i];
                        if (typeof view === 'object') {
                            if (view) {
                                var existsNode = view.node.get();
                                if (nextNode !== existsNode)
                                    node.insertBefore(existsNode, nextNode);
                            }
                        }
                        else {
                            if (nextNode && nextNode.nodeName === '#text') {
                                nextNode.nodeValue = String(view);
                            }
                            else {
                                var textNode = document.createTextNode(String(view));
                                node.insertBefore(textNode, nextNode);
                            }
                        }
                    }
                    while (nextNode = childNodes[i]) {
                        node.removeChild(nextNode);
                    }
                    var fields = _this.field.get();
                    for (var path in fields) {
                        var names = path.split('.');
                        var obj = node;
                        for (var i = 0; i < names.length - 1; ++i) {
                            obj = obj[names[i]];
                        }
                        obj[names[names.length - 1]] = fields[path].get();
                    }
                    return version;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "tagName", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "child", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "attr", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "field", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "event", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "node", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_div.prototype, "version", null);
    return $jin2_view_div;
})($jin2_object);
//view.js.map
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
var $jin2_demo_list_person = (function (_super) {
    __extends($jin2_demo_list_person, _super);
    function $jin2_demo_list_person() {
        _super.apply(this, arguments);
    }
    $jin2_demo_list_person.item = function (id) {
        return new this();
    };
    $jin2_demo_list_person.list = function (id) {
        var _this = this;
        return new $jin2_atom_list({
            pull_: function () { return []; },
            put_: function (next) {
                return next.map(function (data) {
                    if (data instanceof $jin2_demo_list_person)
                        return data;
                    if (typeof data === 'string')
                        return _this.item(String(data));
                    var person = _this.item(String(data.id));
                    for (var key in data) {
                        if (key === 'id')
                            continue;
                        person[key].set(data[key]);
                    }
                    return person;
                });
            }
        });
    };
    Object.defineProperty($jin2_demo_list_person.prototype, "id", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () { return _this.objectId; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_person.prototype, "firstName", {
        get: function () { return new $jin2_atom(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_person.prototype, "lastName", {
        get: function () { return new $jin2_atom(); },
        enumerable: true,
        configurable: true
    });
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person.prototype, "id", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person.prototype, "firstName", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person.prototype, "lastName", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person, "item", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person, "list", null);
    return $jin2_demo_list_person;
})($jin2_object);
//person.js.map
;
function $jin2_string_compare(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    return 0;
}
//compare.js.map
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
var $jin2_view_row = (function (_super) {
    __extends($jin2_view_row, _super);
    function $jin2_view_row() {
        _super.apply(this, arguments);
    }
    Object.defineProperty($jin2_view_row.prototype, "field", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () { return ({
                    'style.top': _this.offsetTopPX,
                    'style.height': _this.heightPX,
                }); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "offsetTop", {
        get: function () {
            return new $jin2_atom({
                pull_: function () { return 0; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "scrollTop", {
        get: function () {
            return new $jin2_prop({
                pull_: function (prev) { return 0; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "offsetTopView", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () {
                    var offset = Math.max(_this.offsetTop.get(), _this.scrollTop.get());
                    offset = Math.min(offset, _this.offsetBottom.get() - _this.height.get());
                    return offset;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "offsetTopPX", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () { return _this.offsetTopView.get() + 'px'; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "height", {
        get: function () {
            return new $jin2_prop({
                pull_: function () { return 0; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "heightPX", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () { return _this.height.get() + 'px'; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "offsetBottom", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () {
                    var childs = _this.rowsChild.get();
                    if (childs.length)
                        return childs[childs.length - 1].offsetBottom.get();
                    return _this.offsetTop.get() + _this.height.get();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_row.prototype, "rowsChild", {
        get: function () {
            return new $jin2_atom({
                pull_: function () { return []; }
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "field", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "offsetTop", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "scrollTop", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "offsetTopView", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "offsetTopPX", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "height", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "heightPX", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "offsetBottom", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_row.prototype, "rowsChild", null);
    return $jin2_view_row;
})($jin2_view_div);
//row.js.map
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
var $jin2_view_list = (function (_super) {
    __extends($jin2_view_list, _super);
    function $jin2_view_list() {
        _super.apply(this, arguments);
    }
    Object.defineProperty($jin2_view_list.prototype, "child", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function () { return _this.rowsReordered.get(); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_list.prototype, "rowsReordered", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function (prev) {
                    var rows = _this.rowsPositioned.get();
                    if (!prev)
                        return rows;
                    var next = [];
                    for (var _i = 0; _i < prev.length; _i++) {
                        var row = prev[_i];
                        if (rows.indexOf(row) === -1)
                            continue;
                        next.push(row);
                    }
                    for (var _a = 0; _a < rows.length; _a++) {
                        var row = rows[_a];
                        if (prev.indexOf(row) !== -1)
                            continue;
                        next.push(row);
                    }
                    return next;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_list.prototype, "rowsPositioned", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function (prev) {
                    var rows = _this.rows.get();
                    var offset = 0;
                    for (var _i = 0; _i < rows.length; _i++) {
                        var row = rows[_i];
                        row.offsetTop.set(offset);
                        offset += row.height.get();
                    }
                    return rows;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_list.prototype, "rows", {
        get: function () {
            return new $jin2_atom_list({
                pull_: function (prev) { return []; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_list.prototype, "scrollTop", {
        get: function () {
            return new $jin2_atom({
                pull_: function (prev) { return 0; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_list.prototype, "eventScroll", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                put_: function (next) {
                    _this.scrollTop.set(_this.node.get().scrollTop);
                    return null;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_view_list.prototype, "event", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () { return ({
                    scroll: _this.eventScroll
                }); }
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "child", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "rowsReordered", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "rowsPositioned", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "rows", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "scrollTop", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "eventScroll", null);
    __decorate([
        $jin2_lazy
    ], $jin2_view_list.prototype, "event", null);
    return $jin2_view_list;
})($jin2_view_div);
//list.js.map
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
var $jin2_demo_list_person_view_row = (function (_super) {
    __extends($jin2_demo_list_person_view_row, _super);
    function $jin2_demo_list_person_view_row() {
        _super.apply(this, arguments);
    }
    Object.defineProperty($jin2_demo_list_person_view_row.prototype, "person", {
        get: function () { return new $jin2_prop(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_person_view_row.prototype, "child", {
        get: function () {
            var _this = this;
            return new $jin2_prop({
                pull_: function () { return [_this.blockFirstName, _this.blockLastName]; }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_person_view_row.prototype, "blockFirstName", {
        get: function () {
            var _this = this;
            return new $jin2_view_div({
                child_: { get: function () { return _this.person.get().firstName.get(); } },
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_person_view_row.prototype, "blockLastName", {
        get: function () {
            var _this = this;
            return new $jin2_view_div({
                child_: { get: function () { return _this.person.get().lastName.get(); } },
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_row.prototype, "person", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_row.prototype, "child", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_row.prototype, "blockFirstName", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_row.prototype, "blockLastName", null);
    return $jin2_demo_list_person_view_row;
})($jin2_view_row);
//row.js.map
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
var $jin2_demo_list_person_view_list = (function (_super) {
    __extends($jin2_demo_list_person_view_list, _super);
    function $jin2_demo_list_person_view_list() {
        _super.apply(this, arguments);
    }
    Object.defineProperty($jin2_demo_list_person_view_list.prototype, "groups", {
        get: function () {
            return new $jin2_atom({
                pull_: function (prev) { return ({ '': [] }); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_person_view_list.prototype, "rows", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function (prev) {
                    var groups = _this.groups.get();
                    var next = [];
                    for (var _i = 0, _a = Object.keys(groups).sort(); _i < _a.length; _i++) {
                        var groupName = _a[_i];
                        var rowGroup = _this.rowGroup(groupName);
                        next.push(rowGroup);
                        next = next.concat(rowGroup.rowsChild.get());
                    }
                    return next;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    $jin2_demo_list_person_view_list.prototype.rowGroup = function (id) {
        return new $jin2_view_row({
            height_: { get: function () { return id ? 32 : 0; } },
            child_: { get: function () { return id; } },
            scrollTop_: this.scrollTop,
            rowsChild_: this.rowGroupChilds(id)
        });
    };
    $jin2_demo_list_person_view_list.prototype.rowGroupChilds = function (id) {
        var _this = this;
        return new $jin2_atom_list({
            pull_: function () {
                return _this.groups.get()[id].map(function (person) {
                    return _this.rowPerson(person.id.get());
                });
            }
        });
    };
    $jin2_demo_list_person_view_list.prototype.rowPerson = function (id) {
        return new $jin2_demo_list_person_view_row({
            height_: { get: function () { return 40; } },
            person_: { get: function () { return $jin2_demo_list_person.item(id); } }
        });
    };
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_list.prototype, "groups", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_list.prototype, "rows", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_list.prototype, "rowGroup", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_list.prototype, "rowGroupChilds", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_person_view_list.prototype, "rowPerson", null);
    return $jin2_demo_list_person_view_list;
})($jin2_view_list);
//list.js.map
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
var $jin2_demo_list_app = (function (_super) {
    __extends($jin2_demo_list_app, _super);
    function $jin2_demo_list_app() {
        _super.apply(this, arguments);
    }
    $jin2_demo_list_app.widget = function (id) {
        return new this();
    };
    Object.defineProperty($jin2_demo_list_app.prototype, "persons", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function (prev) { return $jin2_demo_list_person.list(_this.objectId).get(); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_app.prototype, "personsSorted", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function (prev) { return _this.persons.get().slice().sort(function (a, b) {
                    return $jin2_string_compare(a.lastName.get(), b.lastName.get())
                        || $jin2_string_compare(a.firstName.get(), b.firstName.get())
                        || $jin2_string_compare(a.id.get(), b.id.get());
                }); }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_app.prototype, "groupsSingle", {
        get: function () {
            var _this = this;
            return new $jin2_atom({
                pull_: function (prev) {
                    return { '': _this.personsSorted.get() };
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_app.prototype, "groupsByLetter", {
        get: function () {
            var _this = this;
            return new $jin2_atom({
                pull_: function (prev) {
                    var groups = {};
                    for (var _i = 0, _a = _this.persons.get(); _i < _a.length; _i++) {
                        var person = _a[_i];
                        var firstLetter = person.lastName.get().charAt(0).toUpperCase();
                        if (!groups[firstLetter])
                            groups[firstLetter] = [];
                        groups[firstLetter].push(person);
                    }
                    for (var groupName in groups) {
                        groups[groupName].sort(function (a, b) {
                            return $jin2_string_compare(a.firstName.get(), b.firstName.get())
                                || $jin2_string_compare(a.id.get(), b.id.get());
                        });
                    }
                    return groups;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_app.prototype, "child", {
        get: function () {
            var _this = this;
            return new $jin2_atom_list({
                pull_: function (prev) {
                    return [_this.widgetSingle, _this.widgetByLetter];
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_app.prototype, "widgetSingle", {
        get: function () {
            return new $jin2_demo_list_person_view_list({
                groups_: this.groupsSingle,
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty($jin2_demo_list_app.prototype, "widgetByLetter", {
        get: function () {
            return new $jin2_demo_list_person_view_list({
                groups_: this.groupsByLetter,
            });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "persons", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "personsSorted", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "groupsSingle", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "groupsByLetter", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "child", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "widgetSingle", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app.prototype, "widgetByLetter", null);
    __decorate([
        $jin2_lazy
    ], $jin2_demo_list_app, "widget", null);
    return $jin2_demo_list_app;
})($jin2_view_div);
//app.js.map
//# sourceMappingURL=index.env=web.stage=release.js.map