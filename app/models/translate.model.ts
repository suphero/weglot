import mongoose from 'mongoose';

export interface ITranslate extends mongoose.Document {
  api_key: string,
  l_from: string,
  l_to: string,
  hash: string,
  t_from: string,
  t_to: string,
  valid: boolean
}

export interface ITranslateInput {
  api_key: ITranslate['api_key'],
  l_from: ITranslate['l_from'],
  l_to: ITranslate['l_to'],
  hash: ITranslate['hash'],
  t_from: ITranslate['t_from'],
  t_to: ITranslate['t_to'],
  valid: ITranslate['valid']
}

const TranslateSchema = new mongoose.Schema({
  api_key: String,
  l_from: String,
  l_to: String,
  hash: String,
  t_from: String,
  t_to: String,
  valid: Boolean
});

export default mongoose.model<ITranslate>('Translate', TranslateSchema);