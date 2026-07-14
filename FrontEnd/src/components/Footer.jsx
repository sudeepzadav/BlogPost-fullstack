import { Link } from "react-router-dom";
import { socialLinks } from "../constants/footerLinks";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#221f58] rounded-t-xl">
      <div className="mx-auto flex  flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div>
          <Link to="/">
            <h2 className="bg-linear-to-r from-violet-300 via-white to-indigo-300 bg-clip-text text-2xl font-bold text-transparent">
              SkLogin
            </h2>
          </Link>

          <p className="mt-1 max-w-sm text-sm leading-6 text-indigo-300/70">
            A space to write, read, and share ideas that matter to you.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <div className="flex gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-indigo-300 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          <p className="text-xs text-indigo-300/50">
            © {new Date().getFullYear()} SkLogin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;