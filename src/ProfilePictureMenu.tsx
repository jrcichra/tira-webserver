import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "./EnvironmentVariables";

export default function ProfilePictureMenu({
  anchorEl,
  handleClose,
}: {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
}) {
  const handleLogout = () => {
    fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );
}
