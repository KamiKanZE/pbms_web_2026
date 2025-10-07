import React from 'react';
import { Grid } from '@material-ui/core';

const GridSelect = ({ xs, md, label, name, value, onChange, options }) => (
  <Grid item xs={xs} md={md} style={{ textAlign: 'right', display: 'flex', justifyContent: 'right' }}>
    <div className="flex">
      <div className="mb-0" style={{ whiteSpace: 'nowrap', width: '100px' }}>{label}</div>
      <div className="mb-0 ml-1">
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="form-control"
          style={{ width: '100%' }}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </Grid>
);

export default GridSelect;
