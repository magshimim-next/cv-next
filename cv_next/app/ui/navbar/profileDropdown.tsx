import { IconChevronDown, IconLogout, IconUpload } from "@tabler/icons-react";
import {
  Avatar,
  DEFAULT_THEME,
  Group,
  Menu,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import React, { useState } from "react";

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

interface DropdownOption {
  text: string;
  icon: JSX.Element;
  onClickFunc: (event: React.MouseEvent) => void
}

// Default profile's dropdown options that'll pop up when clicked 
const defaultDropdownOptions: DropdownOption[] = [
  {
    text: 'Upload a cv',
    icon: <IconUpload color={DEFAULT_THEME.colors.blue[6]} size="0.9rem" stroke={1.5} />,
    onClickFunc: () => { console.log("That's just a dummy upload") }
  },
  {
    text: 'Logout',
    icon: <IconLogout color='red' size="0.9rem" stroke={1.5} />,
    onClickFunc: () => { console.log("That's just a dummy logout") }
  },
]


export default function ProfileCard({ imageUrl, name,
  options = defaultDropdownOptions }:
  { imageUrl: string, name: string, options?: DropdownOption[] }) {

  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, theme, cx } = useStyles();

  // Editing the options before injecting into the JSX
  const adjustedOptions: DropdownOption[] = options.map(option => ({
    ...option,

    // Editing size so users won't worry about handling it & only about the icon itself
    icon: React.cloneElement(option.icon, { size: '0.9rem' }),
  }))

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
          {adjustedOptions.map((option, index) =>
            <>
              <Menu.Item icon={option.icon}
                onClick={option.onClickFunc}
                key={index}>

                {option.text}

              </Menu.Item>
              {/* Don't add a divider after the last element (ugly) */}
              {index != options.length - 1 ? <Menu.Divider /> : <></>}
            </>)
          }
        </Menu.Dropdown>
      </Menu>

    </Group>

  );
}
