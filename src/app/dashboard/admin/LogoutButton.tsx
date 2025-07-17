"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="group p-2 hover:bg-blue-800 rounded-lg transition-all duration-200 relative"
      title="Logout"
    >
      <svg 
        className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" 
        />
      </svg>
      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
        Logout
      </span>
    </button>
  );
}
