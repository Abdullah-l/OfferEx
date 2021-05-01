import React from 'react'
import {Icon} from 'antd';

function Footer() {
    var d = new Date();
    return (
        <div style={{
            marginTop: '10px', height: '60px', textAlign: 'center', alignItems: 'center',
            justifyContent: 'center', fontSize:'1rem'
        }}>
           <p> Copyright <Icon type="copyright" /> {d.getFullYear()} OfferEx. All Rights Reserved.<br/>
           Abdullah Almanie - CMPT 390 Senior Project.</p>
        </div>
    )
}

export default Footer
