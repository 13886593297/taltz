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
var PeachTree = (function (_super) {
    __extends(PeachTree, _super);
    function PeachTree() {
        var _this = _super.call(this) || this;
        _this._myRotation = 5; // 旋转角度
        _this.count = 0; // 显示几个桃子
        return _this;
    }
    PeachTree.prototype.init = function () {
        _super.prototype.setBackground.call(this, 'taltz_bg_png');
        this.close_btn = 'close_white_png';
        Util.setTitle('桃子森林');
        this.initTitle();
        // 获取用户信息
        var userInfo = DataManager.getInstance().getUser();
        this.userInfo = userInfo;
        this.initAvatar();
        // 获取桃子信息
        var info = RES.getRes('instruction_json');
        this.info = info;
        this.getKattle();
    };
    /**
     * 初始化标题
     */
    PeachTree.prototype.initTitle = function () {
        var _this = this;
        // 桃子森林group
        var titleGroup = new eui.Group();
        titleGroup.x = 50;
        titleGroup.y = 30;
        this.addChild(titleGroup);
        // 桃子森林title
        var title = Util.createBitmapByName('title_png');
        titleGroup.addChild(title);
        // 战队月排名
        var rank = Util.createBitmapByName('title_rank_png');
        rank.y = 150;
        rank.touchEnabled = true;
        // 跳转到战队月排名
        rank.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var rankscene = new RankScene();
            ViewManager.getInstance().changeScene(rankscene);
        }, this);
        titleGroup.addChild(rank);
        // 签到回顾
        var signRecord = Util.createBitmapByName('title_signRecord_png');
        signRecord.y = 250;
        signRecord.touchEnabled = true;
        // 跳转到签到页面
        signRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var sign = new Sign();
            _this.addChildAt(sign, 100);
        }, this);
        titleGroup.addChild(signRecord);
    };
    /**
     * 初始化头像积分
     */
    PeachTree.prototype.initAvatar = function () {
        var avatarGroup = new eui.Group();
        this.addChild(avatarGroup);
        avatarGroup.touchEnabled = true;
        avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = new UserScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        // 背景
        var avatar_bg = Util.createBitmapByName('avatar_bg_png');
        avatar_bg.x = this.stage.stageWidth - avatar_bg.width;
        avatar_bg.y = 200;
        avatarGroup.addChild(avatar_bg);
        // 头像
        Util.setUserImg(this.userInfo.avatar, 108, 476, 205, avatarGroup);
        // 积分文字
        var scoreText = new egret.TextField();
        scoreText.text = '积分';
        scoreText.x = 610;
        scoreText.y = 220;
        scoreText.size = 40;
        avatarGroup.addChild(scoreText);
        // 积分数值
        this.showScore(this.userInfo.score);
    };
    /**
     * 领取水壶动画
     */
    PeachTree.prototype.getKattle = function () {
        var _this = this;
        // 每天领取水壶
        if (!this.info.isGetKattle) {
            var group_1 = new eui.Group();
            this.addChild(group_1);
            // 领取水壶
            var emptyKattle_1 = Util.createBitmapByName('kettle_empty_png');
            emptyKattle_1.scaleX = 0;
            emptyKattle_1.scaleY = 0;
            emptyKattle_1.x = 350;
            emptyKattle_1.y = 700;
            // 设置水壶缩放点为中心
            emptyKattle_1.anchorOffsetX = emptyKattle_1.width / 2;
            emptyKattle_1.anchorOffsetY = emptyKattle_1.height / 2;
            egret.Tween.get(emptyKattle_1)
                .to({ scaleX: 1, scaleY: 1 }, 1000).wait(1000)
                .call(function () {
                // 水壶晃动动画
                egret.Tween.get(emptyKattle_1, { loop: true })
                    .to({ rotation: 10 }, 150)
                    .to({ rotation: -10 }, 150)
                    .to({ rotation: 10 }, 150)
                    .to({ rotation: -10 }, 150)
                    .wait(1000);
                // 领取水壶提示背景
                _this.showTip(420, 720, '恭喜你获得水壶×1', group_1);
            });
            emptyKattle_1.touchEnabled = true;
            group_1.addChild(emptyKattle_1);
            // 点击领取水壶，提交后台记录信息，浇水天数+1
            emptyKattle_1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.removeChild(group_1); // 删除空水壶
                _this.info.isGetKattle = true;
                _this.info.waterDays++;
                // 如果到了5天的整数倍，新长出一颗桃子
                if (_this.info.waterDays % 5 == 0) {
                    for (var i = 0; i < _this.info.peach.length; i++) {
                        if (!_this.info.peach[i].isGrowUp) {
                            _this.info.peach[i].isGrowUp = true;
                            _this.curPeachIndex = i;
                            break;
                        }
                    }
                }
                _this.drawTree(); // 开始画树
                _this.kettleAni(); // 开始浇水动画
            }, this);
        }
        else {
            this.drawTree();
            this.drawPeach();
        }
    };
    /**
     * 画树
     */
    PeachTree.prototype.drawTree = function () {
        var _this = this;
        // 树下阴影
        var treeShadow = Util.createBitmapByName('shadow_png');
        treeShadow.y = 1190;
        this.addChildAt(treeShadow, 1);
        // 叶子
        var leafArr = [
            { bg: 'peachTree1_png', zIndex: 2 },
            { bg: 'peachTree2_png', zIndex: 5 },
            { bg: 'peachTree3_png', zIndex: 7 },
        ];
        leafArr.forEach(function (item) {
            var leaf = Util.createBitmapByName(item.bg);
            leaf.x = 0;
            leaf.y = 517;
            _this.addChildAt(leaf, item.zIndex);
        });
    };
    /**
     * 浇水动画
     */
    PeachTree.prototype.kettleAni = function () {
        var _this = this;
        var kettleGroup = new eui.Group();
        kettleGroup.alpha = 0;
        this.addChild(kettleGroup);
        // 水壶
        var kettle = new MyMovieClip('kettleMovie');
        kettle.x = 380;
        kettle.y = 450;
        kettleGroup.addChild(kettle);
        // 左上角提示
        var left_tip_bg = Util.createBitmapByName('water_success_png');
        left_tip_bg.x = 70;
        left_tip_bg.y = 410;
        kettleGroup.addChild(left_tip_bg);
        var left_tip_text = new egret.TextField();
        left_tip_text.text = '提示：浇水成功';
        left_tip_text.width = 200;
        left_tip_text.height = left_tip_bg.height;
        left_tip_text.x = 140;
        left_tip_text.y = 410;
        left_tip_text.textAlign = egret.HorizontalAlign.CENTER;
        left_tip_text.verticalAlign = egret.VerticalAlign.MIDDLE;
        left_tip_text.size = 20;
        left_tip_text.textColor = 0x7fc871;
        kettleGroup.addChild(left_tip_text);
        // 右下角提示
        var right_tip = new eui.Group();
        kettleGroup.addChild(right_tip);
        this.showTip(390, 1160, '为你的桃树浇水吧', right_tip);
        egret.Tween.get(kettleGroup)
            .to({ alpha: 1 }, 500).wait(2000)
            .to({ alpha: 0 }, 500).call(function () {
            _this.drawPeach();
        });
    };
    /**
     * 画桃子
     */
    PeachTree.prototype.drawPeach = function () {
        var _this = this;
        var peachArr = [
            { bg: 'peach1_png', x: 580, y: 810, zIndex: 3 },
            { bg: 'peach2_png', x: 245, y: 870, zIndex: 4 },
            { bg: 'peach3_png', x: 360, y: 730, zIndex: 8 },
        ];
        peachArr.forEach(function (item, i) {
            var peach = Util.createBitmapByName(item.bg);
            peach.x = item.x;
            peach.y = item.y;
            _this.addChildAt(peach, item.zIndex);
            // 桃子是否显示
            peach.visible = _this.info.peach[i].isGrowUp;
            if (_this.info.peach[i].isGrowUp) {
                _this.count++;
            }
            // 刚长出来的桃子
            if (_this.curPeachIndex == i) {
                peach.scaleX = 0;
                peach.scaleY = 0;
                egret.Tween.get(peach).to({ scaleX: 1, scaleY: 1 }, 1000);
            }
            peach.touchEnabled = true;
            peach.anchorOffsetX = peach.width / 2;
            // 桃子晃动动画
            peach.rotation = -_this._myRotation;
            egret.Tween.get(peach, { loop: true })
                .to({ rotation: _this._myRotation }, 1000, egret.Ease.quadInOut)
                .to({ rotation: -_this._myRotation }, 1000, egret.Ease.quadInOut);
            // 摘取桃子
            peach.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                egret.Tween.get(evt.target)
                    .to({ x: 640, y: 310, scaleX: 0.2, scaleY: 0.2, visible: false }, 1500)
                    .call(function () {
                    _this.userInfo.score += 15;
                    _this.showScore(_this.userInfo.score);
                    _this.showScoreAni();
                    _this.count--;
                    if (_this.count <= 0) {
                        peachText.visible = false;
                    }
                });
            }, _this);
        });
        // 摘取你的功夫桃子文字
        var peachText = new eui.Group();
        this.addChild(peachText);
        this.showTip(390, 1160, '摘取你的功夫桃子', peachText);
        if (this.count <= 0) {
            peachText.visible = false;
        }
    };
    // 积分
    PeachTree.prototype.showScore = function (num) {
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
    PeachTree.prototype.showScoreAni = function () {
        var scoreAni = new egret.TextField();
        scoreAni.text = '+15';
        scoreAni.size = 50;
        scoreAni.x = 660;
        scoreAni.y = 280;
        this.addChild(scoreAni);
        var tw = egret.Tween.get(scoreAni);
        tw.to({ y: 240, alpha: 0 }, 500);
    };
    // 显示提示
    PeachTree.prototype.showTip = function (x, y, text, group) {
        var tipBg = Util.createBitmapByName('tip_bg_png');
        tipBg.x = x;
        tipBg.y = y;
        group.addChild(tipBg);
        // 文字
        var tipText = new egret.TextField();
        tipText.text = text;
        tipText.width = tipBg.width;
        tipText.height = tipBg.height;
        tipText.textAlign = egret.HorizontalAlign.CENTER;
        tipText.verticalAlign = egret.VerticalAlign.MIDDLE;
        tipText.x = x;
        tipText.y = y;
        tipText.size = 26;
        group.addChild(tipText);
    };
    return PeachTree;
}(Scene));
__reflect(PeachTree.prototype, "PeachTree");
