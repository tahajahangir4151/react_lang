import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const styles = {
  color: "white",
  marginLeft: "1rem",
  textDecoration: "none",
};

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" textTransform={"uppercase"} mr={"auto"}>
          Learndo.
        </Typography>
        <Link style={styles} to={"/"}>
          Home{" "}
        </Link>
        <Link style={styles} to={"/login"}>
          Login{" "}
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
