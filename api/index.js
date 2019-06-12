const express = require('express');
const cors = require('cors');
const multer = require('multer');
const {google} = require('googleapis');
const {uploadToYoutube} = require('./test.js')
const nightcorify = require('./scripts/nightcorify');
const uuid = require('uuid');
const {Storage} = require('@google-cloud/storage');

const upload = multer({ dest: '/tmp/nightcore-inputs/' });

// Configure server;
const app = express();
app.use(cors());
app.use(express.static('./static'));
const port = process.env.PORT || 5000;

app.post('/upload', upload.single('file'), (req,res) => {
  req.setTimeout(1000000);
  const URL = process.env.UPLOAD_PREFIX || '/static/';
  const filename = uuid() + '.mp3';
  const stream = getWriteStream(filename);
  nightcorify(req.file.path, stream);
  stream.on('finish', function() {
    return res.json({
      song: URL + filename,
      image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/80364754-5ccd-4c13-98ab-ad9dbe1ab72b/da73ak1-9f020084-3a4e-49f4-832a-26ff4b49406e.png/v1/fill/w_1192,h_670,q_70,strp/sad_anime_girl_wallpaper_by_aighix_da73ak1-pre.jpg',
    })
  });
});

const getWriteStream = filename => {
  const bucketName = process.env.UPLOAD_BUCKET_NAME;
  if (bucketName) {
    console.log('UPLOAD TO ' + bucketName);
    const storage = new Storage();

    return storage.bucket(bucketName)
      .file(filename)
      .createWriteStream({
        resumable: false,
      });
  }

  const path = './static/' + filename;

  return fs.createWriteStream(path);
}

app.listen(port, () => {
  console.log(`I'm alive on port: ${port}`);
});
