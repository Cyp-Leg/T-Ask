const Alexa = require("alexa-sdk");
const config = require("../config");
var handlers = require('./handlers')

var username = "test";
var password = "test";

const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, Object.assign({
    Welcome() {
        this.response.speak("Bienvenue sur Habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
    }
}, handlers));

/*
    LoginIntent() {
        that.emit(':tell','Veuillez entrer votre username');
        var usrname = this.event.request.intent.slots.usrname.value
        let that = this;
        if(usrname){
            that.emit(':ask', "Veuillez entrer votre mot de passe");
            User.login(usrname,pwd)
            .then(function (response) { 
                that.emit(':ask', "Vous êtes bien connecté.");
            })
            .catch(function (error) {
                that.emit(':ask', "Erreur de connexion", error.message);
            });
        }
    },
*/
    
module.exports = welcomeHandlers;
