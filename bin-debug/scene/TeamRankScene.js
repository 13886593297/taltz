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
var TeamRankScene = (function (_super) {
    __extends(TeamRankScene, _super);
    function TeamRankScene(teamid) {
        var _this = _super.call(this) || this;
        _this.personRank = [];
        _this.size = 20;
        _this.personPage = 1;
        _this.teamid = teamid;
        return _this;
    }
    TeamRankScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this._width = this.stage.stageWidth;
        this._height = this.stage.stageHeight;
        var bg = Util.createBitmapByName("teamRank_png");
        this.addChild(bg);
        //请求团队数据
        Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, function (json) {
            _this.personRank = json.data;
            if (json.data.length == _this.size) {
                _this.personPage += 1;
            }
            else {
                _this.personPage = -1;
            }
            _this.initRanker();
        });
    };
    TeamRankScene.prototype.initRanker = function () {
        var _this = this;
        var group = new eui.Group();
        this.groupView = group;
        group.width = 640;
        this.addItem(this.personRank);
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
    TeamRankScene.prototype.addItem = function (data, y) {
        if (y === void 0) { y = 60; }
        console.log(data);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var rank = data_1[_i];
            var rankItem = this.rankItemTemplate(rank, y);
            y += 200;
            rankItem.height = 200;
            this.groupView.addChild(rankItem);
        }
    };
    TeamRankScene.prototype.rankItemTemplate = function (item, y) {
        var rankGroup = new eui.Group();
        rankGroup.y = y;
        // 排名背景
        var rankBg = Util.createBitmapByName('rank_item_bg_png');
        rankGroup.x = (this._width - rankBg.width) / 2;
        rankGroup.width = rankBg.width;
        rankGroup.addChild(rankBg);
        // 排名皇冠
        if (item.serialNo < 4) {
            var crown = Util.createBitmapByName('cup' + item.serialNo + '_png');
            crown.x = 515;
            crown.y = -20;
            rankGroup.addChild(crown);
        }
        // 排名No.
        var num = new egret.TextField();
        num.text = item.serialNo;
        num.textColor = item.serialNo == 1 ? 0xd7a83f : item.serialNo == 2 ? 0xbebebe : item.serialNo == 3 ? 0xb77e43 : 0x077424;
        num.bold = true;
        num.size = item.serialNo < 100 ? 50 : 38;
        num.x = 65;
        num.y = 20;
        num.width = 66;
        num.height = 66;
        num.textAlign = egret.HorizontalAlign.CENTER;
        num.verticalAlign = egret.VerticalAlign.MIDDLE;
        rankGroup.addChild(num);
        // 组名
        var userInfo = new egret.TextField();
        userInfo.textFlow = [
            { text: item.teamName + '\n', style: { size: 28 } },
            { text: Util.getStrByWith(item.userName, 160, 40), style: { size: 40 } }
        ];
        userInfo.y = 60;
        userInfo.lineSpacing = 10;
        userInfo.x = 145;
        rankGroup.addChild(userInfo);
        // 达标率
        var achiRate = new egret.TextField();
        achiRate.textFlow = [
            { text: '个人达标率：\n' },
            { text: '个人当月积分：' }
        ];
        achiRate.x = 340;
        achiRate.y = 75;
        achiRate.size = 20;
        achiRate.lineSpacing = 15;
        rankGroup.addChild(achiRate);
        var achiRateNum = new egret.TextField();
        achiRateNum.textFlow = [
            { text: item.achiRate.toFixed(2) + '%\n' },
            { text: item.score + '' }
        ];
        achiRateNum.x = 470;
        achiRateNum.size = 36;
        achiRateNum.y = 65;
        rankGroup.addChild(achiRateNum);
        return rankGroup;
    };
    TeamRankScene.prototype.loadMoreData = function () {
        var _this = this;
        if (this.personPage > 0) {
            Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, function (json) {
                console.log(json);
                if (json.data.length == _this.size) {
                    _this.personPage += 1;
                }
                else {
                    _this.personPage = -1;
                }
                _this.personRank.concat(json.data);
                _this.addItem(json.data, _this.scrollView.viewport.contentHeight);
            });
        }
    };
    return TeamRankScene;
}(Scene));
__reflect(TeamRankScene.prototype, "TeamRankScene");
