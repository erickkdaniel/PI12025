import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/login';
import Sidebar from './componentes/sideBar';
import Postear from './componentes/postear';
import PostList from './componentes/postList';
import Registro from './componentes/registro';
import Pass from './componentes/pass';
import React from 'react';

function Layout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Bienvenido a la aplicación</h1>
      <p>Selecciona una opción en el menú lateral.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/pass" element={<Pass />} />

        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/postear"
          element={
            <Layout>
              <Postear />
            </Layout>
          }
        />
        <Route
          path="/postList"
          element={
            <Layout>
              <PostList />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;