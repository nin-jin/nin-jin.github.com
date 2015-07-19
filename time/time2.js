var $jin = this.$jin = {}

;
var $jin;
(function ($jin) {
    function concater(funcs) {
        switch (funcs.length) {
            case 0:
                return function (value) { return value; };
            case 1:
                return funcs[0];
            default:
                var mid = Math.ceil(funcs.length / 2);
                var first = $jin.concater(funcs.slice(0, mid));
                var second = $jin.concater(funcs.slice(mid));
                return function (value) {
                    return first.call(this, value) + second.call(this, value);
                };
        }
    }
    $jin.concater = concater;
})($jin || ($jin = {}));
//jin-concater.js.map
;
var $jin;
(function ($jin) {
    var time;
    (function (time) {
        var base_class = (function () {
            function base_class() {
            }
            base_class.formatter = function (pattern) {
                var _this = this;
                if (this.patterns[pattern])
                    return this.patterns[pattern];
                var tokens = Object.keys(this.patterns)
                    .sort()
                    .reverse()
                    .map(function (token) { return token.replace(/([-+*.\[\]()\^])/g, '\\$1'); });
                var lexer = RegExp('(.*?)(' + tokens.join('|') + '|$)', 'g');
                var funcs = [];
                pattern.replace(lexer, function (str, text, token) {
                    if (text)
                        funcs.push(function () { return text; });
                    if (token)
                        funcs.push(_this.patterns[token]);
                });
                return this.patterns[pattern] = $jin.concater(funcs);
            };
            base_class.prototype.toString = function (pattern) {
                var Base = this.constructor;
                var formatter = Base.formatter(pattern);
                return formatter.call(Base, this);
            };
            base_class.patterns = {};
            return base_class;
        })();
        time.base_class = base_class;
    })(time = $jin.time || ($jin.time = {}));
})($jin || ($jin = {}));
//base.js.map
;
function $jin_type(value) {
    var str = {}.toString.apply(value);
    var type = str.substring(8, str.length - 1);
    if (['Window', 'global'].indexOf(type) >= 0)
        type = 'Global';
    return type;
}
//type.js.map
;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    var time;
    (function (time) {
        var duration_class = (function (_super) {
            __extends(duration_class, _super);
            function duration_class(config) {
                _super.call(this);
                this._year = config.year && Number(config.year) || 0;
                this._month = config.month && Number(config.month) || 0;
                this._day = config.day && Number(config.day) || 0;
                this._hour = config.hour && Number(config.hour) || 0;
                this._minute = config.minute && Number(config.minute) || 0;
                this._second = config.second && Number(config.second) || 0;
            }
            duration_class.make = function (duration) {
                if (!arguments.length)
                    duration = [];
                var type = $jin_type(duration);
                switch (type) {
                    case 'Number':
                        return new this({ second: duration / 1000 });
                    case 'Array':
                        return new this({
                            year: duration[0],
                            month: duration[1],
                            day: duration[2],
                            hour: duration[3],
                            minute: duration[4],
                            second: duration[5],
                        });
                    case 'Object':
                        if (duration instanceof this)
                            return duration;
                        return new this(duration);
                    case 'String':
                        if (duration === 'Z') {
                            return new this({});
                        }
                        var parser = /^P(?:([+-]?\d+(?:\.\d+)?)Y)?(?:([+-]?\d+(?:\.\d+)?)M)?(?:([+-]?\d+(?:\.\d+)?)D)?(?:T(?:([+-]?\d+(?:\.\d+)?)h)?(?:([+-]?\d+(?:\.\d+)?)m)?(?:([+-]?\d+(?:\.\d+)?)s)?)?$/i;
                        var found = parser.exec(duration);
                        if (found) {
                            return new this({
                                year: found[1],
                                month: found[2],
                                day: found[3],
                                hour: found[4],
                                minute: found[5],
                                second: found[6],
                            });
                        }
                        var parser = /^[+-](\d+)(?::(\d+))?$/i;
                        var found = parser.exec(duration);
                        if (found) {
                            return new this({
                                hour: found[1],
                                minute: found[2],
                            });
                        }
                        throw new Error('Can not parse time duration (' + duration + ')');
                    default:
                        throw new Error('Wrong type of time duration (' + type + ')');
                }
            };
            Object.defineProperty(duration_class.prototype, "year", {
                get: function () { return this._year; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(duration_class.prototype, "month", {
                get: function () { return this._month; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(duration_class.prototype, "day", {
                get: function () { return this._day; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(duration_class.prototype, "hour", {
                get: function () { return this._hour; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(duration_class.prototype, "minute", {
                get: function () { return this._minute; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(duration_class.prototype, "second", {
                get: function () { return this._second; },
                enumerable: true,
                configurable: true
            });
            duration_class.prototype.summ = function (config) {
                var Duration = this.constructor;
                var duration = Duration.make(config);
                return new Duration({
                    year: this.year + duration.year,
                    month: this.month + duration.month,
                    day: this.day + duration.day,
                    hour: this.hour + duration.hour,
                    minute: this.minute + duration.minute,
                    second: this.second + duration.second,
                });
            };
            duration_class.prototype.sub = function (config) {
                var Duration = this.constructor;
                var duration = Duration.make(config);
                return new Duration({
                    year: this.year - duration.year,
                    month: this.month - duration.month,
                    day: this.day - duration.day,
                    hour: this.hour - duration.hour,
                    minute: this.minute - duration.minute,
                    second: this.second - duration.second,
                });
            };
            duration_class.prototype.valueOf = function () {
                var day = this.year * 365 + this.month * 30 + this.day;
                var second = ((day * 24 + this.hour) * 60 + this.minute) * 60 + this.second;
                return second * 1000;
            };
            duration_class.prototype.toJSON = function () { return this.toString(); };
            duration_class.prototype.toString = function (pattern) {
                if (pattern === void 0) { pattern = 'P#Y#M#DT#h#m#s'; }
                return _super.prototype.toString.call(this, pattern);
            };
            duration_class.patterns = {
                '#Y': function (duration) {
                    if (!duration.year)
                        return '';
                    return duration.year + 'Y';
                },
                '#M': function (duration) {
                    if (!duration.month)
                        return '';
                    return duration.month + 'M';
                },
                '#D': function (duration) {
                    if (!duration.day)
                        return '';
                    return duration.day + 'D';
                },
                '#h': function (duration) {
                    if (!duration.hour)
                        return '';
                    return duration.hour + 'H';
                },
                '#m': function (duration) {
                    if (!duration.minute)
                        return '';
                    return duration.minute + 'M';
                },
                '#s': function (duration) {
                    if (!duration.second)
                        return '';
                    return duration.second + 'S';
                },
                '+hh': function (duration) {
                    var hour = duration.hour;
                    var sign = '+';
                    if (hour < 0) {
                        sign = '-';
                        hour = -hour;
                    }
                    return (hour < 10)
                        ? (sign + '0' + hour)
                        : (sign + hour);
                },
                'mm': function (duration) {
                    return (duration.minute < 10)
                        ? ('0' + duration.minute)
                        : String(duration.minute);
                },
            };
            return duration_class;
        })($jin.time.base_class);
        time.duration_class = duration_class;
        time.duration = duration_class.make.bind(duration_class);
    })(time = $jin.time || ($jin.time = {}));
})($jin || ($jin = {}));
//duration.js.map
;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    var time;
    (function (time) {
        var moment_class = (function (_super) {
            __extends(moment_class, _super);
            function moment_class(config) {
                _super.call(this);
                this._year = config.year && Number(config.year);
                this._month = config.month && Number(config.month);
                this._day = config.day && Number(config.day);
                this._hour = config.hour && Number(config.hour);
                this._minute = config.minute && Number(config.minute);
                this._second = config.second && Number(config.second);
                this._offset = config.offset && this.constructor.duration_class.make(config.offset);
                this._native = null;
            }
            moment_class.make = function (moment) {
                if (!arguments.length)
                    moment = new Date;
                var type = $jin_type(moment);
                switch (type) {
                    case 'Number':
                        moment = new Date(moment);
                    case 'Date':
                        var native = moment;
                        var offset = -native.getTimezoneOffset();
                        return new this({
                            year: native.getFullYear(),
                            month: native.getMonth(),
                            day: native.getDate() - 1,
                            hour: native.getHours(),
                            minute: native.getMinutes(),
                            second: native.getSeconds() + native.getMilliseconds() / 1000,
                            offset: {
                                hour: (offset < 0) ? Math.ceil(offset / 60) : Math.floor(offset / 60),
                                minute: offset % 60
                            }
                        });
                    case 'String':
                        var parsed = /^(?:(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d))?)?)?(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d(?:\.\d\d\d)?))?)?(Z|[\+\-]\d\d(?::?(?:\d\d)?)?)?)?$/.exec(moment);
                        if (!parsed)
                            throw new Error('Can not parse time moment (' + moment + ')');
                        return new this({
                            year: parsed[1],
                            month: parsed[2] ? (Number(parsed[2]) - 1) : void 0,
                            day: parsed[3] ? (Number(parsed[3]) - 1) : void 0,
                            hour: parsed[4],
                            minute: parsed[5],
                            second: parsed[6],
                            offset: parsed[7]
                        });
                    case 'Array':
                        return new this({
                            year: moment[0],
                            month: moment[1],
                            day: moment[2],
                            hour: moment[3],
                            minute: moment[4],
                            second: moment[5],
                            offset: moment[6],
                        });
                    case 'Object':
                        if (moment instanceof this)
                            return moment;
                        return new this(moment);
                    default:
                        throw new Error('Wrong type of time moment (' + type + ')');
                }
            };
            Object.defineProperty(moment_class.prototype, "year", {
                get: function () { return this._year; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "month", {
                get: function () { return this._month; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "day", {
                get: function () { return this._day; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "hour", {
                get: function () { return this._hour; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "minute", {
                get: function () { return this._minute; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "second", {
                get: function () { return this._second; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "offset", {
                get: function () { return this._offset; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "native", {
                get: function () {
                    if (this._native)
                        return this._native;
                    var utc = this.toOffset('Z');
                    return this._native = new Date(Date.UTC(utc.year || 0, utc.month || 0, (utc.day || 0) + 1, utc.hour || 0, utc.minute || 0, utc.second && Math.ceil(utc.second) || 0, utc.second && (utc.second - Math.ceil(utc.second)) || 0));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "normal", {
                get: function () {
                    return this.constructor.make(this.native);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(moment_class.prototype, "weekDay", {
                get: function () {
                    return this.native.getDay();
                },
                enumerable: true,
                configurable: true
            });
            moment_class.prototype.merge = function (config) {
                var Moment = this.constructor;
                var moment = Moment.make(config);
                return new Moment({
                    year: (moment.year === void 0)
                        ? this._year
                        : (moment.year === null)
                            ? void 0
                            : moment.year,
                    month: (moment.month === void 0)
                        ? this._month
                        : (moment.month === null)
                            ? void 0
                            : moment.month,
                    day: (moment.day === void 0)
                        ? this._day
                        : (moment.day === null)
                            ? void 0
                            : moment.day,
                    hour: (moment.hour === void 0)
                        ? this._hour
                        : (moment.hour === null)
                            ? void 0
                            : moment.hour,
                    minute: (moment.minute === void 0)
                        ? this._minute
                        : (moment.minute === null)
                            ? void 0
                            : moment.minute,
                    second: (moment.second === void 0)
                        ? this._second
                        : (moment.second === null)
                            ? void 0
                            : moment.second,
                    offset: (moment.offset === void 0)
                        ? this._offset
                        : (moment.offset === null)
                            ? void 0
                            : moment.offset,
                });
            };
            moment_class.prototype.shift = function (config) {
                var Moment = this.constructor;
                var duration = Moment.duration_class.make(config);
                var moment = Moment.make().merge(this);
                var second = moment.second + duration.second;
                var native = new Date(moment.year + duration.year, moment.month + duration.month, moment.day + duration.day + 1, moment.hour + duration.hour, moment.minute + duration.minute, Math.floor(second), (second - Math.floor(second)) * 1000);
                if (isNaN(native.valueOf()))
                    throw new Error('Wrong time');
                return new Moment({
                    year: (this._year === void 0) ? void 0 : native.getFullYear(),
                    month: (this._month === void 0) ? void 0 : native.getMonth(),
                    day: (this._day === void 0) ? void 0 : native.getDate() - 1,
                    hour: (this._hour === void 0) ? void 0 : native.getHours(),
                    minute: (this._minute === void 0) ? void 0 : native.getMinutes(),
                    second: (this._second === void 0) ? void 0 : native.getSeconds() + native.getMilliseconds() / 1000,
                    offset: this.offset,
                });
            };
            moment_class.prototype.toOffset = function (duration) {
                if (this._offset) {
                    var Moment = this.constructor;
                    return this
                        .shift(Moment.duration_class.make(duration).sub(this._offset))
                        .merge({ offset: duration });
                }
                else {
                    return this.merge({ offset: duration });
                }
            };
            moment_class.prototype.valueOf = function () { return this.native.getTime(); };
            moment_class.prototype.toJSON = function () { return this.toString(); };
            moment_class.prototype.toString = function (pattern) {
                if (pattern === void 0) { pattern = 'YYYY-MM-DDThh:mm:ss.sssZ'; }
                return _super.prototype.toString.call(this, pattern);
            };
            moment_class.duration_class = $jin.time.duration_class;
            moment_class.patterns = {
                'YYYY': function (moment) {
                    if (moment.year == null)
                        return '';
                    return String(moment.year);
                },
                'AD': function (moment) {
                    if (moment.year == null)
                        return '';
                    return String(Math.floor(moment.year / 100) + 1);
                },
                'YY': function (moment) {
                    if (moment.year == null)
                        return '';
                    return String(moment.year % 100);
                },
                'Month': function (moment) {
                    if (moment.month == null)
                        return '';
                    return this.monthLong[moment.month];
                },
                'Mon': function (moment) {
                    if (moment.month == null)
                        return '';
                    return this.monthShort[moment.month];
                },
                '-MM': function (moment) {
                    if (moment.month == null)
                        return '';
                    return '-' + this.patterns['MM'](moment);
                },
                'MM': function (moment) {
                    if (moment.month == null)
                        return '';
                    var month = moment.month + 1;
                    return (month < 10)
                        ? ('0' + month)
                        : ('' + month);
                },
                'M': function (moment) {
                    if (moment.month == null)
                        return '';
                    return String(moment.month + 1);
                },
                'WeekDay': function (moment) {
                    if (moment.weekDay == null)
                        return '';
                    return this.weekDayLong[moment.weekDay];
                },
                'WD': function (moment) {
                    if (moment.weekDay == null)
                        return '';
                    return this.weekDayShort[moment.weekDay];
                },
                '-DD': function (moment) {
                    if (moment.day == null)
                        return '';
                    return '-' + this.patterns['DD'](moment);
                },
                'DD': function (moment) {
                    if (moment.day == null)
                        return '';
                    var day = moment.day + 1;
                    return (day < 10)
                        ? ('0' + day)
                        : String(day);
                },
                'D': function (moment) {
                    if (moment.day == null)
                        return '';
                    return String(moment.day + 1);
                },
                'Thh': function (moment) {
                    if (moment.hour == null)
                        return '';
                    return 'T' + this.patterns['hh'](moment);
                },
                'hh': function (moment) {
                    if (moment.hour == null)
                        return '';
                    return (moment.hour < 10)
                        ? ('0' + moment.hour)
                        : String(moment.hour);
                },
                'h': function (moment) {
                    if (moment.hour == null)
                        return '';
                    return String(moment.hour);
                },
                ':mm': function (moment) {
                    if (moment.minute == null)
                        return '';
                    return ':' + this.patterns['mm'](moment);
                },
                'mm': function (moment) {
                    if (moment.minute == null)
                        return '';
                    return (moment.minute < 10)
                        ? ('0' + moment.minute)
                        : String(moment.minute);
                },
                'm': function (moment) {
                    if (moment.minute == null)
                        return '';
                    return String(moment.minute);
                },
                ':ss': function (moment) {
                    if (moment.second == null)
                        return '';
                    return ':' + this.patterns['ss'](moment);
                },
                'ss': function (moment) {
                    if (moment.second == null)
                        return '';
                    var second = Math.floor(moment.second);
                    return (second < 10)
                        ? ('0' + second)
                        : String(second);
                },
                's': function (moment) {
                    if (moment.second == null)
                        return '';
                    return String(Math.floor(moment.second));
                },
                '.sss': function (moment) {
                    if (moment.second == null)
                        return '';
                    if (moment.second - Math.floor(moment.second) === 0)
                        return '';
                    return '.' + this.patterns['sss'](moment);
                },
                'sss': function (moment) {
                    if (moment.second == null)
                        return '';
                    var millisecond = Math.floor((moment.second - Math.floor(moment.second)) * 1000);
                    return (millisecond < 10)
                        ? ('00' + millisecond)
                        : (millisecond < 100)
                            ? ('0' + millisecond)
                            : String(millisecond);
                },
                'Z': function (moment) {
                    var offset = moment.offset;
                    if (!offset)
                        return '';
                    return offset.toString('+hh:mm');
                }
            };
            moment_class.monthLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            moment_class.monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            moment_class.weekDayLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            moment_class.weekDayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return moment_class;
        })($jin.time.base_class);
        time.moment_class = moment_class;
        time.moment = moment_class.make.bind(moment_class);
    })(time = $jin.time || ($jin.time = {}));
})($jin || ($jin = {}));
//moment.js.map
;
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var $jin;
(function ($jin) {
    var time;
    (function (time) {
        var range_class = (function (_super) {
            __extends(range_class, _super);
            function range_class(config) {
                _super.call(this);
                var Range = this.constructor;
                this._from = config.from && Range.Moment.make(config.from);
                this._to = config.to && Range.Moment.make(config.to);
                this._duration = config.duration && Range.Duration.make(config.duration);
            }
            range_class.make = function (range) {
                var type = $jin_type(range);
                switch (type) {
                    case 'String':
                        var chunks = range.split('/');
                        var config = {};
                        config[/^P/i.test(chunks[0]) ? 'duration' : 'from'] = chunks[0];
                        config[/^P/i.test(chunks[1]) ? 'duration' : 'to'] = chunks[1];
                        return this.make(config);
                    case 'Array':
                        return new this({
                            from: range[0],
                            to: range[1],
                        });
                    case 'Object':
                        if (range instanceof this)
                            return range;
                        return new this(range);
                    default:
                        throw new Error('Wrong type of time range (' + type + ')');
                }
            };
            Object.defineProperty(range_class.prototype, "from", {
                get: function () {
                    if (this._from)
                        return this._from;
                    var Range = this.constructor;
                    return this._from = this._to.shift(Range.Duration.make().sub(this._duration));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(range_class.prototype, "to", {
                get: function () {
                    if (this._to)
                        return this._to;
                    return this._to = this._from.shift(this._duration);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(range_class.prototype, "duration", {
                get: function () {
                    if (this._duration)
                        return this._duration;
                    var Range = this.constructor;
                    return this._duration = Range.Duration.make(this._to.valueOf() - this.from.valueOf());
                },
                enumerable: true,
                configurable: true
            });
            range_class.prototype.toJSON = function () { return this.toString(); };
            range_class.prototype.toString = function () {
                return (this._from || this._duration).toString() + '/' + (this._to || this._duration).toString();
            };
            range_class.Moment = $jin.time.moment_class;
            range_class.Duration = $jin.time.duration_class;
            return range_class;
        })($jin.time.base_class);
        time.range_class = range_class;
        time.range = range_class.make.bind(range_class);
    })(time = $jin.time || ($jin.time = {}));
})($jin || ($jin = {}));
//range.js.map
;
$jin.time.moment;
$jin.time.duration;
$jin.time.range;
var module;
if (typeof module !== 'undefined') {
    module.exports = $jin.time;
}
//time.js.map
//# sourceMappingURL=index.env=web.stage=release.js.map