// class RankerPanel extends eui.Group {
//     private ranks
//     public constructor(data) {
//         super()
//         this.ranks = data
//         this.init()
//     }
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
//     public init() {
//         let stage = ViewManager.getInstance().stage
//         let mask: egret.Bitmap = Util.createBitmapByName('bg_png')
//         mask.y = 0
//         mask.x = 0
//         mask.width = stage.stageWidth
//         mask.height = stage.stageHeight
//         this.addChild(mask)
//         let panel = new eui.Panel()
//         // let y = (stage.stageHeight - 1000) / 2
//         panel.title = "战队月排名"
//         panel.width = 700
//         panel.height = 1000
//         panel.x = stage.stageWidth / 2
//         panel.y = stage.stageHeight / 2
//         panel.anchorOffsetX = panel.width / 2
//         panel.anchorOffsetY = panel.height / 2
//         panel.scaleX = 0
//         panel.scaleY = 0
//         egret.Tween.get(panel).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backInOut)
//         this.addChild(panel)
//         var group = new eui.Group()
//         group.height = 5000
//         group.width = 700
//         panel.addChild(group)
//         let ranks = this.ranks
//         let x = 50
//         let y = 0
//         for (let rank of ranks) {
//             let rankitem = new RankItemTeamTemplate(rank, false)
//             rankitem.x = x
//             rankitem.y = y
//             group.addChild(rankitem)
//             y += 140
//         }
//         var myScroller: eui.Scroller = new eui.Scroller()
//         //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
//         myScroller.height = 800
//         myScroller.width = 660
//         myScroller.y = 150
//         myScroller.x = 20
//         //设置viewport
//         myScroller.viewport = group
//         panel.addChild(myScroller)
//         let closeX = Util.createBitmapByName('dialog_close_x_png')
//         panel.addChild(closeX)
//         closeX.x = panel.width - 80
//         closeX.y = -10
//         closeX.touchEnabled = true
//         closeX.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
//             console.log('close')
//             Util.playMusic('model_select_mp3')
//             eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CLOSING, true, true)
//             this.parent.removeChild(this)
//             panel.close()
//         }, this)
//     }
// }
var RankItem = (function (_super) {
    __extends(RankItem, _super);
    function RankItem(rankData, width) {
        if (width === void 0) { width = 600; }
        var _this = _super.call(this) || this;
        _this.width = width;
        _this.rankData = rankData;
        _this.init();
        return _this;
    }
    RankItem.prototype.init = function () {
        var _this = this;
        this.height = 130;
        var bg;
        if (this.rankData.serialNo == 1) {
            bg = Util.createBitmapByName("rank_item1_bg_png");
        }
        else {
            bg = Util.createBitmapByName("rank_item_bg_png");
        }
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        if (this.rankData.serialNo < 4) {
            var cup = Util.createBitmapByName("cup" + this.rankData.serialNo + "_png");
            cup.width = 28;
            cup.height = 27;
            cup.x = this.width - 40;
            cup.y = 40;
            this.addChild(cup);
        }
        var numberbg = Util.createBitmapByName("rank_number_bg_png");
        numberbg.width = 59;
        numberbg.height = 59;
        numberbg.x = -30;
        numberbg.y = 20;
        this.addChild(numberbg);
        var number = new egret.TextField();
        number.text = this.rankData.serialNo + "";
        number.size = 28;
        number.x = -25;
        number.y = 25;
        number.height = 50;
        number.width = 50;
        number.verticalAlign = egret.VerticalAlign.MIDDLE;
        number.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(number);
        var title = new egret.TextField();
        if (this.rankData.type == 1) {
            title.text = this.rankData.teamName + '-' + this.rankData.userName;
        }
        else {
            title.text = this.rankData.teamName;
        }
        title.size = 30;
        title.height = 60;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.textAlign = egret.HorizontalAlign.CENTER;
        title.width = this.width;
        title.y = 10;
        this.addChild(title);
        var line = Util.createBitmapByName("dialog_line_png");
        line.x = 138;
        line.y = 70;
        line.width = 323;
        this.addChild(line);
        var score = new egret.TextField();
        if (this.rankData.type == 1) {
            score.textFlow = new Array({ text: "个人积分:" }, { text: this.rankData.score + "", style: { textColor: 0xF46C22, size: 32 } });
        }
        else {
            score.textFlow = new Array({ text: "战队积分:" }, { text: this.rankData.teamScore + "", style: { textColor: 0xF46C22, size: 32 } });
        }
        score.size = 30;
        score.height = 60;
        score.verticalAlign = egret.VerticalAlign.MIDDLE;
        score.textAlign = egret.HorizontalAlign.CENTER;
        score.width = this.width;
        score.y = 72;
        this.addChild(score);
        if (this.rankData.type == 2) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var scene = new TeamRankScene(_this.rankData.teamId);
                ViewManager.getInstance().changeScene(scene);
            }, this);
        }
    };
    return RankItem;
}(eui.Group));
__reflect(RankItem.prototype, "RankItem");
var AlertPanel = (function (_super) {
    __extends(AlertPanel, _super);
    function AlertPanel(title, y, isGray) {
        if (title === void 0) { title = " "; }
        if (isGray === void 0) { isGray = false; }
        var _this = _super.call(this) || this;
        _this.title = "";
        _this.isGray = false;
        _this.title = title;
        _this.isGray = isGray;
        _this.y = y;
        _this.init();
        return _this;
    }
    AlertPanel.prototype.init = function () {
        var _this = this;
        var stage = ViewManager.getInstance().stage;
        var panel = new eui.Panel();
        panel.skinName = "resource/eui_skins/AlertPanelSkin.exml";
        panel.title = this.title;
        panel.width = 472;
        panel.height = 60;
        this.x = (stage.stageWidth - panel.width) / 2;
        this.addChild(panel);
        if (this.isGray) {
            panel.filters = [Util.grayFliter()];
        }
        // 显示2秒后关闭
        this.timer = new egret.Timer(2000, 1);
        this.timer.addEventListener(egret.TimerEvent.TIMER, function () {
            _this.parent.removeChild(_this);
        }, this);
        this.timer.start();
    };
    return AlertPanel;
}(eui.Group));
__reflect(AlertPanel.prototype, "AlertPanel");
