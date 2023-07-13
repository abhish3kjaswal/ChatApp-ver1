import spinner from './spinner.gif'

import React from 'react';

export default () => (
    <div>
        <img
            src={spinner}
            style={{ width: '30px', margin: 'auto', display: 'block' }}
            alt='Loading...'
        />
    </div>
)