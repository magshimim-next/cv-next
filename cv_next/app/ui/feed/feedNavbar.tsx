import { Text } from "@mantine/core";
import ProfileCard from '@/app/ui/navbar/profileCard'

function FeedNavbar() {
    return (
        <div>
          {/* <Text>Application navbar</Text> */}
          <ProfileCard
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png" 
          name='Official Name'
          
          />
        </div>
      );}

export default FeedNavbar;
