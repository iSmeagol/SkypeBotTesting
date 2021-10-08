import React from 'react';

export default NotFound = (props) => {
    switch (props.type) {
        default:
            return (
                <div>
                    <div className='text-center'>
                        <img src='/images/not-found.png' alt='not foun' title='Icons made by Smashicons from www.flaticon.com is licensed by CC 3.0 BY' />
                        <h1>Oops!</h1>
                        <h2>404 Not Found</h2>
                        <h6>The page you are looking for might have been removed, had its name changed,<br />or unavailable.</h6>
                        <button className='btn btn-primary' onClick={() => {
                            props.history.replace('/');
                        }}>
                            <i className='fa fa-home' aria-hidden='true' /> Take Me Home
                        </button>
                    </div>
                </div>
            );
    }
}