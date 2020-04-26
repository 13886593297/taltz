class TitleEvent extends egret.Event {
    public static BACK: string = "BACK";
    public static CHANGE_TITLE: string = "CHANGE_TITLE";

    public title = "";
    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }
}