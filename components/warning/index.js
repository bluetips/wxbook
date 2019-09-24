Component({
    properties: {
        mode: {
            type: String,
            value: ""
        },
        warning: {
            type: Object,
            value: {}
        },
        welth: {
            type: Number,
            value: 0
        },
        coupon: {
            type: Number,
            value: 0
        },
        confirm: {
            type: Boolean,
            value: !0
        }
    },
    data: {
        isiOS: !0
    },
    ready: function() {
        var e = this;
        getApp().getSystemInfo().then(function(t) {
            e.setData({
                isIOS: "iOS" === t.system.substr(0, 3)
            });
        });
    },
    methods: {
        confirm: function() {
            this.triggerEvent("confirm");
        },
        buy: function() {
            this.triggerEvent("buy");
        },
        ignoreShowMenu: function() {
            console.log("-------点击忽略弹窗-------");
        }
    }
});