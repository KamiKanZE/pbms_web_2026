import React from 'react';
import axios from 'axios';
import { Button, Col, Row, Label, FormText, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const token_id = localStorage.getItem('token');

const textTd = {
  project_name: 'ชื่อโครงการ',
  project_start: 'ระยะเวลาดําเนินโครงการ (เริ่มต้น)',
  project_finish: 'ระยะเวลาดําเนินโครงการ (สิ้นสุด)',
  project_object: 'วัตถุประสงค์โครงการ',
  project_output_goal: 'เป้าหมายเชิงผลผลิต',
  project_outcome_goal: 'เป้าหมายเชิงผลลัพธ์',
  project_expected_benefit: 'ผลที่คาดว่าจะได้รับ',
  project_benefit: 'กลุ่มเป้าหมาย/ผู้ที่ได้รับประโยชน์',
  project_type_name: 'ข้อมูลประเภทโครงการ',
  project_national_strategy_name: 'ข้อมูลยุทธศาสตร์ชาติ 20 ปี',
  project_master_plan_name: 'แผนแม่บทชาติ',
  project_development_plan_name: 'แผนพัฒนาเศรษฐกิจ',
  project_development_goal_name: 'เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)',
  project_province_strategy_name: 'ข้อมูลยุทธศาสตร์จังหวัด',
  project_local_strategy_name: 'ข้อมูลยุทธศาสตร์องค์การปกครองท้องถิ่น (อปท.)',
  project_municipality_strategy_name: 'ข้อมูลยุทธศาสตร์เทศบาลนครนนทบุรี',
  project_sub_strategy_name: 'กลยุทธ์',
  project_non_livable_name: 'ข้อมูล 6 ดีของจังหวัดนนทบุรี',
  project_it_master_plan_name: 'ข้อมูลแผนปฎิบัติการดิจิทัลระยะ 5 ปี',
  project_smart_city_name: 'ข้อมูล Smart City',
  project_plan_name: 'ข้อมูลแผนงาน',
  project_policy_name: 'ข้อมูลนโยบายนายกเทศมนตรีประจําปี',
  project_revenue_budget_type_name: 'แหล่งที่มาของเงินงบประมาณ (งบประมาณรายรับ)',
  project_expenditure_budget_type_name: 'เงินงบประมาณ (งบประมาณรายจ่าย)',
  project_total_budget: 'ยอดงบประมาณโครงการ',
  project_department_name: 'หน่วยงานเจ้าของโครงการ',
  project_responsible: 'ผู้รับผิดชอบโครงการ',
  project_note: 'หมายเหตุ/บันทึก',
  create_user_data: 'ข้อมูลผลการดำเนินงานของเจ้าของโครงการ',
  project_status: 'สถานะของโครงการ',
};

export default class ImportProject extends React.Component {
  state = {
    excelData: null,
    ArrayData: [],
    logError: null,
    loading: false, // สถานะของโหลดดิ่ง
  };

  chengDate = e => {
    if (e === undefined || e === null) return ''; // Handle undefined or null case

    let finalDate = '';

    if (typeof e === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const daysSinceExcelEpoch = e - 2;
      const date = new Date(excelEpoch.getTime() + daysSinceExcelEpoch * 24 * 60 * 60 * 1000);
      finalDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } else if (typeof e === 'string' && e.includes('/')) {
      finalDate = e; // If it's already a date string
    }

    if (!finalDate) return ''; // Ensure finalDate is valid

    const [date, month, year] = finalDate.split('/');
    const year1 = year - 543;
    return `${year1}-${month.padStart(2, '0')}-${date.padStart(2, '0')} 12:00:00`;
  };

  resetFileInput = () => {
    document.getElementById('file').value = '';
  };

  resetState = () => {
    this.setState({ excelData: null, ArrayData: [], logError: '' });
  };

  handleInputChangeFile = e => {
    e.preventDefault();
    const fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const selectedFile = e.target.files[0];

    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = e => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const ArrayData = [];
        let batch = [];
        json.slice(1).forEach((row, index) => {
          const projectStart = this.chengDate(row.project_start);
          const projectFinish = this.chengDate(row.project_finish);

          // ฟังก์ชันสำหรับแสดงการแจ้งเตือน
          const showAlert = (title, text) => {
            Swal.fire({
              title,
              text,
              icon: 'warning',
              timer: 2500,
            });
          };

          // ตรวจสอบวันที่เริ่มต้นและสิ้นสุด
          if (!projectStart && !projectFinish) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกวันที่เริ่มต้นและวันที่สิ้นสุด');
            return; // ข้ามไปยังรอบถัดไป
          }

          // ตรวจสอบหน่วยงาน
          if (!row.project_department_name) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกหน่วยงาน');
            return; // ข้ามไปยังรอบถัดไป
          }

          // ตรวจสอบแหล่งที่มาของรายได้
          if (!row.project_revenue_budget_type_name && !row.project_expenditure_budget_type_name && !row.project_total_budget) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกแหล่งที่มาของรายได้');
            return; // ข้ามไปยังรอบถัดไป
          }
          batch.push({
            project_name: row.project_name || '',
            project_start: projectStart,
            project_finish: projectFinish,
            project_object: row.project_object || '',
            project_output_goal: row.project_output_goal || '',
            project_outcome_goal: row.project_outcome_goal || '',
            project_expected_benefit: row.project_expected_benefit || '',
            project_benefit: row.project_benefit || '',
            project_type_name: row.project_type_name || '',
            project_national_strategy_name: row.project_national_strategy_name || '',
            project_master_plan_name: row.project_master_plan_name || '',
            project_development_plan_name: row.project_development_plan_name || '',
            project_development_goal_name: row.project_development_goal_name || '',
            project_province_strategy_name: row.project_province_strategy_name || '',
            project_local_strategy_name: row.project_local_strategy_name || '',
            project_municipality_strategy_name: row.project_municipality_strategy_name || '',
            project_sub_strategy_name: row.project_sub_strategy_name || '',
            project_non_livable_name: row.project_non_livable_name || '',
            project_it_master_plan_name: row.project_it_master_plan_name || '',
            project_smart_city_name: row.project_smart_city_name || '',
            project_plan_name: row.project_plan_name || '',
            project_policy_name: row.project_policy_name || '',
            project_revenue_budget_type_name: row.project_revenue_budget_type_name || '',
            project_expenditure_budget_type_name: row.project_expenditure_budget_type_name || '',
            project_total_budget: row.project_total_budget || '',
            project_department_name: row.project_department_name || '',
            project_responsible: row.project_responsible || '',
            project_note: row.project_note || '',
            create_user_data: row.create_user_data || '',
            project_status: row.project_status || '',
          });
        });

        ArrayData.push(batch);
        this.setState({ excelData: json, ArrayData });
      };

      reader.onerror = () => {
        Swal.fire({
          title: 'Error reading file',
          text: 'Could not read the file. Please check the file format.',
          icon: 'error',
          timer: 2500,
        });
      };
    } else {
      Swal.fire({
        title: 'ไฟล์ไม่ถูกต้อง',
        text: 'อนุญาตเฉพาะไฟล์ xlsx และ xls เท่านั้น',
        icon: 'error',
        timer: 2500,
      });
      this.resetFileInput();
    }
  };

  handleSubmit = () => {
    const { ArrayData } = this.state;
    this.setState({ loading: true });
    const promises = ArrayData.map(batch =>
      axios.post(process.env.REACT_APP_SOURCE_URL + '/projects/importExcel', batch, {
        headers: { Authorization: `Bearer ${token_id}` },
      }),
    );

    Promise.all(promises)
      .then(() => {
        this.setState({ excelData: null, ArrayData: [], logError: '', loading: false });
        document.getElementById('file').value = '';
        Swal.fire({
          title: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          timer: 1000,
        });
      })
      .catch(err => {
        this.setState({
          logError: (err.response && err.response.data && err.response.data.message) || 'An error occurred',
          loading: false, // ปิดโหลดดิ่งเมื่อเกิดข้อผิดพลาด
        });
      });
  };

  render() {
    const { logError, excelData, ArrayData, loading } = this.state;
    const headers = Object.keys(textTd);
    return (
      <>
        <Row>
          <Col sm={12}>
            <h3>IMPORT PROJECT</h3>
          </Col>
          <Col sm={12}>
            <span>
              Download template:{' '}
              <a href="/template.xlsx" download>
                template.xlsx
              </a>
            </span>
          </Col>
          <Label for="file" sm={12}>
            แนบไฟล์:
          </Label>
          <Col sm={12}>
            <input
              name="file"
              id="file"
              type="file"
              className="form-control"
              style={{
                width: '100%',
                height: 'fit-content',
                padding: '0',
              }}
              onChange={this.handleInputChangeFile}
            />
            <FormText>คาดหวังประเภทไฟล์ 'xlsx'</FormText>
          </Col>
        </Row>
        {logError && (
          <div className="alert alert-danger" role="alert">
            {logError}
          </div>
        )}
        <Row className="justify-content-center">
          <Col sm={1}>
            <Button
              onClick={this.handleSubmit}
              disabled={!ArrayData.length || loading} // ตรวจสอบ ArrayData และสถานะ loading
              color="primary"
            >
              {loading ? <Spinner size="sm" /> : 'Upload'} {/* แสดง spinner เมื่อโหลด */}
            </Button>
          </Col>
          <Col sm={1}>
            <Button
              onClick={() => {
                this.setState({ excelData: null, ArrayData: [], logError: '' });
                document.getElementById('file').value = ''; // รีเซ็ต input file
              }}
              color="danger"
            >
              Clear
            </Button>
          </Col>
        </Row>
        <div className="viewer">
          {excelData ? (
            <table className="table table-responsive">
              <thead>
                <tr style={{ backgroundColor: '#e0ecfa' }}>
                  {headers.map(key => (
                    <th key={key}>{textTd[key]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ArrayData.flat().length ? (
                  ArrayData.flat().map((row, index) => (
                    <tr key={index}>
                      {headers.map(key => (
                        <td key={key}>{row[key]}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="text-center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p>กรุณาเลือกไฟล์</p>
          )}
        </div>
      </>
    );
  }
}
