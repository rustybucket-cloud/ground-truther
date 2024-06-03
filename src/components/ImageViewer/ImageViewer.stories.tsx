import { ImageViewer, useImageViewer } from "./ImageViewer";
import { ImageViewerWithControls } from "./ImageViewerWithControls";

const images = [
  "https://media.istockphoto.com/id/532048136/photo/fresh-red-apple-isolated-on-white-with-clipping-path.jpg?s=2048x2048&w=is&k=20&c=o5iB_Nz86vATCXObzj-quBI_OV7N1HeknHkqNWIwAH4=",
  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default {
  name: "components/ImageViewer",
  component: ImageViewer,
};

export const Basic = () => {
  const imageViewer = useImageViewer(images);
  return (
    <div className="max-h-[500px]">
      <ImageViewer {...imageViewer} />
    </div>
  );
};

export const WithControls = () => {
  return <ImageViewerWithControls images={images} />;
};
