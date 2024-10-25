import express from 'express';
import mongoose from 'mongoose';
import { Rule } from './models/Rule';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/rule_engine', { useNewUrlParser: true, useUnifiedTopology: true });

// Helper function to create AST from rule string
function createAst(ruleString: string): any {
  // This is a simplified implementation. In a real-world scenario, you'd use a proper parser.
  const tokens = ruleString.split(' ');
  const stack = [];

  for (let token of tokens) {
    if (token === 'AND' || token === 'OR') {
      const right = stack.pop();
      const left = stack.pop();
      stack.push({ type: 'operator', operator: token, left, right });
    } else if (token === '>' || token === '<' || token === '=' || token === '>=' || token === '<=') {
      const value = stack.pop();
      const field = stack.pop();
      stack.push({ type: 'operand', operator: token, field, value });
    } else {
      stack.push(token);
    }
  }

  return stack[0];
}

// Create a new rule
app.post('/api/rules', async (req, res) => {
  try {
    const { name, description, ruleString } = req.body;
    const ast = createAst(ruleString);
    const rule = new Rule({ name, description, ast });
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all rules
app.get('/api/rules', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Combine rules
app.post('/api/rules/combine', async (req, res) => {
  try {
    const { ruleIds } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    const combinedAst = {
      type: 'operator',
      operator: 'AND',
      left: rules[0].ast,
      right: rules[1].ast,
    };
    for (let i = 2; i < rules.length; i++) {
      combinedAst = {
        type: 'operator',
        operator: 'AND',
        left: combinedAst,
        right: rules[i].ast,
      };
    }
    res.json(combinedAst);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Evaluate rule
app.post('/api/rules/evaluate', (req, res) => {
  try {
    const { ast, data } = req.body;
    const result = evaluateAst(ast, data);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function evaluateAst(node: any, data: any): boolean {
  if (node.type === 'operator') {
    const left = evaluateAst(node.left, data);
    const right = evaluateAst(node.right, data);
    return node.operator === 'AND' ? left && right : left || right;
  } else if (node.type === 'operand') {
    const fieldValue = data[node.field];
    switch (node.operator) {
      case '>': return fieldValue > node.value;
      case '<': return fieldValue < node.value;
      case '=': return fieldValue === node.value;
      case '>=': return fieldValue >= node.value;
      case '<=': return fieldValue <= node.value;
      default: throw new Error(`Unknown operator: ${node.operator}`);
    }
  }
  throw new Error(`Invalid node type: ${node.type}`);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));