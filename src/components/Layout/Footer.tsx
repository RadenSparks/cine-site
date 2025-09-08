export default function AppFooter() {
  return (
    <footer className="mt-12 bg-gradient-to-r from-indigo-700 via-pink-500 to-indigo-400 border-t shadow-lg text-white">
      <div className="flex flex-col md:flex-row justify-between items-center p-4">
        <span className="">&copy; {new Date().getFullYear()} CineSite. All rights reserved.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}