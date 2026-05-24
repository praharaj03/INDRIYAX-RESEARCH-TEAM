const bcrypt = require('bcryptjs');

const password = 'password';
const hash = '$2b$10$Nn/LVbgK3AsxBwlwQchkbeDk0DWkawDBKFWFfb.WLBBB.Go7rbIGW';

bcrypt.compare(password, hash).then(result => {
  console.log('Password matches hash:', result);
  
  // Generate a fresh hash
  bcrypt.hash(password, 10).then(newHash => {
    console.log('New hash:', newHash);
  });
});
