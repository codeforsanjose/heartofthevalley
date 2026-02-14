import { useId } from "react";

export default function ContactPage() {
  const fileUploadId = useId();

  return (
    <main className="mt-[10%] mx-auto w-[70%] lg:w-[50%]">
      <h1 className="text-3xl flex justify-center">Upload a file</h1>
      <form className="mt-4">
        <div className="my-4">
          <label className="mx-4" htmlFor={fileUploadId}>
            Choose File
          </label>
          <input
            type="file"
            id={fileUploadId}
            className="mx-4 mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-dark-cyan file:text-white hover:file:bg-opacity-80"
          />
        </div>
        <button
          type="submit"
          className="mt-4 mx-auto rounded-4xl bg-dark-cyan text-white p-4 focus:outline-none w-[20%] flex justify-center cursor-pointer"
        >
          Upload
        </button>
      </form>
    </main>
  );
}
