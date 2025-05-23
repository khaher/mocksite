const http = require('http');
const https = require('https');
const port = process.env.PORT || 3000;

const TARGET_URLS = {
   'mocksite-nine.vercel.app': 'https://glad-shape-304011.framer.app/',
   default: 'https://glad-shape-304011.framer.app/', // Default URL if no match found
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
            // Inject script to hide Framer badge
            const script = `
               <script>
                  document.addEventListener('DOMContentLoaded', function() {
                     var style = document.createElement('style');
                     style.textContent = '#__framer-badge-container { display: none !important; }';
                     document.head.appendChild(style);
                  });
               </script>
            `;
            
            // Inject the script at the end of the body
            const modifiedHtml = data.replace('</body>', script + '</body>');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedHtml);
         });
      })
      .on('error', (error) => {
         res.writeHead(500, { 'Content-Type': 'text/plain' });
         res.end(`Error fetching content: ${error.message}`);
      });
});

server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
   //a simple comment
});