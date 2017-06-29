var common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            default:null,
            type:cc.Node
        },
        cloud1:{
            default:null,
            type:cc.Prefab
        },
        cloud2:{
            default:null,
            type:cc.Prefab
        },
        cloud3:{
            default:null,
            type:cc.Prefab
        },
        scoreLabel:{
            default:null,
            type:cc.Label
        },
        backBtn:{
            default:null,
            type: cc.Button
        },
    },
    //background move ,(root slide down)
    bgMove:function(){
        var height = 1920/2;
        if(this.player.y+this.player.parent.y>height){
            this.player.parent.y-=(this.player.y+this.player.parent.y-height);
        }
    },
    // createCloudPool:function(){
    //     this.cloud1Pool = new cc.NodePool();
    //     let cloudCount = 20;
    //     for (let i = 0; i < cloudCount; i++){
    //         let cloud1Inst = cc.instantiate(this.cloud1);
    //         this.cloud1Pool.put(cloud1Inst);
    //     }
    // },
    createCloud:function(y){
        var width = 900;
        var h = y;      
        var x = []; 
        var levelData = common.levels[common.userData.levelName-1];
        var distance = levelData.distance - 0;
        var floorsPerPage = 1920/distance; 
        var cloudCategroy = levelData.cloudCategroy;
        var isCloudContain = [];
        isCloudContain[0] = cloudCategroy.indexOf('cloud1');
        isCloudContain[1] = cloudCategroy.indexOf('cloud2');
        isCloudContain[2] = cloudCategroy.indexOf('cloud3');
        var flag2 = 1;
        var flag3 = 1;  
        var flagMove = 1; 
        var cloud2f = levelData.cloudF[0]/levelData.cloudNumPerFloor;
        var cloud3f = levelData.cloudF[1]/levelData.cloudNumPerFloor;
        for (var i = 0; i < floorsPerPage; i++){
            
            x[0] = cc.random0To1()*width;
            for(var j = 1; j < levelData.cloudNumPerFloor; j++){
                do{
                    x[j] = cc.random0To1()*width;
                }while(Math.abs(x[0] - x[j])<300);
                
            }
            for(j = 0; j < levelData.cloudNumPerFloor; j++){
                var cloud = null;
                if(flag3 < 0 && isCloudContain[2] >= 0){
                    cloud = cc.instantiate(this.cloud3);
                    flag3 = 1;
                }else if((flag2 < 0 && isCloudContain[1] >= 0) || cloud2f >= 100){
                    cloud = cc.instantiate(this.cloud2);
                    
                    flag2 = 1;
                }else{
                    cloud = cc.instantiate(this.cloud1);
                }
                cloud.getComponent('CloudController').player = this.player;
                
                cc.find('root/CloudManager').addChild(cloud);
                cloud.setPosition(cc.p(x[j],h + cc.random0To1()*40-20));
                if(levelData.canMove === true && flagMove < 0){
                    cloud.getComponent('CloudController').flagMove = 1;
                    flagMove = 1;
                }

                flag2 -= cc.random0To1()*cloud2f;
                flag3 -= cc.random0To1()*cloud3f;
                flagMove -= cc.random0To1()*0.8;
            }          
            h += distance;  
        }
    },
    // use this for initialization
    onLoad: function () {
        this.score = 0;
        this.flag = 0;
        this.loadSceneFlag = 0;
        this.createCloud(0);
        this.createCloud(1920);
        if(common.userData.gender == 'gg'){
            this.currentBGMusic = cc.audioEngine.play(common.ggBgm, true,common.bgMusicVolume);
        }else{
            this.currentBGMusic = cc.audioEngine.play(common.mmBgm, true,common.bgMusicVolume);
        }
        this.backBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            cc.director.loadScene('start');
        },this);
        this.node.on(cc.Node.EventType.TOUCH_START,function(e){
            //console.log('start'+e.touch._point.x);
            if(e.getLocation().x > 540){
                this.player.getComponent('playertest').touchControl(1);
            }else{
                this.player.getComponent('playertest').touchControl(-1);
            }
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(e){
            //console.log('move'+e.touch._point.x);
            if(e.getLocation().x > 540){
                this.player.getComponent('playertest').touchControl(1);
            }else{
                this.player.getComponent('playertest').touchControl(-1);
            }
        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,function(e){
            //console.log('end'+e.touch._point.x);
            this.player.getComponent('playertest').touchControl(0);
        },this);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.bgMove();
        //instantiate cloud per 1920
        if(this.player.y / 1920 > this.flag){
            this.createCloud(1920*(this.flag+2));
            this.flag++;
        }
        if(this.score < this.player.y){
            this.score = Math.floor(this.player.y);
            this.scoreLabel.string = 'Score : ' + this.score;
            common.userData.score = this.score;
        }
        if(this.player.y < (-this.player.parent.y-100) && this.loadSceneFlag === 0){
            this.loadSceneFlag = 1;
            //console.log('fail');
            common.userData.success = 'fail!';
            setTimeout(function(){
                cc.director.loadScene('gameover');
            },300);
        }
        if(this.score > common.levels[common.userData.levelName-1].score && this.loadSceneFlag === 0){
            this.loadSceneFlag = 1;
            common.userData.success = 'success!';
            setTimeout(function(){
                cc.director.loadScene('gameover');
            },300);
        }
        
        
    },
    onDestroy: function () {
        //stop play bgMusic 
        cc.audioEngine.stop(this.currentBGMusic);
    }
});
