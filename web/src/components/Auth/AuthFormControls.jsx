export function DemoNotice({ children }) {
  return (
    <p
      role="status"
      className="rounded-xl border border-mint-strong bg-mint-soft px-4 py-3 text-sm leading-5 text-deep"
    >
      {children}
    </p>
  );
}
