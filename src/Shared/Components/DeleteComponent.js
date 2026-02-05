import { Dialog, DialogContent, DialogActions, Typography, Button, Box, CircularProgress } from '@mui/material';

export default function DeleteComponent({ open, onCancel, onConfirm, message, confirmText = 'Confirmar',
    cancelText = 'Cancelar', confirmColor = 'error', loading= false }) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{
                sx: { borderRadius: 3, p: 2, minWidth: 350 }
            }}
        >
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    gap={2}
                >
                    <Typography variant="subtitle1">
                        {message}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pt: 1 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="inherit"
                    sx={{ minWidth: 100 }}
                    disabled={loading}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    sx={{ minWidth: 100, position: 'relative' }}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        confirmText
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
