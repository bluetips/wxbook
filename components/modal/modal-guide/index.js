Component({
    data: {
        is_new_member: !1
    },
    ready: function() {
        this.setData({
            is_new_member: !wx.getStorageSync("article.menu.guide")
        });
    },
    methods: {
        _close: function() {
            wx.setStorageSync("article.menu.guide", new Date().getTime()), this.setData({
                is_new_member: !1
            });
        }
    }
});