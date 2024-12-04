const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/validate-answer', async (req, res) => {
  try {
    const { question, expectedAnswer } = req.body;
    console.log('Received request:', { question, expectedAnswer });

    // First, get Claude to solve the problem
    const solutionMessage = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      temperature: 0,
      system: "You are a geometry problem solver. Solve the given problem step by step and provide your final answer in the exact same format as the expected answer. Then compare if your answer matches the expected answer exactly.",
      messages: [{
        role: "user",
        content: `Question: ${question}
Expected Answer Format: ${expectedAnswer}
Please:
1. Solve this problem step by step
2. Provide your final answer in the EXACT same format as the expected answer
3. Compare your answer with the expected answer (${expectedAnswer})
4. Respond with:
   Solution: [your step by step solution]
   Your Answer: [your answer in the expected format]
   Matches Expected Answer: [true/false]`
      }]
    });

    // Get the response content
    const responseContent = solutionMessage.content[0].text;
    console.log('API Full Response:', responseContent);

    // Extract if the answer matches
    const isCorrect = responseContent.toLowerCase().includes('matches expected answer: true');

    // Extract the solution for feedback
    const solution = responseContent.split('Solution:')[1]?.split('Your Answer:')[0]?.trim() || '';
    const claudeAnswer = responseContent.split('Your Answer:')[1]?.split('Matches Expected Answer:')[0]?.trim() || '';

    res.json({
      isCorrect,
      feedback: isCorrect 
        ? "Correct! Well done!" 
        : `Incorrect. The solution is:\n${solution}\nExpected: ${expectedAnswer}, Got: ${claudeAnswer}`,
      solution: solution,
      claudeAnswer: claudeAnswer
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to validate answer', 
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});