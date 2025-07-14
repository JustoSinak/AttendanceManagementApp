// Simple test to verify database functionality
console.log('Testing database setup...');

// Test if expo-sqlite is available
try {
  const SQLite = require('expo-sqlite');
  console.log('✓ expo-sqlite module loaded successfully');
} catch (error) {
  console.log('✗ Failed to load expo-sqlite:', error.message);
}

// Test if other dependencies are available
try {
  const React = require('react');
  console.log('✓ React loaded successfully');
} catch (error) {
  console.log('✗ Failed to load React:', error.message);
}

try {
  const Navigation = require('@react-navigation/native');
  console.log('✓ React Navigation loaded successfully');
} catch (error) {
  console.log('✗ Failed to load React Navigation:', error.message);
}

console.log('Database test completed');
