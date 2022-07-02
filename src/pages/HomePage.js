import { Link } from "react-router-dom";

const HomePage = (props) => {
  return (
    <main>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
    </main>
  );
};

export default HomePage;
