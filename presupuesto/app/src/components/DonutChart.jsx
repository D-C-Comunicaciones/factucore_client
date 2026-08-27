const SIZE = 160;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function DonutChart({ segments, total }) {
  let offset = 0;
  const hasData = total > 0;

  return (
    <svg className="chart-svg" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={STROKE}
      />
      {hasData &&
        segments
          .filter((s) => s.value > 0)
          .map((s) => {
            const fraction = s.value / total;
            const dash = fraction * CIRC;
            const circle = (
              <circle
                key={s.key}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${CIRC - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        fontSize="11"
        fontFamily="Inter, sans-serif"
        fill="#9ca3af"
        fontWeight="600"
      >
        TOTAL
      </text>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        fontSize="13"
        fontFamily="Lexend, sans-serif"
        fill="#0f172a"
        fontWeight="700"
      >
        100%
      </text>
    </svg>
  );
}

export const CATEGORY_COLORS = {
  flights: "#00d6bc",
  otherTransport: "#06ecd0",
  stay: "#18283f",
  food: "#30aba9",
  localTransport: "#64748b",
  extras: "#9ca3af",
};
