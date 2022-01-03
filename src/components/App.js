import React, { Suspense, } from "react";
import { PouchDB as ReactPouchDB } from "react-pouchdb";
import PersistentDrawerLeft from './Drawer'

import PouchDB, { debug } from 'pouchdb';
import LocalStoragePouchPlugin from 'pouchdb-adapter-localstorage';
PouchDB.plugin(LocalStoragePouchPlugin);

import debugPouch from "pouchdb-debug";
debugPouch(PouchDB)
PouchDB.debug.enable('*');

function App() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <ReactPouchDB name="ignatus">
          <Suspense fallback={<div>Loading... </div>}>
            <PersistentDrawerLeft />
          </Suspense>
        </ReactPouchDB>
      </div>
    </div>
  )
}

export default App
