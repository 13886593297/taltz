class Util {

    /**
     * 日志处理
     */
    public static log(...agurements) {
        console.log(agurements);
    }

    /**
        * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
        * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
        */
    public static createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 根据地址返回头像
     * @param avatar 头像地址
     * @param w 宽度
     * @param x x坐标
     * @param y y坐标
     * @param scene this
     */
    public static setUserImg(avatar: string, w, x, y, scene): any {
        if (!avatar) return
        let icon: egret.Bitmap = new egret.Bitmap()
        icon.width = w
        icon.height = w
        icon.x = x
        icon.y = y

        // 遮罩
        var circle: egret.Shape = new egret.Shape()
        circle.x = x
        circle.y = y
        circle.graphics.beginFill(0x0000ff)
        circle.graphics.drawCircle(w / 2, w / 2, w / 2)
        circle.graphics.endFill()
        icon.mask = circle
        scene.addChild(circle)

        let imgLoader = new egret.ImageLoader();
        imgLoader.crossOrigin = "anonymous";// 跨域请求
        imgLoader.load(avatar);// 去除链接中的转义字符‘\’        
        imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event) => {
            if (evt.currentTarget.data) {
                let texture = new egret.Texture();
                texture._setBitmapData(evt.currentTarget.data);
                icon.texture = texture;
                scene.addChild(icon)
            }
        }, this);
    }

    /**
     * 获取配置资源
     */
    public static getConfig(name: string) {
        let config = RES.getRes('config_json');
        return config[name];
    }
    /**
     * 是否在数组中
     */
    public static inArray(search, array) {
        for (var i in array) {
            if (array[i] == search) {
                return true;
            }
        }
        return false;
    }

    public static formatDate(time) {
        var date = new Date(time);

        var year = date.getFullYear(),
            month = date.getMonth() + 1,//月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var newTime = year + '-' +
            month + '-' +
            day + ' ' +
            hour + ':' +
            min + ':' +
            sec;
        return newTime;
    }



    public static converTimer(seconds) {

        let minute = Math.floor(seconds / 60);
        let second = seconds % 60;

        let convert = '';
        if (minute < 10) {
            convert += '0' + minute;
        } else {
            convert += minute;
        }
        convert += ":";
        if (second < 10) {
            convert += '0' + second;
        } else {
            convert += second;
        }
        return convert;
    }


    /**
     * 获取题目
     */
    public static getTrain(key) {
        let config = RES.getRes('tiku_json');
        let train = config[key];
        if (train) {
            let subject = new Subject();
            subject.id = train.id;
            subject.title = train.title;
            subject.content = train.content;
            subject.options = train.options;
            subject.result = train.result;
            subject.qattrid = train.qattrid;
            subject.type = train.type;
            return subject;
        }
        showAlertButton("该题已被管理员删除,请联系后台管理员！", "返回游戏首页", function () {
            SocketX.getInstance().close();
            ViewManager.getInstance().jumpHome();
        });

        return null;
    }


    public static getURLVar(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        return r != null ? decodeURI(r[2]) : null
    }


    /**
     * 缓存数据本地缓存
     */
    public static setCache(key: string, value: any) {
        //TODO 
        window.localStorage.setItem(key, value)
    }
    /**
     * 获取本地缓存数据
     */
    public static getCache(key: string) {
        //TODO
        return window.localStorage.getItem(key)
    }


    public static getLightFliter(color = 0x0000FF): egret.GlowFilter {
        var alpha: number = 0.5;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX: number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY: number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength: number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner: boolean = false;            /// 指定发光是否为内侧发光，暂未实现
        var knockout: boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY,
            strength, quality, inner, knockout);
        return glowFilter;
    }

    public static grayFliter() {
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var flilter = new egret.ColorMatrixFilter(colorMatrix);
        return flilter;
    }


    public static setImageColor(image: egret.Bitmap, color: number) {
        // 将16进制颜色分割成rgb值
        let spliceColor = (color) => {
            let result = { r: -1, g: -1, b: -1 };
            result.b = color % 256;
            result.g = Math.floor((color / 256)) % 256;
            result.r = Math.floor((color / 256) / 256);
            return result;
        }
        let result = spliceColor(color);
        let colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        colorMatrix[0] = result.r / 255;
        colorMatrix[6] = result.g / 255;
        colorMatrix[12] = result.b / 255;
        let colorFilter = new egret.ColorMatrixFilter(colorMatrix);

        image.filters = [colorFilter];
    }


    public static setTitle(title) {
        document.title = title
    }

    public static getWaterShader() {
        let fragmentSrc3 = [
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;",
            "varying vec4 vColor;\n",
            "uniform sampler2D uSampler;",

            "uniform vec2 center;",
            "uniform vec3 params;", // 10.0, 0.8, 0.1"
            "uniform float time;",

            "void main()",
            "{",
            "vec2 uv = vTextureCoord.xy;",
            "vec2 texCoord = uv;",

            "float dist = distance(uv, center);",

            "if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )",
            "{",
            "float diff = (dist - time);",
            "float powDiff = 1.0 - pow(abs(diff*params.x), params.y);",

            "float diffTime = diff  * powDiff;",
            "vec2 diffUV = normalize(uv - center);",
            "texCoord = uv + (diffUV * diffTime);",
            "}",

            "gl_FragColor = texture2D(uSampler, texCoord);",
            "}"
        ].join("\n");

        let vertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +

            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
            "}";
        let customFilter3 = new egret.CustomFilter(
            vertexSrc,
            fragmentSrc3,
            {
                center: { x: 0.5, y: 0.5 },
                params: { x: 10, y: 0.8, z: 0.1 },
                time: 0
            }
        );
        return customFilter3;
    }

    private static bgSoundChannel;
    private static bgSoundPlaying = false;
    private static isShowIframe = false;

    /**
     * 播放声音
     */
    public static playMusic(name, iscycle = false) {
        let sound = RES.getRes(name)
        if (sound) {
            if (iscycle) {
                this.bgSoundPlaying = true;
                this.bgSoundChannel = sound.play()
            }
            else sound.play(0, 1);
        }
    }

    public static onStopMusic() {
        this.bgSoundPlaying = false;
        this.bgSoundChannel.stop();
        this.isShowIframe = true;
    }

    public static onHideIframe() {
        this.isShowIframe = false;
        if (!this.bgSoundPlaying) {
            this.playMusic('bg_mp3', true);
        }
    }
    /**
     * 切换横屏
     */
    public static changeLandscape() {
        if (!this.isShowIframe) {
            showAlert('请竖屏模式查看！');

        }
    }

    /**
     * 生成随机字符串
     */
    public static randomString(len) {
        len = len || 32;
        var $chars = 'abcdefhijklmnoprstuvwxyz0123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    /**
     * 获取页面 host地址
     */
    public static getHost() {
        var ishttps = 'https:' == document.location.protocol ? true : false;
        var url = window.location.host;
        if (ishttps) {
            url = 'https://' + url;
        } else {
            url = 'http://' + url;
        }
        return url;
    }

    /**
     * http请求参数序列化
     */
    public static urlEncode(param, key) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + param;
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k);
            }
        }
        return paramStr;
    }

    /**
     * 字符串替换
     */
    public static formatString(str, replace) {
        if (!replace) return str;
        let type = typeof (replace);
        switch (type) {
            case 'object':
                for (var key in replace) {
                    str = str.replace(new RegExp("\\{" + key + "\\}", "g"), replace[key]);
                }
                break;
            // case 'Array':
            //     for (var i = 0; i < replace.length; i++) {
            //         str = str.replace(new RegExp("\\{" + i + "\\}", "g"), replace[i]);
            //     }
            //     break;
        }
        return str;
    }

    /**
       * 注册分享
       */
    public static registerShare(shareGroup, type, name = '', value = '', fn = null) {

        let shareMsg = Util.getConfig('share')[type];
        if (!shareMsg) return;

        let title = shareMsg.title;//"止痛欣战队题海点兵,该你上场了!";
        let desc = shareMsg.desc;//"答题王者，快来挑战积分排位赛！";

        let code = Util.randomString(32);
        let url = Util.getHost();
        let imgurl = url + "/static/default/default_avatar.jpg";
        let link = url;

        switch (type) {
            case ShareType.PK_INVITE_FRIEND: //个人挑战赛
                desc = this.formatString(desc, [name]);
                link = url + "/game/rooms/personalsports/joinpk?pkcode=" + code;
                break;
            case ShareType.NORMAL://默认分享
                break;
            default:
                link = url + "/game/index/share?code=" + code;
                desc = this.formatString(desc, [name, value]);
                break;
        }

        let callback = () => {

            if (fn && typeof fn == 'function') { //分享成功回调
                fn(code);
            }
            try {
                if (type == ShareType.NORMAL || type == ShareType.PK_INVITE_FRIEND) return;
                //截图
                let renderTexture: egret.RenderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(shareGroup);
                let imgData = renderTexture.toDataURL("image/png");
                imgData = encodeURIComponent(imgData);
                Http.getInstance().post(Url.HTTP_SHARE_UPLOAD, { code: code, type: type, imgdata: imgData }, () => {
                })
            } catch (error) {
                console.log('错误提示', error)
            }

        }
        onMenuShareAppMessage(title, desc, link, imgurl, callback);
        onMenuShareTimeline(title, link, imgurl, callback);
    }



    /**
     * 保存图片
     */
    public static saveImg(shareGroup) {
        let renderTexture2 = new egret.RenderTexture()
        let width = ViewManager.getInstance().stage.stageWidth;
        let height = ViewManager.getInstance().stage.stageHeight;
        let group = new eui.Group();
        group.width = 750;
        group.anchorOffsetX = 375;
        group.x = width / 2
        group.y = height - 200;
        shareGroup.addChild(group);

        let mask = Util.createBitmapByName('share_mask_png');
        mask.height = 90;
        mask.anchorOffsetY = 45;
        mask.y = 100;
        mask.width = width;
        group.addChild(mask);

        let text = new egret.TextField();
        text.text = "长按识别二维码加入答题游戏"
        text.height = 90;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.x = 300;
        text.y = 100;
        text.anchorOffsetY = 45;
        group.addChild(text);

        let qrcodeBg = Util.createBitmapByName('share_qrcode_bg_png');
        qrcodeBg.width = 204;
        qrcodeBg.height = 186;
        qrcodeBg.anchorOffsetX = 102;
        qrcodeBg.anchorOffsetY = 93;
        qrcodeBg.x = 110;
        qrcodeBg.y = 100;
        group.addChild(qrcodeBg);


        let qrcode = Util.createBitmapByName('share_qrcode_png');
        qrcode.width = 150;
        qrcode.height = 150;
        qrcode.anchorOffsetX = 75;
        qrcode.anchorOffsetY = 75;
        qrcode.x = 110;
        qrcode.y = 100;
        group.addChild(qrcode);

        renderTexture2.drawToTexture(shareGroup, new egret.Rectangle(0, 0, width, height));
        let data = renderTexture2.toDataURL("image/png");
        shareGroup.removeChild(group);

        let saveGroup = new eui.Group();
        saveGroup.width = 750;
        saveGroup.anchorOffsetX = 375;
        saveGroup.x = width / 2
        saveGroup.y = height - 200;
        shareGroup.addChild(saveGroup);
        saveGroup.addChild(mask);
        text.text = "长按保存图片"
        saveGroup.addChild(text);
        renderTexture2.drawToTexture(shareGroup, new egret.Rectangle(0, 0, width, height));
        let data1 = renderTexture2.toDataURL("image/png");
        shareGroup.removeChild(saveGroup);

        showIFrame('', "<div style='position:relative;'><img  style='width:100%;width:100%;position:absolute;top:0;left:0;' src='" + data1 + "'></img><img  style='width:100%;position:absolute;top:0;left:0;opacity:0.01' src='" + data + "'></img></div>", '')
    }

}


declare function showIFrame(src, title, time);
declare function hideIFrame();
declare function showAlert(msg);
declare function showAlertButton(msg, button, callback);
declare function removeLoading();
declare function configSdk(config);
declare function onMenuShareAppMessage(title, desc, link, imgurl, callback);
declare function onMenuShareTimeline(title, link, imgurl, callback);

declare function connectSocket(url);
