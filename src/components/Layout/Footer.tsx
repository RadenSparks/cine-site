import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="mt-16 bg-gradient-to-t from-black/60 to-transparent text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h6 className="font-bold mb-3">Movies</h6>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/videos">Videos</Link></li>
              <li><Link to="/english">English Movies</Link></li>
              <li><Link to="/upcoming">Upcoming Movies</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-3">Information</h6>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/tv">Tv Series</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/auth">Login</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-3">Locations</h6>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Asia</li>
              <li>France</li>
              <li>Taiwan</li>
              <li>United States</li>
              <li>Korea</li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-3">Newsletter</h6>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/60" placeholder="Your Email Address" />
              <button className="px-3 py-2 rounded bg-pink-500">Send</button>
            </form>
            <p className="text-sm text-white/70 mt-4">Enter your email and receive the latest news, updates and special offers from us.</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} WyvernBox. All rights reserved</p>
          <div className="flex items-center gap-3 text-white/80">
            <a aria-label="facebook" href="#facebook" className="hover:underline">Facebook</a>
            <a aria-label="linkedin" href="#linkedin" className="hover:underline">LinkedIn</a>
            <a aria-label="twitter" href="#twitter" className="hover:underline">Twitter</a>
            <a aria-label="google" href="#google" className="hover:underline">Google+</a>
          </div>
        </div>
      </div>
    </footer>
  );
}