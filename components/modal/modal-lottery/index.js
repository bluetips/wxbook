Component({
    properties: {
        visible: Boolean
    },
    methods: {
        close: function() {
            this.triggerEvent("close");
        }
    }
});