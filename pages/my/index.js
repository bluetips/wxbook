var e = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
    }
    return e;
}, t = function(e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e)) return function(e, t) {
        var a = [], i = !0, n = !1, r = void 0;
        try {
            for (var o, c = e[Symbol.iterator](); !(i = (o = c.next()).done) && (a.push(o.value), 
            !t || a.length !== t); i = !0) ;
        } catch (e) {
            n = !0, r = e;
        } finally {
            try {
                !i && c.return && c.return();
            } finally {
                if (n) throw r;
            }
        }
        return a;
    }(e, t);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, a = require("../../vendor/q"), i = require("../../utils/request"), n = require("../../vendor/moment"), r = require("../../utils/auth"), o = require("../../utils/onerror");

Page({
    data: {
        profile: null,
        isiOS: !1,
        welth: 0,
        ready: !1,
        coupons: 0,
        hasCheckin: !1,
        checkin: null
    },
    onLoad: function() {
        var e = this;
        getApp().getSystemInfo().then(function(t) {
            e.setData({
                isiOS: "iOS" === t.system.substr(0, 3)
            });
        });
    },
    onShow: function() {
        var e = n().format("YYYY-MM-DD"), t = wx.getStorageSync("last_checkin_date");
        this.setData({
            hasCheckin: t === e
        }), this.init();
    },
    init: function() {
        var c = this;
        wx.showLoading({
            title: "玩命加载中"
        }), r.ensureLogin(function() {
            return a.all([ i({
                url: "/v1/my/profile"
            }), i({
                url: "/v1/my/welth_coupons/stats"
            }) ]).then(function(a) {
                var i = t(a, 2), r = i[0], o = i[1], s = r.data, h = o.data;
                0 < s.is_vip && 0 < s.vip_expiry_time && (s.vip_expiry_time = n(1e3 * s.vip_expiry_time).format("YYYY-MM-DD HH:mm")), 
                s.phone || wx.login({
                    success: function(e) {
                        return c.code = e.code;
                    }
                }), c.setData({
                    profile: e({}, s, {
                        headimgurl: s.headimgurl ? s.headimgurl.replace(/^\/\//, "https://") : "https://qcdn.pinchuzu.cn/spa/koala@2x.png",
                        phone: s.phone ? s.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") : ""
                    }),
                    ready: !0,
                    coupons: h.usable_total
                });
            });
        }).catch(function(e) {
            "auth_refused" === e.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : o(e);
        }).finally(function() {
            setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    bindPhoneNumber: function(e) {
        var t = this;
        e.detail && e.detail.iv && e.detail.encryptedData ? i({
            method: "POST",
            url: "/v1/miniprogram/binding",
            data: {
                iv: e.detail.iv,
                code: this.code,
                encryptedData: e.detail.encryptedData
            }
        }).then(function() {
            wx.showToast({
                title: "绑定成功",
                icon: "success"
            }), setTimeout(t.init, 1500);
        }).catch(o) : wx.navigateTo({
            url: "/pages/mobile/index"
        });
    },
    checkin: function() {
        var e = this, t = this.data, a = t.hasCheckin, r = t.profile;
        if (a) this.setData({
            checkin: {
                message: "今日已签",
                reward: wx.getStorageSync("last_checkin_wealth") || 0
            }
        }); else {
            var c = n().format("YYYY-MM-DD");
            i({
                url: "/v1/checkin",
                method: "POST"
            }).then(function(t) {
                wx.setStorage({
                    key: "last_checkin_date",
                    data: c
                }), wx.setStorage({
                    key: "last_checkin_wealth",
                    data: t.data.reward_welth
                }), e.setData({
                    hasCheckin: !0,
                    checkin: {
                        message: "签到成功",
                        reward: t.data.reward_welth
                    },
                    "profile.welth": r.welth + t.data.reward_welth
                });
            }).catch(function(t) {
                if (!t || 50001 !== t.code) return o(t);
                wx.setStorage({
                    key: "last_checkin_date",
                    data: c
                }), e.setData({
                    hasCheckin: !0,
                    checkin: {
                        message: "今日已签",
                        reward: 0
                    }
                });
            });
        }
    },
    closeModal: function() {
        this.setData({
            checkin: null
        });
    }
});