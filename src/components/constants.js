// constants.js
export const token_id = localStorage.getItem('token');
export const userID = localStorage.getItem('userID');
export const userName = localStorage.getItem('userName');
export const userEmail = localStorage.getItem('userEmail');
export const userDepartmentID = localStorage.getItem('userDepartmentID');
export const userDepartmentName = localStorage.getItem('userDepartmentName');
export const defaultPermissions = {
  manageUsersData: false,
  manageBasicData: false,
  manageBudgetData: false,
  manageProjectData: false,
  manageReportProjectData: false,
  manageKPIData: false,
  manageReportKPIData: false,
  showProjectData: false,
  showReportProjectData: false,
  showKPIData: false,
  showReportKPIData: false,
};

export const userPermission = JSON.parse(localStorage.getItem('userPermission')) || [defaultPermissions];
export const userType = JSON.parse(localStorage.getItem('userType'));

export const monthList = Array.from({ length: 12 }, (_, i) => ({
  no: i,
  name: `${['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][i]}`,
  nameshort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][i],
}));

export const performanceOptions = [
  ...Array.from({ length: 11 }, (_, i) => ({
    id: 100 - i * 10,
    label: `${100 - i * 10}%`,
  })),
];

export const durationOptions = [
  { id: '1', label: 'ตรงตามเวลาที่กำหนด' },
  { id: '2', label: 'ช้ากว่าที่กำหนด' },
  { id: '3', label: 'เร็วกว่าที่กำหนด' },
];

export const setTypeUser = (() => {
  const permission = userPermission[0]; // Assuming userPermission is an array

  if (
    permission.manageUsersData === false &&
    permission.manageBasicData === false &&
    permission.manageBudgetData === false &&
    permission.manageProjectData === true &&
    permission.manageReportProjectData === true &&
    permission.manageKPIData === false &&
    permission.manageReportKPIData === false &&
    permission.showProjectData === true &&
    permission.showReportProjectData === true &&
    permission.showKPIData === false &&
    permission.showReportKPIData === false
  ) {
    return 'generalUser';
  }

  if (
    permission.manageUsersData === false &&
    permission.manageBasicData === false &&
    permission.manageBudgetData === false &&
    permission.manageProjectData === true &&
    permission.manageReportProjectData === true &&
    permission.manageKPIData === true &&
    permission.manageReportKPIData === true &&
    permission.showProjectData === true &&
    permission.showReportProjectData === true &&
    permission.showKPIData === true &&
    permission.showReportKPIData === true
  ) {
    return 'admin';
  }

  if (
    permission.manageUsersData === true &&
    permission.manageBasicData === true &&
    permission.manageBudgetData === true &&
    permission.manageProjectData === true &&
    permission.manageReportProjectData === true &&
    permission.manageKPIData === true &&
    permission.manageReportKPIData === true &&
    permission.showProjectData === true &&
    permission.showReportProjectData === true &&
    permission.showKPIData === true &&
    permission.showReportKPIData === true
  ) {
    return 'superAdmin';
  }

  // Return empty string if no role matches
  return '';
})();
