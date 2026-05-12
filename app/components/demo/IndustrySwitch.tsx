export {};
export default function IndustrySwitch({ dispatch }: any) {
  const industries = ["SaaS", "Ecommerce", "Agency", "Local"];

  return (
    <div className="flex gap-2 flex-wrap">
      {industries.map((item, idx) => (
        <button
          key={idx}
          onClick={() =>
            dispatch({
              type: "AI_MESSAGE",
              payload: item,
            })
          }
          className="px-3 py-2 bg-white/5 rounded text-xs"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
