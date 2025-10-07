import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem, Col, Input, Row } from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link, NavLink } from 'react-router-dom';

import {
  Button,
  Chip,
  Fab,
  Grid,
  Icon,
  LinearProgress,
  styled,
  Tooltip,
} from '@material-ui/core';
import Typography from '../Typography';
import { Doughnut } from 'react-chartjs-2';
import { Chart } from 'chart.js';

const bem = bn.create('page');

const BorderLinearProgress = styled(LinearProgress)(({ colors, them }) => ({
  height: 20,
  borderRadius: 5,
  backgroundColor: colors + '50',
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: colors,
  },
}));

const data = {
  labels: ['จำนวนคงเหลือ', 'จำนวนที่ใช้ไป'],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ['#99CC66', '#22AA99'],
      borderWidth: 1,
    },
  ],
};

const ReportDetailPage = ({
  title,
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
        <div className="box-1 mb-2">ข้อมูลการรายงานผลปี 2565</div>

        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <div style={{ textAlign: 'left' }}>
                <div className={bem.e('header')}>
                  {title && typeof title === 'string' ? (
                    <Typography type="h5" className={bem.e('title') + ''}>
                      ข้อมูลโครงการ XXX
                    </Typography>
                  ) : (
                    title
                  )}
                </div>
                <div className="flex">
                  <NavLink to="/ReportActivities" className="mr-2">
                    {'ข้อมูลการายงานผลปี 2565'}
                  </NavLink>
                  {' > ข้อมูลโครงการ XXX'}
                </div>
              </div>
            </Grid>
          </Grid>
          <hr />
          <div className="box-2-1">
            <Grid container spacing={1} className="flex">
              <Grid item sm={12} md={8}>
                <Grid container spacing={1} className="flex">
                  <Grid item sm={12} md={12}>
                    <span>ความก้าวหน้ารวมของโครงการ</span>
                  </Grid>
                  <Grid item sm={12} md={9}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={80}
                      colors={'#323BA5'}
                    />
                  </Grid>
                  <Grid item sm={12} md={3}>
                    <Chip
                      label="80%"
                      color="primary"
                      size="small"
                      style={{ backgroundColor: '#323BA5' }}
                    />
                  </Grid>
                  <Grid item sm={12} md={12}>
                    <span>ยอดงบประมาณที่ใช้ไปของโครงการ 700,000 ฿</span>
                  </Grid>
                  <Grid item sm={12} md={9}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={70}
                      colors={'#22AA99'}
                    />
                  </Grid>
                  <Grid item sm={12} md={3}>
                    <Chip
                      label="70%"
                      color="primary"
                      size="small"
                      style={{ backgroundColor: '#22AA99' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={4}>
                <Doughnut
                  options={{
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                  }}
                  data={data}
                />
                <div
                  style={{
                    color: '#000000',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  ยอดรวมโครงการ :
                  <span style={{ color: '#99CC66' }}> 1,000,000 ฿</span>
                </div>
                <div
                  style={{
                    color: '#000000',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  ประเภท: รายได้ที่รัฐบาลอุดหนุนให้องค์กรปกครองส่วนท้องถิ่น
                </div>
              </Grid>
            </Grid>
          </div>
          <hr />
          <Col sm={12}>
            <div className="box-9">
              {getBasename1[2] === 'ReportDetail1' ? 'ข้อมูลหลัก' : ''}
              {getBasename1[2] === 'ReportDetail2' ? 'ข้อมูลกิจกรรม' : ''}
              {getBasename1[2] === 'ReportDetail3' ? 'ข้อมูลตัวชี้วัด' : ''}
              {getBasename1[2] === 'ReportDetail4' ? 'ข้อมูลความเสี่ยง' : ''}
            </div>
          </Col>
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={6} md={3}>
              <Link to="/ReportActivities/ReportDetail1">
                <div
                  className={
                    getBasename1[2] === 'ReportDetail1' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลหลัก
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to="/ReportActivities/ReportDetail2">
                <div
                  className={
                    getBasename1[2] === 'ReportDetail2' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลกิจกรรม
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to="/ReportActivities/ReportDetail3">
                <div
                  className={
                    getBasename1[2] === 'ReportDetail3' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลตัวชี้วัด
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to="/ReportActivities/ReportDetail4">
                <div
                  className={
                    getBasename1[2] === 'ReportDetail4' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลความเสี่ยง
                </div>
              </Link>
            </Grid>
          </Grid>
          <hr />
          <div className="mb-3"></div>
          {children}
        </div>
      </Tag>
    </>
  );
};

ReportDetailPage.propTypes = {
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
ReportDetailPage.defaultProps = {
  tag: 'div',
  title: '',
};

export default ReportDetailPage;
