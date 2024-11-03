import { createContext, useEffect, useState } from "react";

export const MyContextFun = createContext(null);

export const ContextFun = (props) => {
  const [inc, setInc] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (inc.length > 0) {
      const totalMoney = inc.reduce((fst, sec) => {
        return fst + sec.price;
      }, 0);
      setTotal(totalMoney);
    }
  }, [setInc, inc]);

  console.log("total", total);

  return (
    <MyContextFun.Provider value={{ inc, setInc, total }}>
      {props.children}
    </MyContextFun.Provider>
  );
};
