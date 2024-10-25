import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  type: { type: String, enum: ['operator', 'operand'], required: true },
  operator: { type: String, enum: ['AND', 'OR', '>', '<', '=', '>=', '<='], required: function() { return this.type === 'operator'; } },
  field: { type: String, required: function() { return this.type === 'operand'; } },
  value: { type: mongoose.Schema.Types.Mixed, required: function() { return this.type === 'operand'; } },
  left: { type: mongoose.Schema.Types.Mixed, ref: 'Node' },
  right: { type: mongoose.Schema.Types.Mixed, ref: 'Node' },
});

const RuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  ast: { type: NodeSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Rule = mongoose.model('Rule', RuleSchema);