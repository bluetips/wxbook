Component({
    properties: {
        content: {
            type: String,
            value: "",
            observer: function(t) {
                if (t) {
                    var e = this.data.limit;
                    this.setData({
                        text: t.substring(0, e),
                        length: t.length
                    });
                }
            }
        }
    },
    data: {
        length: 0,
        limit: 90,
        text: "",
        expand: !1
    },
    methods: {
        _handleSummary: function() {
            var t = this.data, e = t.content, n = t.expand, a = t.limit, i = t.length;
            this.setData({
                text: e.substring(0, n ? a : i),
                expand: !n
            });
        }
    }
});