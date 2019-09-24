function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
        return i;
    }
    return Array.from(t);
}

var e = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];
        for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
    }
    return t;
}, i = require("../../utils/auth"), r = require("../../utils/onerror"), n = require("../../utils/request"), a = require("../../vendor/moment");

Page({
    data: {
        ready: !1,
        profile: {},
        invitees: [],
        start: 0,
        limit: 20,
        finish: !1,
        fetching: !1,
        isVisible: !1
    },
    onLoad: function() {
        this.load();
    },
    load: function() {
        var t = this;
        i.ensureLogin(function() {
            return t.fetch();
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : r(t);
        });
    },
    fetch: function() {
        var i = this, r = this.data;
        if (!r.fetching && !r.finish) return this.setData({
            fetching: !0
        }), wx.showLoading({
            title: "玩命加载中"
        }), console.log("------------------分隔线-----------------"), n({
            url: "/v1/miniprogram/my/invitees",
            data: {
                start: r.start
            }
        }).then(function(n) {
            var o = n.data.map(function(t) {
                return console.log(new Date(t.created_at.replace("-", "/")).getTime() / 1e3), e({}, t, {
                    join_at: a(t.created_at).format("YYYY-MM-DD HH:mm")
                });
            });
            i.setData({
                start: r.start + o.length,
                finish: o.length < r.limit,
                invitees: [].concat(t(r.invitees), t(o))
            });
        }).finally(function() {
            i.setData({
                fetching: !1
            }), wx.hideLoading();
        });
    }
});