var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Subject = (function () {
    function Subject() {
    }
    return Subject;
}());
__reflect(Subject.prototype, "Subject");
/**
 * 题目选项
 */
var TOptions = (function () {
    function TOptions() {
    }
    return TOptions;
}());
__reflect(TOptions.prototype, "TOptions");
