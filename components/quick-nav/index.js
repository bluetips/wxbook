Component({
    properties: {
        more: Object
    },
    data: {
        chid: null
    },
    ready: function() {
        var t = this;
        wx.getStorage({
            key: "chid",
            success: function(e) {
                t.setData({
                    chid: e.data
                });
            }
        });
    }
});