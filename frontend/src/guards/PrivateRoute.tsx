import { useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import HttpInterceptor from "../lib/HttpInterceptor";
import Context from "../Context";

const PrivateRoute = () => {
  const { session, setSession } = useContext(Context);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {
    try {
      const { data } = await HttpInterceptor.get("/auth/session");
      setSession(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSession(false);
    }
  };

  if (session === null) return "Loading...";

  if (session === false) return <Navigate to="/login" />;

  return <Outlet />;
};

export default PrivateRoute;
