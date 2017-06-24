var React = require("react");
var ReactDOM = require("react-dom");

if(!localStorage.getItem('_codepen.io_hernanmendez_roguelike_customGames')){
localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify([{
    index: 0,
        name: 'Default',life:400,weapon:'stick', damage:20, level:0,
        xpRequired:[50,100,210,340,500,760,1000,1200,1600,2000],
        xp: 0, 
        x:0 , y:0 ,dead: false, 
        positions:[
            [[2,2,10,10],[12,3,1,1],[13,2,5,5],[18,5,1,1],[19,2,4,10],[15,7,1,10],[8,17,20,5],[10,22,1,1],[25,22,1,1],[23,3,5,1],[23,9,1,1],[24,7,7,9],[7,23,7,6],[22,23,8,3],[28,3,7,10],[34,1,4,5],[25,16,1,1],[28,18,5,1],[32,13,1,6],[32,19,5,5]],
            [[10,20, 5,5],[12,19,1,1],[12,16,15,3],[22,12,7,7],[25,11,1,1],[25,10,30,1]],
            [],
            []],
            //enemy is done like [Xposition,Yposition,life,damage,xp]
            enemies: [[[28,18,100,50,100],[23,9,100,30,40],[20,5,100,25,20]],[],[],[]],
            exit:[[34,22],[22,22],[]],
            //posX,posY,name,aditional damage
            weapons:[[[12,19,"Damaged Dagger",5],[8,27,"katana",20]],[],[],[]],
            //posX,posY,aditional life
            LifeObjs:[[[10,8,100],[34,22,400]],[],[],[]],
            //boss is done like [Xposition,Yposition,life,damage,xp]
            boss:[0,0,1000,15],edit: false, playerX: 3 , playerY: 3,floor:0,
            initial: {
                enemies: [[[28,18,100,50,100],[23,9,100,30,40],[20,5,100,25,20]],[],[],[]],
                weapons:[[[12,19,"Damaged Dagger",5],[8,27,"katana",20]],[],[],[]],
                LifeObjs:[[[10,8,100],[34,22,400]],[],[],[]],
                playerX: 3,
                playerY: 3,
                xp: 0,
                level: 0,
                damage: 20,
                life: 400,
                boss:[0,0,1000,15],
            floor:0},
                show:[false],playerStartingPositions:[[3,3],[12,22],[12,22],[12,22]]
    }]));}
    var storage = JSON.parse(localStorage.getItem('_codepen.io_hernanmendez_roguelike_customGames'));
