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
var GetKettle = (function (_super) {
    __extends(GetKettle, _super);
    function GetKettle() {
        var _this = _super.call(this) || this;
        _this._myRotation = 5; // 旋转
        return _this;
    }
    GetKettle.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this, 'taltz_bg_png');
        this.btn_bg = 'close_white_png';
        Util.setTitle('桃子森林');
        var stage = ViewManager.getInstance().stage;
        var userInfo = DataManager.getInstance().getUser();
        this.userScore = userInfo.score;
        // 桃子森林标题
        var title = Util.createBitmapByName('title_png');
        title.x = 50;
        title.y = 30;
        this.addChild(title);
        // 头像积分背景
        var avatar_bg = Util.createBitmapByName('avatar_bg_png');
        avatar_bg.x = stage.stageWidth - avatar_bg.width;
        avatar_bg.y = 200;
        this.addChild(avatar_bg);
        // 头像
        Util.setUserImg(userInfo.avatar, 108, 476, 205, this);
        // 积分文字
        var scoreText = new egret.TextField();
        scoreText.text = '积分';
        scoreText.x = 610;
        scoreText.y = 220;
        scoreText.size = 40;
        this.addChild(scoreText);
        // 积分数值
        this.showScore(this.userScore);
        // 树下阴影
        var treeShadow = Util.createBitmapByName('shadow_png');
        treeShadow.y = 1190;
        this.addChild(treeShadow);
        // 桃子树
        var peachArr = [
            { bg: 'peachTreeLevel6_png', x: 0, y: stage.stageHeight / 2 - 150, width: 750 },
            { bg: 'peachTreeLevel5_png', x: 580, y: 810, width: 230 },
            { bg: 'peachTreeLevel4_png', x: 245, y: 870, width: 230 },
            { bg: 'peachTreeLevel3_png', x: 0, y: stage.stageHeight / 2 - 150, width: 750 },
            { bg: 'peachTreeLevel2_png', x: 360, y: 730, width: 230 },
            { bg: 'peachTreeLevel1_png', x: 0, y: stage.stageHeight / 2 - 150, width: 750 },
        ];
        for (var i = 0; i < peachArr.length; i++) {
            var peach = Util.createBitmapByName(peachArr[i].bg);
            peach.x = peachArr[i].x;
            peach.y = peachArr[i].y;
            peach.width = peachArr[i].width;
            this.addChild(peach);
            if (i == 1 || i == 2 || i == 4) {
                peach.anchorOffsetX = peach.width / 2;
                peach.rotation = -this._myRotation;
                var tw_1 = egret.Tween.get(peach, { loop: true });
                tw_1.to({ rotation: this._myRotation }, 1000, egret.Ease.quadInOut)
                    .to({ rotation: -this._myRotation }, 1000, egret.Ease.quadInOut);
                peach.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                    var tw = egret.Tween.get(evt.target);
                    tw.to({ x: 640, y: 266, scaleX: 0.2, scaleY: 0.2 }, 1500).call(function () {
                        _this.userScore += 15;
                        _this.showScore(_this.userScore);
                        _this.showScoreAni();
                    }).to({ alpha: 0 }, 500);
                }, this);
                peach.touchEnabled = true;
            }
        }
        // 浇水动画
        var kettle = new MyMovieClip('kettleMovie');
        kettle.x = 380;
        kettle.y = 450;
        kettle.alpha = 0;
        this.addChild(kettle);
        var tw = egret.Tween.get(kettle);
        tw.to({ alpha: 1 }, 500).wait(2000)
            .to({ alpha: 0 }, 500);
    };
    // 显示积分数值变化
    GetKettle.prototype.showScore = function (num) {
        if (this.scoreContent) {
            this.removeChild(this.scoreContent);
        }
        this.scoreContent = new egret.TextField();
        this.scoreContent.text = num;
        this.scoreContent.x = 610;
        this.scoreContent.y = 266;
        this.scoreContent.size = 40;
        this.addChild(this.scoreContent);
    };
    // 积分增加的动画
    GetKettle.prototype.showScoreAni = function () {
        this.scoreAni = new egret.TextField();
        this.scoreAni.text = '+15';
        this.scoreAni.size = 50;
        this.scoreAni.x = 660;
        this.scoreAni.y = 280;
        this.addChild(this.scoreAni);
        var tw = egret.Tween.get(this.scoreAni);
        tw.to({ y: 240, alpha: 0 }, 500);
    };
    return GetKettle;
}(Scene));
__reflect(GetKettle.prototype, "GetKettle");
