/**
 * 场景事件
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SceneEvent = (function () {
    function SceneEvent() {
    }
    return SceneEvent;
}());
__reflect(SceneEvent.prototype, "SceneEvent");
