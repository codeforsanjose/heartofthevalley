import { useId } from "react";
import { Input } from "../../components/Input";

export default function ContactPage() {
  const fullNameId = useId();
  const emailId = useId();
  const messageId = useId();

  return (
    <main className="mt-[10%] mx-auto w-[70%] lg:w-[50%]">
      <h1 className="text-3xl flex justify-center">We&apos;d love to hear from you</h1>
      <form className="mt-4">
        <div className="my-4">
          <label className="mx-4" htmlFor={fullNameId}>
            Full Name
          </label>
          <Input placeholder="Full Name" id={fullNameId} />
        </div>
        <div className="my-4">
          <label className="mx-4" htmlFor={emailId}>
            Email
          </label>
          <Input placeholder="Email" id={emailId} />
        </div>
        <div className="my-4">
          <label className="mx-4" htmlFor={messageId}>
            Message
          </label>
          <Input placeholder="Message" id={messageId} long />
        </div>
        <button
          type="submit"
          className="mt-4 mx-auto rounded-4xl bg-dark-cyan text-white p-4 focus:outline-none w-[20%] flex justify-center cursor-pointer"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
