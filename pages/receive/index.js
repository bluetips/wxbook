var t = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];
        for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
    }
    return t;
}, e = require("../../utils/request"), i = require("../../utils/auth"), n = require("../../utils/onerror"), a = require("../../vendor/moment"), o = getApp();

Page({
    data: {
        receive_list: [],
        is_find: !1,
        member: null,
        status: 0,
        ready: !1
    },
    onShow: function() {
        this.load();
    },
    load: function() {
        var t = this;
        wx.showLoading({
            title: "玩命加载中"
        }), i.ensureLogin(function() {
            if (t.options.key) return t.joinActivity();
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : n(t);
        }).finally(function() {
            setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    joinActivity: function() {
        var t = this;
        e({
            url: "/v1/lucky_king_events/" + this.options.key + "/lucky",
            method: "POST"
        }).then(function() {
            t.setData({
                is_find: !0
            });
        }).catch(function(e) {
            var i = e || {
                code: "unknown_error",
                message: "未知错误"
            };
            90601 === i.code ? t.setData({
                status: 1
            }) : 90603 === i.code ? t.setData({
                status: 2
            }) : 90602 === i.code ? t.setData({
                is_find: !0
            }) : n(e);
        }).finally(function() {
            t.getList();
        });
    },
    getList: function() {
        var i = this, r = this.data.is_find;
        e({
            url: "/v1/lucky_king_events/" + this.options.key
        }).then(function(e) {
            var n = e.data.winners;
            if (n && 0 < n.length) {
                var s = n.map(function(e) {
                    return t({}, e, {
                        iso_created_at: a(e.iso_created_at).format("YYYY-MM-DD HH:mm"),
                        iso_coupon_expired_at: a(e.iso_coupon_expired_at).format("YYYY-MM-DD HH:mm")
                    });
                });
                r && o.getProfile().then(function(e) {
                    var n = s.filter(function(t) {
                        return t.member_id === e.id;
                    });
                    i.setData({
                        member: n.map(function(e) {
                            return t({}, e, {
                                usable_amount: e.amount,
                                expired_at: e.iso_coupon_expired_at
                            });
                        })
                    });
                }), i.setData({
                    receive_list: s
                });
            }
        }).catch(n).finally(function() {
            i.setData({
                ready: !0
            });
        });
    }
});