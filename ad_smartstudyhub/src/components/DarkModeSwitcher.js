import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import useColorMode from '~/hooks/useColorMode';

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <label
        className={`relative m-0 block h-8 w-14 rounded-full ${
          colorMode === 'dark' ? 'bg-[#3C50E0]' : 'bg-[#E2E8F0]'
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === 'function') {
              setColorMode(colorMode === 'light' ? 'dark' : 'light');
            }
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            colorMode === 'dark' && '!right-[3px] !translate-x-full'
          }`}
        >
          <FontAwesomeIcon icon={faSun} className="dark:hidden" />
          <FontAwesomeIcon icon={faMoon} className="hidden dark:inline-block" />
        </span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
