var e = require("../../utils/auth"), t = require("../../utils/onerror");

Component({
    properties: {
        novel: Object
    },
    methods: {
        goToIntro: function() {
            this.triggerEvent("intro", this.data.novel.id);
        },
        read: function(r) {
            var n = this, o = getApp();
            e.ensureLogin(function() {
                return n.triggerEvent("read", n.data.novel), o.postFormId(r.detail.formId);
            }).catch(function(e) {
                "auth_refused" === e.code ? wx.navigateTo({
                    url: "/pages/login/index"
                }) : t(e);
            });
        }
    }
});