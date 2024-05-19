import { useRef, useEffect, useState, useCallback } from "react";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";

type ImageType = {
  src: string;
  classification?: string;
};

const images = [
  "https://media.istockphoto.com/id/532048136/photo/fresh-red-apple-isolated-on-white-with-clipping-path.jpg?s=2048x2048&w=is&k=20&c=o5iB_Nz86vATCXObzj-quBI_OV7N1HeknHkqNWIwAH4=",
  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export function Classifier() {
  const image = useImg(images);

  return (
    <div className="max-h-screen">
      <h1 className="text-xl">Classifier</h1>
      <Img {...image} />
      <div className="flex gap-2">
        <button onClick={image.zoomOut}>-</button>
        <button onClick={image.zoomIn}>+</button>
        {image.hasPrev ? <button onClick={image.prev}>Prev</button> : null}
        {image.hasNext ? <button onClick={image.next}>Next</button> : null}
      </div>
      <div className="flex gap-2 justify-center mt-2">
        <ClassificationButton>Class 1</ClassificationButton>
        <ClassificationButton>Class 2</ClassificationButton>
      </div>
    </div>
  );
}

type UseImg = {
  image: ImageType;
  next: () => void;
  prev: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  imgRef: React.RefObject<HTMLImageElement>;
  classifySelectedImage: (classification: string) => void;
  hasNext: boolean;
  hasPrev: boolean;
};

function Img({ image, imgRef }: UseImg) {
  return (
    <div>
      <img className="max-h-[750px]" ref={imgRef} src={image.src} />
    </div>
  );
}

function useImg(imageSrcs: string[]): UseImg {
  const [images, setImages] = useState(imageSrcs.map((src) => ({ src })));
  const [selectedImage, setSelectedImage] = useState(0);
  const imgRef = useRef<HTMLImageElement|null>(null);
  const viewerRef = useRef<Viewer|null>(null);

  useEffect(() => {
    if (imgRef.current == null) return () => {};
    viewerRef.current = new Viewer(imgRef.current, {
      inline: true,
      navbar: false,
      toolbar: false,
      url() {
        return images[selectedImage].src;
      },
    });

    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, [images, selectedImage]);

  const next = useCallback(() => {
    setSelectedImage((curr) => curr + 1);
  }, []);

  const prev = useCallback(() => {
    setSelectedImage((curr) => curr - 1);
  }, []);

  const hasNext = selectedImage !== imageSrcs.length - 1

  const hasPrev = selectedImage !== 0

  const zoomIn = useCallback(() => {
    if (viewerRef.current) viewerRef.current.zoom(0.1);
  }, []);

  const zoomOut = useCallback(() => {
    if (viewerRef.current) viewerRef.current.zoom(-0.1);
  }, []);

  const classifySelectedImage = useCallback((classification: string) => {
    setImages((curr) => {
        return curr.map((image) => image.src === images[selectedImage].src ? {...image, classification } : image)
    })
  }, [images, selectedImage]);

  return { image: images[selectedImage], next, prev, imgRef, zoomIn, zoomOut, classifySelectedImage, hasNext, hasPrev };
}

function ClassificationButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="border-primary border-2 p-3 rounded hover:bg-primary">
      {children}
    </button>
  );
}
