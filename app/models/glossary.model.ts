import mongoose from 'mongoose';

export interface IGlossary extends mongoose.Document {
  api_key: string,
  l_from: string,
  l_to: string,
  hash: string,
  t_from: string,
  t_to: string,
  valid: boolean
}

export interface IGlossaryInput {
  api_key: IGlossary['api_key'],
  l_from: IGlossary['l_from'],
  l_to: IGlossary['l_to'],
  t_from: IGlossary['t_from'],
  t_to: IGlossary['t_to'],
}

const GlossarySchema = new mongoose.Schema({
  api_key: String,
  l_from: String,
  l_to: String,
  t_from: String,
  t_to: String,
});

export default mongoose.model<IGlossary>('Glossary', GlossarySchema);