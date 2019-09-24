Page({
    makecall: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.target.dataset.phone
        });
    },
    copyQQ: function(t) {
        wx.setClipboardData({
            data: t.target.dataset.qq,
            success: function() {
                wx.showToast({
                    icon: "none",
                    title: "已复制"
                });
            }
        });
    }
});