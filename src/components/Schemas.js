import * as React from 'react';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';

import { useFind, useDB } from "react-pouchdb";

export default function Schemas() {
  const navigate = useNavigate();

  const schemas = useFind({
    selector: {
        '@type': { $eq: "schema" },
        name: { $gte: null },
    },
    sort: ["name"]
  });

  const db = useDB();

  const [open, setOpen] = React.useState(false);
  const [schema, setSchema] = React.useState(false);
  const [tableName, setTableName] = React.useState(false);
  const [error, showError] = React.useState("");

  const handleTextFieldChange = (e) => {
    setTableName(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    setOpen(false);
    db.post({
      "@schema": schema,
      "@type": "table",
      "name": tableName,
    }).then((doc) => {
      navigate("/grid/"+doc.id);
    }).catch((err) => {
      showError(err);
    });
  };

  return (
    <div>
      {schemas.map((doc, index) => (
      <Card sx={{ minWidth: 275 }} key={doc._id}>
        <CardContent>
          <Typography variant="h5" component="div">
            {doc.name}
          </Typography>
          <Typography variant="body2">
            {doc.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => {
            setSchema(doc._id);
            setOpen(true);
          }}>Create</Button>
        </CardActions>
      </Card>
    ))}
      <Dialog
        onClose={handleClose}
        open={open}>
        <DialogTitle>New table</DialogTitle>
          <TextField id="new-table-name" label="Name" onChange={handleTextFieldChange}/>
          <DialogActions>
            <Button autoFocus onClick={handleSubmit}>
              Create table
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );
}
