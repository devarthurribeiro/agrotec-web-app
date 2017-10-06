import React, { Component } from 'react';
import logo from './logo.svg';

import Auth from './lib/Auth';
import firebase from './api';

import Firebase from './Firebase';

const Header = () => (
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1 className="App-title">Agrotec - Minicurso React Native</h1>
  </header>
)

const LoginButton = (props) => (
  <button className="btn" {...props}>
    {props.children}
  </button>
)

const Card = (props) => (
  <div className="card">
    <div className="center">
      <img src={props.user.photoURL} className="avatar" alt=""/>
    </div>
    <div className="profile">
      <h4>{props.user.displayName}</h4>
      <span>{props.user.email}</span>
    </div>
  </div>
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {user: false}
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.props.history.push('/')
      }else {
        this.setState({user})
      }
    });
  }
  login = () => {
    Auth.loginWithFacebook()
  }
  render() {
    return (
      <div className="App">
        <Header />
        <div className="center">
          { !this.state.user &&
            <LoginButton onClick={this.login}>
              Entrar com Facebook
            </LoginButton>
          }
          { this.state.user &&
            <h6>{this.state.user.uid}</h6>
          }
        </div>
        { true &&
          <div>
            <Firebase chield="users">
              {({data}) => {
                return <div className="container">
                  {
                    data.map((item) => (
                      <Card key={item.id} user={item} />
                    ))
                  }
                </div>
              }}
            </Firebase>
          </div>
        }
        <div>
          <Firebase chield="links">
            {({data}) => {
              return <div className="container">
                {
                  data.map((item) => (
                    <ul>
                      <li>
                        <ul>
                          <a href={item.link} target="_blank">
                            {item.nome}
                          </a>
                        </ul>
                      </li>
                    </ul>
                  ))
                }
              </div>
            }}
          </Firebase>
        </div>
      </div>
    );
  }
}

export default App;
