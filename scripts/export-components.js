const fs = require('fs');
const path = require('path');

// Function to read and process a component file
function processComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract component name
  const componentName = path.basename(filePath, '.tsx');
  
  // Create v0.dev compatible format
  return {
    name: componentName,
    code: content,
    type: 'component'
  };
}

// Function to read and process a page file
function processPage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract page name
  const pageName = path.basename(filePath, '.tsx');
  
  // Create v0.dev compatible format
  return {
    name: pageName,
    code: content,
    type: 'page'
  };
}

// Function to copy font files
function copyFonts() {
  const fontsDir = path.join(__dirname, '../public/fonts');
  const exportFontsDir = path.join(__dirname, '../v0-export/public/fonts');
  
  if (!fs.existsSync(exportFontsDir)) {
    fs.mkdirSync(exportFontsDir, { recursive: true });
  }
  
  const fontFiles = fs.readdirSync(fontsDir);
  fontFiles.forEach(file => {
    fs.copyFileSync(
      path.join(fontsDir, file),
      path.join(exportFontsDir, file)
    );
  });
  
  console.log('Font files copied successfully!');
}

// Function to export configuration files
function exportConfigs() {
  const configs = [
    'package.json',
    'next.config.mjs',
    'tailwind.config.js',
    'postcss.config.mjs',
    'tsconfig.json',
    'components.json'
  ];
  
  const exportDir = path.join(__dirname, '../v0-export');
  
  configs.forEach(config => {
    const sourcePath = path.join(__dirname, '..', config);
    const targetPath = path.join(exportDir, config);
    fs.copyFileSync(sourcePath, targetPath);
  });
  
  console.log('Configuration files exported successfully!');
}

// Function to export styles
function exportStyles() {
  const stylesDir = path.join(__dirname, '../styles');
  const exportStylesDir = path.join(__dirname, '../v0-export/styles');
  
  if (!fs.existsSync(exportStylesDir)) {
    fs.mkdirSync(exportStylesDir, { recursive: true });
  }
  
  const styleFiles = fs.readdirSync(stylesDir);
  styleFiles.forEach(file => {
    fs.copyFileSync(
      path.join(stylesDir, file),
      path.join(exportStylesDir, file)
    );
  });
  
  console.log('Style files exported successfully!');
}

// Main export function
function exportToV0() {
  const components = [];
  const pages = [];
  
  // Create export directory
  const exportDir = path.join(__dirname, '../v0-export');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }
  
  // Process components
  const componentsDir = path.join(__dirname, '../components');
  const componentFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.'));
    
  componentFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    components.push(processComponent(filePath));
  });
  
  // Process pages
  const pagesDir = path.join(__dirname, '../app');
  const pageFiles = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.'));
    
  pageFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    pages.push(processPage(filePath));
  });
  
  // Write components to file
  fs.writeFileSync(
    path.join(exportDir, 'components.json'),
    JSON.stringify(components, null, 2)
  );
  
  // Write pages to file
  fs.writeFileSync(
    path.join(exportDir, 'pages.json'),
    JSON.stringify(pages, null, 2)
  );
  
  // Copy fonts
  copyFonts();
  
  // Export configs
  exportConfigs();
  
  // Export styles
  exportStyles();
  
  // Create README with migration instructions
  const readmeContent = `# YTF Paperwork Migration to v0.dev

## Migration Steps

1. Create a new project on v0.dev
   - Go to https://v0.dev
   - Sign in with your GitHub account
   - Click "New Project"
   - Name it "ytf-paperwork"

2. Set up the project
   - Upload all font files from \`public/fonts\` to the v0.dev project's public directory
   - Copy the configuration files from the root directory
   - Install dependencies from package.json

3. Import Components and Pages
   - Use the components.json and pages.json files to import your components and pages
   - Make sure to maintain the same directory structure

4. Configure Environment Variables
   - Set up any required environment variables in the v0.dev project settings

5. Test the Application
   - Verify that all components work as expected
   - Test the PDF generation functionality
   - Check that all fonts are loading correctly

## Required Dependencies

See package.json for the complete list of dependencies.

## Font Configuration

The project uses the following fonts:
- YTF Grand 123
- YTF VangMono
- YTF Oldman

Make sure all font files are properly uploaded to the public/fonts directory.

## Notes

- The project uses shadcn/ui components which are compatible with v0.dev
- Make sure to maintain the same directory structure for components and pages
- Test thoroughly after migration to ensure all functionality works as expected
`;
  
  fs.writeFileSync(path.join(exportDir, 'MIGRATION.md'), readmeContent);
  
  console.log('Export completed successfully!');
  console.log(`Components exported: ${components.length}`);
  console.log(`Pages exported: ${pages.length}`);
  console.log('\nMigration instructions have been saved to MIGRATION.md');
}

exportToV0(); 