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
var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo(type) {
        var _this = _super.call(this) || this;
        _this.isinit = false;
        _this.timer = null;
        _this.setting = {
            'home': { bg: 'info_top01_png' },
            'center': { bg: 'info_top02_png' },
            'score': { bg: 'info_top03_png' }
        };
        _this.type = type;
        _this.userinfo = DataManager.getInstance().getUser();
        if (!_this.userinfo) {
            var timer = new egret.Timer(500, 5);
            timer.addEventListener(egret.TimerEvent.TIMER, _this.timerFunc, _this);
            timer.start();
            _this.timer = timer;
        }
        else {
            _this.init();
        }
        return _this;
    }
    UserInfo.prototype.timerFunc = function () {
        if (!this.isinit) {
            this.userinfo = DataManager.getInstance().getUser();
            if (this.userinfo)
                this.init();
        }
    };
    UserInfo.prototype.refresh = function () {
        this.removeChildren();
        this.userinfo = DataManager.getInstance().getUser();
        this.init();
    };
    /**
     * [init初始化页面]
     *
     * 底框 背景 头像 个人信息
     */
    UserInfo.prototype.init = function () {
        this.isinit = true;
        if (this.timer)
            this.timer.stop();
        var stage = ViewManager.getInstance().stage;
        var setting = this.setting[this.type];
        var info_top = Util.createBitmapByName(setting.bg);
        info_top.width = stage.stageWidth;
        this.addChild(info_top);
        this.infoBg();
    };
    UserInfo.prototype.infoBg = function () {
        var stage = ViewManager.getInstance().stage;
        var group = new eui.Group();
        this.group = group;
        this.addChild(group);
        var bg;
        if (this.type == 'score') {
            bg = Util.createBitmapByName('info_bg1_png');
            group.y = 140;
        }
        else {
            bg = Util.createBitmapByName('info_bg_png');
            group.y = 110;
        }
        group.x = (stage.stageWidth - bg.width) / 2;
        group.width = bg.width;
        group.height = bg.height;
        group.addChild(bg);
        this.initRight();
        this.initLeft();
        if (this.type == 'score') {
            var trainResult = this.userinfo.trainResult;
            var rateValue = Math.round(trainResult.trainCorrectCount * 100 / trainResult.trainTotalCount);
            var trainGroup = new eui.Group();
            trainGroup.x = 230;
            trainGroup.y = 630;
            group.addChild(trainGroup);
            var textArr = ['累积训练', '正确率'];
            this.info(textArr, trainGroup, 42, 365, 60);
            var numArr = [trainResult.trainTotalCount + '题', rateValue + '%'];
            this.info(numArr, trainGroup, 42, 365, 60, egret.HorizontalAlign.RIGHT);
        }
    };
    // 头像 个人排名
    UserInfo.prototype.initLeft = function () {
        var x = 30;
        var iconGroup = new eui.Group();
        iconGroup.width = 260;
        iconGroup.height = 260;
        iconGroup.x = x;
        iconGroup.y = 10;
        this.group.addChild(iconGroup);
        // 头像
        var avatar = Util.setUserImg(this.userinfo.avatar, 157);
        avatar.x = this.type == 'score' ? 109 : 30;
        avatar.y = this.type == 'score' ? 114 : 30;
        this.group.addChild(avatar);
        // 桃子森林
        var peachWord = Util.createBitmapByName('peachWord_png');
        peachWord.width = 240;
        peachWord.x = -10;
        peachWord.y = 300;
        if (this.type != 'score') {
            iconGroup.addChild(peachWord);
        }
        peachWord.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 跳转到桃子森林页面
            var scene = new PeachScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
        peachWord.touchEnabled = true;
        //人名
        var name = new egret.TextField();
        name.textColor = 0xffffff;
        if (this.type == 'score') {
            name.x = 410;
            name.y = 130;
            name.width = 160;
            name.height = 40;
        }
        else {
            name.x = 0;
            name.y = 215;
            name.size = 44;
            name.width = 220;
            name.height = 60;
        }
        name.text = Util.getStrByWith(this.userinfo.nickName, name.width - 40, name.size);
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.verticalAlign = egret.VerticalAlign.MIDDLE;
        iconGroup.addChild(name);
        // 等级徽章
        var iconnames = ['icon_brand1_png', 'icon_brand2_png', 'icon_brand3_png', 'icon_brand4_png'];
        var vicon = Math.ceil(this.userinfo.lv / 20) - 1;
        var flilter = Util.grayFliter();
        var iconx = 420;
        var icony = 40;
        var key = 1;
        for (var _i = 0, iconnames_1 = iconnames; _i < iconnames_1.length; _i++) {
            var icon = iconnames_1[_i];
            var levelIcon = Util.createBitmapByName(icon);
            levelIcon.x = iconx;
            levelIcon.y = icony;
            if (this.type != 'score') {
                this.group.addChild(levelIcon);
            }
            iconx += 47;
            if (key > vicon) {
                levelIcon.filters = [flilter];
            }
            key++;
        }
        // 等级
        var level = new egret.TextField();
        level.text = this.userinfo.lvShow;
        level.textColor = 0xffffff;
        level.size = 44;
        if (this.type == 'score') {
            level.x = 300;
            level.y = 210;
        }
        else {
            level.x = 220;
            level.y = 100;
        }
        this.group.addChild(level);
        // 等级称号
        var levelName = new egret.TextField();
        levelName.text = this.userinfo.lvName;
        levelName.textColor = 0xffffff;
        levelName.size = 44;
        if (this.type == 'score') {
            levelName.x = 430;
            levelName.y = 210;
        }
        else {
            levelName.x = 220;
            levelName.y = 160;
        }
        this.group.addChild(levelName);
    };
    UserInfo.prototype.initRight = function () {
        var textGroup = new eui.Group();
        this.group.addChild(textGroup);
        // 标题
        var titleArr;
        // 数值
        var numArr;
        if (this.type == 'score') {
            titleArr = ['个人累计积分', '累积签到', '个人达标率', '团队达标率'];
            textGroup.x = 230;
            textGroup.y = 350;
            this.info(titleArr, textGroup, 28, 365, 50);
            numArr = [this.userinfo.score + '分', this.userinfo.signTotal + '天', this.userinfo.personAchiRate + '%', this.userinfo.teamAchiRate.toFixed(2) + '%'];
            this.info(numArr, textGroup, 30, 365, 50, egret.HorizontalAlign.RIGHT);
        }
        else {
            titleArr = ['个人累计积分', '个人达标率', '团队达标率', '连续达标天数'];
            textGroup.x = 300;
            textGroup.y = 230;
            this.info(titleArr, textGroup, 24);
            numArr = [this.userinfo.score + '分', this.userinfo.personAchiRate + '%', this.userinfo.teamAchiRate.toFixed(2) + '%', this.userinfo.contSignTotal + '天'];
            this.info(numArr, textGroup, 28, 300, 45, egret.HorizontalAlign.RIGHT);
        }
    };
    /**
     *
     * @param arr arr
     * @param group group
     * @param size 文字大小
     * @param w 宽度
     * @param h 文字间隔高度
     * @param textAlign 对齐方式
     */
    UserInfo.prototype.info = function (arr, group, size, w, h, textAlign) {
        if (w === void 0) { w = 300; }
        if (h === void 0) { h = 45; }
        if (textAlign === void 0) { textAlign = egret.HorizontalAlign.LEFT; }
        var y = 0;
        arr.map(function (item) {
            var text = new egret.TextField();
            text.text = item;
            text.textAlign = textAlign;
            text.width = w;
            text.y = y;
            text.size = size;
            group.addChild(text);
            y += h;
        });
    };
    return UserInfo;
}(eui.Group));
__reflect(UserInfo.prototype, "UserInfo");
