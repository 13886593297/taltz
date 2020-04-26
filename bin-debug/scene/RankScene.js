var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var RankScene = (function (_super) {
    __extends(RankScene, _super);
    function RankScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentIdx = 1;
        _this.teamRank = [];
        _this.personRank = [];
        _this.size = 20;
        _this.teamPage = 1;
        _this.personPage = 1;
        return _this;
    }
    RankScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        Util.setTitle('排行榜');
        this._width = this.stage.stageWidth;
        this._height = this.stage.stageHeight;
        this.initTitle();
        // 请求个人数据
        this.getRank(Url.HTTP_PERSON_RANK_LIST, this.personPage, this.size)
            .then(function (data) {
            _this.personRank = data.list;
            _this.personPage = data.page;
            _this.initRanker(_this.currentIdx);
        });
        // 请求战队数据
        this.getRank(Url.HTTP_TEAM_RANK_LIST, this.teamPage, this.size)
            .then(function (data) {
            _this.teamRank = data.list;
            _this.teamPage = data.page;
        });
    };
    /**
     * 返回排名数据
     * @param url 个人排名或战队排名url
     * @param page 第几页
     * @param size 每页显示多少条
     */
    RankScene.prototype.getRank = function (url, page, size) {
        return new Promise(function (resolve) {
            Http.getInstance().post(url, { page: page, size: size }, function (json) {
                if (json.data.length == size) {
                    page += 1;
                }
                else {
                    page = -1;
                }
                resolve({
                    list: json.data,
                    page: page
                });
            });
        });
    };
    RankScene.prototype.initTitle = function () {
        var _this = this;
        var y = 50;
        var grayFilter = Util.grayFliter();
        var selfRank = Util.createBitmapByName('rank_title_self_png');
        this.addChild(selfRank);
        var teamRank = Util.createBitmapByName('rank_title_team_png');
        this.addChild(teamRank);
        selfRank.x = this._width / 2 - selfRank.width - 10;
        teamRank.x = this._width / 2 + 5;
        teamRank.y = selfRank.y = y;
        teamRank.touchEnabled = selfRank.touchEnabled = true;
        teamRank.filters = [grayFilter];
        // 点击切换排名
        selfRank.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.initRanker(1);
            selfRank.filters = [];
            teamRank.filters = [grayFilter];
        }, this);
        teamRank.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.initRanker(2);
            selfRank.filters = [grayFilter];
            teamRank.filters = [];
        }, this);
    };
    RankScene.prototype.initRanker = function (type) {
        var _this = this;
        // 切换排名先删除清空子元素
        if (this.groupView) {
            this.groupView.removeChildren();
            this.scrollView.stopAnimation();
            this.scrollView.viewport.scrollV = 0;
        }
        var group = new eui.Group();
        this.groupView = group;
        group.width = 640;
        var rankDatas = this.personRank;
        if (type == 2) {
            rankDatas = this.teamRank;
        }
        this.addItem(rankDatas, type);
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this._width;
        myScroller.height = this._height - 200;
        myScroller.y = 150;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scrollView = myScroller;
        // 上滑加载更多
        myScroller.addEventListener(eui.UIEvent.CHANGE_END, function () {
            if (myScroller.viewport.scrollV + _this._height >= myScroller.viewport.contentHeight) {
                _this.loadMoreData();
            }
        }, this);
    };
    RankScene.prototype.addItem = function (data, type, y) {
        if (y === void 0) { y = 60; }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var rank = data_1[_i];
            var rankItem = this.rankItemTemplate(type, rank, y);
            y += 200;
            rankItem.height = 200;
            this.groupView.addChild(rankItem);
        }
    };
    RankScene.prototype.loadMoreData = function () {
        var _this = this;
        if (this.currentIdx == 1 && this.personPage > 0) {
            this.getRank(Url.HTTP_PERSON_RANK_LIST, this.personPage, this.size)
                .then(function (data) {
                console.log(data);
                _this.personRank.concat(data.list);
                _this.personPage = data.page;
                _this.addItem(data.list, 1, _this.scrollView.viewport.contentHeight);
            });
        }
        if (this.currentIdx == 2 && this.teamPage > 0) {
            this.getRank(Url.HTTP_TEAM_RANK_LIST, this.teamPage, this.size)
                .then(function (data) {
                _this.teamRank.concat(data.list);
                _this.teamPage = data.page;
                _this.addItem(data.list, 2, _this.scrollView.viewport.contentHeight);
            });
        }
    };
    RankScene.prototype.rankItemTemplate = function (type, rank, y) {
        var rankGroup = new eui.Group();
        rankGroup.y = y;
        // 排名背景
        var rankBg = Util.createBitmapByName('rank_item_bg_png');
        rankGroup.x = (this._width - rankBg.width) / 2;
        rankGroup.width = rankBg.width;
        rankGroup.addChild(rankBg);
        // 排名皇冠
        if (rank.serialNo < 4) {
            var crown = Util.createBitmapByName('cup' + rank.serialNo + '_png');
            crown.x = 515;
            crown.y = -20;
            rankGroup.addChild(crown);
        }
        // 排名No.
        var num = new egret.TextField();
        num.text = rank.serialNo;
        num.textColor = rank.serialNo == 1 ? 0xd7a83f : rank.serialNo == 2 ? 0xbebebe : rank.serialNo == 3 ? 0xb77e43 : 0x077424;
        num.bold = true;
        num.size = rank.serialNo < 100 ? 50 : 38;
        num.x = 65;
        num.y = 20;
        num.width = 66;
        num.height = 66;
        num.textAlign = egret.HorizontalAlign.CENTER;
        num.verticalAlign = egret.VerticalAlign.MIDDLE;
        rankGroup.addChild(num);
        // 组名 用户名
        var userInfo = new egret.TextField();
        if (type == 1) {
            userInfo.textFlow = [
                { text: rank.teamName + '\n', style: { size: 28 } },
                { text: Util.getStrByWith(rank.userName, 160, 40), style: { size: 40 } }
            ];
            userInfo.y = 60;
            userInfo.lineSpacing = 10;
        }
        else {
            userInfo.text = rank.teamName;
            userInfo.size = 44;
            userInfo.y = 50;
            userInfo.width = 300;
            userInfo.height = 90;
            userInfo.verticalAlign = 'middle';
        }
        userInfo.x = 145;
        rankGroup.addChild(userInfo);
        // 达标率
        var achiRate = new egret.TextField();
        if (type == 1) {
            achiRate.textFlow = [
                { text: '个人达标率：\n' },
                { text: '个人当月积分：' }
            ];
            achiRate.x = 340;
            achiRate.y = 75;
            achiRate.size = 20;
            achiRate.lineSpacing = 15;
        }
        else {
            achiRate.text = '团队达标率';
            achiRate.x = 460;
            achiRate.y = 120;
            achiRate.size = 22;
        }
        rankGroup.addChild(achiRate);
        var achiRateNum = new egret.TextField();
        if (type == 1) {
            achiRateNum.textFlow = [
                { text: rank.achiRate.toFixed(2) + '%\n' },
                { text: rank.score + '' }
            ];
            achiRateNum.x = 470;
            achiRateNum.size = 36;
            achiRateNum.y = 65;
        }
        else {
            achiRateNum.text = rank.achiRate ? rank.achiRate.toFixed(2) + '%' : '0%';
            achiRateNum.x = 450;
            achiRateNum.width = 150;
            achiRateNum.textAlign = egret.HorizontalAlign.CENTER;
            achiRateNum.size = 42;
            achiRateNum.y = 70;
        }
        rankGroup.addChild(achiRateNum);
        // 如果是战队排行榜，注册点击事件
        if (type == 2) {
            rankGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var scene = new TeamRankScene(rank.teamId);
                ViewManager.getInstance().changeScene(scene);
            }, this);
        }
        return rankGroup;
    };
    return RankScene;
}(Scene));
__reflect(RankScene.prototype, "RankScene");
