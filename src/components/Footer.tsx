import { Heart, Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 mb-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-lavender-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-gray-600">Made with</span>
            <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            <span className="text-gray-600">for BCA Students</span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            © {currentYear} BCA Question Papers. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="mailto:nautiyaladitya7@gmail.com"
              className="w-10 h-10 bg-lavender-100 hover:bg-lavender-200 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              title="Contact Us"
            >
              <Mail className="w-5 h-5 text-lavender-600" />
            </a>
            <a
              href="https://github.com/AdityaNautiyal908"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-lavender-100 hover:bg-lavender-200 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-lavender-600" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
