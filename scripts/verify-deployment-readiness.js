#!/usr/bin/env node

/**
 * Deployment Readiness Verification Script
 * Checks if the application is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying deployment readiness for Easy Lawn Care...\n');

const checks = [];
let hasErrors = false;

// Helper functions
function checkExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  checks.push({
    name: description,
    status: exists ? 'PASS' : 'FAIL',
    details: exists ? `Found: ${filePath}` : `Missing: ${filePath}`
  });
  if (!exists) hasErrors = true;
  return exists;
}

function checkPackageJson() {
  const packagePath = 'package.json';
  if (!checkExists(packagePath, 'package.json exists')) return;

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['build', 'start', 'dev'];
    requiredScripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        checks.push({
          name: `Script: ${script}`,
          status: 'PASS',
          details: `Found: ${pkg.scripts[script]}`
        });
      } else {
        checks.push({
          name: `Script: ${script}`,
          status: 'FAIL',
          details: `Missing required script: ${script}`
        });
        hasErrors = true;
      }
    });

    // Check key dependencies
    const requiredDeps = ['next', 'react', '@prisma/client', '@clerk/nextjs', 'stripe'];
    requiredDeps.forEach(dep => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        checks.push({
          name: `Dependency: ${dep}`,
          status: 'PASS',
          details: `Version: ${pkg.dependencies[dep]}`
        });
      } else {
        checks.push({
          name: `Dependency: ${dep}`,
          status: 'WARN',
          details: `Missing dependency: ${dep}`
        });
      }
    });

  } catch (error) {
    checks.push({
      name: 'package.json parsing',
      status: 'FAIL',
      details: `Error parsing package.json: ${error.message}`
    });
    hasErrors = true;
  }
}

function checkConfigFiles() {
  // Check essential config files
  checkExists('next.config.ts', 'Next.js config file');
  checkExists('vercel.json', 'Vercel configuration');
  checkExists('.env.example', 'Environment variables template');
  checkExists('prisma/schema.prisma', 'Prisma schema');
  
  // Check if .env.local exists (for local development)
  const hasEnvLocal = fs.existsSync('.env.local');
  checks.push({
    name: 'Local environment file',
    status: hasEnvLocal ? 'PASS' : 'INFO',
    details: hasEnvLocal ? 'Found .env.local' : 'No .env.local (normal for deployment)'
  });
}

function checkGitignore() {
  if (!checkExists('.gitignore', '.gitignore file')) return;

  try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const requiredEntries = ['.env', 'node_modules', '.next'];
    
    requiredEntries.forEach(entry => {
      if (gitignore.includes(entry)) {
        checks.push({
          name: `Gitignore: ${entry}`,
          status: 'PASS',
          details: `${entry} is properly ignored`
        });
      } else {
        checks.push({
          name: `Gitignore: ${entry}`,
          status: 'WARN',
          details: `${entry} should be in .gitignore`
        });
      }
    });
  } catch (error) {
    checks.push({
      name: 'Gitignore parsing',
      status: 'FAIL',
      details: `Error reading .gitignore: ${error.message}`
    });
  }
}

function checkApiRoutes() {
  const apiRoutes = [
    'src/app/api/stripe/webhook/route.ts',
    'src/app/api/stripe/create-checkout/route.ts',
    'src/app/api/bookings/route.ts',
    'src/app/api/addresses/route.ts',
    'src/app/api/services/route.ts'
  ];

  apiRoutes.forEach(route => {
    checkExists(route, `API Route: ${path.basename(path.dirname(route))}`);
  });
}

function checkDocumentation() {
  checkExists('docs/VERCEL_DEPLOYMENT.md', 'Vercel deployment guide');
  checkExists('README.md', 'README file');
}

function checkBuildDirectory() {
  const hasBuildDir = fs.existsSync('.next');
  checks.push({
    name: 'Build directory',
    status: hasBuildDir ? 'INFO' : 'INFO',
    details: hasBuildDir ? '.next directory exists (can be cleaned)' : 'No .next directory (will be created on build)'
  });
}

// Run all checks
console.log('📋 Running deployment readiness checks...\n');

checkConfigFiles();
checkPackageJson();
checkGitignore();
checkApiRoutes();
checkDocumentation();
checkBuildDirectory();

// Display results
console.log('📊 Results:\n');

let passCount = 0;
let warnCount = 0;
let failCount = 0;

checks.forEach(check => {
  const icon = check.status === 'PASS' ? '✅' : 
               check.status === 'WARN' ? '⚠️' : 
               check.status === 'INFO' ? 'ℹ️' : '❌';
  
  console.log(`${icon} ${check.name}: ${check.details}`);
  
  if (check.status === 'PASS') passCount++;
  else if (check.status === 'WARN') warnCount++;
  else if (check.status === 'FAIL') failCount++;
});

console.log('\n📈 Summary:');
console.log(`✅ Passed: ${passCount}`);
console.log(`⚠️ Warnings: ${warnCount}`);
console.log(`❌ Failed: ${failCount}`);

if (hasErrors) {
  console.log('\n❌ Deployment readiness: FAILED');
  console.log('Please fix the failed checks before deploying to Vercel.');
  process.exit(1);
} else if (warnCount > 0) {
  console.log('\n⚠️ Deployment readiness: READY WITH WARNINGS');
  console.log('Your app should deploy successfully, but consider addressing the warnings.');
} else {
  console.log('\n✅ Deployment readiness: READY');
  console.log('Your app is ready for Vercel deployment!');
}

console.log('\n🚀 Next steps:');
console.log('1. Commit and push your code to Git');
console.log('2. Import your project to Vercel');
console.log('3. Configure environment variables in Vercel');
console.log('4. Deploy!');
console.log('\nSee docs/VERCEL_DEPLOYMENT.md for detailed instructions.');
