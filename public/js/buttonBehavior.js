import * as ws from "./webSocketConnection.js";
import * as speechRecognition from "./speechRecognition.js";
import * as synthetizer from "./speechSynthesis.js";

speechRecognition.enable_debug();
speechRecognition.init_speech_recognition();
let is_speaking = false;

let speech_random = (x, y) => {
  const coreModel = currentModel.internalModel.coreModel;
  console.log("speech", x, y);
  if (is_speaking) {
    mover_boca(2, Math.random());
    setTimeout(() => {
      speech_random(x, y);
    }, 100);
  } else {
    mover_boca(0, 0);
  }
};

synthetizer.set_onEnd_synthetizer(() => {
  is_speaking = false;
  buttonRecognition.disabled = false;
  console.log("El audio sintetizado ha terminado");
});

const recognition_process = (data) => {
  document.getElementById("TextDetection").innerText = data;
  stop_recognition();
  ws.send({ action: "answerChat", message: data });

  let answerDiv = document.createElement("div");
  answerDiv.innerText = data;
  answerDiv.className = "prompt";
  document.getElementById("GPTAnswer").appendChild(answerDiv);
};

let process_message = (message) => {
  let process_message = JSON.parse(message);
  if (process_message.action == "gpt_answer") {
    synthetizer.change_pitch(2);
    synthetizer.change_rate(1.2);
    let message = process_message.message;
    let messageIndex = 0;

    let answerDiv = document.createElement("div");
    answerDiv.innerText = ""
    answerDiv.className = "answer";
    document.getElementById("GPTAnswer").appendChild(answerDiv);

    let messageInterval = setInterval(function () {
      if (messageIndex < message.length) {
        answerDiv.innerText = answerDiv.innerText + message[messageIndex];
        messageIndex++;
        scrollToBottom(document.getElementById("GPTAnswer"));
      } else {
        clearInterval(messageInterval);
      }
    }, 35); // adjust this value to change the speed of the text display
    synthetizer.say(process_message.message);
    is_speaking = true;
    speech_random(0, 0);
  }
};

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

ws.set_websocket_message_processing_function(process_message);

let recognition_started = false;
let mouse_hover = true;
let buttonRecognition = document.getElementById("BeginRecognition");

let stop_recognition = () => {
  speechRecognition.stop_recognition();
  buttonRecognition.style.background = "#38e08c";
  buttonRecognition.innerText = "Empezar reconocimiento";
  recognition_started = false;
  buttonRecognition.disabled = true;
};

buttonRecognition.onmousedown = () => {
  if (!recognition_started) {
    speechRecognition.start_recognition();
    recognition_started = true;
    buttonRecognition.innerText = "reconociendo";
    buttonRecognition.style.background = "#FF0000";
  } else {
    stop_recognition();
  }
};

buttonRecognition.onmouseup = (e) => {
  if (mouse_hover) {
    stop_recognition();
  }
};

document.body.onmousemove = (e) => {
  let x = e.clientX;
  let y = e.clientY;
  let bounding = buttonRecognition.getBoundingClientRect();
  if (
    bounding.x < x &&
    bounding.x + bounding.width > x &&
    bounding.y < y &&
    bounding.y + bounding.height > y
  ) {
    mouse_hover = true;
  } else {
    mouse_hover = false;
  }
};

speechRecognition.set_process_recognition(recognition_process);

const buttonBehavior = true;
export default buttonBehavior;
