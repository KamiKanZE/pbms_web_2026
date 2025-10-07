import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem, Col, Input, Row } from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link, NavLink } from 'react-router-dom';
import Typography from './Typography';
import { Button, Fab, Grid, Icon, Tooltip } from '@material-ui/core';

const bem = bn.create('page');

const Page9 = ({
  title,
  name,
  code,
  id,
  breadcrumbs,
  tag: Tag,
  className,
  children,
  ...restProps
}) => {
  const classes = bem.b('px-3', className);
  const getBasename1 = window.location.pathname.split('/');

  return (
    <>
      <Tag className={classes} {...restProps}>
        <div className="box-1 mb-2">ข้อมูลตัวชี้วัด KPI</div>

        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <div style={{ textAlign: 'left' }}>
                <div className={bem.e('header')}>
                  {title && typeof title === 'string' ? (
                    <Typography type="h5" className={bem.e('title') + ''}>
                      {code !== 'KPI2'
                        ? title
                        : 'ตัวชี้วัด KPI2 ข้อมูลนโยบายนายก ตามประเภทของ KPI'}
                    </Typography>
                  ) : (
                    title
                  )}
                  {/* {breadcrumbs && (
            <Breadcrumb className={bem.e('breadcrumb')}>
              <BreadcrumbItem>
                <Link color="inherit" href="/">
                  หน้าหลัก
                </Link>
              </BreadcrumbItem>
              {breadcrumbs.length &&
                breadcrumbs.map(({ name, active, link }, index) => (
                  <BreadcrumbItem key={index} active={active}>
                    <Link color="inherit" href={link}>
                      {name}
                    </Link>
                  </BreadcrumbItem>
                ))}
            </Breadcrumb>
          )} */}
                </div>
                {getBasename1[2] === 'KPIDataDetail' ? (
                  <div className="flex ml-1">
                    <NavLink to="/KPIData" className="mr-2">
                      {'จัดการข้อมูลตัวชี้วัด KPI '}
                    </NavLink>
                    {' > ข้อมูลตัวชี้วัด ' + code}
                  </div>
                ) : (
                  ''
                )}
                {getBasename1[2] === 'KPIDataDetailProject' ? (
                  <div className="flex ml-1">
                    <NavLink to="/KPIData" className="mr-2">
                      {'จัดการข้อมูลตัวชี้วัด KPI'}
                    </NavLink>
                    <span className="mr-2">{' > '}</span>
                    <NavLink
                      to={`/KPIData/KPIDataDetail/${getBasename1[3]}/${getBasename1[4]}/${getBasename1[5]}`}
                      className="mr-2"
                    >
                      {' ข้อมูลตัวชี้วัด KPI2'}
                    </NavLink>
                    {' > ' + name}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              {/* <div className="box-5">
                <Icon className="mr-1">add_circle</Icon> เพิ่มข้อมูลโครงการ
              </div> */}
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                <Grid item xs={10} md={10}>
                  <div style={{ textAlign: 'right' }}>
                    <Input
                      type="text"
                      name="keyword"
                      placeholder={'ค้นหา' + title}
                      // onChange={this.handleInputChange}
                      // value={this.state.keyword}
                      style={{ width: '100%' }}
                    ></Input>
                  </div>
                </Grid>
                <Grid item xs={2} md={2}>
                  <div className="" style={{ textAlign: 'center' }}>
                    <Tooltip title="Search">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: '#ff962d',
                          outline: 'none',
                        }}
                      >
                        <Icon style={{ color: '#ffffff' }}>search</Icon>
                      </Button>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
          {/* <div className="row">
            <div className="col-6" style={{ textAlign: 'right' }}></div>
          </div> */}
          <hr />
          <div className="mb-3"></div>
          {children}
        </div>
      </Tag>
    </>
  );
};

Page9.propTypes = {
  tag: PropTypes.component,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
  children: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      active: PropTypes.bool,
    }),
  ),
};
Page9.defaultProps = {
  tag: 'div',
  title: '',
};

export default Page9;
