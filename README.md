### Table of Contents
- [Guests](#guest-users)
- [Voice-to-Text](#voice-to-text)
- [User Features](#user-features)
- [Building Your Dash](#dash-building)
- [Practice Session](#practice-session)
- [Single Question](#single-question)
- [View Results](#view-results)
- [Store Results](#store-results)
- [Edit Questions](#edit-questions)
- [Add Question](#add-question)
- [Recording](#recording)
- [AI Agent](#ai-agent)
- [User Restraints](#user-restraints)
- [Tech](#tech)
- [Recommended User Flow](#user-flow)
- [Note from the Dev](#dev-note)


## Guest Users
- Quick Access to the 100Devs Bank (*prolly TM*)
- Comprehensive Search Features
   * Match All Categories vs. Match Any Selected
   * Optional Content Keyword Search
      - Working solo or in conjunction with Category Search
   * List All Questions
   * Retrieve a question randomly to practice on your own
   * Applying No Filters effectively selects Match Any with All available Categories and No Keywords

#### Voice To Text
- Due to Browser Restraints:
   - Transcriptions are only available for:
      - Chrome and Edge
   - Firefox and Safari will allow recording, but not SpeechRecognition API

#### Voice To Text (Mobile and Tablet)
Issues: While recording works on these devices. Transcribing is inconsistent. There are 2 recommended approaches:
- Focus on typing out a thoughtful answer, practice your dictation by recording and re-recording audio.
- Record audio, listen to yourself and workshop your own response from the audience's point of view.

> Were you looking for more???
>
> THEN SIGN UP!!!!

## User Features
Immediate Navigation to Personalized User Dashboard
- Hub for User Information
   * Recommended Resources, Completed Sessions, User-Unique Questions
- Settings Toggle
   * Set your Career Path and Level
- Default Question Toggle
   * Are you not a part of 100Devs?
> Pledge Allegiance to Our Cult and Come Back Any Time 😐
>
> Just kidding, all you have to do is:

- Choose to include or exclude the 100Devs Bank (*prolly TM*)


## Dash Building
1st Two Blocks Coincide
   - ### Block 1
   - Resources
      - Provided feedback will often include suggested resources to further your knowledge on a given subject.
      - You can [Store Results](#store-results) in numerous ways.
> 🦗 Crickets 🦗
> 
> You're supposed to ask 'results of what??'
   - ### Block 2
   - Previous Sessions
      - Added by following the process for [Practice Session](#practice-session) or
[Single Question](#single-question).
   - ### Block 3
   - User-Unique Questions
   - 3 Ways to make new questions:
      - [Edit Questions](#edit-questions)
      - [Store Results](#store-results)
         - Saving an answer, feedback or audio file from a [View Results](#view-results) page.
      - [Add Question](#add-question)

# Practice Session
- Choose the topics that you'd like to possibly be covered.
   - Choosing No Parameters Will Equate to Allowing all available questions into the Selection Pool.
- Choose the number of questions you'd like to attempt.
   - You are limited to 10 Questions per Session.
   - No entry or any other invalid entry will default to 7 Questions.
- Submission Will Redirect you to a Briefing Page
   - In event of there being less questions available than what was requested:
      - User is notified here
   - User opts to Proceed or Return to Previous Screen.
- Type or use [Recording](#recording) features to answer Questions.
   - Blank Answers are rejected.
   - Refreshing brings you back to same question.
   - Abandoning a Session will Save Everything that was made, cannot complete later
      - Can access at any time via [View Results](#view-results) strategies.
- This contributes to [Filling Block Two](#block-2)

## Single Question
- After Selecting a specific question (explicitly or randomly):
   - Type or use [Recording](#recording) features to answer Questions.
   - Options to view anything saved from [Store Results](#store-results).
   - Using Previous Answer and Feedback, Users may craft a better answer and submit it for further review.
   - This effectively makes a Single-Question-Practice-Session, and upon loading, redirects you to the [View Results](#view-results) page.
   - This contributes to [Filling Block Two](#block-2)

## View Results
3 Places to View Results

- Post Session
   - After a [Practice Session](#practice-session) or [Single Question](#single-question), you will be directed to a loading page, that, when ready, will bring you to the Results Page.
   - This contributes to [Filling Block Two](#block-2)
- Dashboard
   - Load or Delete Previous Sessions based on a brief description
      - Date Made and Total Questions Stats are provided
- Session History
   - Lists Session Categories and All Covered Questions (truncated)
   - Provides Quick Navigation Links to Load the full results.
- These Pages Each have Options to Save:
   - Answer Text
   - Answer Audio from [Recording](#recording) (if Recorded and Explicitly Stored with Session)
   - [AI Agent](#ai-agent)'s :
      - Feedback on Your Submitted Answer
      - Suggested Resources
      - Potential Follow-Up Questions For Which to Be Prepared


## Store Results
- Follow Any of the Paths to [View Results](#view-results), then save whichever portion you choose.
- Any Question included in a [Practice Session](#practice-session) or [Single Question](#single-question):
   - Answer Can be Edited and Saved to the Question
- Any Question that was **Explicitly** Saved With a [Recording](#recording):
   - Can Play the Recording and Can Save to the Question
- Any Question passed through the [AI Agent](#ai-agent):
   - Feedback may be Saved
   - Resources may be Saved [Filling Block One](#block-1)

## Edit Questions
Use Comprehensive Search Features to Locate a Question
- Quick Delete Option from Search Page
- Select Question to Edit
- Options to View any Saved Feedback or Resources, and Listen to any [Saved Recording](#recording).
- Updated Questions **MUST** have **AT LEAST ONE** category attached to it.
- Updated Questions **MUST** have **SOME CONTENT** associated to it.
- New Categories that are Checked when Update Request is Made
   - Rejected if non-default duplicate.
   - Added as a User-Unique-Category
- "Delete Default Hack"
   - Attempts to Delete Default Questions Will be Met with Resistance
   - *REMEMBER*: You can Remove any 100Devs Bank (*prolly TM*) Specific Questions by Selecting the [User Setting Icon](#user-features) on the Dashboard Page.
   - If a Default Question Does Not Pertain to You
      - Edit it to Content and Categories that Do.
      - Even when entirely different, connection to the default is broken while the updated question exists.
- This contributes to [Filling Block Three](#block-3)
      

## Add Question
- Preload All User and Default Categories
- New Questions **MUST** have **AT LEAST ONE** category attached to it.
- New Questions **MUST** have **SOME CONTENT** associated to it.
- New Categories are Added if Unique


### Recording
- Uses `navigator.mediaDevices` when available (otherwise hide content)
   - Only allows Recording with Explicit Permission
- On start, Voice-To-Text Leveraged Via SpeechRecognition API.
- DEFAULT BEHAVIOR:
   - Audio file is made locally via a blob, while content is transcribed.
   - File **WILL NOT BE STORED** unless the user explicitly checks the box EACH TIME.
   - If opted into, file is sent to AWS Cloud.
   - If not explicitly stored, Audio file is deleted upon navigation.

### AI Agent
- Gemini 2.5
- Responds with JSON Format
   - `{feedback, resources, followups}`
- Prompt:
```
Please, treat this as though you are mentoring someone who is typically an [USER_SELECTED_LEVEL || 'entry'] level / career [USER_SELECTED_POSITION || 'software engineer']. When in an interview they were given the question "[QUESTION]." The person you're mentoring gave the answer, "[USER_PROVIDED_ANSWER]." Remembering to stay positive with critiques, suggest those improvements.
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
   ```
### User Restraints
- Due to Pricing and Funding Limitations:
   - Users are limited to 15 AI calls every 12 Hours
      - **THIS IS SUBJECT TO CHANGE** especially in the wake of traffic
   - PLEASE: Report any Issues Before They are Exposed.

### Tech
- Front-End:
   - JavaScript, TailwindCSS, HTML, CSS, EJS, WebAPIs
- Back-End:
   - Node.js, Express.js, MongoDB, Mongoose
- Authorization:
   - Passport.js
- Services:
   - Gemini 2.5
- Cloud Services
   - AWS S3

### User Flow
1. SIGN UP!!!
   - If you have questions you need added, head to [Add Question](#add-question)
2. Start With a Small [Practice Session](#practice-session)
3. After you [View Your Responses](#view-results)
   - [Store any Relevant](#store-results) Information Provided.
4. Study the feedback and provided resources to further your knowledge and develop your answer.
5. Locate the Questions Individually
6. Update Your Answer Using the Feedback and Resources, and Submit.
7. Save Relevant Follow-Ups from Second Attempt
   - Deepen Initial Answer
   - Prepare for Concepts Previously Unencountered
8. Repeat with New Questions and New Sessions

### Dev Note
Good Luck!!! And May We All ***Break the Bank!!!***

- I would be remiss to not include a ❤️ Letter for 100Devs
   - If you are unfamiliar, Leon Noel teaches a **FREE** course that I **highly** recommend!
      - <https://communitytaught.org/>
      - Look For Us On Discord
      - Give anjomi a shout out!