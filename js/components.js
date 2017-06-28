import React from 'react';

const Exit = function(props){
    var game = props.game;
let style = {
        width:'1rem',
        height:'1rem',
        position: 'absolute',
        backgroundColor: 'purple',
        left: (game.state.x+props.x)+'rem',
        top: (game.state.y+props.y)+'rem',
        zIndex:4000
}
return(<div style={style}></div>);
}

const Enemies = function(props){
    var game = props.game;
    let style = {
        width:'1rem',
        height:'1rem',
        position: 'absolute',
        backgroundColor: 'red',
        left: (game.state.x+props.x)+'rem',
        top: (game.state.y+props.y)+'rem',
        zIndex:6000
    }
    return(<div style={style} onClick={props.edit?(()=>{
          var arr = JSON.parse(JSON.stringify(game.state.enemies));
          arr[game.state.floor].splice(props.index,1);
          var initial = JSON.parse(JSON.stringify(game.state.initial));
          initial.enemies[game.state.floor].splice(props.index,1);
          game.setState({enemies: arr,initial: initial});
          }):(()=>{})}>{props.edit?"X":''}</div>);
}

const LifeObj = function(props){
    var game = props.game;
      let style ={
          width:'1rem',
        height:'1rem',
        position: 'absolute',
        backgroundColor: 'green',
        left: (game.state.x+props.x)+'rem',
        top: (game.state.y+props.y)+'rem',
        zIndex:5000
      }
      return(<div style={style} onClick={props.edit?(()=>{
          var arr = JSON.parse(JSON.stringify(game.state.LifeObjs));
          arr[game.state.floor].splice(props.index,1);
          var initial = JSON.parse(JSON.stringify(game.state.initial));
          initial.LifeObjs[game.state.floor].splice(props.index,1);
          game.setState({LifeObjs: arr,initial: initial});
          }):(()=>{})}>{props.edit?"X":''}</div>);
}

const Weapon = function(props){
    var game = props.game;
let style ={
    width:'1rem',
        height:'1rem',
        position: 'absolute',
        backgroundColor: "#ee5",
        left: (game.state.x+props.x)+'rem',
        top: (game.state.y+props.y)+'rem',
        zIndex:3000
      }
      return(<div style={style} onClick={props.edit?(()=>{
          var arr = JSON.parse(JSON.stringify(game.state.weapons));
          arr[game.state.floor].splice(props.index,1);
          var initial = JSON.parse(JSON.stringify(game.state.initial));
          initial.weapons[game.state.floor].splice(props.index,1);
          game.setState({weapons: arr,initial: initial});
          }):(()=>{})}>{props.edit?"X":''}</div>);
}

const Area = function(props){
    var game = props.game;
    //this function removes the Area from the positions array if the 'X' button (avaible on edit mode) is clicked
    function remove(){
        let ok = true;
        let currentPlayerPos = JSON.stringify([game.state.playerX,game.state.playerY]);
        // this variable takes the area attributes 
        let thisArea = game.state.positions[game.state.floor][props.index];
        //this for loop makes a comparison between all the posible positions inside the area, if the player is in one of them
        //meaning he is inside, the loop stops and changes the 'ok' variable to false, meaning the area can't be removed
        for (let i=0;i<thisArea[3];i++){
            for(let i2=0;i2<thisArea[2];i2++){
                let pos= JSON.stringify([props.x+i2,props.y+i]);
                if(pos == currentPlayerPos || pos == JSON.stringify(game.state.exit[game.state.floor])){
                ok = false;
                break;
            }
        }
            if(!ok) break;
        }

        if(ok){
            // removes the area from the level
        let positions = game.state.positions;
        positions[game.state.floor].splice(props.index,1);
        game.setState({positions: positions})
    }
}
    let style = {
        width: props.width+'rem',
        height: props.height+'rem',
        position: 'absolute',
        backgroundColor: 'white',
        left: (game.state.x+props.x)+'rem',
        top: (game.state.y+props.y)+'rem',
        zIndex:1
    };
return(<div style={style} onMouseOver={game.showThings.bind(game,props.x,props.y)} onMouseOut={game.showThings.bind(game,false)} >{props.edit?(<button style={{width:'1rem',height:'1rem',borderWidth:0,position:'absolute',top:Math.ceil(props.height/ 2)-1+'rem',left:Math.ceil(props.width/ 2)-1+'rem'}} onClick={()=>{remove()}}>X</button>):''}</div>);
};

export {Area, Enemies, Exit, Weapon, LifeObj};