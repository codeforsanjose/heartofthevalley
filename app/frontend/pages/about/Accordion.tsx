import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { useId, useLayoutEffect, useRef, useState } from "react";

type AccordionProps = { title: string; content: React.ReactNode };

const useAutoHeight = (open: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  // useLayoutEffect is used to ensure the height transition works correctly
  // It runs synchronously after all DOM mutations, ensuring the height is set when accessing el.scrollHeight
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "height 0.3s ease";
    if (open) {
      // Use a set height (el.scrollHeight) due to animation limitation
      el.style.height = `${el.scrollHeight}px`;
      const onEnd = () => {
        // Set height to auto after the transition ends
        el.style.height = "auto";
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    } else {
      el.style.height = `${el.scrollHeight}px`;
      requestAnimationFrame(() => {
        el.style.height = "0px";
      });
    }
  }, [open]);
  return ref;
};

export const Accordion = ({ title, content }: AccordionProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  // Reuse our zero-dep height animation
  const panelRef = useAutoHeight(open);
  const contentId = useId();

  return (
    <div className="border-t p-3 pl-8 relative">
      <button
        onClick={toggle}
        className="flex w-full items-center pt-8 pb-10 gap-3"
        aria-expanded={open}
        aria-controls={contentId}
      >
        <ArrowRightIcon
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-90 text-grenadier" : "rotate-0 text-black"}`}
        />
        <div className="ml-6">
          <h3
            className={`text-lg font-semibold transition-colors duration-300 text-left ${open ? "text-grenadier" : "text-black"}`}
          >
            {title}
          </h3>
        </div>
      </button>
      <div
        id={contentId}
        ref={panelRef}
        className="overflow-hidden will-change-[height]"
        style={{ height: 0 }}
        role="region"
      >
        <p className={`text-left transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}>{content}</p>
      </div>
    </div>
  );
};
