let configuredEnv;

const loadDevEnv = () => configuredEnv = require('../env.json');
const loadProdEnv = () => configuredEnv = require('../env.prod.json');

if (process.env.NODE_ENV === 'production') {
  console.log('Loading production environment configuration because process.env.NODE_ENV === "production"');
  loadProdEnv();
} else {
  try {
    console.log('Loading development environment configuration from env.json');
    loadDevEnv();
  } catch(er) {
    console.log('Loading production environment configuration because' + er.message);
    loadProdEnv();
  }
}

const env = {
  NODE_ENV: (process.env.NODE_ENV || "development"),
  PORT: (process.env.PORT || 3033),
  NODE_PATH: './src/bettermask',
  ...configuredEnv,
};

console.log('Configured environment:');
console.log(env);

module.exports = env;
