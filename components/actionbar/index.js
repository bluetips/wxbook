Component({
    properties: {
        prev: Number,
        next: Number,
        nid: Number,
        title: String,
        mode: {
            type: String,
            value: "day"
        },
        size: {
            type: Number,
            value: 20
        }
    },
    data: {
        fontSetting: !1
    },
    methods: {
        prev: function(t) {
            var e = this.data;
            getApp().postFormId(t.detail.formId), this.triggerEvent("load", e.prev);
        },
        next: function(t) {
            var e = this.data;
            getApp().postFormId(t.detail.formId), this.triggerEvent("load", e.next);
        },
        showCatalog: function() {
            this.triggerEvent("catalog");
        },
        changeMode: function() {
            this.triggerEvent("change");
        },
        shrinkSize: function() {
            this.triggerEvent("zoom", Number(this.data.size) - 1);
        },
        enlargeSize: function() {
            this.triggerEvent("zoom", this.data.size + 1);
        },
        _showFontSize: function() {
            this.setData({
                fontSetting: !this.data.fontSetting
            });
        },
        _goToIntro: function() {
            wx.navigateTo({
                url: "/pages/intro/index?id=" + this.data.nid
            });
        }
    }
});