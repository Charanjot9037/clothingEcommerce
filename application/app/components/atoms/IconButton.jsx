export default function IconButton({ icon, onClick }) {
  return (
    <button onClick={onClick} className="p-2 hover:opacity-70">
      {icon}
    </button>
  );
}