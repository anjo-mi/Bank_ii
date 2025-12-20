const viewSavedBtn = document.getElementById('view-saved');
const dismissBtn = document.getElementById('dismiss');
const prevAnswerBox = document.getElementById('saved-answer');

const viewFeedbackBtn = document.getElementById('view-fb');
const dismissFeedbackBtn = document.getElementById('dismiss-fb');
const prevFeedbackBox = document.getElementById('saved-feedback');
const errorMessageBox = document.getElementById('error-message');

const answerForm = document.getElementById('answer-form');
const answerArea = document.getElementById('answer');

const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');
const timer = document.getElementById('timer');
const recordBox = document.getElementById('record-box');
const audioFile = document.getElementById('audio-file');
const audioContainer = document.getElementById('record-container');

const handleBad = (message) => {
  errorMessageBox.querySelector('.message').textContent = message;
  errorMessageBox.style.display = 'flex';
  setTimeout(() => {
    errorMessageBox.style.opacity = 100;
  }, 300)
}

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
  let elm = e.target;
  let feedback,answer,error;
  while (elm){
    if (elm.classList.contains('saved-feedback') || elm.classList.contains('view-fb')) feedback = true;
    if (elm.classList.contains('view-saved') || elm.classList.contains('saved-answer')) answer = true;
    if (elm.id === "submit-answer-btn") error = true;
    elm = elm.parentElement;
  }
  if (!feedback){
    prevFeedbackBox.style.opacity = 0;
    setTimeout(() => {
      prevFeedbackBox.style.display = 'none';
    },300);
  }
  
  if (!answer){
    prevAnswerBox.style.opacity = 0;
    setTimeout(() => {
      prevAnswerBox.style.display = 'none';
    },300);
  }

  if (!error){
    errorMessageBox.style.opacity = 0;
    setTimeout(() => {
      errorMessageBox.style.display = 'none';
    }, 300);
  }
})

answerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target.id = 'submit-answer'){
    const answer = document.getElementById('answer').value;
    let question = document.getElementById('question').value;
    const questionId = document.getElementById('questionId').value;
    const audio = audioFile?.checked ? await fetch(audioFile.value) : null;
    question = JSON.parse(question);
    if (!answer.trim().length){
      handleBad('lets not waste calls with blank data chief');
      return;
    }
    if (answer.trim().split(' ').length > 300){
      handleBad('lets not waste calls with blank data chief');
      console.log('interviews are conversations, not soliloquys');
      return;
    }
    const formData = new FormData();
    const audioBlob = audio ? await audio.blob() : null;
    formData.append('audio', audioBlob);
    formData.append('answer', answer);
    formData.append('questionId', questionId);
    formData.append('question', JSON.stringify({question}));

    const body = audio ? formData : JSON.stringify({
      answer,
      questionId,
      question,
    })

    const response = audio 
      ? await fetch('/questions/answerQuestion', {
          method: "POST",
          body
        })
      : await fetch('/questions/answerQuestion', {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body
        })


    if (response.ok){
      window.location.replace('/practice/getLoadResults');
    }
    else{
      handleBad(response.message);
    }
  }
})

answerArea.addEventListener('click', (e) => {
  setTimeout(() => {
    answerArea.scrollIntoView({
      block: "center",
      behavior: 'smooth',
    })
  }, 300)
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
      setTimeout(async () => {
        if (this.recorder.state !== 'recording') return;
        this.time++;
        console.log(60 - this.time);
        timer.textContent = 60 - this.time;
        if (this.time > 60){
          audioContainer.classList.remove('hidden');
          const recording = await this.stop();
          this.transcriber.stop();
          const recordedUrl = URL.createObjectURL(recording);
          const audio = document.getElementById('recording');
          audio.src = recordedUrl;
          audio.controls = true;
          audioFile.value = recordedUrl;
          timer.parentElement.style.backgroundColor = 'blue';
          timer.textContent = 60;
        }
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
      let transcript = '';
      const res = e.results;

      for (let i = e.resultIndex ; i < res.length ; i++){
        if (res[i].isFinal) transcript += res[i][0].transcript;
      }
      const answerBox = document.getElementById('answer');
      answerBox.textContent += transcript ? transcript + ' ' : '';
    }

    recorder.start();
    transcriber.start();
    timer.parentElement.style.backgroundColor = 'green';
    stopBtn.addEventListener('click', async (e) => {
      audioContainer.classList.remove('hidden');
      const recording = await recorder.stop();
      transcriber.stop();
      const recordedUrl = URL.createObjectURL(recording);
      audioFile.value = recordedUrl;
      const audio = document.getElementById('recording');
      audio.src = recordedUrl;
      audio.controls = true;
      timer.parentElement.style.backgroundColor = 'blue';
      timer.textContent = 60;
    });
  })
}else recordBox.style.display = "none";