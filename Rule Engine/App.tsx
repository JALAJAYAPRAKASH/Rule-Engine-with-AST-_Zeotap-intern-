import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Rule {
  _id: string;
  name: string;
  description: string;
  ast: any;
}

export default function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState({ name: '', description: '', ruleString: '' });
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [evaluationData, setEvaluationData] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const response = await fetch('/api/rules');
    const data = await response.json();
    setRules(data);
  };

  const createRule = async () => {
    const response = await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRule),
    });
    if (response.ok) {
      setNewRule({ name: '', description: '', ruleString: '' });
      fetchRules();
    }
  };

  const combineRules = async () => {
    const response = await fetch('/api/rules/combine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleIds: selectedRules }),
    });
    const combinedAst = await response.json();
    console.log('Combined AST:', combinedAst);
  };

  const evaluateRule = async () => {
    const response = await fetch('/api/rules/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ast: rules.find(r => r._id === selectedRules[0])?.ast, data: JSON.parse(evaluationData) }),
    });
    const { result } = await response.json();
    setEvaluationResult(result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rule Engine</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            />
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
            />
            <Label htmlFor="ruleString">Rule String</Label>
            <Textarea
              id="ruleString"
              value={newRule.ruleString}
              onChange={(e) => setNewRule({ ...newRule, ruleString: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createRule}>Create Rule</Button>
        </CardFooter>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Existing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.map((rule) => (
            <div key={rule._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRules.includes(rule._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRules([...selectedRules, rule._id]);
                  } else {
                    setSelectedRules(selectedRules.filter(id => id !== rule._id));
                  }
                }}
              />
              <span>{rule.name}</span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={combineRules}>Combine Selected Rules</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluate Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={evaluationData}
            onChange={(e) => setEvaluationData(e.target.value)}
            placeholder="Enter JSON data for evaluation"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={evaluateRule}>Evaluate</Button>
          {evaluationResult !== null && (
            <div>Result: {evaluationResult ? 'True' : 'False'}</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}