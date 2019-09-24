require("../../vendor/q"), require("../../config");

Component({
    properties: {
        mode: String,
        warning: Object,
        aid: Number
    },
    data: {
        isiOS: !1
    },
    ready: function() {
        var t = this;
        getApp().getSystemInfo().then(function(e) {
            t.setData({
                isiOS: "iOS" === e.system.substr(0, 3)
            });
        });
    },
    methods: {
        onRecharge: function() {
            this.triggerEvent("recharge");
        },
        onWholeBuy: function() {
            this.triggerEvent("whole", this.data.warning.data.novel_id);
        },
        handActionBar: function() {
            this.triggerEvent("actionbar");
        },
        _recharge: function() {
            wx.navigateTo({
                url: "/pages/recharge/index?aid=" + this.data.aid
            });
        },
        _toTask: function() {
            wx.navigateTo({
                url: "/pages/task/task"
            });
        }
    }
});