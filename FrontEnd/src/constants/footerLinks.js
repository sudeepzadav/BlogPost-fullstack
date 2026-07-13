import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export const footerLinks = {
  Explore: [
    { label: "Home", to: "/" },
    { label: "Write", to: "/add-post" },
    { label: "Search", to: "/search" },
  ],
  Account: [
    { label: "Sign in", to: "/signin" },
    { label: "Sign up", to: "/signup" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
  ],
};

export const socialLinks = [
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
];