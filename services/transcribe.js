import {v2 as speech} from '@google-cloud/speech';

import dotenv from "dotenv";
dotenv.config();

export default {
  transcribe: async (req,res) => {
    try{

      const credentials = JSON.parse(process.env.SPEECH_CREDS);
      const audioBytes = req.file.buffer.toString('base64');
      console.log({audioBytes});
      const client = new speech.SpeechClient({
        credentials,
        projectId: credentials.project_id,
      });

      const [response] = await client.recognize({
        recognizer: `projects/${credentials.project_id}/locations/global/recognizers/transcriber`,
        config: {
          autoDecodingConfig: {},
          languageCodes: ['en-US'],
          model: 'short',
          features: {
            enableAutomaticPunctuation: true,
            enableWordTimeOffsets: true,
          },
        },
        content: audioBytes,
      });
      console.log({response})
      const text = response.results?.map(res => res.alternatives[0].transcript).join(' ') || '';
      
      console.log({text})
      return res.json({text});
    }catch(transcriptionError){
      console.log({transcriptionError});
      return res.status(500).json({message: transcriptionError.message});
    }
  },
}