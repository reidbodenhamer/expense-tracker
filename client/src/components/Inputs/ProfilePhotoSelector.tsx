import React, { useRef } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import heic2any from "heic2any";

async function convertHeicToUrl(file: File): Promise<string | null> {
  try {
    const converted = await heic2any({ blob: file, toType: "image/jpeg" });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return URL.createObjectURL(blob as Blob);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to convert HEIC image:", error.message);
    } else {
      console.error("Failed to convert HEIC image: An unknown error occurred", error);
    }
    return null;
  }
}

const ProfilePhotoSelector: React.FC<{
  image: File | null;
  setImage: (image: File | null) => void;
}> = ({ image, setImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!image) {
      setSelectedImageUrl(null);
      return;
    }
    if (image.type === "image/heic" || image.name.toLowerCase().endsWith(".heic")) {
      convertHeicToUrl(image).then(setSelectedImageUrl);
    } else {
      setSelectedImageUrl(URL.createObjectURL(image));
    }
    return () => {
      if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
    };
  }, [image]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedImageUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={selectedImageUrl || ""}
            alt="Photo"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
