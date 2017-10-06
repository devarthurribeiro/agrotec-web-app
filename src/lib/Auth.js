import firebase, { provider } from '../api';

class Auth {
  constructor() {
  }
  async signup(newUser) {
    try {
      const user = await firebase.auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

      user.sendEmailVerification();

      const r = await firebase.database().ref(`users/${user.uid}`).set({
        createAt: (new Date()).toISOString()
      });

      return { error: false, data: r };
    } catch (error) {
      console.log(error);
      return { error: true, msg: this.getErrorMsg(error) };
    }
  }
  async login(email, pass) {
    try {
      const userData = await firebase.auth()
      .signInWithEmailAndPassword(email, pass);
      return { error: false, user: userData };
    } catch (error) {
      return { error: true, msg: this.getErrorMsg(error) };
    }
  }
  async loginWithFacebook(email, pass) {
    try {
      const { user } = await firebase.auth().signInWithPopup(provider)
      console.log(user);
      firebase.database().ref(`users/${user.uid}`).set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      })
      return { error: false, user };
    } catch (error) {
      return { error: true, msg: this.getErrorMsg(error) };
    }
  }
  async logout() {
    try {
      await firebase.auth().signOut();
      return { error: false };
    } catch (error) {
      return { error: true, msg: this.getErrorMsg(error) };
    }
  }
  async resetPassword(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return { error: false, msg: `Foi enviado um email de recuperação para ${email}` };
    } catch (error) {
      return { error: true, msg: this.getErrorMsg(error) };
    }
  }
  async updatePassword(newPassword) {
    try {
      const r = await this.user.updatePassword(newPassword);
      return { error: false, data: r };
    } catch (e) {
      return { error: true, data: e };
    }
  }
  async updateEmail(newEmail) {
    try {
      const r = await this.user.updateEmail(newEmail);
      console.log(r);
      return { error: false, data: r };
    } catch (e) {
      return { error: true, data: e };
    }
  }
  async deleteAccount() {
    try {
      const r = await this.user.delete();
      return { error: false, data: r };
    } catch (e) {
      return { error: true, data: e };
    }
  }
  getErrorMsg(error) {
    let msg = '';
    if (error === 'You must include credentials to use this auth method.') {
      msg = 'Informe o Usuário e Senha de acesso';
    } else {
      switch (error.code) {
        case 'auth/user-not-found':
        msg = 'Nenhum usuário encontrado para esse email e senha';
        break;
        case 'auth/invalid-email':
        msg = 'E-mail inválido';
        break;
        case 'auth/weak-password':
        msg = 'Senha deve ter no mínimo 6 caracteres';
        break;
        case 'auth/wrong-password':
        msg = 'Senha incorreta';
        break;
        case 'auth/email-already-in-use':
        msg = 'E-mail em uso por outro usuário';
        break;
        case 'auth/timeout':
        msg = 'Tempo de conexão com servidor expirou, tente novamente';
        break;
        default:
        msg = 'Algo de errado aconteceu';
        break;
      }
    }
    return msg;
  }
  getTokens(userData, token) {
    return userData.push_tokens.concat([token].filter(item => userData.push_tokens.indexOf(item) < 0));
  }
  async updatePushToken(token) {
    const REF = `users/${this.user.uid}`;
    firebase.database().ref(REF).on('value', (snapshot) => {
      const userData = { ...snapshot.val() };

      userData.push_tokens = userData.push_tokens ? userData.push_tokens : [];
      const tokens = this.getTokens(userData, token);

      firebase.database().ref(REF).update({
        push_tokens: tokens,
      });
    });
  }
}

export default new Auth();
