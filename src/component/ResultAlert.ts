class ResultAlert extends eui.Group {

    private type: UserPositionType;
    private error
    private order
    private score;
    /**
     * @param type UserPositionType左右
     * @param corret 是否错误
     * @param order 次序
     * @param score 分数
     */
    constructor(type: UserPositionType, corret, order, score) {
        super()
        this.type = type;
        this.error = corret;
        this.order = order;
        this.score = score;
        this.init();
    }

    public init() {
        this.width = 240;
        this.height = 120;
        let bgName = 'left_bg_png'
        let flagName = 'green_flag_png'

        let xs = [10, 80, 145]
        let flagIdx = 0;
        let scoreIdx = 2;
        if (this.type == UserPositionType.RIGHT) {
            bgName = 'right_bg_png';
            flagName = 'blue_flag_png'
            flagIdx = 2;
            scoreIdx = 0;
        }
        let bg = Util.createBitmapByName(bgName);
        bg.width = this.width;
        bg.height = this.height;
        bg.alpha = 0.5;
        this.addChild(bg);

        //标记 对错 分数
        let flag = Util.createBitmapByName(flagName);
        flag.x = xs[flagIdx];
        flag.y = 25;
        this.addChild(flag);

        let order = new egret.TextField();
        order.text = this.order;
        order.size = 24;
        order.height = 54;
        order.verticalAlign = egret.VerticalAlign.MIDDLE;
        order.textAlign = egret.HorizontalAlign.CENTER;
        order.width = 70;
        order.x = flag.x;
        order.y = flag.y
        this.addChild(order);


        // correct
        let errorName = 'answer_error_png'
        if (this.error) errorName = 'answer_ok_png';

        let error = Util.createBitmapByName(errorName);
        error.x = xs[1];
        error.y = 35;
        this.addChild(error);


        let score = new egret.TextField();
        score.text = this.score;
        score.size = 35;
        score.height = this.height;
        score.verticalAlign = egret.VerticalAlign.MIDDLE;
        // score.textAlign = egret.HorizontalAlign.CENTER;
        score.width = 70;
        score.x = xs[scoreIdx];
        if (scoreIdx == 0)
            score.x = xs[scoreIdx] + 20;
        this.addChild(score);

    }



}

/**
 * 双方不得分
 */
class NoScoreAlert extends eui.Group {
    private text;
    constructor(text) {
        super();
        this.text = text;
        this.init();
    }

    private init() {
        this.width = 345;
        this.height = 139;
        this.x = (ViewManager.getInstance().stage.stageWidth - this.width) /2
        this.y = ViewManager.getInstance().stage.stageHeight/2 + 200
        let bg = Util.createBitmapByName('alert_team_error_png');
        bg.width = this.width;
        bg.height= this.height;
        this.addChild(bg);

        let textField = new egret.TextField();
        textField.width = this.width - 40;
        textField.height = this.height -20;
        textField.x = 20;
        textField.y = 10
        textField.textAlign=  egret.HorizontalAlign.CENTER;
        textField.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(textField);
        textField.text = this.text;

    }
}



class MvpAlert extends eui.Group {

    private type;
    constructor(type = TeamType.GREEN) {
        super();
        this.type = type
        this.init();
    }


    init() {
        this.width = 120;
        this.height = 125;
        let bgName = 'green_mvp_bg_png';
        let left = 0;
        if (this.type == TeamType.BLUE) {
            bgName = 'blue_mvp_bg_png';
            left = 13;
        }
        let bg = Util.createBitmapByName(bgName);
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        let mvp = Util.createBitmapByName('result_mvp_png');
        mvp.x = left;
        mvp.y = 10;
        mvp.width = 98;
        mvp.height = 98;
        this.addChild(mvp);


    }

}   