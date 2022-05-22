require("env-cmd")

const { PORT, EMAIL, EMAIL_PASSWORD, MONGODB_URL, JWT_SECRET, BCRYPT_SALT } =
  process.env;

const requiredCredentials = [
  "EMAIL",
  "EMAIL_PASSWORD",
  "MONGODB_URL",
  "JWT_SECRET",
  "BCRYPT_SALT",
];

for(const credential in requiredCredentials){
  if(process.env[credential] === undefined){
    console.log(`Missing required credential ${credential}`)
    process.exit(1)
  }
}

module.exports = {
  PORT,
  EMAIL,
  EMAIL_PASSWORD,
  MONGODB_URL,
  JWT_SECRET,
  BCRYPT_SALT,
};