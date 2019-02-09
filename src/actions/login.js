import {userRef, auth} from '../firebase';

export const createUser = (email,password) => async dispatch => { 
                   
    auth.createUserWithEmailAndPassword(email,password)
    .then(()=>{
        auth.signInWithEmailAndPassword(email,password)
    })
    .then(()=>{
        let curr = auth.currentUser;
        userRef.child(curr.uid).set({
            email:email,
            username:email.split("@")[0],
            uid:curr.uid,
        })
        dispatch({            
            type:'CURRENT-USER',
            payload:[{
                uid:curr.uid,
            },true]
        })
        
    }).then(()=>{
        let curr = auth.currentUser;
        dispatch({
            type:'USER-INFO',
            payload:{
                email:email,
                username:email.split("@")[0],
                uid:curr.uid,
            }
        })        
    })
    .catch(() =>{
        console.log('create error');
    });
}

export const signInUser = (email,password) => async dispatch => {

    auth.signInWithEmailAndPassword(email, password)
    .then(()=>{
        userRef.child(auth.currentUser.uid).once("value")
    .then((snap)=>{
        dispatch({            
            type:'USER-INFO',
            payload:snap.val()
        })    
        
    })
    .then(()=>{
        let curr = auth.currentUser;
        dispatch({
            type:'CURRENT-USER',
            payload:[{uid:curr.uid},true]
        })
    }) 
    }).catch(() =>{
        console.log('Signin error');
    });
}

export const signOutUser = () => async dispatch => {
    auth.signOut().then(()=>{
        dispatch({
            type:'CURRENT-USER',
            payload:[{},false],
        })
    })
    .catch(() =>{
        console.log('Signout Error');
    });
}