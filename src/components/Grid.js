import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFind, useDB } from "react-pouchdb";
import { DataGrid, GridActionsCellItem, useGridApiRef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditDialog from "./EditDialog"
import "./style.css";

function Grid() {
  const [open, setOpen] = React.useState(false);
  const params = useParams();

  const [initialData, setInitialData] = React.useState({});
  const [columns, setColumns] = React.useState([]);
  const [tableID, setTableID] = React.useState("");
  const [jsonSchema, setJsonSchema] = React.useState({});
  const [uiSchema, setUiSchema] = React.useState({});

  const db = useDB();

  useEffect(() => {
    if (params.tableID == tableID) {
      return;
    }
  
    db.get(params.tableID).then(function (table) {
      db.get(table["@schema"]).then(function (schema) {
        var schemaColumns = [ {
          field: '_id',
          headerName: 'ID',
          width: 90,
          hide: true,
          headerClassName: 'super-app-theme--header',
        } ];
        Object.keys(schema.schema.properties).map(key => {
          var prop = schema.schema.properties[key];
          schemaColumns.push({
            field: key,
            headerName: prop.title || key,
            type: prop.type || "string",
            width: 150,
            editable: true,
          });
        })
        schemaColumns.push({
          field: 'actions',
          type: 'actions',
          headerName: '',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={editRow(params)}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={deleteRow(params)}
            />
          ],
        })
        setTableID(params.tableID);
        setColumns(schemaColumns);
        setJsonSchema(schema.schema);
        setUiSchema(schema.uischema);
      })
    }).catch(function (err) {
      console.log(err);
    });  
  });
  
  const apiRef = useGridApiRef();

  const docs = useFind({
    selector: {
      '@type': { $eq: "entry" },
      '@table': params.tableID,
      name: { $gte: null }
    },
    sort: ["name"]
  });

  const handleGetRowId = (doc) => {
    return doc._id
  }

  const deleteRow = useCallback(
    (params) => () => {
      setTimeout(() => {
        db.remove(params.row);
      });
    },
    [],
  );

  const editRow = useCallback(
    (data) => () => {
      setTimeout(() => {
        setInitialData(data.row);
        setOpen(true);
      });
    },
    [],
  );

  const createDoc = () => {
    setInitialData({});
    setOpen(true)
  };

  const handleCellEditCommit = useCallback(
    (params) => {
      db.get(params.id).then(function(doc) {
        doc[params.field] = params.value;
        return db.put(doc);
      })
    },
    [],
  );

  const handleRowDoubleClick = useCallback(
    (params) => {
      db.get(params.id).then(function(doc) {
        console.log(doc);
      })
    },
    [],
  );

  const setData = (data) => {
    if (JSON.stringify(initialData) === JSON.stringify({})) {
      data["@type"] = "entry";
      data["@table"] = params.tableID;
      db.post(data);
    } else {
      db.put(data);
    }
  };

  /*
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 90,
      hide: true
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      editable: true,
    },
  ];
  */

  const fabStyle = {
    position: 'absolute',
    bottom: 48,
    right: 16,
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          apiRef={apiRef}
          rows={docs}
          columns={columns}
          getRowId={handleGetRowId}
          onCellEditCommit={handleCellEditCommit}
          onRowDoubleClick={handleRowDoubleClick}
        />
        <Fab sx={fabStyle} color="primary" aria-label="add" onClick={createDoc}>
          <AddIcon />
        </Fab>
        <EditDialog
          open={open}
          setOpen={setOpen}
          schema={jsonSchema}
          uiSchema={uiSchema}
          initialData={initialData}
          setData={setData}
        />
      </div>
    </div>
  );
}

export default Grid
