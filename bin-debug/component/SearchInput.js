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
var SearchInput = (function (_super) {
    __extends(SearchInput, _super);
    function SearchInput(keywords) {
        var _this = _super.call(this) || this;
        _this.keywords = keywords;
        return _this;
    }
    SearchInput.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    SearchInput.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.btnSearch.touchEnabled = true;
        this.btnSearch.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var keywords = _this.txtInput.text;
            if (keywords == '') {
                var alert_1 = new AlertPanel("请输入查询关键字", 1200);
                alert_1.x = 0 - _this.x;
                alert_1.y = 0 - _this.y;
                _super.prototype.addChildAt.call(_this, alert_1, 100);
            }
            else {
                var scene = new EquipSearch(keywords);
                ViewManager.getInstance().changeScene(scene);
            }
        }, this);
    };
    return SearchInput;
}(eui.Component));
__reflect(SearchInput.prototype, "SearchInput", ["eui.UIComponent", "egret.DisplayObject"]);
