function t(t, n, a) {
    return n in t ? Object.defineProperty(t, n, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[n] = a, t;
}

function n(t) {
    if (Array.isArray(t)) {
        for (var n = 0, a = Array(t.length); n < t.length; n++) a[n] = t[n];
        return a;
    }
    return Array.from(t);
}

var a = require("../../utils/request"), i = require("../../utils/onerror");

Page({
    data: {
        currentIndex: 0,
        ranks_title: [ "月读榜", "新书榜", "原创榜" ],
        list: [],
        fangtang_monthly_list: [],
        fangtang_newly_list: [],
        fangtang_original_list: [],
        fangtang_monthly_finish: !1,
        fangtang_newly_finish: !1,
        fangtang_original_finish: !1,
        limit: 20,
        ready: !1
    },
    onLoad: function() {
        this.getList("fangtang_monthly");
    },
    getList: function(e) {
        var r = this, g = this.data;
        wx.showLoading({
            title: "玩命加载中"
        }), a({
            url: "/v1/lists/" + e,
            data: {
                id: e,
                limit: g.limit,
                start: g[e + "_list"].length
            }
        }).then(function(a) {
            var i;
            r.setData((t(i = {}, e + "_list", [].concat(n(g[e + "_list"]), n(a.data))), t(i, e + "_finish", a.data.length < g.limit), 
            i));
        }).catch(i).finally(function() {
            r.setData({
                ready: !0
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        });
    },
    change: function(t) {
        var n = this.data, a = n.currentIndex, i = n.fangtang_newly_list, e = n.fangtang_original_list, r = t.currentTarget.dataset.index;
        a !== r && (this.setData({
            currentIndex: r
        }), 1 === r && 0 === i.length ? (this.setData({
            ready: !1
        }), this.getList("fangtang_newly")) : 2 === r && 0 === e.length && (this.setData({
            ready: !1
        }), this.getList("fangtang_original")));
    },
    getMore: function() {
        var t = this.data, n = t.currentIndex, a = t.fangtang_monthly_finish, i = t.fangtang_newly_finish, e = t.fangtang_original_finish;
        0 !== n || a ? 1 !== n || i ? 2 !== n || e || this.getList("fangtang_original") : this.getList("fangtang_newly") : this.getList("fangtang_monthly");
    }
});