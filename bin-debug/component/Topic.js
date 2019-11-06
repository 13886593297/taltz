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
 * 题目信息
 */
var Topic = (function (_super) {
    __extends(Topic, _super);
    function Topic(subject, width) {
        if (width === void 0) { width = 633; }
        var _this = _super.call(this) || this;
        _this.options = {};
        _this.canSelected = true;
        _this.subject = subject;
        _this.width = width;
        if (_this.subject.type == TopicType.BLANK) {
            _this.initBlank();
        }
        else {
            _this.init();
        }
        return _this;
    }
    Topic.prototype.init = function () {
        var _this = this;
        //题目标题
        var qtitle = new egret.TextField();
        qtitle.width = this.width;
        qtitle.textColor = 0x36b134;
        var titleText = this.subject.title;
        if (this.subject.type == TopicType.MULTIPLE) {
            titleText += "(多选题)";
        }
        this.title = qtitle;
        qtitle.text = titleText;
        qtitle.size = 36;
        qtitle.lineSpacing = 10;
        qtitle.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(qtitle);
        var y = qtitle.textHeight + 40;
        var optionNumArr = ['A', 'B', 'C', 'D'];
        this.subject.options.forEach(function (item, i) {
            if (item.name && item.name.length >= 1) {
                var topicItem = new TopicItem(optionNumArr[i], item, _this.width);
                topicItem.y = y;
                topicItem.x = 0;
                _this.addChild(topicItem);
                _this.options[item.flag] = topicItem;
                topicItem.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onSelect(item.flag), _this);
                y += topicItem.height + 20;
            }
        });
        this.height = y + 100;
    };
    Topic.prototype.onSelect = function (flag) {
        var _this = this;
        return function () {
            Util.playMusic('model_select_mp3');
            if (!_this.canSelected)
                return;
            //TODO 处理新的问题
            for (var k in _this.options) {
                var topicItem = _this.options[k];
                if (k == flag) {
                    if (_this.subject.type == TopicType.MULTIPLE) {
                        if (!_this.selected)
                            _this.selected = [];
                        var index = _this.selected.indexOf(flag);
                        if (index > -1) {
                            _this.selected.splice(index, 1);
                            topicItem.setStatus(TopicItem.STATUS_NORMAL);
                        }
                        else {
                            _this.selected.push(flag);
                            topicItem.setStatus(TopicItem.STATUS_SELECTED);
                        }
                    }
                    else {
                        _this.selected = flag;
                        topicItem.setStatus(TopicItem.STATUS_SELECTED);
                    }
                }
                else {
                    if (_this.subject.type == TopicType.MULTIPLE) {
                        continue;
                    }
                    topicItem.reset();
                }
            }
        };
    };
    //初始化填空题
    Topic.prototype.initBlank = function () {
        this.width = 600;
        //题目标题
        var qtitle = new egret.TextField();
        qtitle.width = 600;
        this.title = qtitle;
        // qtitle.text = this.subject.title
        qtitle.lineSpacing = 10;
        qtitle.y = 10;
        // qtitle.textAlign = egret.HorizontalAlign.LEFT
        this.addChild(qtitle);
        var titles = this.subject.title.split('__');
        var textFlow = [];
        this.textFlow = textFlow;
        var k = 0;
        for (var _i = 0, titles_1 = titles; _i < titles_1.length; _i++) {
            var item = titles_1[_i];
            textFlow.push({ text: item });
            if (k == 0)
                textFlow.push({ text: '         ', style: { underline: true, size: 30 } });
            k++;
        }
        qtitle.textFlow = textFlow;
        var input = new egret.TextField();
        this.addChild(input);
        input.text = '';
        input.width = 1;
        input.height = 1;
        input.y = 100;
        input.alpha = 0.01;
        /*** 本示例关键代码段开始 ***/
        input.type = egret.TextFieldType.INPUT;
        input.addEventListener(egret.FocusEvent.FOCUS_IN, function (e) {
            console.log('input set FOCUS');
        }, this);
        input.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e) {
        }, this);
        input.addEventListener(egret.Event.CHANGE, function (e) {
            this.selected = input.text;
            this.textFlow[1] = { text: '  ' + input.text + '  ', style: { "underline": true, size: 30 } };
            qtitle.textFlow = this.textFlow;
        }, this);
        qtitle.touchEnabled = true;
        qtitle.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            console.log('input set FOCUS_OUT');
            input.setFocus();
        }, this);
        var alertText = new egret.TextField();
        alertText.text = '点击横线处输入答案';
        alertText.textColor = 0x999999;
        alertText.width = this.width;
        alertText.y = 300;
        alertText.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(alertText);
    };
    /**
     * 获取答题选项
     */
    Topic.prototype.getSelect = function () {
        if (!this.selected)
            return null;
        if (this.subject.type == TopicType.MULTIPLE)
            return this.selected.join("");
        return this.selected;
    };
    /**
     * 设置题目状态
     */
    Topic.prototype.setSelectedStatus = function (status) {
        switch (this.subject.type) {
            case TopicType.SINGLE:
                this.options[this.selected].setStatus(status);
                break;
            case TopicType.MULTIPLE:
                var result = this.subject.result.split(',');
                for (var key in this.options) {
                    var option = this.options[key];
                    if (Util.inArray(key, this.selected)) {
                        if (Util.inArray(key, result)) {
                            option.setStatus(TopicItem.STATUS_OK);
                        }
                        else {
                            option.setStatus(TopicItem.STATUS_ERROR);
                        }
                    }
                    else {
                        if (Util.inArray(key, result)) {
                            option.setStatus(TopicItem.STATUS_CORRECT);
                        }
                    }
                }
                break;
            case TopicType.BLANK:
                switch (status) {
                    case TopicItem.STATUS_OK:
                        this.textFlow[1]['style'].textColor = Config.COLOR_YELLOW;
                        this.title.textFlow = this.textFlow;
                        break;
                    case TopicItem.STATUS_ERROR:
                        this.textFlow[1]['style'].textColor = 0xFF0000;
                        this.title.textFlow = this.textFlow;
                        break;
                }
                break;
        }
    };
    /**
     * 不能选择
     */
    Topic.prototype.setDisableSeleced = function () {
        this.canSelected = false;
    };
    /**
     * 判断题目的准确性
     */
    Topic.prototype.getSelectResult = function () {
        switch (this.subject.type) {
            case TopicType.SINGLE:
            case TopicType.BLANK:
                if (this.selected == this.subject.result) {
                    return true;
                }
                return false;
            case TopicType.MULTIPLE:
                var result = this.subject.result.split(',');
                if (result.sort().toString() == this.selected.sort().toString()) {
                    return true;
                }
                return false;
        }
    };
    Topic.prototype.getQAttrId = function () {
        return this.subject.qattrid;
    };
    /**
     * 设置正确选项
     */
    Topic.prototype.setCorrectItem = function () {
        this.options[this.subject.result].setStatus(TopicItem.STATUS_CORRECT);
    };
    return Topic;
}(eui.Group));
__reflect(Topic.prototype, "Topic");
var TopicType;
(function (TopicType) {
    TopicType[TopicType["SINGLE"] = 1] = "SINGLE";
    TopicType[TopicType["MULTIPLE"] = 2] = "MULTIPLE";
    TopicType[TopicType["BLANK"] = 3] = "BLANK";
})(TopicType || (TopicType = {}));
var TopicItem = (function (_super) {
    __extends(TopicItem, _super);
    function TopicItem(optionNum, option, width) {
        if (width === void 0) { width = 633; }
        var _this = _super.call(this) || this;
        _this.BG_RES = ['option_normal_png', 'option_select_png', 'option_error_png', 'option_ok_png', 'option_ok_png'];
        _this.ICON_RES = { 2: "icon_err_png", 3: "icon_ok_png" };
        _this.RECT = {
            width: 560,
            height: 90,
        };
        _this.width = width;
        _this.option = option;
        _this.optionNum = optionNum;
        _this.status = TopicItem.STATUS_NORMAL;
        _this.touchEnabled = true;
        var line = Math.ceil(_this.option.name.length / 11);
        _this.height = _this.RECT.height + (line - 1) * 30;
        _this.init();
        return _this;
    }
    TopicItem.prototype.init = function () {
        this.initBg();
        // 答案内容
        var text = new egret.TextField();
        text.text = this.option.name;
        text.width = 420;
        text.lineSpacing = 10;
        text.size = 36;
        text.x = 150;
        text.height = this.height;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.textColor = 0x79cd72;
        this.text = text;
        this.addChild(text);
        // 答案前缀
        var prefix = new egret.TextField();
        prefix.text = this.optionNum;
        prefix.width = 100;
        prefix.height = this.height;
        prefix.size = 50;
        prefix.textAlign = egret.HorizontalAlign.CENTER;
        prefix.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(prefix);
    };
    TopicItem.prototype.initBg = function () {
        var bg = Util.createBitmapByName(this.BG_RES[this.status]);
        bg.height = this.height;
        this.bg = bg;
        this.addChild(bg);
        var icon = new egret.Bitmap();
        if (this.status == TopicItem.STATUS_OK || this.status == TopicItem.STATUS_ERROR) {
            this.icon.texture = RES.getRes(this.ICON_RES[this.status]);
        }
        icon.x = 570;
        icon.y = this.height / 2;
        icon.anchorOffsetY = 24;
        this.icon = icon;
        this.addChild(icon);
    };
    TopicItem.prototype.onTap = function () {
        this.setStatus(TopicItem.STATUS_SELECTED);
    };
    /**
     * 重置状态
     */
    TopicItem.prototype.reset = function () {
        this.setStatus(TopicItem.STATUS_NORMAL);
    };
    /**
     * 设置状态  默认单选
     */
    TopicItem.prototype.setStatus = function (status) {
        if (this.status == status)
            return;
        this.status = status;
        this.bg.texture = RES.getRes(this.BG_RES[status]);
        if (status == TopicItem.STATUS_SELECTED || status == TopicItem.STATUS_OK) {
            this.text.textColor = 0xffffff;
        }
        else {
            this.text.textColor = 0x79cd72;
        }
        if (status == TopicItem.STATUS_OK || status == TopicItem.STATUS_ERROR) {
            this.icon.visible = true;
            this.icon.texture = RES.getRes(this.ICON_RES[status]);
        }
        else {
            this.icon.visible = false;
        }
    };
    TopicItem.prototype.release = function () {
        this.removeChildren();
    };
    TopicItem.STATUS_NORMAL = 0;
    TopicItem.STATUS_SELECTED = 1;
    TopicItem.STATUS_ERROR = 2;
    TopicItem.STATUS_OK = 3;
    TopicItem.STATUS_CORRECT = 4;
    return TopicItem;
}(egret.DisplayObjectContainer));
__reflect(TopicItem.prototype, "TopicItem");
/**
 * 填空题
 */
var Blanks = (function (_super) {
    __extends(Blanks, _super);
    function Blanks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Blanks;
}(eui.Group));
__reflect(Blanks.prototype, "Blanks");
