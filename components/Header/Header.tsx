import {
  createStyles,
  Header as MantineHeader,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Image,
  Container,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconDeviceMobile,
  IconPigMoney,
  IconExternalLink,
} from "@tabler/icons-react";
import { ColorSchemeToggle } from "../ColorSchemeToggle/CollorSchemeToggle";
import { IconRoute } from "@tabler/icons-react";
import { ColorSchemeSelectorSwitch } from "../ColorSchemeToggle/ColorSchemeSelectorSwitch";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconDeviceMobile,
    title: "Built for Mobile",
    description: "Node's React Native SDK is built for mobile first",
  },
  {
    icon: IconCoin,
    title: "Competitive Pricing",
    description: "Get an entire MVP running in minutes for free",
  },
  {
    icon: IconRoute,
    title: "Swap Router",
    description: "Node's efficient router, Minima, is purpose-built for speed",
  },
  {
    icon: IconPigMoney,
    title: "DeFi",
    description:
      "One single transaction to deposit into a yield-bearing position from any token",
  },

  {
    icon: IconBook,
    title: "Documentation",
    description: "Rich documentation and examples for many use cases",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description:
      "Node's mobile SDK handles secure management of wallet credentials, so you don't have to",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description:
      "Access rich analytics through Node's dashboard, Missing Control",
  },
  {
    icon: IconNotification,
    title: "Webhooks",
    description: "Subscribe to on-chain events with webhooks",
  },
];

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const colorScheme = theme.colorScheme;
  const smallDevice = useMediaQuery("(max-width: 600px)");

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" weight={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <>
      <MantineHeader height={60} px="md" maw="1600px" ml="auto" mr="auto">
        <Group position="apart" sx={{ height: "100%" }}>
          <Image
            style={{
              width: smallDevice ? 120 : 200,
              display: "flex",
              alignItems: "center",
            }}
            src={
              colorScheme === "dark"
                ? "/images/profile/node-finance-nobg.png"
                : "/images/node_logo_dark.png"
            }
            alt="Node Finance"
          />

          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a
                  href="https://nodefinance.org"
                  target="_blank"
                  className={classes.link}
                  rel="noreferrer"
                >
                  <Center inline>
                    <Box component="span" mr={5}>
                      Discover Node Finance
                    </Box>
                    <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text weight={500}>Features</Text>
                  <Anchor
                    href="https://docs.nodefinance.org/"
                    target="_blank"
                    size="xs"
                  >
                    View Docs
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text weight={500} size="sm">
                        Get started
                      </Text>
                      <Text size="xs" color="dimmed">
                        Use our boilerplate app to get started in minutes, not
                        days.
                      </Text>
                    </div>
                    <Button
                      variant="default"
                      onClick={() =>
                        open(
                          "https://docs.nodefinance.org/react-native/getting-started/boilerplate",
                          "_blank"
                        )
                      }
                    >
                      Get started
                    </Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group className={classes.hiddenMobile}>
            <ConnectButton />
            <ColorSchemeToggle />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </MantineHeader>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Discover Node Finance"
        className={classes.hiddenDesktop}
        position="right"
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <a
            href="https://www.nodefinance.org"
            target="_blank"
            className={classes.link}
            rel="noreferrer"
          >
            Home Website
            <IconExternalLink
              style={{
                marginLeft: "5px",
              }}
              size="1rem"
            />
          </a>
          <a
            href="https://docs.nodefinance.org/"
            target="_blank"
            className={classes.link}
            rel="noreferrer"
          >
            Docs
            <IconExternalLink
              style={{
                marginLeft: "5px",
              }}
              size="1rem"
            />
          </a>

          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <ColorSchemeSelectorSwitch />
        </ScrollArea>
      </Drawer>
    </>
  );
}
