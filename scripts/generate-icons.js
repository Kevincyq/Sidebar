#!/usr/bin/env node

/**
 * 生成 PWA 图标脚本
 * 将 SVG 图标转换为所需的 PNG 格式
 * 
 * 使用方法: node scripts/generate-icons.js
 * 或: npm run generate-icons
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  try {
    // 尝试使用 sharp（如果已安装）
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.error('❌ 错误: 需要安装 sharp 库');
      console.log('\n请运行以下命令安装:');
      console.log('  npm install --save-dev sharp');
      console.log('\n或者使用在线工具:');
      console.log('  1. 打开 public/generate-icons.html');
      console.log('  2. 点击按钮下载图标');
      process.exit(1);
    }

    const publicDir = path.join(__dirname, '..', 'public');
    const svgPath = path.join(publicDir, 'icon.svg');
    const icon192Path = path.join(publicDir, 'icon-192.png');
    const icon512Path = path.join(publicDir, 'icon-512.png');

    // 检查 SVG 文件是否存在
    if (!fs.existsSync(svgPath)) {
      console.error(`❌ 错误: 找不到 ${svgPath}`);
      process.exit(1);
    }

    console.log('🔄 正在生成图标...');

    // 生成 192x192 图标
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(icon192Path);
    console.log('✅ 已生成 icon-192.png');

    // 生成 512x512 图标
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(icon512Path);
    console.log('✅ 已生成 icon-512.png');

    console.log('\n🎉 图标生成完成！');
    console.log('文件已保存到 public/ 目录');
  } catch (error) {
    console.error('❌ 生成图标时出错:', error.message);
    process.exit(1);
  }
}

generateIcons();

