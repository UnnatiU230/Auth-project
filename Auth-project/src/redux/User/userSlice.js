import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser:null,
    loading:false,
    error:false,
};

const userSlice = createSlice({
    name:'user',
    initialState,
     reducers:{
        signInstart:(state) =>{
            state.loading = true;
        },
        signInsuccess:(state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = action.payload;
        },
        signInfailure:(state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) =>{
            state.loading = true;
        },
        updateUserSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserfailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

         deleteUserStart: (state) =>{
             state.loading = true;
         },
        deleteUserSuccess: (state)=>{
            state.currentUser = null;
            state.loading = false;
             state.error = false;
     },
        deleteUserfailure: (state, action)=>{
            state.loading = false;
          state.error = action.payload;
},
          signOut:(state)=>{
            state.currentUser= null;
            state.loading = false;
             state.error = false;
          }  

     }
});

export const {signInstart, signInsuccess, signInfailure, updateUserStart, updateUserfailure,  updateUserSuccess, deleteUserStart, deleteUserfailure, deleteUserSuccess, signOut } = userSlice.actions;
export default userSlice.reducer;