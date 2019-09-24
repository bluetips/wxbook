function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, r = Array(t.length); e < t.length; e++) r[e] = t[e];
        return r;
    }
    return Array.from(t);
}

var e = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var r = arguments[e];
        for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
}, r = require("../../utils/onerror"), a = require("../../utils/request");

Page({
    data: {
        query: "",
        hotList: [],
        result: [],
        fetching: !1,
        start: 0,
        finish: !1,
        limit: 10,
        ready: !1
    },
    onLoad: function() {
        var t = this;
        a({
            url: "/v1/search/hot_words"
        }).then(function(e) {
            t.setData({
                hotList: e.data
            });
        }).catch(r).done();
    },
    onInput: function(t) {
        var e = t.detail.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\，\,]/g, "");
        "" === e ? this.onClear() : this.setData({
            query: e
        });
    },
    onClear: function() {
        this.setData({
            query: "",
            result: [],
            ready: !1
        });
    },
    onSearch: function() {
        this.setData({
            ready: !1,
            finish: !1,
            start: 0,
            result: []
        }), this.fetch();
    },
    fetch: function() {
        var i = this, n = this.data, s = n.fetching, h = n.query, o = n.finish, u = n.start, c = n.limit, l = n.result;
        s || !h || o || (wx.showLoading({
            title: "努力搜索中"
        }), this.setData({
            fetching: !0
        }), a({
            url: "/v1/search",
            data: {
                q: h,
                start: u,
                limit: c,
                highlight: 1
            }
        }).then(function(r) {
            var a = r.data.map(function(t) {
                return e({}, t, {
                    title: t.title.replace(/<em>/g, '<em class="highlight">')
                });
            });
            i.setData({
                finish: 0 === a.length || a.length < c,
                start: u + a.length,
                result: [].concat(t(l), t(a))
            });
        }).catch(r).finally(function() {
            i.setData({
                fetching: !1,
                ready: !0
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        }));
    }
});