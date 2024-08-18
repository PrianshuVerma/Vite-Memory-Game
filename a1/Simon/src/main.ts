import {
  startSimpleKit,
  setSKDrawCallback,
  setSKEventListener, 
  SKEvent, 
  SKResizeEvent, 
  SKMouseEvent, 
  SKKeyboardEvent, 
  setSKAnimationCallback, 
  addSKEventTranslator,
} from '../simplekit';

import { Drawable } from "../simplekit/drawable";

import { SimonLogic} from '../simonlogic.ts';
import { Circle } from './circle.ts';
import { AnimationTimer, SimpleTimer, WaitTimer } from './timer.ts';

// global variables
startSimpleKit();
let game = new SimonLogic();
let circList: Circle[] = [];
let width: number = 0;
let height: number = 0;
let startText: string = "press SPACE to play";
let round: number = 1;
let animatedButtons: number = 0;
let CAbutton: number = 0; //Current Animation Button
let sequence: number[] = [];
let remainng: number[] = [];
let globalTime: number = 0;
let cheatMode: boolean = false;
SimonGame();



function handleEvent(e: SKEvent) {
  switch (e.type) {
    case "resize":
      const resized = e as SKResizeEvent;
      width = resized.width;
      height = resized.height;
      createCircles();
      break;

    case "click":
      const c = e as SKMouseEvent;
      if (game.state == "HUMAN") {

        circList.forEach((s) => {
          if (s.hitTest(c.x, c.y)){
            CAbutton = s.orderNum - 1;
            handleClick();
          }
        });
      }
        break;

    case "keypress":
      const { key } = e as SKKeyboardEvent;
      console.log(key);
		  if (key == "q") {
        startText= "press SPACE to play";
        round = 1;
        game = new SimonLogic();
        createCircles();
		  }
      else if (key == " " && (game.state == 'START' || game.state == 'COMPUTER' || game.state == 'WIN')){
        // start round
        handleRound();
      }
      else if(key == " " && game.state == 'LOSE'){
        round = 1;
        //game = new SimonLogic();
        handleRound();
      }
      else if (key == "?"){
        cheatMode = !cheatMode;
      }
      else if(key == "+" && (game.state == 'START' || game.state == 'LOSE' || game.state == 'WIN')){
        if (game.buttons < 10){
          animatedButtons = 0;
          CAbutton = 0;
          let temp: number = game.buttons + 1;
          round = 1;
          game = new SimonLogic();
          game.buttons = temp;
          startText= "press SPACE to play";
          createCircles();
        }
      }

      else if(key == "-" && (game.state == 'START' || game.state == 'LOSE' || game.state == 'WIN')){
        if (game.buttons > 1){
          animatedButtons = 0;
          CAbutton = 0;
          let temp: number = game.buttons - 1;
          round = 1;
          game = new SimonLogic();
          game.buttons = temp;
          startText= "press SPACE to play";
          createCircles();
        }
      }
      break;

      case "mousemove":
        const me = e as SKMouseEvent;
        if (game.state == "HUMAN") {

          circList.forEach((s) => {
            s.hitTest(me.x, me.y)
          });
        }
        
        break;
  }
}


function SimonGame(){

  setSKEventListener(handleEvent);

  setSKDrawCallback((gc) => { 
    //
    gc.clearRect(0, 0, width, height);
    writeText(width/2, 40, `SCORE: ${game.score}`, gc);
    if (cheatMode && game.state == "HUMAN"){ 
      writeText(width/2, height - 100, String(remainng), gc);
    }
    else{
      
      writeText(width/2, height - 100, startText, gc);
    }
    
    if(cheatMode){
      writeText(width - 100, height - 75, "CHEATING", gc, "grey");
    }
  
    //draw circles here
    circList.forEach((c) => {
      c.draw(gc);
    });
  
    
  });
  
  setSKAnimationCallback((time) => {
    globalTime = time;
    AnimationSequencetimer.update(time);
    singleButton.update(time);
    WaitBeforeWinRound.update(time);
    WaitBeforeLoseRound.update(time);
    
  });


}


const AnimationSequencetimer = new AnimationTimer(1000, 
  // halfwaycall back
  (t) => {
    circList[CAbutton].isLarger = false;

    
}, 
// done call back
(t) => {
  if(animatedButtons < round){
    CAbutton = sequence[animatedButtons];
    circList[CAbutton].isLarger = true;
    animatedButtons ++;
    game.nextButton();
    AnimationSequencetimer.start(t);
  }
  // humans turn to play
  else {
    startText = "Now it’s your turn";
  }
});

const singleButton = new SimpleTimer (500, (t) => {
  circList[CAbutton].isLarger = false;
  circList[CAbutton].isHighlighted = false;
})

const WaitBeforeWinRound = new WaitTimer (750, (t) => {
  //handleRound();
  startText = "You won! Press SPACE to continue";
})

const WaitBeforeLoseRound = new WaitTimer (750, (t) => {
  //handleRound();
  startText = "You lose. Press SPACE to play again";
})


function writeText(x: number, y: number, text: string, gc: CanvasRenderingContext2D , colour?: string){
gc.save()
  gc.font = "20pt sans-serif";
  gc.textAlign = "center";
  gc.textBaseline = "middle";
  if(colour){
    gc.fillStyle = colour;
  }
  gc.fillText(text, x, y);
  gc.restore();

}

function createCircles(){

  // clear circle list
  circList = [];
  let spaceLeft: number = width - (150 * game.buttons);
  let gap: number = ( spaceLeft / (game.buttons + 1));
  for(let i:number = 1; i <= game.buttons; i++){
    if (i == 1){
      circList.push(new Circle( gap + 75, height / 2, i, false));
    }
    else {
      circList.push(new Circle( (gap * i) + (150 * (i - 1) + 75), height / 2, i, false));
    }
  }

  //console.log(circList.length);

}

function handleClick(){

            circList[CAbutton].isLarger = true;
            //console.log(`You hit circle ${CAbutton}`);
            singleButton.start(globalTime);
            game.verifyButton(CAbutton);
            remainng.shift();

            if (game.state == "WIN"){
              startText = "";
              WaitBeforeWinRound.start(globalTime);
              round ++;
            }
            else if (game.state == "LOSE"){
              startText = "";
              round = 0;
              WaitBeforeLoseRound.start(globalTime);
            }
}

function handleRound(){

        animatedButtons = 0;
        startText = "Watch what I do";
        game.newRound();
        sequence = game.remainingSequence();
        remainng = game.remainingSequence().map(function(item) { 
          // Increment each item by 1
          return item + 1; 
      });
        AnimationSequencetimer.start(globalTime);
}

