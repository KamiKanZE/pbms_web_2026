// fileUtils.js
import React from 'react'; // Import React to use JSX
import $ from 'jquery';
import axios from 'axios';

export const fetchData = (url, callback) => {
  axios.get(url).then(res => callback(res.data.result));
};
export function base64ToFile(base64String, filename, contentType) {
  const byteCharacters = atob(base64String); // แปลง Base64 เป็น string
  const byteNumbers = new Uint8Array(byteCharacters.length);
  
  // สร้าง Uint8Array จาก string
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // สร้าง Blob
  const blob = new Blob([byteNumbers], { type: contentType });
  
  // สร้าง File จาก Blob
  return new File([blob], filename, { type: contentType });
}

// แปลง customFile เป็น File
// const fileObject = base64ToFile(customFile.data, customFile.filename, customFile.contentType);
export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};

export const createFileMarkup = (element, blobUrl, deleteFileCallback, showDeleteButton) => {
  const fileIcons = {
    'application/pdf': <iframe src={blobUrl} className='m-1' width="100px" height="100px" />,
    'application/msword': <img className='thumbnail' src={`${process.env.PUBLIC_URL}/word.png`} />,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <img className='thumbnail' src={`${process.env.PUBLIC_URL}/word.png`} />,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <img className='thumbnail' src={`${process.env.PUBLIC_URL}/excel.png`} />,
    'application/vnd.ms-excel': <img className='thumbnail' src={`${process.env.PUBLIC_URL}/excel.png`} />,
    'application/vnd.ms-powerpoint': <img className='thumbnail' src={`${process.env.PUBLIC_URL}/ppt.png`} />,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': <img className='thumbnail' src={`${process.env.PUBLIC_URL}/ppt.png`} />,
  };

  const content = fileIcons[element.contentType] || <img className='thumbnail' src={blobUrl} />;

  return (
    <div style={{ width: '120px' }}>
      <a target="_blank" href={blobUrl} download={element.contentType !== 'application/pdf' && element.contentType !== 'image/png' && element.contentType !== 'image/jpg' && element.contentType !== 'image/jpeg' ? element.filename : undefined}>
        {content}
        <br />
        <label className='m-1' style={{ wordBreak: 'break-all', cursor: 'pointer' }}>{element.filename}</label>
      </a>
      {showDeleteButton &&<button
          onClick="(${deleteFileCallback})('${element.filename}')"
          style={{
            position: 'absolute',
            top: '2px',
            right: '5px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '25px',
            height: '25px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            lineHeight: '16px',
          }}>
          x
        </button>}
    </div>
  );
};

export const processFileDocuments = (documents, containerId, deleteFileCallback, showDeleteButton) => {
  $(containerId).find('div:gt(0)').remove();
  documents.forEach(element => {
    const blob = b64toBlob(element.data, element.contentType);
    const blobUrl = URL.createObjectURL(blob);
    $(containerId).append(createFileMarkup(element, blobUrl, deleteFileCallback, showDeleteButton));
  });
};
