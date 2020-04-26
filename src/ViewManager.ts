/**
 * 页面控制器
 */

class ViewManager {
    private static instance: ViewManager;

    public views: Array<Scene> = [];

    public shareView;

    /**
     * 正在加载页面
     */
    private isLoading = false;;


    public stage: egret.Stage;

    private constructor() { }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new ViewManager();
        }
        return this.instance;
    }

    /**
     * 获取当前的页面
     */
    public getCurrentScene(): Scene {
        let length = this.views.length;
        if (length === 0) return null;
        return this.views[length - 1];
    }

    //连续切换场景

    public changeScene(newScene: Scene) {
        if (!newScene) {
            //TODO 
            console.error("场景不能为空！");
            return;
        }
        if (this.isLoading) {
            return;
        }

        let oldScene = this.getCurrentScene();
        //加载动画,
        if (oldScene) {
            this.isLoading = true;
            // TODO 
            let tw = egret.Tween.get(oldScene);
            tw.to({ "alpha": 1 }, 10);
            tw.wait(10);
            tw.to({ "alpha": 0 }, 100);
            tw.call(() => {
                //加载完动画remove
                oldScene.parent.removeChild(oldScene);
                //添加场景
                this.stage.addChild(newScene);
                this.views.push(newScene);
                this.isLoading = false;
            }, this);
        } else {
            this.stage.addChild(newScene);
            this.views.push(newScene);
            this.isLoading = false;
        }
    }

    /**
     * 跳转首页
     */
    public jumpHome() {
        let oldScene = this.getCurrentScene();
        oldScene && oldScene.parent && oldScene.parent.removeChild(oldScene);
        let home = this.views[0];
        if (home.name == 'home') {
            home.updateScene();
            this.views = [home];
            this.stage.addChild(home);
            let tw = egret.Tween.get(home);
            tw.to({ "alpha": 1 }, 100);
        } else {
            this.views = [];
            home = new IndexScene();
            this.stage.addChild(home);
            this.views.push(home);
        }

    }


    public back(len = 1) {
        let length = this.views.length;
        if (length > len) { //进行页面切换

            let oldScene = this.views[length - 1];
            let newScene = this.views[length - len - 1];

            let tw = egret.Tween.get(oldScene);
            tw.to({ "alpha": 0 }, 100);
            tw.wait(50);
            // tw.to({ "alpha": 0 }, 100);
            tw.call(() => {
                //加载完动画remove
                oldScene && oldScene.parent && oldScene.parent.removeChild(oldScene);
                //添加场景
                this.stage.addChild(newScene);
                newScene.updateScene();
                let tw = egret.Tween.get(newScene);
                tw.to({ "alpha": 1 }, 100);
                for (let k = 0; k < len; k++) {
                    this.views.pop();
                }
            }, this);

        }
    }

    /**
     * 返回特定界面
     */
    public backByName(name) {
        let index: any = -1;
        for (let key in this.views) {
            let scene = this.views[key];
            if (scene.name == name) {
                index = key;
                break;
            }
        }
        let length = this.views.length;
        let oldScene = this.views[length - 1];
        oldScene && oldScene.parent && oldScene.parent.removeChild(oldScene);
        if (index > -1) { //找到界面
            let newScene = this.views[index];
            let tw = egret.Tween.get(newScene);
            tw.to({ "alpha": 1 }, 100);
            this.stage.addChild(newScene);
            newScene.updateScene();
            this.views = this.views.slice(0, index);
            this.views.push(newScene);
        } else { //没有找到
            this.views = [];
            let newScene;
            switch (name) {

                case 'pkmodel':
                    let type = 1;
                    let curModel = DataManager.getInstance().getPkModel();
                    if (curModel == PkModel.KNOW || curModel == PkModel.ANSWER) type = 2;
                    newScene = new PkModelScene(type);
                    break;

                default:
                    newScene = new PkListScene()
                    break;
            }


            this.stage.addChild(newScene);
            this.views.push(newScene);
        }
    }


    private loadingView;
    public showLoading(text) {
        if (this.loadingView) {
            this.loadingView.setText(text);
        } else {
            let loading = new AlertLoading(text);
            this.loadingView = loading;
            this.stage.addChild(loading);
        }

    }

    public hideLoading() {
        if (this.loadingView) {
            this.stage.removeChild(this.loadingView);
            this.loadingView = null;
        }
    }

}