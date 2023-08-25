const express = require('express');
const app = express();

const operators = ['plus', 'minus', 'into', 'by'];

const history = [];

// Define the routes for the server.
app.get('/', (req, res) => {
  // Send a list of the available endpoints as HTML.
  res.send(`
  <h1>Available endpoints</h1>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/history">History</a></li>
    <li><a href="/calculate">Calculate</a></li>
  </ul>
  `);
});

app.get('/history', (req, res) => {
  // Get the last 20 operations from the history.
  const recentHistory = history.slice(-20);

  // Send the history to the client as HTML.
  res.send(`
  <h1>History</h1>
  <table border="1">
    <thead>
      <tr>
        <th>Question</th>
        <th>Answer</th>
      </tr>
    </thead>
    <tbody>
      ${recentHistory.map((operation) => `
        <tr>
          <td>${operation.question}</td>
          <td>${operation.answer}</td>
        </tr>
      `)}
    </tbody>
  </table>`);
});

app.get('/calculate', (req, res) => {
  // Get the expression from the query parameter.
  const expression = req.query.expression;

  // Split the expression into operators and operands.
  const parts = expression.split('/');

  // Calculate the answer to the mathematical expression.
  const answer = calculate(parts);

  // Add the operation to the history.
  history.push({
    question: expression,
    answer: answer
  });

  // Send the answer to the client.
  res.send({
    question: expression,
    answer: answer
  });
});

function calculate(parts) {
  // Check if the expression is valid.
  if (parts.length % 2 !== 1) {
    throw new Error('Invalid expression');
  }

  // Calculate the answer.
  let answer = Number(parts[0]);
  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i];
    const operand = Number(parts[i + 1]);

    // Check if the operator is valid.
    if (!operators.includes(operator)) {
      throw new Error(`Invalid operator: ${operator}`);
    }

    // Perform the calculation based on the operator.
    switch (operator) {
      case 'plus':
        answer += operand;
        break;
      case 'minus':
        answer -= operand;
        break;
      case 'into':
        answer *= operand;
        break;
      case 'by':
        answer /= operand;
        break;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }

  return answer;
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
