export default function Card({ title, category, createdAt, onClick }) {
  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-[28px] border border-gray-300 bg-white px-12 py-10 hover:bg-gray-50"
    >
      <h3 className="text-2xl font-extrabold text-[#3b312b]">{title}</h3>
      <p className="mt-3 text-base text-gray-600">{category}</p>

      <div className="mt-16 text-sm text-gray-500">생성 일시 {createdAt}</div>
    </article>
  );
}
