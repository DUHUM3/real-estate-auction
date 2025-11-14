import React from 'react';
import { useNavbarLogic } from './NavbarLogic';
import NavbarUI from './NavbarUI';

/**
 * مكون الشريط التنقل الرئيسي
 * يجمع بين المنطق والعرض
 */
function Navbar({ onLoginClick, onRegisterClick }) {
  const navbarLogic = useNavbarLogic(onLoginClick, onRegisterClick);
  
  return <NavbarUI {...navbarLogic} />;
}

export default Navbar;