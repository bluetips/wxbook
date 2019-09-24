Component({
    properties: {
        task: Array
    },
    methods: {
        finishTask: function() {
            this.triggerEvent("task");
        }
    }
});