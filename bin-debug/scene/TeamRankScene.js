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
        var bg = Util.createBitmapByName("blue_small_bg_png");
        bg.width = 590;
        bg.x = (this.stage.width - bg.width) / 2;
        bg.y = 80;
        this.addChild(bg);
        var title = new CTitle('队内月排行');
        title.y = 160;
        title.x = (this.stage.stageWidth - 283) / 2;
        this.addChild(title);
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
        var x = this.stage.stageWidth / 2 - 315;
        var bg = Util.createBitmapByName("user_border_png");
        bg.width = 630;
        bg.height = 830;
        bg.x = x;
        bg.y = 250;
        this.addChild(bg);
        var group = new eui.Group();
        this.groupView = group;
        group.width = 630;
        var rankDatas = this.personRank;
        var y = 10;
        for (var _i = 0, rankDatas_1 = rankDatas; _i < rankDatas_1.length; _i++) {
            var rank = rankDatas_1[_i];
            rank.type = 1;
            // let rankItem = new RankItemTemplate(rank)
            // rankItem.x = (this.stage.stageWidth - 555) / 2
            // rankItem.y = y
            // group.addChild(rankItem)
            // y += 210
        }
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = 700;
        myScroller.y = 280;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scrollView = myScroller;
        myScroller.addEventListener(eui.UIEvent.CHANGE_END, function () {
            if (myScroller.viewport.scrollV + 800 >= myScroller.viewport.contentHeight) {
                _this.loadMoreData();
            }
        }, this);
        var downArrow = Util.createBitmapByName('icon_down_png');
        downArrow.anchorOffsetX = 66;
        downArrow.y = 1050;
        downArrow.x = this.stage.stageWidth / 2;
        this.addChild(downArrow);
        downArrow.touchEnabled = true;
        downArrow.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            myScroller.viewport.scrollV += 200;
        }, this);
    };
    TeamRankScene.prototype.loadMoreData = function () {
        var _this = this;
        if (this.personPage > 0) {
            Http.getInstance().post(Url.HTTP_TEAM_PERSON_RANK_LIST, { tid: this.teamid, page: this.personPage, size: this.size }, function (json) {
                if (json.data.length == _this.size) {
                    _this.personPage += 1;
                }
                else {
                    _this.personPage = -1;
                }
                _this.personRank.concat(json.data);
                var x = _this.stage.stageWidth / 2 - 315;
                var y = _this.scrollView.viewport.contentHeight;
                for (var _i = 0, _a = json.data; _i < _a.length; _i++) {
                    var rank = _a[_i];
                    rank.type = 1;
                    var rankItem = new RankItem(rank, 500);
                    rankItem.x = x + 65;
                    rankItem.y = y;
                    _this.groupView.addChild(rankItem);
                    y += rankItem.height + 10;
                }
            });
        }
    };
    return TeamRankScene;
}(Scene));
__reflect(TeamRankScene.prototype, "TeamRankScene");
