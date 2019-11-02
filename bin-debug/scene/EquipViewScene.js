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
var EquipViewScene = (function (_super) {
    __extends(EquipViewScene, _super);
    function EquipViewScene() {
        return _super.call(this) || this;
    }
    EquipViewScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        Util.setTitle('装备库');
        Http.getInstance().post(Url.HTTP_EQUIP_DETAIL, { conid: this.contentId }, function (data) {
            // Util.onStopMusic();
            // showIFrame('<div style="margin-top:50px">' + s1+'</div>', "返回列表");
            var stage = ViewManager.getInstance().stage;
            var group = new eui.Group();
            group.y = 60;
            group.width = stage.width;
            _this.addChild(group);
            var title = new egret.TextField();
            title.text = data.data.title;
            title.textColor = 0xF46C22;
            title.size = 60;
            title.width = _this.stage.stageWidth;
            title.textAlign = egret.HorizontalAlign.CENTER;
            title.y = 100;
            group.addChild(title);
            var base = new Base64();
            var s1 = base.decode(data.data.contentTxt);
            Util.onStopMusic();
            var content = new egret.TextField();
            content.textFlow = (new egret.HtmlTextParser).parser(s1);
            content.textColor = 0x676E79;
            content.width = _this.stage.stageWidth;
            content.textAlign = egret.HorizontalAlign.CENTER;
            content.y = 180;
            group.addChild(content);
        });
    };
    return EquipViewScene;
}(Scene));
__reflect(EquipViewScene.prototype, "EquipViewScene");
