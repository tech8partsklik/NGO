import { Navigate } from "react-router-dom";
import { getUser } from "../../utils/storage";

export default function MemberRoute({ children }) {
  const user = getUser();

  if (!user) return <Navigate to="/member/login" />;

  if (user.role?.name !== "member") {
    return <Navigate to="/" />;
  }

  return children;
}
