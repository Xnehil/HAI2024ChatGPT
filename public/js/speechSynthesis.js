const synthetizer = window.speechSynthesis;
let voices = [];
let pitch = 1.0;
let rate = 1.0;
export let selected_voice;
document.body.onload = () =>{
    let temporal_voices = synthetizer.getVoices();
    for(let voice of temporal_voices){
        if(voice.lang.includes("es")>0){
            voices.push(voice);
        }
    }

    
    if(voices.length<1){
        console.log("Tu navegador no tiene voces en español.");
        return -1;
    }

    selected_voice = voices[0];

    //Populate the select "voiceSelect" with the voices
    let voiceSelect = document.getElementById("voiceSelect");
    for(let voice of voices){
        let option = document.createElement("option");
        option.textContent = voice.name;
        option.setAttribute("value",voice.name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.addEventListener('change', changeVoice);


}


function changeVoice() {
    let selectedVoiceName = voiceSelect.value;
    selected_voice = voices.find(voice => voice.name === selectedVoiceName);
}



let onendSynthetizer = console.log;

export const set_onEnd_synthetizer = (callback) =>{
    onendSynthetizer = callback
}

export const say = (text) =>{
    const current_utterance = new SpeechSynthesisUtterance(text);
    //current_utterance.lang = selected_voice.lang;
    current_utterance.voice = selected_voice;
    current_utterance.pitch = pitch;
    current_utterance.rate = rate;
    current_utterance.onend = (e)=> {
            onendSynthetizer()
    };  
    current_utterance.onerror = (e) => {
        console.error("SpeechSynthesisUtterance.onerror",e);
      };
  
    synthetizer.speak(current_utterance);
}

export const change_pitch = (value) => {
    if(Number(value)==NaN){
        console.log("El pitch tiene que ser numerico")
        return -1;
    }
    else if(value<0){
        console.log("El pitch no puede ser negativo, asignando 0.1");
        pitch = 0.1;
    }else if(value>2.0){
        console.log("El pitch no puede ser mayor de 2.0, asignando 2.0")
        pitch = 2.0
    } else{
        pitch = value;
    }
}

export const change_rate = (value) => {
    if(Number(value)==NaN){
        console.log("El rate tiene que ser numerico")
        return -1;
    }
    else if(value<0){
        console.log("El rate no puede ser negativo, asignando 0.1");
        rate = 0.1;
    }else if(value>2.0){
        console.log("El rate no puede ser mayor de 2.0, asignando 2.0")
        rate = 2.0
    }else{
        rate = value;
    }
}


export default voices;

