const answerBox  = document.getElementById('answer');
const answerForm = document.getElementById('answerSubmission');

const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');
const recordBox = document.getElementById('record-box');
const audioFile = document.getElementById('audio-file');
const audioContainer = document.getElementById('record-container');

answerBox.addEventListener('focusin', (e) =>{
  answerBox.scrollIntoView({
    behavior:"smooth",
    block:"end",
  })
})

answerBox.addEventListener('keydown', (e) =>{
  if (e.key === 'Enter'){
    if (!e.shiftKey){
      e.preventDefault();
      answerForm.requestSubmit();
    }
  }
})

answerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  answerForm.style.width = '0px';
  answerForm.style.opacity = '0';
  const answer = document.getElementById('answer').value;
  const answers = document.getElementById('answers').value;
  const questions = JSON.parse(document.getElementById('questions').value);
  const current = +document.getElementById('current').value;
  const sessionId = document.getElementById('sessionId').value;
  const audio = audioFile.checked ? await (fetch(audioFile.value)) : null;

  if (!answer.trim().length){
    console.log('make an effort to get an effort');
    setTimeout(() => {
      answerForm.style.width = '100%';
      answerForm.style.opacity = '100';
    }, 500);
    return;
  }
  if (answer.trim().split(' ').length > 300){
    console.log('keep words to a 300 maximum');
    setTimeout(() => {
      answerForm.style.width = '100%';
      answerForm.style.opacity = '100';
    }, 500);
    return;
  }

  const formData = new FormData();
  const audioBlob = audio ? await audio.blob() : null;
  formData.append('audio', audioBlob);
  formData.append('answer', answer);
  formData.append('answers', answers);
  formData.append('questions', JSON.stringify(questions));
  formData.append('current', current);
  formData.append('sessionId', sessionId);

  const body = audio ? formData : JSON.stringify({
    answer,
    answers,
    questions,
    current,
    sessionId,
  })

  const response = audio
    ? await fetch('/practice/next', {
      method: "POST",
      body
    })
    : await fetch('/practice/next', {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body
    })

    if (response.ok){
      const data = await response.json();

      if (data.current === questions.length){
        window.location.replace('/practice/getLoadResults');
      }else{
        document.getElementById('questionNumber').textContent = data.current + 1;
        document.querySelector('.question-content').textContent = data.questions[data.current].content;
        answerBox.value = '';
        audioContainer.classList.add('hidden');
        document.getElementById('answers').value = JSON.stringify(data.answers);
        // document.getElementById('questions').value = JSON.stringify(data.questions);
        document.getElementById('current').value = data.current;
        document.getElementById('sessionId').value = data.sessionId;
        audioFile.value = '';
        audioFile.checked = false;
        setTimeout(() => {
          answerForm.style.width = '100%';
          answerForm.style.opacity = '100';
        }, 500);
      }
    }
});

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
        if (this.time > 60){
          audioContainer.classList.remove('hidden');
          const recording = await this.stop();
          this.transcriber.stop();
          const recordedUrl = URL.createObjectURL(recording);
          const audio = document.getElementById('recording');
          audio.src = recordedUrl;
          audio.controls = true;
          audioFile.value = recordedUrl;
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
        this.transcriber?.stop();
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
    stopBtn.addEventListener('click', async (e) => {
      audioContainer.classList.remove('hidden');
      const recording = await recorder.stop();
      transcriber.stop();
      const recordedUrl = URL.createObjectURL(recording);
      audioFile.value = recordedUrl;
      const audio = document.getElementById('recording');
      audio.src = recordedUrl;
      audio.controls = true;
    });

  })
}else recordBox.style.display = "none";