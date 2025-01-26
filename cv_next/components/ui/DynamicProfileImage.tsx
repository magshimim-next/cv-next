import { FaUserCircle } from "react-icons/fa";

interface ThemeImageProps {
  children?: React.ReactNode;
  placeHolderStyle?: React.CSSProperties;
  isPlaceholder: boolean;
  className?: string;
}

const DynamicProfileImage: React.FC<ThemeImageProps> = ({
  children,
  isPlaceholder,
  placeHolderStyle,
  className,
}) => {
  const defaultProfileIcon = (
    <FaUserCircle style={placeHolderStyle || { fontSize: "70px" }} />
  );

  if (isPlaceholder) {
    return <div className={className ?? ""}>{defaultProfileIcon}</div>;
  } else {
    return (
      <div className={className ?? "overflow-hidden rounded-full"}>
        {children}
      </div>
    );
  }
};

export default DynamicProfileImage;
