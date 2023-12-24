import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import PublicLinkGroup from "./PublicLinkGroup";
import Layout from "./components/Layout";
import Dashboard from "./dashboard/Dashboard";
import EditLinkGroup from "./dashboard/EditLinkGroup";


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}  />
          <Route path="/login" element={<Login/>}  />
          <Route path="/register" element={<Register/>}  />
          <Route path="/r/:unique_string" element={<PublicLinkGroup/>}  />
          <Route
          path="/dashboard/*"
          element={
            <Layout>
              <Routes>
                  <Route index element={<Dashboard/>} />
                  <Route path=":id/edit" element={<EditLinkGroup/>} />
              </Routes>
            </Layout>
          }
          />
        </Routes>
    </Router>
  );
}

export default App;
