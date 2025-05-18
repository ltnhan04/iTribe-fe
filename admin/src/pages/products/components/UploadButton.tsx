import { PlusOutlined } from "@ant-design/icons";

const UploadButton = () => {
  return (
    <button
      className="flex flex-col items-center justify-center w-full h-full"
      type="button"
    >
      <PlusOutlined />
      <div className="mt-2 text-sm">Upload</div>
    </button>
  );
};

export default UploadButton;
