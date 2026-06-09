'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium border border-white/10"
    >
      تسجيل الخروج
    </button>
  );
}
