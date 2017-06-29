var common = {
    levels:null,
    userData:{
        levelName:2,
        gender:'gg',
        score:0,
        name:'guapi'
    },
    bgMusic:null,
    btnMusic:null,
    bgMusicVolume:0.5,
    btnMusicVolume:0.5,
    init:function(){
        if(!cc.sys.localStorage.getItem('volume')){
            cc.sys.localStorage.setItem('volume',0.5);
        }
        if(!cc.sys.localStorage.getItem('volume')){
            cc.sys.localStorage.setItem('volumeSE',0.5);
        }
        
    }
}

module.exports = common;