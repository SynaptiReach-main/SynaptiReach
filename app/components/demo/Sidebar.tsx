export {};
export default function Sidebar() {
  const items = ["Dashboard","CRM","Marketing","Automation","AI"];

  return (
    <div className="p-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
