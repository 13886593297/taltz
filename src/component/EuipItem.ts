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
        this.width = listBg.width
        this.height = listBg.height
        this.addChild(listBg)

        let title = new egret.TextField()
        if (this.data.title.length >= 13) {
            title.text = this.data.title.substr(0, 11) + '...'
        } else {
            title.text = this.data.title
        }

        title.size = 30
        title.width = 380
        title.textColor = 0xffffff
        title.x = 70
        title.y = 18
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
        time.x = 420
        time.y = 75
        time.size = 16
        this.addChild(time)
    }
}