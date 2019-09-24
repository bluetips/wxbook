var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, n = "function" == typeof Symbol && "symbol" == t(Symbol.iterator) ? function(n) {
    return void 0 === n ? "undefined" : t(n);
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : void 0 === n ? "undefined" : t(n);
};

!function(t) {
    if ("function" == typeof bootstrap) bootstrap("promise", t); else if ("object" == ("undefined" == typeof exports ? "undefined" : n(exports)) && "object" == ("undefined" == typeof module ? "undefined" : n(module))) module.exports = t(); else if ("function" == typeof define && define.amd) define(t); else if ("undefined" != typeof ses) {
        if (!ses.ok()) return;
        ses.makeQ = t;
    } else {
        if ("undefined" == typeof window && "undefined" == typeof self) throw new Error("This environment was not anticipated by Q. Please file a bug.");
        var e = "undefined" != typeof window ? window : self, o = e.Q;
        e.Q = t(), e.Q.noConflict = function() {
            return e.Q = o, this;
        };
    }
}(function() {
    function t(t) {
        return function() {
            return C.apply(t, arguments);
        };
    }
    function e(t, e) {
        if (x && e.stack && "object" == (void 0 === t ? "undefined" : n(t)) && null !== t && t.stack) {
            for (var o = [], i = e; i; i = i.source) i.stack && (!t.__minimumStackCounter__ || t.__minimumStackCounter__ > i.stackCounter) && (A(t, "__minimumStackCounter__", {
                value: i.stackCounter,
                configurable: !0
            }), o.unshift(i.stack));
            o.unshift(t.stack);
            var u = function(t) {
                for (var n = t.split("\n"), e = [], o = 0; o < n.length; ++o) {
                    var i = n[o];
                    r(i) || -1 !== (u = i).indexOf("(module.js:") || -1 !== u.indexOf("(node.js:") || !i || e.push(i);
                }
                var u;
                return e.join("\n");
            }(o.join("\n" + M + "\n"));
            A(t, "stack", {
                value: u,
                configurable: !0
            });
        }
    }
    function o(t) {
        var n = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(t);
        if (n) return [ n[1], Number(n[2]) ];
        var e = /at ([^ ]+):(\d+):(?:\d+)$/.exec(t);
        if (e) return [ e[1], Number(e[2]) ];
        var o = /.*@(.+):(\d+)$/.exec(t);
        return o ? [ o[1], Number(o[2]) ] : void 0;
    }
    function r(t) {
        var n = o(t);
        if (!n) return !1;
        var e = n[0], r = n[1];
        return e === S && R <= r && r <= J;
    }
    function i() {
        if (x) try {
            throw new Error();
        } catch (e) {
            var t = e.stack.split("\n"), n = o(0 < t[0].indexOf("@") ? t[1] : t[2]);
            if (!n) return;
            return S = n[0], n[1];
        }
    }
    function u(t) {
        return t instanceof p ? t : y(t) ? (n = t, e = c(), u.nextTick(function() {
            try {
                n.then(e.resolve, e.reject, e.notify);
            } catch (t) {
                e.reject(t);
            }
        }), e.promise) : m(t);
        var n, e;
    }
    function c() {
        function t(t) {
            n = t, u.longStackSupport && x && (i.source = t), _(e, function(n, e) {
                u.nextTick(function() {
                    t.promiseDispatch.apply(t, e);
                });
            }, void 0), o = e = void 0;
        }
        var n, e = [], o = [], r = D(c.prototype), i = D(p.prototype);
        if (i.promiseDispatch = function(t, r, i) {
            var c = Q(arguments);
            e ? (e.push(c), "when" === r && i[1] && o.push(i[1])) : u.nextTick(function() {
                n.promiseDispatch.apply(n, c);
            });
        }, i.valueOf = function() {
            if (e) return i;
            var t = l(n);
            return d(t) && (n = t), t;
        }, i.inspect = function() {
            return n ? n.inspect() : {
                state: "pending"
            };
        }, u.longStackSupport && x) try {
            throw new Error();
        } catch (t) {
            i.stack = t.stack.substring(t.stack.indexOf("\n") + 1), i.stackCounter = B++;
        }
        return r.promise = i, r.resolve = function(e) {
            n || t(u(e));
        }, r.fulfill = function(e) {
            n || t(m(e));
        }, r.reject = function(e) {
            n || t(v(e));
        }, r.notify = function(t) {
            n || _(o, function(n, e) {
                u.nextTick(function() {
                    e(t);
                });
            }, void 0);
        }, r;
    }
    function f(t) {
        if ("function" != typeof t) throw new TypeError("resolver must be a function.");
        var n = c();
        try {
            t(n.resolve, n.reject, n.notify);
        } catch (t) {
            n.reject(t);
        }
        return n.promise;
    }
    function s(t) {
        return f(function(n, e) {
            for (var o = 0, r = t.length; o < r; o++) u(t[o]).then(n, e);
        });
    }
    function p(t, n, e) {
        void 0 === n && (n = function(t) {
            return v(new Error("Promise does not support operation: " + t));
        }), void 0 === e && (e = function() {
            return {
                state: "unknown"
            };
        });
        var o = D(p.prototype);
        if (o.promiseDispatch = function(e, r, i) {
            var u;
            try {
                u = t[r] ? t[r].apply(o, i) : n.call(o, r, i);
            } catch (e) {
                u = v(e);
            }
            e && e(u);
        }, o.inspect = e) {
            var r = e();
            "rejected" === r.state && (o.exception = r.reason), o.valueOf = function() {
                var t = e();
                return "pending" === t.state || "rejected" === t.state ? o : t.value;
            };
        }
        return o;
    }
    function a(t, n, e, o) {
        return u(t).then(n, e, o);
    }
    function l(t) {
        if (d(t)) {
            var n = t.inspect();
            if ("fulfilled" === n.state) return n.value;
        }
        return t;
    }
    function d(t) {
        return t instanceof p;
    }
    function y(t) {
        return (n = t) === Object(n) && "function" == typeof t.then;
        var n;
    }
    function h() {
        H.length = 0, L.length = 0, z || (z = !0);
    }
    function v(t) {
        var e, o, r = p({
            when: function(e) {
                return e && function(t) {
                    if (z) {
                        var e = N(L, t);
                        -1 !== e && ("object" == ("undefined" == typeof process ? "undefined" : n(process)) && "function" == typeof process.emit && u.nextTick.runAfter(function() {
                            var n = N(q, t);
                            -1 !== n && (process.emit("rejectionHandled", H[e], t), q.splice(n, 1));
                        }), L.splice(e, 1), H.splice(e, 1));
                    }
                }(this), e ? e(t) : this;
            }
        }, function() {
            return this;
        }, function() {
            return {
                state: "rejected",
                reason: t
            };
        });
        return e = r, o = t, z && ("object" == ("undefined" == typeof process ? "undefined" : n(process)) && "function" == typeof process.emit && u.nextTick.runAfter(function() {
            -1 !== N(L, e) && (process.emit("unhandledRejection", o, e), q.push(e));
        }), L.push(e), o && void 0 !== o.stack ? H.push(o.stack) : H.push("(no stack) " + o)), 
        r;
    }
    function m(t) {
        return p({
            when: function() {
                return t;
            },
            get: function(n) {
                return t[n];
            },
            set: function(n, e) {
                t[n] = e;
            },
            delete: function(n) {
                delete t[n];
            },
            post: function(n, e) {
                return null == n ? t.apply(void 0, e) : t[n].apply(t, e);
            },
            apply: function(n, e) {
                return t.apply(n, e);
            },
            keys: function() {
                return U(t);
            }
        }, void 0, function() {
            return {
                state: "fulfilled",
                value: t
            };
        });
    }
    function k(t, n, e) {
        return u(t).spread(n, e);
    }
    function w(t, n, e) {
        return u(t).dispatch(n, e);
    }
    function j(t) {
        return a(t, function(t) {
            var n = 0, e = c();
            return _(t, function(o, r, i) {
                var u;
                d(r) && "fulfilled" === (u = r.inspect()).state ? t[i] = u.value : (++n, a(r, function(o) {
                    t[i] = o, 0 == --n && e.resolve(t);
                }, e.reject, function(t) {
                    e.notify({
                        index: i,
                        value: t
                    });
                }));
            }, void 0), 0 === n && e.resolve(t), e.promise;
        });
    }
    function b(t) {
        if (0 === t.length) return u.resolve();
        var n = u.defer(), e = 0;
        return _(t, function(o, r, i) {
            var u = t[i];
            e++, a(u, function(t) {
                n.resolve(t);
            }, function(t) {
                0 == --e && (t.message = "Q can't get fulfillment value from any promise, all promises were rejected. Last error message: " + t.message, 
                n.reject(t));
            }, function(t) {
                n.notify({
                    index: i,
                    value: t
                });
            });
        }, void 0), n.promise;
    }
    function g(t) {
        return a(t, function(t) {
            return t = P(t, u), a(j(P(t, function(t) {
                return a(t, E, E);
            })), function() {
                return t;
            });
        });
    }
    var x = !1;
    try {
        throw new Error();
    } catch (t) {
        x = !!t.stack;
    }
    var S, T, R = i(), E = function() {}, O = function() {
        function t() {
            for (var t, n; o.next; ) t = (o = o.next).task, o.task = void 0, (n = o.domain) && (o.domain = void 0, 
            n.enter()), e(t, n);
            for (;f.length; ) e(t = f.pop());
            i = !1;
        }
        function e(n, e) {
            try {
                n();
            } catch (n) {
                if (c) throw e && e.exit(), setTimeout(t, 0), e && e.enter(), n;
                setTimeout(function() {
                    throw n;
                }, 0);
            }
            e && e.exit();
        }
        var o = {
            task: void 0,
            next: null
        }, r = o, i = !1, u = void 0, c = !1, f = [];
        if (O = function(t) {
            r = r.next = {
                task: t,
                domain: c && process.domain,
                next: null
            }, i || (i = !0, u());
        }, "object" == ("undefined" == typeof process ? "undefined" : n(process)) && "[object process]" === process.toString() && process.nextTick) c = !0, 
        u = function() {
            process.nextTick(t);
        }; else if ("function" == typeof setImmediate) u = "undefined" != typeof window ? setImmediate.bind(window, t) : function() {
            setImmediate(t);
        }; else if ("undefined" != typeof MessageChannel) {
            var s = new MessageChannel();
            s.port1.onmessage = function() {
                u = p, (s.port1.onmessage = t)();
            };
            var p = function() {
                s.port2.postMessage(0);
            };
            u = function() {
                setTimeout(t, 0), p();
            };
        } else u = function() {
            setTimeout(t, 0);
        };
        return O.runAfter = function(t) {
            f.push(t), i || (i = !0, u());
        }, O;
    }(), C = Function.call, Q = t(Array.prototype.slice), _ = t(Array.prototype.reduce || function(t, n) {
        var e = 0, o = this.length;
        if (1 === arguments.length) for (;;) {
            if (e in this) {
                n = this[e++];
                break;
            }
            if (++e >= o) throw new TypeError();
        }
        for (;e < o; e++) e in this && (n = t(n, this[e], e));
        return n;
    }), N = t(Array.prototype.indexOf || function(t) {
        for (var n = 0; n < this.length; n++) if (this[n] === t) return n;
        return -1;
    }), P = t(Array.prototype.map || function(t, n) {
        var e = this, o = [];
        return _(e, function(r, i, u) {
            o.push(t.call(n, i, u, e));
        }, void 0), o;
    }), D = Object.create || function(t) {
        function n() {}
        return n.prototype = t, new n();
    }, A = Object.defineProperty || function(t, n, e) {
        return t[n] = e.value, t;
    }, I = t(Object.prototype.hasOwnProperty), U = Object.keys || function(t) {
        var n = [];
        for (var e in t) I(t, e) && n.push(e);
        return n;
    }, F = t(Object.prototype.toString);
    T = "undefined" != typeof ReturnValue ? ReturnValue : function(t) {
        this.value = t;
    };
    var M = "From previous event:";
    (u.resolve = u).nextTick = O, u.longStackSupport = !1;
    var B = 1;
    "object" == ("undefined" == typeof process ? "undefined" : n(process)) && process && process.env && process.env.Q_DEBUG && (u.longStackSupport = !0), 
    (u.defer = c).prototype.makeNodeResolver = function() {
        var t = this;
        return function(n, e) {
            n ? t.reject(n) : 2 < arguments.length ? t.resolve(Q(arguments, 1)) : t.resolve(e);
        };
    }, u.Promise = f, (u.promise = f).race = s, f.all = j, f.reject = v, (f.resolve = u).passByCopy = function(t) {
        return t;
    }, p.prototype.passByCopy = function() {
        return this;
    }, u.join = function(t, n) {
        return u(t).join(n);
    }, p.prototype.join = function(t) {
        return u([ this, t ]).spread(function(t, n) {
            if (t === n) return t;
            throw new Error("Q can't join: not the same: " + t + " " + n);
        });
    }, u.race = s, p.prototype.race = function() {
        return this.then(u.race);
    }, (u.makePromise = p).prototype.toString = function() {
        return "[object Promise]";
    }, p.prototype.then = function(t, n, o) {
        var r = this, i = c(), f = !1;
        return u.nextTick(function() {
            r.promiseDispatch(function(n) {
                f || (f = !0, i.resolve(function(n) {
                    try {
                        return "function" == typeof t ? t(n) : n;
                    } catch (n) {
                        return v(n);
                    }
                }(n)));
            }, "when", [ function(t) {
                f || (f = !0, i.resolve(function(t) {
                    if ("function" == typeof n) {
                        e(t, r);
                        try {
                            return n(t);
                        } catch (t) {
                            return v(t);
                        }
                    }
                    return v(t);
                }(t)));
            } ]);
        }), r.promiseDispatch(void 0, "when", [ void 0, function(t) {
            var n, e, r = !1;
            try {
                e = t, n = "function" == typeof o ? o(e) : e;
            } catch (t) {
                if (r = !0, !u.onerror) throw t;
                u.onerror(t);
            }
            r || i.notify(n);
        } ]), i.promise;
    }, u.tap = function(t, n) {
        return u(t).tap(n);
    }, p.prototype.tap = function(t) {
        return t = u(t), this.then(function(n) {
            return t.fcall(n).thenResolve(n);
        });
    }, u.when = a, p.prototype.thenResolve = function(t) {
        return this.then(function() {
            return t;
        });
    }, u.thenResolve = function(t, n) {
        return u(t).thenResolve(n);
    }, p.prototype.thenReject = function(t) {
        return this.then(function() {
            throw t;
        });
    }, u.thenReject = function(t, n) {
        return u(t).thenReject(n);
    }, u.nearer = l, u.isPromise = d, u.isPromiseAlike = y, u.isPending = function(t) {
        return d(t) && "pending" === t.inspect().state;
    }, p.prototype.isPending = function() {
        return "pending" === this.inspect().state;
    }, u.isFulfilled = function(t) {
        return !d(t) || "fulfilled" === t.inspect().state;
    }, p.prototype.isFulfilled = function() {
        return "fulfilled" === this.inspect().state;
    }, u.isRejected = function(t) {
        return d(t) && "rejected" === t.inspect().state;
    }, p.prototype.isRejected = function() {
        return "rejected" === this.inspect().state;
    };
    var $, V, G, H = [], L = [], q = [], z = !0;
    u.resetUnhandledRejections = h, u.getUnhandledReasons = function() {
        return H.slice();
    }, u.stopUnhandledRejectionTracking = function() {
        h(), z = !1;
    }, h(), u.reject = v, u.fulfill = m, u.master = function(t) {
        return p({
            isDef: function() {}
        }, function(n, e) {
            return w(t, n, e);
        }, function() {
            return u(t).inspect();
        });
    }, u.spread = k, p.prototype.spread = function(t, n) {
        return this.all().then(function(n) {
            return t.apply(void 0, n);
        }, n);
    }, u.async = function(t) {
        return function() {
            function n(t, n) {
                var i, c;
                if ("undefined" == typeof StopIteration) {
                    try {
                        i = e[t](n);
                    } catch (t) {
                        return v(t);
                    }
                    return i.done ? u(i.value) : a(i.value, o, r);
                }
                try {
                    i = e[t](n);
                } catch (t) {
                    return "[object StopIteration]" === F(c = t) || c instanceof T ? u(t.value) : v(t);
                }
                return a(i, o, r);
            }
            var e = t.apply(this, arguments), o = n.bind(n, "next"), r = n.bind(n, "throw");
            return o();
        };
    }, u.spawn = function(t) {
        u.done(u.async(t)());
    }, u.return = function(t) {
        throw new T(t);
    }, u.promised = function(t) {
        return function() {
            return k([ this, j(arguments) ], function(n, e) {
                return t.apply(n, e);
            });
        };
    }, u.dispatch = w, p.prototype.dispatch = function(t, n) {
        var e = this, o = c();
        return u.nextTick(function() {
            e.promiseDispatch(o.resolve, t, n);
        }), o.promise;
    }, u.get = function(t, n) {
        return u(t).dispatch("get", [ n ]);
    }, p.prototype.get = function(t) {
        return this.dispatch("get", [ t ]);
    }, u.set = function(t, n, e) {
        return u(t).dispatch("set", [ n, e ]);
    }, p.prototype.set = function(t, n) {
        return this.dispatch("set", [ t, n ]);
    }, u.del = u.delete = function(t, n) {
        return u(t).dispatch("delete", [ n ]);
    }, p.prototype.del = p.prototype.delete = function(t) {
        return this.dispatch("delete", [ t ]);
    }, u.mapply = u.post = function(t, n, e) {
        return u(t).dispatch("post", [ n, e ]);
    }, p.prototype.mapply = p.prototype.post = function(t, n) {
        return this.dispatch("post", [ t, n ]);
    }, u.send = u.mcall = u.invoke = function(t, n) {
        return u(t).dispatch("post", [ n, Q(arguments, 2) ]);
    }, p.prototype.send = p.prototype.mcall = p.prototype.invoke = function(t) {
        return this.dispatch("post", [ t, Q(arguments, 1) ]);
    }, u.fapply = function(t, n) {
        return u(t).dispatch("apply", [ void 0, n ]);
    }, p.prototype.fapply = function(t) {
        return this.dispatch("apply", [ void 0, t ]);
    }, u.try = u.fcall = function(t) {
        return u(t).dispatch("apply", [ void 0, Q(arguments, 1) ]);
    }, p.prototype.fcall = function() {
        return this.dispatch("apply", [ void 0, Q(arguments) ]);
    }, u.fbind = function(t) {
        var n = u(t), e = Q(arguments, 1);
        return function() {
            return n.dispatch("apply", [ this, e.concat(Q(arguments)) ]);
        };
    }, p.prototype.fbind = function() {
        var t = this, n = Q(arguments);
        return function() {
            return t.dispatch("apply", [ this, n.concat(Q(arguments)) ]);
        };
    }, u.keys = function(t) {
        return u(t).dispatch("keys", []);
    }, p.prototype.keys = function() {
        return this.dispatch("keys", []);
    }, u.all = j, p.prototype.all = function() {
        return j(this);
    }, u.any = b, p.prototype.any = function() {
        return b(this);
    }, u.allResolved = ($ = g, V = "allResolved", G = "allSettled", function() {
        return "undefined" != typeof console && "function" == typeof console.warn && console.warn(V + " is deprecated, use " + G + " instead.", new Error("").stack), 
        $.apply($, arguments);
    }), p.prototype.allResolved = function() {
        return g(this);
    }, u.allSettled = function(t) {
        return u(t).allSettled();
    }, p.prototype.allSettled = function() {
        return this.then(function(t) {
            return j(P(t, function(t) {
                function n() {
                    return t.inspect();
                }
                return (t = u(t)).then(n, n);
            }));
        });
    }, u.fail = u.catch = function(t, n) {
        return u(t).then(void 0, n);
    }, p.prototype.fail = p.prototype.catch = function(t) {
        return this.then(void 0, t);
    }, u.progress = function(t, n) {
        return u(t).then(void 0, void 0, n);
    }, p.prototype.progress = function(t) {
        return this.then(void 0, void 0, t);
    }, u.fin = u.finally = function(t, n) {
        return u(t).finally(n);
    }, p.prototype.fin = p.prototype.finally = function(t) {
        if (!t || "function" != typeof t.apply) throw new Error("Q can't apply finally callback");
        return t = u(t), this.then(function(n) {
            return t.fcall().then(function() {
                return n;
            });
        }, function(n) {
            return t.fcall().then(function() {
                throw n;
            });
        });
    }, u.done = function(t, n, e, o) {
        return u(t).done(n, e, o);
    }, p.prototype.done = function(t, o, r) {
        var i = function(t) {
            u.nextTick(function() {
                if (e(t, c), !u.onerror) throw t;
                u.onerror(t);
            });
        }, c = t || o || r ? this.then(t, o, r) : this;
        "object" == ("undefined" == typeof process ? "undefined" : n(process)) && process && process.domain && (i = process.domain.bind(i)), 
        c.then(void 0, i);
    }, u.timeout = function(t, n, e) {
        return u(t).timeout(n, e);
    }, p.prototype.timeout = function(t, n) {
        var e = c(), o = setTimeout(function() {
            n && "string" != typeof n || ((n = new Error(n || "Timed out after " + t + " ms")).code = "ETIMEDOUT"), 
            e.reject(n);
        }, t);
        return this.then(function(t) {
            clearTimeout(o), e.resolve(t);
        }, function(t) {
            clearTimeout(o), e.reject(t);
        }, e.notify), e.promise;
    }, u.delay = function(t, n) {
        return void 0 === n && (n = t, t = void 0), u(t).delay(n);
    }, p.prototype.delay = function(t) {
        return this.then(function(n) {
            var e = c();
            return setTimeout(function() {
                e.resolve(n);
            }, t), e.promise;
        });
    }, u.nfapply = function(t, n) {
        return u(t).nfapply(n);
    }, p.prototype.nfapply = function(t) {
        var n = c(), e = Q(t);
        return e.push(n.makeNodeResolver()), this.fapply(e).fail(n.reject), n.promise;
    }, u.nfcall = function(t) {
        var n = Q(arguments, 1);
        return u(t).nfapply(n);
    }, p.prototype.nfcall = function() {
        var t = Q(arguments), n = c();
        return t.push(n.makeNodeResolver()), this.fapply(t).fail(n.reject), n.promise;
    }, u.nfbind = u.denodeify = function(t) {
        if (void 0 === t) throw new Error("Q can't wrap an undefined function");
        var n = Q(arguments, 1);
        return function() {
            var e = n.concat(Q(arguments)), o = c();
            return e.push(o.makeNodeResolver()), u(t).fapply(e).fail(o.reject), o.promise;
        };
    }, p.prototype.nfbind = p.prototype.denodeify = function() {
        var t = Q(arguments);
        return t.unshift(this), u.denodeify.apply(void 0, t);
    }, u.nbind = function(t, n) {
        var e = Q(arguments, 2);
        return function() {
            var o = e.concat(Q(arguments)), r = c();
            return o.push(r.makeNodeResolver()), u(function() {
                return t.apply(n, arguments);
            }).fapply(o).fail(r.reject), r.promise;
        };
    }, p.prototype.nbind = function() {
        var t = Q(arguments, 0);
        return t.unshift(this), u.nbind.apply(void 0, t);
    }, u.nmapply = u.npost = function(t, n, e) {
        return u(t).npost(n, e);
    }, p.prototype.nmapply = p.prototype.npost = function(t, n) {
        var e = Q(n || []), o = c();
        return e.push(o.makeNodeResolver()), this.dispatch("post", [ t, e ]).fail(o.reject), 
        o.promise;
    }, u.nsend = u.nmcall = u.ninvoke = function(t, n) {
        var e = Q(arguments, 2), o = c();
        return e.push(o.makeNodeResolver()), u(t).dispatch("post", [ n, e ]).fail(o.reject), 
        o.promise;
    }, p.prototype.nsend = p.prototype.nmcall = p.prototype.ninvoke = function(t) {
        var n = Q(arguments, 1), e = c();
        return n.push(e.makeNodeResolver()), this.dispatch("post", [ t, n ]).fail(e.reject), 
        e.promise;
    }, u.nodeify = function(t, n) {
        return u(t).nodeify(n);
    }, p.prototype.nodeify = function(t) {
        return t ? void this.then(function(n) {
            u.nextTick(function() {
                t(null, n);
            });
        }, function(n) {
            u.nextTick(function() {
                t(n);
            });
        }) : this;
    }, u.noConflict = function() {
        throw new Error("Q.noConflict only works when Q is used as a global");
    };
    var J = i();
    return u;
});