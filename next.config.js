/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
    },
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        CLOUDINARY_URL: process.env.CLOUDINARY_URL,
        CLOUDINARY_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },

}

module.exports = nextConfig
