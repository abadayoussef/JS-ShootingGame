var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var generateAfter = 3;
var generateFactor = 0.03;
var currentGeneratorState = 0;
var rockes = [];
var bullets = [];
var colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "pink"
];
var mouse = {
  x: undefined,
  y: undefined
};
var inputs = {
  up: false,
  down: false,
  left: false,
  right: false
};

function init(){

}

addEventListener("resize",function(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
function inputHandler(obj){
    addEventListener("mousemove", function(event){
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      obj.setTankAngle(Math.atan2(mouse.y-obj.y,mouse.x-obj.x));

  });
  addEventListener("click", function(event){
   bullets.push(new Bullet(obj));
   
});

  addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37: obj.x += inputs.left = true; break; //left
      case 38: obj.y += inputs.up = true; break; //up
      case 39: obj.x += inputs.right = true; break; //right
      case 40: obj.y += inputs.down = true; break; //down
      case 32: init(); break; //press spacebar to reset
    }
  }, false);
  addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 37: obj.x += inputs.left = false; break; //left
      case 38: obj.y += inputs.up = false; break; //up
      case 39: obj.x += inputs.right = false; break; //right
      case 40: obj.y += inputs.down = false; break; //down
    }
  }, false);
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor(colors){
  return colors[Math.floor(Math.random() * colors.length)];
}
function getDestance(x1,y1,x2,y2){
  var destX = Math.pow(x2 - x1,2);
  var destY = Math.pow(y2 - y1,2);
  return Math.sqrt(destX + destY);
}

var Ship = {
  x : innerWidth / 2,
  y : innerHeight / 2,
  speed : 5,
  raduis : 20,
  //tank attr
  tankRaduis: 8,
  tankX : 0,
  tankY: -20-8,
  tankAngle: Math.PI / 2,
  setTankAngle: function(tankAngle){
    this.tankAngle = tankAngle;
  },

  color : "rgba(0,75,255,1.0)",
  lastShipPos : {
    x : innerWidth / 2,
    y : innerHeight / 2
  },
  update : function(){
    if(inputs.left){
      this.x -= this.speed;
    }else if(inputs.right){
      this.x += this.speed;
    }
    if(inputs.up){
      this.y -= this.speed;
    }else if(inputs.down){
      this.y += this.speed; 
    }

    //teleport
    if(this.x > innerWidth + this.raduis){
      this.x = this.lastShipPos.x = -this.raduis;
    }else if(this.x < -this.raduis){
      this.x = this.lastShipPos.x = innerWidth + this.raduis;
    }
    if(this.y > innerHeight + this.raduis){
      this.y = this.lastShipPos.y = -this.raduis;
    }else if(this.y < -this.raduis){
      this.y = this.lastShipPos.y = innerHeight + this.raduis;
    }

    this.lastShipPos.x += (this.x  - this.lastShipPos.x) * 0.1;
    this.lastShipPos.y += (this.y  - this.lastShipPos.y) * 0.1;
  },
  
  render : function(){
    this.update();
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.lastShipPos.x ,this.lastShipPos.y,this.raduis,0,Math.PI * 2);
    context.fill();
    context.closePath();

    //tank tube
    context.beginPath();
    context.fillStyle = "green";
    context.arc(this.lastShipPos.x + Math.cos(this.tankAngle) * this.raduis ,this.lastShipPos.y + Math.sin(this.tankAngle) * this.raduis ,this.tankRaduis,0,Math.PI *2);
    
    context.fill();
    context.closePath();

  }
};
function Rock(updawn){
  this.raduis = random(10,50);
  this.speed = random(3,7);
  this.color = randomColor(colors);
  if(updawn){
  this.top = random(0,1);
  if(this.top){
    this.x = random(-this.raduis,innerWidth+this.raduis);
    this.y = -this.raduis;
  }else{
    this.x = random(-this.raduis,innerWidth+this.raduis);
    this.y = innerHeight + this.raduis;
  }
}else{
  this.left = random(0,1);
  if(this.left){
    this.x = -this.raduis;
    this.y = random(-this.raduis,innerHeight+this.raduis);
  }else{
    this.x = innerWidth + this.raduis;
    this.y = random(-this.raduis,innerHeight+this.raduis);
  }
}
 
  this.lastRockPos = {
    x : this.x,
    y : this.y
  };

  this.update = function(ship){
    this.lastRockPos.x += (ship.x  - this.lastRockPos.x) * 1e-3 * this.speed;
    this.lastRockPos.y += (ship.y  - this.lastRockPos.y) * 1e-3 * this.speed;
  };

  this.render = function(ship){
    this.update(ship);
    context.beginPath();
    context.arc(this.lastRockPos.x, this.lastRockPos.y, this.raduis, 0,2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  };
}

function Bullet(ship){
  this.raduis = 5;
  this.x = ship.lastShipPos.x  + Math.cos(ship.tankAngle) * (ship.raduis + 5);
  this.y = ship.lastShipPos.y + Math.sin(ship.tankAngle) * (ship.raduis + 5);
  this.speed = -6; 
   this.angle = Math.atan2(this.y-mouse.y,this.x-mouse.x);
  this.update = function(){
    this.y += this.speed * Math.sin(this.angle);
    this.x += this.speed * Math.cos(this.angle);
  };
  this.render = function(){
    this.update();
    context.beginPath();
    context.fillStyle = "yellow";
    context.arc(this.x,this.y,this.raduis,0,Math.PI * 2);
    context.fill();
    context.closePath();
  };
}
var i = 0;
var j = 0;
inputHandler(Ship);
function render(){
  context.clearRect(0,0,innerWidth,innerHeight);
  currentGeneratorState += generateFactor;
  if(currentGeneratorState >= generateAfter){
    rockes.push(new Rock(random(0,1)));
    currentGeneratorState = 0;
  }
  for(i = 0; i< rockes.length; i++){
    rockes[i].render(Ship);
  }
  Ship.render();
  for(i = 0; i< bullets.length;i++){
    bullets[i].render();
  }
  for(i = 0; i< bullets.length;i++){
    for(j = 0; j< rockes.length; j++){
      if(getDestance(bullets[i].x,bullets[i].y,rockes[j].lastRockPos.x,rockes[j].lastRockPos.y) < (rockes[j].raduis + bullets[i].raduis)){
        rockes.splice(j,1);
        bullets.splice(i,1);
        return;
      }
    }
    if(bullets[i].y < -bullets[i].height){
      bullets.splice(i,1);
    }
  }
}
setInterval(render,1000/60);
