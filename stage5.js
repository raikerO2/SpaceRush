(function(){
    $("body").hide();
    $("body").fadeIn(1500);

    executeGame();
   function executeGame(){
     $(document).ready(function(){
     $("#backgroundCanvas").fadeIn(800);
            $("#enemiesCanvas").fadeIn(800);
            $("#playerCanvas").fadeIn(800);
            $("#enemyRow").fadeIn(800);
            $("#stageText").fadeIn(800);
            $("#playerLifes").fadeIn(800);
        //Declaring the variables /////////////////////////////////////////////////////////////////////////////////////////////////

        var game = {};                                  //Entire game canvas + player as an object.

        game.stars = [];                                //Star array.

        
        

        enemiesForwardSpeed = 2000;

        game.playerLifes = "♥";
           
        game.width = 550;                               //Canvas width.
        game.height = 600;                              //Canvas height.

        game.keys = [];                                 //Keyboard keys.

        game.projectiles = [];                          //Game projectiles

        game.enemies = [];                              //Enemies.
        game.enemyRow = [];

        game.images = [];                               //Contains images.
        game.doneImages = 0;                            //How many images are done loading.
        game.requiredImages = 0;                        //Contains how images should be loaded.

        game.gameOver = false;
        game.gameWon = false;

        game.count = 30;                                 //Counter.
        game.division = 10;                             //Division.
        game.left = false;                              //False left
        game.enemySpeed = 6;
        game.enemyRowSpeed = 6;

        game.explodeSound = new Audio("explosion2.wav");
        game.shootSound = new Audio("shoot2.wav");
        game.gameMusic = new Audio("music.mp3");
        game.playerDie = new Audio("die.mp3");
        game.gameWonMusic = new Audio("won.mp3");
        game.endGame = new Audio('endGame.mp3');


        game.moving = false;

        game.fullShootTimer = 15;
        game.shootTimer = game.fullShootTimer;

        game.player = {
            x: game.width / 2.4,
            y: game.height - 70,
            width: 70,
            height: 50,
            speed: 5,
            rendered: false
        };

        //Game functionality ///////////////////////////////////////////////////////////////////////////////////////////////////////
        game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");  //Background
        game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");          //Player
        game.contextEnemyRow = document.getElementById("enemyRow").getContext("2d");            //Second enemy row
        game.contextEnemies = document.getElementById("enemiesCanvas").getContext("2d");          //Enemies
        $("#playerLifes").text(game.playerLifes);


        //Creating the keyhandlers
        $(document).keydown(function(e){

            game.keys[e.keyCode ? e.keyCode : e.which] = true;
        });



        $(document).keyup(function(e){
           delete game.keys[e.keyCode ? e.keyCode : e.which];
        });

            function addBullet(){
                game.projectiles.push({
                   x: game.player.x,
                   y: game.player.y,
                   size: 20,
                   image: 2
                });
            }


            function init(){                            //Spawns at start.

                

                game.gameMusic.play();
            for(i = 0; i < 600; i++){                   //Pushes stars until i = 600.
                game.stars.push({
                    x: Math.floor(Math.random() * game.width),
                    y: Math.floor(Math.random() * game.height),
                    size: Math.random() * 5
                });
            }
                for(y = 0; y < 2; y++){                 //Loops firt wave
                    for(x = 0; x < 5; x++){
                        game.enemies.push({
                           x: (x * 70) + 100,
                            y: (y * 70) + 20,
                            width: 70,
                            height: 70,
                            image: 1,
                            dead: false,
                            deadTime: 20
                        });
                    }
                }
                for(y = 0; y < 2; y++){                 //Loops second wave
                    for(x = 0; x < 5; x++){
                        game.enemyRow.push({
                           x: (x * 70) + 100,
                            y: (y * 70) + 165,
                            width: 70,
                            height: 70,
                            image: 4,
                            dead: false,
                            deadTime: 20
                        });
                    }
                }
            /*game.contextPlayer.drawImage(game.images[0], 10,10, 60, 60);*/
            loop();
            setTimeout(function(){
                game.moving = true;
            }, enemiesForwardSpeed)                        //After what seconds the enemies start moving towars the player

        }

        function addStars(num){                         //Star array, randomises the size, x and y.
            for(i = 0; i < num; i++){                   //Pushes one element trough the array.
                game.stars.push({
                   x: Math.floor(Math.random() * game.width),
                   y: game.height + 10,
                   size: Math.random() * 5
                });
            }
        }

        /*

         up - 38
         down - 40
         left - 37
         right - 39

         w - 87
         a - 65
         s - 83
         d - 68

         space - 32

         */

        function update(){                              //Updates the DOM.
            addStars(1);                                //Adds stars

            game.contextPlayer.clearRect(game.player.x, game.player.y,game.player.width, game.player.height);

            if(game.count > 100000) {
                game.count = 0;
            }
            game.count++;
            if(game.shootTimer > 0){
                game.shootTimer--;
            }

            for(i in game.stars){                       //Loops trough the length of the stars.
                if(game.stars[i].y <= -5){              //Removes from i to 1 if the stars reach 615 pixels ( off screen).
                    game.stars.splice(i, 1);
                }
                game.stars[i].y--;                      //Moves every element from the star array up.
            }

            if(game.keys[37] || game.keys[65]){
                if(!game.gameOver){
                    if(game.player.x > -0){
                        game.player.x-=game.player.speed;
                        game.player.rendered = false;
                    }
                }
            }
            if(game.keys[39] || game.keys[68]){
                if(!game.gameOver){
                    if(game.player.x <= game.width - game.player.width - 5){
                        game.player.x +=game.player.speed;
                        game.player.rendered = false;
                    }
                }
            }
            if(game.count % game.division == 0){
                game.left = !game.left;
            }
            //First wave of enemies
            for(i in game.enemies){

                if(!game.moving){
                    if(game.left){
                        game.enemies[i].x -= game.enemySpeed;
                    }else{
                        game.enemies[i].x += game.enemySpeed;
                    }
                }
                if(game.moving){
                    game.enemies[i].y++;
                }
                if(game.enemies[i].y >= game.height){
                    game.gameOver = true;
                    game.gameMusic.pause();
                    game.playerDie.play();

                    $("#menuButton").fadeIn("slow");
                    $("#retryButton").fadeIn("slow");

                   
                    $("#playerLifes").text(game.playerLifes = " ");
                   

                }
            }

            //Second wave of enemies
            for(i in game.enemyRow){

                if(!game.moving){
                    if(game.left){
                        game.enemyRow[i].x += game.enemyRowSpeed;
                    }else{
                        game.enemyRow[i].x -= game.enemyRowSpeed;
                    }
                }
                if(game.moving){
                    game.enemyRow[i].y++;
                }   
                if(game.enemyRow[i].y >= game.height){
                    game.gameOver = true;
                    game.gameMusic.pause();
                    game.playerDie.play();

                    $("#menuButton").fadeIn("slow");
                    $("#retryButton").fadeIn("slow");

                     $("#playerLifes").text(game.playerLifes = " ");
                     
                }
            }
            for(i in game.projectiles){
                game.projectiles[i].y-=5;
                if(game.projectiles[i].y <= -game.projectiles[i].size){
                    game.projectiles.splice(i, 1);
                }

            }

            //Shooting space
            if(game.keys[32] && game.shootTimer <= 0){
               if(!game.gameOver){
                   addBullet(); 
                   game.shootTimer = game.fullShootTimer;
                   game.shootSound.play();

                
                    
               }
            }
            //First wave
            for (m in game.enemies){
                for (p in game.projectiles){
                    if(collision(game.enemies[m], game.projectiles[p])){
                        game.enemies[m].dead = true;
                        game.explodeSound.play();

                        

                        game.enemies[m].image = 3;
                         game.contextEnemies.clearRect(game.projectiles[p].x, game.projectiles[p].y, game.projectiles[p].size, game.projectiles[p].size);
                        game.projectiles.splice(p, 1);

                    }
                }
            }
            //Second wave
            for (m in game.enemyRow){
                for (p in game.projectiles){
                    if(collision(game.enemyRow[m], game.projectiles[p])){
                        game.enemyRow[m].dead = true;
                        game.explodeSound.play();

                        
                        
                        game.enemyRow[m].image = 3;
                         game.contextEnemies.clearRect(game.projectiles[p].x, game.projectiles[p].y, game.projectiles[p].size, game.projectiles[p].size);
                        game.projectiles.splice(p,1);

                    }
                }
            }
            //First wave
            for(i in game.enemies){
                if(game.enemies[i].dead){
                    game.enemies[i].deadTime--;
                   
                    
                }
                if(game.enemies[i].dead && game.enemies[i].deadTime <= 0){
                 game.contextEnemies.clearRect(game.enemies[i].x, game.enemies[i].y, game.enemies[i].width, game.enemies[i].height);
                 game.enemies.splice(i, 1);

                }
            }
            if(game.enemies.length <= 0){
                game.gameWon = true;
                game.gameMusic.pause();
                game.endGame.play();

                 $("#nextStage1").click(function () {
                    $load()
                });
                

            }
            //Second wave
            for(i in game.enemyRow){
                if(game.enemyRow[i].dead){
                    game.enemyRow[i].deadTime--;

                    
                }
                if(game.enemyRow[i].dead && game.enemyRow[i].deadTime <= 0){
                 game.contextEnemyRow.clearRect(game.enemyRow[i].x, game.enemyRow[i].y, game.enemyRow[i].width, game.enemyRow[i].height);
                 game.enemyRow.splice(i, 1);

                }
            }
            



        }

        function render(){                              //Renders and outputs to the DOM.
            game.contextBackground.clearRect(0, 0, game.width, game.height);   //Clears the stars from leaving a mark on the screen.
            game.contextBackground.fillStyle = "white";
            for(i in game.stars){
                var star = game.stars[i];

                game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
            }
            
           
            for (i in game.enemyRow){
                var enemiesRow = game.enemyRow[i];
                game.contextEnemyRow.clearRect(enemiesRow.x, enemiesRow.y, enemiesRow.width, enemiesRow.height);
                game.contextEnemyRow.drawImage(game.images[enemiesRow.image], enemiesRow.x, enemiesRow.y, enemiesRow.width, enemiesRow.height);
               
            }
            for (i in game.enemies){
                var enemy = game.enemies[i];
                game.contextEnemies.clearRect(enemy.x, enemy.y, enemy.width, enemy.height);
                game.contextEnemies.drawImage(game.images[enemy.image], enemy.x, enemy.y, enemy.width, enemy.height);
            }
             game.contextPlayer.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
            for (i in game.projectiles){
                var proj = game.projectiles[i];
                game.contextEnemies.clearRect(proj.x, proj.y, proj.size, proj.size);
                game.contextEnemies.drawImage(game.images[proj.image], proj.x, proj.y, proj.size, proj.size);
            }
            
            

            if(game.gameOver){
                game.contextPlayer.font = "bold 50px monaco";
                game.contextPlayer.fillStyle = "white";
                game.contextPlayer.fillText("GAME OVER", game.width / 2 - 150, game.height / 3);
            }
            if(game.gameWon){
                game.contextPlayer.font = "bold 30px monaco";
                game.contextPlayer.fillStyle = "white";
                game.contextPlayer.fillText("CONGRATULATIONS", game.width / 2 - 155, game.height / 3);
                $("#nextStage1").fadeIn(800);
            }

        }


        function loop(){                                //Loops update and render with the requestAnimateFramer.
            requestAnimFrame(function(){
               loop()

            });
            update();
            render();
        }
        function initImages(paths){                    //Loads the images.
            game.requiredImages = paths.length;          //Images required for loading.
            for(i in paths){
                var img = new Image();
                img.src = paths[i];
                game.images[i] = img;
                game.images[i].onload = function(){
                    game.doneImages++;
                }
            }
        }
        function collision(first,second){
            return !(first.x > second.x + second.size ||
                first.x + first.width < second.x ||
                first.y > second.y + second.size ||
                first.y + first.height < second.y
            );
        }

        function checkImages(){                         //Check if the images are loaded.
            if(game.doneImages >= game.requiredImages){     //If the image loads, load the page to the DOM.
                init();
            }else{                                          //loop until the images are loaded.
                setTimeout(function(){
                    checkImages();
                },1);

            }
        }
        game.contextBackground.font = "bold 50px monaco";
        game.contextBackground.fillStyle = "white";
        game.contextBackground.fillText("Loading...", game.width / 2 - 135, game.height / 3);
        initImages(["player.png", "enemy.png", "bullet.png", "explosion.png", "enemy2.png"]);      //Paths of the images.
        checkImages();                                              //Output images.
        //init();                                          //Outputs the init function, no need for the loop.
    });
   }




})();

   window.requestAnimFrame = (function(){                   //RequestAnimationFrame for every browser.
        return window.requestAnimationFrame         ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

