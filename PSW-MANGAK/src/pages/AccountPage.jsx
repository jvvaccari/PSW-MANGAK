import React, { useState } from 'react';
import AccountDialog from './AccountDialog';
import EditProfileDialog from './EditProfileDialog';

export default function AccountPage() {
  const [isAccountDialogOpen, setAccountDialogOpen] = useState(true);
  const [isEditProfileDialogOpen, setEditProfileDialogOpen] = useState(false);

  const handleOpenEditProfile = () => {
    setAccountDialogOpen(false); // Close AccountDialog
    setEditProfileDialogOpen(true); // Open EditProfileDialog
  };

  const handleCloseEditProfile = () => {
    setEditProfileDialogOpen(false); // Close EditProfileDialog
  };

  const handleCloseAccountDialog = () => {
    setAccountDialogOpen(false);
  };

  return (
    <>
      {/* Account Dialog */}
      <AccountDialog
        open={isAccountDialogOpen}
        onClose={handleCloseAccountDialog}
        onEditProfile={handleOpenEditProfile} // Pass the handler to open EditProfileDialog
      />

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditProfileDialogOpen}
        onClose={handleCloseEditProfile}
      />
    </>
  );
}
