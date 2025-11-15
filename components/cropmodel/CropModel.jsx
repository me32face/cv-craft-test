'use client';
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

/**
 * getCroppedImg - creates a cropped base64 image from an image and crop area
 * @param {HTMLImageElement} image
 * @param {Object} crop - { x, y } percentage values
 * @param {Object} pixelCrop - { x, y, width, height } pixel values
 * @param {Number} rotation
 * @returns base64 dataUrl
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  // draw the cropped area from the source image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // to dataURL
  return canvas.toDataURL('image/png');
}

export default function CropperModal({
  open,
  onClose,
  imageSrc,
  aspect = 1,
  initialZoom = 1,
  onComplete, // (croppedBase64) => void
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete?.(croppedBase64);
      onClose?.();
    } catch (err) {
      console.error('Crop failed', err);
    }
  }, [croppedAreaPixels, imageSrc, onComplete, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Crop Profile Image</h3>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        <div className="relative h-[420px] bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="horizontal-cover"
          />
        </div>

        <div className="p-4 border-t">
          <label className="block text-sm text-gray-700 mb-2">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
