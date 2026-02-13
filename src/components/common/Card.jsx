export default function Card({ onClick, className = "", children }) {
  return (
    <article
      onClick={onClick}
      className={[
        "rounded-[28px]",
        onClick ? "cursor-pointer hover:bg-gray-50" : "",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}
