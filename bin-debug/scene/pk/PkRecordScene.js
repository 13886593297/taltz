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
var PkRecordScene = (function (_super) {
    __extends(PkRecordScene, _super);
    function PkRecordScene() {
        var _this = _super.call(this) || this;
        _this.itemY = 0;
        _this.page = 1;
        _this.pageSize = 20;
        _this.end = false;
        return _this;
    }
    PkRecordScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        var title = Util.createBitmapByName('pk_record_title_png');
        title.x = (this.stage.stageWidth - title.width) / 2;
        title.y = 45;
        this.addChild(title);
        var backButtonBg = Util.drawRoundRect(6, 0x4fb483, 0xbbc540, 360, 70, 80);
        backButtonBg.x = (this.stage.stageWidth - backButtonBg.width) / 2;
        backButtonBg.y = this.stage.stageHeight - 200;
        backButtonBg.touchEnabled = true;
        backButtonBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.getInstance().back();
        }, this);
        this.addChild(backButtonBg);
        var backButtonText = new egret.TextField;
        backButtonText.text = '返回PK模式目录';
        backButtonText.width = backButtonBg.width;
        backButtonText.height = backButtonBg.height;
        backButtonText.x = backButtonBg.x;
        backButtonText.y = backButtonBg.y;
        backButtonText.textAlign = 'center';
        backButtonText.verticalAlign = 'middle';
        backButtonText.size = 40;
        this.addChild(backButtonText);
        SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS, function (data) {
            console.log(data.data);
            ViewManager.getInstance().hideLoading();
            if (data.data.length == 0 && _this.page == 1) {
                var tip = new LineInfo('暂无挑战数据');
                _this.addChild(tip);
                return;
            }
            _this.updateGroup(data.data || []);
        });
        SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: this.page, pageSize: this.pageSize });
        var border = Util.drawRoundRect(2, 0x4fb483, 0xFFFFFF, 650, this.stage.stageHeight - 300 + backButtonBg.height / 2, 80, 0);
        border.x = (this.stage.stageWidth - border.width) / 2;
        border.y = 100;
        this.addChildAt(border, 1);
        var group = new eui.Group();
        this.groupView = group;
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = this.stage.stageHeight - 450;
        myScroller.y = 200;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scrollView = myScroller;
        myScroller.addEventListener(eui.UIEvent.CHANGE_END, function () {
            if (myScroller.viewport.scrollV + myScroller.height >= myScroller.viewport.contentHeight) {
                if (!_this.end) {
                    SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: _this.page, pageSize: _this.pageSize });
                }
            }
        }, this);
        ViewManager.getInstance().showLoading('数据加载中...');
    };
    PkRecordScene.prototype.updateGroup = function (list) {
        if (list.length < 20) {
            this.end = true;
        }
        this.page += 1;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            var item = new RecordItem(data);
            item.x = 55;
            item.y = this.itemY;
            this.groupView.addChild(item);
            this.itemY += 80;
        }
    };
    return PkRecordScene;
}(Scene));
__reflect(PkRecordScene.prototype, "PkRecordScene");
var RecordItem = (function (_super) {
    __extends(RecordItem, _super);
    function RecordItem(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.width = 540;
        _this.height = 80;
        _this.init();
        return _this;
    }
    RecordItem.prototype.init = function () {
        var _this = this;
        var pkWayText = this.data.pkWay == 1 ? '匹配' : '邀请';
        var size = 24;
        var fightPerson = new egret.TextField;
        fightPerson.text = this.data.sendName + pkWayText + this.data.acceptName + '对战';
        fightPerson.width = 300;
        fightPerson.height = this.height;
        fightPerson.x = 40;
        fightPerson.verticalAlign = 'middle';
        fightPerson.size = size;
        fightPerson.textColor = 0x009649;
        this.addChild(fightPerson);
        var result = new egret.TextField();
        result.text = this.data.pkResult.text;
        result.width = 100;
        result.height = this.height;
        result.size = size;
        result.x = 360;
        result.verticalAlign = 'middle';
        result.textColor = 0x009649;
        if (this.data.pkResult.text == '失败') {
            result.textColor = 0x747a7c;
        }
        else {
            result.textColor = 0x006a3a;
        }
        this.addChild(result);
        var date = new egret.TextField();
        date.text = this.data.createTime;
        date.width = 150;
        date.height = this.height;
        date.size = size;
        date.x = 450;
        date.verticalAlign = 'middle';
        date.textColor = 0x009649;
        date.textAlign = egret.HorizontalAlign.RIGHT;
        this.addChild(date);
        var line = new egret.Shape;
        line.graphics.lineStyle(2, 0x4fb483);
        line.graphics.moveTo(40, this.height);
        line.graphics.lineTo(600, this.height);
        line.graphics.endFill();
        this.addChild(line);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SocketX.getInstance().addEventListener(NetEvent.PK_INFO, function (data) {
                var result = data.data;
                if (result.tipsCode == InviteStatus.WATTING) {
                    var pk = new PkInviteScene(InviteStatus.WATTING);
                    ViewManager.getInstance().changeScene(pk);
                }
                else {
                    // result.sendUserId = this.data.sendUserId
                    // result.accepUserId = this.data.accepUserId
                    result = DataManager.getInstance().convertPkResult(result);
                    var resultScene = new PkResultScene(result, PkResultBackModel.BACK);
                    ViewManager.getInstance().changeScene(resultScene);
                }
            });
            SocketX.getInstance().sendMsg(NetEvent.PK_INFO, { pkCode: _this.data.pkCode });
        }, this);
    };
    return RecordItem;
}(eui.Group));
__reflect(RecordItem.prototype, "RecordItem");