/*
##############################################################################################################################
*/
var game;
//This (if it's true) allows to show the message="Remenber to change the Boss position because it's always on the last floor" 
//if a user add or deletes a floor for the first time
var able=true;
/*
##############################################################################################################################
*/
//component to render the 'exits' (the block that moves a player to the next floor)
const Exit = function(props){
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
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
const Enemys = function(props){
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
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
const LifeObj = function(props){
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
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
const Weapon = function(props){
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
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
const Area = function(props){
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

class Game extends React.Component{
constructor(){
    super();
    this.state = {};
}
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
//function Used for the movement of the Player and the Camera
move(key){
//Array of all the avaible positions the Player can go to takes all the positions from the floor the player is in
let ava = game.state.positions[game.state.floor].map(info=>{
let inside = [];
for(let i=0;i<info[3];i++){
    for(let i2=0;i2<info[2];i2++){
        inside.push([info[0]+i2 ,info[1]+i])
    }
}

return inside;
});

ava = ava.reduce((a,b)=>a.concat(b)).map(info=>JSON.stringify(info));
//Camera function
let camera = (x,positive)=>{
if(x){
    let windowWidth = (window.innerWidth*0.9)/ 17;
    let moveX=0;
if (game.state.playerX+game.state.x<(windowWidth*0.15) && !positive) moveX=1;
else if(game.state.playerX+game.state.x>(windowWidth*0.85)) moveX=-1;
game.setState({x: game.state.x+moveX});
}
else {
let windowHeight = (window.innerHeight*0.75) / 17;;
let moveY=0;
if (game.state.playerY+game.state.y<(windowHeight*0.2) && positive) moveY=1;
else if(game.state.playerY+game.state.y>(windowHeight*0.7)) moveY=-1;
game.setState({y: game.state.y+moveY});
}
}
//End of the Camera Function
//sets the 4 spaces the boss sits on and puts it into an array
let bossArea=[];
bossArea.push(JSON.stringify([game.state.boss[0],game.state.boss[1]]));
bossArea.push(JSON.stringify([game.state.boss[0]+1,game.state.boss[1]]));
bossArea.push(JSON.stringify([game.state.boss[0],game.state.boss[1]+1]));
bossArea.push(JSON.stringify([game.state.boss[0]+1,game.state.boss[1]+1]));
//takes the the enemy positions on the level
let enemies = game.state.enemies[game.state.floor].map(info=>JSON.stringify([info[0],info[1]]))
switch(key.code){
    //if the key that was pressed was the 'arrowUp' this case is satisfied, same applies for the other cases
    case 'ArrowUp':
    camera(false,true);
    let nextUp = JSON.stringify([game.state.playerX, game.state.playerY-1]); 
    if(enemies.indexOf(nextUp)>-1){
        //takes the nextposition of the player if it corresponds to one of the enemies position
        //life is deducted from the player, and the enemie, if the enemy's life is less than or equal to 0, the enemy is removed from the enemy list
        
        let index = enemies.indexOf(nextUp);
        enemies = game.state.enemies;
        let life = game.state.life - enemies[game.state.floor][index][3];
        enemies[game.state.floor][index][2] -= game.state.damage;
        if(enemies[game.state.floor][index][2]<= 0){ 
            game.setState({xp: game.state.xp+enemies[game.state.floor][index][4]})
            enemies[game.state.floor].splice(index,1);
        }
        game.setState({enemies: enemies,life: life,dead:(life<=0)});
    }
    else if(bossArea.indexOf(nextUp)>-1){
            let boss = JSON.parse(JSON.stringify(game.state.boss));
            boss[2]-= game.state.damage;
            let life = game.state.life - boss[3];
            game.setState({life: life,boss:boss,dead:(life<=0)});
            if(boss[2]<=0){
                document.getElementById("win").style.display="block";
                game.setState(JSON.parse(JSON.stringify(game.state.initial)));}
    }
    else if(game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextUp)>-1){
        let index = game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextUp);
        let weapons = JSON.parse(JSON.stringify(game.state.weapons));
        let weapon = weapons[game.state.floor][index];
        weapons[game.state.floor].splice(index,1);
        game.setState({weapons: weapons, damage: game.state.damage + weapon[3], weapon: weapon[2]});
    }
    else if(game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextUp)>-1){
        let index = game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextUp);
        let objs = JSON.parse(JSON.stringify(game.state.LifeObjs));
        let extralife = objs[game.state.floor][index][2];
        objs[game.state.floor].splice(index,1);
        game.setState({LifeObjs: objs, life: game.state.life + extralife});
    }
    else if(nextUp == JSON.stringify(game.state.exit[game.state.floor]))  game.setState({floor: game.state.floor+1,playerX:game.state.playerStartingPositions[game.state.floor+1][0],playerY:game.state.playerStartingPositions[game.state.floor+1][1]});
    else if(ava.indexOf(nextUp) > -1) game.setState({playerY: game.state.playerY - 1});
    break;
    //end of the case 'ArrowUp'
    //start of the case 'ArrowRight'
    case 'ArrowRight':
    camera(true,true);
    let nextRight = JSON.stringify([game.state.playerX+1, game.state.playerY]);
    if(enemies.indexOf(nextRight)>-1){
        let index = enemies.indexOf(nextRight);
        enemies = game.state.enemies;
        let life = game.state.life - enemies[game.state.floor][index][3];
        enemies[game.state.floor][index][2] -= game.state.damage;
        if(enemies[game.state.floor][index][2]<= 0){ 
            game.setState({xp: game.state.xp+enemies[game.state.floor][index][4]})
            enemies[game.state.floor].splice(index,1);
        }
        game.setState({enemies: enemies,life: life,dead:(life<=0)});
    }
    else if(bossArea.indexOf(nextRight)>-1){
            let boss = JSON.parse(JSON.stringify(game.state.boss));
            boss[2]-= game.state.damage;
            let life = game.state.life - boss[3];

            game.setState({life: life,boss:boss,dead:(life<=0)});
        if(boss[2]<=0){
            document.getElementById("win").style.display="block";
            game.setState(JSON.parse(JSON.stringify(game.state.initial)));}
    }
    else if(game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextRight)>-1){
        let index = game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextRight);
        let weapons = JSON.parse(JSON.stringify(game.state.weapons));
        let weapon = weapons[game.state.floor][index];
        weapons[game.state.floor].splice(index,1);
        game.setState({weapons: weapons, damage: game.state.damage + weapon[3], weapon: weapon[2]});
    }
    else if(game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextRight)>-1){
        let index = game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextRight);
        let objs = JSON.parse(JSON.stringify(game.state.LifeObjs));
        let extralife = objs[game.state.floor][index][2];
        objs[game.state.floor].splice(index,1);
        game.setState({LifeObjs: objs, life: game.state.life + extralife});
    }
    else if(nextRight == JSON.stringify(game.state.exit[game.state.floor]))  game.setState({floor: game.state.floor+1,playerX:game.state.playerStartingPositions[game.state.floor+1][0],playerY:game.state.playerStartingPositions[game.state.floor+1][1]});
    else if(ava.indexOf(nextRight) > -1) game.setState({playerX: game.state.playerX + 1});
    break;
    //end of the case 'ArrowRight'
    //start of the case 'ArrowDown'
    case 'ArrowDown':
    camera(false,false);
    let nextDown = JSON.stringify([game.state.playerX, game.state.playerY+1]); 
    if(enemies.indexOf(nextDown)>-1){
        let index = enemies.indexOf(nextDown);
        enemies = game.state.enemies;
        let life = game.state.life - enemies[game.state.floor][index][3];
        enemies[game.state.floor][index][2] -= game.state.damage;
        if(enemies[game.state.floor][index][2]<= 0){ 
            game.setState({xp: game.state.xp+enemies[game.state.floor][index][4]})
            enemies[game.state.floor].splice(index,1);
        }
        game.setState({enemies: enemies,life: life,dead:(life<=0)});
    }
    else if(bossArea.indexOf(nextDown)>-1){
            let boss = JSON.parse(JSON.stringify(game.state.boss));
            boss[2]-= game.state.damage;
            let life = game.state.life - boss[3];

            game.setState({life: life,boss:boss,dead:(life<=0)});
        if(boss[2]<=0){
            document.getElementById("win").style.display="block";
            game.setState(JSON.parse(JSON.stringify(game.state.initial)));}
    }
    else if(game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextDown)>-1){
        let index = game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextDown);
        let weapons = JSON.parse(JSON.stringify(game.state.weapons));
        let weapon = weapons[game.state.floor][index];
        weapons[game.state.floor].splice(index,1);
        game.setState({weapons: weapons, damage: game.state.damage + weapon[3], weapon: weapon[2]});
    }
    else if(game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextDown)>-1){
        let index = game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextDown);
        let objs = JSON.parse(JSON.stringify(game.state.LifeObjs));
        let extralife = objs[game.state.floor][index][2];
        objs[game.state.floor].splice(index,1);
        game.setState({LifeObjs: objs, life: game.state.life + extralife});
    }
    else if(nextDown == JSON.stringify(game.state.exit[game.state.floor]))  game.setState({floor: game.state.floor+1,playerX:game.state.playerStartingPositions[game.state.floor+1][0],playerY:game.state.playerStartingPositions[game.state.floor+1][1]});
    else if(ava.indexOf(nextDown) > -1) game.setState({playerY: game.state.playerY + 1});
    break;
    //end of the case 'ArrowDown'
    //start of the case 'ArrowLeft'
    case 'ArrowLeft':
    camera(true,false);
    let nextLeft = JSON.stringify([game.state.playerX-1, game.state.playerY]); 
    if(enemies.indexOf(nextLeft)>-1){
        let index = enemies.indexOf(nextLeft);
        enemies = game.state.enemies;
        let life = game.state.life - enemies[game.state.floor][index][3];
        enemies[game.state.floor][index][2] -= game.state.damage;
        if(enemies[game.state.floor][index][2] <= 0){ 
            game.setState({xp: game.state.xp+enemies[game.state.floor][index][4]})
            enemies[game.state.floor].splice(index,1);
        }
        game.setState({enemies: enemies,life: life,dead:(life<=0)});
    }
    else if(bossArea.indexOf(nextLeft)>-1){
            let boss = JSON.parse(JSON.stringify(game.state.boss));
            boss[2]-= game.state.damage;
            let life = game.state.life - boss[3];
            game.setState({life: life,boss:boss,dead:(life<=0)});
        if(boss[2]<=0){
            document.getElementById("win").style.display="block";
            game.setState(JSON.parse(JSON.stringify(game.state.initial)));}
    }
    else if(game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextLeft)>-1){
        let index = game.state.weapons[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextLeft);
        let weapons = JSON.parse(JSON.stringify(game.state.weapons));
        let weapon = weapons[game.state.floor][index];
        weapons[game.state.floor].splice(index,1);
        game.setState({weapons: weapons, damage: game.state.damage + weapon[3], weapon: weapon[2]});
    }
    else if(game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextLeft)>-1){
        let index = game.state.LifeObjs[game.state.floor].map(info=>JSON.stringify([info[0],info[1]])).indexOf(nextLeft);
        let objs = JSON.parse(JSON.stringify(game.state.LifeObjs));
        let extralife = objs[game.state.floor][index][2];
        objs[game.state.floor].splice(index,1);
        game.setState({LifeObjs: objs, life: game.state.life + extralife});
    }
    else if(nextLeft == JSON.stringify(game.state.exit[game.state.floor])) game.setState({floor: game.state.floor+1,playerX:game.state.playerStartingPositions[game.state.floor+1][0],playerY:game.state.playerStartingPositions[game.state.floor+1][1]});
    else if(ava.indexOf(nextLeft) > -1) game.setState({playerX: game.state.playerX - 1});
    break;
    //end of the case 'ArrowLeft'
}
}
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
//This Function shows the Position of the Area you are hovering on if you are on Edit Mode
showThings(x,y){
    if(typeof x != 'number'){
        game.setState({show:[false]})
    }
    else{
        game.setState({show:[true,x,y]})
    }
}
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
//Sets the component to the variable 'game' so we can call functions outside the component
componentWillMount(){
    this.setState(JSON.parse(JSON.stringify(storage[0])));
    game = this;
}

