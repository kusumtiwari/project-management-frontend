import React from 'react';

type Props = {
  // Define your props here
  text: string
}

const Header: React.FC<Props> = ({text}) => {
  return (
    <h1 className='text-primary-400 text-xl font-semibold'>{text}</h1>
  );
};

export default Header;