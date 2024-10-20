import React from "react";
interface SlugProps {
  params: { slug: string };
}

const SlugPage: React.FC<SlugProps> = ({ params }) => {
  return <div className="text-black">{params.slug}</div>;
};

export default SlugPage;
