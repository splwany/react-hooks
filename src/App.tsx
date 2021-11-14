import { FC, ReactElement } from 'react';
import './App.css';
import ImageStitcher from './components/ImageStitcher';

const App: FC = (): ReactElement => (
    <div className="app">
        <ImageStitcher />
    </div>
);

export default App;
