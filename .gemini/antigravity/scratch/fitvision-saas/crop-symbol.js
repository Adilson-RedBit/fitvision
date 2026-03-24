const sharp = require('sharp');

sharp('public/fitvision-logo-eye.png')
  .extract({ left: 20, top: 100, width: 600, height: 320 })
  .trim()
  .toFile('public/fitvision-logo-symbol.png')
  .then(info => {
    console.log('Extracted successfully!', info);
  })
  .catch(err => {
    console.error('Error extracting:', err);
  });
