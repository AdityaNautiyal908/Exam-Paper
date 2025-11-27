import { Heart, Github, Mail } from 'lucide-react';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="text-gray-700 font-medium">Made with</span>
            <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
            <span className="text-gray-700 font-medium">for BCA Students</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 font-medium">
            © {currentYear} BCA Question Papers. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="mailto:nautiyaladitya7@gmail.com"
              className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-md"
              title="Contact Us"
            >
              <Mail className="w-5 h-5 text-indigo-600" />
            </a>
            <a
              href="https://github.com/AdityaNautiyal908"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-indigo-100 hover:bg-indigo-200 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-md"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-indigo-600" />
            </a>
          </div>

          <div className="flex justify-center">
            <VisitorCounter />
          </div>
        </div>
      </div>
    </footer>
  );
}
