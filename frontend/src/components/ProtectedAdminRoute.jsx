// routes/ProtectedAdminRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin");

  useEffect(() => {
    if (isAdmin !== "true") {
      navigate("/admin"); // go back to login if not authorized
    }
  }, [isAdmin, navigate]);

  return isAdmin === "true" ? children : null;
};

export default ProtectedAdminRoute;
