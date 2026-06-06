import Image from 'next/image';

export const metadata = {
  title: 'BOROZ | تسجيل الدخول',
  description: 'منصة النمو المتخصصة لتجار سلة',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-navy via-primary-purple to-primary-navy flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-purple opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-navy opacity-10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/boroz-logo.png"
            alt="BOROZ"
            width={160}
            height={80}
            priority
            className="mx-auto mb-4"
          />
          <p className="text-primary-light text-sm">منصة النمو المتخصصة لتجار سلة</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-primary-light text-sm mt-6">
          © 2024 BOROZ | بروز. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
