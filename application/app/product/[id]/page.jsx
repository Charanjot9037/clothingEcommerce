export default function ProductPage({ params }) {
  const { id } = params;

  return (
    <div className="p-10 text-2xl">
      Product ID: {id}
    </div>
  );
}