#!/usr/bin/env node
/**
 * Icon Generator Script
 * 
 * This script generates PNG icons from the logo.svg file.
 * 
 * Prerequisites: Install sharp
 *   npm install sharp --save-dev
 * 
 * Usage:
 *   node scripts/generate-icons.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LOGO_PATH = path.join(PUBLIC_DIR, 'logo.svg');

const ICON_SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('🎨 Generating icons from logo.svg...\n');

  // Check if logo exists
  if (!fs.existsSync(LOGO_PATH)) {
    console.error('❌ Error: logo.svg not found in public directory');
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(LOGO_PATH);

  for (const icon of ICON_SIZES) {
    try {
      await sharp(svgBuffer)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 254, g: 253, b: 251, alpha: 0 }
        })
        .png()
        .toFile(path.join(PUBLIC_DIR, icon.name));
      
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }

  // Generate favicon.ico (using 32x32)
  try {
    await sharp(svgBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 254, g: 253, b: 251, alpha: 0 }
      })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
    
    console.log(`✅ Generated favicon.png (32x32)`);
  } catch (error) {
    console.error(`❌ Failed to generate favicon.png:`, error.message);
  }

  console.log('\n🎉 Icon generation complete!');
  console.log('\nNote: For favicon.ico, you can use an online converter or the following command if you have ImageMagick:');
  console.log('  convert public/favicon.png public/favicon.ico');
}

generateIcons().catch(console.error);

