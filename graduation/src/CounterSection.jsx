import React from "react";
import CounterItem from "./CounterItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiagramProject,
  faHandHoldingDollar,
  faUsers,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const stats = [
  {
    end: 130,
    label: "Projects",
    icon: faDiagramProject,
  },
  {
    end: 110,
    label: "Investors",
    icon: faHandHoldingDollar,
  },
  {
    end: 250,
    label: "Users",
    icon: faUsers,
  },
  {
    end: 190,
    label: "Success Stories",
    icon: faStar,
  },
];

const CounterSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8  w-[1250px] font-monst">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-2">
              <FontAwesomeIcon icon={item.icon} className="text-blue-900 text-4xl mb-2" />
              <CounterItem end={item.end} label={item.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
