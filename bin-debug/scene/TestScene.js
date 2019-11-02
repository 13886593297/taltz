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
var TestScene = (function (_super) {
    __extends(TestScene, _super);
    function TestScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestScene.prototype.init = function () {
        var data = [{ name: "欣百达", rate: 0.5 }, { name: "临床研究", rate: 0.6 }, { name: "竞品", rate: 0.4 }, { name: "CLBP", rate: 0.8 }, { name: "OA", rate: 0.5 }, { name: "疼痛", rate: 0.7 }];
        // let radar = new Radar(data, 300, 300);
        // radar.x = 100;
        // radar.y = 500;
        // this.addChild(radar);
        var button = new eui.Button();
        button.label = "返回";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    };
    TestScene.prototype.onButtonClick = function () {
        console.log("点击按钮");
        ViewManager.getInstance().back();
    };
    return TestScene;
}(Scene));
__reflect(TestScene.prototype, "TestScene");
