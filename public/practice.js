const answerBox  = document.getElementById('answer');
const answerForm = document.getElementById('answerSubmission');

const recordBtn = document.getElementById('record');
const stopBtn = document.getElementById('stop');
const recordBox = document.getElementById('record-box');

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
      console.log('requesting submit')
      answerForm.requestSubmit();
    }
  }
})

answerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const answer = document.getElementById('answer').value;

  if (answer.trim().split(' ').length > 300){
    console.log('keep words to a 300 maximum');
    return;
  }else answerForm.submit();
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
          const recording = await this.stop();
          this.transcriber.stop();
          const recordedUrl = URL.createObjectURL(recording);
          const audio = document.getElementById('recording');
          audio.src = recordedUrl;
          audio.controls = true;
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
      const recording = await recorder.stop();
      transcriber.stop();
      const recordedUrl = URL.createObjectURL(recording);
      const audio = document.getElementById('recording');
      audio.src = recordedUrl;
      audio.controls = true;
    });

  })
}else recordBox.style.display = "none";