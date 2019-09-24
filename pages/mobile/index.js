var e = require("../../utils/request"), t = require("../../utils/auth"), n = require("../../utils/onerror"), o = null;

Page({
    data: {
        phone: "",
        sms: "",
        second: 0
    },
    onShow: function() {
        o && clearInterval(o);
    },
    handleCode: function() {
        var a = this;
        if (!this.data.phone.replace(/\s/g, "")) return wx.showToast({
            icon: "none",
            title: "请输入手机号"
        });
        t.ensureLogin(function() {
            return e({
                url: "/v1/sms/code",
                method: "POST",
                data: {
                    use: "bind",
                    phone: a.data.phone
                }
            }).then(function() {
                a.setData({
                    second: 60
                }), o = setInterval(function() {
                    return a.countdown();
                }, 1e3);
            });
        }).catch(function(e) {
            "auth_refused" === e.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : n(e);
        }).done();
    },
    countdown: function() {
        var e = this.data;
        this.setData({
            second: e.second - 1
        }), e.second <= 0 && clearInterval(o);
    },
    onInput: function(e) {
        var t = {};
        t[e.currentTarget.dataset.field] = e.detail.value.replace(/\D/g, ""), this.setData(t);
    },
    formSubmit: function(o) {
        var a = this, i = this.data, s = i.phone.replace(/\s/g, ""), r = i.sms.replace(/\s/g, "");
        return s ? r ? void t.ensureLogin(function() {
            return e({
                url: "/v1/binding",
                method: "POST",
                data: {
                    code: r,
                    phone: s
                }
            }).then(function() {
                wx.showToast({
                    title: "绑定成功"
                }), setTimeout(function() {
                    return wx.navigateBack();
                }, 1500);
            });
        }).catch(function(e) {
            "auth_refused" === e.code ? a.setData({
                isVisible: !0
            }) : n(e);
        }).done() : wx.showToast({
            icon: "none",
            title: "请输入短信码"
        }) : wx.showToast({
            icon: "none",
            title: "请输入手机号"
        });
    }
});