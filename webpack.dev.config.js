const path = require('path');
const merge = require('webpack-merge');
const fs = require('fs');
const commom = require('./webpack.config.js');

function svgRouter(app) {
  app.get('/svgview', (req, res) => {
    const iconFontPath = './src/assets/iconfont';
    const dirBaseIcons = path.resolve(__dirname, iconFontPath);
    const allSvgs = fs.readdirSync(path.resolve(dirBaseIcons)).filter(v => v.endsWith('.svg'));
    res.setHeader('content-type', 'text/html');
    res.write(`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.css"></script>
      <style>
        body { padding: 40px }
        .icon-wrap {
          padding: 20px;
          border: 2px solid teal;
          background: lightsteelblue;
          align-items: center;
          display: flex;
          justify-content: space-around;
        }
        .icon-wrap svg { width: 100px; }
      </style>
      <div class="ui grid">
    `);
    const allPromise = allSvgs.map(svgName => {
      const svgPath = path.resolve(__dirname, iconFontPath, svgName);
      return new Promise(resolve => {
        fs.readFile(svgPath, { encoding: 'utf-8' }, (err, content) => {
          res.write(`
            <div class='five wide column'>
              <div class="icon-wrap">
                <span>${svgName.replace('.svg', '')}</span>
                ${content}
              </div>
            </div>
          `);
          resolve();
        });
      });
    });
    Promise.all(allPromise).then(() => res.end());
  });
}

function cdnRouter(app) {
  app.get('/node_modules/*', (req, res) => {
    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    const filePath = path.resolve(__dirname, `.${req.url}`);
    fs.createReadStream(filePath).pipe(res);
  });
}

module.exports = merge(commom, {
  mode: 'development',
  devtool: 'inline-source-map', // 代码关联显示方式
  devServer: {
    port: 8001,
    contentBase: [path.resolve(__dirname, 'dist')], // 开发服务运行时的文件根目录
    historyApiFallback: true, // spa不跳转,history模式的路由需要true
    compress: false,
    before: app => {
      svgRouter(app);
      cdnRouter(app);
    },
    proxy: {
      '/api': {
        target: process.env.BOUNTY_BACKEND_ENDPOINT || 'http://localhost:7001',
        changeOrigin: true,
        secure: false,
        // target: 'http://bountytest.conflux-chain.org',
        // pathRewrite: { '^/api': '/mock/17/api' },
      },
    },
  },
});
