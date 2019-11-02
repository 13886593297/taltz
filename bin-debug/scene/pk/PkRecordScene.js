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
        _this.itemY = 10;
        _this.page = 1;
        _this.pageSize = 20;
        _this.end = false;
        return _this;
    }
    PkRecordScene.prototype.init = function () {
        // this.nav = "返回";
        var _this = this;
        SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS, function (data) {
            ViewManager.getInstance().hideLoading();
            _this.updateGroup(data.data || []);
        });
        SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: this.page, pageSize: this.pageSize });
        var title = new Title("挑战记录");
        title.y = 100;
        this.addChild(title);
        var group = new eui.Group();
        this.groupView = group;
        group.width = 720;
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = 800;
        myScroller.y = 220;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
        this.scrollView = myScroller;
        myScroller.addEventListener(eui.UIEvent.CHANGE_END, function () {
            if (myScroller.viewport.scrollV + 800 >= myScroller.viewport.contentHeight) {
                if (!_this.end) {
                    SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: _this.page, pageSize: _this.pageSize });
                }
            }
        }, this);
        var backButton = new XButton("返回PK模式目录");
        this.addChild(backButton);
        backButton.width = 350;
        backButton.anchorOffsetX = 175;
        backButton.x = this.stage.stageWidth / 2;
        backButton.y = this.stage.stageHeight - 200;
        backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.getInstance().back();
        }, this);
        ViewManager.getInstance().showLoading('数据加载中...');
    };
    PkRecordScene.prototype.updateGroup = function (list) {
        if (list.length < 20) {
            this.end = true;
        }
        if (list.length == 0 && this.page == 1) {
            var alert_1 = new egret.TextField();
            alert_1.size = 35;
            alert_1.height = 100;
            alert_1.verticalAlign = egret.VerticalAlign.MIDDLE;
            alert_1.textAlign = egret.HorizontalAlign.CENTER;
            alert_1.width = 600;
            alert_1.x = this.stage.stageWidth / 2 - 300;
            alert_1.text = "暂无挑战数据";
            this.groupView.addChild(alert_1);
        }
        this.page += 1;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            var item = new RecordItem(data);
            item.x = this.stage.stageWidth / 2;
            item.y = this.itemY;
            this.groupView.addChild(item);
            this.itemY += item.height;
        }
    };
    return PkRecordScene;
}(Scene));
__reflect(PkRecordScene.prototype, "PkRecordScene");
var RecordItem = (function (_super) {
    __extends(RecordItem, _super);
    function RecordItem(data) {
        var _this = _super.call(this) || this;
        _this.status = {
            "1": { text: "胜利", style: { "textColor": 0xf6da6b } },
            "2": { text: '失败', style: { "textColor": 0xd23d60 } },
            '3': { text: '进行中' },
            '4': { text: '平局' },
            '5': { text: '无效局' }
        };
        _this.data = data;
        _this.init();
        return _this;
    }
    RecordItem.prototype.init = function () {
        var _this = this;
        this.width = 720;
        this.anchorOffsetX = 360;
        var title = new egret.TextField();
        // title.text = this.data.title;
        var pkWayText = this.data.pkWay == 1 ? '匹配' : '邀请';
        title.textFlow = [
            { text: this.data.sendName },
            { text: " " + pkWayText + "\n", style: { "textColor": Config.COLOR_YELLOW } },
            { text: this.data.acceptName },
            { text: "  对战", style: { "textColor": Config.COLOR_YELLOW } }
        ];
        // title.textColor = Config.COLOR_YELLOW;
        // title.height = 100;
        title.lineSpacing = 20;
        title.x = 20;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.width = 520;
        this.height = 150;
        this.addChild(title);
        var selfid = DataManager.getInstance().getUser().userId;
        // let res = 1;
        // switch (this.data.status) {
        //     case 0:
        //         res = 5;
        //         break;
        //     case 1:
        //     case 2:
        //         res = 3;
        //         break;
        //     case 3:
        //         if (this.data.winUserId == 0) {
        //             res = 4;
        //         } else {
        //             if (selfid == this.data.sendUserId) { //我是发起者
        //                 if (this.data.winUserId == this.data.sendUserId) {
        //                     res = 1;
        //                 } else {
        //                     res = 2;
        //                 }
        //             } else {
        //                 if (this.data.winUserId == this.data.sendUserId) {
        //                     res = 2;
        //                 } else {
        //                     res = 1;
        //                 }
        //             }
        //         }
        //         break;
        // }
        var result = new egret.TextField();
        var text = this.data.pkResult; //this.status[res];
        result.size = 35;
        result.textFlow = [text];
        result.height = 100;
        result.verticalAlign = egret.VerticalAlign.MIDDLE;
        result.textAlign = egret.HorizontalAlign.CENTER;
        result.width = 150;
        result.x = 285;
        this.addChild(result);
        var date = new egret.TextField();
        date.text = this.data.createTime;
        date.width = 200;
        date.textAlign = egret.HorizontalAlign.RIGHT;
        date.height = 100;
        date.verticalAlign = egret.VerticalAlign.MIDDLE;
        date.x = title.width;
        this.addChild(date);
        var line = Util.createBitmapByName('dialog_line_png');
        line.width = this.width;
        line.y = title.textHeight + 10;
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
