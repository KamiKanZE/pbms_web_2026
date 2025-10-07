import React, { useRef, useMemo } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, FormGroup, keyword } from 'reactstrap';
import { border, display } from '@mui/system';
import { useDownloadExcel } from 'react-export-table-to-excel';
import moment from 'moment';

export default function ExportBudget(e) {
  const tableRef = useRef(null);
  const tableRef1 = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: e.fileName,
    sheet: 'ข้อมูลโครงการ',
  });

  // Memoize sorted data
  // const sortedData = useMemo(() => {
  //   return [...e.DataExport].sort((a, b) => (a.project_id > b.project_id ? -1 : 1));
  // }, [e.DataExport]);

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
    let year = new Date(end)
      .toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .toString()
      .substr(-2);
    if (monthend >= 9 && monthend < 12) {
      tend = 1;
    } else if (monthend < 3) {
      tend = 2;
    } else if (monthend >= 3 && monthend < 6) {
      tend = 3;
    } else if (monthend >= 6 && monthend < 9) {
      tend = 4;
    }
    return tstart != tend ? 'ไตรมาส ' + tstart + '-' + tend + (tstart > tend ? ' ปี ' + (tend == 1 ? +year + 1 : year) : '') : 'ไตรมาส' + tstart;
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
    if (!e || !moment(e).isValid()) {
      return '';
    }

    const date = moment(e);
    const listMonth = [
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

    const monthThai = (listMonth.find(list => list.no === date.month()) || {}).name || '';
    return `${date.date()} ${monthThai} ${date.year() + 543}`;
  }

  function countDate(a, b) {
    if (!a || !b) return '';
    const diff = moment(b).diff(moment(a), 'days');
    const total = diff >= 0 ? diff + 1 : 0;
    return total === 1 ? '( จำนวน 1 วัน)' : `${total} วัน`;
  }

  return (
    <Row className="m-0">
      <div className="box-5 ml-2" onClick={onDownload} style={{ textWrap: 'nowrap' }}>
        ส่งออก Excel
      </div>
      <div ref={tableRef} sm={12} className="p-0" style={{ display: 'none' }}>
        <Col sm={12}>
          <Table responsive borderless className="tableb" id="table1" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ลำดับ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ชื่อโครงการ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ยุทธศาสตร์</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>แผนงาน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>งบประมาณตามเทศบัญญัติ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>แหล่งที่มาของงบประมาณ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>รอบระยะเวลา</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ผลการดำเนินงาน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>วันเริ่มต้นโครงการและวันสิ้นสุดโครงการ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>งบประมาณเบิกจ่าย</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ปัญหาอุปสรรค</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>ข้อเสนอแนะ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {e.DataExport.length === 0 ? (
                <tr>
                  <td colSpan="13" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                e.DataExport.map((id, i) => (
                  <tr key={'table' + i}>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{++i}</td>
                    <td style={{ border: '1px solid black' }}>{id.project_name}</td>
                    <td style={{ border: '1px solid black' }}>{id.project_municipality_strategy?id.project_municipality_strategy_name:''}</td>
                    <td style={{ border: '1px solid black' }}>{id.project_plan_name}</td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {id.project_total_budget ? moneyFormat(id.project_total_budget) : '0.00'}
                    </td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {id.project_revenue_budget_type_name}
                    </td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {getTrimas(id.project_start, id.project_finish)}
                    </td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {projectProgressStatus(id.project_status)}
                    </td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {thaiDate(id.project_start) + ' - ' + thaiDate(id.project_finish)}
                      <br />
                      {countDate(id.project_start, id.project_finish)}
                    </td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>
                      {id.project_current_amount ? moneyFormat(id.project_current_amount) : '0.00'}
                    </td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{id.problem}</td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{id.counsel}</td>
                    <td style={{ border: '1px solid black', textAlign: 'center' }}>{id.project_note}</td>
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
