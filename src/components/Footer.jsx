import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-base leading-none">🍴</span>
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              Recipe<span className="text-amber-400">Finder</span>
            </span>
          </div>

          {/* Attribution */}
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            Recipe data by{' '}
            <a
              href="https://www.themealdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              TheMealDB
            </a>
            . AI powered by{' '}
            <a
              href="https://ai.google.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              Google Gemini
            </a>
            .
          </p>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} RecipeFinder. Built with Next.js &amp; ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
