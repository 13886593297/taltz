
/**
 * 按钮组件
 */

enum ButtonType {
    NOMAL = 1,
    YELLOW = 2
}

class XButton extends eui.Button {

    private yellowSkin = `<e:Skin class="skins.ButtonSkin"  states="up,down,disabled" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing" height="79">
    <e:Image width="310" height="108" alpha.disabled="0.5" fillMode="scale" source="button_submit_bg_png"/>
    <e:Label id="labelDisplay" x="110" size="42" textColor="0xFFFFFF" verticalAlign="middle" textAlign="center" width="200" height="100" fontFamily="SimHei" anchorOffsetX="0" anchorOffsetY="0"/>
    <e:Image id="iconDisplay" horizontalCenter="-124" verticalCenter="-11.5" width="24" height="24"/>
</e:Skin>`

    constructor(name: string, type = ButtonType.NOMAL) {
        super()

        switch (type) {
            case ButtonType.NOMAL:
                this.skinName = "resource/eui_skins/Button.exml"
                break
            case ButtonType.YELLOW:
                this.skinName = this.yellowSkin
                break
        }


        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
            let glowFilter = Util.getLightFliter(0xff0000)
            this.iconDisplay.filters = [glowFilter]
        }, this)
        this.labelDisplay.text = name
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Util.playMusic('model_select_mp3')
        }, this)
    }


    public setType(type) {
        switch (type) {
            case ButtonType.NOMAL:
                this.skinName = "resource/eui_skins/Button.exml"
                break
            case ButtonType.YELLOW:
                this.skinName = this.yellowSkin
                break
        }
    }

}