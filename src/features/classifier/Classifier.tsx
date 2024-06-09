import {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  FormEventHandler,
} from "react";
import { Button } from "../../Button/Button";
import {
  ImageViewer,
  useImageViewer,
  UseImageViewerReturn,
} from "../../components";
import Keyboard from "../../components/Icons/Keyboard";
import { css } from "@linaria/core";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import JSZip from "jszip";
import { useHotkeys } from "react-hotkeys-hook";

const classifierCss = css`
  height: calc(100vh - var(--header-height));
  --bottom-content-height: 0px;
`;

type ClassificationCounts = {
  [classification: string]: number;
};

export function Classifier() {
  const [isOpen, setIsOpen] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const imageViewer = useImageViewer(uploadedImages);
  const [isFinished, setIsFinished] = useState(false);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const fileNamesRef = useRef<string[]>([]);

  const classifcationCounts = useMemo(() => {
    return classifications.reduce(
      (prev: ClassificationCounts, classification) => {
        if (classification.classification) {
          return {
            ...prev,
            [classification.classification]:
              (prev[classification.classification] || 0) + 1,
          };
        }
        return prev;
      },
      {}
    );
  }, [classifications]);

  const finish = useCallback(() => {
    setIsFinished(true);
  }, []);

  const createZip = useCallback(async () => {
    const zip = new JSZip();
    await Promise.all(
      classifications.map(async (classification, i) => {
        if (!classification.classification) return;
        const folder = zip.folder(classification.classification);
        if (!folder) return;
        const response = await fetch(classification.src);
        const blob = await response.blob();
        folder.file(
          `${fileNamesRef.current[i]}`,
          new File([blob], `${fileNamesRef.current[i]}`, { type: "image/jpeg" })
        );
      })
    );
    return zip;
  }, [classifications]);

  const downloadResults = useCallback(async () => {
    const zip = await createZip();
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "classifications.zip";
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [createZip]);

  return (
    <div className={classifierCss}>
      {uploadedImages.length > 0 && !isFinished ? (
        <ImageViewer
          {...imageViewer}
          controls={
            <ClassificationControls
              images={uploadedImages}
              imageViewer={imageViewer}
              finish={finish}
              classifications={classifications}
              setClassifications={setClassifications}
            />
          }
        />
      ) : null}
      {uploadedImages.length === 0 ? (
        <div className="max-w-screen-xl px-2 mx-auto flex justify-center items-center flex-col h-full">
          <p>Start classifying by uploading images!</p>
          <input
            className="p-5 rounded border-2 border-black"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (!e.target.files) return;
              const urls = Array.from(e.target.files).map((file) => {
                return URL.createObjectURL(file);
              });
              // store the filenames separately so we can use them later
              // for some reason when we try to make the blob and the filename the same object, it doesn't work
              fileNamesRef.current = Array.from(e.target.files).map((file) => {
                return file.name;
              });
              setUploadedImages((curr) => [...curr, ...urls]);
              setClassifications((curr) => [
                ...curr,
                ...urls.map((src) => ({ src })),
              ]);
            }}
          />
        </div>
      ) : null}
      {isFinished ? (
        <div className="max-w-screen-xl px-2 mx-auto flex justify-center items-center flex-col h-full">
          <h2 className="text-2xl">Results</h2>
          <ul>
            {Object.entries(classifcationCounts).map(
              ([classification, count]) => (
                <li key={classification}>
                  {classification}: {count}
                </li>
              )
            )}
          </ul>
          <Button onClick={downloadResults}>Download Results</Button>
        </div>
      ) : null}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="bg-gray-800">
          <DialogPanel className="bg-primary">
            <DialogTitle>Add Classification</DialogTitle>
            <Description>
              Add a classification for the current image
            </Description>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

type Classification = {
  src: string;
  classification?: string;
};

function ClassificationControls({
  imageViewer,
  finish,
  classifications,
  setClassifications,
}: {
  images: string[];
  imageViewer: UseImageViewerReturn;
  finish: (classifications: Classification[]) => void;
  classifications: Classification[];
  setClassifications: React.Dispatch<React.SetStateAction<Classification[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const classificationOptions: string[] = useMemo(() => {
    return classifications.reduce((prev: string[], classification) => {
      if (
        classification.classification &&
        !prev.includes(classification.classification)
      ) {
        return [...prev, classification.classification];
      }
      return prev;
    }, []);
  }, [classifications]);

  const setImageClassification = useCallback(
    (classification: string) => {
      setClassifications((prev: Classification[]) => {
        const newClassifications = [...prev];
        newClassifications[imageViewer.currentImageIndex].classification =
          classification;
        return newClassifications;
      });
      setQuery("");
      inputRef.current?.blur();
      if (imageViewer.imageViewerRef.current)
        imageViewer.imageViewerRef.current.focus();
      if (imageViewer.hasNext) imageViewer.nextImage();
      else finish(classifications);
    },
    [classifications, finish, imageViewer, setClassifications]
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setImageClassification(query);
  };

  useHotkeys("ctrl+i", () => {
    inputRef.current?.focus();
  });
  useHotkeys("ArrowRight", () => {
    imageViewer.nextImage();
  });
  useHotkeys("ArrowLeft", () => {
    imageViewer.prevImage();
  });
  useHotkeys("ctrl+h", () => {
    const a = document.createElement("a");
    a.href = "/classifier/shortcuts";
    a.target = "_blank";
    a.click();
  })

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (inputRef.current === document.activeElement) return;
      classificationOptions.forEach((classification, i) => {
        if (event.key === `${i + 1}`) {
          setImageClassification(classification);
        }
      });
    };
    document?.addEventListener("keydown", handleKeyUp);

    return () => {
      document?.removeEventListener("keydown", handleKeyUp);
    };
    // we don't include the imageViewer here
    // we don't want to recreate the event listener every time the imageViewer changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classificationOptions, setImageClassification]);

  return (
    <div className="flex gap-2 items-center">
      {classificationOptions.map((classification, i) => (
        <Button
          key={classification}
          onClick={() => setImageClassification(classification)}
          data-classification={classification}
          emphasis="high"
        >
          {i + 1}: {classification}
        </Button>
      ))}
      <form onSubmit={onSubmit}>
        <input
          className="p-3 rounded"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          ref={inputRef}
        />
      </form>
      <a className="z-20" href="/classifier/shortcuts" target="_blank"><Keyboard /></a>
    </div>
  );
}
