import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    /**MUTATE THE BALANCE PROPERTY INSTEAD OF RETURNING A NEW OBJECT */
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        /**NO NEED TO MODIFY ANYTHING */
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.loanPurpose;
        state.balance = state.balance + action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

// Construct the complete URL with dynamic values

export function deposit(amount, currency) {
  if (currency === "USD") {
    return { type: "account/deposit", payload: amount };
  }

  /**RETURN MIDDLE-WARE FUNCTION */
  return async function (dispatch, currrentState) {
    dispatch({ type: "account/convertingCurrency" });

    // const res = await fetch(apiUrl);
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    console.log("RECIEVED DATA-->", data);

    dispatch({ type: "account/deposit", payload: data.rates.USD });
  };
}

export default accountSlice.reducer;
