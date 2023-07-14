import { Text } from "@mantine/core";
import ProfileCard from '@/app/ui/navbar/profileCard'

function FeedNavbar() {
  return (
    <div>
      {/* <Text>Application navbar</Text> */}
      <ProfileCard
        imageUrl="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        name='Official Name'

      />
    </div>
  );
}

export default FeedNavbar;
