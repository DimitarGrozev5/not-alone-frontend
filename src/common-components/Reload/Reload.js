import { Navigate, useSearchParams } from "react-router-dom";

const Reload = (props) => {
  const [search] = useSearchParams();

  return <Navigate to={search.get("path")} />;
};

export default Reload;
