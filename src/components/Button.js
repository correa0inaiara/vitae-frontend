import React from 'react'

const Button = ({buttonType, buttonClass, buttonText, onClick}) => {
    return (
        onClick ? 
            <button onClick={onclick} type={buttonType ? buttonType : 'button'} className={`button ${buttonClass}`}>{buttonText}</button> :
            <button type={buttonType ? buttonType : 'button'} className={`button ${buttonClass}`}>{buttonText}</button>

    )
}

export default Button;