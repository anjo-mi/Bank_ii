import models from "../models/index.js";
const { User, Category, Question, PracticeSession, Usage } = models;

export default {
  limitAI: async (current, userId, sessionId, question) => {
    try {
      const usage = await Usage.findOne({
        month: new Date().toISOString().slice(0, 7),
      });
      const spent = usage
        ? usage.tokenCost + Math.max(0, usage.searches - 5000) * 14000
        : 0;
      if (spent >= 40000000) {
        await PracticeSession.findByIdAndUpdate(sessionId, {
          $set: {
            [`aiResponse.questionResponse.${current}.feedback`]: `The platform's AI feedback has reached its monthly limit. This is to limit the cost of the overall platform, so usage is not specific to a single user. My bad on the inconvenience. Please try again on the 1st.`,
            [`aiResponse.questionResponse.${current}.resources`]: [],
            [`aiResponse.questionResponse.${current}.questionId`]: question._id,
          },
        });
        return false;
      }

      let user = await User.findById(userId);
      const now = Date.now();

      // if its been 12 hours since the last request, give the user 15 tokens
      if (
        !user.tokenReset ||
        Math.abs(+now - +user.tokenReset) > 1000 * 60 * 60 * 12
      ) {
        user = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              tokens: 15,
              tokenReset: now,
            },
          },
          { new: true },
        );
      }

      const updated = await User.findOneAndUpdate(
        {
          _id: userId,
          tokens: { $gt: 0 },
        },
        { $inc: { tokens: -1 } },
        { new: true },
      );

      if (!updated) {
        const updatedSession = await PracticeSession.findByIdAndUpdate(
          sessionId,
          {
            $set: {
              [`aiResponse.questionResponse.${current}.feedback`]: `You have exceeded your rate limit. You get 15 tokens per 12 hours.`,
              [`aiResponse.questionResponse.${current}.resources`]: [],
              [`aiResponse.questionResponse.${current}.questionId`]:
                question._id,
            },
          },
        );
        return false;
      }

      return true;
    } catch (aiLimiterError) {
      console.log({ aiLimiterError });
      const updatedSession = await PracticeSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            [`aiResponse.questionResponse.${current}.feedback`]: `there was an issue obtaining your token count, you have not been charged`,
            [`aiResponse.questionResponse.${current}.resources`]: [],
            [`aiResponse.questionResponse.${current}.questionId`]: question._id,
          },
        },
      );
      return false;
    }
  },
};
