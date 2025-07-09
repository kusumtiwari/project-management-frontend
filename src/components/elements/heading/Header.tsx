import React from 'react';

type Props = {
  text: string;
  rightContent?: any;  // optional prop to accept JSX
};

const Header: React.FC<Props> = ({ text, rightContent }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-primary text-xl font-semibold">{text}</h1>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default Header;
