const pngToIco = require('png-to-ico');
const fs = require('fs');

async function convertIcon() {
    try {
        console.log('Converting icon.png to icon.ico...');
        const buf = await pngToIco('icon.png');
        fs.writeFileSync('icon.ico', buf);
        console.log('✅ Icon converted successfully!');
    } catch (error) {
        console.error('❌ Error converting icon:', error);
        process.exit(1);
    }
}

convertIcon();