componentWillUpdate(nextProps,nextState){
    if(nextState.life<=0){
        //if the life of the player is less than or equal to 0 the level is reseted
        this.setState(JSON.parse(JSON.stringify(this.state.initial)));
        document.getElementById("death").style.display="block";
    }
  else {
      //if the xpRequired to lvlUP is reached the Level is updated and the damaged is 30% more
    if(this.state.xp<nextState.xp){
        let level = this.state.xpRequired.length - this.state.xpRequired.filter(info=>info>nextState.xp).length;
        let damage = this.state.damage;
        if(level>this.state.level) damage=Math.ceil(damage*Math.pow(1.3,level-this.state.level))
        this.setState({level: level, damage:damage});
    }
  }
}
/*
##############################################################################################################################
##############################################################################################################################
##############################################################################################################################
*/
render(){  
return (
<div>
    <div id="addEnemy">
        X: <input type="number" id="enemyX"/>
        Y: <input type="number" id="enemyY"/>
        Enemy Life: <input type="number" id="enemyLife"/>
        Enemy Damage: <input type="number" id="enemyDmg"/>
        Xp granted after Killing: <input type="number" id="enemyXP"/>
        <button onClick={()=>{
            document.getElementById("enemyX").value="";
            document.getElementById("enemyY").value="";
            document.getElementById("enemyLife").value="";
            document.getElementById("enemyDmg").value="";
            document.getElementById("enemyXP").value="";
            document.getElementById('addEnemy').style.display="none";
            }}>Cancel</button>
            <button onClick={()=>{
                var level = JSON.parse(JSON.stringify(this.state));
                try{
                    level.enemies[level.floor].push([JSON.parse(document.getElementById("enemyX").value),
                    JSON.parse(document.getElementById("enemyY").value),
                    JSON.parse(document.getElementById("enemyLife").value),
                    JSON.parse(document.getElementById("enemyDmg").value),
                    JSON.parse(document.getElementById("enemyXP").value)]);
                    level.initial.enemies[level.floor].push([JSON.parse(document.getElementById("enemyX").value),
                    JSON.parse(document.getElementById("enemyY").value),
                    JSON.parse(document.getElementById("enemyLife").value),
                    JSON.parse(document.getElementById("enemyDmg").value),
                    JSON.parse(document.getElementById("enemyXP").value)]);
                    document.getElementById("enemyX").value="";
                    document.getElementById("enemyY").value="";
                    document.getElementById("enemyLife").value="";
                    document.getElementById("enemyDmg").value="";
                    document.getElementById("enemyXP").value="";
                    document.getElementById('addEnemy').style.display="none";
                }
                catch(error){}
                this.setState(level);
                }}>Set</button>
    </div>
    <div id="addWeapon">
        X: <input type="number" id="weaponX"/>
        Y: <input type="number" id="weaponY"/>
        Name: <input type="text" id="weaponName"/>
        Added Damage: <input type="number" id="weaponDmg"/>
        <button onClick={()=>{
            document.getElementById("weaponX").value="";
            document.getElementById("weaponY").value="";
            document.getElementById("weaponName").value="";
            document.getElementById("weaponDmg").value="";
            document.getElementById('addWeapon').style.display="none";
            }}>Cancel</button>
            <button onClick={()=>{
                var level = JSON.parse(JSON.stringify(this.state));
                try{
                    level.weapons[level.floor].push([JSON.parse(document.getElementById("weaponX").value),
                    JSON.parse(document.getElementById("weaponY").value),
                    document.getElementById("weaponName").value,
                    JSON.parse(document.getElementById("weaponDmg").value)]);
                    level.initial.weapons[level.floor].push([JSON.parse(document.getElementById("weaponX").value),
                    JSON.parse(document.getElementById("weaponY").value),
                    document.getElementById("weaponName").value,
                    JSON.parse(document.getElementById("weaponDmg").value)]);
                    this.setState(level);
                document.getElementById("weaponX").value="";
                    document.getElementById("weaponY").value="";
                    document.getElementById("weaponName").value="";
                    document.getElementById("weaponDmg").value="";
                    document.getElementById('addWeapon').style.display="none";
                }
                catch(error){}
                }}>Set</button>
    </div>
    <div id="addLifeObj">
        X: <input type="number" id="lifeX"/>
        Y: <input type="number" id="lifeY"/>
        Added Life: <input type="number" id="lifeLife"/>
        <button onClick={()=>{
            document.getElementById("lifeX").value="";
            document.getElementById("lifeY").value="";
            document.getElementById("lifeLife").value="";
            document.getElementById('addLifeObj').style.display="none";
            }}>Cancel</button>
            <button onClick={()=>{
                var level = JSON.parse(JSON.stringify(this.state));
                try{
                    level.LifeObjs[level.floor].push([JSON.parse(document.getElementById("lifeX").value),JSON.parse( document.getElementById("lifeY").value),JSON.parse(document.getElementById("lifeLife").value)]);
                    level.initial.LifeObjs[level.floor].push([JSON.parse(document.getElementById("lifeX").value),JSON.parse( document.getElementById("lifeY").value),JSON.parse(document.getElementById("lifeLife").value)]);
                    document.getElementById('addLifeObj').style.display="none";
                    document.getElementById("lifeX").value="";
                    document.getElementById("lifeY").value="";
                    document.getElementById("lifeLife").value="";
                }
                catch(error){}
                this.setState(level);
                }}>Set</button>
    </div>
    <div id="copy">
        Paste the Level Info here: <input type="text" id="copyInput"/>
        <button onClick={()=>{
            document.getElementById("copyInput").value="";
            document.getElementById('copy').style.display="none";
            }}>Cancel</button>
        <button onClick={()=>{
            var level;
            try{ level = JSON.parse(document.getElementById("copyInput").value);}
            catch(error){}
            if(typeof level == "object"){
                if(level.length == this.state.length){
            level.index=storage.length;
            storage.push(level);
            localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage));
            document.getElementById("copyInput").value="";
            document.getElementById('copy').style.display="none";
            this.forceUpdate();
                }
            }
            }}>Add the Level!</button>
    </div>
    <div id="share">
        <p>Copy this:</p>
        <p>{JSON.stringify(storage[this.state.index])}</p>
        <button onClick={()=>{document.getElementById("share").style.display="none"}}>close</button>
    </div>
    <div id="changeIniPos">
        X: <input type="number" id="newIniX"/>
        y: <input type="number" id="newIniY"/>
        <button onClick={()=>{
            document.getElementById("changeIniPos").style.display="none";
            document.getElementById("newIniX").value="";
            document.getElementById("newIniY").value="";
            }}>cancel</button>
        <button onClick={()=>{
            var StartPos = JSON.parse(JSON.stringify(this.state.playerStartingPositions));
            if(document.getElementById("newIniX").value) StartPos[this.state.floor][0]=JSON.parse(document.getElementById("newIniX").value);
            if(document.getElementById("newIniY").value) StartPos[this.state.floor][1]=JSON.parse(document.getElementById("newIniY").value);
            document.getElementById("newIniX").value="";
            document.getElementById("newIniY").value="";
            document.getElementById("changeIniPos").style.display="none";
            var level=JSON.parse(JSON.stringify(this.state));
            level.playerStartingPositions = StartPos;
            level.initial.playerX=StartPos[0][0];
            level.initial.playerY=StartPos[0][1];
            for(let i in level.initial)level[i]=level.initial[i];
            this.setState(level);
            storage[level.index] = level;
            localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage))
            }}>Set and Reset</button>
    </div>
    <div id="changeIniProp">
        life: <input type="number" id="newIniLife"/>
        damage: <input type="number" id="newIniDamage"/>
        <button onClick={()=>{
            document.getElementById("changeIniProp").style.display="none";
            document.getElementById("newIniLife").value="";
            document.getElementById("newIniDamage").value="";
            }}>cancel</button>
        <button onClick={()=>{
            var StartProp = JSON.parse(JSON.stringify(this.state.initial));
            if(document.getElementById("newIniLife").value) StartProp.life=JSON.parse(document.getElementById("newIniLife").value);
            if(document.getElementById("newIniDamage").value) StartProp.damage=JSON.parse(document.getElementById("newIniDamage").value);
            document.getElementById("changeIniProp").style.display="none";
            document.getElementById("newIniLife").value="";
            document.getElementById("newIniDamage").value="";
            var level=JSON.parse(JSON.stringify(this.state));
            level.initial = StartProp;
            for(let i in level.initial)level[i]=level.initial[i];
            this.setState(level);
            storage[level.index] = level;
            localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage))
            }}>Set and Reset</button>
    </div>
    <div id="typeName">
        Name: <input id="levelName"/>
        <button onClick={()=>{document.getElementById("typeName").style.display="none"; document.getElementById("levelName").value=""}}>Cancel</button>
        <button onClick={()=>{var level = JSON.parse(JSON.stringify(this.state));
                for(let i in level.initial)level[i] = level.initial[i];
                level.name=document.getElementById("levelName").value;
                this.setState({name: document.getElementById("levelName").value});
                storage.push(level);
                localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage));
                document.getElementById("levelName").value="";
                document.getElementById("typeName").style.display="none";
                }}>Save</button>
    </div>
    <div id="death">
        <div>
            <h1>You Died</h1>
            <p>Click the button below to reset the level</p>
            <button onClick={()=>{document.getElementById("death").style.display="none"}}>Reset</button>
        </div>
    </div>
    <div id="win">
        <div>
        <h1>You WON!</h1>
        <span>Congratulations! now click the button below to reset the level</span><br/>
        <button onClick={()=>{document.getElementById("win").style.display="none"}}>Reset</button>
        </div>
    </div>
    <div id="changeBossStats">
        X: <input type="number" id="bossX" />
        Y: <input type="number" id="bossY" />
        life: <input type="number" id="bossLife" />
        damage: <input type="number" id="bossDamage" />
        <button onClick={()=>{
            document.getElementById("bossX").value="";
            document.getElementById("bossY").value="";
            document.getElementById("bossLife").value="";
            document.getElementById("bossDamage").value="";
            document.getElementById("changeBossStats").style.display="none";
            }}>Cancel</button>
        <button onClick={()=>{
            document.getElementById("changeBossStats").style.display="none";
            var boss= [document.getElementById("bossX").value,document.getElementById("bossY").value,document.getElementById("bossLife").value,document.getElementById("bossDamage").value];
            if(boss[0]=="")boss[0]=this.state.boss[0];
            if(boss[1]=="")boss[1]=this.state.boss[1];
            if(boss[2]=="")boss[2]=this.state.boss[2];
            else boss[2]=JSON.parse(boss[2]);
            if(boss[3]=="")boss[3]=this.state.boss[3];
            else boss[3]=JSON.parse(boss[3]);
            this.setState({boss:boss});
            document.getElementById("bossX").value="";
            document.getElementById("bossY").value="";
            document.getElementById("bossLife").value="";
            document.getElementById("bossDamage").value="";
            }}>Change Stats</button>
            <p>If you leave a space on blank it will set the previous value as default</p>
    </div>
    <div id="chooseLevel">
        {
            storage.map((info,index)=>(
                <div key={'Level'+index} onClick={()=>{document.getElementById("chooseLevel").style.display="none";game.setState(JSON.parse(JSON.stringify(storage))[index])}}>
                    <p>{info.name}</p>
                    <br />
                    {
                       index!=0 ?
                    (<button onClick={()=>{
                        storage.splice(index,1); 
                        localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage));
                        var level = this.state.index;
                        if(index == level){
                        this.setState(storage[0]);
                        }
                        }}>Delete</button>):''
                    }
                </div>
            ))
        }
    </div>
