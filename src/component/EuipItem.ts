class EquipItem extends eui.Group {
    private data

    constructor(data) {
        super()
        this.data = data
        this.init()
    }

    private init() {
        let listBg: egret.Bitmap
        if (this.data.url.endsWith('pdf')) {
            listBg = Util.createBitmapByName('equip_bg_pdf_png')
        } else {
            listBg = Util.createBitmapByName('equip_bg_mp4_png')
        }
        this.addChild(listBg)

        let title = new egret.TextField()
        if (this.data.title.length >= 8) {
            title.text = this.data.title.substr(0, 6) + '...'
        } else {
            title.text = this.data.title
        }

        title.size = 24
        title.width = 140
        title.textColor = 0xffffff
        title.x = 125
        title.y = 34
        this.addChild(title)

        let time = new egret.TextField()
        time.text = this.data.publicTime
        if (this.data.publicTime.length > 11) {
            let y = this.data.publicTime.split('T')[0].split('-')[0]
            let m = this.data.publicTime.split('T')[0].split('-')[1]
            let d = this.data.publicTime.split('T')[0].split('-')[2]
            time.text = y + '年' + m + '月' + d + '日'
        }
        time.textColor = 0xffffff
        time.x = 390
        time.y = 65
        time.size = 26
        this.addChild(time)
    }
}