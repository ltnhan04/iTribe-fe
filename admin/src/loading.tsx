import { Spin } from "antd";
const Loading = () => {
  return (
    <div className="w-full h-full fixed z-20 flex items-center justify-center top-0 left-0 bg-gray-100 opacity-80">
      <Spin />
    </div>
  );
};

export default Loading;
