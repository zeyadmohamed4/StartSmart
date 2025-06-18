import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const CounterItem = ({ end, label, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const incrementTime = duration / end;
      const counter = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(counter);
      }, incrementTime);

      return () => clearInterval(counter);
    }
  }, [inView, end, duration]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center ms-2"
    >
      <h3 className="text-4xl py-2 font-bold text-[#00192F] font-monst">
        {count}+
      </h3>
      <p className="text-lg text-gray-500 font-lato">{label}</p>
    </div>
  );
};

export default CounterItem;
