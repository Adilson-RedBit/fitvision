const sharp = require('sharp');

sharp('public/fitvision-logo-eye.png')
  .extract({ left: 100, top: 120, width: 440, height: 400 })
  .toFile('public/fitvision-logo-eye-cropped.png')
  .then(info => {
    console.log('Extracted successfully!', info);
  })
  .catch(err => {
    console.error('Error extracting:', err);
  });
