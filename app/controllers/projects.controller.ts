import Owner from '../models/owner.model';
import Setting from '../models/setting.model';

exports.owner = async (req: any, res: any) => {
  var owner = await getPrivateOwnerDb(req.query.api_key);
  var result = { "succeeded": 1, "answer": owner };
  res.json(result);
};

async function getPrivateOwnerDb(api_key_private: string) {
  return await Owner.findOne({api_key_private});
}

exports.getSettings = async (req: any, res: any) => {
  var setting = await getPrivateSettingsDb(req.query.api_key);
  res.json(setting);
};

async function getPrivateSettingsDb(api_key_private: string) {
  return await Setting.findOne({api_key_private});
}

async function getSettingsDb(api_key: string) {
  return await Setting.findOne({api_key});
}

async function updateSettingsDb(body: any) {
  var api_key_private = body.api_key_private;
  var languages = body.languages.map((l: any) => {return {language_to: l.language_to, provider: null, enabled: l.enabled, automatic_translation_enabled: true, connect_host_destination: null}});
  await Setting.updateOne({
    api_key_private,
  }, {
    language_from: body.language_from,
    auto_switch: body.auto_switch,
    auto_switch_fallback: null,
    translation_engine: 3,
    languages,
    excluded_paths: body.excluded_paths,
    excluded_blocks: body.excluded_blocks,
    custom_settings: body.custom_settings,
    technology_id: 1
  });
}

exports.postSettings = async (req: any, res: any) => {
  var api_key = req.query.api_key;
  await updateSettingsDb(req.body);
  var setting: any = await getPrivateSettingsDb(api_key);
  res.json({api_key: setting.api_key});
}

exports.getCdnSettings = async (req: any, res: any) => {
  var api_key = `wg_${req.params.api_key}`;
  var setting = await getSettingsDb(api_key);
  res.json(setting);
}