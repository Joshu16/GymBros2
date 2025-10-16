const fs = require('fs');
const path = require('path');

// Color mapping from custom to standard Tailwind
const colorMap = {
  'bg-dark-950': 'bg-gray-900',
  'bg-dark-900': 'bg-gray-800',
  'bg-dark-800': 'bg-gray-800',
  'bg-dark-750': 'bg-gray-700',
  'bg-dark-700': 'bg-gray-700',
  'bg-dark-600': 'bg-gray-600',
  'bg-dark-500': 'bg-gray-500',
  'bg-dark-400': 'bg-gray-400',
  'bg-dark-300': 'bg-gray-300',
  'bg-dark-200': 'bg-gray-200',
  'bg-dark-100': 'bg-gray-100',
  'bg-dark-50': 'bg-gray-50',
  'text-dark-950': 'text-gray-900',
  'text-dark-900': 'text-gray-800',
  'text-dark-800': 'text-gray-800',
  'text-dark-750': 'text-gray-700',
  'text-dark-700': 'text-gray-700',
  'text-dark-600': 'text-gray-600',
  'text-dark-500': 'text-gray-500',
  'text-dark-400': 'text-gray-400',
  'text-dark-300': 'text-gray-300',
  'text-dark-200': 'text-gray-200',
  'text-dark-100': 'text-gray-100',
  'text-dark-50': 'text-gray-50',
  'border-dark-950': 'border-gray-900',
  'border-dark-900': 'border-gray-800',
  'border-dark-800': 'border-gray-800',
  'border-dark-750': 'border-gray-700',
  'border-dark-700': 'border-gray-700',
  'border-dark-600': 'border-gray-600',
  'border-dark-500': 'border-gray-500',
  'border-dark-400': 'border-gray-400',
  'border-dark-300': 'border-gray-300',
  'border-dark-200': 'border-gray-200',
  'border-dark-100': 'border-gray-100',
  'border-dark-50': 'border-gray-50',
  'text-primary-50': 'text-white',
  'text-primary-100': 'text-gray-100',
  'text-primary-200': 'text-gray-200',
  'text-primary-300': 'text-gray-300',
  'text-primary-400': 'text-gray-400',
  'text-primary-500': 'text-gray-500',
  'text-primary-600': 'text-gray-600',
  'text-primary-700': 'text-gray-700',
  'text-primary-800': 'text-gray-800',
  'text-primary-900': 'text-gray-900',
  'bg-primary-50': 'bg-white',
  'bg-primary-100': 'bg-gray-100',
  'bg-primary-200': 'bg-gray-200',
  'bg-primary-300': 'bg-gray-300',
  'bg-primary-400': 'bg-gray-400',
  'bg-primary-500': 'bg-gray-500',
  'bg-primary-600': 'bg-gray-600',
  'bg-primary-700': 'bg-gray-700',
  'bg-primary-800': 'bg-gray-800',
  'bg-primary-900': 'bg-gray-900',
  'border-primary-50': 'border-white',
  'border-primary-100': 'border-gray-100',
  'border-primary-200': 'border-gray-200',
  'border-primary-300': 'border-gray-300',
  'border-primary-400': 'border-gray-400',
  'border-primary-500': 'border-gray-500',
  'border-primary-600': 'border-gray-600',
  'border-primary-700': 'border-gray-700',
  'border-primary-800': 'border-gray-800',
  'border-primary-900': 'border-gray-900',
};

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    Object.entries(colorMap).forEach(([oldColor, newColor]) => {
      const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
      if (content.includes(oldColor)) {
        content = content.replace(regex, newColor);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      updateFile(filePath);
    }
  });
}

// Update all files in src directory
walkDir('./src');
console.log('Color update complete!');
