const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


try {
  execSync('which iconutil', { stdio: 'ignore' });
  console.log('✅ iconutil command found.');
} catch (error) {
  console.error('❌ iconutil command not found. Please make sure you are running this script on macOS.');
  return false;
}

function create(inputImagePath) {
  // 入力画像の存在確認
  if (!fs.existsSync(inputImagePath)) {
    console.error(`❌ Input image ${inputImagePath} does not exist.`);
    return false;
  }

  const inputDir = path.dirname(inputImagePath);
  const iconsetDir = path.join(inputDir, 'icons.iconset');

  // icons.iconset ディレクトリを作成
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir);
    console.info(`✅ ${iconsetDir} directory has been created.`);
  }

  // 各サイズのアイコンを生成
  function generateIcon(size, scale = 1) {
    const outputName = `icon_${size}x${size}${scale > 1 ? `@${scale}x` : ''}.png`;
    execSync(`sips -z ${size * scale} ${size * scale} ${inputImagePath} --out ${path.join(iconsetDir, outputName)}`);
  }

  generateIcon(16);
  generateIcon(16, 2);
  generateIcon(32);
  generateIcon(32, 2);
  generateIcon(128);
  generateIcon(128, 2);
  generateIcon(256);
  generateIcon(256, 2);
  generateIcon(512);
  generateIcon(512, 2);

  // iconutil を使用して .icns ファイルを生成
  const icnsFile = path.join(inputDir, 'icon.icns');
  execSync(`iconutil -c icns ${iconsetDir} -o ${icnsFile}`);

  console.log(`✅ ${icnsFile} が生成されました。`);
}

module.exports = create;

