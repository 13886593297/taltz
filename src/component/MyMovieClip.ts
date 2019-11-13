/**
 * 创建帧动画
 */
class MyMovieClip extends egret.DisplayObjectContainer {
    private _mcData: any;
    private _mcTexture: egret.Texture;
    private _name: any

    constructor(name) {
        super();
        this._name = name
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.load(this.initMovieClip);
    }

    private initMovieClip(): void {
        /*** 本示例关键代码段开始 ***/
        var mcDataFactory = new egret.MovieClipDataFactory(this._mcData, this._mcTexture);
        var role: egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData(this._name));
        this.addChild(role);
        role.gotoAndPlay(1, 3);
        /*** 本示例关键代码段结束 ***/
    }

    protected load(callback: Function): void {
        var count: number = 0;
        var self = this;

        // 检查png和json是否都加载完成
        function check() {
            count++;
            if (count == 2) {
                callback.call(self);
            }
        }

        var loader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
            var loader = e.currentTarget;
            this._mcTexture = loader.data;
            check();
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        var request = new egret.URLRequest("resource/brand/taltz/" + this._name + ".png");
        loader.load(request);

        var loader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
            var loader = e.currentTarget;
            this._mcData = JSON.parse(loader.data);
            check();
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest("resource/brand/taltz/" + this._name + ".json");
        loader.load(request);
    }
}