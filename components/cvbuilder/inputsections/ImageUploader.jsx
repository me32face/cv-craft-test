'use client';
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function ImageUploader({ image, setImage, setShape, setAlign, onClose, onNext }) {
  const [tempImage, setTempImage] = useState(null); 
  const [cropping, setCropping] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [selectedShape, setSelectedShape] = useState("circle");
  const [selectedAlign, setSelectedAlign] = useState("center");

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result); // show for cropping
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  // Capture crop area
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Convert crop area to final image
  const getCroppedImage = useCallback(async () => {
    if (!tempImage || !croppedAreaPixels) return;

    const imageObj = new Image();
    imageObj.src = tempImage;

    await new Promise((res) => (imageObj.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

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

    const croppedBase64 = canvas.toDataURL("image/jpeg");

    setImage(croppedBase64);
    setTempImage(null);
    setCropping(false);
  }, [tempImage, croppedAreaPixels, setImage]);

  // Shape change
  const handleShapeChange = (shape) => {
    setSelectedShape(shape);
    setShape(shape);
  };

  // Alignment
  const handleAlignChange = (align) => {
    setSelectedAlign(align);
    setAlign(align);
  };

  return (
    <div className="max-w-lg mx-auto">
      
      {/* CROPPING UI */}
      {cropping && tempImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-xl">
            <h2 className="text-xl font-bold mb-3 text-indigo-700">Crop Your Photo</h2>

            <div className="relative w-full h-72 bg-gray-200 rounded-xl overflow-hidden">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom slider */}
            <div className="mt-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setCropping(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={getCroppedImage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div className={`${cropping ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-indigo-700 mb-1">Upload Your Photo</h2>
        <p className="text-sm text-gray-500 mb-4">Preferred size: 200×200, Max 1MB.</p>

        {/* Upload */}
        <div className="flex gap-3">
          <input
            type="file"
            accept="image/*"
            id="photo-upload"
            className="hidden"
            onChange={handleImageUpload}
          />

          <label
            htmlFor="photo-upload"
            className="px-4 py-1 bg-indigo-600 text-white rounded-lg cursor-pointer"
          >
            Upload +
          </label>

          {image && (
            <button
              onClick={() => setImage(null)}
              className="px-4 py-1 bg-red-600 text-white rounded-lg"
            >
              Remove
            </button>
          )}
        </div>

        {/* Preview */}
        <div className="flex justify-center py-4">
          {image ? (
            <div
              className="relative w-48 h-48 overflow-hidden border-4 border-indigo-200 shadow-md"
              style={{
                borderRadius:
                  selectedShape === "circle"
                    ? "50%"
                    : selectedShape === "rounded"
                    ? "1.5rem"
                    : "0",
                justifyContent:
                  selectedAlign === "left"
                    ? "flex-start"
                    : selectedAlign === "right"
                    ? "flex-end"
                    : "center",
                display: "flex",
              }}
            >
              <img src={image} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-full bg-indigo-600"></div>
          )}
        </div>

        {/* Shape & Align */}
        {image && (
          <div className="flex justify-center gap-2 py-4 flex-wrap">
            {/* Shape */}
            {["circle", "rounded", "square"].map((s) => (
              <button
                key={s}
                onClick={() => handleShapeChange(s)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  selectedShape === s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}

            <div className="w-px bg-gray-300 mx-1" />

            {/* Align */}
            {["left", "center", "right"].map((a) => (
              <button
                key={a}
                onClick={() => handleAlignChange(a)}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  selectedAlign === a
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between pt-4 text-sm">
          <button onClick={onClose} className="px-4 py-1 bg-gray-200 rounded-lg">
            Cancel
          </button>

          <button onClick={onClose} className="px-4 py-1 bg-indigo-200 rounded-lg">
            Save Changes
          </button>

          <button onClick={onNext} className="px-4 py-1 bg-indigo-600 text-white rounded-lg">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
