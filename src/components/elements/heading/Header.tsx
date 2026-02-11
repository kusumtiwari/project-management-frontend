import React from 'react';

type Props = {
  text: string;
  subtext?: string;
  rightContent?: any;  // optional prop to accept JSX
};

const Header: React.FC<Props> = ({ text, subtext, rightContent }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">{text}</h1>
        {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div> 
  );
};

export default Header;

