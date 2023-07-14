import { IconChevronDown, IconChevronRight, IconLogout, IconMessage, IconUpload } from "@tabler/icons-react";
import {

  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import CvModel from "@/app/models/cv";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
    },



  },


  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

}));


export default function ProfileCard({ imageUrl, name }:
  { imageUrl: string, name: string }) {

  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, theme, cx } = useStyles();

  return (

    <Group position="center">
      <Menu
        width='inherit'
        position="bottom-start"
        transitionProps={{ transition: 'pop-top-right' }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
          >
            <Group spacing={7}>
              <Avatar src={imageUrl} alt={name} radius="xl" size={20} />
              <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                {name}
              </Text>
              <IconChevronDown size={rem(12)} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>

          <Menu.Item icon={<IconUpload color={theme.colors.blue[6]} size="0.9rem" stroke={1.5} />}>
            Upload a CV
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item color='red' icon={<IconLogout size="0.9rem" stroke={1.5} />}>
            Logout
          </Menu.Item>



        </Menu.Dropdown>
      </Menu>

    </Group>

  );
}
