import Fischl from './Fischl.png';
import './App.css';

import PageRouter from './router';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={Fischl} className="App-logo" alt="logo" />
                <PageRouter />
            </header>
        </div>
    );
}

export default App;
