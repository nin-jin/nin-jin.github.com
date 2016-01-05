var $jin = this.$jin = {}

;
//# sourceMappingURL=dumb.js.map
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
//# sourceMappingURL=error.js.map
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
    function $jin2_object() {
        this._objectName = null;
        this._objectId = null;
        this._objectPath = null;
        this._objectOwner = null;
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
    $jin2_object.toString = function () {
        return this.objectPath;
    };
    $jin2_object.prototype.toString = function () {
        return this.objectPath;
    };
    Object.defineProperty($jin2_object.prototype, "objectName", {
        get: function () {
            return (this._objectName == null)
                ? (this._objectName = '')
                : this._objectName;
        },
        set: function (next) {
            if (this._objectName != null)
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
            return (this._objectId == null)
                ? (this._objectId = String($jin2_object.seed++))
                : this._objectId;
        },
        set: function (next) {
            if (this._objectId != null)
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
            return (this._objectPath == null)
                ? (this._objectPath = $jin2_object_path(this.objectOwner) + '.' + this.objectName + '_' + this.objectId)
                : this._objectPath;
        },
        set: function (next) {
            if (this._objectPath != null)
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
            return this.objectOwner = this.constructor;
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
    $jin2_object.prototype.objectEquals = function (other) {
        return this === other;
    };
    $jin2_object.seed = 0;
    return $jin2_object;
})();
//# sourceMappingURL=object.js.map
;
function $jin2_grab(prototype, name, descr) {
    var prefix = name + '_';
    var getValue = function (id) {
        if (id === void 0) { id = ''; }
        var field = prefix + id;
        if (this[field])
            return this[field];
        var obj = makeValue.call(this, id);
        obj.objectName = name;
        obj.objectId = id;
        obj.objectOwner = this;
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
//# sourceMappingURL=grab.js.map
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
        if (pull)
            this.pull_ = pull;
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
        return prev;
    };
    $jin2_prop.prototype.put_ = function (next, prev) {
        throw $jin2_error({ reason: 'Read only' });
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
})($jin2_object);
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
    function $jin2_atom(pull, put) {
        _super.call(this);
        this._ = void 0;
        this.error = $jin2_atom.obsolete;
        this.masters = null;
        this.mastersDeep = 0;
        this.slaves = null;
        if (pull)
            this.pull_ = pull;
        if (put)
            this.put_ = put;
    }
    $jin2_atom.prototype.wrap = function (get, set) {
        var _this = this;
        return new $jin2_prop(get ? (function () { return get(_this.get()); }) : function () { return _this.get(); }, set ? function (next, prev) { return _this.set(set(next)); } : function (next, prev) { return _this.set(next, prev); });
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
    $jin2_atom.prototype.touch = function () {
        var slave = $jin2_atom.stack[$jin2_atom.stack.length - 1];
        if (!slave)
            return;
        slave.obey(this);
        this.lead(slave);
    };
    $jin2_atom.prototype.get = function () {
        this.touch();
        if (this.error === $jin2_atom.obsolete)
            this.pull();
        if (this.error)
            throw this.error;
        return this._;
    };
    $jin2_atom.prototype.pull = function () {
        var _this = this;
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
        })($jin2_atom);
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
        })($jin2_atom);
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
        if (this._timer)
            return;
        this._timer = requestAnimationFrame(this.induce.bind(this));
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
            this._planReap.forEach(function (atom) {
                someReaped = atom.reap();
            });
            if (!someReaped)
                break;
        }
        clearTimeout(this._timer);
        this._timer = null;
    };
    $jin2_atom.wait = new Error('Wait...');
    $jin2_atom.obsolete = new Error('Obsolate state!');
    $jin2_atom.stack = $jin2_state_stack['$jin2_atom_stack'] = [];
    $jin2_atom._planPull = [];
    $jin2_atom._planReap = new Set;
    $jin2_atom._minUpdateDeep = 0;
    return $jin2_atom;
})($jin2_object);
var $jin2_atom_own = (function (_super) {
    __extends($jin2_atom_own, _super);
    function $jin2_atom_own() {
        _super.apply(this, arguments);
    }
    $jin2_atom_own.prototype.push = function (next) {
        var prev = this._;
        next = this.norm_(next, prev);
        this.error = null;
        if (next !== prev) {
            next.objectName = '';
            next.objectId = '';
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
window.addEventListener('error', function (event) {
    var stack = $jin2_atom.stack;
    $jin2_atom.stack = [];
    for (var _i = 0; _i < stack.length; _i++) {
        var atom = stack[_i];
        console.debug(atom.objectPath);
    }
    for (var _a = 0; _a < stack.length; _a++) {
        var atom = stack[_a];
        atom.fail(event['error']);
    }
    $jin2_atom.induce();
});
//# sourceMappingURL=atom.js.map
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
var $mol_block = (function (_super) {
    __extends($mol_block, _super);
    function $mol_block() {
        _super.call(this);
    }
    $mol_block.app = function (id) {
        var _this = this;
        return new $jin2_atom_own(function () { return new _this(); });
    };
    $mol_block.prototype.tagName = function () {
        return { get: function () { return 'div'; } };
    };
    $mol_block.prototype.nameSpace = function () {
        return { get: function () { return 'http://www.w3.org/1999/xhtml'; } };
    };
    $mol_block.prototype.child = function () {
        return { get: function () { return null; } };
    };
    $mol_block.prototype.attr = function () {
        return {};
    };
    $mol_block.prototype.field = function () {
        return {};
    };
    $mol_block.prototype.event = function () {
        return {};
    };
    $mol_block.prototype.node = function () {
        var _this = this;
        return new $jin2_vary(function () {
            var id = _this.objectPath;
            var prev = document.getElementById(id);
            if (!prev) {
                prev = document.createElementNS(_this.nameSpace().get(), _this.tagName().get());
                prev.setAttribute('id', id);
            }
            var router = prev;
            var events = _this.event();
            for (var name in events)
                (function (name) {
                    var prop = events[name];
                    router.addEventListener(name, function (event) {
                        prop.set(event);
                    }, false);
                })(name);
            var proto1 = _this.objectOwner.objectOwner;
            while (proto1 && (proto1.constructor !== $mol_block) && (proto1.constructor !== Function)) {
                var className = $jin2_object_path(proto1.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, '') + '_' + _this.objectOwner.objectName, '');
                proto1 = Object.getPrototypeOf(proto1);
            }
            var proto2 = _this;
            while (proto2 && (proto2.constructor !== $mol_block)) {
                var className = $jin2_object_path(proto2.constructor);
                if (!className)
                    continue;
                prev.setAttribute(className.replace(/\$/g, ''), "");
                proto2 = Object.getPrototypeOf(proto2);
            }
            var onAttach = function (event) {
                prev.removeEventListener('DOMNodeInserted', onAttach);
                _this.version().pull();
            };
            if (prev.parentNode) {
                setTimeout(onAttach);
            }
            else {
                prev.addEventListener('DOMNodeInserted', onAttach);
            }
            return prev;
        });
    };
    $mol_block.prototype.version = function () {
        var _this = this;
        var prop = new $jin2_atom(function () {
            var prev = _this.node().get();
            var attrs = _this.attr();
            for (var name in attrs) {
                var p = prev.getAttribute(name);
                var n = String(attrs[name].get());
                if (p !== n) {
                    prev.setAttribute(name, n);
                }
            }
            var childs = _this.child().get();
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
            var fields = _this.field();
            for (var path in fields) {
                var names = path.split('.');
                var obj = prev;
                for (var i = 0; i < names.length - 1; ++i) {
                    if (names[i])
                        obj = obj[names[i]];
                }
                obj[names[names.length - 1]] = fields[path].get();
            }
            prev.removeAttribute('mol_error');
            return prev;
        });
        prop.fail_ = function (error) {
            var node = _this.node().get();
            if (error === $jin2_atom.wait) {
                node.setAttribute('mol_error', 'wait');
            }
            else {
                node.setAttribute('mol_error', 'fail');
            }
            return node;
        };
        return prop;
    };
    __decorate([
        $jin2_grab
    ], $mol_block.prototype, "node", null);
    __decorate([
        $jin2_grab
    ], $mol_block.prototype, "version", null);
    __decorate([
        $jin2_grab
    ], $mol_block, "app", null);
    return $mol_block;
})($jin2_object);
function $mol_replace(Class) {
    $mol[Class.name] = Class;
    return Class;
}
//# sourceMappingURL=block.js.map
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
        return new $jin2_atom(function () { return localStorage.getItem(key) || null; }, function (next) {
            if (next == null) {
                localStorage.removeItem(key);
                return null;
            }
            else {
                var value = String(next);
                localStorage.setItem(key, value);
                return value;
            }
        });
    };
    __decorate([
        $jin2_grab
    ], $jin2_state_local, "item", null);
    return $jin2_state_local;
})();
window.addEventListener('storage', function (event) { return $jin2_state_local.item(event.key).update(); });
//# sourceMappingURL=local.env=web.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $mol;
(function ($mol) {
    var $mol_scroller = (function (_super) {
        __extends($mol_scroller, _super);
        function $mol_scroller() {
            _super.apply(this, arguments);
        }
        $mol_scroller.prototype.eventScroll = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_scroller.prototype.scrollTop = function () { return { get: function () { return (0); }, set: function (next) { return null; } }; };
        $mol_scroller.prototype.shadow = function () { return { get: function () { return ("none"); }, set: function (next) { return null; } }; };
        $mol_scroller.prototype.content = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_scroller.prototype.child = function () {
            var _this = this;
            return { get: function () { return [_this.content().get(), ""]; }, set: function (next) { return null; } };
        };
        $mol_scroller.prototype.field = function () {
            return {
                "scrollTop": this.scrollTop(),
                "style.boxShadow": this.shadow(),
            };
        };
        $mol_scroller.prototype.event = function () {
            return {
                "scroll": this.eventScroll(),
            };
        };
        return $mol_scroller;
    })($mol_block);
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
        return $jin2_state_local.item(this.objectPath + '.scrollTop_').wrap(function (prev) { return Number(prev) || 0; });
    };
    $mol_scroller.prototype.scrollHeight = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.node().get().scrollHeight; });
    };
    $mol_scroller.prototype.offsetHeight = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.node().get().offsetHeight; });
    };
    $mol_scroller.prototype.eventScroll = function () {
        var _this = this;
        return new $jin2_prop(null, function (event) {
            _this.scrollTop().set(event.target.scrollTop);
            _this.scrollHeight().set(event.target.scrollHeight);
            _this.offsetHeight().set(event.target.offsetHeight);
        });
    };
    $mol_scroller.prototype.shadow = function () {
        var _this = this;
        return new $jin2_prop(function () {
            var top = _this.scrollTop().get();
            var bottom = _this.scrollHeight().get() - top - _this.offsetHeight().get();
            if (top > 0) {
                if (bottom > 0) {
                    return 'inset 0 4px 8px -4px , inset 0 -4px 8px -4px';
                }
                else {
                    return 'inset 0 4px 8px -4px';
                }
            }
            else if (bottom > 0) {
                return 'inset 0 -4px 8px -4px';
            }
            return '';
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollTop", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "scrollHeight", null);
    __decorate([
        $jin2_grab
    ], $mol_scroller.prototype, "offsetHeight", null);
    $mol_scroller = __decorate([
        $mol_replace
    ], $mol_scroller);
    return $mol_scroller;
})($mol.$mol_scroller);
//# sourceMappingURL=scroller.view.js.map
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $mol;
(function ($mol) {
    var $mol_button = (function (_super) {
        __extends($mol_button, _super);
        function $mol_button() {
            _super.apply(this, arguments);
        }
        $mol_button.prototype.eventClick = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_button.prototype.event = function () {
            return {
                "click": this.eventClick(),
            };
        };
        return $mol_button;
    })($mol_block);
    $mol.$mol_button = $mol_button;
})($mol || ($mol = {}));
//# sourceMappingURL=button.view.tree.js.map
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
    var $mol_demo = (function (_super) {
        __extends($mol_demo, _super);
        function $mol_demo() {
            _super.apply(this, arguments);
        }
        return $mol_demo;
    })($mol.$mol_scroller);
    $mol.$mol_demo = $mol_demo;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_demo_screen = (function (_super) {
        __extends($mol_demo_screen, _super);
        function $mol_demo_screen() {
            _super.apply(this, arguments);
        }
        $mol_demo_screen.prototype.expanded = function () { return { get: function () { return (false); }, set: function (next) { return null; } }; };
        $mol_demo_screen.prototype.content = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_demo_screen.prototype.contenter = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.content(); };
                return view;
            });
        };
        $mol_demo_screen.prototype.title = function () { return { get: function () { return (""); }, set: function (next) { return null; } }; };
        $mol_demo_screen.prototype.eventExpanding = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_demo_screen.prototype.titler = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_button;
                view.child = function () { return _this.title(); };
                view.eventClick = function () { return _this.eventExpanding(); };
                return view;
            });
        };
        $mol_demo_screen.prototype.child = function () {
            var _this = this;
            return { get: function () { return [_this.contenter().get(), "", _this.titler().get(), ""]; }, set: function (next) { return null; } };
        };
        $mol_demo_screen.prototype.attr = function () {
            return {
                "mol_demo_screen_expanded": this.expanded(),
            };
        };
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "contenter", null);
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "titler", null);
        return $mol_demo_screen;
    })($mol_block);
    $mol.$mol_demo_screen = $mol_demo_screen;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_demo_lorem = (function (_super) {
        __extends($mol_demo_lorem, _super);
        function $mol_demo_lorem() {
            _super.apply(this, arguments);
        }
        $mol_demo_lorem.prototype.child = function () { return { get: function () { return (["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.", "Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.", "Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non. Curabitur lobortis nisl a enim congue semper. Aenean commodo ultrices imperdiet. Vestibulum ut justo vel sapien venenatis tincidunt. Phasellus eget dolor sit amet ipsum dapibus condimentum vitae quis lectus. Aliquam ut massa in turpis dapibus convallis. Praesent elit lacus, vestibulum at malesuada et, ornare et est. Ut augue nunc, sodales ut euismod non, adipiscing vitae orci. Mauris ut placerat justo. Mauris in ultricies enim. Quisque nec est eleifend nulla ultrices egestas quis ut quam. Donec sollicitudin lectus a mauris pulvinar id aliquam urna cursus. Cras quis ligula sem, vel elementum mi. Phasellus non ullamcorper urna.", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In euismod ultrices facilisis. Vestibulum porta sapien adipiscing augue congue id pretium lectus molestie. Proin quis dictum nisl. Morbi id quam sapien, sed vestibulum sem. Duis elementum rutrum mauris sed convallis. Proin vestibulum magna mi. Aenean tristique hendrerit magna, ac facilisis nulla hendrerit ut. Sed non tortor sodales quam auctor elementum. Donec hendrerit nunc eget elit pharetra pulvinar. Suspendisse id tempus tortor. Aenean luctus, elit commodo laoreet commodo, justo nisi consequat massa, sed vulputate quam urna quis eros. Donec vel."]); }, set: function (next) { return null; } }; };
        return $mol_demo_lorem;
    })($mol_block);
    $mol.$mol_demo_lorem = $mol_demo_lorem;
})($mol || ($mol = {}));
//# sourceMappingURL=demo.view.tree.js.map
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
var $mol_demo_screen = (function (_super) {
    __extends($mol_demo_screen, _super);
    function $mol_demo_screen() {
        _super.apply(this, arguments);
    }
    $mol_demo_screen.prototype.title = function () {
        var _this = this;
        return new $jin2_prop(function () { return _this.objectOwner.objectName; });
    };
    $mol_demo_screen.prototype.expanded = function () {
        return $jin2_state_local.item(this.objectPath + '.expanded_').wrap(function (prev) { return prev === 'true'; });
    };
    $mol_demo_screen.prototype.eventExpanding = function () {
        var _this = this;
        return new $jin2_prop(function () { return null; }, function (event) {
            _this.expanded().set(!_this.expanded().get());
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_demo_screen.prototype, "expanded", null);
    $mol_demo_screen = __decorate([
        $mol_replace
    ], $mol_demo_screen);
    return $mol_demo_screen;
})($mol.$mol_demo_screen);
//# sourceMappingURL=demo.view.js.map
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
    var $mol_panel = (function (_super) {
        __extends($mol_panel, _super);
        function $mol_panel() {
            _super.apply(this, arguments);
        }
        $mol_panel.prototype.head = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_panel.prototype.header = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.content = function () { return _this.head(); };
                return view;
            });
        };
        $mol_panel.prototype.body = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_panel.prototype.bodier = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.content = function () { return _this.body(); };
                return view;
            });
        };
        $mol_panel.prototype.foot = function () { return { get: function () { return (null); }, set: function (next) { return null; } }; };
        $mol_panel.prototype.footer = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.content = function () { return _this.foot(); };
                return view;
            });
        };
        $mol_panel.prototype.child = function () {
            var _this = this;
            return { get: function () { return [_this.header().get(), "", _this.bodier().get(), "", _this.footer().get(), ""]; }, set: function (next) { return null; } };
        };
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "header", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "bodier", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "footer", null);
        return $mol_panel;
    })($mol_block);
    $mol.$mol_panel = $mol_panel;
})($mol || ($mol = {}));
//# sourceMappingURL=panel.view.tree.js.map
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
    var $mol_panel_demo = (function (_super) {
        __extends($mol_panel_demo, _super);
        function $mol_panel_demo() {
            _super.apply(this, arguments);
        }
        $mol_panel_demo.prototype.lightingHead = function () { return { get: function () { return [" < head"]; }, set: function (next) { return null; } }; };
        $mol_panel_demo.prototype.lightingBody = function () { return { get: function () { return [" < body"]; }, set: function (next) { return null; } }; };
        $mol_panel_demo.prototype.lightingFoot = function () { return { get: function () { return [" < foot"]; }, set: function (next) { return null; } }; };
        $mol_panel_demo.prototype.lightingContent = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_panel;
                view.head = function () { return _this.lightingHead(); };
                view.body = function () { return _this.lightingBody(); };
                view.foot = function () { return _this.lightingFoot(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.lighting = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_screen;
                view.content = function () { return _this.lightingContent(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.genericHead = function () { return { get: function () { return [" < head"]; }, set: function (next) { return null; } }; };
        $mol_panel_demo.prototype.genericBody = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_lorem;
                return view;
            });
        };
        $mol_panel_demo.prototype.genericFoot = function () { return { get: function () { return [" < foot"]; }, set: function (next) { return null; } }; };
        $mol_panel_demo.prototype.genericContent = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_panel;
                view.head = function () { return _this.genericHead(); };
                view.body = function () { return _this.genericBody(); };
                view.foot = function () { return _this.genericFoot(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.generic = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_screen;
                view.content = function () { return _this.genericContent(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.bloatingHead = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_lorem;
                return view;
            });
        };
        $mol_panel_demo.prototype.bloatingBody = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_lorem;
                return view;
            });
        };
        $mol_panel_demo.prototype.bloatingFoot = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_lorem;
                return view;
            });
        };
        $mol_panel_demo.prototype.bloatingContent = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_panel;
                view.head = function () { return _this.bloatingHead(); };
                view.body = function () { return _this.bloatingBody(); };
                view.foot = function () { return _this.bloatingFoot(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.bloating = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_screen;
                view.content = function () { return _this.bloatingContent(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.headingHead = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_lorem;
                return view;
            });
        };
        $mol_panel_demo.prototype.headingBody = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_lorem;
                return view;
            });
        };
        $mol_panel_demo.prototype.headingContent = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_panel;
                view.head = function () { return _this.headingHead(); };
                view.body = function () { return _this.headingBody(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.heading = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_demo_screen;
                view.content = function () { return _this.headingContent(); };
                return view;
            });
        };
        $mol_panel_demo.prototype.child = function () {
            var _this = this;
            return { get: function () { return [_this.lighting().get(), "", _this.generic().get(), "", _this.bloating().get(), "", _this.heading().get(), ""]; }, set: function (next) { return null; } };
        };
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "lightingContent", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "lighting", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "genericBody", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "genericContent", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "generic", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "bloatingHead", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "bloatingBody", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "bloatingFoot", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "bloatingContent", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "bloating", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "headingHead", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "headingBody", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "headingContent", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo.prototype, "heading", null);
        return $mol_panel_demo;
    })($mol.$mol_demo);
    $mol.$mol_panel_demo = $mol_panel_demo;
})($mol || ($mol = {}));
//# sourceMappingURL=panel.stage=test.view.tree.js.map
//index.env=web.stage=test.js.map