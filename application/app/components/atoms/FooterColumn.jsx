export default function FooterColumn({ title, items }) {
  return (
    <div>
      <h3 className="font-semibold text-black mb-4">{title}</h3>

      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.link}
              className="hover:text-black transition cursor-pointer"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
