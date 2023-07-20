import { DEFAULT_THEME, Text } from "@mantine/core";
import ProfileDropdown from '@/app/ui/navbar/profileDropdown'
import { IconLogout, IconUpload } from "@tabler/icons-react";

function FeedNavbar() {
  return (
    <div>
      {/* <Text>Application navbar</Text> */}
      <ProfileDropdown
        imageUrl="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        name='Official Name'
      />
    </div>
  );
}
export default FeedNavbar;
