#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load configuration
const configPath = path.resolve(__dirname, '../api-codegen.config.cjs');
const config = require(configPath);

// Configure paths
const BASE_DIR = path.resolve(__dirname, '../src/client/generated');

// Create output directory
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

console.log('🚀 Starting API client generation...');
console.log(`📁 Output directory: ${path.relative(process.cwd(), BASE_DIR)}`);
console.log(`🔧 Found ${config.services.length} services to generate`);

let hasErrors = false;

// Process each service
config.services.forEach((service, index) => {
  console.log(`\n--- Processing service ${index + 1}/${config.services.length}: ${service.name} ---`);
  
  const serviceDir = path.join(BASE_DIR, service.name);
  const clientPath = path.join(serviceDir, 'client');
  
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  try {
    console.log(`🔍 Fetching OpenAPI spec from: ${service.url}`);
    
    // Generate API client using the reliable method
    console.log(`🛠️ Generating client with typescript-fetch`);
    execSync(
      `npx @openapitools/openapi-generator-cli generate -i "${service.url}" -g typescript-fetch -o "${clientPath}"`,
      {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      }
    );
    
    console.log(`✅ Successfully generated ${service.name} API client`);
  } catch (error) {
    console.error(`❌ Failed to generate client for ${service.name}:`);
    console.error(error.message);
    hasErrors = true;
  }
});

// Create index file
try {
  const indexContent = config.services
    .map(service => `export * as ${service.name} from './${service.name}/client';`)
    .join('\n');

  fs.writeFileSync(path.join(BASE_DIR, 'index.ts'), indexContent);
  console.log('\n📁 Created index.ts with all service exports');
} catch (error) {
  console.error('\n❌ Failed to create index file:');
  console.error(error.message);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n⛔ API generation completed with errors');
  process.exit(1);
} else {
  console.log('\n✨ All API clients generated successfully!');
  console.log(`👉 Import using: import { products, sellers, sales } from '@/client/generated';`);
}