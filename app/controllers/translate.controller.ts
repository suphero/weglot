import { createHash } from 'crypto';
import axios from 'axios';

import Translate, { ITranslateInput } from '../models/translate.model';
import Glossary, { IGlossary } from '../models/glossary.model';
import config from '../config';

// TODO: refactor
exports.translate = async (req: any, res: any) => {
  var api_key: string = req.query.api_key;
  var body: translateRequest = req.body;
  var l_from = body.l_from;
  var l_to = body.l_to;
  var bot = body.bot;
  var title = body.title;
  var request_url = body.request_url;
  var words = body.words;
  var from_words = words.map(w => w.w);
  var to_words: tempTranslateObject[] = [];
  var new_words: ITranslateInput[] = [];
  var tr_froms: tempTranslateObject[] = [];
  var i = 0;

  var existingTranslations = await Translate.find({
    api_key,
    l_from,
    l_to
  });
  from_words.forEach(t_from => {
    if (t_from.length > 0) {
      var hash = hashText(t_from);
      const result = existingTranslations.find(t => t.hash === hash);
      if (result) {
        to_words.push({i, w: result.t_to});
      } else {
        tr_froms.push({i, w: t_from})
      }
    } else {
      to_words.push({i, w: t_from});
    }

    i++;
  });

  if (tr_froms.length > 0) {
    var existingGlossaries = await Glossary.find({
      api_key,
      l_from,
      l_to
    });
    var tr_froms_w = tr_froms.map(t => t.w);
    tr_froms_w = encodeGlossary(tr_froms_w, existingGlossaries);
    var tr_to = await autoTranslate({l_from, l_to, words: tr_froms_w});
    var tr_to_texts = tr_to.text;
    tr_to_texts = decodeGlossary(tr_to_texts, existingGlossaries);

    var i = 0;
    tr_froms.forEach(tr_from => {
      var t_from = tr_from.w;
      var t_to = tr_to_texts[i];
      to_words.push({i: tr_from.i, w: t_to});
      var new_word: ITranslateInput = {
        api_key,
        l_from,
        l_to,
        hash: hashText(t_from),
        t_from,
        t_to,
        valid: false
      };
      new_words.push(new_word);
      i++;
    });
  }

  await Translate.insertMany(new_words);
  to_words = to_words.sort((t1, t2) => t1.i > t2.i ? 1 : -1);
  var mapped_to_words = to_words.map(t => t.w);

  res.json({
    l_from,
    l_to,
    bot,
    title,
    request_url,
    from_words,
    to_words: mapped_to_words
  })
}

function encodeGlossary(words: string[], glossaries: IGlossary[]): string[] {
  var result: string[] = [];
  words.forEach(word => {
    glossaries.forEach(glossary => {
      word = replaceAll(word, glossary.t_from, glossary._id);
    });
    result.push(word);
  });
  return result;
}

function decodeGlossary(words: string[], glossaries: IGlossary[]): string[] {
  var result: string[] = [];
  words.forEach(word => {
    glossaries.forEach(glossary => {
      word = replaceAll(word, glossary._id, glossary.t_to);
    });
    result.push(word);
  });
  return result;
}

function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str: string): string {
  return str.toString().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

exports.batchTranslate = async (req: any, res: any) => {
  var l_from = 'en';
  var l_to = 'tr';
  var missingTranslations = await Translate.find({ valid: false, l_from, l_to });
  var tr_from = missingTranslations.map(t => t.t_from);
  if (tr_from.length <= 0) return res.json(true);
  var tr_to = await autoTranslate({l_from, l_to, words: tr_from});
  var i = 0;
  missingTranslations.forEach(missing => {
    missing.t_to = tr_to.text[i];
    i++;
  });
  // TODO: performance
  missingTranslations.forEach(async missing => {
    await Translate.update({ _id: missing._id }, { t_to: missing.t_to });
  });

  res.json(true);
}

function hashText(input: string): string {
  return createHash('sha1').update(input).digest('base64');
}

async function autoTranslate(request: autoTranslateRequest): Promise<autoTranslateResult> {
  var texts = request.words.join('&text=');
  texts = `text=${texts}`

  const url = `${config.translateApiUrl}?key=${config.translateApiKey}&lang=${request.l_from}-${request.l_to}&format=html`;
  const r = await axios.post(url, texts);
  return r.data;
}

interface translateRequest {
  l_from: string;
  l_to: string;
  bot: number;
  title: string;
  request_url: string;
  words: translateRequestWord[]
}

interface translateRequestWord {
  w: string;
  t: number;
}

interface tempTranslateObject {
  i: number,
  w: string
}

interface autoTranslateRequest {
  l_from: string,
  l_to: string,
  words: string[]
}

interface autoTranslateResult {
  code: number,
  lang: string,
  text: string[]
}