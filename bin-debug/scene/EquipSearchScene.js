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
var EquipSearch = (function (_super) {
    __extends(EquipSearch, _super);
    function EquipSearch(keywords) {
        var _this = _super.call(this) || this;
        _this.isnSpecialReturn = true;
        _this.keywords = keywords;
        return _this;
    }
    EquipSearch.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        var title = Util.createBitmapByName('equip_title_png');
        title.y = 20;
        this.addChild(title);
        var searchInput = new SearchInput(this.keywords);
        searchInput.x = (this.stage.stageWidth - 515) / 2;
        searchInput.y = 230;
        this.addChild(searchInput);
        this.changeTypeList();
    };
    EquipSearch.prototype.changeTypeList = function () {
        var _this = this;
        Http.getInstance().post(Url.HTTP_EQUIP_SEARCH, { keywords: this.keywords }, function (data) {
            var group = new eui.Group();
            group.width = _this.stage.stageWidth;
            _this.addChild(group);
            var bg = Util.createBitmapByName('search_result_bg_png');
            bg.y = 320;
            bg.x = (_this.stage.stageWidth - bg.width) / 2;
            _this.addChild(bg);
            var title = new egret.TextField();
            title.text = '搜索结果列表';
            title.textColor = 0x7fc871;
            title.size = 32;
            title.x = 150;
            title.y = 365;
            _this.addChild(title);
            var y = 0;
            if (data.data != null) {
                var list = data.data;
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var item = list_1[_i];
                    var equipItem = new EquipItem(item);
                    equipItem.width = 490;
                    equipItem.height = 60;
                    equipItem.scaleX = .75;
                    equipItem.scaleY = .75;
                    equipItem.y = y;
                    y += equipItem.height + 30;
                    equipItem.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onSeeItemDetail(item), _this);
                    group.addChild(equipItem);
                }
            }
            else {
                var emptytips = new egret.TextField();
                emptytips.text = "暂无结果";
                emptytips.width = _this.stage.stageWidth;
                emptytips.textAlign = egret.HorizontalAlign.CENTER;
                emptytips.y = 550;
                emptytips.size = 40;
                emptytips.textColor = 0x7fc871;
                _this.addChild(emptytips);
            }
            var myScroller = new eui.Scroller();
            //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
            myScroller.width = 490;
            myScroller.height = 310;
            myScroller.y = 430;
            myScroller.x = 130;
            //设置viewport
            myScroller.viewport = group;
            _this.addChild(myScroller);
        });
    };
    EquipSearch.prototype.onSeeItemDetail = function (item) {
        var _this = this;
        return function (e) {
            if (item.url && item.url.toLowerCase().trim().endsWith('.pdf')) {
                window.location.href = item.url;
            }
            else {
                // let scene = new EquipViewScene()
                // scene.contentId = item.contentId
                // ViewManager.getInstance().changeScene(scene)
                Http.getInstance().post(Url.HTTP_EQUIP_DETAIL, { conid: item.contentId }, function (data) {
                    var base = new Base64();
                    var s1 = base.decode(data.data.contentTxt);
                    Util.onStopMusic();
                    showIFrame(_this.keywords, s1, item.publicTime);
                });
            }
        };
    };
    return EquipSearch;
}(Scene));
__reflect(EquipSearch.prototype, "EquipSearch");
