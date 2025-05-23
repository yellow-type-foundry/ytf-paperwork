# YTF Paperwork Migration to v0.dev

## Migration Steps

1. Create a new project on v0.dev
   - Go to https://v0.dev
   - Sign in with your GitHub account
   - Click "New Project"
   - Name it "ytf-paperwork"

2. Set up the project
   - Upload all font files from `public/fonts` to the v0.dev project's public directory
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
