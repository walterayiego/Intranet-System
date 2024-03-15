import React, { useEffect } from "react";
import {
  SwipeableDrawer,
  Box,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,Avatar
} from "@mui/material";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Logout as LogoutIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import DropDown from "./DropDown";
import { ContextData } from "../APIs/contexts/Context";
import Logo from "/assets/VihigaLogo.png";

const List = () => (
  <Box className="w-[70vw] h-[100vh] m-2 overflow-clip" role="presentation">
    
  </Box>
);
export default function Navbar({ props }) {
  const { logout } = ContextData();
  const { currentUser, uid } = props;
  const navigate = useNavigate();

  const [state, setState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;

    setState(open);
  };


  const HandleSignOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <List />
      </SwipeableDrawer>
      <div className="sticky grid grid-flow-col sm:grid-cols-2 top-0 mb- h-[10vh] w-full z-50 opacity-100 bg-bg">
        {/* Box with Logo */}
        <div className="bg-[#020202]/60 overflow-hidden row items-center">
          <div className="sm:hidden block">
            <Button onClick={toggleDrawer(true)} className="cols-center">
              <MenuIcon />
            </Button>
          </div>
          <img src={Logo} className="w-[9vw] h-[8vh] m-2 hidden sm:block"/>
        </div>

        <div className="row ">
          <ol className="row justify-end items-center mx-4 flex-1 space-x-[1vw] text-primary">
            <Link className="links" to="/">
              HOME
            </Link>
            <Link className="links" to="/profile">
              PROFILE
            </Link>
            <Link className="links" to="/chatpage">
              CHAT
            </Link>
          </ol>
          <div className="bg-[#3a1107] w-[10vw] h-full rows-center">
            <DropDown
              Class="w-full h-full"
              Title={
                <Avatar
                  className=" border-white/40 "
                  src={currentUser?.profile_picture}
                  alt="DP"
                  sx={{ width: "3vw", height: "3vw" }}
                />
              }
            >
              <div className=" mx-1 cols-center">
                <p> {currentUser?.name && "Hello " + currentUser?.name} </p>
                <ListItemButton onClick={HandleSignOut}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </div>
            </DropDown>
          </div>
        </div>
      </div>
    </>
  );
}
