var trex, trex_running, trex_collided,cloud,cloudimage,obstacle,ob1,ob2,ob3,ob4,ob5,ob6;
var ground, invisibleGround, groundImage,score;
var obstaclesGroup,cloudsGroup; 
var PLAY=1; 
var END=0; 
var gameState=PLAY; 
var restart, restartimage;
var gameOver, gameimage; 
var name; 

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  
  cloudimage=loadImage("cloud.png"); 
  
  ob1=loadImage("obstacle1.png"); 
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png"); 
  ob4=loadImage("obstacle4.png"); 
  ob5=loadImage("obstacle5.png"); 
  ob6=loadImage("obstacle6.png"); 
  
  gameimage=loadImage("gameOver.png"); 
  restartimage=loadImage("restart.png"); 
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
   restart= createSprite(300,150,10,10); 
  restart.addImage("restart", restartimage); 
  restart.scale=0.5; 
  restart.visible=false; 
  
  gameOver=createSprite(300,100,30,30); 
  gameOver.addImage("over", gameimage); 
  gameOver.visible=false; 
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  ObstaclesGroup=new Group(); 
  cloudsGroup=new Group(); 
  
  score=0; 
  
}

function draw() {
  background("lightblue");
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (score>0 && score%100 === 0){
      //playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 180){
      trex.velocityY = -12 ;
      //playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      //playSound("jump.mp3");
      gameState = END;
      //playSound("die.mp3");
    }
  }
    else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trex_collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  text("Score: "+ score, 450, 40);
  
  stroke("purple"); 
  strokeWeight(1); 
  textSize(20); 
  text ("Alana Villar",200,30);

  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("cloud",cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud); 
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(ob1); 
      break;
       case 2:obstacle.addImage(ob2); 
      break;
       case 3:obstacle.addImage(ob3); 
      break;
       case 4:obstacle.addImage(ob4); 
      break;
       case 5:obstacle.addImage(ob5); 
      break;
       case 6:obstacle.addImage(ob6); 
      break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    ObstaclesGroup.add(obstacle); 
    
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("trex",trex_running);
  
  score = 0; 
  
}