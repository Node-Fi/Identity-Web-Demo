import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
  },
}));
