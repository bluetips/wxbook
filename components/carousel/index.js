Component({
    properties: {
        novels: {
            type: Array,
            value: []
        }
    },
    data: {
        current: 0
    },
    methods: {
        bindchange: function(t) {
            this.setData({
                current: t.detail.current
            });
        }
    }
});