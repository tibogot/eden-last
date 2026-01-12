export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* You can add a blog-specific header or navigation here */}
      {children}
    </div>
  );
}
