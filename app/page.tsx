import * as d3 from "d3";
import { format } from "date-fns";
import { CSSProperties } from "react";

export default function Page() {
  let data = sales.map((d) => ({ ...d, date: new Date(d.date) }));

  return (
    <div className="relative w-full grid grid-cols-12 gap-x-3 gap-y-10 md:gap-x-12 px-2 py-6 md:gap-y-16 md:p-8">
      <div className="col-span-12 h-32 md:h-40">
        <Chart data={data} />
      </div>
      <div className="h-32 md:h-40 col-span-6 md:col-span-4 block">
        <Chart data={data} />
      </div>
      <div className="h-32 md:h-40 hidden col-span-4 md:block">
        <Chart data={data} />
      </div>
      <div className="h-32 md:h-40 col-span-6 md:col-span-4 col-start-auto block">
        <Chart data={data} />
      </div>
    </div>
  );
}

let sales = [
  { date: "2023-04-30T12:00:00.00+00:00", value: 4 },
  { date: "2023-05-01T12:00:00.00+00:00", value: 6 },
  { date: "2023-05-02T12:00:00.00+00:00", value: 8 },
  { date: "2023-05-03T12:00:00.00+00:00", value: 7 },
  { date: "2023-05-04T12:00:00.00+00:00", value: 10 },
  { date: "2023-05-05T12:00:00.00+00:00", value: 12 },
  { date: "2023-05-06T12:00:00.00+00:00", value: 4 },
];

function Chart({ data }: { data: { value: number; date: Date }[] }) {
  let xScale = d3
    .scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 100]);
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  let line = d3
    .line<(typeof data)[number]>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  let d = line(data);

  if (!d) {
    return null;
  }

  return (
    <div
      className="relative h-full w-full @container"
      style={
        {
          "--marginTop": "6px",
          "--marginRight": "8px",
          "--marginBottom": "25px",
          "--marginLeft": "25px",
          "--marginTopLg": "6px",
          "--marginRightLg": "8px",
          "--marginBottomLg": "30px",
          "--marginLeftLg": "30px",
        } as CSSProperties
      }
    >
      {/* X axis */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
          lg:h-[calc(100%-var(--marginTopLg))]
          lg:w-[calc(100%-var(--marginLeftLg)-var(--marginRightLg))]
          lg:translate-x-[var(--marginLeftLg)]
          lg:translate-y-[var(--marginTopLg)] 
        "
      >
        {data.map((day, i) => (
          <g key={i} className="overflow-visible font-medium text-gray-400">
            <text
              x={`${xScale(day.date)}%`}
              y="100%"
              textAnchor={
                i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
              }
              fill="currentColor"
              className="hidden text-sm @lg:inline"
            >
              {format(day.date, "EEE")}
            </text>
            <text
              x={`${xScale(day.date)}%`}
              y="100%"
              textAnchor={
                i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
              }
              fill="currentColor"
              className="text-xs @lg:hidden"
            >
              {format(day.date, "EEEEE")}
            </text>
          </g>
        ))}
      </svg>

      {/* Y axis */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          overflow-visible
          lg:h-[calc(100%-var(--marginTopLg)-var(--marginBottomLg))]
          lg:translate-y-[var(--marginTopLg)]
        "
      >
        <g className="translate-x-4">
          {yScale
            .ticks(8)
            .map(yScale.tickFormat(8, "d"))
            .map((value, i) => (
              <text
                key={i}
                y={`${yScale(+value)}%`}
                alignmentBaseline="middle"
                textAnchor="end"
                className="text-xs tabular-nums text-gray-600"
                fill="currentColor"
              >
                {value}
              </text>
            ))}
        </g>
      </svg>

      {/* Chart area */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
          lg:h-[calc(100%-var(--marginTopLg)-var(--marginBottomLg))]
          lg:w-[calc(100%-var(--marginLeftLg)-var(--marginRightLg))]
          lg:translate-x-[var(--marginLeftLg)]
          lg:translate-y-[var(--marginTopLg)]
        "
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {yScale
            .ticks(8)
            .map(yScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(0,${yScale(+active)})`}
                className="text-gray-700"
                key={i}
              >
                <line
                  x1={0}
                  x2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}

          {/* Line */}
          <path
            d={d}
            fill="none"
            className="text-gray-300"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Circles */}
          {data.map((d) => (
            <path
              key={d.date.toString()}
              d={`M ${xScale(d.date)} ${yScale(d.value)} l 0.0001 0`}
              vectorEffect="non-scaling-stroke"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              stroke="currentColor"
              className="text-gray-300"
            />
          ))}
        </svg>
      </svg>
    </div>
  );
}
