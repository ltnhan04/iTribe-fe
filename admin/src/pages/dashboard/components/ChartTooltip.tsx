import { TooltipProps } from "recharts";
import { formatCurrency } from "../../../utils/format-currency";

export const ChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              margin: "5px 0",
              color: entry.color,
            }}
          >
            {entry.name === "Revenue"
              ? `${entry.name}: ${formatCurrency(entry.value as number)}`
              : `${entry.name}: ${(entry.value as number).toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
}; 