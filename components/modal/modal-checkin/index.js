Component({
    properties: {
        checkin: Object
    },
    methods: {
        close: function() {
            this.triggerEvent("close");
        }
    }
});