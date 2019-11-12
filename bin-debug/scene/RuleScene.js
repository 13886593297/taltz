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
var RuleScene = (function (_super) {
    __extends(RuleScene, _super);
    function RuleScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RuleScene.prototype.init = function () {
        var _this = this;
        this.close_btn = false;
        _super.prototype.setBackground.call(this);
        var rule = Util.createBitmapByName('rule_png');
        rule.x = this.stage.stageWidth / 2;
        rule.anchorOffsetX = rule.width / 2;
        rule.y = 150;
        this.addChild(rule);
        // 关闭按钮
        var closeButton = Util.createBitmapByName('close_white_png');
        this.addChild(closeButton);
        closeButton.x = 580;
        closeButton.y = 200;
        closeButton.touchEnabled = true;
        closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.onBack();
        }, this);
        // 规则文字
        var group = new eui.Group;
        group.width = this.stage.stageWidth;
        var ruleText = new RuleText();
        group.addChild(ruleText);
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = 540;
        myScroller.height = 660;
        myScroller.x = (this.stage.stageWidth - myScroller.width) / 2;
        myScroller.y = 300;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
    };
    return RuleScene;
}(Scene));
__reflect(RuleScene.prototype, "RuleScene");
var RuleText = (function (_super) {
    __extends(RuleText, _super);
    function RuleText() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    RuleText.prototype.init = function () {
        var text = new egret.TextField;
        text.width = 540;
        text.size = 28;
        text.lineSpacing = 20;
        text.fontFamily = "微软雅黑";
        text.textFlow = [
            { text: " \n" },
            { text: " 一. 基本规则 \n", style: { "size": 35, bold: true } },
            { text: "1. 排名规则 \n", style: { "size": 30, bold: true } },
            { text: "a.个人排名:根据个人达标率进行先后排名，当达标率相同时，按照个人积分排名，积分高的排名靠前 \n" },
            { text: "b.团队排名:根据团队达标率进行先后排名，当达标率相同时，按照团队积分排名，积分高的排名靠前  \n\n" },
            { text: "2. 如何获得积分 \n", style: { "size": 30, bold: true } },
            { text: "a.每日签到一次,获得5积分,积分获得上限每日1次\n" },
            { text: "b.在训练场中完成一关获得20积分，积分获得上限为每日1次\n" },
            { text: "c.所有积分在每月最后一天清零\n" },
            { text: "3. 如何获得等级称号 \n", style: { "size": 30, bold: true } },
            { text: "a.完成三大训练场“艾”“乐”“明”中各20个关卡，可分别点亮“艾”“乐”“明”三个徽章，并解锁下一个训练场\n" },
            { text: "b.在每个训练场中，每通过一个关卡，将解锁下一个关卡，并获得相应的等级称号\n" },
            { text: "\n" },
            { text: "\n" },
            { text: "二.  训练场规则 \n", style: { "size": 35, bold: true } },
            { text: "a.每一关卡含10道随机习题，完成10题并点击提交后，可查看本次训练的正确率\n" },
            { text: "b.正确率达到100%，才可通关并解锁下一关。要知道，训练可没有捷径能走！\n" },
            { text: "c.答题过程中可收藏题目，在“训练场-我的收藏”中可查看\n" },
            { text: "\n" },
            { text: "\n" },
            { text: "**本平台规则由拓咨品牌组制定，并拥有最终解释权\n" }
        ];
        this.addChild(text);
        this.width = text.textWidth;
        this.height = text.textHeight;
    };
    return RuleText;
}(eui.Group));
__reflect(RuleText.prototype, "RuleText");
