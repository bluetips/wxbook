Component({
    properties: {
        idx: {
            type: Number,
            value: 0
        },
        tabs: {
            type: Array,
            value: []
        }
    },
    methods: {
        onSwitch: function(t) {
            this.triggerEvent("switch", t.currentTarget.dataset.label);
        }
    }
});