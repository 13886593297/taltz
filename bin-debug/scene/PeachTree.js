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
        _this.peachText = new eui.Group(); // 摘桃子提示
        _this.peachGroup = new eui.Group(); // 整体树和桃子
        return _this;
    }
    PeachTree.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this, 'taltz_bg_png');
        this.close_btn = 'close_white_png';
        Util.setTitle('桃子森林');
        this.initTitle();
        // 获取用户信息
        var userInfo = DataManager.getInstance().getUser();
        this.userInfo = userInfo;
        this.initAvatar();
        // 获取桃子信息
        Http.getInstance().post(Url.HTTP_WATERING_INFO, null, function (data) {
            _this.info = data.data;
            _this.getKattle();
        });
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
        this.avatarGroup = avatarGroup;
        this.addChild(avatarGroup);
        avatarGroup.touchEnabled = true;
        avatarGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = new UserScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        // 背景
        var avatar_bg = Util.createBitmapByName('avatar_bg_png');
        avatarGroup.x = this.stage.stageWidth - avatar_bg.width;
        avatarGroup.y = 200;
        avatarGroup.addChild(avatar_bg);
        // 头像
        Util.setUserImg(this.userInfo.avatar, 108, 11, 5, avatarGroup);
        // 积分文字
        var scoreText = new egret.TextField();
        scoreText.text = '积分';
        scoreText.x = 140;
        scoreText.y = 20;
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
            // 领取水壶
            emptyKattle_1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.removeChild(group_1); // 删除空水壶
                Http.getInstance().post(Url.HTTP_WATERING_DO, null, function (json) {
                    _this.curPeachInfo = json.data;
                    _this.drawTree(); // 开始画树
                    _this.kettleAni(); // 开始浇水动画
                });
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
        this.addChild(this.peachGroup);
        this.peachGroup.y = this.stage.stageHeight - 144;
        this.peachGroup.anchorOffsetY = this.stage.stageHeight - 144;
        // 树下阴影
        var treeShadow = Util.createBitmapByName('shadow_png');
        treeShadow.y = this.stage.stageHeight - 144;
        this.peachGroup.addChildAt(treeShadow, 1);
        // 桃树主干
        var leafArr = [
            { bg: 'peachTree1_png', zIndex: 2 },
            { bg: 'peachTree2_png', zIndex: 3 },
            { bg: 'peachTree3_png', zIndex: 5 },
        ];
        leafArr.forEach(function (item) {
            var leaf = Util.createBitmapByName(item.bg);
            leaf.y = _this.stage.stageHeight - 817;
            _this.peachGroup.addChildAt(leaf, item.zIndex);
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
        var kettle = new MyMovieClip('kettleMovie', 3);
        kettle.x = 380;
        kettle.y = this.stage.stageHeight - 884;
        kettleGroup.addChild(kettle);
        // 为你的桃树浇水吧
        var right_tip = new eui.Group();
        kettleGroup.addChild(right_tip);
        this.showTip(390, this.stage.stageHeight - 174, '为你的桃树浇水吧', right_tip);
        // 浇水成功提示
        var wateringTip = new eui.Group();
        wateringTip.x = 70;
        wateringTip.y = 410;
        wateringTip.alpha = 0;
        this.addChild(wateringTip);
        // 浇水成功背景
        var water_success_png = Util.createBitmapByName('water_success_png');
        wateringTip.addChild(water_success_png);
        // 浇水成功文字
        var water_success_text = new egret.TextField();
        water_success_text.text = '提示：浇水成功';
        water_success_text.width = 190;
        water_success_text.x = 70;
        water_success_text.height = water_success_png.height;
        water_success_text.textAlign = egret.HorizontalAlign.CENTER;
        water_success_text.verticalAlign = egret.VerticalAlign.MIDDLE;
        water_success_text.size = 20;
        water_success_text.textColor = 0x7fc871;
        wateringTip.addChild(water_success_text);
        // 浇水动画完成后显示浇水成功提示，再开始绘制桃子
        egret.Tween.get(kettleGroup)
            .to({ alpha: 1 }, 500).wait(2000)
            .to({ alpha: 0 }, 500).call(function () {
            egret.Tween.get(wateringTip)
                .to({ alpha: 1 }, 500).wait(1000)
                .to({ alpha: 0 }, 500).call(function () {
                _this.drawPeach();
            });
        });
    };
    /**
     * 画桃子
     */
    PeachTree.prototype.drawPeach = function () {
        var _this = this;
        var peachArr = [
            { bg: 'peach1_png', x: 580, y: this.stage.stageHeight - 524, zIndex: 2 },
            { bg: 'peach2_png', x: 245, y: this.stage.stageHeight - 464, zIndex: 2 },
            { bg: 'peach3_png', x: 360, y: this.stage.stageHeight - 604, zIndex: 5 },
        ];
        var pArr = []; // 创建出来的桃子数组
        peachArr.forEach(function (item) {
            var peach = Util.createBitmapByName(item.bg);
            peach.x = item.x;
            peach.y = item.y;
            peach.anchorOffsetX = peach.width / 2;
            peach.visible = false;
            _this.peachGroup.addChildAt(peach, item.zIndex);
            pArr.push(peach);
        });
        // 根据info显示对应的桃子
        this.info.peach.forEach(function (item) {
            var peach = pArr[item.position - 1];
            _this.count++;
            _this.peachAni(peach, item);
        });
        // 新成长的桃子
        if (this.curPeachInfo) {
            var lastPeachCreateDate = new Date(this.curPeachInfo.create_time.split('T')[0]).getDate();
            var curDate = new Date().getDate();
            // 最后一颗桃子生长出来的日期和当前日期一致说明是新长出来的桃子
            if (curDate - lastPeachCreateDate == 0) {
                var curPeach = pArr[this.curPeachInfo.position - 1];
                this.count++;
                curPeach.scaleX = 0;
                curPeach.scaleY = 0;
                egret.Tween.get(curPeach).to({ scaleX: 1, scaleY: 1 }, 1000);
                this.peachAni(curPeach, this.curPeachInfo);
            }
        }
        if (this.count <= 0) {
            this.peachTreeAni();
        }
        // 摘桃子提示
        this.addChild(this.peachText);
        this.showTip(390, this.stage.stageHeight - 174, '摘取你的功夫桃子', this.peachText);
        if (this.count <= 0) {
            this.peachText.visible = false;
        }
    };
    // 当没有桃子时点击桃树会上下晃动
    PeachTree.prototype.peachTreeAni = function () {
        var _this = this;
        this.peachGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            egret.Tween.get(_this.peachGroup)
                .to({ scaleY: 1.03 }, 300)
                .to({ scaleY: 1 }, 300)
                .to({ scaleY: 1.03 }, 300)
                .to({ scaleY: 1 }, 300);
        }, this);
    };
    /**
     * 根据后台数据显示桃子
     * @param peach 桃子
     * @param item 后台返回的每个桃子的数据
     */
    PeachTree.prototype.peachAni = function (peach, item) {
        var _this = this;
        peach.visible = true;
        peach.touchEnabled = true;
        // 桃子晃动动画
        peach.rotation = -this._myRotation;
        egret.Tween.get(peach, { loop: true })
            .to({ rotation: this._myRotation }, 1000, egret.Ease.quadInOut)
            .to({ rotation: -this._myRotation }, 1000, egret.Ease.quadInOut);
        // 摘桃子
        peach.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            egret.Tween.get(evt.target)
                .to({ x: 640, y: 310, scaleX: 0.2, scaleY: 0.2, visible: false }, 1500)
                .call(function () {
                Http.getInstance().post(Url.HTTP_WATERING_PICK + '?id=' + item.id, '', function (data) {
                    if (data.data != -1) {
                        _this.showScore(_this.userInfo.score += 15, true);
                        if (--_this.count <= 0) {
                            _this.peachText.visible = false;
                            _this.peachTreeAni();
                        }
                    }
                });
            });
        }, this);
    };
    // 积分
    PeachTree.prototype.showScore = function (num, isAni) {
        if (isAni === void 0) { isAni = false; }
        if (this.scoreContent) {
            this.avatarGroup.removeChild(this.scoreContent);
        }
        this.scoreContent = new egret.TextField();
        this.scoreContent.text = num;
        this.scoreContent.x = 140;
        this.scoreContent.y = 65;
        this.scoreContent.size = 40;
        this.avatarGroup.addChild(this.scoreContent);
        // 积分增加的动画
        if (isAni) {
            var scoreAni = new egret.TextField();
            scoreAni.text = '+15';
            scoreAni.size = 50;
            scoreAni.x = 200;
            scoreAni.y = 80;
            this.avatarGroup.addChild(scoreAni);
            var tw = egret.Tween.get(scoreAni);
            tw.to({ y: 40, alpha: 0 }, 500);
        }
    };
    // 显示提示
    PeachTree.prototype.showTip = function (x, y, text, group) {
        var tipBg = Util.createBitmapByName('tip_bg_png');
        group.addChild(tipBg);
        // 文字
        var tipText = new egret.TextField();
        tipText.text = text;
        tipText.width = tipBg.width;
        tipText.height = tipBg.height;
        tipText.textAlign = egret.HorizontalAlign.CENTER;
        tipText.verticalAlign = egret.VerticalAlign.MIDDLE;
        tipText.x = tipBg.x = x;
        tipText.y = tipBg.y = y;
        tipText.size = 26;
        group.addChild(tipText);
    };
    return PeachTree;
}(Scene));
__reflect(PeachTree.prototype, "PeachTree");
