import React from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportCSV = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        var tempdata = [];
        csvData.map((eachdata) => {
            var link = `https://loyality-points-a920c.web.app/user/${eachdata.id}`;
            var x = {"Name" : eachdata.name, "Vendor Name" : eachdata.vendorname,"Link" : link};
            tempdata.push(x);
        })
        const ws = XLSX.utils.json_to_sheet(tempdata);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button variant="warning" style={{backgroundColor : "#141d1d",borderWidth : 0,color : 'white',fontWeight : 'bolder'}} onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>
    )
}