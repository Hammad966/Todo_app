import React from "react";

const Footer = () => {
  return (
    <div className="flex bg-slate-800 text-white flex-col justify-center items-center fixed bottom-0 w-full">
      <div className="logo font-bold text-white text-2xl">
        <span className="text-green-500 text-2xl"> &lt;</span>
        <span className="text-lg">Pass</span>
        <span className="text-green-500 text-xl">OP/&gt;</span>
      </div>
      <div className="flex justify-center items-center mb-2">
        Created with <span className="material-symbols-outlined mx-1">
favorite
</span>{" "}
       by HammadAhmad
      </div>
    </div>
  );
};

export default Footer;
