export default {
  dbUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/weglot',
  port: process.env.PORT || 8080,
  weglotApiUrl: 'https://api.weglot.com',
  translateApiUrl: process.env.YANDEX_API_URL || 'https://translate.yandex.net/api/v1.5/tr.json/translate',
  translateApiKey: process.env.YANDEX_API_KEY
}
