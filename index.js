const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function create(inputImagePath) {
  const inputDir = path.dirname(inputImagePath);
  const iconsetDir = path.join(inputDir, 'icons.iconset');

  // icons.iconset ディレクトリを作成
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir);
  }

  // 必要なサイズのアイコンを生成
  const sizes = [16, 32, 64, 128, 256, 512, 1024];
  sizes.forEach(size => {
    const outputFile = path.join(iconsetDir, `icon_${size}x${size}.png`);
    execSync(`sips -z ${size} ${size} ${inputImagePath} --out ${outputFile}`);
    
    if (size <= 512) {
      const outputFile2x = path.join(iconsetDir, `icon_${size/2}x${size/2}@2x.png`);
      fs.copyFileSync(outputFile, outputFile2x);
    }
  });

  // iconutil を使用して .icns ファイルを生成
  const icnsFile = path.join(inputDir, 'icon.icns');
  execSync(`iconutil -c icns ${iconsetDir} -o ${icnsFile}`);

  console.log('Mac アイコンセットが正常に生成されました。');
}

module.exports = create;
