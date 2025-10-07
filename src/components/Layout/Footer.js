import React from 'react';

import { Navbar, Nav, NavItem } from 'reactstrap';

import SourceLink from 'components/SourceLink';

const Footer = () => {
  return (
    <div className='footer' style={{height: '100%'}}>
      <div className='col-md-12' style={{bottom:'0px',height: '100%',alignContent: 'end'}}>
      {/* <Nav navbar> */}
        {/* <NavItem> */}
          Project and Budget Monitoring System By MyBizThailand.
          {/* <SourceLink>Github</SourceLink> */}
        {/* </NavItem> */}
      {/* </Nav> */}
      </div>
    </div>
  );
};

export default Footer;
