'use client';
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function ImageUploader({ image, setImage, setShape, setAlign }) {
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });

  const getCroppedImage = async () => {
    const imageObj = await createImage(rawImage);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(
      imageObj,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
    return canvas.toDataURL("image/jpeg");
  };

  const handleCropSave = async () => {
    const croppedImg = await getCroppedImage();
    setImage(croppedImg);
    setShowCropper(false);
  };

  return (
    <div className="border rounded p-3 space-y-3">
      <h3 className="font-semibold">Profile Image</h3>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              setRawImage(reader.result);
              setShowCropper(true);
            };
            reader.readAsDataURL(file);
          }
        }}
        className="w-full"
      />

      {/* Preview */}
      {image && <img src={image} className="w-40 h-40 object-cover border rounded" alt="profile" />}

      {/* Shape */}
      <div className="space-y-1">
        <label className="font-semibold">Image Shape</label>
        <select className="w-full border p-2 rounded" onChange={(e) => setShape(e.target.value)}>
          <option value="circle">Circle</option>
          <option value="rounded">Rounded</option>
          <option value="square">Square</option>
        </select>
      </div>

      {/* Alignment */}
      <div className="space-y-1">
        <label className="font-semibold">Alignment</label>
        <select className="w-full border p-2 rounded" onChange={(e) => setAlign(e.target.value)}>
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* Cropper */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-xl w-[90%] max-w-xl">
            <h2 className="font-semibold mb-3">Crop Image</h2>
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(e.target.value)} className="w-full mt-3" />
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCropper(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCropSave}>Save Cropped Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
