import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full sm:w-screen flex flex-col items-center justify-center bg-[#fff]">
      <div className="max-w-lg sm:max-w-xl w-full">
        <img
          src="/assets/images/404-img.jpg"
          alt="404"
          className="w-full h-full object-cover "
        />
      </div>
      <Button type="primary" onClick={() => navigate("/dashboard")}>
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
