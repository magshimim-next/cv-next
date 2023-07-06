import { IconMessage } from "@tabler/icons-react";
import {

  Avatar,
  Box,
  Button,
  Flex,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import CvModel from "@/app/models/cv";

const useStyles = createStyles((theme) => ({
  box: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    
  },
  logoutButton: {
    backgroundColor: theme.colors.red[6],
    '&:hover': {
      backgroundColor: theme.colors.red[7],
      textAlign: 'center'
      
    }
    
  }
  

}));

export default function ProfileCard({imageUrl, name}: 
  {imageUrl: string, name: string}) {
  const { classes, theme } = useStyles();

  return (
  <Box>
    <Flex direction='column' gap='md' >

      <Flex align='center' gap={10}>
        <Avatar radius='lg' size='md'
        src={imageUrl}/>

        <Text fz='xl' fw={600}>{name}</Text>
      </Flex>

      <div>
        <Button size='sm' className={classes.logoutButton}>
          Logout
        </Button>
      </div>
    </Flex>
  </Box>
  );
}
