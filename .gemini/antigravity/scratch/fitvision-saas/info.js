const sharp = require('sharp');
sharp('public/fitvision-text.png').metadata().then(info => console.log(info)).catch(console.error);
