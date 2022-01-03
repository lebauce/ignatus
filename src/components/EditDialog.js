import React from "react";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import Form from "@rjsf/material-ui";

function EditDialog(props) {
    const { open, setOpen, initialData, setData, schema, uiSchema } = props;

    const handleClose = () => {
      setOpen(false);
    };

    const handleSubmit = (e) => {
      setOpen(false);
      setData(e.formData);
    };

    return (
        <Dialog
          onClose={handleClose}
          open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
            />
        </Dialog>
    );
}

export default EditDialog
