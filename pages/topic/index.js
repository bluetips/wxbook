function t(t) {
    if (Array.isArray(t)) {
        for (var i = 0, a = Array(t.length); i < t.length; i++) a[i] = t[i];
        return a;
    }
    return Array.from(t);
}

var i = require("../../utils/request"), a = require("../../utils/onerror"), n = {
    fangtang_hunlian: "婚恋言情",
    fangtang_haomen: "豪门世家",
    fangtang_dushi: "都市佣兵",
    fangtang_xuanyi: "悬疑灵异"
};

Page({
    data: {
        title: "专题",
        ready: !1,
        fetching: !1,
        start: 0,
        limit: 10,
        finish: !1,
        list: []
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: n[t.id]
        }), this.fetch();
    },
    fetch: function() {
        var n = this, e = this.data, r = e.fetching, s = e.finish, h = e.start, f = e.limit, l = e.list, o = this.options.id;
        r || s || (wx.showLoading({
            title: "玩命加载中"
        }), i({
            url: "/v1/lists/" + o,
            data: {
                start: h,
                limit: f
            }
        }).then(function(i) {
            var a = i.data;
            n.setData({
                finish: 0 === a.length || a.length < f,
                start: h + a.length,
                list: [].concat(t(l), t(a))
            });
        }).catch(a).finally(function() {
            n.setData({
                ready: !0,
                fetching: !1
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        }));
    }
});