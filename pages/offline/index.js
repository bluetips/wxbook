var t = require("../../utils/request"), e = require("../../utils/onerror");

Page({
    data: {
        novel: null,
        ready: !1
    },
    onLoad: function(a) {
        var i = this;
        a && a.id && (wx.showLoading({
            title: "玩命加载中"
        }), t({
            url: "/v1/novels/" + a.id
        }).then(function(t) {
            i.setData({
                novel: t.data
            });
        }).catch(e).finally(function() {
            i.setData({
                ready: !0
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        }));
    }
});