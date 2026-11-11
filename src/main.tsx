import React from 'react';
import {createRoot} from 'react-dom/client';
import MathsBook from './MathsBook';
import './base.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><MathsBook/></React.StrictMode>);
