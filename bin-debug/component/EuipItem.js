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
var EquipItem = (function (_super) {
    __extends(EquipItem, _super);
    function EquipItem(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.init();
        return _this;
    }
    EquipItem.prototype.init = function () {
        var listBg;
        if (this.data.url.endsWith('pdf')) {
            listBg = Util.createBitmapByName('equip_bg_pdf_png');
        }
        else {
            listBg = Util.createBitmapByName('equip_bg_mp4_png');
        }
        this.width = listBg.width;
        this.height = listBg.height;
        this.addChild(listBg);
        var title = new egret.TextField();
        if (this.data.title.length >= 11) {
            title.text = this.data.title.substr(0, 9) + '...';
        }
        else {
            title.text = this.data.title;
        }
        title.size = 30;
        title.width = 300;
        title.textColor = 0xffffff;
        title.x = 90;
        title.y = 22;
        this.addChild(title);
        var time = new egret.TextField();
        time.text = this.data.publicTime;
        if (this.data.publicTime.length > 11) {
            var y = this.data.publicTime.split('T')[0].split('-')[0];
            var m = this.data.publicTime.split('T')[0].split('-')[1];
            var d = this.data.publicTime.split('T')[0].split('-')[2];
            time.text = y + '年' + m + '月' + d + '日';
        }
        time.textColor = 0xffffff;
        time.x = 500;
        time.y = 75;
        time.size = 16;
        this.addChild(time);
    };
    return EquipItem;
}(eui.Group));
__reflect(EquipItem.prototype, "EquipItem");
