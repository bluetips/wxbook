function t(t) {
    if (Array.isArray(t)) {
        for (var n = 0, e = Array(t.length); n < t.length; n++) e[n] = t[n];
        return e;
    }
    return Array.from(t);
}

var n = require("../../utils/request"), e = require("../../utils/auth"), i = require("../../utils/onerror");

Page({
    data: {
        list: [],
        ready: !1,
        action: "edit",
        ids: [],
        _ids: [],
        offline: !1
    },
    onShow: function() {
        var t = this;
        wx.getNetworkType({
            success: function(n) {
                "none" === n.networkType ? t.setData({
                    offline: !0
                }) : (t.setData({
                    offline: !1
                }), t.fetch());
            }
        });
    },
    fetch: function() {
        var t = this;
        wx.showLoading({
            title: "玩命加载中"
        }), e.ensureLogin(function() {
            return n({
                url: "/v1/favorites"
            }).then(function(n) {
                var e = [], i = n.data.map(function(t) {
                    return t.percent = 0 === Number(t.article_count) ? "0%" : parseFloat((t.last_read_idx / t.article_count * 100).toFixed(2)) + "%", 
                    e.push(t.novel_id), t;
                });
                t.setData({
                    list: i,
                    _ids: e,
                    ready: !0
                });
            });
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : i(t);
        }).finally(function() {
            setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    onEdit: function() {
        this.setData({
            action: "cancel"
        }), wx.showLoading({
            title: "加载中..."
        }), wx.hideTabBar({
            success: function() {
                setTimeout(wx.hideLoading, 300);
            }
        });
    },
    onCancel: function() {
        this.setData({
            ids: [],
            action: "edit"
        }), wx.showLoading({
            title: "加载中..."
        }), wx.showTabBar({
            success: function() {
                setTimeout(wx.hideLoading, 300);
            }
        });
    },
    onDelete: function() {
        var t = this, e = this.data, i = e.ids, a = e.list, o = e._ids;
        i.length ? wx.showModal({
            title: "友情提示",
            content: "确定删除所选小说？",
            success: function(e) {
                e.confirm && n({
                    url: "/v1/favorites/batch?nids=" + i.join(","),
                    method: "Delete"
                }).then(function() {
                    wx.showToast({
                        icon: "success",
                        title: "删除成功"
                    });
                    var n = a.filter(function(t) {
                        return -1 === i.findIndex(function(n) {
                            return n === t.novel_id;
                        });
                    });
                    t.setData({
                        list: n,
                        _ids: o.filter(function(t) {
                            return -1 === i.findIndex(function(n) {
                                return n === t;
                            });
                        }),
                        ids: []
                    }), 0 === n.length && t.onCancel();
                }).catch(function() {
                    wx.showToast({
                        icon: "none",
                        title: "删除失败"
                    });
                }).done();
            }
        }) : wx.showModal({
            content: "请选择小说",
            showCancel: !1
        });
    },
    onSelectAll: function() {
        var n = this.data, e = n.ids, i = n._ids;
        e.length === i.length ? this.setData({
            ids: []
        }) : this.setData({
            ids: [].concat(t(i))
        });
    },
    handleSelect: function(t) {
        var n = this.data.ids, e = t.detail, i = n.findIndex(function(t) {
            return t === e;
        });
        -1 < i ? n.splice(i, 1) : n.push(e), this.setData({
            ids: n
        });
    },
    navigateToIntro: function(t) {
        wx.navigateTo({
            url: "/pages/intro/index?id=" + t.detail
        });
    },
    navigateToChapter: function(t) {
        wx.navigateTo({
            url: "/pages/read/index?id=" + t.detail.last_read_id
        });
    },
    onShareAppMessage: function() {
        return {
            title: "二十年来最好的免费网文全在这了，快进来看",
            path: "/pages/index/index"
        };
    }
});