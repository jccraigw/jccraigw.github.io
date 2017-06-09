console.log("hi");

//grabing 2d canvas to work on
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// //hero drop velocity 
var dy = 1;
//variable to hold the heros radius to be used in collision detection
var heroRadius = 10;

//random numbers for left side top and bottom lines
var randomTop= 0;
var randomBottom = 0;

//variables to hold the items height and width
var itemWidth = 50;
var itemHeight = 50; 

//HERO
//
//create the hero object that will move around the board
//it will need a body to hold direction
//it will need a starting point
//if will need to be draw and have a direction to move
var hero = {
	//body will contain the coordinates for the hero
	body:{},
	//the direcctioin the hero is traveling
	direction: "",
	//create the staring point for the hero
	initHero: function(){

		this.body = {x: 250, y:10, r: 10, e: 0};
	},
	//draw the hero on the canvas
	drawBody: function(){


		ctx.beginPath();
    	ctx.arc(hero.body.x, hero.body.y, heroRadius, 0, Math.PI*2);
    	ctx.fillStyle = "black";
    	ctx.fill();
    	ctx.closePath();

	},
	//move is based off left and right movements only
	//the hero should be constantly falling like gravity
	move: function(){

		if(hero.direction === 'right'){
			//move the heros x position 10 to the right
			hero.body = {x: hero.body.x + 10, y: hero.body.y, r: 10, e: 0}
			dy=1;
			//move the hero x position 10 to the left
		}else if(hero.direction === "left"){

			hero.body = {x: hero.body.x - 10, y: hero.body.y, r: 10, e: 0}
			dy=1;

		}
	}
}

//movement for hero, listens to key down only right and left
document.addEventListener('keydown', function(event){
  var key = event.which;
  if(key === 39){
    hero.direction = "right";
     hero.move();
  	hero.drawBody();
  }else if(key === 37){
    hero.direction = "left";
     hero.move();
  	hero.drawBody();
  }
  console.log(key);
 
});


//GAMEBOARD
//
//
//array to hold the line obstacles that make up the level;
//keeps a min and max for each row along the x axis
//added random blocks for left side to add variation then randomly select one each time
var levelArray = [{x: 0, y: 100, xMax: 200}, //0
				  {x: 0, y: 400, xMax: 200}, //1  
				  {x:200, y: 250, xMax:250}, //2
				  {x:200, y: 250, xMax:300}, //3
				  {x:200, y: 250, xMax:350}, //4
				  {x:200, y: 250, xMax:400}, //5
				  {x:200, y:550, xMax:250}, //6
				  {x:200, y:550, xMax:300}, //7
				  {x:200, y:550, xMax:350}, //8
				  {x:200, y:550, xMax:400}, //9
				  ];
//array to hold the x and y position of the items on the canvas
var itemsArray = [{x: 250, y: 150, status: 1},
				  {x: 100, y: 300, status: 1},
				  {x: 250, y:450, status: 1},
				  {x: 100, y: 600, status: 1}];

//function to draw the game board on the canvas
//draws four lines that will later move
//might have to add argument to take values to be able to move lines up and down
var drawLines= function(){

	for(var i = 0; i < 2; i++){
		ctx.beginPath();
		ctx.moveTo(levelArray[i].x, levelArray[i].y);
		ctx.lineTo(levelArray[i].xMax, levelArray[i].y);
		ctx.stroke();
	}

	
	for(var i = 0; i < 2; i++){
		
		if(i === 0){


			ctx.beginPath();
			ctx.moveTo(levelArray[randomTop].x, levelArray[randomTop].y);
			ctx.lineTo(levelArray[randomTop].xMax, levelArray[randomTop].y);
			ctx.stroke();

		}
		else{

			ctx.beginPath();
			ctx.moveTo(levelArray[randomBottom].x, levelArray[randomBottom].y);
			ctx.lineTo(levelArray[randomBottom].xMax, levelArray[randomBottom].y);
			ctx.stroke();
		}
	}

}

//draw the items on the screen taking the position from the items array
//if the status is 1 then the brick hasnt been hit and can be drawn
var drawItems = function(){

		for(var i = 0; i < 4; i++){
			if(itemsArray[i].status === 1){
				ctx.beginPath();
	            ctx.rect(itemsArray[i].x, itemsArray[i].y, itemWidth, itemHeight);
	            ctx.fillStyle = "#0095DD";
	            ctx.fill();
	            ctx.closePath();
	        }

        }
}


//create random number for the left blocks for variation in the game between 4-7
//have this as a function call
//variable to hold random number

//random number generator function for top and bottom left lines
var getRandomNumber = function(){

	randomTop= Math.floor(Math.random() * (4-2)+2);
	randomBottom = Math.floor(Math.random()*(8-6)+ 6);
}



//COLLSION DETECTION
//
//collision logic checks if ball is between the min and max range for a line on y axis
//if it is between it is stopped in its tracks
//if it goes outside of it to 200 range it begins falling again :)
 
function collisionDetection() {
    
			
				//checks the array for a collison along the lines according to hero position on canvas
				if((hero.body.y=== levelArray[0].y - heroRadius && (hero.body.x > levelArray[0].x && hero.body.x < levelArray[0].xMax))||
				(hero.body.y=== levelArray[1].y - heroRadius && (hero.body.x > levelArray[1].x && hero.body.x < levelArray[1].xMax)) ||
				(hero.body.y=== levelArray[randomTop].y - heroRadius && (hero.body.x > levelArray[randomTop].x && hero.body.x < levelArray[randomTop].xMax))||
				(hero.body.y=== levelArray[randomBottom].y - heroRadius && (hero.body.x > levelArray[randomBottom].x && hero.body.x < levelArray[randomBottom].xMax))){

					dy= 0;
			
			

				}else{

					dy= +dy;

				}
				//stops ball at the bottom of myCanvas
				if(hero.body.y === 700- heroRadius){

				dy=0;

				}


}

//item collision detection
//when it they will disappear from the board
//loop through the items array and compare the location to the heros to determine if hit
var collisionDetection_Items = function(){


	for(var i = 0; i < 4; i++){
		//if hero hits item then dont draw item on screen
		if(itemsArray[i].status === 1){
			if(hero.body.x > itemsArray[i].x && hero.body.x < itemsArray[i].x+itemWidth && hero.body.y > itemsArray[i].y && hero.body.y < itemsArray[i].y+itemHeight) {
	                //item hit so dont draw it
	                itemsArray[i].status = 0;
	            }
		}

	}
}



//RUN GAME
//
//function to draw game and animate it 
//calls blocks and hero 
//hero drops at a constant velocity
var animateCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawLines();
    drawItems();
     
	//places hero on the board
	collisionDetection();
    hero.drawBody();
  

	
    
    
    collisionDetection_Items();
     //constant drop added to hero
    hero.body.y += dy;
   

   
  
    
    
    window.requestAnimationFrame(animateCanvas);
}

	//initializes hero for the game
	getRandomNumber();
	hero.initHero();
	animateCanvas();



