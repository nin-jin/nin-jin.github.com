var $jin = this.$jin = {}

;
//# sourceMappingURL=dumb.js.map
;
function $jin_type(value) {
    var str = {}.toString.apply(value);
    var type = str.substring(8, str.length - 1);
    if (['Window', 'global'].indexOf(type) >= 0)
        type = 'Global';
    return type;
}
//# sourceMappingURL=type.js.map
;
var $jin_tree2 = (function () {
    function $jin_tree2(config) {
        this.type = config.type || '';
        if (config.value) {
            var childs = $jin_tree2.values(config.value);
            if (config.type || childs.length > 1) {
                this.childs = childs.concat(config.childs || []);
                this.data = config.data || '';
            }
            else {
                this.data = childs[0].data;
                this.childs = config.childs || [];
            }
        }
        else {
            this.data = config.data || '';
            this.childs = config.childs || [];
        }
        this.baseUri = config.baseUri || '';
        this.row = config.row || 0;
        this.col = config.col || 0;
    }
    $jin_tree2.values = function (str, baseUri) {
        return str.split('\n').map(function (data, index) { return new $jin_tree2({
            data: data,
            baseUri: baseUri,
            row: index + 1
        }); });
    };
    $jin_tree2.prototype.clone = function (config) {
        return new $jin_tree2({
            type: ('type' in config) ? config.type : this.type,
            data: ('data' in config) ? config.data : this.data,
            childs: ('childs' in config) ? config.childs : this.childs,
            baseUri: ('baseUri' in config) ? config.baseUri : this.baseUri,
            row: ('row' in config) ? config.row : this.row,
            col: ('col' in config) ? config.col : this.col,
            value: config.value
        });
    };
    $jin_tree2.fromString = function (str, baseUri) {
        var root = new $jin_tree2({ baseUri: baseUri });
        var stack = [root];
        var row = 0;
        var lines = String(str).split(/\n/);
        lines.forEach(function (line) {
            ++row;
            var chunks = /^(\t*)((?:[^\n\t= ]+ *)*)(=[^\n]*)?/.exec(line);
            if (!chunks)
                throw $jin2_error({
                    reason: 'Syntax error',
                    row: row,
                    source: line
                });
            var indent = chunks[1];
            var path = chunks[2];
            var data = chunks[3];
            var deep = indent.length;
            var types = path ? path.split(/ +/) : [];
            if (stack.length < deep)
                throw $jin2_error({
                    reason: 'Too more tabs',
                    row: row,
                    source: line
                });
            stack.length = deep + 1;
            var parent = stack[deep];
            types.forEach(function (type) {
                if (!type)
                    return;
                var next = new $jin_tree2({
                    type: type,
                    baseUri: baseUri,
                    row: row
                });
                parent.childs.push(next);
                parent = next;
            });
            if (data) {
                var next = new $jin_tree2({
                    data: data.substring(1),
                    baseUri: baseUri,
                    row: row
                });
                parent.childs.push(next);
                parent = next;
            }
            stack.push(parent);
        });
        return root;
    };
    $jin_tree2.fromJSON = function (json, baseUri) {
        if (baseUri === void 0) { baseUri = ''; }
        var type = $jin_type(json);
        switch (type) {
            case 'Boolean':
            case 'Null':
            case 'Number':
                return new $jin_tree2({
                    type: String(json),
                    baseUri: baseUri
                });
            case 'String':
                return new $jin_tree2({
                    value: json,
                    baseUri: baseUri
                });
            case 'Array':
                return new $jin_tree2({
                    type: "list",
                    childs: json.map(function (json) { return $jin_tree2.fromJSON(json, baseUri); })
                });
            case 'Date':
                return new $jin_tree2({
                    type: "time",
                    value: json.toISOString(),
                    baseUri: baseUri
                });
            case 'Object':
                var childs = [];
                for (var key in json) {
                    if (json[key] === undefined)
                        continue;
                    if (/^[^\n\t= ]+$/.test(key)) {
                        var child = new $jin_tree2({
                            type: key,
                            baseUri: baseUri
                        });
                    }
                    else {
                        var child = new $jin_tree2({
                            value: key,
                            baseUri: baseUri
                        });
                    }
                    child.childs.push(new $jin_tree2({
                        type: ":",
                        childs: [$jin_tree2.fromJSON(json[key], baseUri)],
                        baseUri: baseUri
                    }));
                    childs.push(child);
                }
                return new $jin_tree2({
                    type: "dict",
                    childs: childs,
                    baseUri: baseUri
                });
            default:
                throw $jin2_error({
                    reason: 'Unsupported type',
                    type: type,
                    uri: baseUri
                });
        }
    };
    Object.defineProperty($jin_tree2.prototype, "uri", {
        get: function () {
            return this.baseUri + '#' + this.row + ':' + this.col;
        },
        enumerable: true,
        configurable: true
    });
    $jin_tree2.prototype.toString = function (prefix) {
        if (prefix === void 0) { prefix = ''; }
        var output = '';
        if (this.type.length) {
            if (!prefix.length) {
                prefix = "\t";
            }
            output += this.type + " ";
            if (this.childs.length == 1) {
                return output + this.childs[0].toString(prefix);
            }
            output += "\n";
        }
        else if (this.data.length || prefix.length) {
            output += "=" + this.data + "\n";
        }
        for (var _i = 0, _a = this.childs; _i < _a.length; _i++) {
            var child = _a[_i];
            output += prefix;
            output += child.toString(prefix + "\t");
        }
        return output;
    };
    $jin_tree2.prototype.toJSON = function () {
        if (!this.type)
            return this.value;
        if (this.type === '//')
            return undefined;
        if (this.type === 'true')
            return true;
        if (this.type === 'false')
            return false;
        if (this.type === 'null')
            return null;
        if (this.type === 'dict') {
            var obj = {};
            for (var _i = 0, _a = this.childs; _i < _a.length; _i++) {
                var child = _a[_i];
                var key = child.type || child.value;
                if (key === '//')
                    continue;
                var colon = child.select([':']).childs[0];
                if (!colon)
                    throw $jin2_error({
                        reason: 'Syntax error',
                        required: 'Colon after key',
                        uri: child.uri
                    });
                var val = colon.childs[0].toJSON();
                if (val !== undefined)
                    obj[key] = val;
            }
            return obj;
        }
        if (this.type === 'list') {
            var res = [];
            this.childs.forEach(function (child) {
                var val = child.toJSON();
                if (val !== undefined)
                    res.push(val);
            });
            return res;
        }
        if (this.type === 'time') {
            return new Date(this.value);
        }
        if (String(Number(this.type)) == this.type.trim())
            return Number(this.type);
        throw $jin2_error({
            reason: 'Unknown type',
            type: this.type,
            uri: this.uri,
        });
    };
    Object.defineProperty($jin_tree2.prototype, "value", {
        get: function () {
            var values = [];
            for (var _i = 0, _a = this.childs; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.type)
                    continue;
                values.push(child.value);
            }
            return this.data + values.join("\n");
        },
        enumerable: true,
        configurable: true
    });
    $jin_tree2.prototype.select = function (path) {
        if (typeof path === 'string')
            path = path.split(/ +/);
        var next = [this];
        for (var _i = 0; _i < path.length; _i++) {
            var type = path[_i];
            if (!next.length)
                break;
            var prev = next;
            next = [];
            for (var _a = 0; _a < prev.length; _a++) {
                var item = prev[_a];
                for (var _b = 0, _c = item.childs; _b < _c.length; _b++) {
                    var child = _c[_b];
                    if (child.type == type) {
                        next.push(child);
                    }
                }
            }
        }
        return new $jin_tree2({ childs: next });
    };
    $jin_tree2.prototype.filter = function (path, value) {
        if (typeof path === 'string')
            path = path.split(/ +/);
        var childs = this.childs.filter(function (item) {
            var found = item.select(path);
            if (value == null) {
                return Boolean(found.childs.length);
            }
            else {
                return found.childs.some(function (child) { return child.value == value; });
            }
        });
        return new $jin_tree2({ childs: childs });
    };
    return $jin_tree2;
})();
//# sourceMappingURL=tree.js.map
;
function $jin2_error(info) {
    var error = new Error(info.reason);
    Object.defineProperty(error, 'message', {
        get: function () {
            return $jin_tree2.fromJSON(this.info).toString();
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
        this._timer = setTimeout(this.induce.bind(this));
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
        return new $jin2_atom(function () { return null; });
    };
    $mol_block.prototype.childNodes = function () {
        return this.child();
    };
    $mol_block.prototype.attr = function () {
        var attr = {};
        for (var key in this) {
            if (key.substring(0, 5) !== 'attr_')
                continue;
            attr[key.substring(5)] = this[key]();
        }
        return attr;
    };
    $mol_block.prototype.field = function () {
        var field = {};
        for (var key in this) {
            if (key.substring(0, 6) !== 'field_')
                continue;
            field[key.substring(6)] = this[key]();
        }
        return field;
    };
    $mol_block.prototype.event = function () {
        var event = {};
        for (var key in this) {
            if (key.substring(0, 6) !== 'event_')
                continue;
            event[key.substring(6)] = this[key]();
        }
        return event;
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
                        requestAnimationFrame($jin2_atom.induce.bind($jin2_atom));
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
                var names = path.split('_');
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
    window[Class.name] = Class;
    return Class;
}
//# sourceMappingURL=block.js.map
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
    var $mol_clicker = (function (_super) {
        __extends($mol_clicker, _super);
        function $mol_clicker() {
            _super.apply(this, arguments);
        }
        $mol_clicker.prototype.clicks = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_clicker.prototype.event_click = function () { return this.clicks(); };
        __decorate([
            $jin2_grab
        ], $mol_clicker.prototype, "clicks", null);
        $mol_clicker = __decorate([
            $mol_replace
        ], $mol_clicker);
        return $mol_clicker;
    })($mol_block);
    $mol.$mol_clicker = $mol_clicker;
})($mol || ($mol = {}));
//# sourceMappingURL=clicker.view.tree.js.map
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
    var $mol_clicker_demo_base = (function (_super) {
        __extends($mol_clicker_demo_base, _super);
        function $mol_clicker_demo_base() {
            _super.apply(this, arguments);
        }
        $mol_clicker_demo_base.prototype.child = function () { return new $jin2_atom(function () { return ["I am button!"]; }); };
        __decorate([
            $jin2_grab
        ], $mol_clicker_demo_base.prototype, "child", null);
        $mol_clicker_demo_base = __decorate([
            $mol_replace
        ], $mol_clicker_demo_base);
        return $mol_clicker_demo_base;
    })($mol.$mol_clicker);
    $mol.$mol_clicker_demo_base = $mol_clicker_demo_base;
})($mol || ($mol = {}));
//# sourceMappingURL=clicker.stage=test.view.tree.js.map
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
    var $mol_checker = (function (_super) {
        __extends($mol_checker, _super);
        function $mol_checker() {
            _super.apply(this, arguments);
        }
        $mol_checker.prototype.checked = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_checker.prototype.attr_mol_checker_checked = function () { return this.checked(); };
        __decorate([
            $jin2_grab
        ], $mol_checker.prototype, "checked", null);
        $mol_checker = __decorate([
            $mol_replace
        ], $mol_checker);
        return $mol_checker;
    })($mol.$mol_clicker);
    $mol.$mol_checker = $mol_checker;
})($mol || ($mol = {}));
//# sourceMappingURL=checker.view.tree.js.map
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
var $mol_checker = (function (_super) {
    __extends($mol_checker, _super);
    function $mol_checker() {
        _super.apply(this, arguments);
    }
    $mol_checker.prototype.clicks = function () {
        var _this = this;
        return new $jin2_atom(function () { return null; }, function (next) {
            _this.checked().set(!_this.checked().get());
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_checker.prototype, "clicks", null);
    $mol_checker = __decorate([
        $mol_replace
    ], $mol_checker);
    return $mol_checker;
})($mol.$mol_checker);
//# sourceMappingURL=checker.view.js.map
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
    var $mol_checker_demo_all = (function (_super) {
        __extends($mol_checker_demo_all, _super);
        function $mol_checker_demo_all() {
            _super.apply(this, arguments);
        }
        $mol_checker_demo_all.prototype.title = function () { return new $jin2_atom(function () { return ("I am checkbox"); }); };
        $mol_checker_demo_all.prototype.checked = function () { return new $jin2_atom(function () { return (true); }); };
        $mol_checker_demo_all.prototype.one = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_checker;
                return view;
            });
        };
        $mol_checker_demo_all.prototype.two = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_checker;
                view.checked = function () { return _this.checked(); };
                return view;
            });
        };
        $mol_checker_demo_all.prototype.three = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_checker;
                view.child = function () { return _this.title(); };
                return view;
            });
        };
        $mol_checker_demo_all.prototype.four = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_checker;
                view.child = function () { return _this.title(); };
                view.checked = function () { return _this.checked(); };
                return view;
            });
        };
        $mol_checker_demo_all.prototype.child = function () {
            var _this = this;
            return new $jin2_atom(function () { return [_this.one().get(), _this.two().get(), _this.three().get(), _this.four().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "title", null);
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "checked", null);
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "one", null);
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "two", null);
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "three", null);
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "four", null);
        __decorate([
            $jin2_grab
        ], $mol_checker_demo_all.prototype, "child", null);
        $mol_checker_demo_all = __decorate([
            $mol_replace
        ], $mol_checker_demo_all);
        return $mol_checker_demo_all;
    })($mol_block);
    $mol.$mol_checker_demo_all = $mol_checker_demo_all;
})($mol || ($mol = {}));
//# sourceMappingURL=checker.stage=test.view.tree.js.map
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
            }
            else {
                var value = String(next);
                localStorage.setItem(key, value);
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $mol;
(function ($mol) {
    var $mol_filler = (function (_super) {
        __extends($mol_filler, _super);
        function $mol_filler() {
            _super.apply(this, arguments);
        }
        $mol_filler.prototype.child = function () { return new $jin2_atom(function () { return (["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.", "Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.", "Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non. Curabitur lobortis nisl a enim congue semper. Aenean commodo ultrices imperdiet. Vestibulum ut justo vel sapien venenatis tincidunt. Phasellus eget dolor sit amet ipsum dapibus condimentum vitae quis lectus. Aliquam ut massa in turpis dapibus convallis. Praesent elit lacus, vestibulum at malesuada et, ornare et est. Ut augue nunc, sodales ut euismod non, adipiscing vitae orci. Mauris ut placerat justo. Mauris in ultricies enim. Quisque nec est eleifend nulla ultrices egestas quis ut quam. Donec sollicitudin lectus a mauris pulvinar id aliquam urna cursus. Cras quis ligula sem, vel elementum mi. Phasellus non ullamcorper urna.", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In euismod ultrices facilisis. Vestibulum porta sapien adipiscing augue congue id pretium lectus molestie. Proin quis dictum nisl. Morbi id quam sapien, sed vestibulum sem. Duis elementum rutrum mauris sed convallis. Proin vestibulum magna mi. Aenean tristique hendrerit magna, ac facilisis nulla hendrerit ut. Sed non tortor sodales quam auctor elementum. Donec hendrerit nunc eget elit pharetra pulvinar. Suspendisse id tempus tortor. Aenean luctus, elit commodo laoreet commodo, justo nisi consequat massa, sed vulputate quam urna quis eros. Donec vel.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.", "Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio. Maecenas convallis ullamcorper ultricies. Curabitur ornare, ligula semper consectetur sagittis, nisi diam iaculis velit, id fringilla sem nunc vel mi. Nam dictum, odio nec pretium volutpat, arcu ante placerat erat, non tristique elit urna et turpis. Quisque mi metus, ornare sit amet fermentum et, tincidunt et orci. Fusce eget orci a orci congue vestibulum. Ut dolor diam, elementum et vestibulum eu, porttitor vel elit. Curabitur venenatis pulvinar tellus gravida ornare. Sed et erat faucibus nunc euismod ultricies ut id justo. Nullam cursus suscipit nisi, et ultrices justo sodales nec. Fusce venenatis facilisis lectus ac semper. Aliquam at massa ipsum. Quisque bibendum purus convallis nulla ultrices ultricies. Nullam aliquam, mi eu aliquam tincidunt, purus velit laoreet tortor, viverra pretium nisi quam vitae mi. Fusce vel volutpat elit. Nam sagittis nisi dui.", "Suspendisse lectus leo, consectetur in tempor sit amet, placerat quis neque. Etiam luctus porttitor lorem, sed suscipit est rutrum non. Curabitur lobortis nisl a enim congue semper. Aenean commodo ultrices imperdiet. Vestibulum ut justo vel sapien venenatis tincidunt. Phasellus eget dolor sit amet ipsum dapibus condimentum vitae quis lectus. Aliquam ut massa in turpis dapibus convallis. Praesent elit lacus, vestibulum at malesuada et, ornare et est. Ut augue nunc, sodales ut euismod non, adipiscing vitae orci. Mauris ut placerat justo. Mauris in ultricies enim. Quisque nec est eleifend nulla ultrices egestas quis ut quam. Donec sollicitudin lectus a mauris pulvinar id aliquam urna cursus. Cras quis ligula sem, vel elementum mi. Phasellus non ullamcorper urna.", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In euismod ultrices facilisis. Vestibulum porta sapien adipiscing augue congue id pretium lectus molestie. Proin quis dictum nisl. Morbi id quam sapien, sed vestibulum sem. Duis elementum rutrum mauris sed convallis. Proin vestibulum magna mi. Aenean tristique hendrerit magna, ac facilisis nulla hendrerit ut. Sed non tortor sodales quam auctor elementum. Donec hendrerit nunc eget elit pharetra pulvinar. Suspendisse id tempus tortor. Aenean luctus, elit commodo laoreet commodo, justo nisi consequat massa, sed vulputate quam urna quis eros. Donec vel."]); }); };
        __decorate([
            $jin2_grab
        ], $mol_filler.prototype, "child", null);
        $mol_filler = __decorate([
            $mol_replace
        ], $mol_filler);
        return $mol_filler;
    })($mol_block);
    $mol.$mol_filler = $mol_filler;
})($mol || ($mol = {}));
//# sourceMappingURL=filler.view.tree.js.map
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
        $mol_scroller.prototype.overflowTop = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowTop = function () { return this.overflowTop(); };
        $mol_scroller.prototype.overflowBottom = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowBottom = function () { return this.overflowBottom(); };
        $mol_scroller.prototype.overflowLeft = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowLeft = function () { return this.overflowLeft(); };
        $mol_scroller.prototype.overflowRight = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_scroller.prototype.attr_mol_scroller_overflowRight = function () { return this.overflowRight(); };
        $mol_scroller.prototype.scrolls = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_scroller.prototype.event_scroll = function () { return this.scrolls(); };
        $mol_scroller.prototype.scrollTop = function () { return new $jin2_atom(function () { return (0); }); };
        $mol_scroller.prototype.field_scrollTop = function () { return this.scrollTop(); };
        $mol_scroller.prototype.scrollLeft = function () { return new $jin2_atom(function () { return (0); }); };
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
        var state = $jin2_state_local.item(this.objectPath + '.scrollTop_');
        return new $jin2_atom(function () { return Number(state.get()) || 0; }, function (next) { return (state.set(next), next); });
    };
    $mol_scroller.prototype.scrollLeft = function () {
        var state = $jin2_state_local.item(this.objectPath + '.scrollLeft_');
        return new $jin2_atom(function () { return Number(state.get()) || 0; }, function (next) { return (state.set(next), next); });
    };
    $mol_scroller.prototype.scrollHeight = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.node().get().scrollHeight; });
    };
    $mol_scroller.prototype.scrollWidth = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.node().get().scrollWidth; });
    };
    $mol_scroller.prototype.offsetHeight = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.node().get().offsetHeight; });
    };
    $mol_scroller.prototype.offsetWidth = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.node().get().offsetWidth; });
    };
    $mol_scroller.prototype.scrolls = function () {
        var _this = this;
        return new $jin2_atom(null, function (event) {
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
        return new $jin2_atom(function () { return _this.scrollTop().get() > 0; });
    };
    $mol_scroller.prototype.overflowLeft = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.scrollLeft().get() > 0; });
    };
    $mol_scroller.prototype.overflowBottom = function () {
        var _this = this;
        return new $jin2_atom(function () { return (_this.scrollHeight().get() - _this.scrollTop().get() - _this.offsetHeight().get()) > 0; });
    };
    $mol_scroller.prototype.overflowRight = function () {
        var _this = this;
        return new $jin2_atom(function () { return (_this.scrollWidth().get() - _this.scrollLeft().get() - _this.offsetWidth().get()) > 0; });
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
})($mol.$mol_scroller);
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
    var $mol_scroller_demo_empty = (function (_super) {
        __extends($mol_scroller_demo_empty, _super);
        function $mol_scroller_demo_empty() {
            _super.apply(this, arguments);
        }
        $mol_scroller_demo_empty = __decorate([
            $mol_replace
        ], $mol_scroller_demo_empty);
        return $mol_scroller_demo_empty;
    })($mol.$mol_scroller);
    $mol.$mol_scroller_demo_empty = $mol_scroller_demo_empty;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_scroller_demo_overflow = (function (_super) {
        __extends($mol_scroller_demo_overflow, _super);
        function $mol_scroller_demo_overflow() {
            _super.apply(this, arguments);
        }
        $mol_scroller_demo_overflow.prototype.scrollTop = function () { return new $jin2_atom(function () { return (100); }); };
        $mol_scroller_demo_overflow.prototype.child = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        __decorate([
            $jin2_grab
        ], $mol_scroller_demo_overflow.prototype, "scrollTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller_demo_overflow.prototype, "child", null);
        $mol_scroller_demo_overflow = __decorate([
            $mol_replace
        ], $mol_scroller_demo_overflow);
        return $mol_scroller_demo_overflow;
    })($mol.$mol_scroller);
    $mol.$mol_scroller_demo_overflow = $mol_scroller_demo_overflow;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_scroller_demo_overflowTop = (function (_super) {
        __extends($mol_scroller_demo_overflowTop, _super);
        function $mol_scroller_demo_overflowTop() {
            _super.apply(this, arguments);
        }
        $mol_scroller_demo_overflowTop.prototype.scrollTop = function () { return new $jin2_atom(function () { return (10000); }); };
        $mol_scroller_demo_overflowTop.prototype.child = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        __decorate([
            $jin2_grab
        ], $mol_scroller_demo_overflowTop.prototype, "scrollTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller_demo_overflowTop.prototype, "child", null);
        $mol_scroller_demo_overflowTop = __decorate([
            $mol_replace
        ], $mol_scroller_demo_overflowTop);
        return $mol_scroller_demo_overflowTop;
    })($mol.$mol_scroller);
    $mol.$mol_scroller_demo_overflowTop = $mol_scroller_demo_overflowTop;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_scroller_demo_overflowBottom = (function (_super) {
        __extends($mol_scroller_demo_overflowBottom, _super);
        function $mol_scroller_demo_overflowBottom() {
            _super.apply(this, arguments);
        }
        $mol_scroller_demo_overflowBottom.prototype.scrollTop = function () { return new $jin2_atom(function () { return (0); }); };
        $mol_scroller_demo_overflowBottom.prototype.child = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        __decorate([
            $jin2_grab
        ], $mol_scroller_demo_overflowBottom.prototype, "scrollTop", null);
        __decorate([
            $jin2_grab
        ], $mol_scroller_demo_overflowBottom.prototype, "child", null);
        $mol_scroller_demo_overflowBottom = __decorate([
            $mol_replace
        ], $mol_scroller_demo_overflowBottom);
        return $mol_scroller_demo_overflowBottom;
    })($mol.$mol_scroller);
    $mol.$mol_scroller_demo_overflowBottom = $mol_scroller_demo_overflowBottom;
})($mol || ($mol = {}));
//# sourceMappingURL=scroller.stage=test.view.tree.js.map
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
        $mol_demo = __decorate([
            $mol_replace
        ], $mol_demo);
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
        $mol_demo_screen.prototype.expanded = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_demo_screen.prototype.attr_mol_demo_screen_expanded = function () { return this.expanded(); };
        $mol_demo_screen.prototype.content = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_demo_screen.prototype.contenter = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.child = function () { return _this.content(); };
                return view;
            });
        };
        $mol_demo_screen.prototype.title = function () { return new $jin2_atom(function () { return (""); }); };
        $mol_demo_screen.prototype.titler = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_checker;
                view.child = function () { return _this.title(); };
                view.checked = function () { return _this.expanded(); };
                return view;
            });
        };
        $mol_demo_screen.prototype.child = function () {
            var _this = this;
            return new $jin2_atom(function () { return [_this.contenter().get(), _this.titler().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "expanded", null);
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "content", null);
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "contenter", null);
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "title", null);
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "titler", null);
        __decorate([
            $jin2_grab
        ], $mol_demo_screen.prototype, "child", null);
        $mol_demo_screen = __decorate([
            $mol_replace
        ], $mol_demo_screen);
        return $mol_demo_screen;
    })($mol_block);
    $mol.$mol_demo_screen = $mol_demo_screen;
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
var $mol_demo = (function (_super) {
    __extends($mol_demo, _super);
    function $mol_demo() {
        _super.apply(this, arguments);
    }
    $mol_demo.prototype.child = function () {
        var _this = this;
        return new $jin2_atom(function () {
            var screens = [];
            for (var id in $mol) {
                if (/^\$mol_demo_/.test(id))
                    continue;
                if (!/_demo_/.test(id))
                    continue;
                screens.push(_this.screen(id).get());
            }
            return screens;
        });
    };
    $mol_demo.prototype.screen = function (id) {
        var _this = this;
        return new $jin2_atom_own(function () {
            var view = new $mol_demo_screen;
            view.content = function () { return _this.widget(id); };
            return view;
        });
    };
    $mol_demo.prototype.widget = function (id) {
        return new $jin2_atom_own(function () { return new $mol[id]; });
    };
    __decorate([
        $jin2_grab
    ], $mol_demo.prototype, "child", null);
    __decorate([
        $jin2_grab
    ], $mol_demo.prototype, "screen", null);
    __decorate([
        $jin2_grab
    ], $mol_demo.prototype, "widget", null);
    $mol_demo = __decorate([
        $mol_replace
    ], $mol_demo);
    return $mol_demo;
})($mol.$mol_demo);
var $mol_demo_screen = (function (_super) {
    __extends($mol_demo_screen, _super);
    function $mol_demo_screen() {
        _super.apply(this, arguments);
    }
    $mol_demo_screen.prototype.title = function () {
        var _this = this;
        return new $jin2_atom(function () { return _this.objectOwner.objectId; });
    };
    $mol_demo_screen.prototype.expanded = function () {
        var state = $jin2_state_local.item(this.objectPath + '.expanded_');
        return new $jin2_atom(function () { return state.get() === 'true'; }, function (next) { state.set(next); return next; });
    };
    __decorate([
        $jin2_grab
    ], $mol_demo_screen.prototype, "title", null);
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
    var $mol_number = (function (_super) {
        __extends($mol_number, _super);
        function $mol_number() {
            _super.apply(this, arguments);
        }
        $mol_number.prototype.tagName = function () { return new $jin2_atom(function () { return ("input"); }); };
        $mol_number.prototype.type = function () { return new $jin2_atom(function () { return ("number"); }); };
        $mol_number.prototype.field_type = function () { return this.type(); };
        $mol_number.prototype.value = function () { return new $jin2_atom(function () { return (0); }); };
        $mol_number.prototype.field_value = function () { return this.value(); };
        $mol_number.prototype.hint = function () { return new $jin2_atom(function () { return ("hint"); }); };
        $mol_number.prototype.attr_placeholder = function () { return this.hint(); };
        $mol_number.prototype.presses = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_number.prototype.event_keypress = function () { return this.presses(); };
        $mol_number.prototype.changes = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_number.prototype.event_change = function () { return this.changes(); };
        __decorate([
            $jin2_grab
        ], $mol_number.prototype, "tagName", null);
        __decorate([
            $jin2_grab
        ], $mol_number.prototype, "type", null);
        __decorate([
            $jin2_grab
        ], $mol_number.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_number.prototype, "hint", null);
        __decorate([
            $jin2_grab
        ], $mol_number.prototype, "presses", null);
        __decorate([
            $jin2_grab
        ], $mol_number.prototype, "changes", null);
        $mol_number = __decorate([
            $mol_replace
        ], $mol_number);
        return $mol_number;
    })($mol_block);
    $mol.$mol_number = $mol_number;
})($mol || ($mol = {}));
//# sourceMappingURL=number.view.tree.js.map
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
var $mol_number = (function (_super) {
    __extends($mol_number, _super);
    function $mol_number() {
        _super.apply(this, arguments);
    }
    $mol_number.prototype.presses = function () {
        var _this = this;
        return new $jin2_atom(null, function (event) {
            var field = event.target;
            if (event.keyCode === 13) {
                _this.changes().set(event);
            }
        });
    };
    $mol_number.prototype.changes = function () {
        var _this = this;
        return new $jin2_atom(null, function (event) {
            var field = event.target;
            var val = field.value.trim();
            if (val) {
                _this.value().set(Number(field.value));
                field.value = String(_this.value().get());
                setTimeout(function () { return field.focus(); });
            }
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_number.prototype, "presses", null);
    __decorate([
        $jin2_grab
    ], $mol_number.prototype, "changes", null);
    $mol_number = __decorate([
        $mol_replace
    ], $mol_number);
    return $mol_number;
})($mol.$mol_number);
//# sourceMappingURL=number.view.js.map
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
    var $mol_number_demo_all = (function (_super) {
        __extends($mol_number_demo_all, _super);
        function $mol_number_demo_all() {
            _super.apply(this, arguments);
        }
        $mol_number_demo_all.prototype.value = function () { return new $jin2_atom(function () { return (123456); }); };
        $mol_number_demo_all.prototype.empty = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_number_demo_all.prototype.hint = function () { return new $jin2_atom(function () { return ("Age"); }); };
        $mol_number_demo_all.prototype.one = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_number;
                view.value = function () { return _this.empty(); };
                view.hint = function () { return _this.hint(); };
                return view;
            });
        };
        $mol_number_demo_all.prototype.two = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_number;
                view.value = function () { return _this.value(); };
                return view;
            });
        };
        $mol_number_demo_all.prototype.child = function () {
            var _this = this;
            return new $jin2_atom(function () { return [_this.one().get(), _this.two().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_number_demo_all.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_number_demo_all.prototype, "empty", null);
        __decorate([
            $jin2_grab
        ], $mol_number_demo_all.prototype, "hint", null);
        __decorate([
            $jin2_grab
        ], $mol_number_demo_all.prototype, "one", null);
        __decorate([
            $jin2_grab
        ], $mol_number_demo_all.prototype, "two", null);
        __decorate([
            $jin2_grab
        ], $mol_number_demo_all.prototype, "child", null);
        $mol_number_demo_all = __decorate([
            $mol_replace
        ], $mol_number_demo_all);
        return $mol_number_demo_all;
    })($mol_block);
    $mol.$mol_number_demo_all = $mol_number_demo_all;
})($mol || ($mol = {}));
//# sourceMappingURL=number.stage=test.view.tree.js.map
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
        $mol_panel.prototype.head = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_panel.prototype.header = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.child = function () { return _this.head(); };
                return view;
            });
        };
        $mol_panel.prototype.body = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_panel.prototype.bodier = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.child = function () { return _this.body(); };
                return view;
            });
        };
        $mol_panel.prototype.foot = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_panel.prototype.footer = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_scroller;
                view.child = function () { return _this.foot(); };
                return view;
            });
        };
        $mol_panel.prototype.child = function () {
            var _this = this;
            return new $jin2_atom(function () { return [_this.header().get(), _this.bodier().get(), _this.footer().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "head", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "header", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "body", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "bodier", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "foot", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "footer", null);
        __decorate([
            $jin2_grab
        ], $mol_panel.prototype, "child", null);
        $mol_panel = __decorate([
            $mol_replace
        ], $mol_panel);
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
    var $mol_panel_demo_light = (function (_super) {
        __extends($mol_panel_demo_light, _super);
        function $mol_panel_demo_light() {
            _super.apply(this, arguments);
        }
        $mol_panel_demo_light.prototype.head = function () { return new $jin2_atom(function () { return ("head"); }); };
        $mol_panel_demo_light.prototype.body = function () { return new $jin2_atom(function () { return ("body"); }); };
        $mol_panel_demo_light.prototype.foot = function () { return new $jin2_atom(function () { return ("foot"); }); };
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_light.prototype, "head", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_light.prototype, "body", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_light.prototype, "foot", null);
        $mol_panel_demo_light = __decorate([
            $mol_replace
        ], $mol_panel_demo_light);
        return $mol_panel_demo_light;
    })($mol.$mol_panel);
    $mol.$mol_panel_demo_light = $mol_panel_demo_light;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_panel_demo_generic = (function (_super) {
        __extends($mol_panel_demo_generic, _super);
        function $mol_panel_demo_generic() {
            _super.apply(this, arguments);
        }
        $mol_panel_demo_generic.prototype.head = function () { return new $jin2_atom(function () { return ("head"); }); };
        $mol_panel_demo_generic.prototype.body = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        $mol_panel_demo_generic.prototype.foot = function () { return new $jin2_atom(function () { return ("foot"); }); };
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_generic.prototype, "head", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_generic.prototype, "body", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_generic.prototype, "foot", null);
        $mol_panel_demo_generic = __decorate([
            $mol_replace
        ], $mol_panel_demo_generic);
        return $mol_panel_demo_generic;
    })($mol.$mol_panel);
    $mol.$mol_panel_demo_generic = $mol_panel_demo_generic;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_panel_demo_bloat = (function (_super) {
        __extends($mol_panel_demo_bloat, _super);
        function $mol_panel_demo_bloat() {
            _super.apply(this, arguments);
        }
        $mol_panel_demo_bloat.prototype.head = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        $mol_panel_demo_bloat.prototype.body = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        $mol_panel_demo_bloat.prototype.foot = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_bloat.prototype, "head", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_bloat.prototype, "body", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_bloat.prototype, "foot", null);
        $mol_panel_demo_bloat = __decorate([
            $mol_replace
        ], $mol_panel_demo_bloat);
        return $mol_panel_demo_bloat;
    })($mol.$mol_panel);
    $mol.$mol_panel_demo_bloat = $mol_panel_demo_bloat;
})($mol || ($mol = {}));
var $mol;
(function ($mol) {
    var $mol_panel_demo_footless = (function (_super) {
        __extends($mol_panel_demo_footless, _super);
        function $mol_panel_demo_footless() {
            _super.apply(this, arguments);
        }
        $mol_panel_demo_footless.prototype.head = function () { return new $jin2_atom(function () { return ("head"); }); };
        $mol_panel_demo_footless.prototype.body = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        $mol_panel_demo_footless.prototype.foot = function () { return new $jin2_atom(function () { return (null); }); };
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_footless.prototype, "head", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_footless.prototype, "body", null);
        __decorate([
            $jin2_grab
        ], $mol_panel_demo_footless.prototype, "foot", null);
        $mol_panel_demo_footless = __decorate([
            $mol_replace
        ], $mol_panel_demo_footless);
        return $mol_panel_demo_footless;
    })($mol.$mol_panel);
    $mol.$mol_panel_demo_footless = $mol_panel_demo_footless;
})($mol || ($mol = {}));
//# sourceMappingURL=panel.stage=test.view.tree.js.map
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
    var $mol_spoiler = (function (_super) {
        __extends($mol_spoiler, _super);
        function $mol_spoiler() {
            _super.apply(this, arguments);
        }
        $mol_spoiler.prototype.title = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_spoiler.prototype.expanded = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_spoiler.prototype.switcher = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_checker;
                view.child = function () { return _this.title(); };
                view.checked = function () { return _this.expanded(); };
                return view;
            });
        };
        $mol_spoiler.prototype.content = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_spoiler.prototype.contenter = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol_block;
                view.child = function () { return _this.content(); };
                return view;
            });
        };
        $mol_spoiler.prototype.child = function () {
            var _this = this;
            return new $jin2_atom(function () { return [_this.switcher().get(), _this.contenter().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_spoiler.prototype, "title", null);
        __decorate([
            $jin2_grab
        ], $mol_spoiler.prototype, "expanded", null);
        __decorate([
            $jin2_grab
        ], $mol_spoiler.prototype, "switcher", null);
        __decorate([
            $jin2_grab
        ], $mol_spoiler.prototype, "content", null);
        __decorate([
            $jin2_grab
        ], $mol_spoiler.prototype, "contenter", null);
        __decorate([
            $jin2_grab
        ], $mol_spoiler.prototype, "child", null);
        $mol_spoiler = __decorate([
            $mol_replace
        ], $mol_spoiler);
        return $mol_spoiler;
    })($mol_block);
    $mol.$mol_spoiler = $mol_spoiler;
})($mol || ($mol = {}));
//# sourceMappingURL=spoiler.view.tree.js.map
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
var $mol_spoiler = (function (_super) {
    __extends($mol_spoiler, _super);
    function $mol_spoiler() {
        _super.apply(this, arguments);
    }
    $mol_spoiler.prototype.expanded = function () { return new $jin2_atom(function () { return false; }); };
    $mol_spoiler.prototype.child = function () {
        var _this = this;
        return new $jin2_atom(function () { return [
            _this.switcher().get(),
            _this.expanded().get() ? _this.contenter().get() : null,
        ]; });
    };
    __decorate([
        $jin2_grab
    ], $mol_spoiler.prototype, "expanded", null);
    __decorate([
        $jin2_grab
    ], $mol_spoiler.prototype, "child", null);
    $mol_spoiler = __decorate([
        $mol_replace
    ], $mol_spoiler);
    return $mol_spoiler;
})($mol.$mol_spoiler);
//# sourceMappingURL=spoiler.view.js.map
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
    var $mol_spoiler_demo_generic = (function (_super) {
        __extends($mol_spoiler_demo_generic, _super);
        function $mol_spoiler_demo_generic() {
            _super.apply(this, arguments);
        }
        $mol_spoiler_demo_generic.prototype.title = function () { return new $jin2_atom(function () { return ("Show me all!"); }); };
        $mol_spoiler_demo_generic.prototype.content = function () {
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_filler;
                return view;
            });
        };
        __decorate([
            $jin2_grab
        ], $mol_spoiler_demo_generic.prototype, "title", null);
        __decorate([
            $jin2_grab
        ], $mol_spoiler_demo_generic.prototype, "content", null);
        $mol_spoiler_demo_generic = __decorate([
            $mol_replace
        ], $mol_spoiler_demo_generic);
        return $mol_spoiler_demo_generic;
    })($mol.$mol_spoiler);
    $mol.$mol_spoiler_demo_generic = $mol_spoiler_demo_generic;
})($mol || ($mol = {}));
//# sourceMappingURL=spoiler.stage=test.view.tree.js.map
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
        $mol_stringer.prototype.valueView = function () { return new $jin2_atom(function () { return ("valueView"); }); };
        $mol_stringer.prototype.hint = function () { return new $jin2_atom(function () { return ("hint"); }); };
        $mol_stringer.prototype.attr_mol_stringer_hint = function () { return this.hint(); };
        $mol_stringer.prototype.autoFocus = function () { return new $jin2_atom(function () { return (false); }); };
        $mol_stringer.prototype.field_autofocus = function () { return this.autoFocus(); };
        $mol_stringer.prototype.editable = function () { return new $jin2_atom(function () { return (true); }); };
        $mol_stringer.prototype.field_contentEditable = function () { return this.editable(); };
        $mol_stringer.prototype.value = function () { return new $jin2_atom(function () { return ("value"); }); };
        $mol_stringer.prototype.field_textContent = function () { return this.value(); };
        $mol_stringer.prototype.presses = function () { return new $jin2_atom(function () { return (null); }); };
        $mol_stringer.prototype.event_keypress = function () { return this.presses(); };
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "valueView", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "hint", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "autoFocus", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "editable", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer.prototype, "presses", null);
        $mol_stringer = __decorate([
            $mol_replace
        ], $mol_stringer);
        return $mol_stringer;
    })($mol.$mol_scroller);
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
        return new $jin2_atom(function () { return null; }, function (next) {
            var text = next.target.textContent.trim();
            if (next.keyCode === 13) {
                next.preventDefault();
                _this.value().set(text);
                text = _this.value().get();
                next.target.textContent = text;
            }
            _this.valueView().set(text);
        });
    };
    __decorate([
        $jin2_grab
    ], $mol_stringer.prototype, "presses", null);
    $mol_stringer = __decorate([
        $mol_replace
    ], $mol_stringer);
    return $mol_stringer;
})($mol.$mol_stringer);
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
    var $mol_stringer_demo_all = (function (_super) {
        __extends($mol_stringer_demo_all, _super);
        function $mol_stringer_demo_all() {
            _super.apply(this, arguments);
        }
        $mol_stringer_demo_all.prototype.value = function () { return new $jin2_atom(function () { return ("Hello World"); }); };
        $mol_stringer_demo_all.prototype.empty = function () { return new $jin2_atom(function () { return (""); }); };
        $mol_stringer_demo_all.prototype.hint = function () { return new $jin2_atom(function () { return ("Greeting"); }); };
        $mol_stringer_demo_all.prototype.one = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_stringer;
                view.hint = function () { return _this.hint(); };
                view.value = function () { return _this.empty(); };
                return view;
            });
        };
        $mol_stringer_demo_all.prototype.two = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_stringer;
                view.value = function () { return _this.value(); };
                return view;
            });
        };
        $mol_stringer_demo_all.prototype.three = function () {
            var _this = this;
            return new $jin2_atom_own(function () {
                var view = new $mol.$mol_stringer;
                view.value = function () { return _this.empty(); };
                view.valueView = function () { return _this.value(); };
                return view;
            });
        };
        $mol_stringer_demo_all.prototype.child = function () {
            var _this = this;
            return new $jin2_atom(function () { return [_this.one().get(), _this.two().get(), _this.three().get()]; });
        };
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "value", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "empty", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "hint", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "one", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "two", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "three", null);
        __decorate([
            $jin2_grab
        ], $mol_stringer_demo_all.prototype, "child", null);
        $mol_stringer_demo_all = __decorate([
            $mol_replace
        ], $mol_stringer_demo_all);
        return $mol_stringer_demo_all;
    })($mol_block);
    $mol.$mol_stringer_demo_all = $mol_stringer_demo_all;
})($mol || ($mol = {}));
//# sourceMappingURL=stringer.stage=test.view.tree.js.map
//# sourceMappingURL=index.env=web.stage=test.js.map