import * as React from 'react';

import Form from "@rjsf/material-ui";

import { useGet, useDB } from "react-pouchdb";

import { refreshSync } from "./Drawer";

export default function Schemas() {
  const settingsDoc = useGet({ id: "_local/settings" });
  const db = useDB();

  const handleSubmit = (e) => {
    e.formData["_id"] = "_local/settings";
    db.put(e.formData);
    refreshSync(db);
  };

  const schema = {
    "type": "object",
    "properties": {
      "remote": {
        "type": "string",
        "title": "Remote server",
      },
      "username": {
        "title": "Username",
        "type": "string"
      },
      "password": {
        "title": "Password",
        "type": "string"
      },
      "db": {
        "title": "Database name",
        "type": "string"
      },
      "https": {
        "title": "Use HTTPS",
        "type": "boolean"
      },
    },
    "required": []
  }

  const uiSchema = {
    "password": {
     "ui:widget": "password"
    }
  }

  return (
    <div>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={settingsDoc}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
