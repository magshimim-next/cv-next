import { IconMessage } from "@tabler/icons-react";
import {

  Avatar,
  Box,
  Button,
  Divider,
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
    
  },
  uploadButton: {
    backgroundColor: theme.colors.blue[5],
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bolder'
  },
  
  statsBox: {
    textAlign: 'center',
    
  }
}));

export default function ProfileCard({imageUrl, name}: 
  {imageUrl: string, name: string}) {
    
  const { classes, theme } = useStyles();

  return (
  <Box >
    <Flex direction='column' gap='md'>
      {/* USERNAME AND PROFILE PIC */}
      <Flex align='center' justify='start' gap={10}>
        <Avatar radius='lg' size='sm'
        src={imageUrl}/>

        <Text fz='lg' fw={600}>{name}</Text>
      </Flex>

           {/* LOGOUT AND UPLOAD CV OPTION */}
      <Flex gap={20}>
      <div>
        <Button size='xs' className={classes.logoutButton}>
          Logout
        </Button>
      </div>
      <div>
        <Button size='xs'  className={classes.uploadButton}>
          +
        </Button>
      </div>
      </Flex>
    </Flex>
  </Box>
  );
}
