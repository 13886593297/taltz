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
var EquipmentScene = (function (_super) {
    __extends(EquipmentScene, _super);
    function EquipmentScene() {
        var _this = _super.call(this) || this;
        _this.configs = [
            { icon: '', bg: '', name: '搜索结果', type: 0 },
            { icon: '', bg: 'equip_bg_1_png', name: '最新内容', type: 15 },
            { icon: '', bg: 'equip_bg_2_png', name: '疾病档案', type: 16 },
            { icon: '', bg: 'equip_bg_3_png', name: '产品资料', type: 17 },
            { icon: '', bg: 'equip_bg_4_png', name: '竞品分析', type: 18 },
        ];
        Util.setTitle('装备库');
        return _this;
    }
    EquipmentScene.prototype.init = function () {
        _super.prototype.setBackground.call(this);
        this.initList();
    };
    EquipmentScene.prototype.initList = function () {
        var title = Util.createBitmapByName('equip_title_png');
        title.y = 20;
        this.addChild(title);
        var y = 325;
        var _loop_1 = function (config) {
            if (config.type == 0) {
                return "continue";
            }
            var bg = Util.createBitmapByName(config.bg);
            this_1.addChild(bg);
            if (config.type % 2 != 0) {
                bg.x = this_1.stage.stageWidth / 2 - bg.width;
            }
            else {
                bg.x = this_1.stage.stageWidth / 2;
            }
            if (config.type < 17) {
                bg.y = y;
            }
            else {
                bg.y = y + bg.height;
            }
            bg.touchEnabled = true;
            bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                Util.playMusic('model_select_mp3');
                var scene = new EquipList(config);
                ViewManager.getInstance().changeScene(scene);
            }, this_1);
        };
        var this_1 = this;
        for (var _i = 0, _a = this.configs; _i < _a.length; _i++) {
            var config = _a[_i];
            _loop_1(config);
        }
        var searchInput = new SearchInput('');
        searchInput.x = (this.stage.stageWidth - 515) / 2;
        searchInput.y = 230;
        this.addChild(searchInput);
    };
    return EquipmentScene;
}(Scene));
__reflect(EquipmentScene.prototype, "EquipmentScene");
