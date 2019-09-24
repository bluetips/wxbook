var t = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var a = arguments[e];
        for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
    }
    return t;
}, e = function(t, e) {
    if (Array.isArray(t)) return t;
    if (Symbol.iterator in Object(t)) return function(t, e) {
        var a = [], n = !0, i = !1, o = void 0;
        try {
            for (var r, l = t[Symbol.iterator](); !(n = (r = l.next()).done) && (a.push(r.value), 
            !e || a.length !== e); n = !0) ;
        } catch (t) {
            i = !0, o = t;
        } finally {
            try {
                !n && l.return && l.return();
            } finally {
                if (i) throw o;
            }
        }
        return a;
    }(t, e);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, a = require("../../vendor/q"), n = require("../../utils/request"), i = require("../../utils/auth"), o = require("../../utils/onerror");

Page({
    data: {
        mode: "day",
        fontSize: 20,
        top: 0,
        showActionBar: !1,
        fetching: !1,
        ready: !1,
        article: null,
        readable: !0,
        isiOS: !0,
        readlog: null,
        articleId: null,
        warning: null,
        novel: null
    },
    onLoad: function(t) {
        var e = this, a = wx.getStorageSync("mode"), n = wx.getStorageSync("fontSize");
        this.setData({
            mode: a || "day",
            fontSize: n || 20,
            articleId: t.id || null
        }), getApp().getSystemInfo().then(function(t) {
            e.setData({
                isiOS: "iOS" === t.system.substr(0, 3)
            });
        });
    },
    onReady: function() {
        this.setNavigationBarColor();
    },
    onShow: function() {
        this.load();
    },
    setNavigationBarColor: function() {
        var t = this.data.mode, e = "night" === t ? "#333333" : "#ffffff", a = "night" === t ? "#ffffff" : "#000000";
        wx.setNavigationBarColor({
            frontColor: a,
            backgroundColor: e
        });
    },
    load: function() {
        var t = this, r = this.data;
        i.ensureLogin(function() {
            if (t.options.nid) {
                var i = t.options.nid;
                return a.all([ n({
                    url: "/v1/novels/" + i
                }), n({
                    url: "/v1/novels/" + i + "/readlog"
                }) ]).then(function(a) {
                    var n = e(a, 2), i = n[0], o = n[1];
                    t.setData({
                        novel: i.data,
                        readlog: o.data
                    });
                });
            }
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : o(t);
        }).finally(function() {
            var e = r.readlog ? r.readlog.article_id : r.articleId || r.novel.first_article_id;
            t.setData({
                articleId: e
            }), t.loadArticle(e);
        });
    },
    loadArticle: function(e) {
        var a = this, r = this.data, l = r.articleId, c = r.fetching;
        e = e || l, c || (wx.showLoading({
            title: "玩命加载中"
        }), this.setData({
            fetching: !0,
            ready: !1,
            articleId: e,
            warning: null
        }), i.ensureLogin(function() {
            return n({
                url: "/v1/read/" + e,
                data: {
                    consume_confirm: 0,
                    buy_with: 2
                }
            }).then(function(e) {
                a.setData({
                    top: 0,
                    article: t({}, e.data, {
                        paragraphs: a.parse(e.data.content)
                    }),
                    readable: !0,
                    ready: !0
                });
            });
        }).catch(function(t) {
            if (90001 === t.code || 90400 === t.code) return a.setData({
                readable: !1,
                warning: t
            }), a.loadPreview(e);
            90401 === t.code ? wx.navigateTo({
                url: "/pages/offline/index?id=" + t.data.novel_id
            }) : 90303 === t.code ? wx.showModal({
                title: "温馨提示",
                content: t.message,
                showCancel: !1,
                success: function(t) {
                    t.confirm && wx.navigateTo({
                        url: "/pages/contact/index"
                    });
                }
            }) : "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : o(t);
        }).finally(function() {
            a.setData({
                fetching: !1
            }), setTimeout(function() {
                wx.hideLoading();
            }, 200);
        }));
    },
    onWholeBuy: function(t) {
        var e = this, a = t.detail;
        n({
            url: "/v1/novels/" + a + "/buy",
            method: "POST"
        }).then(function() {
            return e.loadArticle();
        }).catch(function(t) {
            90001 === t.code && e.setData({
                readable: !1,
                warning: t
            });
        });
    },
    loadPreview: function(e) {
        var a = this;
        return n({
            url: "/v1/articles/" + e + "/preview"
        }).then(function(e) {
            a.setData({
                top: 0,
                ready: !0,
                article: t({}, e.data, {
                    paragraphs: a.parse(e.data.content)
                })
            });
        }).catch(o).done();
    },
    switchArticle: function(t) {
        var e = t.detail;
        this.loadArticle(e);
    },
    prevArticle: function(t) {
        getApp().postFormId(t.detail.formId);
        var e = this.data.article.prev_id;
        this.loadArticle(e);
    },
    nextArticle: function(t) {
        getApp().postFormId(t.detail.formId);
        var e = this.data.article.next_id;
        this.loadArticle(e);
    },
    catchtap: function() {
        console.log("-----------捕捉button的tap冒泡事件-------------");
    },
    parse: function(t) {
        var e = [];
        return t.split(/\r?\n/).forEach(function(t) {
            (t = t.replace(/\s/g, "")).length && "." !== t && e.push(t);
        }), e;
    },
    handleActionBar: function(t) {
        var e = this.data.showActionBar;
        this.setData({
            showActionBar: !e
        });
    },
    changeMode: function() {
        var t = "day" === this.data.mode ? "night" : "day";
        wx.setStorageSync("mode", t), this.setData({
            mode: t
        }), this.setNavigationBarColor();
    },
    chnageSize: function(t) {
        wx.setStorageSync("fontSize", t.detail), this.setData({
            fontSize: t.detail
        }), this.setNavigationBarColor();
    },
    handleCatalog: function() {
        var t = this, e = this.data;
        e.novel ? wx.navigateTo({
            url: "/pages/catalog/index?id=" + e.novel.id + "&total=" + e.novel.article_count + "&status=" + (e.novel.is_time_limited_free ? "free" : "pay")
        }) : n({
            url: "/v1/novels/" + e.article.novel_id
        }).then(function(a) {
            t.setData({
                novel: a.data
            }), wx.navigateTo({
                url: "/pages/catalog/index?id=" + e.novel.id + "&total=" + e.novel.article_count + "&status=" + (e.novel.is_time_limited_free ? "free" : "pay")
            });
        }).catch(o).done();
    },
    recharge: function() {
        var t = this.data.article;
        wx.navigateTo({
            url: "/pages/recharge/index?aid=" + this.options.id + "&id=" + t.novel_id
        });
    }
});