import { useLocation, useNavigate } from "react-router-dom";
import SegmentedTabs from "@/components/navigation/SegmentedTabs";

export default function TopTabs({ tabs, fallbackValue }) {
  const location = useLocation();
  const navigate = useNavigate();

  const active =
    tabs.find((t) => location.pathname.startsWith(t.path))?.value ??
    fallbackValue ??
    tabs[0]?.value;

  return (
    <SegmentedTabs
      value={active}
      onChange={(v) => {
        const target = tabs.find((t) => t.value === v);
        if (target) navigate(target.path);
      }}
      items={tabs.map((t) => ({ label: t.label, value: t.value }))}
    />
  );
}
