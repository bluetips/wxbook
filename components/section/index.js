Component({
    options: {
        multipleSlots: !0
    },
    properties: {
        list: {
            type: Array,
            value: []
        },
        title: {
            type: String,
            value: ""
        },
        column: {
            type: Number,
            value: 3
        },
        row: {
            type: Number,
            value: 1
        }
    }
});