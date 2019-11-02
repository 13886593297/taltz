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
var TrainTitle = (function (_super) {
    __extends(TrainTitle, _super);
    function TrainTitle(title1, title2) {
        var _this = _super.call(this) || this;
        _this.t1 = title1;
        _this.t2 = title2;
        return _this;
    }
    TrainTitle.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    TrainTitle.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return TrainTitle;
}(eui.Component));
__reflect(TrainTitle.prototype, "TrainTitle", ["eui.UIComponent", "egret.DisplayObject"]);
