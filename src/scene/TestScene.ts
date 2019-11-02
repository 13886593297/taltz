
class TestScene extends Scene{



    public init(){
        let data = [{ name: "欣百达", rate: 0.5 }, { name: "临床研究", rate: 0.6 }, { name: "竞品", rate: 0.4 }, { name: "CLBP", rate: 0.8 }, { name: "OA", rate: 0.5 }, { name: "疼痛", rate: 0.7 }];
        // let radar = new Radar(data, 300, 300);
        // radar.x = 100;
        // radar.y = 500;
        // this.addChild(radar);


        let button = new eui.Button();
        button.label = "返回";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
      
    }

    private onButtonClick(){
        console.log("点击按钮");
        ViewManager.getInstance().back(); 
    }
}