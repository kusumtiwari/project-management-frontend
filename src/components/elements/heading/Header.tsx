import React from 'react';

type Props = {
  text: string;
  rightContent?: any;  // optional prop to accept JSX
};

const Header: React.FC<Props> = ({ text, rightContent }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{text}</h1>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default Header;

