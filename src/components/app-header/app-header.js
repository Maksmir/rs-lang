import React from 'react';
import Logout from '../Logout';
import s from './app-header.module.css'


function Header() { 
  const user = window.localStorage.getItem('email');

  return (
    <div className={s.header_inner}>
      <div className={s.header_logo}>RSLang</div>
      <div className={s.header_content}>
        <div className={s.header_user}>{user}</div>
        <Logout className={s.header_button} text="Logout" />
      </div>
    </div>
  );
}
export default Header;
