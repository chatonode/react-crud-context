// eslint.config.js
// Modern ESLint flat config format for ESLint 9.26.0+

import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';

// Using export default instead of module.exports
export default [
  js.configs.recommended,
  // Base configuration for all files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,                 // Allow modern ECMAScript features
      sourceType: 'module',              // Enable import/export
      parser: tsParser,                  // Use TS parser for .ts/.tsx files
      parserOptions: {
        ecmaFeatures: {
          jsx: true                      // Enable JSX parsing
        }
      },
      globals: {
        // Browser globals (equivalent to env.browser: true)
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,                // TS-specific linting
      'react': reactPlugin,                          // React-specific linting
    },
    settings: {
      react: {
        version: 'detect'                // Auto-detect React version from installed deps
      }
    },
    rules: {
      // ESLint recommended rules
      ...tsPlugin.configs.recommended.rules,
      
      // React recommended rules
      ...reactPlugin.configs.recommended.rules,
      
      // Customize or tighten specific rules as needed:
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Allow unused vars with _ prefix
      'react/prop-types': 'off',           // Using TypeScript for props validation
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and console.error
      // Removed: 'import/no-default-export': 'error'  // This requires eslint-plugin-import
    },
  },
  
  // Test file configuration
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    // Added special environment setting for test files
    languageOptions: {
      globals: {
        // Jest globals like describe, test, expect, etc.
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    }
  }
];