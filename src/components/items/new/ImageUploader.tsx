"use client";

import { ImagePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ItemImage } from "@/common/interfaces/images";

interface ImageUploaderProps {
  images: ItemImage[];

  onClick: () => void;

  className?: string;
}

export function ImageUploader({
  images,
  onClick,
  className,
}: ImageUploaderProps) {

  const previewImage =
    images.length > 0
      ? images[0]?.url
      : null;

  return (
    <div
      className={cn(
        "bg-white border-2 border-dashed border-slate-400 rounded-[4px] overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="
          w-full h-[200px]
          flex flex-col items-center justify-center gap-2
          hover:bg-primary/5 transition-all
          group relative overflow-hidden
        "
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Product Preview"
            className="
              w-full h-full object-cover
              transition-transform
              group-hover:scale-105
            "
          />
        ) : (
          <>
            <div
              className="
                w-12 h-12
                flex items-center justify-center
                rounded-full
                bg-muted/10
                group-hover:bg-primary/10
                transition-colors
              "
            >
              <ImagePlus
                className="
                  w-6 h-6
                  text-muted-foreground
                  group-hover:text-primary
                  transition-colors
                "
              />
            </div>

            <span
              className="
                text-sm font-medium
                text-muted-foreground
                group-hover:text-primary
                transition-colors
              "
            >
              Subir imagen
            </span>
          </>
        )}
      </button>
    </div>
  );
}