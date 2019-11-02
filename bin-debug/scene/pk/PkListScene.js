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
var PkListScene = (function (_super) {
    __extends(PkListScene, _super);
    function PkListScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = [{
                icon: 'person_pk_png', title: '个人挑战赛', iconWidth: 69, type: 1
            }, {
                icon: 'team_pk_png', title: '团队PK赛', iconWidth: 83, type: 2
            }];
        return _this;
    }
    PkListScene.prototype.onBack = function () {
        ViewManager.getInstance().jumpHome();
    };
    PkListScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        this.name = "pklist";
        var y = 300;
        var _loop_1 = function (data) {
            var item = new PkItem(data);
            this_1.addChild(item);
            item.y = y;
            y += 300;
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                Util.playMusic('model_select_mp3');
                //  if(data.type == 2){
                //     let alert = new AlertPanel("功能还未开放哦！")
                //     this.addChild(alert);
                //     return;
                //  }
                var modelScene = new PkModelScene(data.type);
                ViewManager.getInstance().changeScene(modelScene);
            }, this_1);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.config; _i < _a.length; _i++) {
            var data = _a[_i];
            _loop_1(data);
        }
    };
    return PkListScene;
}(Scene));
__reflect(PkListScene.prototype, "PkListScene");
