import { Navigate } from "react-router-dom";

function ProtectedRoutes({ isAuth, children }) {
  if (isAuth) {
    return children;
  }
  else{
    return <Navigate to='/login'/>
  }
}
export default ProtectedRoutes;
