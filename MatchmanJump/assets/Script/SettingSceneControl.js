var common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        backBtn:{
            default:null,
            type: cc.Button
        },
        bgMusicSlider:{
            default:null,
            type:cc.Slider
        },
        soundEffectSlider:{
            default:null,
            type:cc.Slider
        },

    },

    // use this for initialization
    onLoad: function () {
        var _self=this;
        
        this.bgMusicSlider.progress=cc.sys.localStorage.getItem('volume')||0.5;
        this.soundEffectSlider.progress=cc.sys.localStorage.getItem('volumeSE')||0.5;
        this.backBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            _self.node.runAction(cc.scaleTo(0.5,0.2,0.2));
            cc.director.loadScene('start');
            
        });
        
        this.bgMusicSlider.node.on('slide',function(e){
            //console.log(e.detail.progress);
            cc.sys.localStorage.setItem('volume',e.detail.progress);
            common.bgMusicVolume = e.detail.progress;
        });
        this.soundEffectSlider.node.on('slide',function(e){
            cc.sys.localStorage.setItem('volumeSE',e.detail.progress);
            common.btnMusicVolume = e.detail.progress;
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
