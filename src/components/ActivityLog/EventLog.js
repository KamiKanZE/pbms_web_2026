import React, { useRef } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, FormGroup, keyword, Button } from 'reactstrap';
import { border, display } from '@mui/system';
import { useDownloadExcel } from 'react-export-table-to-excel';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { Grid } from '@material-ui/core';
import { getColor } from 'utils/colors';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-thai-datepickers';
import 'moment/locale/th';
import $ from 'jquery';
const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 2,
    }}
  />
);
export default function EventLog({ DataExport }) {
  const tableRef = useRef(null);
  const tableRef1 = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'ข้อมูลงบประมาณ ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543),
    sheet: 'ข้อมูลงบประมาณ',
  });
  function moneyFormat(e) {
    return e === 0 ? '0.00' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  }
  function getTrimas(start, end) {
    let tstart;
    let tend;
    const monthstart = new Date(start).getMonth();
    const monthend = new Date(end).getMonth();

    if (monthstart >= 9 && monthstart < 12) {
      tstart = 1;
    } else if (monthstart < 3) {
      tstart = 2;
    } else if (monthstart > 2 && monthstart < 6) {
      tstart = 3;
    } else if (monthstart > 5 && monthstart < 9) {
      tstart = 4;
    }
    if (monthend >= 9 && monthend < 12) {
      tend = 1;
    } else if (monthend < 3) {
      tend = 2;
    } else if (monthend >= 3 && monthend < 6) {
      tend = 3;
    } else if (monthend >= 6 && monthend < 9) {
      tend = 4;
    }
    return tstart != tend ? 'ไตรมาส ' + tstart + '-' + tend : 'ไตรมาส' + tstart;
  }
  function projectProgressStatus(e) {
    let status;
    if (e === 0) {
      status = 'โครงการยังไม่ดำเนินการ';
    }
    if (e === 1) {
      status = 'โครงการได้ตามกำหนดการ';
    }
    if (e === 2) {
      status = 'โครงการดำเนินการแล้วแต่ล่าช้า';
    }
    if (e === 3) {
      status = 'โครงการเบิกเงินแล้วสิ้นสุด';
    }
    if (e === 4) {
      status = 'โครงการยกเลิก';
    }
    if (e === 5) {
      status = 'โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ';
    }
    return status;
  }

  function thaiDate(e) {
    const monthList = [
      { no: 0, name: 'ม.ค.' },
      { no: 1, name: 'ก.พ.' },
      { no: 2, name: 'มี.ค.' },
      { no: 3, name: 'เม.ย.' },
      { no: 4, name: 'พ.ค.' },
      { no: 5, name: 'มิ.ย.' },
      { no: 6, name: 'ก.ค.' },
      { no: 7, name: 'ส.ค.' },
      { no: 8, name: 'ก.ย.' },
      { no: 9, name: 'ต.ค.' },
      { no: 10, name: 'พ.ย.' },
      { no: 11, name: 'ธ.ค.' },
    ];
    var date = moment(e).get('date');
    var month = moment(e).get('month');
    var year = moment(e).get('year') + 543;

    let monthThai = monthList.filter(list => list.no === month)[0].name;
    
    return e != undefined ? date + ' ' + monthThai + ' ' + year : '';
  }
  const getTime = e => {
    var h = moment(e).get('hour');
    var m = moment(e).get('minute');
    var s = moment(e).get('second');
    
    return e != undefined ? h + ':' + m + ':' + s + ' น.' : '';
  };
  function countDate(a, b) {
    var a = moment(a);
    var b = moment(b);
    var diff = b.diff(a, 'days');
    return diff >= 0 ? diff + 1 : 0;
  }
  // let i = 1
  // const dataset =[]
  // if(data){
  // data.map((k,i)=>{
  //    const obj=k
  //    obj.sort= i
  //    dataset.push(obj)
  //     })
  // }
  const secondaryColor = getColor('secondary');
  return (
    <Row className="m-0">
      <Grid item xs={12} md={12} style={{ display: 'flex', justifyContent: 'end' }}>
        <Button color="secondary" onClick={onDownload}>
          พิมพ์ข้อมูล
        </Button>
      </Grid>
      <div ref={tableRef} sm={12} className="p-0" style={{ display: 'none' }}>
        <Col sm={12}>
          <Table
            responsive
            borderless
            className="tableb"
            id="table1"
            style={{
              border: '1px solid black',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ลำดับ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>วันที่</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เวลา</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ประเภทข้อมูล</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>โครงการที่เกี่ยวข้อง</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>กิจกรรมที่เกี่ยวข้อง</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ผู้ทำรายการ</th>
              </tr>
            </thead>
            <tbody>
              {DataExport.length == 0 ? (
                <tr>
                  <td colSpan="7" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                DataExport.map((id, i) => (
                  <tr key={'table' + i}>
                    <td
                      style={{
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      {++i}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      {thaiDate(id.create_at)}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      {getTime(id.create_at)}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      {id.action_type.name}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                      }}
                    >
                      {id.project_name}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                      }}
                    >
                      {id.activity_name}
                    </td>
                    <td
                      style={{
                        border: '1px solid black',
                        textAlign: 'center',
                      }}
                    >
                      {id.user}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </div>
    </Row>
  );
}
