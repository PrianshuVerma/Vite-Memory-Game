export class AnimationTimer {
    constructor(
        public duration: number, 
        public halfwayCB: (t: number) => void,
        public doneCB: (t: number) => void,
        ){}

    public startTime: number | undefined;
    public isRunning: boolean = false;
    public halfway: boolean = false; 
    
    start(time: number){
        this.startTime = time;
        this.isRunning = true;
    }

    update(time: number){
        //console.log(this.isRunning);
        if (!this.isRunning || this.startTime === undefined) return;

        const elapsed = time - this.startTime;

        if (elapsed > (this.duration/2)){
            // halfway so stop animation
            
            if (!this.halfway){
                //console.log("HALFFF")
                this.halfway = true;
                this.halfwayCB(time);
            }
            
        }
        if (elapsed > this.duration){
            this.startTime = undefined;
            this.isRunning = false;
            this.halfway = false;
            // since is running is off we can now call callback
            //console.log("DONEE")
            this.doneCB(time);
        }
    }
}



export class SimpleTimer {
    constructor(
        public duration: number, 
        public doneCB: (t: number) => void,
        ){}

    public startTime: number | undefined;
    public isRunning: boolean = false;
    
    start(time: number){
        this.startTime = time;
        this.isRunning = true;
    }

    update(time: number){
        //console.log(this.isRunning);
        if (!this.isRunning || this.startTime === undefined) return;

        const elapsed = time - this.startTime;

        if (elapsed > this.duration){
            this.startTime = undefined;
            this.isRunning = false;
            this.doneCB(time);
        }
    }
}

export class WaitTimer {
    constructor(
        public duration: number, 
        public doneCB: (t: number) => void,
        ){}

    public startTime: number | undefined;
    public isRunning: boolean = false;
    
    start(time: number){
        this.startTime = time;
        this.isRunning = true;
    }

    update(time: number){
        //console.log(this.isRunning);
        if (!this.isRunning || this.startTime === undefined) return;

        const elapsed = time - this.startTime;

        if (elapsed > this.duration){
            this.startTime = undefined;
            this.isRunning = false;
            this.doneCB(time);
        }
    }
}