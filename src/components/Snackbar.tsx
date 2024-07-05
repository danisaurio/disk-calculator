import { Snackbar, Alert } from "@mui/material"

const SuccessSnackbar = ({open, handleClose}:{open: boolean, handleClose: ()=>void}) => {
  return (
    <Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        Saved!
      </Alert>
    </Snackbar>
  )
}

export default SuccessSnackbar;