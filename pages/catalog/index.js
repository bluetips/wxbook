function t(t, i, e) {
    return i in t ? Object.defineProperty(t, i, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[i] = e, t;
}

var i = Object.assign || function(t) {
    for (var i = 1; i < arguments.length; i++) {
        var e = arguments[i];
        for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
    }
    return t;
}, e = require("../../utils/request"), a = require("../../utils/onerror");

Page({
    data: {
        sum: 0,
        currentIndex: 0,
        limit: 100,
        range: [],
        list: [],
        fetching: !1,
        finish: !1,
        is_time_limited_free: !1
    },
    onLoad: function(t) {
        var i = this.data.limit, e = t.total, a = t.status, n = Math.ceil(e / i), r = this.calc(n), s = Array(n).fill([]);
        this.setData({
            sum: Number(e),
            is_time_limited_free: a,
            range: r,
            list: s
        }), this.fetch();
    },
    calc: function(t) {
        var i = this.data.limit;
        return Array(t).fill(0).map(function(t, e) {
            return e * i + 1 + "-" + (e + 1) * i;
        });
    },
    fetch: function() {
        var n = this, r = this.data, s = r.currentIndex, c = r.limit, l = r.list, u = r.fetching, o = 0 === r.sum || 0 !== l[s].length;
        if (!u && !o) {
            this.setData({
                fetching: !0
            }), wx.showLoading({
                title: "玩命加载中"
            });
            var f = this.options.id;
            e({
                url: "/v1/novels/" + f + "/catalog",
                data: {
                    start: s * c,
                    limit: c
                }
            }).then(function(e) {
                var a = e.data.map(function(t) {
                    return i({}, t, {
                        title: t.title.replace(/(^\s*)|(\s*$)/g, "")
                    });
                });
                n.setData(t({}, "list[" + s + "]", a));
            }).catch(a).finally(function() {
                n.setData({
                    fetching: !1
                }), setTimeout(function() {
                    wx.hideLoading();
                }, 200);
            });
        }
    },
    change: function(t) {
        this.data.fetching || (this.setData({
            currentIndex: t.currentTarget.dataset.index
        }), this.fetch());
    }
});