<div id="chooseFloorToDelete">
    {
    this.state.playerStartingPositions.map((info,index)=><button onClick={()=>{
        var state=JSON.parse(JSON.stringify(this.state));
        state.positions.splice(index,1);
        state.exit.splice(index,1);
        state.enemies.splice(index,1);
        state.playerStartingPositions.splice(index,1);
        state.weapons.splice(index,1);
        state.LifeObjs.splice(index,1);
        state.initial.weapons.splice(index,1);
        state.initial.LifeObjs.splice(index,1);
        state.initial.enemies.splice(index,1);
        if(state.floor == index){
            state.floor= index-1;
            if(state.floor<0) state=0;
        }
        else if(state.floor>state.positions.length-1){
            state.floor=state.positions.length-1;
        }
        this.setState(state);
        document.getElementById("chooseFloorToDelete").style.display="none";
        }} key={"floorButtonToDelete "+(index+1)}>{index+1}</button>)
    }
    <button onClick={()=>{document.getElementById("chooseFloorToDelete").style.display="none"}}>Cancel</button>
</div>








































<div className="controls">
    
<span>life: {this.state.life}</span> || <span>Weapon: {this.state.weapon}</span>  || <span>Level: {this.state.level}</span> || <span>damage: {this.state.damage}</span> || <span>xp: {this.state.xp}</span> || <span>floor:{this.state.floor+1}</span>


