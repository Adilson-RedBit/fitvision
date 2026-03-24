const sharp = require('sharp');
sharp('public/fitvision-logo-symbol.png').raw().toBuffer((err, data, info) => {
  if (err) throw err;
  console.log('RGB:', data[0], data[1], data[2]);
});
