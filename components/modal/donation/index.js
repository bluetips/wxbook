require("../../../config");

Component({
    properties: {
        gifts: {
            type: Array,
            value: []
        },
        balance: {
            type: Number,
            value: 0
        }
    },
    data: {
        activeId: null,
        activeWealth: 0
    },
    methods: {
        _select: function(t) {
            var e = t.currentTarget.dataset.id, a = t.currentTarget.dataset.wealth;
            this.data.activeId === e && (e = null, a = 0), this.setData({
                activeId: e,
                activeWealth: a
            });
        },
        closeModal: function() {
            this.triggerEvent("close");
        },
        donate: function() {
            this.triggerEvent("donate", {
                id: this.data.activeId,
                wealth: this.data.activeWealth
            });
        },
        _recharge: function() {
            wx.navigateTo({
                url: "/pages/recharge/index"
            });
        }
    }
});