<button onClick={()=>{document.getElementById("chooseLevel").style.display='block'}}>Choose Level</button>


<button onClick={()=>{
    var newGame = {
        index: storage.length,
        name: "unnamed",
        life:400,weapon:'', damage:1000, level:0,
        xpRequired:[50,100,210,340,500,760,1000,1200,1600,2000],
        xp: 0, 
        positions: [[[0,0,10,10]]],
        enemies: [[[2,2,10,10,300]]],
        weapons:[[]],
        LifeObjs:[[]],
        exit:[],
        x:0 , y:0 ,dead: false, 
        boss:[5,5,10,13],edit: false, playerX: 0 , playerY: 0,floor:0,
        initial: {
                enemies: [[[2,2,10,10,300]]],
                weapons:[[]],
                LifeObjs:[[]],
                playerX: 0,
                playerY: 0,
                xp: 0,
                level: 0,
                damage: 20,
                life: 400, 
                boss:[5,5,10,13],floor:0},
                show:[false],playerStartingPositions:[[0,0]]
    };
    this.setState(JSON.parse(JSON.stringify(newGame)));

    }}>Make a custom Level</button>

{
    this.state.edit?<button onClick={()=>{this.setState({edit: !this.state.edit})}}>Turn off Edit Mode</button>:<button onClick={()=>{this.setState({edit: !this.state.edit})}}>Turn on Edit Mode</button>
}

