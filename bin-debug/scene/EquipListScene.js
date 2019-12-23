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
var EquipList = (function (_super) {
    __extends(EquipList, _super);
    function EquipList(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        return _this;
    }
    EquipList.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        var bd = Util.createBitmapByName('equip_bg_' + this.config.type + '_01_png');
        bd.y = 20;
        this.addChild(bd);
        this.changeTypeList(this.config);
    };
    EquipList.prototype.changeTypeList = function (config) {
        var _this = this;
        Http.getInstance().post(Url.HTTP_EQUIP_LIST, { catid: config.type }, function (data) {
            var group = new eui.Group();
            group.width = _this.stage.stageWidth;
            _this.addChild(group);
            var y = 0;
            if (data.data != null) {
                var list = data.data;
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var item = list_1[_i];
                    var equipItem = new EquipItem(item);
                    equipItem.x = (_this.stage.stageWidth - equipItem.width) / 2;
                    equipItem.y = y;
                    y += 130;
                    equipItem.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onSeeItemDetail(item), _this);
                    group.addChild(equipItem);
                }
            }
            else {
                var emptytips = new egret.TextField();
                emptytips.text = "暂无结果";
                emptytips.width = _this.stage.stageWidth;
                emptytips.textAlign = egret.HorizontalAlign.CENTER;
                emptytips.y = 600;
                emptytips.size = 40;
                emptytips.textColor = 0x7fc871;
                _this.addChild(emptytips);
            }
            group.height = y + 400;
            var myScroller = new eui.Scroller();
            //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
            myScroller.height = 1000;
            myScroller.y = 200;
            //设置viewport
            myScroller.viewport = group;
            _this.addChild(myScroller);
        });
    };
    EquipList.prototype.onSeeItemDetail = function (item) {
        var _this = this;
        return function () {
            if (item.url && item.url.toLowerCase().trim().endsWith('.pdf')) {
                window.location.href = item.url;
            }
            else {
                Http.getInstance().post(Url.HTTP_EQUIP_DETAIL, { conid: item.contentId }, function (data) {
                    var base = new Base64();
                    var s1 = base.decode(data.data.contentTxt);
                    Util.onStopMusic();
                    showIFrame(_this.config.bg.slice(0, -4), s1, item.publicTime);
                });
            }
        };
    };
    return EquipList;
}(Scene));
__reflect(EquipList.prototype, "EquipList");
