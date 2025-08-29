type FeatureCardProps = {
  id: string;
  imgSrc: string;
  title: string;
};

export const FeatureCard = ({ imgSrc, title, id }: FeatureCardProps) => {
  return (
    <a href={`/features/${id}`} className="relative w-69 h-69 m-8">
      <img src={imgSrc} alt={title} className="w-full h-full overflow-hidden object-cover rounded-4xl" />
      <h5 className="absolute bottom-0 text-white w-fit mb-4 mx-4 text-xl text-wrap font-extrabold">{title}</h5>
    </a>
  );
};
