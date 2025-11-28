const answerBox  = document.getElementById('answer');
const answerForm = document.getElementById('answerSubmission');

const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');

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
      answerForm.submit();
    }
  }
})

class Recorder{
  constructor(){
    this.recorder = null;
    this.chunks = [];
    this.stream = null;
  }

  async create(){
    this.stream = await navigator.mediaDevices.getUserMedia({audio:true});
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
    return this;
  }

  start(){
    this.recorder.start()
  };

  pause(){
    this.recorder.pause()
  };

  resume(){
    this.recorder.resume()
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
    });
  };
}

recordBtn.addEventListener('click', async (e) => {
  const recorder = await new Recorder().create();
  
  const transcriber = new SpeechRecognition();
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