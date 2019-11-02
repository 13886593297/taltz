



class PkUser extends eui.Group {
    private userinfo;
    private type;
    private score;
    private color;
    private scoreText;

    constructor(userinfo, type = "left", score = null) {
        super();
        this.userinfo = userinfo;
        this.type = type;
        this.score = score;
        this.init();
    }



    public init() {
        let bgname = 'pk_user_bg_left_png';
        let color = 0xabbf11;
        if (this.type == 'right') {
            bgname = 'pk_user_bg_right_png';
            color = 0x1670c1;
        }
        this.color = color;
        let bg = Util.createBitmapByName(bgname)
        let width = 240;
        let height = 283;
        if (this.score) {
            height = 340;
        }
        this.height = height;
        this.width = width;
        bg.width = width;
        bg.height = height;

        this.addChild(bg);

        let border: egret.Bitmap = Util.createBitmapByName('icon_border_png');
        border.width = 164;
        border.height = 164;
        border.x = 38;
        border.y = 30;
        this.addChild(border);

        let iconPath = this.userinfo ? 'icon_2_jpg' : 'user_unknow_jpg'
        let icon: egret.Bitmap = Util.createBitmapByName(iconPath);
        icon.width = 150;
        icon.height = 140;
        icon.x = border.x + 7
        icon.y = border.y + 12
        this.addChild(icon);

        if (this.userinfo) {
            // Util.setUserImg(this.userinfo.avatar, icon);
        }



        let shape = new egret.Shape();
        this.addChild(shape);
        let graphics = shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.moveTo(icon.x, icon.y + 15);/// 设定显示区域
        graphics.lineTo(icon.x, icon.y + icon.height);/// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y + icon.height);/// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y);/// 设定显示区域
        graphics.lineTo(icon.x + 15, icon.y);/// 设定显示区域
        graphics.lineTo(icon.x, icon.y + 15);/// 设定显示区域
        graphics.endFill();
        icon.mask = shape;

        //人名


        let name = new egret.TextField();
        name.text = this.userinfo ? this.userinfo.nickName : '???';
        name.width = 200;
        name.wordWrap = false;
        name.multiline = false;
        name.x = 20;
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.y = icon.y + 180;
        name.size = 28;
        this.addChild(name);

        if (this.score) {

            let line = Util.createBitmapByName('user_line_png');
            line.width = bg.width;
            line.y = name.y + 60;
            this.addChild(line);

            let shape: egret.Shape = new egret.Shape();
            shape.graphics.beginFill(color);
            shape.graphics.moveTo(0, line.y - 10);
            shape.graphics.lineTo(0, line.y + 10);
            shape.graphics.lineTo(80, line.y + 10);
            shape.graphics.lineTo(80, line.y - 10);
            shape.graphics.lineTo(0, line.y - 10);

            shape.graphics.moveTo(160, line.y - 10);
            shape.graphics.lineTo(160, line.y + 10);
            shape.graphics.lineTo(240, line.y + 10);
            shape.graphics.lineTo(240, line.y - 10);
            shape.graphics.lineTo(160, line.y - 10);

            shape.graphics.endFill();
            this.addChild(shape);
            line.mask = shape;
            // shape.blendMode = egret.BlendMode.ERASE;


            let score = new egret.TextField();
            score.text = this.score;
            score.textColor = 0x000000;
            score.width = bg.width;
            score.height = 50;
            score.anchorOffsetY = 25;
            score.y = line.y;
            score.textAlign = egret.HorizontalAlign.CENTER;
            score.verticalAlign = egret.VerticalAlign.MIDDLE;
            score.size = 30;
            this.addChild(score);
            this.scoreText = score;
        }

    }


    public addPkTime(time) {


        let letfTime = new egret.TextField();
        letfTime.text = time;
        letfTime.textColor = this.color;
        letfTime.width = this.width;
        letfTime.size = 40;
        letfTime.bold = true;
        letfTime.textAlign = egret.HorizontalAlign.CENTER;
        letfTime.y = this.height + 10;
        this.addChild(letfTime);
    }

    public setScore(score) {
        this.scoreText.text = score;
    }

}


class TeamUser extends eui.Group {
    private userinfo;
    private type: UserPositionType;
    private score;
    private color;

    private rect;
    private icon;
    private nameText;
    private readyImg;
    private status;

    private clickTime;
    private canClick = true;

    private resultImg;


    constructor(userinfo, type = UserPositionType.LEFT, rect = { width: 250, height: 185 }) {
        super();
        this.userinfo = userinfo || {};
        this.type = type;
        this.rect = rect;
        this.init();
    }


    public init() {
        let bgname = 'pk_user_bg_left_png';
        let color = 0xabbf11;
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_user_bg_right_png';
            color = 0x1670c1;
        }
        this.color = color;
        let bg = Util.createBitmapByName(bgname)
        let width = this.rect.width;
        let height = this.rect.height;
        this.height = height;
        this.width = width;
        bg.width = width;
        bg.height = height;

        this.addChild(bg);

        let border: egret.Bitmap = Util.createBitmapByName('icon_border_png');
        border.width = 115;
        border.height = 115;
        border.x = (this.width - border.width) / 2;
        border.y = 10;
        this.addChild(border);


        let iconPath = 'icon_1_jpg';
        if (this.userinfo.nickName) iconPath = 'icon_2_jpg';

        let icon: egret.Bitmap = Util.createBitmapByName(iconPath);
        icon.width = 100;
        icon.height = 100;
        icon.x = border.x + 7
        icon.y = border.y + 7
        this.addChild(icon);
        // Util.setUserImg(this.userinfo.avatar, icon);
        this.icon = icon;
        icon.touchEnabled = true;

