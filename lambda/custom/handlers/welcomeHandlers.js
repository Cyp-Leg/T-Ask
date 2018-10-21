const Alexa = require("alexa-sdk");
const config = require("../config");
const Task = require('../models/Task');

const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, {
    Welcome() {
        this.response.speak("Bienvenue sur habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
    },

    TaskIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Task.addTask(task)
            .then(function (response) {
                that.response.speak("La tache : " + task + " a bien été ajoutée !").listen();
                that.emit(':responseReady');
            })
            .catch(function (error) {
                that.response.speak("La tache : " + task + " n'a pas été ajoutée...").listen();
                that.emit(':responseReady');
            });
        }
        else{
            this.response.speak("No task").listen();
            this.emit(':responseReady');
        }
    },

    DelTaskIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Task.deleteTask(task)
            .then(function(response){
                that.response.speak("La tache : " + task + " a bien été supprimée !");
                that.emit(':responseReady');
            })
            .catch(function(error){
                that.response.speak("La tache : " + task + " n'a pas été supprimée... Erreur : " + error);
                that.emit(':responseReady');
            })
        }
    },

    // ==== Unhandled
    Unhandled() {
        let speechOutput = "Erreur on dirait";
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = welcomeHandlers;
