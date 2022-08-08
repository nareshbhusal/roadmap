/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  reactStrictMode: false, // set false for react-beautiful-dnd
  pwa: {
    dest: 'public',
    runtimeCaching
  }
});
