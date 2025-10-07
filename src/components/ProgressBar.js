import React from 'react';
import { Grid, Chip, LinearProgress, styled } from '@material-ui/core';

const BorderLinearProgress = styled(LinearProgress)(({ colors }) => ({
  height: 7,
  borderRadius: 5,
  backgroundColor: colors + '50',
  '& .MuiLinearProgress-bar': { borderRadius: 5, backgroundColor: colors },
}));

function ProgressBar({ dataprogress, datapic }) {
  let color;
  if (dataprogress === 0) {
    color = '#BBBBBB';
  } else if (dataprogress < 20) {
    color = '#ee4444';
  } else if (dataprogress < 60) {
    color = '#ffaa22';
  } else if (dataprogress <= 99) {
    color = '#99CC66';
  } else {
    color = '#22AA99';
  }

  return (
    <Grid container spacing={1} className="flex">
      <Grid item sm={12} md={8}>
        <BorderLinearProgress
          variant="determinate"
          value={parseFloat(dataprogress)}
          colors={color}
        />
      </Grid>
      <Grid item sm={12} md={4}>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          <span
            style={{
              backgroundColor: color,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              paddingLeft: '12px',
              paddingRight: '12px',
              textOverflow: 'ellipsis',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '13px',
              alignItems: 'center',
              display: 'flex',
              width: 'fit-content',
            }}
          >
            {parseFloat(dataprogress).toFixed(2) + '%'}
          </span>
        </div>
      </Grid>
    </Grid>
  );
}

export default ProgressBar;
