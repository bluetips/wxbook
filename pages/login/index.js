var e = require("../../utils/auth"), t = require("../../utils/onerror");

Page({
    getUserInfo: function(a) {
        a.detail.encryptedData ? (getApp().globalData.userInfo = a.detail.userInfo, e.login().then(function() {
            wx.navigateBack();
        }).catch(t)) : wx.showModal({
            title: "提示",
            content: "获取授权失败，这将影响您的阅读体验，请重新授权？",
            showCancel: !1
        });
    }
});