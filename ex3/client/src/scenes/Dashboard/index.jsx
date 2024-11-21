import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { useLogoutMutation } from "state/api";
import { logOut } from "state/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut()); // Clear the auth state in Redux
      navigate("/login");
    } catch (error) {
      dispatch(logOut()); // Clear the auth state in Redux
      navigate("/login");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Está com a sessão iniciada
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          disabled={isLoading}
        >
          Terminar Sessão
        </Button>
      </Box>
    </>
  );
};

export default Dashboard;
