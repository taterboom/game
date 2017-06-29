var common = require ('common');
cc.Class({
    extends: cc.Component,

    properties: {
        playBtn:{
            default:null,
            type:cc.Button
        },
        settingBtn:{
            default:null,
            type:cc.Button
        },
        recordBtn:{
            default:null,
            type:cc.Button
        },
        startBgm:{
            default:null,
            url:cc.AudioClip
        },
        prepareBgm:{
            default:null,
            url:cc.AudioClip
        },
        ggBgm:{
            default:null,
            url:cc.AudioClip
        },
        mmBgm:{
            default:null,
            url:cc.AudioClip
        },
        gameoverBgm:{
            default:null,
            url:cc.AudioClip
        },
        btnMusic:{
            default:null,
            url:cc.AudioClip
        },
        jumpMusic:{
            default:null,
            url:cc.AudioClip
        },
        thunderMusic:{
            default:null,
            url:cc.AudioClip
        },
        
    },

    // use this for initialization
    onLoad: function () {
        var _self = this;
        //load leveldata
        this.flag = true;
        this.levels = null;
        cc.loader.loadRes('levelData',function(err,res){
            if(err){
                console.log('load level err!');
            }else{
                _self.levels = res.levels;
                
            }
        });
        //_self.node.setScale(0.5);
        //_self.node.runAction(cc.scaleTo(0.5,1,1));
        
        //
        common.init();
        common.startBgm = this.startBgm;
        common.prepareBgm = this.prepareBgm;
        common.ggBgm = this.ggBgm;
        common.mmBgm = this.mmBgm;
        common.gameoverBgm = this.gameoverBgm;
        common.btnMusic = this.btnMusic;
        common.jumpMusic = this.jumpMusic;
        common.thunderMusic = this.thunderMusic;
        //v -> volume
        var v = cc.sys.localStorage.getItem('volume');
        var vSE = cc.sys.localStorage.getItem('volumeSE');
        common.bgMusicVolume = v;
        common.btnMusicVolume = vSE;
        //play bg music cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
        _self.currentBGMusic = cc.audioEngine.play(common.startBgm, true,common.bgMusicVolume);
        
        //btn's event
        _self.playBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
           _self.node.runAction(cc.scaleTo(0.3,0.5,0.5));
            cc.director.loadScene("playPrepare");
        });
        _self.settingBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            _self.node.runAction(cc.scaleTo(0.3,0.5,0.5));
            cc.director.loadScene("setting");
        });
        _self.recordBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            _self.node.runAction(cc.scaleTo(0.3,0.5,0.5));
            cc.director.loadScene("record");
        });
        
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.levels&&this.flag){
            this.flag = false;
            common.levels = this.levels;
            //console.log(this.common);
        }
    },
    onDestroy: function () {
        //stop play bgMusic 
        cc.audioEngine.stop(this.currentBGMusic);
    }
});
