import React from 'react'
import Imagem from './../assets/ilustracao-home2.jpg'
import Button from './Button'
import { Link } from 'react-router-dom'

const Main = () => {
    return (
        <div className='main'>
            <div className="main-img">
                <img src={Imagem} alt="Ilustração: Análise de Currículos" className="main-img__tag" />
            </div>
            <div className="main-content">
                <div className="content">
                    <span className="content-paragraph">
                        A plataforma que une empresas e candidatos em um único lugar. 
                    </span>
                    <span className="content-paragraph">
                        Poste vagas, se candidate e iniciei ou participe de processos seletivos.
                    </span>
                </div>
                <div className="buttons">
                    {<Link to='/cadastro'>
                        <Button buttonClass='button button--green' buttonText='Cadastre-se' />
                    </Link>}
                </div>
            </div>
        </div>
    )
}

export default Main

