export default function Wrapper({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "px-6 md:px-10 lg:px-16",
    wide: "px-4 md:px-12 lg:px-24",
    narrow: "px-4 md:px-6 lg:px-8",
  };

  return (
    <div className={`w-full ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}