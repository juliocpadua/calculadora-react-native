import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "./src/components/Button";
import Display from "./src/components/Display";
import { useState } from "react";

const data = [
  "AC",
  "/",
  "7",
  "8",
  "9",
  "*",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "=",
];

const dataOperators = ["/", "*", "-", "+", "="];

export default function App() {
  const initialState = {
    displayValue: "0",
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0,
  };

  const [state, setState] = useState({ ...initialState });

  const addDigit = (n) => {
    if (n === "." && state.displayValue.includes(".")) {
      return;
    }

    const clearDisplay = state.displayValue === "0" || state.clearDisplay;

    const currentValue = clearDisplay ? "" : state.displayValue;

    const displayValue = currentValue + n;

    const finalState = {
      displayValue: displayValue,
      clearDisplay: false,
      operation: state.operation,
      values: state.values,
      current: state.current,
    };

    setState({ ...finalState });

    if (n !== ".") {
      const newValue = parseFloat(displayValue);
      const values = [...state.values];
      values[state.current] = newValue;

      const finalState = {
        displayValue: displayValue,
        clearDisplay: false,
        operation: state.operation,
        values,
        current: state.current,
      };

      setState({ ...finalState });
    }
  };

  const clearMemory = () => setState({ ...initialState });

  const setOperation = (operation) => {
    const values = [...state.values];
    const equals = operation === "=";
    if (state.current === 0) {
      const newState = {
        displayValue: state.displayValue,
        clearDisplay: true,
        operation,
        values: state.values,
        current: 1,
      };

      setState({ ...newState });
    } else {
      try {
        values[0] = eval(`${values[0]} ${state.operation} ${values[1]}`);
      } catch (error) {
        values[0] = state.values[0];
      }

      values[1] = 0;

      setState({
        displayValue: values[0],
        clearDisplay: !equals,
        operation: equals ? null : operation,
        values,
        current: equals ? 0 : 1,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Display value={state.displayValue} />
      <SafeAreaView style={styles.buttons}>
        {data.map((e, i) => {
          if (dataOperators.includes(e)) {
            return (
              <Button
                label={e}
                operation
                onClick={() => setOperation(e)}
                key={i}
              />
            );
          } else if (e === "AC") {
            return <Button label={e} triple onClick={clearMemory} key={i} />;
          } else if (e === "0") {
            return (
              <Button label={e} double onClick={() => addDigit(e)} key={i} />
            );
          } else {
            return <Button label={e} onClick={() => addDigit(e)} key={i} />;
          }
        })}
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
