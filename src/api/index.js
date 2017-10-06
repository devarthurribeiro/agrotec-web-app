import fb from "firebase";

const config = {
  apiKey: "AIzaSyAr9-0wUlCwY3QJGhrh6p0rwrV4aNLEsRI",
  authDomain: "agrotec-tec.firebaseapp.com",
  databaseURL: "https://agrotec-tec.firebaseio.com",
  projectId: "agrotec-tec",
  storageBucket: "",
  messagingSenderId: "850608812605"
};

var provider = new fb.auth.FacebookAuthProvider();

provider.setCustomParameters({
  'display': 'popup'
});
const fbI = fb.initializeApp(config);
export {fbI as default, provider}  
