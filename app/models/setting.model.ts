import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  api_key: String,
  api_key_private: String,
  language_from: String,
  auto_switch: Boolean,
  auto_switch_fallback: String,
  languages: [{
    language_to: String,
    provider: String,
    enabled: Boolean,
    automatic_translation_enabled: Boolean,
    connect_host_destination: String
  }],
  excluded_paths: [{
    type: {
      type: String
    },
    value: String
  }],
  excluded_blocks: [{
    value: String
  }],
  custom_settings: {
    button_style: {
      is_dropdown: Boolean,
      with_flags: Boolean,
      flag_type: String,
      with_name: Boolean,
      full_name: Boolean,
      custom_css: String
    },
    translate_email: Boolean,
    translate_search: Boolean,
    translate_amp: Boolean
  },
  technology_id: Number
});

export default mongoose.model('Setting', SettingSchema);