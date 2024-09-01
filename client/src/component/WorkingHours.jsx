import React from 'react';
// import './Information.css';

const WorkingHours = () => {
    return (
        <div className="" >
            <div className="">
                <button className="close-button">
                    Information
                </button>
                <div className='modal-content'>
                    <h3 className="title">Working Hours</h3>
                    <div className='hours-list'>
                        <div className='hours-item'>
                            <h2 className='day'>Sunday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                        <div className='hours-item'>
                            <h2 className='day'>Monday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                        <div className='hours-item'>
                            <h2 className='day'>Tuesday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                        <div className='hours-item'>
                            <h2 className='day'>Wednesday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                        <div className='hours-item'>
                            <h2 className='day'>Thursday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                        <div className='hours-item'>
                            <h2 className='day'>Friday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                        <div className='hours-item'>
                            <h2 className='day'>Saturday</h2>
                            <p className='time'>15:45 - 01:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkingHours;
