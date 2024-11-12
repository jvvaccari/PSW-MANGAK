import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import styles from './styles';

function AccountButton({ label, className }) {
  return (
    <Button
      fullWidth
      variant="contained"
      className={className}
      style={{
        backgroundColor: styles.bgDataColor,
        color: styles.textColor,
        fontFamily: styles.bodyFont,
        fontSize: '12px',
        justifyContent: 'space-between',
      }}
      endIcon={<ArrowForwardIos style={{ fontSize: '14px', color: styles.textColor }} />}
    >
      {label}
    </Button>
  );
}

AccountButton.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

AccountButton.defaultProps = {
  className: '',
};

export default AccountButton;
