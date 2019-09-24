function e(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

var t = function(e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e)) return function(e, t) {
        var n = [], a = !0, i = !1, r = void 0;
        try {
            for (var o, s = e[Symbol.iterator](); !(a = (o = s.next()).done) && (n.push(o.value), 
            !t || n.length !== t); a = !0) ;
        } catch (e) {
            i = !0, r = e;
        } finally {
            try {
                !a && s.return && s.return();
            } finally {
                if (i) throw r;
            }
        }
        return n;
    }(e, t);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, n = require("../../vendor/q"), a = require("../../utils/request"), i = require("../../utils/onerror"), r = require("../../utils/auth");

require("../../config");

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
            fangtang_carousel: [],
            fangtang_weekly_recommend: [],
            fangtang_trending_list: [],
            fangtang_completed: [],
            fangtang_bestsell: [],
            ids: "",
            finish: !1
        },
        female: {
            fetching: !1,
            fangtang_carousel: [],
            fangtang_weekly_recommend: [],
            fangtang_trending_list: [],
            fangtang_completed: [],
            fangtang_bestsell: [],
            ids: "",
            finish: !1
        },
        limit: 10,
        profile: null,
        ready: !1,
        moreApp: null,
        offline: !1,
        task: [],
        activity: null
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
        var e = this, o = getApp(), s = this.data;
        r.ensureLogin(function() {
            return n.all([ o.getMiniApp(), o.getProfile(), a({
                url: "/v1/activity/miniapp"
            }) ]).then(function(n) {
                var a = t(n, 3), i = a[0], r = a[1], o = a[2];
                e.setData({
                    moreApp: i.more_wonderful,
                    activity: o.data,
                    profile: r,
                    gender: 2 === r.sex ? "female" : "male"
                });
            }).finally(function() {
                s[s.gender].fetching || e.fetch();
            });
        }).catch(function(e) {
            "auth_refused" === e.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : i(e);
        });
    },
    switchTab: function(e) {
        var t = this.data, n = e.detail;
        t.gender !== n && (this.setData({
            gender: n
        }), t.offline || t[n].fetching || this.fetch());
    },
    fetch: function() {
        var t = this, n = this.data;
        wx.showLoading({
            title: "玩命加载中"
        }), a({
            url: "/v1/lists/batch",
            data: {
                ids: "fangtang_carousel,fangtang_weekly_recommend",
                gender: n.gender
            }
        }).then(function(a) {
            var i, r = a.data, o = r.fangtang_weekly_recommend, s = r.fangtang_carousel;
            t.setData((e(i = {}, n.gender + ".fangtang_carousel", s), e(i, n.gender + ".fangtang_weekly_recommend", o.slice(0, 6)), 
            e(i, n.gender + ".ids", "fangtang_trending_list"), i));
        }).catch(i).finally(function() {
            var a;
            t.setData((e(a = {}, n.gender + ".fetching", !0), e(a, "ready", !0), a)), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    loadmore: function() {
        var t = this, n = this.data, r = n[n.gender];
        !r.finish && r.fetching && (this.setData(e({}, n.gender + ".fetching", !1)), wx.showLoading({
            title: "玩命加载中"
        }), a({
            url: "/v1/lists/batch",
            data: {
                ids: r.ids,
                gender: n.gender
            }
        }).then(function(a) {
            var i, o = r.ids, s = r.finish, f = a.data[o];
            "fangtang_trending_list" === o ? o = "fangtang_completed" : "fangtang_completed" === o ? (f = f.slice(0, 6), 
            o = "fangtang_bestsell") : s = !0, t.setData((e(i = {}, n.gender + "." + r.ids, f), 
            e(i, n.gender + ".ids", o), e(i, n.gender + ".finish", s), i));
        }).catch(i).finally(function() {
            t.setData(e({}, n.gender + ".fetching", !0)), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        }));
    },
    getTask: function() {
        var e = this;
        r.ensureLogin(function() {
            a({
                url: "/v1/my/tasks",
                data: {
                    type: 1
                }
            }).then(function(t) {
                var n = t.data.filter(function(e) {
                    return 1 === e.id;
                });
                e.setData({
                    task: n
                });
            });
        }).catch(function(e) {
            "auth_refused" !== e.code && i(e);
        }).done();
    },
    finishTask: function() {
        var e = this;
        return a({
            url: "/v1/my/tasks/1",
            data: {
                status: 3
            },
            method: "POST",
            extra: {
                "X-Http-Method-Override": "PATCH"
            }
        }).then(function() {
            wx.showToast({
                title: "领取成功",
                icon: "none"
            }), wx.setStorageSync("newcomer_task", new Date().getTime()), e.setData({
                task: []
            });
        }).catch(function() {
            wx.showToast({
                title: "领取失败",
                icon: "none"
            });
        }).done();
    },
    onShareAppMessage: function() {
        return {
            title: "二十年来最好的免费网文全在这了，快进来看",
            path: "/pages/discover/index"
        };
    }
});