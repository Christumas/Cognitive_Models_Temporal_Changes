//create our screen class which will handle all screen objects for the experiment
class Screen{
    constructor(jsPsychInstance, stimulus, choices=null, onLoadCallback=null, onFinishCallback=null){
        this.jsPsych = jsPsychInstance;
        this.type = jsPsychHtmlKeyboardResponse;
        this.stimulus = stimulus; //in most cases this will be just a prompt
        this.choices = choices;
        this.onLoad = onLoadCallback;
        this.onFinish = onFinishCallback;

        const screen = {
            type:this.type,
            choices: this.choices,
            stimulus:this.stimulus,
            on_load:this.onLoad,
            on_finish:this.onFinish
        }

        return screen;
    }
};

