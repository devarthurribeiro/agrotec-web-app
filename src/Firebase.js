import React, { Component } from 'react';
import firebase from './api';

class Firebase extends Component{
  constructor(props) {
    super(props);

    const { chield } = this.props;
    this.ref = firebase.database().ref(chield);

    this.state = {
      data: [],
      loading: true,
    }
  }
  componentWillMount() {
    const { method } = this.props;
    this.ref.on('value', (snapshot) => {
      var data = [];

      if (method === "single") {
        data =  { ...snapshot.val(), key: snapshot.key };
      }else {
        snapshot.forEach((item) => {
          const obj = { ...item.val(), key: item.key };
          data.push(obj);
        });
      }

      this.setState({
        data: data,
        loading: false,
      });

    });
  }
  componentWillUnmount() {
    this.ref.off();
  }
  render() {
    if (!this.props.children) {
      return null
    }
    return (
      this.props.children({
        data: this.state.data,
        loading: this.state.loading,
      }) || null
    )
  }
}

export default Firebase;
