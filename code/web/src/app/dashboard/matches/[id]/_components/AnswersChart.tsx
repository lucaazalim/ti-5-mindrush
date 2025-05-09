import { Bar, BarChart, LabelList, Rectangle, XAxis } from "recharts";
import Container from "~/app/dashboard/_components/Container";
import { ChartConfig, ChartContainer } from "~/components/ui/chart";
import { QUESTION_ALTERNATIVES_STYLING } from "~/lib/constants";
import { useMatchStore } from "../_store/store-provider";

export default function AnswersChart() {
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
      fill: QUESTION_ALTERNATIVES_STYLING[index]?.cssVariable ?? "",
    })) ?? [];

  return (
    <Container>
      <ChartContainer config={chartConfig} className="max-h-[36rem]">
        <BarChart accessibilityLayer data={chartData}>
          <XAxis
            dataKey="alternativeId"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
          />
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
          >
            <LabelList
              position="inside"
              offset={12}
              className="fill-foreground text-3xl font-bold"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Container>
  );
}
