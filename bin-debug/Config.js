/**
 * app配置文件
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Config = (function () {
    function Config() {
    }
    /**
     * APP版本号
     */
    Config.APP_VERSION = "0.0.1";
    /**
     *域名
     */
    Config.HOST = "http://127.0.0.1";
    /**接口值 */
    Config.PORT = "8000";
    Config.COLOR_GREY = 0x475C6D;
    Config.COLOR_ORANGE = 0xF46C22;
    Config.COLOR_YELLOW = 0xABBF11;
    Config.COLOR_BLUE = 0x1570C7;
    Config.COLOR_MAINCOLOR = 0x36af38;
    Config.DEBUG = true;
    return Config;
}());
__reflect(Config.prototype, "Config");
