import React from 'react'
import 'style/styles.scss'
import Logo from 'img/logo.png'

const MyComponent = () => (
    <div className="Component">
        <h1>Hello from My Component!</h1>
        <img src={Logo} alt="logo" />
    </div>
)

export default MyComponent
