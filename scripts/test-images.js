// Extract unique Unsplash photo IDs and test them
const fs = require('fs');
const content = fs.readFileSync('scripts/seed-shoes.js', 'utf8');

const urlRegex = /https:\/\/images\.unsplash\.com\/photo-[^\s"',]+/g;
const allUrls = content.match(urlRegex) || [];
const uniqueUrls = [...new Set(allUrls.map(u => u.split('?')[0]))];

console.log(`Found ${allUrls.length} total image refs, ${uniqueUrls.length} unique photo IDs\n`);

(async () => {
  for (const baseUrl of uniqueUrls) {
    const testUrl = baseUrl + '?w=100&q=10';
    try {
      const res = await fetch(testUrl, { method: 'HEAD', redirect: 'follow' });
      const status = res.status;
      const icon = status === 200 ? '✅' : '❌';
      console.log(`${icon} ${status} ${baseUrl.replace('https://images.unsplash.com/', '')}`);
    } catch (err) {
      console.log(`❌ ERR ${baseUrl.replace('https://images.unsplash.com/', '')} - ${err.message}`);
    }
  }
})();
