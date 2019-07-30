import React from 'react';
import UploadFile from './uploadFile';

const Header = ({ logoutAction, isAuthenticated, signin }) => {
  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <a href="javascript:void(0);" className="navbar-brand">
          {isAuthenticated && <UploadFile />}
        </a>
        <div className={`right-header-div`}>
          {isAuthenticated && <button className="btn btn-primary" onClick={logoutAction}>Log out</button>}
          {!isAuthenticated && <button className="btn btn-primary" onClick={signin}>Log in</button>}
        </div>
      </nav>
    </div>
  );
}

export default Header;
