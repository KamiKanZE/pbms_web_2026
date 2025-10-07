import React, { useRef } from 'react';
import axios from 'axios';
import Page from 'components/Page';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, FormGroup, keyword } from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Chip, Fab, Grid, Button, LinearProgress, styled } from '@material-ui/core';
import $ from 'jquery';
import { display } from '@mui/system';
import { useDownloadExcel } from 'react-export-table-to-excel';
import moment from 'moment';
import html2canvas from 'html2canvas';

const token_id = localStorage.getItem('token');

// const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
//   height: 7,
//   borderRadius: 5,
//   backgroundColor: colors + '50',
//   [`& .MuiLinearProgress-bar`]: {
//     borderRadius: 5,
//     backgroundColor: colors,
//   },
// }));

export default function SampleHook(e) {
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'ข้อมูลงบประมาณ ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543),
    sheet: 'ข้อมูลงบประมาณ',
  });
  function takeshot() {
    let div = document.getElementById('gendiv11');

    html2canvas(div).then(function (canvas) {
      //document.getElementById('output').appendChild(canvas);
      // document.getElementById('output').src;
      //let canvas2 = document.getElementById('output');
      const img = canvas.toDataURL('image/png');
      var a = document.createElement('a'); //Create <a>
      a.href = img; //Image Base64 Goes here
      a.download = `Image_project${moment()}.png`; //File name Here
      a.click(); //Downloaded file
      //document.write('<a src="' + img + '" download/>');
      //window.location.href(img)
    });
  }
  function moneyFormat(e) {
    return e === 0 || e === '0' || !e || isNaN(e) ? '0.00' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  }

  const moneyFormat1 = value => (value === 0 || value === '0' || !value || isNaN(value) ? '0' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value));
  return (
    <Row>
      <Col sm={6}></Col>
      <Col sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className="box-5 mb-2" onClick={onDownload}>
          {' '}
          ส่งออก excel{' '}
        </div>

        <div className="box-16 ml-2 mb-2" onClick={takeshot}>
          ส่งออก PNG
        </div>
      </Col>
      <div ref={tableRef} id="gendiv11" className="col-md-12 p-0">
        <Col sm={12}>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table">
            <thead>
              <tr>
                <th colSpan={7} className="p-0">
                  <div className="box-20 mb-2">รายการงบประมาณ</div>
                </th>
              </tr>
              <tr style={{ backgroundColor: '#e0ecfa' }}>
                <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณรายรับ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณรายจ่าย</th>
                {/* <th style={{ textAlign: 'center' }}>งบประมาณที่จัดสรรแล้ว</th>                 */}
                <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {e.dataset.length == 0 && e.dataset1.length == 0 ? (
                <tr>
                  <td colSpan="7" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                <tr key={'table'}>
                  <td>งบประมาณทั้งหมด</td>
                  {/* <td>{id.budget_source_id}</td> */}
                  <td style={{ textAlign: 'center' }}>{e.year}</td>
                  <td style={{ textAlign: 'center' }}>{moneyFormat1(e.sumproject)}</td>
                  <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(e.reven))}</td>
                  <td style={{ textAlign: 'center' }}>
                    {moneyFormat(parseFloat(e.expen))}
                  </td>
                  {/* <td style={{ textAlign: 'center' }}>
                    {moneyFormat(parseFloat(e.expenset))}
                  </td> */}
                  <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(e.reven) - parseFloat(e.expen)) || Number(0)}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
        <Col sm={12}>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table1">
            <thead>
              <tr>
                <th colSpan={8} className="p-0">
                  <div className="box-18 mb-2">รายการงบประมาณรายรับ</div>
                </th>
              </tr>
              <tr style={{ backgroundColor: '#0099ff' }}>
                <th style={{ textAlign: 'center' }}>ลำดับ</th>
                {/* <th>BudgetSouceID</th> */}
                <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                {/* <th style={{ textAlign: 'center' }}>งบประมาณที่จัดสรรแล้ว</th>    */}
                <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th> 
                <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th> 
              </tr>
            </thead>
            <tbody>
              {e.dataset.length == 0 ? (
                <tr>
                  <td colSpan="8" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                e.dataset
                  .sort((a, b) => (a.revenue_budget_type > b.revenue_budget_type ? -1 : 1))
                  .map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      {/* <td>{id.budget_source_id}</td> */}
                      <td>{id.revenue_budget_type_name}</td>
                      <td style={{ textAlign: 'center' }}>{id.revenue_budget_year}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat1(id.total_project)}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(id.revenue_budget_estimate).toString() !== 'NaN' ? moneyFormat(id.revenue_budget_estimate) : '0.00'}</td>
                      {/* <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(id.project_set_budget))}</td> */}
                      <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(id.project_used_budget))}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(parseFloat(id.project_balance_budget))}</td>
                    </tr>
                  ))
              )}
              <tr style={{ backgroundColor: '##0099ff' }}>
                <th colSpan={2} style={{ textAlign: 'center' }}>
                  รวม
                </th>
                <th style={{ textAlign: 'center' }}>{e.year}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat1(e.project)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.reven)}</th>
                {/* <th style={{ textAlign: 'center' }}>{moneyFormat(e.revenset)}</th> */}
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.revenuse)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.reven - e.revenuse)}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table2">
            <thead>
              <tr>
                <th colSpan={8} className="p-0">
                  <div className="box-19 my-2">รายการงบประมาณรายจ่าย</div>
                </th>
              </tr>
              <tr style={{ backgroundColor: '#ffc6c6' }}>
                <th style={{ textAlign: 'center' }}>ลำดับ</th>
                {/* <th>BudgetSouceID</th> */}
                <th style={{ textAlign: 'center', width: '300px' }}>ข้อมูล</th>
                <th style={{ textAlign: 'center' }}>ปีงบประมาณ</th>
                <th style={{ textAlign: 'center' }}>จำนวนโครงการ</th>
                <th style={{ textAlign: 'center' }}>งบประมาณที่ตั้งไว้</th>
                {/* <th style={{ textAlign: 'center' }}>งบประมาณที่จัดสรรแล้ว</th>  */}
                <th style={{ textAlign: 'center' }}>งบประมาณที่ใช้ไป</th>
                <th style={{ textAlign: 'center' }}>งบประมาณคงเหลือ</th>                
              </tr>
            </thead>
            <tbody>
              {e.dataset1.length == 0 ? (
                <tr>
                  <td colSpan="8" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                e.dataset1
                  .sort((a, b) => (a.expenditure_budget_id > b.expenditure_budget_id ? -1 : 1))
                  .map((id, i) => (
                    <tr key={'table' + i}>
                      <td style={{ textAlign: 'center' }}>{i + 1}</td>
                      <td>{id.expenditure_budget_type_name}</td>
                      <td style={{ textAlign: 'center' }}>{id.expenditure_budget_year}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat1(id.total_project)}</td>
                      <td style={{ textAlign: 'center' }}>
                        {moneyFormat(id.expenditure_budget_estimate).toString() !== 'NaN' ? moneyFormat(id.expenditure_budget_estimate) : '0.00'}
                        {/* {moneyFormat(id.project_total_budget)} */}
                      </td>
                      {/* <td style={{ textAlign: 'center' }}>{moneyFormat(id.project_set_budget)}</td> */}
                      <td style={{ textAlign: 'center' }}>{moneyFormat(id.project_used_budget)}</td>
                      <td style={{ textAlign: 'center' }}>{moneyFormat(id.project_balance_budget)}</td>
                    </tr>
                  ))
              )}
              <tr style={{ backgroundColor: '##0099ff' }}>
                <th colSpan={2} style={{ textAlign: 'center' }}>
                  รวม
                </th>
                {/* <th>BudgetSouceID</th> */}
                <th style={{ textAlign: 'center' }}>{e.year}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat1(e.project1)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.expen)}</th>
                {/* <th style={{ textAlign: 'center' }}>{moneyFormat(e.expenset)}</th> */}
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.expenuse)}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(e.expen - e.expenuse)}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col style={{ display: 'none' }}>
          ออก ณ วันที่{' '}
          {new Date()
            .toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            .toString()}
        </Col>
      </div>
    </Row>
  );
}
