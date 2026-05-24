const bcrypt = require('bcryptjs');

const password = 'password';
const hashFromEnv = '$2b$10$Z6h1.m45weZNjK0dFUf/ZOZixEkIhxjqwBDt270CNKE6B9mjwpuQm';

console.log('Testing hash from .env.local file:');
console.log('Hash:', hashFromEnv);
console.log('Hash length:', hashFromEnv.length);

bcrypt.compare(password, hashFromEnv).then(result => {
  console.log('Password "password" matches:', result);
  
  if (!result) {
    console.log('\nGenerating new hash...');
    bcrypt.hash(password, 10).then(newHash => {
      console.log('New hash:', newHash);
      console.log('Use this in .env.local:');
      console.log(`ADMIN_PASSWORD_HASH=${newHash}`);
    });
  }
});
