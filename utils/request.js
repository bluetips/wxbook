var e = require("../vendor/q"), r = require("../config");

module.exports = function(a) {
    var t = a.url, o = a.data, s = a.method, i = void 0 === s ? "GET" : s, n = a.extra, c = e.defer(), d = getApp(), u = {
        "x-platform": "miniapp",
        "x-version": r.version,
        "x-package-type": 8
    };
    d.globalData.frame_version && (u["x-frame-version"] = d.globalData.frame_version);
    var v = wx.getStorageSync("token");
    return v && (u.Authorization = "Bearer " + v), n && Object.assign(u, n), wx.request({
        url: r.apiHost + t,
        method: i,
        data: o,
        header: u,
        success: function(e) {
            400 <= e.statusCode ? (90002 === e.data.code && wx.removeStorageSync("token"), "string" == typeof e.data ? c.reject({
                code: "request_error",
                message: "请求失败"
            }) : c.reject(e.data)) : c.resolve(e.data);
        },
        fail: function(e) {
            c.reject(e);
        }
    }), c.promise;
};