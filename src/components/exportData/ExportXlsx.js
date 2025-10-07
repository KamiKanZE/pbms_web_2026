import React from 'react';
import { Button } from 'react-bootstrap';
import FileSaver from 'file-saver';
import { utils, write } from 'xlsx';
import moment from 'moment';

const XLSX = require('xlsx');

const ExportCSV = ({ csvData, fileName, wscols, heading, header, tableId }) => {
  // ******** XLSX with object key as header *************
  // const fileType =
  //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  // const fileExtension = ".xlsx";

  // const exportToCSV = (csvData, fileName) => {
  //   const ws = XLSX.utils.json_to_sheet(csvData);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, fileName + fileExtension);
  // };

  // ******** XLSX with new header *************
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const Heading = heading;

  const exportToCSV = (csvData, fileName, wscols, table_id) => {
    // const ws = utils.json_to_sheet(Heading, {
    //   header: header,
    //   skipHeader: true,
    //   origin: 0, //ok
    // });
    // ws['!cols'] = wscols;
    // utils.sheet_add_json(ws, csvData, {
    //   header: header,
    //   skipHeader: true,
    //   origin: -1, //ok
    // });
    // const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    // const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
    // const data = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(data, fileName + fileExtension);

    var workbook = XLSX.utils.table_to_book(table_id);

    // Process Data (add a new row)
    var ws = workbook.Sheets['Sheet1'];
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Created ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)]],
      {
        origin: -1,
      },
    );

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, fileName + fileExtension);
  };
  return (
    <div
      className="box-5"
      style={{ width: 'fit-content' }}
      onClick={e => exportToCSV(csvData, fileName, wscols, tableId)}
    >
      Export Excel
    </div>
  );
};

export default ExportCSV;
