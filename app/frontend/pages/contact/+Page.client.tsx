import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FormEventHandler, useCallback, useId, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { requestImageUploadUrl, submitFeature } from "../../lib/api-client";

Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (position: [number, number]) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function ContactPage() {
  const fileUploadId = useId();
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleLocationSelect = useCallback((position: [number, number]) => {
    setMarkerPosition(position);
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (acceptedFiles.length === 0 || !markerPosition) return;

    const {
      data: { imageKey, uploadUrl },
    } = await requestImageUploadUrl();
    const file = acceptedFiles[0];
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    await submitFeature({
      imageKey,
      latlong: markerPosition.map((coord) => coord.toString()),
    });

    alert("Artwork submitted successfully! It will be reviewed and added to the gallery soon.");
  };

  return (
    <main className="mt-8 mx-auto w-[95%] lg:w-[85%] xl:w-[80%] max-w-6xl">
      <FormHeader />
      <form className="bg-white rounded-lg shadow-lg p-6 md:p-8" onSubmit={onSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-dark-cyan bg-cyan-50 scale-[1.02]"
                  : "border-gray-300 hover:border-dark-cyan hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} id={fileUploadId} />

              <ImageUploadIcon active={isDragActive} />
              <ImageUploadText active={isDragActive} />
            </div>

            {acceptedFiles.length > 0 && <AcceptedFileDisplay file={acceptedFiles[0]} />}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Mark Location</h2>
              <p className="text-sm text-gray-600 mb-4">
                Click on the map to place a marker where the artwork is located
              </p>
            </div>

            <Map handleLocationSelect={handleLocationSelect} markerPosition={markerPosition} />
            {markerPosition && <LocationDisplay position={markerPosition} />}
          </div>
        </div>

        <SubmitButton disabled={acceptedFiles.length === 0 || !markerPosition} />
      </form>
    </main>
  );
}

const FormHeader = () => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-2">Share Art You Found</h1>
    <p className="text-gray-600">
      Upload an image of public art and mark its location to contribute to our community gallery
    </p>
  </div>
);

const ImageUploadIcon = ({ active }: { active: boolean }) => (
  <div className={`mb-4 ${active ? "text-dark-cyan" : "text-gray-400"} transition-colors`}>
    <svg
      className={`w-16 h-16 mx-auto ${active ? "text-dark-cyan" : "text-gray-400"} transition-colors`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  </div>
);

const ImageUploadText = ({ active }: { active: boolean }) => (
  <div className="space-y-2">
    {active ? (
      <>
        <p className="text-lg font-semibold text-dark-cyan">Drop your image here!</p>
        <p className="text-sm text-cyan-600">Release to upload</p>
      </>
    ) : (
      <>
        <p className="text-lg font-semibold text-gray-700">Drag and drop an image here</p>
        <p className="text-sm text-gray-500">
          or <span className="text-dark-cyan font-medium underline">click to browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">Supports: JPEG, PNG, GIF, WebP (max 10MB)</p>
      </>
    )}
  </div>
);

const Map = ({
  handleLocationSelect,
  markerPosition,
}: {
  handleLocationSelect: (position: [number, number]) => void;
  markerPosition: [number, number] | null;
}) => (
  <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
    <MapContainer center={[37.3387, -121.8853]} zoom={13} scrollWheelZoom className="h-80 w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onLocationSelect={handleLocationSelect} />
      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  </div>
);

const AcceptedFileDisplay = ({ file }: { file: File }) => {
  const imageUrl = URL.createObjectURL(file);
  const fileSizeUnit = file.size >= 1024 * 1024 ? "MB" : "KB";
  const fileSize = file.size >= 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) : (file.size / 1024).toFixed(2);

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-green-300"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-green-800">Image Selected</p>
          </div>
          <p className="text-sm text-green-700 truncate">{file.name}</p>
          <p className="text-xs text-green-600">
            {fileSize} {fileSizeUnit}
          </p>
        </div>
      </div>
    </div>
  );
};

const LocationDisplay = ({ position }: { position: [number, number] }) => (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-800">Location Selected</p>
        <p className="text-xs text-blue-600">
          {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </p>
      </div>
    </div>
  </div>
);

const SubmitButton = ({ disabled }: { disabled: boolean }) => (
  <div className="mt-8 flex justify-center">
    <button
      type="submit"
      disabled={disabled}
      className={`px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 ${
        !disabled
          ? "bg-dark-cyan hover:bg-opacity-90 hover:scale-105 shadow-lg hover:shadow-xl"
          : "bg-gray-300 cursor-not-allowed"
      } focus:outline-none focus:ring-4 focus:ring-cyan-200`}
    >
      {disabled ? "Complete Both Steps First" : "Upload Artwork"}
    </button>
  </div>
);
