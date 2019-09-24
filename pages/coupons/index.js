function t(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

function e(t) {
    if (Array.isArray(t)) {
        for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
        return i;
    }
    return Array.from(t);
}

var i = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];
        for (var a in i) Object.prototype.hasOwnProperty.call(i, a) && (t[a] = i[a]);
    }
    return t;
}, a = require("../../utils/request"), r = require("../../vendor/moment"), n = require("../../utils/auth"), s = require("../../utils/onerror");

Page({
    data: {
        tab: "effective",
        tabs: [ {
            name: "可用书券",
            label: "effective"
        }, {
            name: "失效书券",
            label: "expire"
        } ],
        effective: {
            start: 0,
            finish: !1,
            list: []
        },
        expire: {
            start: 0,
            finish: !1,
            list: []
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
        var n = this, s = this.data, f = s[s.tab];
        if (!s.fetching && !f.finish) return this.setData({
            fetching: !0
        }), wx.showLoading({
            title: "玩命加载中"
        }), a({
            url: "/v1/my/welth_coupons",
            data: {
                valid: {
                    effective: 1,
                    expire: 0
                }[s.tab],
                start: f.start,
                limit: s.limit
            }
        }).then(function(a) {
            var o, l = a.data.map(function(t) {
                return i({}, t, {
                    iso_expired_at: r(t.iso_expired_at).format("YYYY-MM-DD HH:mm")
                });
            });
            n.setData((t(o = {}, s.tab + ".list", [].concat(e(f.list), e(l))), t(o, s.tab + ".start", f.start + l.length), 
            t(o, s.tab + ".finish", l.length < s.limit), o));
        }).finally(function() {
            n.setData({
                fetching: !1
            }), wx.hideLoading();
        });
    },
    switchTab: function(t) {
        var e = this.data, i = t.detail;
        e.tab !== i && (this.setData({
            tab: i
        }), wx.setNavigationBarTitle({
            title: "effective" === i ? "可用书券" : "失效书券"
        }), 0 !== e[i].list.length || e[i].finish || this.fetch());
    }
});