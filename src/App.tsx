import { FC, ReactElement } from 'react';
import './App.css';
// import ImageStitcher from './components/ImageStitcher';
import { TodoWithInit } from './components/Todo';

const App: FC = (): ReactElement => (
    <div className="app">
        {/* <ImageStitcher /> */}
        <TodoWithInit />
    </div>
);

export default App;
