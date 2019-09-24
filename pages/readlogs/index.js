function t(t) {
    if (Array.isArray(t)) {
        for (var i = 0, e = Array(t.length); i < t.length; i++) e[i] = t[i];
        return e;
    }
    return Array.from(t);
}

var i = require("../../utils/request"), e = require("../../utils/auth"), r = require("../../utils/onerror");

Page({
    data: {
        start: 0,
        limit: 20,
        list: [],
        finish: !1,
        fetching: !1,
        ready: !1
    },
    onShow: function() {
        this.load();
    },
    load: function() {
        var t = this;
        e.ensureLogin(function() {
            return t.fetch();
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : r(t);
        }).done();
    },
    fetch: function() {
        var e = this, r = this.data, a = r.fetching, n = r.finish, s = r.start, o = r.limit, u = r.list;
        if (!a && !n) return this.setData({
            fetching: !0
        }), wx.showLoading({
            title: "玩命加载中"
        }), i({
            url: "/v1/my/readlogs",
            data: {
                start: s,
                limit: o
            }
        }).then(function(i) {
            var r = i.data.map(function(t) {
                return t.percent = 0 === Number(t.article_count) ? "0%" : parseFloat((t.chapter_idx / t.article_count * 100).toFixed(2)) + "%", 
                t.article_title = t.article_title ? t.article_title.replace(/(^\s*)|(\s*$)/g, "") : "", 
                t;
            });
            e.setData({
                finish: r.length < o,
                start: s + r.length,
                list: [].concat(t(u), t(r))
            });
        }).finally(function() {
            e.setData({
                fetching: !1,
                ready: !0
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    }
});