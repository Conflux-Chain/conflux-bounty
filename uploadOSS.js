const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

let ossCfg = JSON.parse(process.env.OSS_CFG);
if (typeof ossCfg === 'string') {
  ossCfg = { ...JSON.parse(ossCfg) };
}
/* eg:
export OSS_CFG=$(cat <<EOF
{
	"accessKeyId": "LTAIf1is0L1Eil4F",
	"accessKeySecret": "Ac7mB405j33q2JaNotxbe6Kbra76r1",
	"bucket": "bounty-static-test",
	"region": "oss-cn-beijing"
}
EOF
)
*/

const clientCfg = {
  accessKeyId: 'LTAIf1is0L1Eil4F',
  accessKeySecret: 'Ac7mB405j33q2JaNotxbe6Kbra76r1',
  bucket: 'bounty-static-test',
  region: 'oss-cn-beijing',
  ...ossCfg,
};
console.log(clientCfg);

const ossClient = new OSS(clientCfg);
const basePath = path.resolve(__dirname, './dist');

async function uploadFolder(folderPath) {
  const dirList = fs.readdirSync(folderPath);

  for (let i = 0; i < dirList.length; i += 1) {
    const fileName = dirList[i];
    const filePath = path.resolve(folderPath, fileName);
    const fsStat = fs.statSync(filePath);
    if (fsStat.isDirectory()) {
      uploadFolder(filePath);
    } else {
      const fileKey = filePath.replace(basePath, '');
      const opts = {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
      // eslint-disable-next-line no-await-in-loop
      const result = await ossClient.put(fileKey, fs.createReadStream(filePath), opts);
      console.log(`upload ${fileKey} done`);
      if (result.res.status !== 200) {
        throw new Error('upload Failed');
      }
    }
  }
}

uploadFolder(basePath);
