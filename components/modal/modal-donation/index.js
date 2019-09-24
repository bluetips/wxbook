Component({
    properties: {
        gifts: {
            type: Array,
            value: []
        },
        visible: {
            type: Boolean,
            value: !1
        },
        balance: {
            type: Number,
            value: 0
        }
    },
    methods: {
        closeModal: function() {
            this.triggerEvent("close");
        },
        donate: function(e) {
            this.triggerEvent("donate", e.detail);
        },
        recharge: function() {
            this.triggerEvent("recharge");
        }
    }
});