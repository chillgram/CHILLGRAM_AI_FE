export default function Card({ onClick, className = "", children }) {
  return (
    <article
      onClick={onClick}
      className={[
        "rounded-[28px] border border-gray-300 bg-white px-12 py-10",
        onClick ? "cursor-pointer hover:bg-gray-50" : "",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
