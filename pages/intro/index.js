var t = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];
        for (var a in i) Object.prototype.hasOwnProperty.call(i, a) && (t[a] = i[a]);
    }
    return t;
}, e = function(t, e) {
    if (Array.isArray(t)) return t;
    if (Symbol.iterator in Object(t)) return function(t, e) {
        var i = [], a = !0, n = !1, o = void 0;
        try {
            for (var s, r = t[Symbol.iterator](); !(a = (s = r.next()).done) && (i.push(s.value), 
            !e || i.length !== e); a = !0) ;
        } catch (t) {
            n = !0, o = t;
        } finally {
            try {
                !a && r.return && r.return();
            } finally {
                if (n) throw o;
            }
        }
        return i;
    }(t, e);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}, i = require("../../vendor/q"), a = require("../../utils/request"), n = require("../../utils/auth"), o = require("../../utils/onerror");

Page({
    data: {
        novel: null,
        relatedList: [],
        latest: null,
        ready: !1,
        rewards: [],
        gifts: [],
        isVisible: !1,
        favorited: !1,
        isiOS: !0,
        balance: 0,
        chances: 0,
        isLotteryVisible: !1
    },
    onLoad: function(n) {
        var s = this;
        if (n.id) {
            var r = n.id;
            wx.showShareMenu({
                withShareTicket: !0
            }), getApp().getSystemInfo().then(function(t) {
                s.setData({
                    isiOS: "iOS" === t.system.substr(0, 3)
                });
            }), wx.showLoading({
                title: "玩命加载中"
            }), i.all([ a({
                url: "/v1/novels/" + r
            }), a({
                url: "/v1/novels/" + r + "/related",
                data: {
                    limit: 6
                }
            }), this.getLatest() ]).then(function(i) {
                var a = e(i, 3), n = a[0], o = a[1], r = a[2], l = n.data, c = l.roles, d = l.words, u = t({}, n.data, {
                    summary: n.data.summary.replace(/\r?\n|\s+/g, ""),
                    roles: c.join("、"),
                    words: 1e4 <= d ? parseInt(d / 1e4) + "万字" : 1e3 < d ? parseInt(d / 1e3) + "千字" : d + "字"
                }), h = o.data;
                s.setData({
                    novel: u,
                    relatedList: h.slice(0, 3 * parseInt(h.length / 3)),
                    latest: r,
                    ready: !0
                }), s.getTippers();
            }).catch(o).finally(function() {
                setTimeout(function() {
                    wx.hideLoading();
                }, 200);
            });
        } else wx.switchTab({
            url: "/pages/discover/index"
        });
    },
    onShow: function() {
        this.load();
    },
    load: function() {
        var t = this;
        n.ensureLogin(function() {
            return i.all([ t.getFavorited(), a({
                url: "/v1/my/balance"
            }) ]).then(function(i) {
                var a = e(i, 2), n = a[0], o = a[1];
                t.setData({
                    favorited: n,
                    balance: o.data
                });
            });
        }).catch(function(t) {
            "auth_refused" === t.code ? wx.navigateTo({
                url: "/pages/login/index"
            }) : o(t);
        }).done();
    },
    getTippers: function() {
        var e = this, i = this.options.id;
        a({
            url: "/v1/novels/" + i + "/tippers",
            data: {
                limit: 7
            }
        }).then(function(i) {
            e.setData({
                rewards: i.data.map(function(e) {
                    return t({}, e, {
                        headimgurl: e.headimgurl ? e.headimgurl : "https://qcdn.pinchuzu.cn/spa/koala@2x.png"
                    });
                })
            });
        }).catch(o).done();
    },
    getLatest: function() {
        var t = i.defer(), e = this.options.id;
        return a({
            url: "/v1/novels/" + e + "/catalog/latest"
        }).then(function(e) {
            t.resolve(e.data);
        }).catch(function() {
            t.resolve(null);
        }).done(), t.promise;
    },
    getFavorited: function() {
        var t = i.defer(), e = this.options.id;
        return a({
            url: "/v1/novels/" + e + "/favorite"
        }).then(function() {
            t.resolve(!0);
        }).catch(function(e) {
            "404" === e.message && t.resolve(!1);
        }), t.promise;
    },
    read: function(t) {
        getApp().postFormId(t.detail.formId);
        var e = this.data.novel;
        wx.navigateTo({
            url: "/pages/read/index?id=" + e.first_article_id + "&nid=" + e.id
        });
    },
    handleFavorited: function(t) {
        getApp().postFormId(t.detail.formId), this.data.favorited ? this.removeShelf() : this.addShelf();
    },
    addShelf: function() {
        var t = this, e = this.options.id;
        a({
            url: "/v1/favorites",
            method: "POST",
            data: {
                nid: e
            }
        }).then(function() {
            wx.showToast({
                icon: "success",
                title: "成功加入书架"
            }), t.setData({
                favorited: !0
            });
        }).catch(function() {
            wx.showToast({
                icon: "none",
                title: "加入书架失败"
            });
        }).done();
    },
    removeShelf: function() {
        var t = this, e = this.options.id;
        a({
            url: "/v1/favorites?nid=" + e,
            method: "DELETE"
        }).then(function() {
            wx.showToast({
                icon: "success",
                title: "成功移出书架"
            }), t.setData({
                favorited: !1
            });
        }).catch(function() {
            wx.showToast({
                icon: "none",
                title: "移出书架失败"
            });
        }).done();
    },
    getGifts: function() {
        var t = this;
        a({
            url: "/v1/tips/gifts"
        }).then(function(e) {
            t.setData({
                gifts: e.data
            });
        }).catch(o).done();
    },
    getBalance: function() {
        var t = this;
        a({
            url: "/v1/my/balance"
        }).then(function(e) {
            t.setData({
                balance: e.data
            });
        }).catch(o).done();
    },
    donate: function() {
        0 === this.data.gifts.length && this.getGifts(), this.setData({
            isVisible: !0
        });
    },
    closeModal: function() {
        this.setData({
            isVisible: !1
        });
    },
    handleDonate: function(t) {
        var e = this, i = this.options.id, s = t.detail.id;
        wx.showLoading({
            title: "打赏中"
        }), n.ensureLogin(function() {
            a({
                url: "/v1/novels/" + i + "/tips",
                method: "POST",
                data: {
                    gift_id: s
                }
            }).then(function() {
                wx.showToast({
                    title: "谢谢土豪",
                    icon: "none"
                }), e.closeModal(), e.getTippers(), e.getBalance();
            });
        }).catch(o).finally(function() {
            e.hideLoading();
        });
    },
    addChance: function() {
        var t = this, e = this.data.chances;
        a({
            url: "/v1/shake_lucky/my_chance",
            method: "POST"
        }).then(function() {
            t.setData({
                chances: e - 1,
                isLotteryVisible: !0
            });
        }).catch(function(t) {
            console.log(t);
        }).done();
    },
    closeLotteryModal: function() {
        this.setData({
            isLotteryVisible: !1
        });
    },
    preview: function() {
        var t = this.data.novel;
        wx.previewImage({
            urls: [ t.avatar ]
        });
    },
    onShareAppMessage: function() {
        var t = this.data.novel;
        return {
            title: "这本书陪我度过一个个寂寞难捱的夜",
            path: "/pages/intro/index?id=" + this.options.id,
            imageUrl: t.avatar
        };
    },
    onHide: function() {
        this.data.isLotteryVisible && this.closeLotteryModal();
    }
});