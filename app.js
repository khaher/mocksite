const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

const TARGET_URLS = {
   'mocksite-nine.vercel.app': 'https://marrow.com',
   "face.localhost:3000": 'https://dbmci.one',
   'abc.localhost:3000': 'https://medulla.app',
   'xyz.localhost:3000': 'https://my.spline.design/retroglassmaterial-ab6121e0206b06bdb88de5e37566d0c6/',
   'mine.localhost:3000': 'https://medulla.appa',
   default: 'https://playful-predict-101321.framer.app/', // Default URL if no match is found
};

function getTargetUrl(req) {
   const origin = req.headers.origin || req.headers.host;
   console.log(origin);
   if (!origin) return TARGET_URLS.default;

   for (const [domain, url] of Object.entries(TARGET_URLS)) {
      if (origin.includes(domain)) {
         return url;
      }
   }
   return TARGET_URLS.default;
}

const server = http.createServer((req, res) => {
   const targetUrl = getTargetUrl(req);
   const protocol = targetUrl.startsWith('https') ? https : http;

   protocol
      .get(targetUrl, (response) => {
         let data = '';

         response.on('data', (chunk) => {
            data += chunk;
         });

         response.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
         });
      })
      .on('error', (error) => {
         res.writeHead(500, { 'Content-Type': 'text/plain' });
         res.end(`Error fetching content: ${error.message}`);
      });
});

server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
