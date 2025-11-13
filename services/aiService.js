import {GoogleGenAI} from '@google/genai';
import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;
import dotenv from "dotenv";

dotenv.config();

export const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});

export default {
  getAnswerFeedback: async (question,answer,current,sessionId) => {
    try{
      // TODO at a later date:
      //  - this is prolly where a rate limiter check will be initiated, and the error response will be handled below |||||ctrl F: rate-limiter||||||
      console.log('if an aquarius uses gemini, are they the third member of outkast?')
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please, treat this as though you are mentoring someone who is typically an entry level / junior / early career developer. When in an interview they were given the question "${question.content}." The person you're mentoring gave the answer, "${answer}." Remembering to stay positive with critiques, suggest those improvements.
        a.) When a question is fact-based, operate under the pretense that a user should hit three main points:
         Remember that these three points need not always be separate (ie. what suffices for 1a, may also suffice for 2a and/or 3a, etc.).
         1a. Display an understanding of the concept via a brief explanation.
         2a. Acknowledge a case in which it would be used (or a case in which it should be avoided).
         3a. Give an example of a time they've seen it used, or used it themselves (or why they'd avoid using it).
        
        b.) When a question is more personal, or opinion-based, operate under the pretense that a user should give a brief story that sticks to three main point:
         1b. Roughly 1-2 sentences that describe a scenario that acts as the user's call-to-action. The user should demonstrate some sort of stakes, no matter how small. The call-to-action should, ideally, be in response to a genuine need felt by anyone (but this can also be satisfied by any criteria).
         2b. Roughly 2 sentences describing the action the steps the user took to resolve the problem. The user should describe their specific actions, ideally highlighting a change they caused (but again, be open-minded about how a user can demonstrate this, as there are more ways than one).
         3b. Roughly 1-2 sentences about the result of the actions that the user took, and the impact it had in a broader context. The user should ideally highlight an improvement to something, no matter how small. ONLY IF, their story allows it to be quantifiable, suggest a way in which they can, or ask them if there's their action caused any issue to never occur again. This should be how the user wraps up their answer (but again, take into consideration that this is open-ended and there are many forms in which correct answers can be given).
        
        For both a.) and b.), if a user can condense wordy, run-on sentences, or instances where they beat around the bush, or are saying similar things in different words without adding real content, suggest ways in which they can do so.

        Any advice should be brief and to the point, while using soft set-up's like "I think," or "Maybe if you tried" for the personal or opinion-based questions. And for fact-based questions, set-up's that offer brief guidance or clarifying points and encouragement rather than drawn out explanations. And remember, sometimes an answer can just be good, and not need much by way of advice.
        
        If there are free and reputable resources [mdn, youtube, learnwithleon, medium, freecodecamp, official documentation, github, etc.] available that a user can use in order to strengthen their knowledge on the given subject, please look up ones that may help the user strengthen their answer.
        
        Please return your response in the JSON format specified in the config file, with your advice and suggested improvements or acknowledgement of sufficiency in the "feedback" property and the full URLs of any of the free and reputable resources as the items of the resources array (if there are no resources that are valid or necessary, send resources as an empty array). If there is an error, send back in JSON format with a 'message' property.`,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              feedback: {type:"string"},
              resources: {
                type: "array",
                items: {type: "string"},
              },
            }
          }
        },
      })

      const data = await JSON.parse(response.text);

      // console.log('google translated to: ', {data})

      const {feedback, resources} = data;
      console.log(question.content, {feedback,resources, answer}, question._id)

      // TODO at a later date:
      //  - |||||ctrl F: rate-limiter|||||| populate the practice session with limit or error message
      // TODO tomorrow:
      //  - update specific places in array using the same $set trick
      //  - (if !response.ok) update aiResponse with error messages / rationale
      const updatedSession = await PracticeSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            [`aiResponse.questionResponse.${current}.feedback`]: feedback,
            [`aiResponse.questionResponse.${current}.resources`]: resources,
            [`aiResponse.questionResponse.${current}.questionId`]: question._id,
          },
        },
        {new:true}
      )

      console.log({updatedSession})

    }catch(feedbackError){
      console.log({feedbackError});
      // res.status(400).json({message: feedbackError.message})
    }
  },
}