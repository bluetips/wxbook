var t = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a]);
    }
    return t;
}, e = require("../../utils/request"), n = require("../../utils/auth"), a = require("../../utils/onerror"), o = 0, r = 0, s = 0, u = 0, i = 0, c = 0, l = 0;

wx.onAccelerometerChange(function(t) {
    var e = getCurrentPages(), n = e[e.length - 1];
    "pages/lottery/index" === n.route ? n.shake(t) : wx.stopAccelerometer();
}), Page({
    data: {
        got: 0,
        used: 0,
        product: null,
        visible: !1,
        shakeCtx: null,
        resultCtx: null,
        fetching: !1,
        ready: !1
    },
    onLoad: function() {
        var t = this, e = this.data;
        this.setData({
            shakeCtx: wx.createInnerAudioContext(),
            resultCtx: wx.createInnerAudioContext()
        }), e.shakeCtx.src = "https://mcdn.pinchuzu.cn/novel-cloud/shake.mp3", e.resultCtx.src = "https://mcdn.pinchuzu.cn/novel-cloud/result.mp3", 
        e.shakeCtx.onPlay(function() {
            wx.showLoading({
                title: "努力抽奖中..."
            }), setTimeout(t.requestLottery, 1e3);
        }), e.resultCtx.onPlay(function() {
            wx.hideLoading();
        });
    },
    onShow: function() {
        this.load();
    },
    load: function() {
        var o = this;
        n.ensureLogin(function() {
            return e({
                url: "/v1/shake_lucky/my_chance"
            }).then(function(e) {
                o.setData(t({}, e.data, {
                    ready: !0
                })), wx.startAccelerometer();
            });
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : a(t);
        }).done();
    },
    handleModal: function() {
        var t = this.data;
        0 < t.got - t.used && wx.startAccelerometer(), this.setData({
            product: null,
            visible: !1
        });
    },
    shake: function(t) {
        var e = new Date().getTime();
        if (100 < e - o) {
            var n = e - o;
            o = e, r = t.x, s = t.y, u = t.z, 90 < Math.abs(r + s + u - i - c - l) / n * 1e4 && this.lottery(), 
            i = r, c = s, l = u;
        }
    },
    lottery: function() {
        var t = this.data, e = t.got, n = t.used, a = t.shakeCtx;
        wx.stopAccelerometer(), 0 < e - n && a.play();
    },
    requestLottery: function() {
        var n = this, o = this.data;
        e({
            url: "/v1/shake_lucky/lucky",
            method: "POST"
        }).then(function(e) {
            o.resultCtx.play();
            var a = e.data.product;
            n.setData({
                product: t({}, a, {
                    logo: a.logo.replace(/^\/\//, "https://")
                }),
                used: Number(o.used) + 1,
                visible: !0
            });
        }).catch(a).done();
    },
    onHide: function() {
        this.onUnload();
    },
    onUnload: function() {
        wx.stopAccelerometer(), l = c = i = u = s = r = o = 0, this.setData({
            visible: !1,
            product: null
        });
    }
});