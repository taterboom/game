var common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        backBtn:{
            default:null,
            type: cc.Button
        },
        levelLogo:{
            default:null,
            type:cc.Prefab
        },
        levelLayout:{
            default:null,
            type:cc.Node
        },
        mmBtn:{
            default:null,
            type:cc.Button
        },
        ggBtn:{
            default:null,
            type:cc.Button
        },
        playBtn:{
            default:null,
            type:cc.Button
        },
        
        
    },
    createLevel:function(){
        for(var i = 0; i < common.levels.length; i ++){
            var item = cc.instantiate(this.levelLogo);
            item.getComponentInChildren(cc.Label).string = common.levels[i].levelName;
            this.levelLayout.addChild(item);
            item.on('touchstart',this.onTouchLevel,this);

        }
    },
    onTouchLevel:function(e){
        var item = e.target;
        var levelName = item.getComponentInChildren(cc.Label).string;
        common.userData.levelName = levelName;
        cc.find('Canvas/pageview').getComponent(cc.PageView).scrollToPage(1,0.5);
        cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
    },
    // use this for initialization
    onLoad: function () {
        var _self=this;

        _self.currentBGMusic = cc.audioEngine.play(common.prepareBgm, true,common.bgMusicVolume);

        this.backBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            _self.node.runAction(cc.scaleTo(0.5,0.2,0.2));
            cc.director.loadScene('start');
            
        });
        
        this.createLevel();
        this.mmBtn.node.on('touchstart',function(){
            common.userData.gender = 'mm';
            cc.find('Canvas/pageview').getComponent(cc.PageView).scrollToPage(2,0.5);
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
        },this);
        this.ggBtn.node.on('touchstart',function(){
            common.userData.gender = 'gg';
            cc.find('Canvas/pageview').getComponent(cc.PageView).scrollToPage(2,0.5);
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
        },this);
        this.playBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            this.node.runAction(cc.scaleTo(0.3,0.5,0.5));
            cc.director.loadScene("play");
        },this);
        

    },
    onDestroy: function () {
        //stop play bgMusic 
        cc.audioEngine.stop(this.currentBGMusic);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
