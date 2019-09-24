var t = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var r = arguments[e];
        for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
}, e = function(t, e) {
    if (Array.isArray(t)) return t;
    if (Symbol.iterator in Object(t)) return function(t, e) {
        var r = [], a = !0, n = !1, i = void 0;
        try {
            for (var o, u = t[Symbol.iterator](); !(a = (o = u.next()).done) && (r.push(o.value), 
            !e || r.length !== e); a = !0) ;
        } catch (t) {
            n = !0, i = t;
        } finally {
            try {
                !a && u.return && u.return();
            } finally {
                if (n) throw i;
            }
        }
        return r;
    }(t, e);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, r = require("../../utils/request"), a = require("../../utils/auth"), n = require("../../utils/onerror"), i = require("../../vendor/q");

Page({
    data: {
        profile: null,
        products: [],
        status: !1,
        ready: !1
    },
    onShow: function() {
        var o = this;
        wx.showLoading({
            title: "玩命加载中"
        }), a.ensureLogin(function() {
            return i.all([ r({
                url: "/v1/my/profile"
            }), r({
                url: "/v1/products"
            }) ]).then(function(r) {
                var a = e(r, 2), n = a[0], i = a[1];
                o.setData({
                    profile: n.data,
                    products: i.data.map(function(e) {
                        return t({}, e, {
                            welth: 0 === e.reward_welth ? e.name : e.welth + "+" + e.reward_welth + "(赠)书币"
                        });
                    })
                });
            }).catch(n);
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : n(t);
        }).finally(function() {
            o.setData({
                ready: !0
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    recharge: function(e) {
        var a = this;
        if (!this.data.status) {
            this.setData({
                status: !0
            });
            var i = e.currentTarget.dataset.id, o = this.options.aid || "";
            r({
                url: "/v1/orders",
                method: "POST",
                data: {
                    product_id: i,
                    payment_gateway: 1,
                    from_article_id: o
                }
            }).then(function(e) {
                wx.requestPayment(t({}, e.data.pay_params, {
                    success: function(t) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success"
                        }), console.log("支付成功", t), setTimeout(function() {
                            wx.navigateBack();
                        }, 1500);
                    },
                    fail: function(t) {
                        wx.showToast({
                            icon: "none",
                            title: "支付失败"
                        }), console.log("支付失败", t);
                    }
                }));
            }).catch(n).finally(function() {
                a.setData({
                    status: !1
                });
            });
        }
    }
});