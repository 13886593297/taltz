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
/**
 * 每日签到组件
 * 半透明背景、背景、标头、日历  关闭按钮
 *
 */
var Sign = (function (_super) {
    __extends(Sign, _super);
    function Sign() {
        var _this = _super.call(this) || this;
        _this.WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        _this.signData = DataManager.getInstance().getSign();
        var signed = _this.signData['signStr'].split('');
        var signedData = [];
        for (var i = 0; i < signed.length; i++) {
            if (signed[i] > 0) {
                signedData.push(i + 1);
            }
        }
        _this.signed = signedData;
        _this.init();
        return _this;
    }
    Sign.prototype.init = function () {
        var _this = this;
        var stage = ViewManager.getInstance().stage;
        var mask = Util.createBitmapByName('bg_png');
        mask.x = 0;
        mask.y = 0;
        mask.width = stage.stageWidth;
        mask.height = stage.stageHeight;
        this.addChild(mask);
        // 窗口弹出效果
        var group = new eui.Group();
        group.width = stage.stageWidth;
        group.height = stage.stageHeight;
        group.x = stage.stageWidth / 2;
        group.y = stage.stageHeight / 2;
        group.anchorOffsetX = group.width / 2;
        group.anchorOffsetY = group.height / 2;
        group.scaleX = 0;
        group.scaleY = 0;
        this.addChild(group);
        this._myGroup = group;
        egret.Tween.get(group).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backInOut);
        // 签到背景
        var signBg = Util.createBitmapByName('green_small_bg_png');
        signBg.x = stage.stageWidth / 2;
        signBg.anchorOffsetX = signBg.width / 2;
        signBg.y = 150;
        group.addChild(signBg);
        // 关闭按钮
        var closeButton = Util.createBitmapByName('close_white_png');
        group.addChild(closeButton);
        closeButton.x = 580;
        closeButton.y = 180;
        closeButton.touchEnabled = true;
        closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Util.playMusic('model_select_mp3');
            eui.UIEvent.dispatchUIEvent(_this, eui.UIEvent.CLOSING, true, true);
            _this.parent.removeChild(_this);
        }, this);
        this.createCalendar();
    };
    Sign.prototype.createSignText = function () {
        var group = new eui.Group();
        group.y = 780;
        this._myGroup.addChild(group);
        var text1 = new egret.TextField();
        text1.textFlow = [
            {
                text: ' ' + this.signData.signtTotal + ' ',
                style: { size: 50, underline: true }
            },
            { text: '天', style: { size: 40 } },
            { text: '累计签到', style: { size: 30 } }
        ];
        text1.x = 150;
        text1.y = 20;
        group.addChild(text1);
        var text2 = new egret.TextField();
        text2.textFlow = [
            {
                text: ' ' + this.signData.signAllTotal + ' ',
                style: { size: 50, underline: true }
            },
            { text: '人', style: { size: 40 } },
            { text: '今日签到', style: { size: 30 } }
        ];
        text2.x = 420;
        text2.y = 20;
        group.addChild(text2);
        var userinfo = DataManager.getInstance().getUser();
        var notes = new egret.TextField();
        notes.text = '你已持续达标' + userinfo.contSignTotal + '天';
        notes.bold = true;
        notes.x = 230;
        notes.y = 250;
        notes.size = 40;
        notes.textColor = 0x3a9e53;
        group.addChild(notes);
    };
    // 创建日历
    Sign.prototype.createCalendar = function () {
        var group = new eui.Group();
        group.y = 180;
        this._myGroup.addChild(group);
        var width = 70; // 每个日期的宽度
        var left = 140; // 最初的左边距
        // 创建星期头部
        for (var i = 0; i < this.WEEK.length; i++) {
            var label = new egret.TextField();
            label.text = this.WEEK[i];
            label.x = left + i * width;
            label.y = 150;
            label.width = width;
            label.textAlign = egret.HorizontalAlign.CENTER;
            label.size = 26;
            group.addChild(label);
        }
        var height = 72; // 每个数字的高度
        var curDate = new Date();
        // 当前日期
        var currentDay = curDate.getDate();
        // 获取这个月有多少天，将月份下移到下一个月份，同时将日期设置为0；由于Date里的日期是1~31，所以Date对象自动跳转到上一个月的最后一天；getDate（）获取天数即可。
        curDate.setMonth(curDate.getMonth() + 1);
        curDate.setDate(0);
        var days = curDate.getDate();
        // 获取第一天星期几
        curDate.setDate(1);
        // 返回的是0-6，设置0为7
        var week1 = curDate.getDay() == 0 ? 7 : curDate.getDay();
        var max = week1 + days;
        for (var i = 0; i < max; i++) {
            if (i >= week1) {
                var day = i - week1 + 1;
                var sign = 0;
                if (this.signed.indexOf(day) > -1) {
                    sign = 1;
                }
                // if (currentDay == day) {
                //     sign = 2
                // }
                var singItem = new SignItem(day, sign);
                singItem.x = left + ((i - 1) % 7) * width;
                singItem.y = Math.ceil(i / 7) * height + 100;
                group.addChild(singItem);
            }
        }
        this.createSignText();
    };
    return Sign;
}(egret.DisplayObjectContainer));
__reflect(Sign.prototype, "Sign");
var SignItem = (function (_super) {
    __extends(SignItem, _super);
    function SignItem(text, sign) {
        if (sign === void 0) { sign = 0; }
        var _this = _super.call(this) || this;
        _this.W = 88;
        _this.H = 70;
        _this.sign = 0;
        _this.text = text;
        _this.sign = sign;
        _this.width = _this.W;
        _this.height = _this.H;
        _this.init();
        return _this;
    }
    SignItem.prototype.init = function () {
        if (this.sign > 0) {
            var icon = Util.createBitmapByName('sign_mask_png');
            icon.x = (this.W - icon.width) / 2;
            icon.y = (this.H - icon.height) / 2;
            this.addChild(icon);
            // //当前签到中
            // if (this.sign == 2) {
            //     icon.alpha = 0
            //     egret.Tween.get(icon).to(
            //         { alpha: 1 },
            //         3000,
            //         egret.Ease.backInOut
            //     )
            // }
        }
        var label = new egret.TextField();
        label.text = this.text;
        label.width = this.W;
        label.height = this.H;
        label.size = 28;
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(label);
    };
    return SignItem;
}(egret.DisplayObjectContainer));
__reflect(SignItem.prototype, "SignItem");
