"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, Star } from "lucide-react";
import Image from "next/image";

interface ProductGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: { url: string; isFavorite: boolean }[];
}

export const ProductGalleryModal = ({
    isOpen,
    onClose,
    images = [],
}: ProductGalleryModalProps) => {
    const [selectedImage, setSelectedImage] = useState(
        images.find((img) => img.isFavorite) || images[0] || null
    );

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Galería de producto</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                            <ImageIcon className="w-16 h-16 text-gray-400" />
                            <p className="mt-2 text-gray-500">No hay imágenes para este producto</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            <div className="relative flex items-center justify-center p-4 border-2 border-dashed rounded-lg">
                                {selectedImage && (
                                    <Image
                                        src={selectedImage.url}
                                        alt="Producto"
                                        width={400}
                                        height={400}
                                        className="object-contain h-80 w-full"
                                    />
                                )}
                                <Button
                                    variant="outline"
                                    className="absolute top-4 right-4 bg-white"
                                >
                                    <Star className="w-4 h-4 mr-2" />
                                    Favorita
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`w-20 h-20 border-2 rounded-lg cursor-pointer ${selectedImage?.url === image.url
                                            ? "border-primary"
                                            : "border-transparent"
                                            }`}
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="bg-white hover:bg-muted"
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
