function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

function e(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

var a = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var a = arguments[e];
        for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (t[i] = a[i]);
    }
    return t;
}, i = require("../../utils/request"), r = require("../../vendor/moment"), n = require("../../utils/auth"), s = require("../../utils/onerror");

Page({
    data: {
        tab: "consume",
        tabs: [ {
            name: "消费记录",
            label: "consume"
        }, {
            name: "充值记录",
            label: "orders"
        } ],
        consume: {
            start: 0,
            finish: !1,
            list: [],
            ready: !1
        },
        orders: {
            start: 0,
            finish: !1,
            list: [],
            ready: !1
        },
        limit: 20,
        fetching: !1
    },
    onShow: function() {
        this.load();
    },
    load: function() {
        var t = this;
        n.ensureLogin(function() {
            return t.fetch();
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : s(t);
        }).done();
    },
    fetch: function() {
        var n = this, s = this.data, o = s[s.tab];
        if (!s.fetching && !o.finish) return this.setData({
            fetching: !0
        }), wx.showLoading({
            title: "玩命加载中"
        }), i({
            url: "/v1/my/" + s.tab,
            data: {
                start: o.start,
                limit: s.limit
            }
        }).then(function(i) {
            var l, c = i.data.map(function(t) {
                return "consume" === s.tab ? (t.created_at = r(new Date(1e3 * t.created_at)).format("YYYY-MM-DD HH:mm"), 
                t.article_title = t.article_title ? t.article_title.replace(/(^\s*)|(\s*$)/g, "") : t.article_title, 
                t) : a({}, t, {
                    price: t.price / 100,
                    paid_at: r(new Date(1e3 * t.paid_at)).format("YYYY-MM-DD HH:mm")
                });
            });
            n.setData((t(l = {}, s.tab + ".start", o.start + c.length), t(l, s.tab + ".finish", c.length < s.limit), 
            t(l, s.tab + ".list", [].concat(e(o.list), e(c))), l));
        }).finally(function() {
            n.setData(t({
                fetching: !1
            }, s.tab + ".ready", !0)), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    switchTab: function(t) {
        var e = this.data, a = t.detail;
        e.tab !== a && (this.setData({
            tab: a
        }), wx.setNavigationBarTitle({
            title: "consume" === a ? "消费记录" : "充值记录"
        }), 0 !== e[a].list.length || e[a].finish || this.fetch());
    }
});