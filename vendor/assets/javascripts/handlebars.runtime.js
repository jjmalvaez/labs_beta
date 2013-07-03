// lib/handlebars/base.js
/*jshint eqnull:true*/
this.Handlebars = {}, function(e) {
  e.VERSION = "1.0.rc.1", e.helpers = {}, e.partials = {}, e.registerHelper = function(e, t, n) {
    n && (t.not = n), this.helpers[e] = t
  }, e.registerPartial = function(e, t) {
    this.partials[e] = t
  }, e.registerHelper("helperMissing", function(e) {
    if (arguments.length === 2) return undefined;
    throw new Error("Could not find property '" + e + "'")
  });
  var t = Object.prototype.toString,
    n = "[object Function]";
  e.registerHelper("blockHelperMissing", function(r, i) {
    var s = i.inverse ||
    function() {}, o = i.fn, u = "", a = t.call(r);
    return a === n && (r = r.call(this)), r === !0 ? o(this) : r === !1 || r == null ? s(this) : a === "[object Array]" ? r.length > 0 ? e.helpers.each(r, i) : s(this) : o(r)
  }), e.K = function() {}, e.createFrame = Object.create ||
  function(t) {
    e.K.prototype = t;
    var n = new e.K;
    return e.K.prototype = null, n
  }, e.registerHelper("each", function(t, n) {
    var r = n.fn,
      i = n.inverse,
      s = 0,
      o = "",
      u;
    n.data && (u = e.createFrame(n.data));
    if (t && typeof t == "object") if (t instanceof Array) for (var a = t.length; s < a; s++) u && (u.index = s), o += r(t[s], {
      data: u
    });
    else for (var f in t) t.hasOwnProperty(f) && (u && (u.key = f), o += r(t[f], {
      data: u
    }), s++);
    return s === 0 && (o = i(this)), o
  }), e.registerHelper("if", function(r, i) {
    var s = t.call(r);
    return s === n && (r = r.call(this)), !r || e.Utils.isEmpty(r) ? i.inverse(this) : i.fn(this)
  }), e.registerHelper("unless", function(t, n) {
    var r = n.fn,
      i = n.inverse;
    return n.fn = i, n.inverse = r, e.helpers["if"].call(this, t, n)
  }), e.registerHelper("with", function(e, t) {
    return t.fn(e)
  }), e.registerHelper("log", function(t) {
    e.log(t)
  })
}(this.Handlebars);
var errorProps = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
Handlebars.Exception = function(e) {
  var t = Error.prototype.constructor.apply(this, arguments);
  for (var n = 0; n < errorProps.length; n++) this[errorProps[n]] = t[errorProps[n]]
}, Handlebars.Exception.prototype = new Error, Handlebars.SafeString = function(e) {
  this.string = e
}, Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString()
}, function() {
  var e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  },
    t = /[&<>"'`]/g,
    n = /[&<>"'`]/,
    r = function(t) {
      return e[t] || "&amp;"
    };
  Handlebars.Utils = {
    escapeExpression: function(e) {
      return e instanceof Handlebars.SafeString ? e.toString() : e == null || e === !1 ? "" : n.test(e) ? e.replace(t, r) : e
    },
    isEmpty: function(e) {
      return typeof e == "undefined" ? !0 : e === null ? !0 : e === !1 ? !0 : Object.prototype.toString.call(e) === "[object Array]" && e.length === 0 ? !0 : !1
    }
  }
}(), Handlebars.VM = {
  template: function(e) {
    var t = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(e, t, n) {
        var r = this.programs[e];
        return n ? Handlebars.VM.program(t, n) : r ? r : (r = this.programs[e] = Handlebars.VM.program(t), r)
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };
    return function(n, r) {
      return r = r || {}, e.call(t, Handlebars, n, r.helpers, r.partials, r.data)
    }
  },
  programWithDepth: function(e, t, n) {
    var r = Array.prototype.slice.call(arguments, 2);
    return function(n, i) {
      return i = i || {}, e.apply(this, [n, i.data || t].concat(r))
    }
  },
  program: function(e, t) {
    return function(n, r) {
      return r = r || {}, e(n, r.data || t)
    }
  },
  noop: function() {
    return ""
  },
  invokePartial: function(e, t, n, r, i, s) {
    var o = {
      helpers: r,
      partials: i,
      data: s
    };
    if (e === undefined) throw new Handlebars.Exception("The partial " + t + " could not be found");
    if (e instanceof Function) return e(n, o);
    if (!Handlebars.compile) throw new Handlebars.Exception("The partial " + t + " could not be compiled when running in runtime-only mode");
    return i[t] = Handlebars.compile(e, {
      data: s !== undefined
    }), i[t](n, o)
  }
}, Handlebars.template = Handlebars.VM.template;