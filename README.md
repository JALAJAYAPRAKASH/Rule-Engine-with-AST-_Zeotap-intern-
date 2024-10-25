# Rule Engine with AST

A rule engine with Abstract Syntax Trees (AST) is a powerful system for defining, managing, and executing complex business rules. It uses ASTs to represent rules as structured, hierarchical data, allowing for efficient parsing, evaluation, and modification of rules. This approach enables dynamic rule creation, combination, and execution, making it ideal for applications that require flexible decision-making logic, such as eligibility checks, pricing calculations, or compliance verification.

# Database schema
* Operator:
```
{
  "type": "operator",
  "left": Node,
  "right": Node,
  "value": string ("AND" or "OR")
}
```
* Operand(leaf node):
```
{
  "type": "operand",
  "left": null,
  "right": null,
  "value": string (e.g. "Salary>50000")
}
```
* Rule:
```
{
  "name": string,
  "description": string,
  "ruleString": string(e.g. "(age > 30 AND department = 'Marketing')"),
  "ast": Node,
  "createdAt": date,
  "updatedAt": date,
 }
```
# Usage
1. Run git clone in terminal

[[ git clone https://github.com/JALAJAYAPRAKASH/RuleEngine_ATS.git](https://github.com/JALAJAYAPRAKASH/Rule-Engine-with-AST-_Zeotap-intern-)]
 
Run following in terminal
``` npm install ```
```npm start```
```npm run dev```
 
