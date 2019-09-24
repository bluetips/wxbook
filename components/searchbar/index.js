Component({
    properties: {
        query: String,
        page: String
    },
    methods: {
        onInput: function(t) {
            this.triggerEvent("input", t.detail.value);
        },
        onClear: function() {
            this.triggerEvent("clear");
        },
        onSearch: function() {
            this.triggerEvent("search");
        }
    }
});