import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	mode: "light",
	user: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setMode: (state) => {
			state.mode = state.mode === "light" ? "forest" : "light";
		},
		setUser: (state, action) => {
			if (action.payload) {
				state.user = {
					uid: action.payload.uid,
					email: action.payload.email,
					displayName: action.payload.displayName,
					photoURL: action.payload.photoURL,
					role: action.payload.role,
					// Add other necessary properties here
				};
			} else {
				state.user = null;
			}
		},
	},
});

export const { setMode, setUser } = authSlice.actions;
const reduce = authSlice.reducer;
export default reduce;