        let shape = new egret.Shape();
        this.addChild(shape);
        let graphics = shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.moveTo(icon.x, icon.y + 10);/// 设定显示区域
        graphics.lineTo(icon.x, icon.y + icon.height);/// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y + icon.height);/// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y);/// 设定显示区域
        graphics.lineTo(icon.x + 10, icon.y);/// 设定显示区域
        graphics.lineTo(icon.x, icon.y + 10);/// 设定显示区域
        graphics.endFill();
        icon.mask = shape;

        //人名
        let name = new egret.TextField();
        name.text = this.userinfo.nickName;
        name.width = 200;
        name.wordWrap = false;
        name.multiline = false;
        name.x = (this.width - name.width) / 2;
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.y = icon.y + border.height;
        name.size = 26;
        this.addChild(name);
        this.nameText = name;



        let readyImg = Util.createBitmapByName('ready_png')
        readyImg.width = 35;
        readyImg.height = 35;
        if (this.type == UserPositionType.LEFT) {
            readyImg.x = 210;
        } else {
            readyImg.x = 20;
        }
        readyImg.y = 77;
        this.readyImg = readyImg;
        this.addChild(readyImg);
        this.readyImg.visible = false;
    }

    public addUserEventListener(callback, obj) {

        this.icon.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!this.canClick) return;
            let current = new Date().getTime();
            if (this.clickTime && current - this.clickTime < 1000) return;
            this.clickTime = current;
            // this.canClick = false;
            callback.bind(obj)(this.userinfo);
        }, this)
    }

    public resetClick() {
        this.canClick = true;
        this.clickTime = 0
    }


    public setDisableClick() {
        this.canClick = false;
    }



    /**
     * 更新用户信息
     */
    public updateUser(userinfo) {
        this.userinfo = userinfo;
         //清空头像
        let texture: egret.Texture = RES.getRes('icon_1_jpg');
        this.icon.texture = texture;
        if (userinfo == null) {
           
            this.nameText.text = '';
            this.readyImg.visible = false;
            this.resetClick()
        } else {
            this.nameText.text = userinfo.nickName;
            // Util.setUserImg(userinfo.avatar, this.icon);
        }
    }

    /**
     * 准备好
     */
    public setReady() {
       this.readyImg.visible = true;;
    }


    /**
     * 设置用户结果状态
     */
    public setWinnerStatus(status) {
        if (this.status == status) return;
        this.status = status;
        if (this.resultImg) {
            this.resultImg.parent.removeChild(this.resultImg);
            this.resultImg = null;
        }
        let statusImgs = {
            1: "result_win_png", 2: "result_draw_png", 3: "result_mvp_png"
        }
        let imgName = statusImgs[status];
        if (imgName) {

            let resultImg = Util.createBitmapByName(imgName);
            resultImg.width = 100;
            resultImg.height = 100;
            resultImg.anchorOffsetX = 100;
            resultImg.x = this.width;
            this.addChild(resultImg)
            this.resultImg = resultImg;
        }
        if (status === WinnerStatus.LOSE) {
            let grayFilter = Util.grayFliter();
            this.filters = [grayFilter];
        }
    }



}


class LiteTeamUser extends eui.Group {
    private userinfo;
    private type: UserPositionType;
    private color;

    constructor(userinfo, type = UserPositionType.LEFT) {
        super();
        this.userinfo = userinfo;
        this.type = type;
        this.init();
    }


    public init() {
        let bgname = 'pk_user_bg_left_png';
        let color = 0xabbf11;
        if (this.type === UserPositionType.RIGHT) {
            bgname = 'pk_user_bg_right_png';
            color = 0x1670c1;
        }
        this.color = color;
        let bg = Util.createBitmapByName(bgname)
        let width = 105;
        let height = 133;
        this.height = height;
        this.width = width;
        bg.width = width;
        bg.height = height;

        this.addChild(bg);

        let border: egret.Bitmap = Util.createBitmapByName('icon_border_png');
        border.width = 85;
        border.height = 85;
        border.x = 10;
        border.y = 10;
        this.addChild(border);


        let icon: egret.Bitmap = Util.createBitmapByName('icon_2_jpg');
        icon.width = 75;
        icon.height = 75;
        icon.x = border.x + 5
        icon.y = border.y + 5
        this.addChild(icon);
        if (this.userinfo && this.userinfo.avatar){
            // Util.setUserImg(this.userinfo.avatar, icon);
        }

        let shape = new egret.Shape();
        this.addChild(shape);
        let graphics = shape.graphics;
        graphics.beginFill(0xff0000);
        graphics.moveTo(icon.x, icon.y + 5);/// 设定显示区域
        graphics.lineTo(icon.x, icon.y + icon.height);/// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y + icon.height);/// 设定显示区域
        graphics.lineTo(icon.x + icon.width, icon.y);/// 设定显示区域
        graphics.lineTo(icon.x + 5, icon.y);/// 设定显示区域
        graphics.lineTo(icon.x, icon.y + 5);/// 设定显示区域
        graphics.endFill();
        icon.mask = shape;

        //人名
        let name = new egret.TextField();

        name.width = 105;
        name.wordWrap = false;
        name.multiline = false;
        name.textAlign = egret.HorizontalAlign.CENTER;
        name.y = icon.y + 80;
        name.size = 22;
        if (this.userinfo && this.userinfo.nickName) name.text = this.userinfo.nickName;
        this.addChild(name);

    }





}