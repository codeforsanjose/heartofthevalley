type InputProps = {
  long?: boolean;
  id?: string;
  placeholder: string;
};

export const Input = (props: InputProps) => {
  const { long, placeholder, id } = props;

  const className =
    "w-full rounded-4xl bg-gray-100 border border-gray-300 p-4 focus:border-blue-500 focus:outline-none";

  if (long) return <textarea className={className} placeholder={placeholder} id={id} />;

  return <input type="text" className={className} placeholder={placeholder} id={id} />;
};
