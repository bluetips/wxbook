function t(t) {
    if (Array.isArray(t)) {
        for (var i = 0, n = Array(t.length); i < t.length; i++) n[i] = t[i];
        return n;
    }
    return Array.from(t);
}

var i = Object.assign || function(t) {
    for (var i = 1; i < arguments.length; i++) {
        var n = arguments[i];
        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a]);
    }
    return t;
}, n = require("../../utils/request"), a = require("../../vendor/moment"), e = require("../../utils/onerror");

Page({
    data: {
        start: 0,
        limit: 20,
        list: [],
        finish: !1,
        fetching: !1,
        ready: !1
    },
    onLoad: function() {
        this.fetch();
    },
    fetch: function() {
        var r = this, s = this.data, o = s.fetching, c = s.finish, h = s.start, u = s.limit, f = s.list, l = this.options.id;
        o || c || (this.setData({
            fetching: !0
        }), wx.showLoading({
            title: "玩命加载中"
        }), n({
            url: "/v1/novels/" + l + "/tips",
            data: {
                nid: l,
                start: h,
                limit: u
            }
        }).then(function(n) {
            var e = n.data.map(function(t) {
                return i({}, t, {
                    nickname: t.nickname || "云客",
                    headimgurl: t.headimgurl || "https://qcdn.pinchuzu.cn/spa/koala@2x.png",
                    created_at: a(new Date(1e3 * t.created_at)).format("YYYY-MM-DD HH:mm")
                });
            });
            r.setData({
                finish: 0 === e.length || e.length < u,
                start: h + e.length,
                list: [].concat(t(f), t(e))
            });
        }).catch(e).finally(function() {
            r.setData({
                fetching: !1,
                ready: !0
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        }));
    }
});