export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-purple-950/90 border-b border-yellow-500/20">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-yellow-400 font-bold text-lg tracking-wide">
          🔮 우리들의 운세 아지트
        </span>
        <span className="text-purple-400 text-xs">
          매일 새로운 운세
        </span>
      </div>
    </nav>
  );
}
