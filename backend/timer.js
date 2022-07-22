class MyTimer {
    constructor(message) {
        this.startTime = undefined;
        this.endTime = undefined;
        this.message = message;
    }
    setMessage(message) {
        this.message = message;
    }
    startTime(message = undefined) {
        if (message) {
            this.message = message;
        }
        this.startTime = performance.now();
    }
    endTime() {
        this.endTime = performance.now();

        const ms = this.endTime - this.startTime;
        let s = ms / 1000;
        s = Math.round(s * 1000) / 1000;

        console.log(`Call to perform "${this.message}" took ${s} seconds`);
    }
};

module.exports = MyTimer;