var n = function(n, t) {
    if (Array.isArray(n)) return n;
    if (Symbol.iterator in Object(n)) return function(n, t) {
        var e = [], r = !0, o = !1, i = void 0;
        try {
            for (var a, u = n[Symbol.iterator](); !(r = (a = u.next()).done) && (e.push(a.value), 
            !t || e.length !== t); r = !0) ;
        } catch (n) {
            o = !0, i = n;
        } finally {
            try {
                !r && u.return && u.return();
            } finally {
                if (o) throw i;
            }
        }
        return e;
    }(n, t);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, t = require("../../utils/onerror"), e = require("../../vendor/q"), r = require("../../utils/request"), o = require("../../utils/auth"), i = null;

Page({
    data: {
        stats: null,
        config: null,
        times: 0,
        ready: !1
    },
    onLoad: function() {
        var n = this;
        wx.createRewardedVideoAd && ((i = wx.createRewardedVideoAd({
            adUnitId: "adunit-ec9fe2c1d62744ea"
        })).onError(function(n) {
            console.log(n);
        }), i.onClose(function(t) {
            (t && t.isEnded || void 0 === t) && o.ensureLogin(function() {
                r({
                    url: "/v1/miniprogram/videos/reward",
                    method: "POST"
                }).then(function() {
                    n.load();
                });
            });
        })), getApp().getMiniApp().then(function(t) {
            n.setData({
                config: t.video_reward || null
            });
        }).finally(function() {
            n.load();
        });
    },
    load: function() {
        var i = this;
        o.ensureLogin(function() {
            return wx.showLoading({
                title: "玩命加载中"
            }), e.all([ r({
                url: "/v1/miniprogram/videos/reward_times_today"
            }), r({
                url: "/v1/my/welth_coupons/stats"
            }) ]).then(function(t) {
                var e = n(t, 2), r = e[0], o = e[1];
                i.setData({
                    times: r.data,
                    stats: o.data,
                    ready: !0
                });
            });
        }).catch(function(n) {
            "auth_refused" === n.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : t(n);
        }).finally(function() {
            wx.hideLoading();
        });
    },
    handleRewardVideo: function() {
        i && i.show().catch(function() {
            i.load().then(function() {
                return i.show();
            }).catch(function(n) {
                console.log("激励视频 广告显示失败", n);
            });
        });
    }
});