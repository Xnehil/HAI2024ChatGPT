const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let debug = false;
let recognition;

export const init_speech_recognition = () =>{
    recognition = new SpeechRecognition();
    
    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.continious = false;

    recognition.onsoundstart = ()=>{
        if(debug){
            console.log("El usuario ha empezado a hablar");
        }
    }

    recognition.onnomatch = () =>{
        if(debug){
            console.log("No se encontro matching");
        }
    }

    recognition.onerror = (e) =>{
        console.log("Hubo un error: ",e.error);
    }

    recognition.onsoundend = () => {
        if(debug){
            console.log("El reconocimiento del sonido ha acabado");
        }
    }

    recognition.onspeechend = () =>{
        if(debug){
            console.log("El reconocimiento de texto ha acabado");
        }
    }

    recognition.onresult = (e)=>{
        let results = e.results;
        for(let result of results){
            console.log(result);
        }
    }
    console.log("Inicializando speech recognition");
}

export const start_reconition=()=>{
    recognition.start();
}

export const enable_debug = _ => debug = true;