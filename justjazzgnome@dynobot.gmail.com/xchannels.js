const Lang = imports.lang;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Data = Extension.imports.data;

const channels = 
[
{ name: "Funky Jazzmusic",          link: "http://opml.radiotime.com/Tune.ashx?id=s293802&formats=aac,ogg,mp3&partnerId=16&serial=f8b8ad4d7353c6e238185de8e9d20735&filter=s",              pic: '/images/funkyjazz.png',             num:0},
{ name: "Smooth Jazz",              link: "http://opml.radiotime.com/Tune.ashx?id=s16735&formats=aac,ogg,mp3&partnerId=16&serial=c5e4f5d94748cd5c91c05511b3451666",                        pic: "/images/smoothglobaljazz.png",      num:1},
{ name: "Power Smooth Jazz",        link: "http://opml.radiotime.com/Tune.ashx?id=s255372&formats=aac,ogg,mp3,wmpro,wma,wmvoice&partnerId=16&serial=f6fb8f206e563952a85a3b8f4f5fc27a",     pic: "/images/powerjazz.png",             num:2},
{ name: "Relaxing Jazz",            link: "http://opml.radiotime.com/Tune.ashx?id=s111775&formats=aac,ogg,mp3&partnerId=16&serial=c5e4f5d94748cd5c91c05511b3451666",                       pic: "/images/fluid.png",                 num:3},
];

var Channel = class Channel{

    constructor(name, link, pic ,num , fav) {
        this.name = name;
        this.link = link;
        this.pic = pic;
        this.num = num;
        this.fav = fav;
    }

    getName() {
        return this.name;
    }

    getLink() {
        return this.link;
    }

    getPic() {
        return this.pic;
    }

    getNum(){
        return this.num;
    }

    isFav(){
        return this.fav;
    }

    setFav(f){
        this.fav = f;
    }

};

var ChannelBox = GObject.registerClass(class ChannelBox extends PopupMenu.PopupBaseMenuItem {

    _init(channel, player, popup) {
        super._init({
            reactive: true,
            can_focus: true,
        });
        this.player = player;
        this.channel = channel;
        this.popup = popup;

        this.vbox = new St.BoxLayout({ vertical: false });
        this.add_child(this.vbox);

        let icon2 = new St.Icon({
            gicon: Gio.icon_new_for_string(Extension.path + channel.getPic()),
            style:'margin-right:10px',
            icon_size:60,
        });

        let box2 = new St.BoxLayout({ vertical: false });
        let label1 = new St.Label({
            text: channel.getName(),
            y_align: Clutter.ActorAlign.CENTER,
            y_expand: true,
        });
        this.vbox.add_child(icon2);
        this.vbox.add_child(box2);
        box2.add(label1);

    }

    activate(ev) {
        this.player.stop();
        this.player.setChannel(this.channel);
        this.player.play();
        this.popup.channelChanged();
    }
});

function getChannels() {
    return channels.map(ch => new Channel(ch.name, ch.link, ch.pic, ch.num , Data.isFav(ch.num)));
}

function getFavChannels() {
    return channels.filter(ch => Data.isFav(ch.num)).map(ch => new Channel(ch.name, ch.link, ch.pic, ch.num , true));
}

function getChannel(index) {
    let item = channels[index];
    return new Channel(item.name, item.link, item.pic , item.num , Data.isFav(item.num));
}
