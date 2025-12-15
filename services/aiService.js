import {GoogleGenAI} from '@google/genai';
import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;
import dotenv from "dotenv";

dotenv.config();

export const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});

export default {
  getAnswerFeedback: async (question,answer,current = 0,sessionId, level,title,userId) => {
    try{
      // TODO at a later date:
      //  - this is prolly where a rate limiter check will be initiated, and the error response will be handled below |||||ctrl F: rate-limiter||||||
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please, treat this as though you are mentoring someone who is typically an ${level || 'early'} level / career ${title || 'developer'}. When in an interview they were given the question "${question.content}." The person you're mentoring gave the answer, "${answer}." Remembering to stay positive with critiques, suggest those improvements.
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

        Any advice should be brief and to the point, while using soft set-up's like "I think," or "Maybe if you tried" for the personal or opinion-based questions. And for fact-based questions, set-up's that offer brief guidance or clarifying points and encouragement rather than drawn out explanations. And remember, sometimes an answer can just be good, and not need much by way of advice. Especially in instances when this is the case, notify the user of potential follow-up questions they should be prepared for. When compiling your replies, imagine the user does not know what this prompt is, so give context to your thought process.
        
        If there are free and reputable resources [mdn, github repos, youtube, medium, official documentation, etc.] available that a user can use in order to strengthen their knowledge on the given subject, please look up ones that may help the user strengthen their answer.
        
        Please return your response in the JSON format specified in the config file, with your advice and suggested improvements or acknowledgement of sufficiency in the "feedback" property, the full URLs of any of the free and reputable resources as the items of the resources array and the content of any follow-up questions as the items of the followUps array (if there are no resources or follow-ups that are valid or necessary, send resources or followUps as an empty array, respectively). If there is an error, send back in JSON format with a 'message' property.
        
        IMPORTANT: Please format the feedback portion of your response with TRIPLE line breaks and markdown formats:
          - to display any lists
          - Between paragraphs
          - After colons introducing lists`,
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
              followUps: {
                type: "array",
                items: {type: "string"},
              },
            }
          }
        },
      })

      const data = await JSON.parse(response.text);

      const {feedback, resources, followUps} = data;

      // TODO at a later date:
      //  - |||||ctrl F: rate-limiter|||||| populate the practice session with limit or error message
      const updatedSession = await PracticeSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            [`aiResponse.questionResponse.${current}.feedback`]: feedback,
            [`aiResponse.questionResponse.${current}.resources`]: resources,
            [`aiResponse.questionResponse.${current}.followUps`]: followUps,
            [`aiResponse.questionResponse.${current}.questionId`]: question._id,
          },
        },
        {new:true}
      )

      console.log({feedback, resources})

    }catch(feedbackError){
      console.log({feedbackError});
      const updatedSession = await PracticeSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            [`aiResponse.questionResponse.${current}.feedback`]: `SAAAAWWWWWYYY :(` +'\n\n\n'+ `${feedbackError.message}`,
            [`aiResponse.questionResponse.${current}.resources`]: [],
            [`aiResponse.questionResponse.${current}.questionId`]: question._id,
          },
        },
        {new:true}
      )
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { tokens: 1}
        },
        {new:true}
      )
      // res.status(400).json({message: feedbackError.message})
    }
  },
}