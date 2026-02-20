import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import PropTypes from 'prop-types';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop, cropShape = 'rect') {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  if (cropShape === 'round') {
    const radius = Math.min(canvas.width, canvas.height) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
  }

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

  if (cropShape === 'round') {
    ctx.restore();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, cropShape === 'round' ? 'image/png' : 'image/jpeg');
  });
}

export default function ImageCropperModal({ 
  image, 
  onCropComplete, 
  onCancel,
  aspectRatio = 16 / 9,
  title = "Crop Image",
  cropShape = 'rect',
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = useCallback(async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels, cropShape);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  }, [croppedAreaPixels, cropShape, image, onCropComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-4xl mx-4 bg-[#2A2A2A] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white montserratFont">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative h-[40vh] bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={cropShape}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-[#2A2A2A]">
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors montserratFont"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleCropConfirm}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors montserratFont"
            >
              Crop & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ImageCropperModal.propTypes = {
  image: PropTypes.string.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  aspectRatio: PropTypes.number,
  title: PropTypes.string,
  cropShape: PropTypes.oneOf(['rect', 'round']),
};
