Component({
    properties: {
        novel: Object,
        status: {
            type: String,
            value: "normal"
        },
        checked: Boolean
    },
    methods: {
        select: function() {
            var t = this.data, e = t.novel;
            "isEditing" === t.status ? this.triggerEvent("select", e.novel_id) : 0 === e.last_read_id ? this.triggerEvent("intro", e.novel_id) : this.triggerEvent("chapter", e);
        }
    }
});