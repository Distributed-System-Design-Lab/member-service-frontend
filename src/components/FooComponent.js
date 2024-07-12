import React, { useState } from 'react';
import AppService from '../services/AppService';

const FooComponent = () => {
  const [foo, setFoo] = useState({ id: 1, name: 'sample foo' });

  const getFoo = () => {
    AppService.getResource(`http://localhost:8081/resource-server/api/foos/${foo.id}`)
      .then(response => setFoo(response.data))
      .catch(error => setFoo({ ...foo, name: 'Error' }));
  };

  return (
    <div className="container">
      <h1 className="col-sm-12">Foo Details</h1>
      <div className="col-sm-12">
        <label className="col-sm-3">ID</label> <span>{foo.id}</span>
      </div>
      <div className="col-sm-12">
        <label className="col-sm-3">Name</label> <span>{foo.name}</span>
      </div>
      <div className="col-sm-12">
        <button className="btn btn-primary" onClick={getFoo}>New Foo</button>
      </div>
    </div>
  );
};

export default FooComponent;
