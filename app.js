var e = require("./vendor/q"), r = require("./utils/request"), t = require("./scenes");

App({
    onLaunch: function(e) {
        if (console.log("app: ", e), wx.removeStorageSync("formIdCount"), e && e.query) {
            if (e.query.scene) {
                var r = decodeURIComponent(e.query.scene).split(":")[0];
                t[r] || (this.globalData.ciphertext = r);
            }
            e.query.chid && wx.setStorage({
                key: "chid",
                data: decodeURIComponent(e.query.chid)
            });
        }
        if (e && e.referrerInfo && e.referrerInfo.extraData) {
            var o = e.referrerInfo.extraData;
            "string" == typeof o && (o = JSON.parse(o)), o.cid && wx.setStorage({
                key: "chid",
                data: o.cid
            });
        }
    },
    onShow: function(e) {
        if (e && e.query && e.query.frame_version && (this.globalData.frame_version = e.query.frame_version), 
        e && e.referrerInfo && e.referrerInfo.extraData) {
            var r = e.referrerInfo.extraData;
            "string" == typeof r && (r = JSON.parse(r)), r.rcode && "recharge:success" === r.rcode && wx.switchTab({
                url: "/pages/my/index"
            });
        }
    },
    onHide: function() {
        wx.removeStorageSync("index.invite");
    },
    globalData: {
        frame_version: null,
        is_new_member: !1,
        userInfo: null,
        profile: null,
        ciphertext: null,
        systemInfo: null,
        miniApp: null,
        from: null,
        contact: null
    },
    getProfile: function() {
        var t = this, o = e.defer();
        return this.globalData.profile ? o.resolve(this.globalData.profile) : r({
            url: "/v1/my/profile"
        }).then(function(e) {
            console.log("------profile-----"), t.globalData.profile = e.data, o.resolve(e.data);
        }).catch(function(e) {
            o.reject(e);
        }), o.promise;
    },
    getSystemInfo: function() {
        var r = this, t = e.defer();
        return this.globalData.systemInfo ? t.resolve(this.globalData.systemInfo) : wx.getSystemInfo({
            success: function(e) {
                r.globalData.systemInfo = e, t.resolve(e);
            },
            fail: function(e) {
                t.reject(e);
            }
        }), t.promise;
    },
    getMiniApp: function() {
        var t = this, o = e.defer();
        return this.globalData.miniApp ? o.resolve(this.globalData.miniApp) : r({
            url: "/v1/config/miniapp"
        }).then(function(e) {
            t.globalData.miniApp = e, o.resolve(e);
        }).catch(function(e) {
            o.reject(e);
        }), o.promise;
    },
    getContact: function() {
        var t = this, o = e.defer();
        return this.globalData.contact ? o.resolve(this.globalData.contact) : r({
            url: "/v1/services/contact"
        }).then(function(e) {
            t.globalData.contact = e.data, o.resolve(e.data);
        }).catch(function(e) {
            o.reject(e);
        }), o.promise;
    },
    postFormId: function(e) {
        var t = wx.getStorageSync("formIdCount") || 0;
        if (t < 10) return r({
            url: "/v1/miniprogram/formid",
            method: "POST",
            data: {
                formid: e
            }
        }).then(function() {
            wx.setStorageSync("formIdCount", t + 1);
        }).done();
    }
});