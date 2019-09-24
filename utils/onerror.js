var e = {
    code: "unknown_error",
    message: "未知错误"
};

module.exports = function(o) {
    var s = o || e;
    wx.showModal({
        title: "错误提示",
        showCancel: !1,
        content: s.errMsg || s.message
    });
};