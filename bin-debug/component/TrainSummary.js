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
var TrainSummary = (function (_super) {
    __extends(TrainSummary, _super);
    function TrainSummary(t1, t2) {
        var _this = _super.call(this) || this;
        _this.t1 = t1;
        _this.t2 = t2;
        return _this;
    }
    TrainSummary.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    TrainSummary.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return TrainSummary;
}(eui.Component));
__reflect(TrainSummary.prototype, "TrainSummary", ["eui.UIComponent", "egret.DisplayObject"]);
