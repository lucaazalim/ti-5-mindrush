import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { QUESTION_VISUALS } from "~/lib/constants";
import { useMatchStore } from "../_store/store-provider";

export default function AlternativeStats() {
  const match = useMatchStore((state) => state.match);

  const chartConfig = {
    participants: { label: "Participantes" },
    ...Object.fromEntries(
      match.currentQuestion?.alternatives.map((alternative) => [
        alternative.id,
        { label: alternative.answer, color: "#FFF" },
      ]) ?? [],
    ),
  } satisfies ChartConfig;

  const chartData =
    match.currentQuestion?.alternatives.map((alternative, index) => ({
      alternativeId: alternative.id,
      participants: alternative.count,
      fill: QUESTION_VISUALS[index]?.cssVariable ?? "",
    })) ?? [];

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="alternativeId"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar
          dataKey="participants"
          strokeWidth={5}
          radius={8}
          activeIndex={match.currentQuestion?.alternatives.findIndex(
            (alternative) => alternative.isCorrect,
          )}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={0.8}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                stroke={props.payload.fill}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            );
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
