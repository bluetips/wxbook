var e = require("../vendor/q"), t = require("./request"), n = {
    code: "unknown_error",
    message: "未知错误"
};

module.exports = {
    hasLogin: function() {
        return !!wx.getStorageSync("token");
    },
    login: function() {
        var n = e.defer(), r = wx.getStorageSync("token");
        if (r) n.resolve(r); else {
            var i = getApp();
            wx.login({
                success: function(e) {
                    wx.getUserInfo({
                        withCredentials: !0,
                        success: function(r) {
                            i.globalData.userInfo = r.userInfo, i.getMiniApp().then(function(a) {
                                var o = a.new_pull_2019_event || null, c = 0;
                                if (o) {
                                    var s = new Date().getTime(), u = new Date(o.start_time).getTime(), g = new Date(o.end_time).getTime();
                                    u < s && s < g && (c = 1);
                                }
                                return t({
                                    url: "/v1/miniprogram/auth",
                                    method: "POST",
                                    data: {
                                        code: e.code,
                                        iv: r.iv,
                                        cid: wx.getStorageSync("chid") || "",
                                        ciphertext: i.globalData.ciphertext || "",
                                        encryptedData: r.encryptedData,
                                        inviter_id: i.globalData.inviter_id,
                                        invitation_event_type: c
                                    }
                                }).then(function(e) {
                                    wx.setStorageSync("token", e.data.token), i.globalData.is_new_member = !!e.data.is_new_member, 
                                    n.resolve(e.data.token);
                                });
                            }).catch(n.reject);
                        },
                        fail: function() {
                            n.reject({
                                code: "auth_refused",
                                message: "用户取消授权"
                            });
                        }
                    });
                }
            });
        }
        return n.promise;
    },
    ensureLogin: function(e) {
        var t = this;
        return this.login().then(e).catch(function(r) {
            var i = r || n;
            if (90002 === i.code) return t.login().then(e);
            throw i;
        });
    }
};