function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
    }
    return e;
}, a = function(e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e)) return function(e, t) {
        var a = [], i = !0, r = !1, n = void 0;
        try {
            for (var l, s = e[Symbol.iterator](); !(i = (l = s.next()).done) && (a.push(l.value), 
            !t || a.length !== t); i = !0) ;
        } catch (e) {
            r = !0, n = e;
        } finally {
            try {
                !i && s.return && s.return();
            } finally {
                if (r) throw n;
            }
        }
        return a;
    }(e, t);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, i = require("../../vendor/q"), r = require("../../utils/request"), n = require("../../utils/onerror"), l = require("../../vendor/moment"), s = require("../../utils/auth");

Page({
    data: {
        tabs: [ {
            name: "男生频道",
            label: "male"
        }, {
            name: "女生频道",
            label: "female"
        } ],
        gender: "male",
        page: 0,
        limit: 10,
        total: 0,
        fetching: !1,
        finish: !1,
        ready: !1,
        categories: {
            female: [],
            male: []
        },
        height: {
            female: 0,
            male: 0
        },
        list: [],
        filter: {
            category: "",
            status: "",
            length_type: ""
        },
        top: 0,
        fixed: !1,
        collapse: !1,
        style: "",
        utype: null,
        isiOS: !1
    },
    onLoad: function() {
        var e = this;
        wx.createSelectorQuery().select(".content").boundingClientRect(function(t) {
            e.setData({
                top: t.top
            });
        }).exec();
    },
    onShow: function() {
        this.getCategories();
    },
    switchGender: function(e) {
        var t = this.data, a = t.gender, i = t.height;
        a !== e.detail && (this.setData({
            filter: {
                category: "",
                status: "",
                length_type: ""
            },
            ready: !1,
            gender: e.detail,
            finish: !1,
            page: 0,
            list: []
        }), 0 === i[e.detail] && this.calcHeight(), this.fetch());
    },
    getCategories: function() {
        var e = this, t = getApp();
        s.ensureLogin(function() {
            return i.all([ t.getProfile(), r({
                url: "/v1/categories"
            }) ]).then(function(t) {
                var i = a(t, 2), r = i[0], n = [], l = [];
                i[1].data.forEach(function(e) {
                    "female" === e.gender ? n.push(e) : l.push(e);
                }), e.setData({
                    gender: r && 2 === r.sex ? "female" : "male",
                    categories: {
                        female: n,
                        male: l
                    }
                });
            }).finally(function() {
                e.calcHeight(), e.fetch();
            });
        }).catch(function(e) {
            "auth_refused" === e.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : n(e);
        });
    },
    fetch: function() {
        var a = this, i = this.data, s = i.fetching, o = i.finish, c = i.gender, f = i.limit, u = i.filter, h = i.page;
        if (!s && !o) {
            this.setData({
                fetching: !0
            }), wx.showLoading({
                title: "玩命加载中"
            });
            var g = {
                gender: c,
                start: h * f,
                limit: f
            };
            r({
                url: "/v1/search",
                data: Object.assign({}, g, u)
            }).then(function(i) {
                var r = i.data.map(function(e) {
                    return t({}, e, {
                        free_time_start: "free" === u.status ? l(1e3 * e.free_time_start).format("YYYY-MM-DD") : e.free_time_start,
                        free_time_end: "free" === u.status ? l(1e3 * e.free_time_end).format("YYYY-MM-DD") : e.free_time_end
                    });
                });
                a.setData(e({
                    finish: 0 === r.length || r.length < f,
                    page: h + 1,
                    total: i.total
                }, "list[" + h + "]", r));
            }).catch(n).finally(function() {
                a.setData({
                    ready: !0,
                    fetching: !1
                }), setTimeout(function() {
                    wx.hideLoading();
                }, 200);
            });
        }
    },
    reload: function(e) {
        var t = this.data.filter, a = e.currentTarget.dataset;
        this.setData({
            filter: Object.assign({}, t, a),
            finish: !1,
            ready: !1,
            page: 0,
            list: []
        }), this.fetch();
    },
    calcHeight: function() {
        var t = this, a = this.data.gender;
        wx.createSelectorQuery().select(".filter-groups").boundingClientRect(function(i) {
            t.setData(e({}, "height." + a, i.height));
        }).exec();
    },
    scroll: function(e) {
        var t = this.data, a = t.height, i = t.gender, r = t.fixed, n = t.collapse, l = t.top, s = e.detail.scrollTop;
        !(s > a[i]) || r && n ? s <= a[i] && r && this.setData({
            fixed: !1,
            style: "",
            collapse: !1
        }) : this.setData({
            fixed: !0,
            style: "top:" + l + "px",
            collapse: !0
        });
    },
    expand: function() {
        this.setData({
            collapse: !1
        });
    }
});