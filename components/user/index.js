Component({
    properties: {
        profile: Object,
        offline: {
            type: Boolean,
            value: !1
        }
    },
    methods: {
        getUserInfo: function(e) {
            e.detail.encryptedData ? (getApp().globalData.userInfo = e.detail.userInfo, console.log("--------登录-------"), 
            this.triggerEvent("login")) : wx.showModal({
                title: "提示",
                content: "获取授权失败，这将影响您的阅读体验，请重新授权？",
                showCancel: !1
            });
        }
    }
});