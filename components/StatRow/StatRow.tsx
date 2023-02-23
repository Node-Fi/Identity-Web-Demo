import { Badge, Group, Text } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";

export function StatRow({
  name,
  value,
  Icon,
  style,
}: {
  name: string;
  value: string;
  Icon?: (props: TablerIconsProps) => JSX.Element;
  style?: React.CSSProperties;
}) {
  return (
    <Group position="apart" style={style} w="100%" pl="sm" pr="sm">
      <Group>
        {Icon ? <Icon /> : null}
        <Text>{name}</Text>
      </Group>
      <Badge>{value}</Badge>
    </Group>
  );
}
