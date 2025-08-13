type FeatureCardProps = {
  imgSrc: string;
  title: string;
};

export const FeatureCard = ({ imgSrc, title }: FeatureCardProps) => {
  return (
    <div className="relative w-69 h-69 m-8">
      <img src={imgSrc} alt={title} className="w-full h-full overflow-hidden object-cover rounded-4xl" />
      <h5 className="absolute bottom-0 text-white w-fit mb-4 mx-4 text-xl text-wrap font-extrabold">{title}</h5>
    </div>
  );
};
