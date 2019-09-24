function e(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

function t(e) {
    if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
    }
    return Array.from(e);
}

var n = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
}, i = require("../../utils/request"), a = require("../../utils/onerror");

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
        male: {
            fetching: !1,
            start: 0,
            finish: !1,
            list: []
        },
        female: {
            fetching: !1,
            start: 0,
            finish: !1,
            list: []
        },
        limit: 10,
        profile: null,
        ready: !1,
        offline: !1
    },
    onShow: function() {
        var e = this;
        wx.getNetworkType({
            success: function(t) {
                "none" === t.networkType ? e.setData({
                    offline: !0
                }) : (e.setData({
                    offline: !1
                }), e.load());
            }
        });
    },
    load: function() {
        var e = this, t = getApp(), n = this.data;
        t.getProfile().then(function(t) {
            e.setData({
                profile: t,
                gender: 2 === t.sex ? "female" : "male"
            });
        }).catch(function(e) {
            90002 !== e.code && a(e);
        }).finally(function() {
            0 === n[n.gender].list.length && e.fetch();
        });
    },
    fetch: function() {
        var r = this, l = this.data, o = l[l.gender], s = o.fetching, f = o.finish, c = o.start, d = o.list;
        if (!s && !f) return this.setData({
            fetching: !0
        }), wx.showLoading({
            title: "玩命加载中"
        }), i({
            url: "/v1/miniprogram/recommends",
            data: {
                start: c,
                gender: l.gender,
                limit: l.limit
            }
        }).then(function(i) {
            var a, o = i.data.map(function(e) {
                return n({}, e, {
                    roles: e.roles.join("、")
                });
            });
            r.setData((e(a = {}, l.gender + ".start", c + o.length), e(a, l.gender + ".finish", d.length + o.length >= i.total), 
            e(a, l.gender + ".list", [].concat(t(d), t(o))), a));
        }).catch(a).finally(function() {
            var t;
            r.setData((e(t = {}, l.gender + ".fetching", !1), e(t, "ready", !0), t)), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    switchTab: function(e) {
        var t = this.data, n = t.gender, i = t.offline;
        n !== e.detail && (this.setData({
            gender: e.detail
        }), i || this.fetch());
    },
    readArticle: function(e) {
        wx.navigateTo({
            url: "/pages/read/index?id=" + e.detail.first_article_id + "&nid=" + e.detail.id
        });
    },
    goToIntro: function(e) {
        wx.navigateTo({
            url: "/pages/intro/index?id=" + e.detail
        });
    },
    onShareAppMessage: function() {
        return {
            title: "二十年来最好的免费网文全在这了，快进来看",
            path: "/pages/index/index"
        };
    }
});