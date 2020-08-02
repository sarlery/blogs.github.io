import React from 'react';
import { hot } from 'react-hot-loader';
import './index.sass'

function App () {
    function handleClick(){
        import('./Hello').then(c => {
            // 
            console.log(c.default);
        });
    }
    return (
        <div>
            <button onClick={ handleClick }>Click</button>
        </div>
    )
}

export default hot(module)(App);