<button onClick={()=>{
    var f = JSON.parse(JSON.stringify(this.state));
    var date = new Date();
    f.name = f.name+ " Session: " + date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear() + "  " + date.getHours()+":"+date.getMinutes();
    f.index = storage.length;
            storage.push(f);
            this.forceUpdate();
            localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage));
            
            }}>Save Session</button>
            <button onClick={()=>{this.setState(JSON.parse(JSON.stringify(this.state.initial)));}}>Reset</button>
            <button onClick={()=>{document.getElementById("share").style.display="block"}}>Share this Level</button>
            <button onClick={()=>{document.getElementById("copy").style.display="block"}}>Download a Level</button>
{
    this.state.edit? (
    <div>


        <button id="addAreaButton" onClick={()=>{
            document.getElementById('addAreaButton').style.display="none";
            document.getElementById('addArea').style.display="block";
            }}>Add Area</button>
        <button onClick={()=>{
            if(able){alert("Remenber to change the Boss position because it's always on the last floor"); 
            able=false;}
            let state=JSON.parse(JSON.stringify(this.state));
        state.positions.push([[0,0,10,10]]);
        state.exit.push([0,0]);
        state.enemies.push([[2,2,10,10,300]]);
        state.playerStartingPositions.push([1,1]);
        state.weapons.push([]);
        state.LifeObjs.push([]);
        state.initial.enemies.push([[2,2,10,10,300]]);
        state.initial.weapons.push([]);
        state.initial.LifeObjs.push([]);
        this.setState(state);
            }}>Add Floor</button>
        {
                this.state.playerStartingPositions.map((info,index)=><button onClick={()=>{game.setState({floor: index,playerX:game.state.playerStartingPositions[index][0],playerY:game.state.playerStartingPositions[index][1]});}} key={"floorButton "+(index+1)}>{index+1}</button>)
        }
        <button onClick={()=>{if(able){alert("Remenber to change the Boss position because it's always on the last floor"); 
            able=false;} if(this.state.positions.length>1)document.getElementById("chooseFloorToDelete").style.display="block";}}>Delete Floor</button>
        {
            (this.state.name != "unnamed")?(<button onClick={()=>{
                var level = JSON.parse(JSON.stringify(this.state));
                for(let i in level.initial)level[i] = level.initial[i];
                storage[level.index]=level;
                localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage));
                this.forceUpdate();
                }}>Save Changes</button>)
                :
                (<button onClick={()=>{document.getElementById('typeName').style.display="block";}}>Save Current Custom Level As</button>)
        }
        <button onClick={()=>{
            var level=JSON.parse(JSON.stringify(this.state));
            for(let i in level.initial)level[i]=level.initial[i];
            level.index = storage.length;
            var num=0;
            for(let i of storage){
                if(i.name.slice(0,level.name.length) == level.name)num++;
            }
            level.name= level.name+" Copy "+num;
            storage.push(level);
            localStorage.setItem('_codepen.io_hernanmendez_roguelike_customGames',JSON.stringify(storage))
            this.forceUpdate();
            }}>Make a Copy of this level</button>

        <button onClick={()=>{document.getElementById("addEnemy").style.display="block"}}>Add Enemy</button>
        <button onClick={()=>{document.getElementById("addWeapon").style.display="block"}}>Add Weapon</button>
        <button onClick={()=>{document.getElementById("addLifeObj").style.display="block"}}>Add LifeObj</button>
        <button onClick={()=>{document.getElementById("changeIniProp").style.display="block"}}>Chage initial properties</button>
        <button onClick={()=>{document.getElementById("changeIniPos").style.display="block"}}>Change initial Position</button>
        {
        (this.state.floor==this.state.exit.length)?(<button onClick={()=>{document.getElementById("changeBossStats").style.display="block";}}>Change Boss Stats</button>):(<button>Change Exit Position</button>)
        }
    

    <div id="addArea">
    X:
    <input id="addAreaInput1" type="number"/>
    Y:
    <input id="addAreaInput2" type="number"/>
    Width:
    <input id="addAreaInput3" type="number"/>
    height:
    <input id="addAreaInput4" type="number"/>


    <button onClick={()=>{
        document.getElementById('addAreaButton').style.display="inline";
        document.getElementById('addArea').style.display="none";
        document.getElementById('addAreaInput1').value='';
        document.getElementById('addAreaInput2').value='';
        document.getElementById('addAreaInput3').value='';
        document.getElementById('addAreaInput4').value='';
        }}>Cancel</button>


    <button onClick={()=>{
        try{
        let newPosition = [JSON.parse(document.getElementById('addAreaInput1').value),JSON.parse(document.getElementById('addAreaInput2').value),JSON.parse(document.getElementById('addAreaInput3').value),JSON.parse(document.getElementById('addAreaInput4').value)];
        let positions = this.state.positions;
        positions[this.state.floor].push(newPosition);
        this.setState({positions: positions});
        document.getElementById('addAreaInput1').value='';
        document.getElementById('addAreaInput2').value='';
        document.getElementById('addAreaInput3').value='';
        document.getElementById('addAreaInput4').value='';
        document.getElementById('addAreaButton').style.display="inline";
        document.getElementById('addArea').style.display="none";
        }
        catch(error){}
        }}>Add Area</button>


    </div>
    </div>
    ):''
}
</div>


