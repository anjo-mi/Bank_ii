const viewSavedBtn = document.getElementById('view-saved');
const dismissBtn = document.getElementById('dismiss');
const prevAnswerBox = document.getElementById('saved-answer');

const viewFeedbackBtn = document.getElementById('view-fb');
const dismissFeedbackBtn = document.getElementById('dismiss-fb');
const prevFeedbackBox = document.getElementById('saved-feedback');

const answerForm = document.getElementById('answer-form');

const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');
const recordBox = document.getElementById('record-box');


viewSavedBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevAnswerBox.style.display = 'flex';
  setTimeout(() => prevAnswerBox.style.opacity = 100,0);
})

dismissBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevAnswerBox.style.opacity = 0;
  setTimeout(() => {
    prevAnswerBox.style.display = 'none';
  },300)
})

viewFeedbackBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevFeedbackBox.style.display = 'flex';
  setTimeout(() => prevFeedbackBox.style.opacity = 100,0);
  prevFeedbackBox.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
})

dismissFeedbackBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevFeedbackBox.style.opacity = 0;
  setTimeout(() => {
    prevFeedbackBox.style.display = 'none';
  },300)
})

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('saved-answer') 
    && !e.target.classList.contains('view-saved')){
    prevAnswerBox.style.opacity = 0;
  setTimeout(() => {
    prevAnswerBox.style.display = 'none';
  },300)
  }
  if (!e.target.classList.contains('saved-feedback') 
    && !e.target.classList.contains('view-fb')){
    prevFeedbackBox.style.opacity = 0;
  setTimeout(() => {
    prevFeedbackBox.style.display = 'none';
  },300)
  }
})

answerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target.id = 'submit-answer'){
    const answer = document.getElementById('answer').value;
    let question = document.getElementById('question').value;
    const questionId = document.getElementById('questionId').value;
    question = JSON.parse(question);
    if (!answer.trim().length){
      // handleBad('lets not waste calls with blank data chief');
      return;
    }
    const response = await fetch('/questions/answerQuestion', {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({
        answer,
        questionId,
        question
      })
    })


    if (response.ok){
      window.location.replace('/practice/getLoadResults');
    }
    else{
      // handleBad(response.mesage);
    }
  }
})

if (navigator.mediaDevices?.getUserMedia){
  class Recorder{
    constructor(){
      this.recorder = null;
      this.chunks = [];
      this.stream = null;
      this.transcriber = null;
      this.time = 0;
    }
  
    async create(){
      this.stream = await navigator.mediaDevices.getUserMedia({audio:true});
      this.recorder = new MediaRecorder(this.stream);
      this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
      return this;
    }
  
    start(){
      this.recorder.start()
      this.count();
    };
  
    pause(){
      this.recorder.pause()
    };
  
    resume(){
      this.recorder.resume()
    };

    count(){
      setTimeout(() => {
        this.time++;
        console.log(this.time);
        if (this.time > 60) this.stop();
        else this.count();
      },1000)
    };
  
    stop(){
      return new Promise((resolve) => {
        this.recorder.onstop = (e) => {
          const blob = new Blob(this.chunks, {type: 'audio/webm'});
          this.chunks = [];
          this.stream.getTracks().forEach(tr => tr.stop());
          resolve(blob)
        }
        this.recorder.stop();
        this.transcriber?.stop()
      });
    };
  }


  recordBtn.addEventListener('click', async (e) => {
    const recorder = await new Recorder().create();

    recorder.transcriber = new SpeechRecognition();
    const transcriber = recorder.transcriber;
    transcriber.continuous = true;
    transcriber.interimResults = true;
    transcriber.lang = 'en-US';
    transcriber.onresult = (e) => {
      console.log({e});
      let transcript = '';
      const res = e.results;


      console.log({transcript})

      for (let i = e.resultIndex ; i < res.length ; i++){
        if (res[i].isFinal) transcript += res[i][0].transcript;
      }
      const answerBox = document.getElementById('answer');
      answerBox.textContent += transcript ? transcript + ' ' : '';
    }

    recorder.start();
    transcriber.start();
    stopBtn.addEventListener('click', async (e) => {
      const recording = await recorder.stop();
      transcriber.stop();
      const recordedUrl = URL.createObjectURL(recording);
      const audio = document.getElementById('recording');
      audio.src = recordedUrl;
      audio.controls = true;
    });

  })
}else recordBox.style.display = "none";