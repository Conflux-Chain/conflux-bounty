// console.log('Loading function ...');
// eslint-disable-next-line
const OSS = require('ali-oss');
const config = require('./config');

function removeUid(str) {
  return str.replace(/\(\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\)$/, '');
}

module.exports.handler = (eventBuf, ctx, callback) => {
  // console.log('Received event:', eventBuf.toString());
  const event = JSON.parse(eventBuf);
  const ossEvent = event.events[0];

  const clientOrigin = new OSS({
    region: config.distBucket.region,
    accessKeyId: process.env.adminKey,
    accessKeySecret: process.env.adminSecret,
    bucket: ossEvent.oss.bucket.name,
  });

  const clientDist = new OSS({
    region: config.distBucket.region,
    accessKeyId: process.env.adminKey,
    accessKeySecret: process.env.adminSecret,
    bucket: process.env.distBucket || config.distBucket.name,
  });

  // bounty/aa.txt(xxx-xxxxx-xxx)
  const fileKey = ossEvent.oss.object.key;
  // Get object
  // console.log('Getting object: ', fileKey);

  clientOrigin
    .getStream(fileKey)
    .then(result => {
      const fileGetStream = result.stream;
      // console.log(result.res)

      const md5 = result.res.headers['content-md5'];
      const md5hex = Buffer.from(md5, 'base64').toString('hex');

      let fileName = fileKey;
      fileName = fileKey.replace(/^(bounty|img)\//, '');
      fileName = removeUid(fileName);

      let filePrefix;
      if (fileKey.match(/^img\//)) {
        filePrefix = 'img';
      } else {
        filePrefix = 'bounty';
      }

      const saveKey = `${filePrefix}/${md5hex}/${fileName}`;
      const opts = {};
      if (filePrefix === 'bounty') {
        if (fileName.match(/(\.jpeg|\.jpg|\.png|\.gif)$/i) === false) {
          opts.headers = {
            'Content-Disposition': `attachment; filename=${encodeURIComponent(fileName)}`,
          };
        }
      }
      // console.log(saveKey);
      clientDist.putStream(saveKey, fileGetStream, opts).then(result1 => {
        // console.log(result1);
        callback(null, result1);
      });
    })
    .catch(e => {
      callback(e);
    });
};
