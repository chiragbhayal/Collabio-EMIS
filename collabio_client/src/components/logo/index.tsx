import { Link } from "react-router-dom";

const Logo = (props: { url?: string; isLink?: boolean }) => {
  const { url = "/", isLink = true } = props;
  
  const logoContent = (
    <img
      src="/Collabio.png"
      alt="Collabio Logo"
      className="h-8 w-auto"
    />
  );

  if (!isLink) {
    return logoContent;
  }

  return (
    <Link to={url} className="flex items-center justify-center sm:justify-start">
      {logoContent}
    </Link>
  );
};

export default Logo;