{
    this.state.show[0]&&this.state.edit?(<p>{'the Area position you are hovering on is X: '+this.state.show[1]+'Y: '+this.state.show[2]} <br /> remember the position is calculated with the top left corner of the Area</p>):''
}


<div className="wrap">
<div className="game">
{
    this.state.positions[this.state.floor].map((info,index)=>(<Area x={info[0]} y={info[1]} width={info[2]} height={info[3]} edit={this.state.edit} index={index} key={index}/>))
}
{
    this.state.enemies[this.state.floor].map((info,index)=>(<Enemys x={info[0]} y={info[1]} key={'enemy'+index} edit={this.state.edit} index={index}/>))   
}
{
this.state.floor == this.state.positions.length-1 ?(
    <div style={{
        width: "2rem",
        height: "2rem",
        backgroundColor: "red",
        position: "absolute",
        zIndex: 5000,
        left: (this.state.x + this.state.boss[0]) + "rem",
        top: (this.state.y + this.state.boss[1]) + "rem"
        }}></div>
):<Exit x={this.state.exit[this.state.floor][0]} y={this.state.exit[this.state.floor][1]} />
}
{
this.state.LifeObjs[this.state.floor].map((info,index)=>(<LifeObj x={info[0]} y={info[1]} key={"lifeObj"+index} edit={this.state.edit} index={index}/>))
}
{
this.state.weapons[this.state.floor].map((info,index)=>(<Weapon x={info[0]} y={info[1]} key={'weapon'+index} edit={this.state.edit} index={index}/>))  
}
</div>
<div className='player' style={{
        width: '1rem',
        height: '1rem',
        backgroundColor: 'blue',
        position: 'absolute',
        left: this.state.x + this.state.playerX+'rem',
        top: this.state.y +this.state.playerY+'rem',
        zIndex:9999
    }}></div>
</div>


</div>
);
}
}

ReactDOM.render(<Game />, document.getElementById('app'));

window.addEventListener('keydown',game.move)
