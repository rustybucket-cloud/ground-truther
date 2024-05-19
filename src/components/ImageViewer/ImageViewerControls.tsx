import { ImageViewerType } from "./types";
import { IconButton } from "../../Button/IconButton";
import { ArrowLeft, ArrowRight, Plus, Minus } from "../Icons";

export function ImageViewerControls({
  next,
  prev,
  hasNext,
  hasPrev,
  zoomIn,
  zoomOut,
}: ImageViewerType) {
  return (
    <div className="flex justify-center items-center gap-4 border-primary border-2 rounded max-w-[300px] w-full px-3 py-2">
      <IconButton onClick={prev} disabled={!hasPrev} Icon={ArrowLeft} />
      <IconButton onClick={zoomOut} Icon={Minus} />
      <IconButton onClick={zoomIn} Icon={Plus} />
      <IconButton onClick={next} disabled={!hasNext} Icon={ArrowRight} />
    </div>
  );
}
