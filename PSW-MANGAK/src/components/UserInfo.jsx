import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import styles from './styles';

function UserInfo({ username, email }) {
  return (
    <Box display="flex" alignItems="center" py={1} px={2} bgcolor={styles.bgDataColor} borderRadius={1} mx={2}>
      <Avatar style={{ backgroundColor: styles.bgColor, width: 36, height: 36, marginRight: 8 }}>
        <AccountCircle fontSize="small" style={{ color: styles.textColor }} />
      </Avatar>
      <Box>
        <Typography variant="h6" style={{ fontFamily: styles.titleFont, fontSize: '14px' }}>
          {username}
        </Typography>
        <Typography variant="body2" style={{ fontSize: '12px', color: styles.textColor }}>
          {email}
        </Typography>
      </Box>
    </Box>
  );
}

UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default UserInfo;
