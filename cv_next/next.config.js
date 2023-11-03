/** @type {import('next').NextConfig} */
const firebaseConfig = require('./firebase.config');

const nextConfig = {
    env: {
        ...firebaseConfig,
    },
    images: {
        domains: ['lh5.googleusercontent.com'],
        unoptimized: true,
    }
};

module.exports = nextConfig;